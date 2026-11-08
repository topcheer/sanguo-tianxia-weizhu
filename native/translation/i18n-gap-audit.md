# i18n 缺口审计(定稿 2026-11-08)

四轴全量审计:①语言包 key 差集 ②PL() 漏抽 ③代码硬编码中文 ④值级(同值拷贝/汉字泄漏)。
基准 zh.json 5724 词条;key 覆盖五语言全绿(缺 0)。缺口均在代码侧与值侧。

## 缺口 A:57 个 PL key 五语言全缺(非 zh 用户必见中文)
战书页 brief.* / 战果页 battle.result* / 卷首 codex.* / 亮相 intro.*。
状态: **待修**(入翻译管道,五语言补译)。

- `battle.resultBack` => 回目录
- `battle.resultChips` => 余军资
- `battle.resultContinue` => 继续行军
- `battle.resultLoss` => 此阵未下
- `battle.resultLossSub` => 军资见底,这一阵没守住。
- `battle.resultLost` => 负
- `battle.resultOpponent` => 对手
- `battle.resultOutcome` => 战果
- `battle.resultWin` => 此阵已下
- `battle.resultWinSub` => 对手军资归零,你带着这一桌的军资继续行军。
- `battle.resultWon` => 胜
- `brief.bossKicker2` => 关底战书
- `brief.bossMeta` => 关底决胜 · 胜则改页
- `brief.bossRole` => 关底敌将
- `brief.deepScroll` => 残卷深处
- `brief.enemyRole` => 遭遇敌将
- `brief.enterNow` => 击 鼓 入 席
- `brief.enterSub` => 进入牌桌
- `brief.lossTag` => 负 则
- `brief.lossTitle` => 所失为何
- `brief.place` => 战地
- `brief.players` => 人同桌
- `brief.practiceKicker` => 野战战书
- `brief.rulePrefix` => 本回战法 · 
- `brief.seal` => 战
- `brief.skirmishKicker2` => 遭遇战书
- `brief.skirmishMeta` => 行军遭遇 · 败亦入卷
- `brief.vs` => 对战
- `brief.vsTag` => 对 阵
- `brief.vsTitle` => 此席与谁争锋
- `brief.whyTag` => 起 因
- `brief.whyTitle` => 为何非战不可
- `brief.winTag` => 胜 利
- `brief.winTitle` => 此局之后
- `codex.motto` => 不必每页皆胜，败亦成章
- `codex.seal` => 卷
- `codex.sub` => 以牌为刃 · 重写意难平
- `intro.caption` => 残卷留影
- `intro.deepScroll` => 残卷深处
- `intro.faction` => 汉末
- `intro.ruleLabel` => 本回战法
- `intro.sealGate` => 关
- `intro.sealMeet` => 遇
- `intro.tap` => 点击继续
- `map.badge` => 军令
- `map.hint` => 择亮起之处而行
- `map.hint2` => 胜则改史 · 败亦入卷
- `map.kicker` => 军令所至
- `page.adaptKicker` => 演义与改写
- `page.cast` => 故人
- `page.chapterNoShort` => 第 
- `page.chapterSuffix` => 回
- `page.dividerSeal` => 若
- `page.spineFoot` => 残卷
- `page.stamp` => 改
- `practice.go` => 点 兵
- `title.seal` => 汉

## 缺口 A2:de 包 brief.* 60 条整块未翻(直接拷贝 zh)
状态: **待修**(de 补译)。

- `brief.fengyiting.adaptation`
- `brief.fengyiting.boss.loss`
- `brief.fengyiting.boss.title`
- `brief.fengyiting.boss.why`
- `brief.fengyiting.boss.win`
- `brief.fengyiting.era`
- `brief.fengyiting.lead`
- `brief.fengyiting.record`
- `brief.fengyiting.skirmish.loss`
- `brief.fengyiting.skirmish.title`
- `brief.fengyiting.skirmish.why`
- `brief.fengyiting.skirmish.win`
- `brief.fengyiting.source`
- `brief.hulao.adaptation`
- `brief.hulao.boss.loss`
- `brief.hulao.boss.title`
- `brief.hulao.boss.why`
- `brief.hulao.boss.win`
- `brief.hulao.era`
- `brief.hulao.lead`
- `brief.hulao.record`
- `brief.hulao.skirmish.loss`
- `brief.hulao.skirmish.title`
- `brief.hulao.skirmish.why`
- `brief.hulao.skirmish.win`
- `brief.hulao.source`
- `brief.sishui.adaptation`
- `brief.sishui.boss.loss`
- `brief.sishui.boss.title`
- `brief.sishui.boss.why`
- `brief.sishui.boss.win`
- `brief.sishui.lead`
- `brief.sishui.record`
- `brief.sishui.skirmish.loss`
- `brief.sishui.skirmish.title`
- `brief.sishui.skirmish.why`
- `brief.sishui.skirmish.win`
- `brief.sishui.source`
- `brief.wancheng.adaptation`
- `brief.wancheng.era`
- `brief.wancheng.lead`
- `brief.wancheng.record`
- `brief.wancheng.skirmish.loss`
- `brief.wancheng.skirmish.title`
- `brief.wancheng.skirmish.why`
- `brief.wancheng.skirmish.win`
- `brief.wancheng.source`
- `brief.yuanshemen.adaptation`
- `brief.yuanshemen.boss.loss`
- `brief.yuanshemen.boss.title`
- `brief.yuanshemen.boss.why`
- `brief.yuanshemen.boss.win`
- `brief.yuanshemen.era`
- `brief.yuanshemen.lead`
- `brief.yuanshemen.record`
- `brief.yuanshemen.skirmish.loss`
- `brief.yuanshemen.skirmish.title`
- `brief.yuanshemen.skirmish.why`
- `brief.yuanshemen.skirmish.win`
- `brief.yuanshemen.source`

## 缺口 A3:ko 包 40 条句内裸嵌中文(翻译工件缺陷,如"接下来/残旗/擜盖")
括号 Hanja 注释(국사(國士))属合法设计;以下为剔除括注后仍含裸 CJK 的词条。
状态: **待修**(逐条修补)。

- `arena.wuguan.brief.battle.why`
- `arena.wuguan.why`
- `arena.wuzhang.why`
- `brief.caochuan.adaptation`
- `brief.changban.revive.loss`
- `brief.chibi.boss.loss`
- `brief.chibi.record`
- `brief.dingjunshan.record`
- `brief.gaopingling.boss.loss`
- `brief.gaopingling.record`
- `brief.guijin.boss.why`
- `brief.huarong.boss.loss`
- `brief.huarong.skirmish.why`
- `brief.qianli.skirmish.win`
- `brief.sanqi.boss.win`
- `brief.shenting.record`
- `brief.sishui.skirmish.why`
- `brief.xiaoyaojin.boss.win`
- `brief.yiling.lead`
- `brief.yuanshemen.adaptation`
- `gen.zhangzhao.bark.badbeat`
- `prologue.0.title`
- `prologue.2.kicker`
- `prologue.3.kicker`
- `prologue.3.text`
- `story.baima.coldOpen.0.text`
- `story.baima.map.0.choices.1.detail`
- `story.baima.map.0.choices.1.text`
- `story.caochuan.objective`
- `story.changban.map.1.choices.1.text`
- `story.dingjunshan.intros.xiahouyuan.0.bio`
- `story.huainan.loss.text`
- `story.jiameng.loss.clue`
- `story.kongcheng.objective`
- `story.luofengpo.map.0.lines.0.text`
- `story.qiqin.battle.3.text`
- `story.qiqin.map.0.lines.1.text`
- `story.qiqin.win.text`
- `story.zhujiu.intros.caocao.1.quote`
- `tell.famous.diaochan.strongFake.1`

## 缺口 A4:en/es 各 1 处专名嵌字
- en `arena.fengyi.brief.battle.win`: "Mei坞" → Meiwu
- es `tell.famous.dongzhuo.strongTrue.1`: "Mei坞" → Meiwu
状态: **待修**。

## 缺口 B:死 key 未接线(翻译早已存在,UI 未消费)
zh.json 有 `term.hand.0-8`(牌型名)/`term.trait.0-5`(六维名)但代码直接用中文常量
(HAND_NAMES/TRAITS→showdownName/describeTraits)。非 zh 用户牌桌牌型名与六维名显示中文。
状态: **待修**(UI 消费点改 `L("term.hand.\(cat)")` 等)。

## 缺口 B2:操作/判定类标签硬编码(用户"无翻译即无从下手",必修)
- `AudioFX.swift:210` 音效开/关(accessibilityLabel,操作项)
- `Screens.swift:955` ") 等 \(roster.count) 将"(战书敌方信息)
- `BattleScreen.swift:414` "胜/负" 摊牌判定章(核心反馈)
状态: **待修**(接 key + 五语言补译)。

## 缺口 C:装饰性中文(用户拍板保留)
- `Screens.swift:415` "英\n雄\n记" 竖排美术字
- `Cinematics.swift:161,163` "中 原"/"江 东" 地图题字
- `PortraitView.swift:49` "武" 肖像占位字
- `CFBundleDisplayName: 三国·天下为注`(project.yml 两处;App 品牌名保留中文)
决策: 印章/美术字美学保留中文,不修。

## 合法同形(勿修)
- ja 297 条同值: 人名(gen.*.name)/地名/年号/卷名,简日同形历史词
- ko Hanja 括注: 국사(國士) 式注释属韩语历史文本惯例

## 修复状态(2026-11-08 收口)

| 缺口 | 处置 | 位置 |
|---|---|---|
| A 57 PL key | ✅ 已修:zh+五语言补译(含术语对齐) | 9528cb5 |
| A2 de 60 brief | ✅ 已修:五章节战书整块德译 | 9528cb5 |
| A3 ko 40 裸嵌 | ✅ 已修:逐词修补(판/행방/권력 등) | 9528cb5 |
| A4 en/es Mei坞 | ✅ 已修:Meiwu | 9528cb5 |
| B term.hand/term.trait 死 key | ✅ 已修:BattleScreen 摊牌名+Odds 面板/Screens 六维名反查接线 | 9528cb5 |
| B 外传内容(apoc.*) | ✅ 已修:36 专名/文案 key×5 语言;Encounters 生成处 L 化(RNG 顺序不变,golden 零断言验证) | 本提交 |
| B BANDS 24 档位词 | ✅ 已修:term.band.{t}.{b}×5 语言;TraitLabel 加 band 序,TraitGrid 接线 | 本提交 |
| B2 音效开关/等N将/胜负章 | ✅ 已修 | 9528cb5 |
| C 装饰字(英雄记/中原江东/武/App 名) | 🈯 保留中文(用户决策:印章/美术字美学) | — |
| ja 297 同值 | ✅ 接受:人名/地名/年号/卷名简日同形;长句(>12字,非 source/era)终检 0 嫌疑 | — |
| ko Hanja 括注 | ✅ 接受:韩语历史文本惯例 | — |
| 系统级 CFBundleDisplayName | 🈯 保留中文品牌名;如需本地化可后续加 InfoPlist.strings | — |

终检基准(全绿):五语言缺 key 0 / ko 裸嵌 0 / en-es-de 汉字 0 / macOS 9/9 / iOS BUILD / en+de 模拟器目检。

## 轴 3 复扫结论(2026-11-08 终态)
修复后复扫 171 处命中,全部归档:
- 保留清单内:英雄记竖排/中原江东美术字/武占位/魏蜀吴印章/卷帙有尽竖排页脚/胜负章与音效标签(跨行 PL 参数)/codex 按钮与图例(PL 元组默认)/TitleScreen 序章固件默认数组
- 引擎内部(非显示路径):TRAITS/BANDS/HAND_NAMES/APOC 常量(UI 层已反查 L)/Table·Poker 断言消息(开发者诊断)/bossTraits 内部键/L10n 语言自称
- 数据缺失兜底(异常路径才触发):playerName "你"/tells 缺省文案/battleResultInfo opponent
- 专名保留:诸葛亮(化身模式)
- 本轮新修:StoryEngine SPEAKERS 说话人名(speaker.* 4 key×5 语言)/TitleScreen 序章按钮 accessibilityLabel×2
