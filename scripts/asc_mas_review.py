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
    s, r = call("GET", f"/v1/apps/{APP_ID}/appStoreVersions?limit=20")
    if s != 200:
        print(f"::error::list versions {s} {r}"); sys.exit(1)
    cand = [v for v in r.get("data", []) if v["attributes"].get("version") == mkt]
    mac = [v for v in cand if v["attributes"].get("platform") in ("MAC_OS", None)]
    if mac or cand:
        v = (mac or cand)[0]
        return v["id"], v["attributes"].get("appStoreState")
    s, r = call("POST", "/v1/appStoreVersions",
                {"data": {"type": "appStoreVersions",
                          "attributes": {"platform": "MAC_OS", "versionString": mkt},
                          "relationships": {"app": {"data": {"type": "apps",
                                                             "id": APP_ID}}}}})
    if s == 201:
        return r["data"]["id"], r["data"]["attributes"].get("appStoreState")
    if s == 409:
        for v in (call("GET", f"/v1/apps/{APP_ID}/appStoreVersions?limit=20")[1].get("data", [])):
            if v["attributes"].get("version") == mkt:
                print(f"409 -> existing version found: {v['id'][:8]} "
                      f"platform={v['attributes'].get('platform')}")
                return v["id"], v["attributes"].get("appStoreState")
    print(f"::error::create version {mkt}: {s} {r}"); sys.exit(1)


def remove_active_submission(vid, state):
    if state not in ("WAITING_FOR_REVIEW", "IN_REVIEW"):
        return
    s, r = call("GET", f"/v1/appStoreVersions/{vid}/appStoreVersionSubmissions?limit=5")
    subs = r.get("data", []) if s == 200 else []
    if not subs:
        s, r = call("GET", f"/v1/appStoreVersions/{vid}?include=appStoreVersionSubmissions")
        for x in r.get("included", []):
            if x.get("type") == "appStoreVersionSubmissions":
                subs = [x]
                break
    for sub in subs:
        sid = sub["id"]
        s, _ = call("DELETE", f"/v1/appStoreVersionSubmissions/{sid}")
        print(f"remove-from-review {sid[:8]}: {s}")
        if s in (200, 204):
            for _ in range(20):  # wait state flip, max 5min
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
        print(f"whatsNew [{loc['attributes'].get('locale')}]: {s}")


def bind_build(vid, bid):
    s, r = call("PATCH", f"/v1/appStoreVersions/{vid}",
                {"data": {"id": vid, "type": "appStoreVersions",
                          "relationships": {"build": {"data": {"type": "builds",
                                                               "id": bid}}}}})
    print(f"bind build {bid[:8]}: {s}")
    return s in (200, 201)


def submit(vid):
    s, r = call("POST", "/v1/appStoreVersionSubmissions",
                {"data": {"relationships": {"appStoreVersion": {
                    "data": {"type": "appStoreVersions", "id": vid}}}}})
    if s == 201:
        print(f"submitted for review: {r['data']['id'][:8]}")
        return True
    if s in (409,) or (s == 422 and "state" in json.dumps(r).lower()):
        print(f"already in submission flow: {s}")
        return True
    print(f"::error::submit: {s} {r}")
    return False


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
