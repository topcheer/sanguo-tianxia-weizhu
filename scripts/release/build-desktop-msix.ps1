param(
  [Parameter(Mandatory=$true)][string]$Version,
  [Parameter(Mandatory=$true)][string]$OutputDir,
  [Parameter(Mandatory=$true)][string]$IdentityName,
  [Parameter(Mandatory=$true)][string]$Publisher,
  [string]$Archs = "x64"
)

# san Electron 桌面 MSIX 构建(ggcode build-desktop-msix.ps1 配方移植,Electron 适配):
# web bundle → electron-builder --win --dir(win-unpacked)→ stage 目录(整个 unpacked
# + Assets 商店图标 + AppxManifest.xml)→ makeappx 打包为未签名 .msix。
# 故意不签名:Partner Center 摄取时重签,提交无需开发者签名(ggcode 验收结论)。
$ErrorActionPreference = "Stop"

$RootDir = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$ManifestTemplate = Join-Path $RootDir ".github\packaging\windows\san-desktop-msix.appxmanifest"
$IconSrc = Join-Path $RootDir "assets\icons\icon-512.png"
$PackageVersion = $Version.TrimStart("v")
$AbsOutputDir = if ([System.IO.Path]::IsPathRooted($OutputDir)) { $OutputDir } else { Join-Path $pwd $OutputDir }
New-Item -ItemType Directory -Force -Path $AbsOutputDir | Out-Null

if ($PackageVersion -notmatch '^\d+\.\d+\.\d+\.\d+$') {
  throw "MSIX Version must be four-part (e.g. 1.0.4.0), got: $PackageVersion"
}

$makeappx = Get-ChildItem "${env:ProgramFiles(x86)}\Windows Kits\10\bin\*\x64\makeappx.exe" -ErrorAction SilentlyContinue |
  Sort-Object FullName -Descending | Select-Object -First 1 -ExpandProperty FullName
if (-not $makeappx) { throw "makeappx.exe not found (Windows SDK required)" }
Write-Host "Using makeappx: $makeappx"

Add-Type -AssemblyName System.Drawing

function New-StoreAsset([System.Drawing.Bitmap]$src, [string]$path, [int]$w, [int]$h) {
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($src, 0, 0, $w, $h)
  $g.Dispose()
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

# 1) web bundle + electron-builder unpacked(Electron 单架构 x64;arm64 Electron 支持有限,先 x64)
Write-Host "=== Building web bundle + win-unpacked ==="
Push-Location $RootDir
try {
  npm ci
  if ($LASTEXITCODE -ne 0) { throw "npm ci (web) failed" }
  npm run build
  if ($LASTEXITCODE -ne 0) { throw "web build failed" }
} finally { Pop-Location }

Push-Location (Join-Path $RootDir "desktop")
try {
  npm ci
  if ($LASTEXITCODE -ne 0) { throw "npm ci (desktop) failed" }
  npx electron-builder --win --x64 --dir --publish never
  if ($LASTEXITCODE -ne 0) { throw "electron-builder failed" }
} finally { Pop-Location }

$unpacked = Join-Path $RootDir "desktop\release\win-unpacked"
$exe = Join-Path $unpacked "sanguo-weizhu.exe"
if (-not (Test-Path $exe)) { throw "win-unpacked exe missing: $exe" }

foreach ($arch in ($Archs -split ",")) {
  $arch = $arch.Trim()
  $stageDir = Join-Path $AbsOutputDir "san-desktop-msix-stage-$arch"
  Remove-Item -Recurse -Force $stageDir -ErrorAction SilentlyContinue
  New-Item -ItemType Directory -Force -Path $stageDir | Out-Null

  Write-Host "=== Staging $arch ==="
  Copy-Item -Recurse -Force (Join-Path $unpacked "*") $stageDir

  $assetsDir = Join-Path $stageDir "Assets"
  New-Item -ItemType Directory -Force -Path $assetsDir | Out-Null
  $src = New-Object System.Drawing.Bitmap($IconSrc)
  try {
    New-StoreAsset $src (Join-Path $assetsDir "Square44x44Logo.png") 44 44
    New-StoreAsset $src (Join-Path $assetsDir "Square150x150Logo.png") 150 150
    New-StoreAsset $src (Join-Path $assetsDir "Wide310x150Logo.png") 310 150
    New-StoreAsset $src (Join-Path $assetsDir "Square310x310Logo.png") 310 310
    New-StoreAsset $src (Join-Path $assetsDir "StoreLogo.png") 100 100
  } finally { $src.Dispose() }

  $manifest = (Get-Content $ManifestTemplate -Raw) `
    -replace '\{\{IDENTITY_NAME\}\}', $IdentityName `
    -replace '\{\{PUBLISHER\}\}', ($Publisher -replace '\\', '\\') `
    -replace '\{\{VERSION\}\}', $PackageVersion `
    -replace '\{\{ARCH\}\}', $arch
  $manifestPath = Join-Path $stageDir "AppxManifest.xml"
  [System.IO.File]::WriteAllText($manifestPath, $manifest)

  $outMsix = Join-Path $AbsOutputDir "san-desktop_${PackageVersion}_windows_${arch}.msix"
  & $makeappx pack /d $stageDir /p $outMsix /v
  if ($LASTEXITCODE -ne 0) { throw "makeappx failed for $arch" }
  Write-Host "Built MSIX: $outMsix"

  Remove-Item -Recurse -Force $stageDir -ErrorAction SilentlyContinue
}

Write-Host "=== All MSIX packages built under $AbsOutputDir ==="
