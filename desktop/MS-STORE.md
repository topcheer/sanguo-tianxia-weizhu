# Microsoft Store 提交材料 — 三国·天下为注 (Windows)

本页所有"照抄"字段均为纯文本,可直接复制粘贴到 Partner Center。

## 应用身份

| 字段 | 值 |
|---|---|
| 名称(已保留) | 三国：天下为注 · 残卷英雄记 |
| Identity Name | GuangGuangAIStudio.440596408BC67 |
| Publisher | CN=C2C7AF54-16DE-44AC-9393-7EA6D433CCD2 |
| Store ID | 9MX43WGJCSFV |
| Store URL | https://apps.microsoft.com/detail/9MX43WGJCSFV |
| 类别 | Games → Casino & table → Card & board |
| 设备 | PC (Windows 10 1809+ / Windows 11), x64 |
| 隐私政策 URL | https://san.ggcode.uk/privacy |
| 支持联系方式 | (Partner Center Properties 页填写,同 iOS App 支持页) |

## 包 (Packages)

上传 MSIX: /Volumes/new/XCode/Prod/msstore/msix-1.0.4.0/san-desktop_1.0.4.0_windows_x64.msix
(Partner Center 摄取时自动重签,无需开发者签名)

Pipeline(已就绪,ggcode desktop 配方移植):
- scripts/release/build-desktop-msix.ps1 — web bundle + electron-builder + makeappx 出未签名 MSIX
- scripts/release/submit-store.ps1 — Store Submission API 全链
- msix-store.yml — tag build-msix-<ver> 仅构建; store-submission.yml — tag store-<ver>-msix 构建+提交
- 一次性 secrets(6 个): SAN_STORE_TENANT_ID / SAN_STORE_CLIENT_ID / SAN_STORE_CLIENT_SECRET / SAN_STORE_PRODUCT_ID / SAN_MSIX_IDENTITY_NAME / SAN_MSIX_PUBLISHER(后两个与 PRODUCT_ID 已配好)

## Listings — 逐市场照抄

### Store Name(名称)

zh-CN 三国：天下为注
en-US Three Kingdoms: The Realm at Stake
ja-JP 三国志：天下を賭けて
ko-KR 삼국：천하를 걸고
es-ES Tres Reinos: El Imperio en Juego
de-DE Drei Reiche: Das Reich auf dem Spiel

### 简介 (Description)

zh-CN
史书只写了沙场,没写牌桌。
《三国:天下为注》是一款三国题材的叙事德州扑克单机游戏:四卷五十回战役,128 位史实武将各有六维心性(武勇/智谋/诈术/胆识/耐性/心性),同一副牌,每一手都可能改写一页史书。赢下关底,原卷改写为野史;兵败亦入卷,留下史鉴。
· 便携牌桌:毛毡桌面、宣纸卷轴、朱印美学
· 神态与破绽:武将表情泄露强弱,也会作假——摊牌后破绽簿验证你的读人
· 天时系统:开卷择时,风向影响牌局
· 种子可验证:每局洗牌有种子,重放逐位一致
· 六语言:中文/English/日本語/한국어/Español/Deutsch
· 完全离线,无内购,无广告

en-US
The histories record the battlefield, never the card table. San Guo: Tianxia Weizhu is a Three-Kingdoms narrative Texas hold'em saga: four scrolls, fifty chapters, and 128 historical generals with six-trait personas. Win the final gate to rewrite a page of history; even defeat enters the record. Read tells, choose heaven's timing, replay seeded deals bit-exact. Six languages, fully offline, no IAP, no ads.

ja-JP
史書は戦場だけを記し、卓上を記さなかった。三国志を題材にしたノベルティ・テキサスホールデム:四巻五十回、128 名の史実武将が六次元の心性を持つ。関底を制して一頁の歴史を書き換え、敗北さえ巻に刻まれる。表情の「読み」、天時の選択、シード検証可能なリプレイ。六言語対応、完全オフライン、課金・広告なし。

ko-KR
사서는 전장만 적었고, 판은 적지 않았다. 삼국을 소재로 한 서사형 텍사스 홀덤: 4권 50회, 128명 사실 무장의 6차원 심성. 관저를 이기면 한 페이지의 역사를 다시 쓰고, 패배도 권에 남는다. 텔 읽기, 천시 선택, 시드 검증 리플레이. 6개 언어, 완전 오프라인, 인앱 결제·광고 없음.

es-ES
Las crónicas cuentan el campo de batalla, jamás la mesa de cartas. Una saga narrativa de Texas hold'em ambientada en los Tres Reinos: cuatro rollos, cincuenta capítulos y 128 generales históricos con personalidades de seis rasgos. Gana la puerta final para reescribir una página de la historia; hasta la derrota queda registrada. Lee los gestos, elige el momento del cielo, repite partidas verificables. Seis idiomas, sin conexión, sin compras ni anuncios.

de-DE
Die Chroniken berichten vom Schlachtfeld, nie vom Kartentisch. Eine erzählerische Texas-Hold'em-Saga im Zeichen der Drei Reiche: vier Rollen, fünfzig Kapitel, 128 historische Generäle mit Sechs-Züge-Personas. Gewinne das letzte Tor, um eine Seite der Geschichte umzuschreiben; selbst die Niederlage geht in die Chronik ein. Lies die Gesten, wähle die Zeit des Himmels, spiele nachvollziehbare Partien. Sechs Sprachen, komplett offline, keine Käufe, keine Werbung.

### 关键词 (Keywords)

zh-CN 三国,扑克,德州扑克,策略,卡牌,单机,离线,叙事
en-US three kingdoms, poker, texas holdem, strategy, cards, offline, story
ja-JP 三国志,ポーカー,テキサスホールデム,ストーリー,オフライン,カード
ko-KR 삼국,포커,홀덤,전략,카드,오프라인,스토리
es-ES tres reinos, poker, texas holdem, estrategia, cartas, offline
de-DE drei reiche, poker, texas holdem, strategie, karten, offline

### 新增功能 (What's new, 1.0.4)

六语言全面本地化;存档导入导出修复;启动即全屏;竖版界面重设计。

## 年龄评级 (IARC 问卷要点)

- 赌博: 选"不涉及真实货币赌博;虚构筹码的卡牌游戏"(模拟牌类,通常落 ESRB T / PEGI 12)
- 暴力: 历史战争叙事,无血腥画面
- 无用户生成内容、无在线交互、无个人信息收集(隐私政策页可佐证)

## 截图规格

- 1-10 张,桌面 ≥1366×768(推荐 1920×1080),PNG 佳
- 推荐镜头: 标题页 / 目录残卷 / 行军图 / 战书 / 牌局摊牌(主图)/ 六维将卡 + 2-3 张英文界面
- 装机后启动即全屏 → Win+PrtSc 截图(存于 图片\屏幕截图)

## 提交流程备忘

1. Partner Center → 三国：天下为注(已保留) → Packages 上传上面的 MSIX
2. Properties 填隐私政策 URL + 支持联系方式
3. Listings 逐市场填名称/简介/关键词 + 传截图
4. IARC 问卷
5. 定价免费 → Submit(审核通常 1-3 天)
