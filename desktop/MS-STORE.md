# Microsoft Store 提交材料 — 三国·天下为注 (Windows)

## 应用身份

| 字段 | 值 |
|---|---|
| 名称(保留) | 三国：天下为注 · 残卷英雄记 (San Guo: Tianxia Weizhu) |
| 类别 | Games → Casino & table → Card & board |
| 设备 | PC (Windows 10 1809+ / Windows 11) |
| 架构 | x64 (NSIS/Electron 39) |
| 离线 | 完全离线单机,无后端依赖、无联网功能 |
| 支持联系方式 | (Partner Center 填写,同 iOS App 支持页) |

## 包(Submission → Packages)

- **上传格式**: Store 接受 `.msix/.msixupload/.appxupload`。当前 CI 产物是 NSIS `.exe`,
  两条路径二选一:
  1. **推荐**: `electron-builder --win msix` 直接出 MSIX —— 在 package.json `build.win.target` 加 `"msix"`
     (需要 Windows 机器或 CI 加 target 重跑;MSIX 需设 `identityName` 与 Partner Center 保留名一致)
  2. 替代: NSIS exe + [MSIX Packaging Tool](https://learn.microsoft.com/windows/msix/packaging-tool/mpt-create-converted-package)(Store 分发的 Win32 转打包,零代码)
- **版本**: 桌面壳已对齐 **1.0.4** (tag v1.0.4-804-desktop, artifact "sanguo-weizhu Setup 1.0.4.exe")

## Listing 文案(中文市场)

**简介 (≤2000 字)**

> 史书只写了沙场,没写牌桌。
>
> 《三国:天下为注》是一款三国题材的叙事德州扑克单机游戏:四卷五十回战役,
> 128 位史实武将各有六维心性(武勇/智谋/诈术/胆识/耐性/心性),同一副牌,
> 每一手都可能改写一页史书。赢下关底,原卷改写为野史;兵败亦入卷,留下史鉴。
>
> - 便携牌桌:毛毡桌面、宣纸卷轴、朱印美学
> - 神态与破绽:武将表情泄露强弱,也会作假——摊牌后破绽簿验证你的读人
> - 天时系统:开卷择时,风向影响牌局
> - 种子可验证:每局洗牌有种子,重放逐位一致
> - 六语言:中文/English/日本語/한국어/Español/Deutsch
> - 完全离线,无内购,无广告

**关键词**: 三国,扑克,德州扑克,策略,卡牌,单机,离线,叙事

**新增功能 (1.0.4)**
> 六语言全面本地化;存档导入导出修复;全屏支持(F11);竖版界面重设计。

## 年龄评级 (IARC 问卷要点)

- 赌博: **模拟/教学性牌类** —— 问答选取"不涉及真实货币赌博;虚构筹码的卡牌游戏"
  (IARC 通常落 ESRB T / PEGI 12 模拟赌博档)
- 暴力: 历史战争叙事,无血腥画面
- 无用户生成内容、无在线交互、无个人信息收集

## 截图规格 (你需在 Windows 上截)

- 至少 **1** 张,最多 10 张;**桌面截图 ≥1366×768** (推荐 1920×1080,16:9)
- PNG(推荐)或 JPG,单张 ≤7MB(实际 Store 限制 30MB,建议压到 2MB 内)
- 推荐镜头:标题页 / 目录残卷 / 行军图 / 战书 / 牌局摊牌 / 六维将卡(英文界面截 2-3 张利于英文市场)
- 截法: 装机后 F11 全屏 → Win+PrtSc(存 图片\屏幕截图)→ 逐屏截
- 主图(第一张)决定转化率,建议用牌局+水墨桌面那张

## 提交流程备忘

1. Partner Center → 新建应用 → 保留名(见上)
2. Packages 上传 MSIX(identityName 对齐)
3. Listings 填文案+传截图(zh-CN 先做,en-US 复用 iOS 英文文案)
4. IARC 问卷 → 评级回填
5. 定价: 免费(或与 iOS TestFlight 同期先免费)
6. 提交审核(桌面 Win32 审核通常 1-3 天)
