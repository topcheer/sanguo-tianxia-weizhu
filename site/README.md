# san-gallery — 全端截图志（san.ggcode.uk）

Cloudflare Pages 项目 `san-gallery` 的源码。三泳道轮播展示各端实机截图。

线上：<https://san.ggcode.uk>（生产域名）/ <https://san-gallery.pages.dev>

## 泳道 × 张数

| 泳道 | 张数 | 内容 |
|---|---|---|
| iPhone 竖版 | 10 | 牌局/战书/目录/野卷卡/章节/行军图/标题 + 德日韩战书（六语言） |
| iPad | 3 | 牌局宽版/目录野卷卡/章节网格 |
| 桌面端 | 4 | Electron 全屏标题 / Web 版摊牌·行军图·章节 |

共 17 张 JPEG（q82，~4.8MB），随仓库走，不依赖 /tmp。

## 截图采集（iOS 模拟器）

```bash
# 设备: iPhone 17 Pro 4167138F-… / iPad Air 11" 09A53EBC-…
U=4167138F-DE71-442F-BC31-634C9E71C322
APP=/Volumes/new/XCode/Prod/Debug-iphonesimulator/sanguo-weizhu.app

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
