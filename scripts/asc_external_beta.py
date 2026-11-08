#!/usr/bin/env python3
"""ASC external-beta automation for dev.ggcode.san (app 6831165178).

Proven manual flow (2026-11-06) turned idempotent:
  1. attach given builds to the `Ext` external beta group (public link on)
  2. POST betaAppReviewSubmissions per build  <- attaching alone does NOT
     trigger Beta App Review; the explicit POST is required.

Env: SAN_API_KEY_ID / SAN_API_ISSUER / SAN_API_KEY_P8 (raw p8 contents)
     BUILD_VER  = CFBundleVersion to pick (e.g. 2026110603)
     BETA_GROUP = group name (default Ext)
API gotchas (learned the hard way):
  - betaAppReviewSubmissions query REQUIRES filter[build]=; no app-level path.
Pure stdlib; ES256 signature via `openssl dgst`.
"""
import base64, json, os, subprocess, sys, time, urllib.request

API = "https://api.appstoreconnect.apple.com"
APP_ID = "6831165178"


_TOKEN = None


def jwt():
    global _TOKEN
    if _TOKEN:
        return _TOKEN
    kid = os.environ["SAN_API_KEY_ID"]
    iss = os.environ["SAN_API_ISSUER"]
    p8 = os.environ["SAN_API_KEY_P8"]
    key_path = "/tmp/asc_jwt.p8"
    with open(key_path, "w") as f:
        f.write(p8 if "PRIVATE KEY" in p8 else p8)
    now = int(time.time())
    header = base64.urlsafe_b64encode(json.dumps({"alg": "ES256", "kid": kid, "typ": "JWT"}).encode()).rstrip(b"=")
    payload = base64.urlsafe_b64encode(json.dumps({"iss": iss, "iat": now, "exp": now + 1100, "aud": "appstoreconnect-v1"}).encode()).rstrip(b"=")
    sig = subprocess.run(["openssl", "dgst", "-sha256", "-sign", key_path],
                         input=header + b"." + payload, capture_output=True, check=True).stdout
    # DER SEQUENCE(INTEGER r, INTEGER s) -> raw r||s (64 bytes)
    def read_int(b, off):
        assert b[off] == 0x02, "ASN1 int expected"
        ln = b[off + 1]
        return int.from_bytes(b[off + 2: off + 2 + ln], "big").to_bytes(32, "big")
    r = read_int(sig, 2)
    s = read_int(sig, 2 + 2 + sig[3])
    raw = base64.urlsafe_b64encode(r + s).rstrip(b"=")
    _TOKEN = (header + b"." + payload + b"." + raw).decode()
    return _TOKEN


def call(method, path, body=None, retry=3):
    for i in range(retry):
        req = urllib.request.Request(API + path, method=method,
                                     headers={"Authorization": "Bearer " + jwt()})
        data = json.dumps(body).encode() if body is not None else None
        if data:
            req.add_header("Content-Type", "application/json")
        try:
            with urllib.request.urlopen(req, data, timeout=60) as resp:
                raw = resp.read().decode()
                return resp.status, json.loads(raw) if raw.strip() else {}
        except urllib.error.HTTPError as e:
            if i == retry - 1:
                return e.code, json.loads(e.read().decode() or "{}")
            time.sleep(3 * (i + 1))
        except Exception:
            if i == retry - 1:
                raise
            time.sleep(3 * (i + 1))


def main():
    ver = os.environ.get("BUILD_VER", "")
    group = os.environ.get("BETA_GROUP", "Ext")
    # builds 顶层 attributes 无 platform;须 include=preReleaseVersion 从关系取
    # (asc_mas_review.py 同坑注释:"client-side platform match - include=preReleaseVersion")
    s, r = call("GET", f"/v1/builds?filter[app]={APP_ID}&filter[version]={ver}"
                       "&include=preReleaseVersion&limit=20")
    if s != 200:
        print(f"::error::list builds {s} {r}"); sys.exit(1)
    prv = {inc["id"]: inc["attributes"].get("platform", "?")
           for inc in r.get("included", []) if inc.get("type") == "preReleaseVersions"}

    def platform_of(b):
        rid = ((b.get("relationships", {}).get("preReleaseVersion") or {})
               .get("data") or {}).get("id")
        return prv.get(rid, "?")

    builds = [b for b in r.get("data", []) if b["attributes"].get("processingState") == "VALID"]
    if not builds:
        print(f"::error::no VALID builds for {ver} (states: " +
              ",".join(b["attributes"].get("processingState", "?") for b in r.get("data", [])) + ")")
        sys.exit(1)
    # 双平台齐备门禁:所需平台(默认 iOS+macOS)各须有 VALID build 才继续。
    # 否则先到的一方提交完就收口,晚到的 mac build 永远没人挂组/提审(1.0.3 实际发生)。
    # BETA_PLATFORMS 可收窄(如拆分发布:mac 版本被在审阻塞时先发 IOS,如 1.0.4)。
    required = {p.strip().upper() for p in os.environ.get("BETA_PLATFORMS", "IOS,MAC_OS").split(",") if p.strip()}
    plats = {platform_of(b) for b in builds}
    missing = required - plats
    if missing:
        print(f"::error::VALID builds missing platforms {sorted(missing)} "
              f"(have {sorted(plats)}); waiting for {'+'.join(sorted(required))}")
        sys.exit(1)
    builds = [b for b in builds if platform_of(b) in required]
    for b in builds:
        b["attributes"]["platform"] = platform_of(b)
    s, r = call("GET", f"/v1/betaGroups?filter[name]={group}&limit=5")
    gid = r["data"][0]["id"] if s == 200 and r.get("data") else None
    if not gid:
        print(f"::error::beta group `{group}` not found"); sys.exit(1)
    s, r = call("GET", f"/v1/betaGroups/{gid}/builds?limit=50")
    have = {b["id"] for b in r.get("data", [])}
    for b in builds:
        bid = b["id"]
        plat = b["attributes"].get("platform", "?")
        if bid not in have:
            s, _ = call("POST", f"/v1/betaGroups/{gid}/relationships/builds",
                        {"data": [{"type": "builds", "id": bid}]})
            print(f"attach {plat} {bid[:8]} -> {group}: {s}" + (" (already attached)" if s == 409 else ""))
            if s not in (200, 201, 409):
                print(f"::error::attach {plat} {bid[:8]} failed {s}"); sys.exit(1)
        s, r = call("GET", f"/v1/betaAppReviewSubmissions?filter[build]={bid}&limit=5")
        states = [x["attributes"].get("betaReviewState") for x in r.get("data", [])]
        if states:
            print(f"build {plat} {bid[:8]} review already: {states}")
            continue
        s, _ = call("POST", "/v1/betaAppReviewSubmissions",
                    {"data": {"type": "betaAppReviewSubmissions",
                              "relationships": {"build": {"data": {"type": "builds", "id": bid}}}}})
        print(f"submit {plat} {bid[:8]} for beta review: {s}" + (" (already submitted)" if s == 422 else ""))
        if s not in (201, 422):
            print(f"::error::submit {plat} {bid[:8]} failed {s}"); sys.exit(1)
    print("EXTERNAL_BETA_OK")


if __name__ == "__main__":
    main()
