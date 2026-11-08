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

- **上传格式**: `.msix`(Partner Center 摄取时重签,提交包无需开发者签名)。
- **Pipeline 已就绪(ggcode desktop 配方移植)**:
  - `scripts/release/build-desktop-msix.ps1`: web bundle → electron-builder win-unpacked →
    stage(Assets 商店图标自动从 icon-512 生成 + appxmanifest 模板)→ makeappx 出未签名 .msix
  - `scripts/release/submit-store.ps1`: Store Submission API 全链(挂起 draft 恢复/Azure Blob
    上传/priceId=Free/deviceFamilies 初始化/commit 空 JSON——10 轮踩坑修复原样保留)
  - `msix-store.yml`(dispatch 仅构建)/`store-submission.yml`(tag `store-<ver>-msix` 构建+提交)
- **一次性 secrets(6 个)**: `SAN_STORE_TENANT_ID / SAN_STORE_CLIENT_ID /
  SAN_STORE_CLIENT_SECRET / SAN_STORE_PRODUCT_ID / SAN_MSIX_IDENTITY_NAME / SAN_MSIX_PUBLISHER`
  —— Azure AD 建 app registration(权限 manage.devcenter)取前四,Partner Center
  App identity 页取后二。详见 ggcode 仓 STORE_SUBMISSION.md 同名章节。
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


## 多语言 Store Listings(Partner Center 每市场一列,直接照抄)

### 名称(六市场)

| 市场 | Store Name |
|---|---|
| zh-CN | 三国：天下为注 |
| en-US | Three Kingdoms: The Realm at Stake |
| ja-JP | 三国志：天下を賭けて |
| ko-KR | 삼국：천하를 걸고 |
| es-ES | Tres Reinos: El Imperio en Juego |
| de-DE | Drei Reiche: Das Reich auf dem Spiel |

> 设计:主关键词《三国》当地通行译名做前缀保搜索;副题统一"天下+押注习语"结构
> (at stake / を賭けて / 걸고 / en juego / auf dem Spiel 均双关"押上赌桌/悬而未决")。

### 简介(zh-CN 基准,上表名 + 下文各语言翻译)

- zh-CN:史书只写了沙场,没写牌桌。三国题材叙事德州扑克单机游戏:四卷五十回,128 位史实武将六维心性,赢下关底改写一页史书,兵败亦入卷。神态破绽读人、天时开卷择时、种子可验证重放。六语言,完全离线,无内购无广告。
- en-US:The histories record the battlefield, never the card table. A Three-Kingdoms narrative Texas hold'em saga: four scrolls, fifty chapters, 128 historical generals with six-trait personas. Win the final gate to rewrite a page of history; even defeat enters the record. Read tells, choose heaven's timing, replay seeded deals bit-exact. Six languages, fully offline, no IAP, no ads.
- ja-JP:史書は戦場だけを記し、卓上を記さなかった。三国志を題材にしたノベルティ・テキサスホールデム:四巻五十回、128 名の史実武将が六次元の心性を持つ。関底を制して一頁の歴史を書き換え、敗北さえ巻に刻まれる。表情の「読み」、天時の選択、シード検証可能なリプレイ。六言語対応、完全オフライン、課金・広告なし。
- ko-KR:사서는 전장만 적었고, 판은 적지 않았다. 삼국을 소재로 한 서사형 텍사스 홀덤: 4권 50회, 128명 사실 무장의 6차원 심성. 관저를 이기면 한 페이지의 역사를 다시 쓰고, 패배도 권에 남는다. 텔 읽기, 천시 선택, 시드 검증 리플레이. 6개 언어, 완전 오프라인, 인앱 결제·광고 없음.
- es-ES:Las crónicas cuentan el campo de batalla, jamás la mesa de cartas. Un saga narrativa de Texas hold'em ambientada en los Tres Reinos: cuatro rollos, cincuenta capítulos y 128 generales históricos con personalidades de seis rasgos. Gana la puerta final para reescribir una página de la historia; hasta la derrota queda registrada. Lee los gestos, elige el momento del cielo, repite partidas verificables. Seis idiomas, sin conexión, sin compras ni anuncios.
- de-DE:Die Chroniken berichten vom Schlachtfeld, nie vom Kartentisch. Eine erzählerische Texas-Hold'em-Saga im Zeichen der Drei Reiche: vier Rollen, fünfzig Kapitel, 128 historische Generäle mit Sechs-Züge-Personas. Gewinne das letzte Tor, um eine Seite der Geschichte umzuschreiben; selbst die Niederlage geht in die Chronik ein. Lies die Gesten, wähle die Zeit des Himmels, spiele nachvollziehbare Partien. Sechs Sprachen, komplett offline, keine Käufe, keine Werbung.

### 关键词(逗号分隔,各市场)

- zh-CN: 三国,扑克,德州扑克,策略,卡牌,单机,离线,叙事
- en-US: three kingdoms, poker, texas holdem, strategy, cards, offline, story
- ja-JP: 三国志,ポーカー,テキサスホールデム,ストーリー,オフライン,カード
- ko-KR: 삼국,포커,홀덤,전략,카드,오프라인,스토리
- es-ES: tres reinos, poker, texas holdem, estrategia, cartas, offline
- de-DE: drei reiche, poker, texas holdem, strategie, karten, offline

### 新增功能(1.0.4,各市场同义)

六语言全面本地化;存档导入导出修复;全屏支持(F11);竖版界面重设计。

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
