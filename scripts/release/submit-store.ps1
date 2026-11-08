
# san Store 提交(自 ggcode submit-store.ps1 移植,10 轮踩坑注释原样保留:
# priceId=Free / deviceFamilies 初始化 / commit 空 JSON body / 挂起 draft 恢复)。
param(
  [Parameter(Mandatory=$true)][string]$TenantId,
  [Parameter(Mandatory=$true)][string]$ClientId,
  [Parameter(Mandatory=$true)][string]$ClientSecret,
  [Parameter(Mandatory=$true)][string]$ProductId,
  [string]$PackageDir,
  [string]$ReleaseNotes = "",
  [string]$ResumeSubmissionId = ""
)

$ErrorActionPreference = "Stop"
$api = "https://manage.devcenter.microsoft.com"

if (-not $PackageDir) { $PackageDir = (Get-Location).Path }
$msixFiles = Get-ChildItem (Join-Path $PackageDir "*.msix") -ErrorAction SilentlyContinue
if (-not $msixFiles -or $msixFiles.Count -eq 0) { throw "no .msix files found in $PackageDir" }

$tokenResp = Invoke-RestMethod -Method Post -Uri "https://login.microsoftonline.com/$TenantId/oauth2/v2.0/token" -Body @{
  grant_type = "client_credentials"; client_id = $ClientId
  client_secret = $ClientSecret
  scope = "$api/.default"
} -ContentType "application/x-www-form-urlencoded"
$hdr = @{ Authorization = "Bearer $($tokenResp.access_token)" }
Write-Host "token acquired (expires in $($tokenResp.expires_in)s)"

$app = Invoke-RestMethod -Method Get -Headers $hdr -Uri "$api/v1.0/my/applications/$ProductId"
Write-Host "app: $($app.primaryName) (id=$($app.id))"

# If a submission is already in flight, resume it instead of creating a new
# one (the Ingestion API rejects creating on top of an in-flight submission).
# Resuming makes reruns idempotent: a draft left dangling by an earlier failed
# step (e.g. the pre-#5048 Invoke-AzUpload crash) gets its package uploaded and
# committed instead of blocking every future run until 30-day expiry.
if ($ResumeSubmissionId) {
  $subId = $ResumeSubmissionId
  Write-Host "resuming explicit submission $subId (-ResumeSubmissionId)"
  $sub = Invoke-RestMethod -Method Get -Headers $hdr -Uri "$api/v1.0/my/applications/$ProductId/submissions/$subId"
} elseif ($app.pendingApplicationSubmission -or $app.inFlightSubmissionId) {
  # 2026-11-08 san 规则:存在在审/待处理 submission 时跳过版本发布(exit 0),
  # 不动在审提交(首提 Certification 期间干扰会弄脏它)。FORCE_RESUME=1 可
  # 强制走原 resume 流程(用于接手上次失败遗留的 draft)。
  $blocker = if ($app.pendingApplicationSubmission) { $app.pendingApplicationSubmission.id } else { $app.inFlightSubmissionId }
  if ($env:FORCE_RESUME -eq "1") {
    $subId = $blocker
    Write-Host "FORCE_RESUME=1: resuming submission $subId"
    $sub = Invoke-RestMethod -Method Get -Headers $hdr -Uri "$api/v1.0/my/applications/$ProductId/submissions/$subId"
  } else {
    Write-Host "SKIP_STORE_SUBMIT: submission $blocker already in flight/pending; "
    Write-Host "not touching it (re-run with FORCE_RESUME=1 to resume a stale draft)"
    exit 0
  }
} else {
  # Create-submission takes no request body; a non-empty JSON body would be
  # parsed as a draft submission and rejected ("The size of Listings must be
  # 1 or more"). PS 7 keeps the explicit JSON content-type on a bodyless POST.
  # On Conflict (a draft exists that GET application did not surface via
  # inFlightSubmissionId) there is nothing to recover the id from, so surface
  # the app JSON to make diagnosis possible and fail loudly.
  try {
    $sub = Invoke-RestMethod -Method Post -Headers $hdr -Uri "$api/v1.0/my/applications/$ProductId/submissions" -ContentType "application/json"
  } catch {
    Write-Host "create-submission failed; app JSON for diagnosis:"
    $app | ConvertTo-Json -Depth 8 | Write-Host
    throw
  }
  $subId = $sub.id
  Write-Host "submission created: $subId (state=$($sub.status))"
}

$zipPath = Join-Path $env:TEMP "store-sub-$subId.zip"
Compress-Archive -Path ($msixFiles.FullName) -DestinationPath $zipPath -Force
$az = $sub.fileUploadUrl
# Upload via plain Azure Blob REST PUT against the submission's SAS URL —
# no Az PowerShell module (the old Invoke-AzUpload call never existed and
# crashed the run after the submission draft was created).
Invoke-RestMethod -Method Put -Uri $az -Headers @{ "x-ms-blob-type" = "BlockBlob" } `
  -InFile $zipPath -ContentType "application/zip"
Write-Host "packages uploaded ($($msixFiles.Count) msix, $((Get-Item $zipPath).Length) bytes zipped)"

if ($ReleaseNotes) {
  $sub | Add-Member -NotePropertyName releaseNotes -NotePropertyValue $ReleaseNotes -Force
}
# Draft submissions created via the API can carry placeholder market pricing
# (priceId "Base"), which the Ingestion API rejects on PUT ("'Base' is not a
# valid PriceId for base price."). Normalize to the Free tier ("0") before
# round-tripping the submission body.
#
# Round 9 (runs 41954855268/41958211337): three shape assumptions in a row
# (flattened listing -> market map -> baseListing nesting) each missed, and the
# round-8 log probe ("normalizing priceId" never printed) proved the loop body
# never executed - so the shape is none of the three. Stop guessing: dump the
# raw listings subtree (evidence for THIS run's log) and normalize recursively,
# shape-agnostic: walk every object/array node under listings and rewrite any
# string priceId that is not "0". Covers object-map AND array marketPricings,
# baseListing nesting, and any future depth change.
$rawShape = ($sub.listings | ConvertTo-Json -Depth 12 -Compress)
if ($rawShape.Length -gt 4000) { $rawShape = $rawShape.Substring(0, 4000) + "...(truncated)" }
Write-Host "listings shape (raw, pre-normalize): $rawShape"
# Round 10 (run 41971159695): listings dump proved listings carries NO priceId
# at all ("0 fix(es) applied") while the API error targets "pricing" - the
# offending "Base" priceId lives in the submission-level pricing subtree
# (sibling of listings), which rounds 1-9 never touched. Dump pricing too and
# normalize the WHOLE submission object so the offender is caught wherever it
# sits (pricing, listings, or any future sibling).
$pricingShape = ($sub.pricing | ConvertTo-Json -Depth 12 -Compress)
if (-not $pricingShape) { $pricingShape = "<absent>" }
if ($pricingShape.Length -gt 2000) { $pricingShape = $pricingShape.Substring(0, 2000) + "...(truncated)" }
Write-Host "pricing shape (raw, pre-normalize): $pricingShape"
# Evidence chain (runs 41947777908..41982183318):
# - '0' rejected: "'0' is not a valid 'PriceId' value" (41978717488)
# - 'Base' rejected: "'Base' is not a valid PriceId for base price"
#   (41982183318) - 'Base' is Partner Center labeling that GET returns
#   verbatim, not an Ingestion API price tier.
# - MS docs (MSIX schedule-pricing-changes): "You can set the Base price
#   to Free, or you can choose an available price tier" - the free tier's
#   API identifier is 'Free'.
$sub.pricing.priceId = "Free"
Write-Host "priceId set to 'Free' (original visible in the raw shape line above)"

# Run 41989824196: with priceId settled ('Free' accepted), the API moved to
# the next gap: "AllowTargetFutureDeviceFamilies needs to be initialized
# for all supported platform, [Desktop, Mobile, Xbox, Holographic]".
# The GET body omits/nulls the field; the PUT requires all four platforms
# explicit. Standard desktop distribution: Desktop true, the rest false.
$devFamOrig = ($sub.allowTargetFutureDeviceFamilies | ConvertTo-Json -Compress -Depth 4)
Write-Host "allowTargetFutureDeviceFamilies (raw): $devFamOrig"
$sub.allowTargetFutureDeviceFamilies = [PSCustomObject]@{
  Desktop     = $true
  Mobile      = $false
  Xbox        = $false
  Holographic = $false
}
Write-Host "allowTargetFutureDeviceFamilies initialized (Desktop=true, others=false)"
$null = Invoke-RestMethod -Method Put -Headers $hdr `
  -Uri "$api/v1.0/my/applications/$ProductId/submissions/$subId" `
  -ContentType "application/json" -Body ($sub | ConvertTo-Json -Depth 32)
Write-Host "submission body updated"

# Run 41992932188: commit POST without a body let PowerShell send a
# form content type -> "Only JSON content is accepted" (target=mediaType).
# Send an explicit empty JSON document with the JSON content type.
$null = Invoke-RestMethod -Method Post -Headers $hdr `
  -Uri "$api/v1.0/my/applications/$ProductId/submissions/$subId/commit" `
  -ContentType "application/json" -Body "{}"
Write-Host "committed; polling status..."

$deadline = (Get-Date).AddMinutes(10)
do {
  Start-Sleep -Seconds 30
  $st = Invoke-RestMethod -Method Get -Headers $hdr `
    -Uri "$api/v1.0/my/applications/$ProductId/submissions/$subId/status"
  Write-Host "status: $($st.status) / step: $($st.status.additionalDetails) errors=$($st.status.errors.Count)"
  if ($st.status -eq "CommitFailed") { throw "commit failed: $($st | ConvertTo-Json -Depth 8)" }
} while ($st.status -in @("PendingCommit","CommitStarted") -and (Get-Date) -lt $deadline)
Write-Host "=== submission $subId handed off (status $($st.status)) ==="

function Invoke-AzUpload([string]$SasUri, [string]$FilePath) {

  $bytes = [System.IO.File]::ReadAllBytes($FilePath)
  Invoke-RestMethod -Method Put -Uri $SasUri -Body $bytes -ContentType "application/zip" -Headers @{ "x-ms-blob-type" = "BlockBlob" }
}
