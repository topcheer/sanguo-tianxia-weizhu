# san-gallery — 全端截图志（san.ggcode.uk）

Cloudflare Pages 项目 `san-gallery` 的源码。三泳道轮播展示各端实机截图。

线上：<https://san.ggcode.uk>（生产域名）/ <https://san-gallery.pages.dev>

## 泳道 × 张数

| 泳道 | 张数 | 内容 |
|---|---|---|
| iPhone 竖版 | 14 | 牌局/战书/目录/野卷卡/章节/行军图/标题/演练/天时 + 德日韩英战书牌局 |
| iPad | 7 | 牌局(中英)/战书/行军图/目录野卷卡/章节/标题 |
| iPhone Duo 双面屏 | 7 | 展开态 1398×2034：标题/目录×2/章节/行军/战书/牌局 |
| 桌面端 | 8 | Electron 全屏标题 / Web 版摊牌·行军·章节·卷轴·剧情·倾斜·神态 |

共 36 张 JPEG（q82），随仓库走，不依赖 /tmp。

## 截图采集（iOS 模拟器）

```bash
# 设备: iPhone 17 Pro 4167138F-… / iPad Air 11" 09A53EBC-…
U=4167138F-DE71-442F-BC31-634C9E71C322
APP=/Volumes/new/XCode/Prod/Debug-iphonesimulator/sanguo-weizhu.app

# Duo 双面屏截图需显式 --display(活面 8F6C1ED7-…；B7E9555B-… 为冻结面):
#   xcrun simctl io <duo-udid> screenshot out.png --display 8F6C1ED7-BA7B-4883-8E19-5D8F7C04BD4D
# 直达屏（-ggcodeDebugScreen= codex|chapter|map|omen|briefing|practice|battle）
# battle 为固定种子野战牌桌直达（跳过战书确认，行动栏等待态）— 见 commit 0feebd4
xcrun simctl launch $U dev.ggcode.san -ggcodePortrait -ggcodeDebugScreen=battle

xcrun simctl io $U screenshot out.png          # 截图
idb ui swipe --udid $U --duration 0.3 201 700 201 100   # 滚动
# 语言: -AppleLanguages '(en)' 等五语言

# 压缩入库
sips -s format jpeg -s formatOptions 82 in.png --out shots/iphone/xx.jpg
```

## 重部署

```bash
wrangler pages deploy site --project-name=san-gallery --branch=main
```

自定义域 `san.ggcode.uk`（zone `ggcode.uk` CNAME proxied → san-gallery.pages.dev）
自动指向最新生产部署，无需重绑。
