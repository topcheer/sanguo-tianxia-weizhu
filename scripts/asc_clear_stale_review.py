#!/usr/bin/env python3
"""撤回阻塞版本创建的陈旧 mac 审核提交(deliver 前置清理步)。

背景(2026-11-08 v1.0.4 run 42478186321 实锤): 上一版 MAS auto-submit 把
1.0.3 mac 版本提到 WAITING_FOR_REVIEW;Apple 状态机规定同平台存在在审版本时
禁止创建新版本 → deliver 为 1.0.4 建版本被拒
("You cannot create a new version of the App in the current state")。

本脚本(幂等,纯 stdlib):
  1. 列出 MAC_OS 平台 appStoreVersions
  2. 对 state ∈ {WAITING_FOR_REVIEW, IN_REVIEW, DEVELOPER_REJECTED 之外的在审态}
     且 versionString != SAN_VERSION 的版本:DELETE 其 appStoreVersionSubmission
     (官方 remove-from-review),轮询至状态翻转(最长 120s)

Env: SAN_API_KEY_ID / SAN_API_ISSUER / SAN_API_KEY_P8
     SAN_VERSION = 本次发布的营销版本(如 1.0.4);旧版本在审即撤回
"""
import importlib.util, json, os, sys, time

spec = importlib.util.spec_from_file_location(
    "asc_mas_review", os.path.join(os.path.dirname(__file__), "asc_mas_review.py"))
mod = importlib.util.module_from_spec(spec)
# 只借 mint/call,避免执行其 main:模块级代码仅定义,安全
sys.modules["asc_mas_review"] = mod
spec.loader.exec_module(mod)
call = mod.call

APP_ID = "6831165178"
IN_REVIEW_STATES = {"WAITING_FOR_REVIEW", "IN_REVIEW", "PENDING_DEVELOPER_RELEASE"}


def main():
    keep = os.environ.get("SAN_VERSION", "").strip()
    if not keep:
        print("::error::SAN_VERSION not set"); sys.exit(1)
    s, r = call("GET", f"/v1/apps/{APP_ID}/appStoreVersions?filter[platform]=MAC_OS&limit=20")
    if s != 200:
        print(f"::error::list versions {s}"); sys.exit(1)
    stale = [v for v in r.get("data", [])
             if v["attributes"].get("versionString") != keep
             and v["attributes"].get("appStoreState") in {"WAITING_FOR_REVIEW", "IN_REVIEW"}]
    if not stale:
        print("no stale mac review submissions; nothing to do"); return
    for v in stale:
        ver = v["attributes"]["versionString"]; vid = v["id"]
        s2, r2 = call("GET", f"/v1/appStoreVersions/{vid}/appStoreVersionSubmissions?limit=1")
        subs = r2.get("data", []) if s2 == 200 else []
        if not subs:
            print(f"version {ver} in review but no submission object; state="
                  f"{v['attributes'].get('appStoreState')} (manual check advised)"); continue
        sid = subs[0]["id"]
        s3, _ = call("DELETE", f"/v1/appStoreVersionSubmissions/{sid}")
        print(f"remove-from-review {ver} ({sid[:8]}): {s3}")
        if s3 != 204:
            print(f"::error::failed removing {ver} submission {s3}"); sys.exit(1)
        for _ in range(24):  # 状态翻转轮询 120s
            time.sleep(5)
            s4, r4 = call("GET", f"/v1/appStoreVersions/{vid}")
            st = r4["data"]["attributes"].get("appStoreState")
            if st not in {"WAITING_FOR_REVIEW", "IN_REVIEW"}:
                print(f"version {ver} state -> {st}"); break
        else:
            print(f"::warning::{ver} state not flipped after 120s; deliver may still fail")
    print("CLEAR_STALE_OK")


if __name__ == "__main__":
    main()
