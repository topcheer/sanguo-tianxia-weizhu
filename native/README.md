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
