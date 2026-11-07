#!/usr/bin/env python3
"""Full-auto Mac App Store review submission for dev.ggcode.san (app 6831165178).

Chain (idempotent, per ggcode-proven recipe 2026-11-07):
  1. wait for the MAC_OS build of BUILD_VER to reach processingState=VALID
     (GET /v1/builds?filter[app]=&filter[version]=&include=preReleaseVersion,
      client-side platform match - /apps/{id}/builds rejects filter/sort)
  2. find-or-create the appStoreVersion for SAN_VERSION on platform MAC_OS
  3. if version is WAITING_FOR_REVIEW / IN_REVIEW with an active submission:
     DELETE /v1/appStoreVersionSubmissions/{id}  (official remove-from-review)
     then poll until the version state flips (DEVELOPER_REJECTED)
  4. PATCH whatsNewText on every localization (generic text by default)
  5. PATCH the version to bind the new build
  6. POST /v1/appStoreVersionSubmissions to (re)enter the review queue

Env: SAN_API_KEY_ID / SAN_API_ISSUER / SAN_API_KEY_P8 (raw p8)
     BUILD_VER   = CFBundleVersion to bind  (e.g. 2026110704)
     SAN_VERSION = marketing version        (e.g. 1.0.2; default 1.0.2)
     WHATS_NEW   = optional whatsNew text (generic default)

JWT rules (learned the hard way on ggcode, ported):
  - exp <= 20min; re-mint when <5min remaining (module state, no subshell)
  - payload MUST carry aud:"appstoreconnect-v1"; header typ:JWT
  - DER ES256 -> raw r||s (both zero-trimmed to 32B)
  - 5 consecutive 401s with a fresh token = credentials problem: fail fast
Pure stdlib; signing via `openssl dgst`.
"""
import base64, json, os, subprocess, sys, time, urllib.error, urllib.request

API = "https://api.appstoreconnect.apple.com"
APP_ID = "6831165178"

_TOKEN = None
_EXP = 0.0


def mint():
    global _TOKEN, _EXP
    if _TOKEN and _EXP - time.time() > 300:
        return _TOKEN
    kid = os.environ["SAN_API_KEY_ID"]
    iss = os.environ["SAN_API_ISSUER"]
    p8 = os.environ["SAN_API_KEY_P8"]
    key_path = "/tmp/asc_mas_jwt.p8"
    with open(key_path, "w") as f:
        f.write(p8)
    now = int(time.time())
    header = base64.urlsafe_b64encode(json.dumps(
        {"alg": "ES256", "kid": kid, "typ": "JWT"}).encode()).rstrip(b"=")
    payload = base64.urlsafe_b64encode(json.dumps(
        {"iss": iss, "iat": now, "exp": now + 1100,
         "aud": "appstoreconnect-v1"}).encode()).rstrip(b"=")
    sig = subprocess.run(["openssl", "dgst", "-sha256", "-sign", key_path],
                         input=header + b"." + payload,
                         capture_output=True, check=True).stdout

    def read_int(b, off):
        assert b[off] == 0x02, "ASN1 int expected"
        ln = b[off + 1]
        return int.from_bytes(b[off + 2: off + 2 + ln], "big").to_bytes(32, "big")

    r = read_int(sig, 2)
    s = read_int(sig, 2 + 2 + sig[3])
    _TOKEN = (header + b"." + payload + b"." +
              base64.urlsafe_b64encode(r + s).rstrip(b"=")).decode()
    _EXP = now + 1100
    return _TOKEN


_UNAUTH = 0


def call(method, path, body=None):
    """401 -> immediate attempt with a fresh token, max 5 consecutive (fail fast).
    5xx/network -> short backoff retries. 4xx otherwise -> returned as-is."""
    global _UNAUTH
    for attempt in range(8):
        req = urllib.request.Request(API + path, method=method,
                                     headers={"Authorization": "Bearer " + mint()})
        data = json.dumps(body).encode() if body is not None else None
        if data:
            req.add_header("Content-Type", "application/json")
        try:
            with urllib.request.urlopen(req, data, timeout=60) as resp:
                raw = resp.read().decode()
                _UNAUTH = 0
                return resp.status, json.loads(raw) if raw.strip() else {}
        except urllib.error.HTTPError as e:
            detail = json.loads(e.read().decode() or "{}")
            if e.code == 401:
                global _TOKEN
                _TOKEN = None  # force fresh mint on the next loop
                _UNAUTH += 1
                if _UNAUTH >= 5:
                    print(f"::error::401 x{_UNAUTH} with fresh JWTs - "
                          f"credential problem (key id / issuer / p8). Failing fast.")
                    sys.exit(1)
                continue
            _UNAUTH = 0
            return e.code, detail
        except Exception:
            if attempt == 7:
                raise
            time.sleep(3 * (attempt + 1))
    return 0, {}


def wait_valid_mac_build(ver, timeout_s=1500):
    """Poll /v1/builds (filter[app]+filter[version] is proven; the
    /apps/{id}/builds path rejects filter/sort) and client-side match the
    MAC_OS build via the included preReleaseVersion platform."""
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        s, r = call("GET", f"/v1/builds?filter[app]={APP_ID}"
                         f"&filter[version]={ver}&include=preReleaseVersion&limit=20")
        if s == 200:
            prv = {x["id"]: x.get("attributes", {}).get("platform")
                   for x in r.get("included", [])
                   if x.get("type") == "preReleaseVersions"}
            mac = [b for b in r.get("data", [])
                   if prv.get(b.get("relationships", {})
                              .get("preReleaseVersion", {})
                              .get("data", {}).get("id")) == "MAC_OS"]
            states = {b["id"]: b["attributes"].get("processingState") for b in mac}
            print(f"mac builds {ver}: {states}")
            for b in mac:
                if b["attributes"].get("processingState") == "VALID":
                    return b["id"]
            if any(v in ("INVALID", "FAILED") for v in states.values()):
                print(f"::error::mac build processing failed: {states}")
                sys.exit(1)
        else:
            print(f"list builds: {s} {json.dumps(r)[:200]}")
        time.sleep(30)
    print(f"::error::mac build {ver} never VALID in {timeout_s}s")
    sys.exit(1)


def get_or_create_version(mkt):
    body = {"data": {"type": "appStoreVersions",
                     "attributes": {"platform": "MAC_OS", "versionString": mkt},
                     "relationships": {"app": {"data": {"type": "apps",
                                                        "id": APP_ID}}}}}
    s, r = call("GET", f"/v1/apps/{APP_ID}/appStoreVersions?limit=20")
    if s != 200:
        print(f"::error::list versions {s} {r}"); sys.exit(1)
    cand = [v for v in r.get("data", []) if (v["attributes"].get("versionString") or v["attributes"].get("version")) == mkt]
    mac = [v for v in cand if v["attributes"].get("platform") in ("MAC_OS", None)]
    if mac or cand:
        v = (mac or cand)[0]
        return v["id"], v["attributes"].get("appStoreState")
    s, r = call("POST", "/v1/appStoreVersions", body)
    if s == 201:
        return r["data"]["id"], r["data"]["attributes"].get("appStoreState")
    if s == 409:
        # 重复 -> 再列一次(可能 deliver 自动建的占位此轮才可见)
        s2, r2 = call("GET", f"/v1/apps/{APP_ID}/appStoreVersions?limit=20")
        for v in r2.get("data", []):
            if (v["attributes"].get("versionString") or v["attributes"].get("version")) == mkt:
                print(f"409 -> existing version found: {v['id'][:8]} "
                      f"platform={v['attributes'].get('platform')}")
                return v["id"], v["attributes"].get("appStoreState")
        # "cannot create a new version in the current state": 同平台在审版本阻塞
        # -> 把在审旧版本移出审核(官方 remove-from-review),再重试 CREATE 一次
        blockers = [v for v in r2.get("data", [])
                    if v["attributes"].get("appStoreState") in ("WAITING_FOR_REVIEW", "IN_REVIEW")]
        if blockers:
            b = blockers[0]
            print(f"unblock: v{b['attributes'].get('version')} ({b['id'][:8]}) "
                  f"{b['attributes'].get('appStoreState')} -> remove from review")
            remove_active_submission(b["id"], b["attributes"].get("appStoreState"))
            s, r = call("POST", "/v1/appStoreVersions", body)
            if s == 201:
                return r["data"]["id"], r["data"]["attributes"].get("appStoreState")
            s3, r3 = call("GET", f"/v1/apps/{APP_ID}/appStoreVersions?limit=20")
            for v in r3.get("data", []):
                if (v["attributes"].get("versionString") or v["attributes"].get("version")) == mkt:
                    return v["id"], v["attributes"].get("appStoreState")
        dump = [(v["id"][:8], v["attributes"].get("versionString") or v["attributes"].get("version"),
                 v["attributes"].get("platform"), v["attributes"].get("appStoreState"))
                for v in (r2.get("data", []) if s2 == 200 else [])]
        print(f"version list dump: {dump}")
        if blockers:
            print("MAS_RETRY_LATER: in-review version blocks creation; "
                  "will succeed once Apple flips its state (approve/reject)")
            sys.exit(2)
    print(f"::error::create version {mkt}: {s} {r}"); sys.exit(1)


def remove_active_submission(vid, state):
    if state not in ("WAITING_FOR_REVIEW", "IN_REVIEW"):
        return
    subs = []
    # 路径0: 版本资源自身 relationships 块(GET_INSTANCE 允许)
    s0, r0 = call("GET", f"/v1/appStoreVersions/{vid}")
    rel = (r0.get("data", {}).get("relationships", {}) if isinstance(r0, dict) else {})
    print(f"probe0 {s0} rel_keys={sorted(rel.keys())}")
    _one = (rel.get("appStoreVersionSubmission") or {}).get("data")  # 关系名是单数(to-one)
    subs = [_one] if isinstance(_one, dict) and _one.get("id") else []
    if not _one:
        _many = (rel.get("appStoreVersionSubmissions") or {}).get("data", [])
        subs = list(_many or [])
    if subs:
        print(f"probe0 found {len(subs)} submission link(s)")
    if not subs:
        # 路径A: 直接关系资源
        sa, ra = call("GET", f"/v1/appStoreVersions/{vid}/appStoreVersionSubmissions?limit=5")
        print(f"probeA {sa} n={len(ra.get('data', [])) if isinstance(ra, dict) else '?'}")
        if sa == 200 and isinstance(ra, dict):
            subs = ra.get("data", [])
    if not subs:
        # 路径B: GET_INSTANCE + include
        sb, rb = call("GET", f"/v1/appStoreVersions/{vid}?include=appStoreVersionSubmission")
        inc = rb.get("included", []) if isinstance(rb, dict) else []
        print(f"probeB {sb} included={[(x.get('type'), x.get('id', '')[:8]) for x in inc]}")
        subs = [x for x in inc if x.get("type") == "appStoreVersionSubmissions"]
    if not subs:
        # 路径C: 扁平集合+filter(可能 GET_COLLECTION 403,仅作探测)
        sc, rc = call("GET", f"/v1/appStoreVersionSubmissions?filter[appStoreVersion]={vid}&limit=5")
        print(f"probeC {sc} " + (f"n={len(rc.get('data', []))}" if isinstance(rc, dict) else ""))
        if sc == 200 and isinstance(rc, dict):
            subs = rc.get("data", [])
    if not subs:
        print("::warning::no submission resource found via 0/A/B/C — cannot remove from review")
        return
    for sub in subs:
        sid = sub["id"]
        s, _ = call("DELETE", f"/v1/appStoreVersionSubmissions/{sid}")
        print(f"remove-from-review {sid[:8]}: {s}")
        if s in (200, 204):
            for _ in range(20):  # 等状态翻转,最多5分钟
                time.sleep(15)
                s2, r2 = call("GET", f"/v1/appStoreVersions/{vid}")
                st = r2.get("data", {}).get("attributes", {}).get("appStoreState")
                print(f"version state -> {st}")
                if st not in ("WAITING_FOR_REVIEW", "IN_REVIEW"):
                    return
            print("::warning::version still in review state after removal")


def patch_whats_new(vid, text):
    s, r = call("GET", f"/v1/appStoreVersions/{vid}/appStoreVersionLocalizations?limit=30")
    locs = r.get("data", []) if s == 200 else []
    if not locs:  # fresh version without default locale -> create en-US
        s, r = call("POST", f"/v1/appStoreVersions/{vid}/appStoreVersionLocalizations",
                    {"data": {"type": "appStoreVersionLocalizations",
                              "attributes": {"locale": "en-US"}}})
        if s == 201:
            locs = [r["data"]]
        else:
            print(f"::warning::create en-US localization: {s}")
    for loc in locs:
        lid = loc["id"]
        s, _ = call("PATCH", f"/v1/appStoreVersionLocalizations/{lid}",
                    {"data": {"type": "appStoreVersionLocalizations", "id": lid,
                              "attributes": {"whatsNewText": text}}})
        print(f"whatsNew [{loc['attributes'].get('locale')}]: {s}"
              + (" (state forbids edit; skipped)" if s != 200 else ""))


def bind_build(vid, bid):
    s, r = call("PATCH", f"/v1/appStoreVersions/{vid}",
                {"data": {"id": vid, "type": "appStoreVersions",
                          "relationships": {"build": {"data": {"type": "builds",
                                                               "id": bid}}}}})
    print(f"bind build {bid[:8]}: {s}")
    return s in (200, 201)


def submit(vid):
    """reviewSubmissions 新流程(ggcode 实证;旧 appStoreVersionSubmissions 仅剩 DELETE)。"""
    # 全量列(不带 state 过滤):取消后旧对象可能滞留非 PREPARE 态,取最新可用
    s, r = call("GET", f"/v1/reviewSubmissions?filter[app]={APP_ID}"
                       f"&filter[platform]=MAC_OS&limit=10")
    rsid = None
    if s == 200 and isinstance(r, dict):
        items = r.get("data", [])
        print(f"reviewSubmissions: {[(x['id'][:8], x['attributes'].get('state')) for x in items]}")
        prep = [x for x in items if x["attributes"].get("state") == "PREPARE_FOR_SUBMISSION"]
        if prep:
            rsid = prep[-1]["id"]
    if not rsid:
        s, r = call("POST", "/v1/reviewSubmissions",
                    {"data": {"type": "reviewSubmissions",
                              "attributes": {"platform": "MAC_OS"},
                              "relationships": {"app": {"data": {"type": "apps",
                                                                 "id": APP_ID}}}}})
        print(f"create reviewSubmission: {s} {json.dumps(r)[:200]}")
        rsid = r["data"]["id"] if s == 201 and isinstance(r, dict) else None
        if not rsid and s in (409, 422):
            s, r = call("GET", f"/v1/reviewSubmissions?filter[app]={APP_ID}"
                               f"&filter[platform]=MAC_OS&limit=10")
            items = r.get("data", []) if isinstance(r, dict) else []
            live = [x for x in items if x["attributes"].get("state") not in
                    ("CANCELED", "COMPLETED", None)]
            if live:
                rsid = live[-1]["id"]
                print(f"409 -> reuse live reviewSubmission {rsid[:8]} "
                      f"state={live[-1]['attributes'].get('state')}")
    if not rsid:
        print(f"::error::no reviewSubmission obtainable")
        return False
    s, r = call("POST", f"/v1/reviewSubmissions/{rsid}/items",
                {"data": {"type": "reviewSubmissionItems", "attributes": {},
                          "relationships": {"appStoreVersion": {
                              "data": {"type": "appStoreVersions", "id": vid}}}}})
    print(f"attach item: {s} {json.dumps(r)[:200]}")
    s, r = call("PATCH", f"/v1/reviewSubmissions/{rsid}",
                {"data": {"type": "reviewSubmissions", "id": rsid,
                          "attributes": {"submitted": True}}})
    st = r.get("data", {}).get("attributes", {}).get("state") if isinstance(r, dict) else None
    print(f"submit patch: {s} state={st} {json.dumps(r)[:200]}")
    return st == "WAITING_FOR_REVIEW"


def main():
    ver = os.environ.get("BUILD_VER", "")
    if not ver:
        print("::error::BUILD_VER required"); sys.exit(1)
    mkt = os.environ.get("SAN_VERSION")
    if not mkt:
        yml = os.path.join(os.path.dirname(__file__), "..", "native", "project.yml")
        for line in open(yml):
            if "MARKETING_VERSION:" in line:
                mkt = line.split('"')[1]
                break
    if not mkt:
        print("::error::SAN_VERSION unset and project.yml unreadable"); sys.exit(1)
    whats = os.environ.get("WHATS_NEW",
                           "Stability improvements and layout refinements.")
    bid = wait_valid_mac_build(ver)
    print(f"mac build {ver} VALID: {bid[:8]}")
    vid, state = get_or_create_version(mkt)
    print(f"version {mkt}: {vid[:8]} state={state}")
    if state in ("WAITING_FOR_REVIEW", "IN_REVIEW"):
        ba = {}
        sv, rv = call("GET", f"/v1/appStoreVersions/{vid}/build")  # 专用关系端点(JSON:API 主资源不带 linkage)
        bound = (rv.get("data") or {}).get("id") if isinstance(rv, dict) else None
        print(f"bound build: {bound and bound[:8]} (target {bid[:8]})")
        if bound != bid and bound:
            sb2, rb2 = call("GET", f"/v1/builds/{bound}")
            ba = rb2.get("data", {}).get("attributes", {}) if isinstance(rb2, dict) else {}
            print(f"bound build {bound[:8]}: http={sb2} attrs={ba} raw={json.dumps(rb2)[:300]}")
            if ba.get("version") == ver and ba.get("platform") == "MAC_OS":
                print(f"bound build is also {ver} MAC_OS (upload id churn) - accepting")
        if bound == bid or (bound and ba.get("version") == ver):
            print("MAS_REVIEW_OK (already WAITING_FOR_REVIEW with this build)")
            print("MAS_REVIEW_OK")
            return
        print(f"::warning::in review bound to stale build {bound} - removing from review")
        remove_active_submission(vid, state)
        sv2, rv2 = call("GET", f"/v1/appStoreVersions/{vid}")
        state = rv2.get("data", {}).get("attributes", {}).get("appStoreState")
        print(f"post-remove state: {state}")
        if state in ("WAITING_FOR_REVIEW", "IN_REVIEW"):
            print("MAS_RETRY_LATER: still in review after removal attempt")
            sys.exit(2)
    if state in ("READY_FOR_SALE", "PENDING_DEVELOPER_RELEASE", "PROCESSING_FOR_APP_STORE"):
        print(f"::error::version {mkt} already released - nothing to submit")
        sys.exit(1)
    remove_active_submission(vid, state)
    patch_whats_new(vid, whats)
    if not bind_build(vid, bid):
        sys.exit(1)
    if not submit(vid):
        sys.exit(1)
    print("MAS_REVIEW_OK")


if __name__ == "__main__":
    main()
