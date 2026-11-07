# 三国：天下为注 · 原生版（iOS / macOS）

将网页版《三国：天下为注》原汁原味移植为 SwiftUI 单机应用。**引擎与原版逐位一致**：扑克规则、种子洗牌、AI 决策序列、边池结算均通过从原版 JS 引擎导出的黄金向量（golden vectors）逐位验证。

## 快速开始

```bash
cd native

# 1) 素材:复制头像 + 生成图标(需 macOS sips)
./scripts/prepare-assets.sh

# 2) 生成工程(需 xcodegen)
xcodegen generate

# 3) 数据与黄金向量(需 Node;数据变化时重跑)
node ../native/bridge/export-data.mjs
node ../native/bridge/golden-vectors.mjs

# 4) 构建运行(macOS)
open SanguoWeizhu.xcodeproj    # Scheme: SanguoWeizhu_macOS

# 5) 测试:黄金向量对照(RNG/评估/胜率/AI 决策/边池/人格/局势)
xcodebuild -project SanguoWeizhu.xcodeproj -scheme SanguoWeizhu_macOS -destination 'platform=macOS' test
```

iOS 构建：Scheme `SanguoWeizhu_iOS`，选模拟器或真机即可。

## 目录结构

```
native/
  project.yml              # xcodegen 工程(双平台目标 + 测试)
  scripts/prepare-assets.sh
  bridge/                  # Node 桥:数据导出 / 黄金向量 / 文案抽取 / 翻译合并
  App/Sources/
    Engine/                # 引擎: Poker/Table/Persona/Odds/BattleEngine(逐行移植)
    GameData/              # 数据仓库 + L10n 六语言运行时 + 进度存档 + 剧本引擎
    UI/                    # SwiftUI:开卷/目录/题记/天时/行军/战书/亮相/牌桌/结算/终局/练习场/观阵录/设置/存档
  App/Resources/
    GameData/              # 由 src/*.js 导出的 JSON(章节/武将/剧本/练习场/词池/起手表/头像表)
    Localizations/         # zh 全量 + ja/ko/en/es/de 覆盖(内容按语言回退中文)
    Portraits/             # 三国志9 头像
  Tests/GoldenVectors/     # 原版引擎确定性基准
  translation/             # 文案抽取分块 + 五语言翻译流水线
```

## 引擎保真度

- `hashSeed`(FNV-1a over UTF-16)与 `mulberry32` 逐位一致 → 同一种子同一次洗牌，**验牌可复现**。
- `evaluate5/7`、`compareScore`、蒙特卡洛 `estimateEquity`、确定性 `decisionEquity`：与 JS 输出完全相等（IEEE754 同精度）。
- AI `aiDecide`：人格公式、士气修正、读人、诈唬/慢打/连环诈唬、**RNG 消耗顺序**与原版一致。
- `table`：盲注轮换、加注上限、全压补齐、主/边池、退款、平分奇数筹码、守恒校验。
- 整局复放基准：多种桌型 AI 对 AI 全种子复放，逐步动作与结算完全一致。

## 本地化（zh / ja / ko / en / es / de）

- UI 与术语全量六语言；剧本文本键级覆盖，未翻译条目回退中文（后续可增量补齐）。
- 翻译流水线：`extract-strings.mjs` 抽取全量词条（5476 条）→ `translation/chunks` 分块 → 译者产出 `translation/out/<lang>` → `merge-translations.mjs` 合并进 `Localizations/`。

## 存档互通

原生版存档与网页版 JSON 格式互通（`sanguo-tianxia-weizhu-save` v1）：网页导出的存档可直接导入，反之亦可。

## TestFlight 发布（CI 全链路）

`.github/workflows/testflight-release.yml`（`native-app` 分支，tag `v*` 触发）：

1. macOS runner 导入 Distribution + Installer p12（openssl 预解析 + 90s 看门狗 + `-A` 配方，WWDR G3 证书入仓 `scripts/certs/`，不依赖 apple.com URL）
2. macOS 黄金向量测试 → iOS 归档导出 → `fastlane pilot` 上传
3. macOS 归档 + codesign + `productbuild` pkg → `fastlane deliver` 上传
4. 轮询 build VALID 后执行 `scripts/asc_external_beta.py`：挂 `Ext` 外测组（公开链接）并显式 POST `betaAppReviewSubmissions`（仅挂组不会触发 Beta 审核）
5. `scripts/asc_mas_review.py` 全自动 MAS 提审链（`submit_mas_review` 开关，默认开）：等 mac build VALID（`/v1/builds?filter[app]+filter[version]` + include preReleaseVersion 客户端匹配 MAC_OS）→ 经 `/v1/apps/{id}/appStoreVersions`（扁平路径 GET_COLLECTION 403）find-or-create 版本 → 陈旧绑定则单数 include `appStoreVersionSubmission` 取 id、DELETE 移出审核 → PATCH 绑 build → **新提审流**：POST `/v1/reviewSubmissions` → **扁平 POST `/v1/reviewSubmissionItems`**（子路径 items 405）双关系挂版本 → PATCH `submitted:true`（旧 `appStoreVersionSubmissions` 端点已废弃仅剩 DELETE）。JWT ≤20min、余量 5min 重铸；401×5 快败；营销版本号自读 `project.yml`。

版本节奏：`native/project.yml` 的 `MARKETING_VERSION` / `CURRENT_PROJECT_VERSION` 即所构建版本，bump 后打 tag（如 `v1.0.1-701` → build `2026110701`）。签名复用既有证书对（能复用绝不新建）；所需 secrets 前缀 `SAN_*`（p12×2、密码×2、双平台 profile、ASC API key 三件套）。

## 发版失败重跑决策树

- **上传步已成功**（build 号已占，禁 bump、禁重打 tag）：修好脚本后单跑提审链
  `gh workflow run mas-review-only --ref native-app -f build_ver=<CFBundleVersion>`
  （`.github/workflows/mas-review-only.yml`；默认分支 main 也有一份用于 dispatch 注册，执行时 checkout native-app）
- **归档/上传之前就死**（infra kill、编译错）：修因后用新 tag 重触发（`v1.0.2-704-r2` 式递增，禁 force-push tag）
