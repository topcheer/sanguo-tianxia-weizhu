# -*- coding: utf-8 -*-
"""
scripts/build_practice_locales.py
Generates src/locales/practice/{zh-TW,ja,en}.js with 100% complete, authentic Three Kingdoms texts.
"""

import json
import os
import re
import sys
import opencc

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'scripts'))

cc = opencc.OpenCC('s2t')

with open(os.path.join(ROOT, 'practice_dump.json'), 'r', encoding='utf-8') as f:
    RAW_PRACTICE = json.load(f)

ARENAS_DATA = {
    "wenjiu": {
        "en": {
            "name": "Warm Wine Duel",
            "place": "Sishui Pass",
            "year": "191 AD",
            "era": "191 AD · Guandong Coalition Against Dong Zhuo",
            "source": "Records of the Three Kingdoms · Biography of Sun Jian / Romance of the Three Kingdoms Ch. 5",
            "btitle": "Sishui Pass · A Cup Still Warm",
            "lead": "Hua Xiong has slain multiple coalition champions in succession; none dare answer the call. A warrior requests a cup of warm wine and rises from the table — to be drunk upon return, before it cools.",
            "why": "Hua Xiong roars his challenge before the pass while the coalition lords hold their breath. You ask only for a cup of warm wine and stride forth into battle.",
            "win": "The wine remains warm, and the pass has fallen. The warlords in the pavilion will never look upon you the same way again.",
            "loss": "The wine has grown icy cold. Hua Xiong's mocking laughter cuts sharper than the northern wind.",
            "ruleText": "Fast Duel: Starting chips 600, blinds 15/30, rapid blind escalation — before the wine cools.",
            "opponents": [{"title": "Pass Vanguard"}]
        },
        "ja": {
            "name": "温酒に華雄を斬る",
            "place": "汜水関",
            "year": "初平二年 (191年)",
            "era": "初平二年 · 関東連合軍の董卓討伐",
            "source": "『三国志・孫破虜伝』／『三国演義』第五回・温酒斬華雄",
            "btitle": "汜水関 · なお温き酒盃",
            "lead": "華雄は連合軍の猛将を次々と斬り伏せ、本陣に動く者なし。一人の英傑が温め酒を所望して席を立つ——この首を取りて戻るまで、酒は冷めじ。",
            "why": "華雄が関前にて名乗りを上げ、諸侯は息を呑む。汝は一杯の温め酒を求め、颯爽と陣を出づ。",
            "win": "酒はなお温かく、関門は破れたり。陣中の諸侯の見る目、これより一変せん。",
            "loss": "酒は冷え切った。華雄の高笑いが、関外の寒風よりも冷たく響く。",
            "ruleText": "短期決戦：軍資金600、ブラインド15/30、急上昇——酒の温かいうちに。",
            "opponents": [{"title": "関前の梟将"}]
        }
    },
    "shenting": {
        "en": {
            "name": "Fierce Clash at Shenting",
            "place": "Shenting Ridge",
            "year": "194 AD",
            "era": "194 AD · Sun Ce Crossing the River East",
            "source": "Records of the Three Kingdoms · Biography of Taishi Ci / Romance of the Three Kingdoms Ch. 15",
            "btitle": "Shenting Ridge · Broken Halberd, Shattered Armor",
            "lead": "Sun Ce and Taishi Ci crossed paths on Shenting Ridge. Halberds shattered, armor tore, and tumbling down the mountain slope, both men broke into hearty laughter.",
            "why": "Horse against horse, duelists clash until battle banners snap. Discarding his splintered halberd, Taishi Ci bids you show your true mettle atop the ridge.",
            "win": "Diamond cut diamond, general meets worthy peer. He flings down his goblet with a roar of laughter: 'No true friendship without a fight!'",
            "loss": "He picks up your fallen weapon: 'Train for another ten years before challenging me on this ridge again.'",
            "ruleText": "",
            "opponents": [{"title": "Ape-Armed Marksman"}]
        },
        "ja": {
            "name": "神亭の酣戦",
            "place": "神亭嶺",
            "year": "興平元年 (194年)",
            "era": "興平元年 · 孫策の東渡",
            "source": "『三国志・太史慈伝』／『三国演義』第十五回",
            "btitle": "神亭嶺 · 戟折れ甲裂けし後",
            "lead": "小覇王孫策と太史慈、神亭嶺にて狭路相逢う。戟は折れ甲は裂け、斜面を転がり落ちながらも共に大笑せり。",
            "why": "単騎対単騎、旗竿すら圧し折る激突。折れた短戟を投げ捨て、太史慈は嶺上にて真の勝負を挑み来る。",
            "win": "好敵手に出会い、英傑と相見ゆ。彼は杯を投げて豪快に笑う——「戦わずして真の友とはなれぬ！」",
            "loss": "彼は落ちた武器を拾い上げて手渡す——「あと十年鍛え直して、また嶺に来るがよい。」",
            "ruleText": "",
            "opponents": [{"title": "猿臂の神射手"}]
        }
    },
    "zhujiu": {
        "en": {
            "name": "Heroes Over Plum Wine",
            "place": "Prime Minister's Manor at Xudu",
            "year": "199 AD",
            "era": "199 AD · Imperial Capital of Xudu",
            "source": "Records of the Three Kingdoms · Biography of Former Lord / Romance of the Three Kingdoms Ch. 21",
            "btitle": "Boiled Green Plums · Who Is the True Hero",
            "lead": "'In all the world today, the only heroes are you and I.' The table where chopsticks clattered at a thunderclap now holds stacks of chips.",
            "why": "Green plums hang ripe while the cauldron gently simmers. Cao Cao gestures you to take your seat: let the cards decide who the true hero is.",
            "win": "He drains his wine cup in one draught: 'A true hero indeed. This stake, I concede.'",
            "loss": "'Is that all?' His smile remains unbroken, but his hand tightens beneath his sleeve. 'Back to your vegetable patch.'",
            "ruleText": "",
            "opponents": [{"title": "Boiled Wine Host"}]
        },
        "ja": {
            "name": "青梅煮酒に英雄を論ず",
            "place": "許都相府",
            "year": "建安四年 (199年)",
            "era": "建安四年 · 許都",
            "source": "『三国志・先主伝』／『三国演義』第二十一回",
            "btitle": "青梅煮酒 · 誰ぞ真の英雄なる",
            "lead": "「今天下の英雄は、ただ使君と操のみ。」雷鳴に箸を落とせしあの卓上に、今は籌碼が積まれたり。",
            "why": "青梅熟し、小釜の酒煮え立つ。曹孟德は手を挙げ汝を席へ招く——誰が真の英雄か、牌上にて見定めよ。",
            "win": "彼は杯の酒を一気に飲み干す——「流石は英雄。この一勝負、我が負けを認めよう。」",
            "loss": "「その程度か？」笑みは崩さぬも、袖の下の拳は固く握られたり。「菜園の土弄りに戻るがよい。」",
            "ruleText": "",
            "opponents": [{"title": "青梅煮酒の主"}]
        }
    },
    "kongcheng": {
        "en": {
            "name": "Zither of the Empty Fort",
            "place": "Xicheng",
            "year": "228 AD",
            "era": "228 AD · Zhuge Liang's First Northern Expedition",
            "source": "Romance of the Three Kingdoms Ch. 95 · The Empty Fort Stratagem (Pei Songzhi Notes citing Guo Chong)",
            "btitle": "Xicheng · One Zither Against 150,000 Troops",
            "lead": "The city gates swing wide as Zhuge Liang plucks his zither upon the ramparts. Sima Yi's army of 150,000 halts upon the vibration of a single string.",
            "why": "150,000 soldiers below, a lone zither above. He gambles that an ambush lurks within; you gamble that he dare not advance.",
            "win": "The zither string holds unbroken, and the grand army retreats. You have won the wager against his suspicion.",
            "loss": "He flicks his sleeve and rises: 'Empty bluster and amateur trickery.' Behind you, the city gates slam shut.",
            "ruleText": "",
            "opponents": [{"title": "Commander of 150,000"}]
        },
        "ja": {
            "name": "空城の撫琴",
            "place": "西城",
            "year": "建興六年 (228年)",
            "era": "建興六年 · 諸葛亮の第一次北伐",
            "source": "『三国演義』第九十五回・空城の計（裴注引郭沖三事）",
            "btitle": "西城 · 一張の琴と十五万の兵",
            "lead": "城門は広く開け放たれ、孔明は城頭にて静かに琴を爪弾く。司馬懿の率いる十五万の大軍は、ただ一本の琴弦に足を止む。",
            "why": "城下に十五万の兵、城上に一張の琴。敵は伏兵を恐れ、汝は敵の疑心を突く。",
            "win": "琴弦は切れず、大軍は退却せり。汝は敵将の深き多疑に打ち勝てり。",
            "loss": "敵将は袖を払いて立ち上がる——「見え透いた虚勢よ。」城門は背後で重く閉ざされたり。",
            "ruleText": "",
            "opponents": [{"title": "十五万の軍師"}]
        }
    },
    "huarong": {
        "en": {
            "name": "Narrow Path at Huarong",
            "place": "Huarong Trail",
            "year": "208 AD",
            "era": "208 AD · Aftermath of Red Cliffs",
            "source": "Romance of the Three Kingdoms Ch. 50 · Releasing Cao Cao on Huarong Trail",
            "btitle": "Huarong Trail · Will the Blade Fall",
            "lead": "On a treacherous muddy track, Cao Cao flees with only twenty-seven horsemen. Barring the trail with blade in hand stands Guan Yu, bound by old debts of honor.",
            "why": "The flames of Red Cliffs have died, but the trail through Huarong remains blocked. Whether the crescent blade will strike is a wager Guan Yu fights within himself.",
            "win": "You win this critical pot. The blade is sheathed, the road cleared — a debt of chivalry echoes through the ages.",
            "loss": "'My blade strikes not defeated men.' He steps aside, without sparing you a single glance.",
            "ruleText": "",
            "opponents": [{"title": "Righteousness of Ages"}]
        },
        "ja": {
            "name": "華容の狭路",
            "place": "華容道",
            "year": "建安十三年 (208年)",
            "era": "建安十三年 · 赤壁戦後",
            "source": "『三国演義』第五十回・華容道に義を以て曹操を釈す",
            "btitle": "華容道 · 青龍刀は振り下ろされるか",
            "lead": "泥濘む間道、曹操の手勢はわずか二十七騎。大刀を携えて道を塞ぐは、かつて恩義を受けし関雲長なり。",
            "why": "赤壁の炎は鎮まれど、華容の道は塞がれたり。この刀を落とすべきか否か、関公自身もまた胸中で賭けておる。",
            "win": "汝はこの勝負を制せり。青龍刀は収められ、道は開かれた——その義心、天下に轟かん。",
            "loss": "「敗軍の将を斬るは関某の意にあらず。」彼は道を譲るも、汝を一瞥だにせず。",
            "ruleText": "",
            "opponents": [{"title": "義勇千秋の士"}]
        }
    },
    "wuzhang": {
        "en": {
            "name": "Autumn Wind at Wuzhang",
            "place": "Wuzhang Plains",
            "year": "234 AD",
            "era": "234 AD · Zhuge Liang's Final Northern Expedition",
            "source": "Records of the Three Kingdoms · Biography of Zhuge Liang / Romance of the Three Kingdoms Ch. 103",
            "btitle": "Wuzhang Plains · Autumn Wind Against Iron Walls",
            "lead": "A hundred days of stalemate, yet Sima Yi refuses battle. He gambles not merely on the cards, but on whether his opponent can outlast the autumn chill by the Wei River.",
            "why": "When Zhuge Liang sent women's garments to provoke him, Sima Yi wore them with a smile. That terrifying patience is now turned entirely upon this poker table.",
            "win": "You endure until the autumn gale rises. Across the table, the invincible iron bastion reveals its first crack.",
            "loss": "He pushes his cards away and stands: 'What harm is there if this old man defends for another hundred days?' Your chips have run dry first.",
            "ruleText": "Deep Stack Marathon: Starting chips 2400, very slow blind escalation — a test of sheer endurance.",
            "opponents": [{"title": "Steadfast Autumn Defense"}]
        },
        "ja": {
            "name": "五丈原の秋風",
            "place": "五丈原",
            "year": "建興十二年 (234年)",
            "era": "建興十二年 · 諸葛亮最後の北伐",
            "source": "『三国志・諸葛亮伝』／『三国演義』第百三回",
            "btitle": "五丈原 · 秋風と堅壁の対峙",
            "lead": "百日の対峙、司馬懿は守りて戦わず。彼が賭けるは牌にあらず、渭水の秋を相手が耐え抜けるか否かにある。",
            "why": "孔明が婦人の衣を贈って挑発するも、彼は笑みて身に纏いぬ。その恐るべき忍耐が、今や牌卓の上に向けらる。",
            "win": "汝は秋風立つまで耐え抜いたり。対岸の「堅壁」に、初めて亀裂が入りぬ。",
            "loss": "彼は牌を押し退けて立つ——「老夫はさらに百日籠城しようとも構わぬ。」汝の軍資金が先に尽き果てたり。",
            "ruleText": "長期消耗戦：軍資金2400、ブラインド上昇極遅——問われるは忍耐。",
            "opponents": [{"title": "秋風待つ堅壁"}]
        }
    },
    "chencang": {
        "en": {
            "name": "Iron Wall of Chencang",
            "place": "Chencang Citadel",
            "year": "228 AD",
            "era": "228 AD · Zhuge Liang's Second Northern Expedition",
            "source": "Records of the Three Kingdoms · Biography of Cao Zhen (Hao Zhao Appendix) / Romance of the Three Kingdoms Ch. 97",
            "btitle": "Chencang · The Fortress of Twenty Days",
            "lead": "Cloud ladders, battering rams, fire arrows, and sapper tunnels — Hao Zhao held Chencang for over twenty days with barely a thousand men, forcing Zhuge Liang to withdraw empty-handed.",
            "why": "Beneath the citadel of Chencang, offense and defense clash. Every bet you launch crashes directly against his fortified ramparts.",
            "win": "You found the hairline fracture in the fortress masonry. Chencang's iron gates finally yield.",
            "loss": "'Turn back.' Standing atop the ramparts with hand on hilt, not a crease of his robe has been disturbed.",
            "ruleText": "",
            "opponents": [{"title": "Fortress Defender"}]
        },
        "ja": {
            "name": "陳倉の堅壁",
            "place": "陳倉城",
            "year": "太和二年 (228年)",
            "era": "太和二年 · 諸葛亮の第二次北伐",
            "source": "『三国志・曹真伝』付郝昭事／『三国演義』第九十七回",
            "btitle": "陳倉 · 二十日間の籠城",
            "lead": "雲梯、衝車、火矢、坑道——郝昭はわずか千余の兵で陳倉を二十日余り守り抜き、諸葛亮を撤退せしめたり。",
            "why": "陳倉城下、攻守の転換。汝の繰り出す全ての攻勢が、彼の築きし城壁に跳ね返さる。",
            "win": "汝は城壁のわずかな裂け目を見出せり。難攻不落の陳倉に、ついに門が開く。",
            "loss": "「引き返すがよい。」彼は城頭に剣を構えて立ち、衣の裾すら乱れず。",
            "ruleText": "",
            "opponents": [{"title": "千機の守将"}]
        }
    },
    "tianshui": {
        "en": {
            "name": "Kirin of Tianshui",
            "place": "Tianshui Commandery",
            "year": "229 AD",
            "era": "229 AD · Jiang Wei Submits to Han",
            "source": "Records of the Three Kingdoms · Biography of Jiang Wei / Romance of the Three Kingdoms Ch. 93",
            "btitle": "Tianshui · Emergence of the Kirin",
            "lead": "The young prodigy who even made Zhao Yun falter in combat. In astonishment, Zhuge Liang wondered: could such extraordinary talent truly dwell here?",
            "why": "The youthful Jiang Wei sits across the table, his gaze sharper than his spearhead. He calculates not only your cards, but every possible avenue of retreat.",
            "win": "'I shall bequeath all my life's learning to Boyue.' You have won the contest, and secured the next Grand General of Han.",
            "loss": "The young commander raises his spear with a smirk: 'Is this truly all the successor to Prime Minister Zhuge can muster?'",
            "ruleText": "",
            "opponents": [{"title": "Liangzhou Prodigy"}]
        },
        "ja": {
            "name": "天水の麒麟児",
            "place": "天水郡",
            "year": "建興七年 (229年)",
            "era": "建興七年 · 姜維の帰順",
            "source": "『三国志・姜維伝』／『三国演義』第九十三回",
            "btitle": "天水 · 麒麟の初陣",
            "lead": "かの趙雲すら不覚を取った若武者。孔明は驚嘆せり——「この地に斯かる麒麟児がおったとは！」",
            "why": "若き姜伯約が対座し、その眼光は槍先よりも鋭し。汝の手牌のみならず、退路までも読み切らんとす。",
            "win": "「我が学問のすべてを伯約に授けん。」汝はこの勝負を制し、漢の次代を担う大将軍を迎え入れたり。",
            "loss": "若武者は槍を掲げて不敵に笑う——「諸葛丞相の継承者とて、この程度か。」",
            "ruleText": "",
            "opponents": [{"title": "涼州の上士"}]
        }
    },
    "fengyi": {
        "en": {
            "name": "Twin Shadows at Fengyi",
            "place": "Fengyi Pavilion",
            "year": "192 AD",
            "era": "192 AD · Chang'an Weiyang Palace",
            "source": "Book of the Later Han · Biography of Lu Bu / Romance of the Three Kingdoms Ch. 8",
            "btitle": "Fengyi Pavilion · The Halberd and the Chain Plot",
            "lead": "Beside Fengyi Pavilion, Diaochan's weeping figure drives an unbridgeable wedge between foster father and son. Outside the pavilion, the Sky Piercer Halberd gleams.",
            "why": "Foster father and son share the table with dark motives. Sitting between them, Dong Zhuo's boundless greed and Lu Bu's murderous intent both bear down upon you.",
            "win": "The chain plot succeeds. Father and son turn against each other; the wealth of Mei Citadel and the edge of the halberd both fall into your hands.",
            "loss": "The two despots temporarily unite their blades — to eliminate you, the meddling outsider, first.",
            "ruleText": "Sight can deceive: Tell false actions and feints doubled in this duel.",
            "opponents": [{"title": "Lord of Mei Citadel"}, {"title": "Halberd of the Pavilion"}]
        },
        "ja": {
            "name": "鳳儀亭の双影",
            "place": "鳳儀亭",
            "year": "初平三年 (192年)",
            "era": "初平三年 · 長安未央宮",
            "source": "『後漢書・呂布伝』／『三国演義』第八回",
            "btitle": "鳳儀亭 · 方天画戟と連環の計",
            "lead": "鳳儀亭の傍ら、一筋の清流と貂蝉の涙が義父と義子を隔つ。亭外にはすでに方天画戟が煌めく。",
            "why": "義父子が同卓し、互いに腹を探り合う。間に座す汝へ、董卓の強欲と呂布の殺気が一斉に襲いかかる。",
            "win": "連環の計成る。父子は離反し、郿塢の財宝と方天画戟の切っ先は汝の掌中に落ちたり。",
            "loss": "二人は一時矛を収めて手を結び——まず部外者たる汝を排除せんとす。",
            "ruleText": "目に見えるものが真実とは限らず：本局はテル（癖）のフェイク頻度倍増。",
            "opponents": [{"title": "郿塢の主"}, {"title": "亭中の画戟"}]
        }
    },
    "qishui": {
        "en": {
            "name": "Drowning of the Seven Armies",
            "place": "Mian River at Fancheng",
            "year": "219 AD",
            "era": "219 AD · Guan Yu's Northern Campaign",
            "source": "Records of the Three Kingdoms · Biography of Guan Yu / Romance of the Three Kingdoms Ch. 74",
            "btitle": "Fancheng · Autumn Deluge Over Seven Armies",
            "lead": "Autumn rains pour incessantly as the Han River swells into a raging torrent. Yu Jin's seven armies are submerged; Pang De carries his own coffin into battle, drawing short swords when arrows run out.",
            "why": "The raging waters swept away seven encampments, revealing two kinds of commanders: those who yield, and those who fight to the death.",
            "win": "The tide is on your side. Thirty thousand surrendering troops and a wooden coffin are swallowed by the boundless flood.",
            "loss": "Pang De's coffin still stands, but your military treasury has sunk to the riverbed.",
            "ruleText": "",
            "opponents": [{"title": "Commander of Seven Armies"}, {"title": "Coffin-Bearer Duelist"}]
        },
        "ja": {
            "name": "七軍を水攻す",
            "place": "樊城沔水",
            "year": "建安二十四年 (219年)",
            "era": "建安二十四年 · 関羽の北伐",
            "source": "『三国志・関羽伝』／『三国演義』第七十四回",
            "btitle": "樊城 · 秋雨と七軍の壊滅",
            "lead": "連日の秋雨により漢水激流と化す。于禁の七軍は水底に沈み、龐徳は棺を担ぎて出陣、矢尽きれば短兵で斬り結ぶ。",
            "why": "大水は七つの陣営を押し流し、二種類の将を浮き彫りにす——降る者と、死を賭して退かぬ者と。",
            "win": "水勢は汝に味方せり。三万の降兵と一つの棺、すべてこの大水の中に呑まれたり。",
            "loss": "龐徳の棺はなお残れど、汝の軍資金が先に水底へ沈みぬ。",
            "ruleText": "",
            "opponents": [{"title": "七軍の総帥"}, {"title": "棺を担ぐ決死将"}]
        }
    },
    "tongguan": {
        "en": {
            "name": "Vengeance at Tong Pass",
            "place": "Tong Pass",
            "year": "211 AD",
            "era": "211 AD · Battle of Weinan",
            "source": "Records of the Three Kingdoms · Biography of Ma Chao / Romance of the Three Kingdoms Ch. 58",
            "btitle": "Tong Pass · After Cutting the Beard and Shedding the Robe",
            "lead": "'If that Ma boy does not die, I will have no place to be buried.' Cao Cao cuts his beard and discards his cloak to flee; Xu Chu strips bare to duel Ma Chao for two hundred rounds without a victor.",
            "why": "Blood vengeance for a murdered father collides with fierce loyalty to one's lord across the card table. Neither titan will yield a single inch.",
            "win": "The Tiger Fool and Splendid Ma turn their gaze upon you — this wager is truly worthy of the Wei River.",
            "loss": "Two devastating lances press down together. The fierce gales of Tong Pass sweep away your entire fortune.",
            "ruleText": "",
            "opponents": [{"title": "Splendid Ma of Xiliang"}, {"title": "Bare-Chested Berserker"}]
        },
        "ja": {
            "name": "潼関の雪恨",
            "place": "潼関",
            "year": "建安十六年 (211年)",
            "era": "建安十六年 · 渭南の戦い",
            "source": "『三国志・馬超伝』／『三国演義』第五十八回",
            "btitle": "潼関 · 髭を剃り袍を棄てし後",
            "lead": "「馬超児死なずば、我に葬地なし。」曹操は髭を剃り袍を棄てて逃走し、許褚は肌脱ぎとなりて馬超と二百余合激闘す。",
            "why": "父の仇討ちと主君への忠義、牌卓を挟んで激突す。両者ともに一歩も退く気配なし。",
            "win": "虎痴と錦馬超が同時に汝を見据ゆ——この一勝負、渭水の名に恥じぬものなり。",
            "loss": "二筋の長槍が同時に振り下ろさる。潼関の突風が、彼らに代わりて汝の軍資金を奪い去れり。",
            "ruleText": "",
            "opponents": [{"title": "西涼の錦馬超"}, {"title": "裸衣の猛虎"}]
        }
    },
    "baiyi": {
        "en": {
            "name": "White Robes Crossing the River",
            "place": "Jiangling in Jingzhou",
            "year": "219 AD",
            "era": "219 AD · The Fall of Jingzhou",
            "source": "Records of the Three Kingdoms · Biography of Lu Meng / Romance of the Three Kingdoms Ch. 75",
            "btitle": "Jiangling · White-Robed Oarsmen",
            "lead": "Oarsmen dressed in merchant white row softly past beacon towers completely unaware. Upon awakening, the banners of Jingzhou have already changed.",
            "why": "One feigned mortal illness; the other played the humble scholar. Lu Meng and Lu Xun orchestrated a masterpiece of deception — and the stage is set before you.",
            "win": "You saw through every feint and display of weakness. The white-clad flotilla fails to reach the riverbank this time.",
            "loss": "They politely escort you out the door: 'The wind at Lukou is bitter; noble guest, best make haste back home.'",
            "ruleText": "",
            "opponents": [{"title": "White-Clad Merchant"}, {"title": "Modest Scholar"}]
        },
        "ja": {
            "name": "白衣の渡江",
            "place": "荊州江陵",
            "year": "建安二十四年 (219年)",
            "era": "建安二十四年 · 荊州陥落",
            "source": "『三国志・呂蒙伝』／『三国演義』第七十五回",
            "btitle": "江陵 · 白衣の櫓押し",
            "lead": "白衣の商人に扮した兵が櫓を漕ぎ、狼煙台は何も気付かず。夜が明ければ、荊州の城旗はすでに塗り替えられたり。",
            "why": "一人は仮病を装い、一人はへりくだる。呂蒙と陸遜が仕掛けし大芝居——その舞台が汝の前に広がる。",
            "win": "汝は全ての「偽装」を見破れり。白衣の船団は、今回は上陸叶わず。",
            "loss": "彼らは慇懃に汝を送り出す——「陸口は風が強うございます、お早めにお引き取りを。」",
            "ruleText": "",
            "opponents": [{"title": "白衣の商人"}, {"title": "謙虚なる書生"}]
        }
    },
    "yanglu": {
        "en": {
            "name": "Bonds of Yang and Lu",
            "place": "Jingzhou Border",
            "year": "272 AD",
            "era": "272 AD · Confrontation of Wu and Jin",
            "source": "Book of Jin · Biography of Yang Hu / Records of the Three Kingdoms · Biography of Lu Kang",
            "btitle": "Borderlands · Rival Masters at Play",
            "lead": "Armies clash across the border, yet commanders exchange fine wine and remedies. Yang Hu and Lu Kang are bitter foes on the field, yet each other's truest confidants in life.",
            "why": "They swore to speak only of breeze and moon rather than war. But once chips are pushed onto the felt, even kindred spirits must test their mettle.",
            "win": "'In this bout, I concede.' He raises his cup with a gentle smile: 'Until next season — so long as both of us remain.'",
            "loss": "He accepts your gift of wine: 'Your tactical mastery still lacks a final touch of maturity.'",
            "ruleText": "",
            "opponents": [{"title": "Robed Gentleman General"}, {"title": "Last Pillar of Jiangdong"}]
        },
        "ja": {
            "name": "羊陸の交わり",
            "place": "荊州国境",
            "year": "泰始八年 (272年)",
            "era": "泰始八年 · 呉晋の対峙",
            "source": "『晋書・羊祜伝』／『三国志・陸抗伝』",
            "btitle": "国境 · 盤上の好敵手",
            "lead": "国境で相争いながらも、酒や良薬を贈り合う。羊祜と陸抗は敵にして、生涯唯一の知己なり。",
            "why": "二人は風月のみを語り兵火を論ぜずと約す。然れど籌碼卓上に並べば、知己とて真剣勝負を避く能わず。",
            "win": "「この勝負、羊祜の負けでござる。」彼は微笑みて杯を掲ぐ——「また来年相見えん、互いに息災ならば。」",
            "loss": "彼は汝の贈った酒を受け取りつぶやく——「貴殿の読み、いま一歩及ばず。」",
            "ruleText": "",
            "opponents": [{"title": "軽裘緩帯の将"}, {"title": "江東最後の柱石"}]
        }
    },
    "ganlu": {
        "en": {
            "name": "Coup of the Ganlu Era",
            "place": "Southern Watchtower of Luoyang",
            "year": "260 AD",
            "era": "260 AD · Coup at Luoyang Palace",
            "source": "Records of the Three Kingdoms · Annals of Three Young Emperors / Book of Jin · Annals of Emperor Wen",
            "btitle": "Southern Watchtower · Ambition Known to All",
            "lead": "'Sima Zhao's intent is known to every passerby on the road.' Emperor Cao Mao drew his imperial sword in despair, slain beneath the southern watchtower.",
            "why": "The young emperor's blood has barely cooled. The regicide's bloody blade and the mastermind behind the curtain invite you to their deadly table.",
            "win": "You survived their lethal gambit to the very end. This time, Cheng Ji's butcher blade strikes his own accomplices.",
            "loss": "Jia Chong snaps his sleeve with sneering disdain: 'A foolish mortal dare play cards with us?' Your fate ends no better than the doomed emperor.",
            "ruleText": "",
            "opponents": [{"title": "Regicide Blade"}, {"title": "Known to All on the Road"}]
        },
        "ja": {
            "name": "甘露の変",
            "place": "洛陽南闕",
            "year": "甘露五年 (260年)",
            "era": "甘露五年 · 洛陽宮変",
            "source": "『三国志・三少帝紀』／『晋書・文帝紀』",
            "btitle": "南闕 · 路傍の野心",
            "lead": "「司馬昭の心は、路傍の人も知る所なり。」若き天子曹髦は剣を抜きて立ち向かうも、南闕の下に散りぬ。",
            "why": "若き皇帝の血潮未だ乾かず。弑逆の刃と黒幕の影が、汝を死線渦巻く卓へと誘う。",
            "win": "汝は奸計の罠を生き抜いたり。成済の兇刃は、今回味方へと向かいて自滅せり。",
            "loss": "賈充は冷ややかに袖を払う——「愚か者が、我らと牌を語る気か。」汝の末路、あの天子と大差なかりき。",
            "ruleText": "",
            "opponents": [{"title": "成済の凶刃"}, {"title": "路傍の野心家"}]
        }
    },
    "yinping": {
        "en": {
            "name": "Lone Army at Yinping",
            "place": "Yinping Ancient Trail",
            "year": "263 AD",
            "era": "263 AD · Conquest of Shu by Wei",
            "source": "Records of the Three Kingdoms · Biography of Deng Ai / Romance of the Three Kingdoms Ch. 117",
            "btitle": "Yinping · Seven Hundred Li of Cliffs",
            "lead": "Across seven hundred li of uninhabited wilderness, carving roads through sheer rock and wrapping themselves in felt blankets to roll down cliffs. The garrison of Jiangyou surrendered without firing a shot.",
            "why": "Father and son lead an isolated vanguard; behind them lie precipitous cliffs, and before them stands you. Retreat means certain death; forward lies your chip stack.",
            "win": "Even miracles of infiltration have their limits. You severed the perilous mountain path; the winds at Mianzhu have shifted forever.",
            "loss": "They descended like specters from the heavens. Before you could even kindle the beacon fires, your forces fell.",
            "ruleText": "",
            "opponents": [{"title": "Felt-Wrapped Climber"}, {"title": "Vanguard Son"}]
        },
        "ja": {
            "name": "陰平の孤軍",
            "place": "陰平古道",
            "year": "景元四年 (263年)",
            "era": "景元四年 · 魏の蜀討伐",
            "source": "『三国志・鄧艾伝』／『三国演義』第百十七回",
            "btitle": "陰平 · 七百里の絶壁",
            "lead": "七百里の人跡未踏の険谷、岩を穿ち道を切り開き、毛布に身を包みて断崖を転がり落つ。江油の守将は戦わずして降れり。",
            "why": "鄧艾父子は孤軍深く潜入し、背後は断崖絶壁、眼前には汝。退けば死、進めば汝の軍資金あり。",
            "win": "奇襲にも限度あり。汝が険路を封鎖したれば、綿竹の戦況は一変せり。",
            "loss": "敵は天より降り立ちぬ。狼煙を上げる間すら与えられず完敗せり。",
            "ruleText": "",
            "opponents": [{"title": "毛布を巻く奇襲将"}, {"title": "先鋒の猛子"}]
        }
    },
    "ruxu": {
        "en": {
            "name": "Confrontation at Ruxu",
            "place": "Ruxu Estuary",
            "year": "213 AD",
            "era": "213 AD · Cao Cao's Campaign Against Wu",
            "source": "Records of the Three Kingdoms · Biography of Sun Quan / Romance of the Three Kingdoms Ch. 61",
            "btitle": "Ruxu · 400,000 Troops Hold Their Ground",
            "lead": "'A son should be like Sun Zhongmou.' Cao Cao marched 400,000 troops to the riverside; Sun Quan checked him with 70,000, locked in standoff for over a month.",
            "why": "Overwhelming legions mass at the border without striking — Cao Cao waits for the opponent's lines to fray. Xu Huang's fortified redoubt rises beside your flank.",
            "win": "You were not the first to break under pressure. The supreme commander of 400,000 lays down his hand in defeat.",
            "loss": "'Strengthen the ramparts and hold for ten more days.' Cao Cao sips his hot tea leisurely while your chips vanish in the river wind.",
            "ruleText": "",
            "opponents": [{"title": "Commander of 400,000"}, {"title": "Paragon of Discipline"}]
        },
        "ja": {
            "name": "濡須の対塁",
            "place": "濡須水口",
            "year": "建安十八年 (213年)",
            "era": "建安十八年 · 曹操の呉親征",
            "source": "『三国志・呉主伝』／『三国演義』第六十一回",
            "btitle": "濡須 · 四十万の待機",
            "lead": "「子を産まば孫仲謀の如くなるべし。」曹操は四十万の大軍を江頭に進め、孫権は七万で迎え撃ち、月余にわたり対陣す。",
            "why": "大軍押し寄せるも進軍を止め——敵の自滅を待つ曹操。徐晃の堅固なる砦が汝の側面に立ち塞がる。",
            "win": "先に根負けしたのは汝にあらず。四十万の大軍を率いる覇王、牌を投げて負けを認む。",
            "loss": "「堅壁を固め、さらに十日耐えよ。」曹操は静かに茶を啜り、汝の軍資金は江風に消え失せぬ。",
            "ruleText": "",
            "opponents": [{"title": "四十万の覇王"}, {"title": "周亜夫の気風"}]
        }
    },
    "sanying": {
        "en": {
            "name": "Three Heroes at One Table",
            "place": "Hulao Pass",
            "year": "190 AD",
            "era": "190 AD · Eighteen Warlords Against Dong Zhuo",
            "source": "Romance of the Three Kingdoms Ch. 5 · Three Heroes Fight Lu Bu",
            "btitle": "Hulao Pass · One Against the Three Sworn Brothers",
            "lead": "Before Hulao Pass, Liu Bei, Guan Yu, and Zhang Fei rode out together; even Lu Bu could not withstand their joint assault and dragged his halberd in retreat.",
            "why": "When the three brothers join forces, even Lu Bu must give ground. Today all three sit at your table to test the weight of your solitary resolve.",
            "win": "You withstood the relentless charges of the Peach Garden trio. A triumph worthy of inscription into the finest historical chronicle.",
            "loss": "'Third brother, hold.' Liu Bei restrains a furious Zhang Fei with a calm sigh: 'This one is no Lu Bu.'",
            "ruleText": "",
            "opponents": [{"title": "Straw Weaver Ambition"}, {"title": "Mounted Archer"}, {"title": "Fierce-Eyed Man of Yan"}]
        },
        "ja": {
            "name": "三英同卓",
            "place": "虎牢関",
            "year": "初平元年 (190年)",
            "era": "初平元年 · 十八路諸侯の董卓討伐",
            "source": "『三国演義』第五回・三英戦呂布",
            "btitle": "虎牢関 · 一人して三英に抗す",
            "lead": "虎牢関の前にて劉・関・張の三騎が並び立ち、無双の呂布すら防ぎ切れず方天画戟を引いて退却せり。",
            "why": "三兄弟が揃えば呂布すら後退す。今日その三人が同卓し、汝一人の器量を試しに来る。",
            "win": "汝は桃園三傑の猛攻をことごとく受け止めたり。この戦績、史書の金字塔として刻まれん。",
            "loss": "「三弟、兵を引け。」劉備は昂ぶる張飛を制す——「この御仁は呂布ではない。」",
            "ruleText": "",
            "opponents": [{"title": "草鞋売りの志"}, {"title": "馬弓手"}, {"title": "燕人張飛"}]
        }
    },
    "shezhan": {
        "en": {
            "name": "Debating the Scholars",
            "place": "Chaisang Council Chamber",
            "year": "208 AD",
            "era": "208 AD · Eve of the Sun-Liu Alliance",
            "source": "Romance of the Three Kingdoms Ch. 43 · Debating the Scholars of Wu",
            "btitle": "Chaisang · One Tongue Against All Jiangdong",
            "lead": "Zhuge Liang crossed the Yangtze in a solitary skiff, besieged by over twenty venerable scholars led by Zhang Zhao. A single sharp wit against overwhelming odds.",
            "why": "The silver-tongued ministers of Jiangdong surround your seat. What hangs on this duel is not merely chips, but the fateful choice between surrender and war.",
            "win": "Silence falls across the grand hall. Zhang Zhao raises his cup first: 'Please accept our toast, sir — for the alliance.'",
            "loss": "'If you cannot even outargue us, how could you sway our master?' Amid mocking laughter, you are ushered out of Chaisang.",
            "ruleText": "",
            "opponents": [{"title": "Pillar of Jiangdong"}, {"title": "Outspoken Veteran"}, {"title": "Orange-Cherishing Scholar"}]
        },
        "ja": {
            "name": "群儒に舌戦す",
            "place": "柴桑議事堂",
            "year": "建安十三年 (208年)",
            "era": "建安十三年 · 孫劉同盟の前夜",
            "source": "『三国演義』第四十三回・舌戦群儒",
            "btitle": "柴桑 · 一舌にして江東を論破す",
            "lead": "孔明は小舟にて江を渡り、張昭ら二十余人の名臣が取り囲みて舌鋒を振るう。一張の琴、百倍の弁舌に立ち向かうが如し。",
            "why": "江東の能弁家たちが汝を取り囲む。この勝負で争うは籌碼のみならず、「降伏」か「開戦」かの天下の命運なり。",
            "win": "満座静まり返る。張昭がまず杯を掲ぐ——「先生、同盟のために乾杯を。」",
            "loss": "「我ら一人説得できぬ者に、我が主君を動かせようか。」嘲笑の中、柴桑を追い出されたり。",
            "ruleText": "",
            "opponents": [{"title": "江東の重鎮"}, {"title": "直言の宿老"}, {"title": "懐橘の孝子"}]
        }
    },
    "guandu": {
        "en": {
            "name": "Stalemate at Guandu",
            "place": "Guandu",
            "year": "200 AD",
            "era": "200 AD · Decisive Clash of Yuan and Cao",
            "source": "Records of the Three Kingdoms · Annals of Emperor Wu / Romance of the Three Kingdoms Ch. 30",
            "btitle": "Guandu · A Torch Against 100,000 Troops",
            "lead": "A hundred thousand against thirty thousand, with supplies in desperate imbalance. Cao Cao torched Wuchao, and Yuan Shao's grand empire crumbled overnight.",
            "why": "Hebei commands vast lands and hordes of men, pressing you from all sides of the table. You hold only a single spark aimed at their supply lines.",
            "win": "You were the one who kindled the fire at Wuchao. The four-generation dynasty's fortunes scatter across the felt.",
            "loss": "Yuan Shao claps his hands with a booming laugh: 'Might makes right!' This time, fortune favored him far better than history recorded.",
            "ruleText": "",
            "opponents": [{"title": "Lord of Four Generations"}, {"title": "Fierce General of Hebei"}, {"title": "Iron Spear of Heshuo"}]
        },
        "ja": {
            "name": "官渡の対峙",
            "place": "官渡",
            "year": "建安五年 (200年)",
            "era": "建安五年 · 官渡決戦",
            "source": "『三国志・武帝紀』／『三国演義』第三十回",
            "btitle": "官渡 · 一筋の火種と十万の兵",
            "lead": "十万対三万、兵糧の差は絶望的。曹操は烏巣の糧道を焼き払い、袁紹の大軍は一夜にして崩壊せり。",
            "why": "河北の広大さと兵力、卓上より幾重にも重圧が加わる。汝の手にはただ一筋の「兵糧庫を焼く」火種のみ。",
            "win": "烏巣の火は汝が放ちしもの。四世三公の誇る名家の財産は、この卓上で灰燼に帰したり。",
            "loss": "袁紹は手を叩いて大笑す——「兵の多さこそ正義よ！」今回ばかりは史書以上の豪運に恵まれぬ。",
            "ruleText": "",
            "opponents": [{"title": "四世三公の雄"}, {"title": "河北の名将"}, {"title": "河朔の猛将"}]
        }
    },
    "xiaoyao": {
        "en": {
            "name": "At Xiaoyao Ford",
            "place": "Xiaoyao Ford",
            "year": "215 AD",
            "era": "215 AD · Battle of Hefei",
            "source": "Records of the Three Kingdoms · Biography of Zhang Liao / Romance of the Three Kingdoms Ch. 67",
            "btitle": "Xiaoyao Ford · Eight Hundred Against 100,000",
            "lead": "Eight hundred warriors smashed clean through a host of a hundred thousand; Sun Quan was nearly taken captive. 'Zhang Liao is coming!' became a cry that hushed crying children in the dead of night.",
            "why": "'Liao is here! Liao is here!' The three veterans strike like a lightning bolt, hitting your flank from the least expected angle.",
            "win": "You held your formation steady. The legend of the eight hundred halts firmly before your barricades.",
            "loss": "'Liao is here!' Before the battle cry finishes echoing, your rear lines have utterly collapsed.",
            "ruleText": "",
            "opponents": [{"title": "Cry-Silencing General"}, {"title": "Breaching Vanguard"}, {"title": "Selfless Veteran"}]
        },
        "ja": {
            "name": "逍遥津の戦い",
            "place": "逍遙津",
            "year": "建安二十年 (215年)",
            "era": "建安二十年 · 合肥の戦い",
            "source": "『三国志・張遼伝』／『三国演義』第六十七回",
            "btitle": "逍遙津 · 八百の決死隊と十万の軍",
            "lead": "わずか八百騎が十万の大軍を蹂躙し、孫権は危うく生け捕らる所なりき。「張遼来たる」の一言、江東の泣く子も黙ると伝わる。",
            "why": "「遼来たる！遼来たる！」三将の突撃は、常に汝の思いも寄らぬ死角より斬り込んで来る。",
            "win": "汝は陣形を崩さず持ち堪えたり。八百騎の伝説、汝の鉄壁の前に止まる。",
            "loss": "「遼来たる——！」叫喚未だ止まぬうちに、汝の後陣は跡形もなく瓦解せり。",
            "ruleText": "",
            "opponents": [{"title": "啼く子も黙る名将"}, {"title": "先登陥陣の勇"}, {"title": "私心を捨てた将"}]
        }
    },
    "baimenlou": {
        "en": {
            "name": "Beneath White Gate Tower",
            "place": "Baimen Tower at Xiapi",
            "year": "198 AD",
            "era": "198 AD · Siege of Xiapi",
            "source": "Records of the Three Kingdoms · Biography of Lu Bu / Romance of the Three Kingdoms Ch. 19",
            "btitle": "Baimen Tower · Fate of the Peerless Warrior",
            "lead": "Atop White Gate Tower, Lu Bu pleaded for mercy until Liu Bei's chilling whisper — 'Do you not recall the fates of Ding Yuan and Dong Zhuo?' — sealed his doom.",
            "why": "A peerless warlord, a brilliant tactician, and an ironclad battalion — an army that should never have fallen, had they stood united.",
            "win": "Their chronic inability to act in concert became their undoing under your pressure. The death wind of Baimen Tower blows past you toward others.",
            "loss": "'The ropes are bound too tight, loosen them!' But this time, it is you who are bound hand and foot.",
            "ruleText": "",
            "opponents": [{"title": "Twilight at the Camp Gate"}, {"title": "Stubborn Tactician"}, {"title": "Breaching Battalion Commander"}]
        },
        "ja": {
            "name": "白門楼の落日",
            "place": "下邳白門楼",
            "year": "建安三年 (198年)",
            "era": "建安三年 · 曹操の下邳包囲",
            "source": "『三国志・呂布伝』／『三国演義』第十九回",
            "btitle": "白門楼 · 天下無双の末路",
            "lead": "白門楼の上、呂布は命乞いをするも、劉備の「丁建陽や董卓の結末をお忘れか」の一言がその命運を決したり。",
            "why": "天下無双の豪傑、王佐の才ある軍師、鉄の軍紀を誇る陥陣営——結束すれば決して敗れぬはずの陣容なり。",
            "win": "連携を欠く彼らの宿痾を突き、致命の一撃を与えたり。白門楼の冷風は彼方へと吹き去りぬ。",
            "loss": "「縄目が厳しすぎる、緩めてくれ！」——今回縛り上げられたるは、汝自身なりき。",
            "ruleText": "",
            "opponents": [{"title": "轅門の落日"}, {"title": "画地為守の策士"}, {"title": "陥陣営の都督"}]
        }
    },
    "guijin": {
        "en": {
            "name": "Tower Ships of Wang Jun",
            "place": "Stone Citadel at Jianye",
            "year": "280 AD",
            "era": "280 AD · Unification Under Jin",
            "source": "Book of Jin · Biography of Wang Jun / Romance of the Three Kingdoms Ch. 120",
            "btitle": "Stone Citadel · The White Flag of Surrender",
            "lead": "'Wang Jun's towering flagships sailed down from Yizhou; the imperial aura of Jinling quietly faded.' A white flag emerged from the Stone Citadel, bringing the Three Kingdoms to its close.",
            "why": "Iron chains stretched across the river could not halt the grand fleet; the divided realm reunites at last. The three commanders of the finale await you at this table.",
            "win": "You halted the invincible warships upon the river. History's chronicle opens an extra unwritten page just for you.",
            "loss": "The iron chains sink and the tower ships crest the waves. Amid the churning current, you surrender your final chip.",
            "ruleText": "",
            "opponents": [{"title": "Founding Jin Emperor"}, {"title": "Fleet Commander"}, {"title": "Zuo Zhuan General"}]
        },
        "ja": {
            "name": "王濬の楼船",
            "place": "建業石頭城",
            "year": "太康元年 (280年)",
            "era": "太康元年 · 三国帰晋",
            "source": "『晋書・王濬伝』／『三国演義』第百二十回",
            "btitle": "石頭城 · 翻る降伏の白旗",
            "lead": "「王濬の楼船 益州を下り、金陵の王気 黯然として収まる。」石頭城より降伏の白旗掲げられ、三国鼎立の世ここに幕を閉ず。",
            "why": "江を渡す鉄鎖も巨艦を阻み得ず、天下はついに一つに定まる。歴史の幕を引く三者が、汝を待ち受く。",
            "win": "汝は江上にてこの巨艦を食い止めたり。歴史の最終章に、汝のための新たな一頁が刻まる。",
            "loss": "鉄鎖は江に沈み、楼船は波を蹴立てて進む。逆巻く濁流の中、汝は最後の籌碼を失えり。",
            "ruleText": "",
            "opponents": [{"title": "禅譲を受けし帝"}, {"title": "楼船東下の提督"}, {"title": "左伝を愛する将"}]
        }
    },
    "tingzhu": {
        "en": {
            "name": "Four Pillars of Hebei",
            "place": "Jizhou Citadel",
            "year": "199 AD",
            "era": "199 AD · Hegemony Over Hebei",
            "source": "Romance of the Three Kingdoms Ch. 26 · Four Pillars and One Beam",
            "btitle": "Jizhou · Four Lances of the North",
            "lead": "Yan Liang, Wen Chou, Zhang He, and Gao Lan — the four sharpest spears in all Hebei. Though Qu Yi fell early, the four mighty pillars still stand tall.",
            "why": "Four lethal spears line up abreast. Yuan Shao has staked the entire wealth and pride of Hebei on this single table.",
            "win": "The four pillars break. The debts of Baima and Yanjin are settled in full.",
            "loss": "'Hebei lacks not for champions.' Yuan Shao toasts behind the curtain as four lances strip away every chip you own.",
            "ruleText": "",
            "opponents": [{"title": "Fallen at Baima"}, {"title": "Fallen at Yanjin"}, {"title": "Master of Swift Formations"}, {"title": "Iron Shield of the Line"}]
        },
        "ja": {
            "name": "河北の四庭柱",
            "place": "冀州城",
            "year": "建安四年 (199年)",
            "era": "建安四年 · 河北争覇",
            "source": "『三国演義』第二十六回・四庭柱一正梁",
            "btitle": "冀州 · 河北の四本槍",
            "lead": "顔良、文醜、張郃、高覧——河北に轟く四振りの名槍。正梁たる麹義は早く世を去るも、四柱は今なお健在なり。",
            "why": "四振りの剛槍が一列に並ぶ。袁紹は河北の威信と底力のすべてを、この卓上に賭けたり。",
            "win": "四柱はへし折れたり。白馬と延津の因縁、ここに清算されぬ。",
            "loss": "「河北に人材多し。」幕裏より袁紹が杯を掲ぐ。四振りの槍に全財産を奪い尽くされたり。",
            "ruleText": "",
            "opponents": [{"title": "白馬に散りし猛将"}, {"title": "延津に散りし剛将"}, {"title": "巧変の軍才"}, {"title": "列陣の鉄壁"}]
        }
    },
    "huainan": {
        "en": {
            "name": "Three Rebellions of Huainan",
            "place": "Shouchun",
            "year": "255 AD",
            "era": "255 AD · Second Rebellion in Huainan",
            "source": "Records of the Three Kingdoms · Biography of Guanqiu Jian / Book of Jin · Annals of Emperor Jing",
            "btitle": "Shouchun · Three Uprisings in One Fortress",
            "lead": "Three times Shouchun rose in armed revolt, and three times the Sima clan crushed the dissent. The sharpest spark was eighteen-year-old Wen Yang charging the enemy host single-handedly.",
            "why": "The rebel generals of Huainan unite as a single fist — and this time, the gates of Shouchun refuse to yield.",
            "win": "'The Sima clan's mandate amounts to nothing more than this.' Atop the battlements, they clink their cups in honor of your victory.",
            "loss": "On the eve of the city's fall, they shattered your lines first. The fate of Huainan remains unbroken.",
            "ruleText": "",
            "opponents": [{"title": "Loyalist of Nandun"}, {"title": "Bingzhou Veteran Cavalier"}, {"title": "Huainan Scholar-Rebel"}, {"title": "Lone Charger at Eighteen"}]
        },
        "ja": {
            "name": "淮南の三叛",
            "place": "寿春",
            "year": "正元二年 (255年)",
            "era": "正元二年 · 淮南の反乱",
            "source": "『三国志・毌丘倹伝』／『晋書・景帝紀』",
            "btitle": "寿春 · 三つの反乱の城",
            "lead": "寿春にて三度の反乱起き、司馬氏は三度これを平定す。その中でも最も輝きし刃は、文鴦が十八歳にて単騎敵陣を破りし突撃なり。",
            "why": "歴戦の叛将たちが一本の綱となり結束す——今度こそ寿春の門は開かれじ。",
            "win": "「司馬氏の天命とてこの程度か。」城頭の将らは、汝の軍功を祝して杯を交わしぬ。",
            "loss": "城落つる前夜、彼らは汝の陣を先に破れり。淮南の風向きは依然変わらず。",
            "ruleText": "",
            "opponents": [{"title": "南頓の忠臣"}, {"title": "并州の古参騎兵"}, {"title": "淮南の儒将"}, {"title": "単騎で軍を退けし若武者"}]
        }
    },
    "tongquetai": {
        "en": {
            "name": "Contest for the Robe",
            "place": "Bronze Sparrow Terrace at Yecheng",
            "year": "210 AD",
            "era": "210 AD · Grand Banquet at Bronze Sparrow Terrace",
            "source": "Romance of the Three Kingdoms Ch. 56 · Banquet at Bronze Sparrow Terrace",
            "btitle": "Bronze Sparrow Terrace · The High-Hanging Brocade",
            "lead": "Cao Cao hung a robe of Shu brocade upon a weeping willow bough; his generals displayed their finest marksmanship, each arrow competing for the coveted prize.",
            "why": "The brocade robe hangs suspended above the table. Cao Cao's elite warriors take their turns — but this time, the duel is decided not by arrows, but by chips.",
            "win": "The brocade robe is draped across your shoulders. The assembled warriors salute in unison: 'Your poker mastery truly earns this prize!'",
            "loss": "Xu Chu slings the robe over his shoulder with a grunt: 'Couldn't outshoot me, and now you can't even outplay me?'",
            "ruleText": "",
            "opponents": [{"title": "Swift Divine Archer"}, {"title": "Mounted Marksman"}, {"title": "Robe-Piercing Archer"}, {"title": "Robe-Snatching Brawler"}]
        },
        "ja": {
            "name": "銅雀台の錦袍争奪",
            "place": "鄴城銅雀台",
            "year": "建安十五年 (210年)",
            "era": "建安十五年 · 銅雀台の大宴",
            "source": "『三国演義』第五十六回・曹操大宴銅雀台",
            "btitle": "銅雀台 · 高く掲げられし錦袍",
            "lead": "曹操は蜀錦の戦袍を柳の枝に掛け、諸将は己の武芸を競い、放つ矢ごとに技を競い合いぬ。",
            "why": "錦の戦袍は牌卓の真上に掲げらる。魏の猛将たちが代わる代わる名乗りを上ぐ——競うは弓箭にあらず、籌碼なり。",
            "win": "錦袍は汝の肩に掛けられたり。満座の将兵が拱手して称える——「この牌技、まさにこの袍を纏うに相応し！」",
            "loss": "許褚は錦袍を肩に担ぎて鼻を鳴らす——「弓でも牌でも敵わぬと見えるな！」",
            "ruleText": "",
            "opponents": [{"title": "妙才の神弓"}, {"title": "疾駆する弓騎"}, {"title": "一矢で袍を射抜く手"}, {"title": "袍を奪い合う豪腕"}]
        }
    },
    "shangfanggu": {
        "en": {
            "name": "Rain at Shangfang Valley",
            "place": "Shangfang Valley",
            "year": "234 AD",
            "era": "234 AD · Zhuge Liang's Sixth Northern Expedition",
            "source": "Romance of the Three Kingdoms Ch. 103 · Sima Trapped in Shangfang Valley",
            "btitle": "Shangfang Valley · The Rain That Never Came",
            "lead": "Flames erupted throughout the valley as Sima Yi and his sons wept in despair. Suddenly heaven opened up in downpour, quenching the inferno at the final hour.",
            "why": "Crawling out from the jaws of fiery doom, the four survivors channel all their desperate ferocity straight at you.",
            "win": "This time, heaven sends no rain. The cleansing flames of Shangfang Valley burn down to the very embers.",
            "loss": "A sudden 'downpour' douses your momentum. Wiping soot from his cheek, Sima Yi smirks: 'The mandate of heaven.'",
            "ruleText": "",
            "opponents": [{"title": "Old Fox of the Valley"}, {"title": "Resolute Strategist"}, {"title": "Survivor Son"}, {"title": "Veteran of Yongzhou"}]
        },
        "ja": {
            "name": "上方谷の驟雨",
            "place": "上方谷",
            "year": "建興十二年 (234年)",
            "era": "建興十二年 · 諸葛亮の第六次北伐",
            "source": "『三国演義』第百三回・上方谷司馬受困",
            "btitle": "上方谷 · 降り来たらぬ雨",
            "lead": "谷間に猛火燃え上がり、司馬懿父子は抱き合いて号泣す。俄かに天より豪雨降り注ぎ、命運を分かつ火焔を消し止めたり。",
            "why": "死地より這い出でし父子四人。九死に一生を得た執念の牙が、すべて汝へと向けらる。",
            "win": "今度は雨の降ることなし。上方谷の火は燃え尽き、敵将を焼き尽くせり。",
            "loss": "突如たる「豪雨」が汝の攻勢を消し去る。司馬懿は煤を拭い笑む——「これぞ天意よ。」",
            "ruleText": "",
            "opponents": [{"title": "劫火を生き延びし古狐"}, {"title": "沈毅多略の策士"}, {"title": "谷底の生還者"}, {"title": "雍州の老将"}]
        }
    },
    "wuguan": {
        "en": {
            "name": "Five Passes Across a Thousand Li",
            "place": "Thousand-Li Post Road",
            "year": "200 AD",
            "era": "200 AD · Renouncing Rank and Gold",
            "source": "Romance of the Three Kingdoms Ch. 27 · Crossing Five Passes and Slaying Six Generals",
            "btitle": "The Post Road · Five Passes and Six Generals",
            "lead": "A single carriage with two sisters-in-law, a lone rider galloping into the dust. Five fortresses and six guardian generals could not halt the march of sheer honor.",
            "why": "Five checkpoints with passports demanded, poisoned wine, ambushes, and fire traps — all transformed into five relentless tests across the felt.",
            "win": "All five passes breached, the Yellow River opens before you. You traversed this gauntlet with even steadier resolve than Guan Yu himself.",
            "loss": "'Seize them!' Signal fires erupt across all five passes. This time, there is no way through.",
            "ruleText": "",
            "opponents": [{"title": "Dongling Pass Guardian"}, {"title": "Governor of Luoyang"}, {"title": "Monastery Ambush"}, {"title": "Xingyang Fire Plot"}, {"title": "Yellow River Ferryman"}]
        },
        "ja": {
            "name": "千里走単騎・五関突破",
            "place": "千里の官道",
            "year": "建安五年 (200年)",
            "era": "建安五年 · 官印返上と出立",
            "source": "『三国演義』第二十七回・過五関斬六将",
            "btitle": "官道 · 五関六将",
            "lead": "一輌の車と二人の義姉、一騎の駿馬が砂塵を巻き上ぐ。五つの関所、六人の守将とて、ただ一つの「義」を止める能わず。",
            "why": "手形改め、毒酒、焼き討ち、伏兵——五つの難関が今や牌卓上の五連戦の猛攻と化す。",
            "win": "五関をことごとく突破し、黄河は目前なり。汝の進軍、関公をも凌ぐ堅実さなりき。",
            "loss": "「者ども、捕らえよ！」五関の狼煙が一斉に上がり、関門は閉ざされたり。",
            "ruleText": "",
            "opponents": [{"title": "東嶺関の番人"}, {"title": "洛陽太守"}, {"title": "鎮国寺の伏兵"}, {"title": "滎陽の火計"}, {"title": "黄河の渡し場"}]
        }
    },
    "nanman": {
        "en": {
            "name": "Seven Releases in Nanzhong",
            "place": "Panshe Valley of Nanzhong",
            "year": "225 AD",
            "era": "225 AD · Zhuge Liang's Southern Campaign",
            "source": "Romance of the Three Kingdoms Ch. 90 · Captured Seven Times and Freed Seven Times",
            "btitle": "Panshe Valley · Ground of the Seven Captures",
            "lead": "Captured seven times and freed seven times, Meng Huo wept: 'The southern people shall never rebel again!' The fire of the rattan armor troops blazed through Panshe Valley for three days.",
            "why": "Tribal champions cycle into the ring: brute force, wily charm, trickery, and sheer bullheadedness. You must conquer not just a hand, but the whole of Nanzhong.",
            "win": "'The southern folk will rebel no more!' Meng Huo kneels in deep submission. Your sevenfold conquest was completed in a single seating.",
            "loss": "The flame of the rattan army burned in the wrong direction. This time, you are the one released empty-handed.",
            "ruleText": "",
            "opponents": [{"title": "Rebel King Seven Times Bound"}, {"title": "Drunken Vanguard"}, {"title": "Daughter of the Fire God"}, {"title": "Ravine Chieftain Advisor"}, {"title": "Rattan-Armored King"}]
        },
        "ja": {
            "name": "南中の七縦七擒",
            "place": "南中盤蛇谷",
            "year": "建興三年 (225年)",
            "era": "建興三年 · 諸葛亮の南征",
            "source": "『三国演義』第九十回・七擒七縦",
            "btitle": "盤蛇谷 · 七擒の地",
            "lead": "七度捕らえられ七度放たれ、孟獲は涙を流す——「南人再び背かず！」藤甲軍を焼きし猛火、盤蛇谷を三日三晩包みぬ。",
            "why": "蛮族の勇将が次々と襲い来る——剛、柔、謀略、猪突猛進。勝つべきは一勝負にあらず、南中全土なり。",
            "win": "「南人再び背かず！」孟獲は頭を垂れて平伏す。汝の「七擒」はただ一卓にて成し遂げられたり。",
            "loss": "藤甲軍の火はあらぬ方角へ燃え広がる。今回放免されたるは、汝自身なりき。",
            "ruleText": "",
            "opponents": [{"title": "七度服せし王"}, {"title": "酒を帯びて戦う弟"}, {"title": "火神の末裔"}, {"title": "洞主の参謀"}, {"title": "藤甲を纏いし烏戈王"}]
        }
    },
    "wuzi": {
        "en": {
            "name": "Five Elite Generals of Wei",
            "place": "General's Headquarters at Yecheng",
            "year": "196–220 AD",
            "era": "Jian'an Era · Military Elite of Cao Wei",
            "source": "Records of the Three Kingdoms · Appraisal of Five Elite Generals",
            "btitle": "Yecheng · Foremost of Champions",
            "lead": "'Grand Ancestor founded this martial realm, and among the illustrious commanders of the age, the Five Elite Generals stood foremost.' Chronicled in a single chapter, all five now take their seats.",
            "why": "Seated in unbroken rank, advancing and retreating as one iron body. In a force of such iron discipline, even their bluffs arrive in orderly formation.",
            "win": "All five elite generals are brought low. If Chen Shou rewrote their biography, your name would head the chapter.",
            "loss": "Iron discipline and flawless coordination. United together, the five generals left you not a single flaw to exploit.",
            "ruleText": "",
            "opponents": [{"title": "Shield of Hefei"}, {"title": "First Over the Ramparts"}, {"title": "Master of the Host"}, {"title": "Keen Reader of Fate"}, {"title": "Paragon of Discipline"}]
        },
        "ja": {
            "name": "曹魏の五子良将",
            "place": "鄴城将府",
            "year": "建安年間 (196-220年)",
            "era": "建安年間 · 曹魏の軍制",
            "source": "『三国志・張楽于張徐伝』評",
            "btitle": "鄴城 · 五将を先と為す",
            "lead": "「太祖武功を建てし時、良将の中にて五子を先と為す。」陳寿が筆を執りし名将五人、今や同卓に会す。",
            "why": "五将整然と並び、進退一体の如し。軍規厳格なる陣容は、ブラフすら規律正しく繰り出さる。",
            "win": "五将ことごとく敗北せり。陳寿が再び筆を執らば、汝の名を筆頭に記すであろう。",
            "loss": "軍法整然、布陣に乱れなし。五将の連携の前に、汝に付け入る隙は皆無なりき。",
            "ruleText": "",
            "opponents": [{"title": "合肥の鉄壁"}, {"title": "常に先陣を切る猛者"}, {"title": "全軍を統べる宿老"}, {"title": "変幻を見抜く智将"}, {"title": "周亜夫の気風"}]
        }
    },
    "wuhu": {
        "en": {
            "name": "Five Tiger Generals",
            "place": "Palace of the King of Hanzhong",
            "year": "219 AD",
            "era": "219 AD · Five Tiger Generals of Hanzhong",
            "source": "Records of the Three Kingdoms · Biographies of Guan, Zhang, Ma, Huang & Zhao / Romance of the Three Kingdoms Ch. 73",
            "btitle": "Hanzhong · Five Tigers Assemble",
            "lead": "Guan Yu, Zhang Fei, Zhao Yun, Ma Chao, and Huang Zhong — the five divine weapons of Shu Han gathered at one table. Zhang Fei bluffs with fury, Guan Yu with pride, and Zhao Yun with unflinching calm.",
            "why": "Invested as the Five Tigers, their renown shook all the lands. Today all five gather around the green felt to test the mettle of a lone challenger.",
            "win": "All five tigers concede respect. Huang Zhong strokes his white beard: 'My old bow acknowledges your mastery.'",
            "loss": "'Is this all?' Guan Yu narrows his phoenix eyes. Five legendary champions leave you without a single chip.",
            "ruleText": "",
            "opponents": [{"title": "Marquis of Hanshou"}, {"title": "Foe of Ten Thousand"}, {"title": "Courage Personified"}, {"title": "Heavenly Spear of the West"}, {"title": "Lion in Winter"}]
        },
        "ja": {
            "name": "蜀漢の五虎大将",
            "place": "漢中王府",
            "year": "建安二十四年 (219年)",
            "era": "建安二十四年 · 漢中王による五虎将任官",
            "source": "『三国志』関張馬黄趙伝／『三国演義』第七十三回",
            "btitle": "漢中 · 五虎集結",
            "lead": "関羽・張飛・趙雲・馬超・黄忠、蜀漢の誇る五振りの神兵が一堂に会す。張飛は猛進し、関羽は矜持を高く持ち、趙雲は盤石の構えを見す。",
            "why": "五虎大将任官、その武名は天下に轟く。今日その五人が同卓し、汝一人の器量を計らんとす。",
            "win": "五虎みな汝の腕前に感服す。黄忠は白髯を撫でて笑む——「老夫の剛弓、参ったと認めよう。」",
            "loss": "「この程度か。」関羽は鳳眼を細めたり。五振りの神兵は、汝に籌碼一つすら残さず。",
            "ruleText": "",
            "opponents": [{"title": "漢寿亭侯"}, {"title": "一騎当千の剛勇"}, {"title": "身のすべてが胆力"}, {"title": "神威天将軍"}, {"title": "老いてますます盛んなる弓"}]
        }
    },
    "xichuan": {
        "en": {
            "name": "Conquest of Xichuan",
            "place": "Luocheng in Xichuan",
            "year": "214 AD",
            "era": "214 AD · Liu Bei Pacifies Shu",
            "source": "Records of the Three Kingdoms · Biography of Former Lord / Romance of the Three Kingdoms Ch. 65",
            "btitle": "Luocheng · The Realm of Shu on the Table",
            "lead": "The Young Phoenix perished at Fallen Phoenix Slope, and Zhang Ren met his fate by Yan Bridge. Yet Shu was destined to bear Liu's name — veterans and newcomers alike assemble at one table.",
            "why": "Venerable generals, surrendered champions, master tacticians, and insider allies — the entire faction that claimed the Riverlands awaits. What you must win is the province of Shu itself.",
            "win": "The gates of Chengdu swing wide. The chips gathered from this table are enough to campaign in Xichuan for another ten years.",
            "loss": "'Xichuan is fortified by nature, with rich fields stretching a thousand li.' Raising their cups atop the ramparts, they send you packing back to Jiameng Pass.",
            "ruleText": "",
            "opponents": [{"title": "Dragon Enters Shu"}, {"title": "Fledgling Phoenix Soars"}, {"title": "Veteran of Changsha"}, {"title": "Ferocious Blade"}, {"title": "Unyielding Governor"}, {"title": "Insider Schemer"}]
        },
        "ja": {
            "name": "西川奪取の乱",
            "place": "西川雒城",
            "year": "建安十九年 (214年)",
            "era": "建安十九年 · 劉備の入蜀平定",
            "source": "『三国志・先主伝』／『三国演義』第六十五回",
            "btitle": "雒城 · 卓上に広がる西川の命運",
            "lead": "鳳雛は落鳳坡に斃れ、張任は雁橋の畔に散りぬ。然れど西川は劉備の掌中に帰す——文武新旧の俊英、すべて同卓に集結す。",
            "why": "宿将、降将、知謀の士、内通者——入蜀を果たせし陣営のすべてが此処にあり。汝が勝ち取るべきは、西川の大地そのものなり。",
            "win": "成都の城門開く。この卓上で得たる軍資金は、西川にてさらに十年の軍を展開するに足るべし。",
            "loss": "「西川は険塞にして千里の沃野あり。」城頭にて杯を掲げる将兵に、葭萌関へと追い返されたり。",
            "ruleText": "",
            "opponents": [{"title": "蜀に入る臥竜"}, {"title": "羽ばたく鳳雛"}, {"title": "老将の戦袍"}, {"title": "長沙の豪刃"}, {"title": "首を断たれても屈せぬ将"}, {"title": "闇夜の内通者"}]
        }
    },
    "jiangdong": {
        "en": {
            "name": "Tiger Ministers of Jiangdong",
            "place": "Jiangdong Grand Encampment",
            "year": "254–256 AD",
            "era": "196–256 AD · Foundation of Jiangdong",
            "source": "Records of the Three Kingdoms · Biographies of the Twelve Tiger Ministers of Jiangdong",
            "btitle": "Jiangdong · Seven of the Twelve Tiger Ministers",
            "lead": "Cheng Pu, Huang Gai, and Han Dang served three generations; Zhou Tai bore twelve wounds shielding his lord; Gan Ning sailed with brocade sails, Ling Tong stood as a pillar of chivalry, and Ding Feng wielded short blades through deep snow. Twelve tiger ministers recorded in history, seven take the field today.",
            "why": "'Jiangdong abounds in ferocious tiger ministers.' Seven warriors surround the felt, their combined ages exceeding three hundred, their scars numbering in the hundreds.",
            "win": "The seven tigers step away from the table. Sun Quan unbuckles his imperial sword and offers it with both hands: 'With this scabbard as stake, dare you duel once more?'",
            "loss": "'Surrender your chips.' Zhou Tai loosens his robes, revealing twelve battle scars glistening beneath the lanterns.",
            "ruleText": "",
            "opponents": [{"title": "Veteran of Three Generations"}, {"title": "Flame of the Bitter Ruse"}, {"title": "Loyal Outrider"}, {"title": "Twelve Scars"}, {"title": "Brocade Sails"}, {"title": "Righteous Wrath"}, {"title": "Blades in the Snow"}]
        },
        "ja": {
            "name": "江東の十二虎臣",
            "place": "江東大営",
            "year": "五鳳年間 (254-256年)",
            "era": "建安〜五鳳年間 · 江東の基盤",
            "source": "『三国志・程黄韓蒋周陳董甘凌徐潘丁伝』",
            "btitle": "江東 · 七名の猛虎",
            "lead": "程普・黄蓋・韓当の三代の宿老、十二の創傷を負いて主を守りし周泰、錦帆の甘寧、国士無双の凌統、雪中に短兵を振るいし丁奉。史書に名高き十二虎臣の内、七席が集結す。",
            "why": "「江東に虎臣多し。」七将が卓を囲めば、歳を合わせれば三百歳、傷痕を合わせれば百を超える。",
            "win": "七虎席を立つ。孫権は佩剣を解き、両手で捧ぐ——「この鞘を新たな賭け金とせん、再び勝負に応じる気はあるか？」",
            "loss": "「軍資金を置いて行け。」周泰は衣の襟を開き、灯火の下で十二の戦傷を一斉に晒せり。",
            "ruleText": "",
            "opponents": [{"title": "三代に仕えし宿老"}, {"title": "苦肉の火焔"}, {"title": "忠義の騎兵"}, {"title": "主を守りし十二の傷"}, {"title": "錦帆の豪傑"}, {"title": "国士の怒濤"}, {"title": "雪中に刃を振るう若武者"}]
        }
    },
    "taodong": {
        "en": {
            "name": "Warlords Against Dong Zhuo",
            "place": "Alliance Altar at Suanzao",
            "year": "190 AD",
            "era": "190 AD · Guandong Uprising",
            "source": "Records of the Three Kingdoms · Annals of Emperor Wu / Romance of the Three Kingdoms Ch. 5",
            "btitle": "Suanzao · Eighteen Warlord Coalition",
            "lead": "Eighteen regional lords forged an alliance to overthrow Dong Zhuo. With Yuan Shao as supreme commander, each nurtured secret ambitions — before the feast had even grown cold, the ranks were already unraveling.",
            "why": "Seven coalition warlords sit together: the leader feigns resolve, Yuan Shu hoards grain, Cao Cao fights in earnest, Sun Jian leads the vanguard... and you sit directly in the center.",
            "win": "Yuan Shao rises and lifts his goblet: 'Tomorrow we strike camp — under this commander's orders.' The grand campaign against tyranny is decided in a single game.",
            "loss": "The coalition fractures. Each warlord retreats to his own encampment, leaving you alone to face the iron cavalry of Xiliang.",
            "ruleText": "",
            "opponents": [{"title": "Figurehead Alliance Leader"}, {"title": "Bone in the Tomb"}, {"title": "Former Colonel of the Western Garden"}, {"title": "Tiger of Jiangdong"}, {"title": "General of the White Horses"}, {"title": "Straw-Weaving Imperial Kin"}, {"title": "Granary Superintendent"}]
        },
        "ja": {
            "name": "董卓討伐の諸侯",
            "place": "酸棗会盟壇",
            "year": "初平元年 (190年)",
            "era": "初平元年 · 関東諸侯の決起",
            "source": "『三国志・武帝紀』／『三国演義』第五回",
            "btitle": "酸棗 · 十八路の群雄",
            "lead": "十八路の諸侯が董卓討伐に盟を結ぶ。袁紹を盟主と仰ぐも、各自胸中に打算を抱き——酒の冷めぬうちに早くも内部分裂せり。",
            "why": "七名の諸侯が同卓す——体裁を繕う盟主、兵糧を独占する袁術、真剣勝負を挑む曹操、先陣を切る孫堅……汝はその中心に座す。",
            "win": "袁紹は立ち上がり杯を掲ぐ——「明日軍を発す、この者の指図に従え！」董卓討伐の大計、ただ一局にて定まれり。",
            "loss": "諸侯の同盟は瓦解せり。各々自陣へと引き揚げ、汝一人だけが西涼軍の前に取り残されたり。",
            "ruleText": "",
            "opponents": [{"title": "空名ばかりの盟主"}, {"title": "塚中の枯骨"}, {"title": "西園の旧将"}, {"title": "江東の猛虎"}, {"title": "白馬将軍"}, {"title": "草鞋売りの皇族"}, {"title": "兵糧庫の番人"}]
        }
    }
}

en_practice = {}
ja_practice = {}
tw_practice = {}

for raw in RAW_PRACTICE:
    pid = raw["id"]
    spec = ARENAS_DATA[pid]
    en_s = spec["en"]
    ja_s = spec["ja"]

    # English
    en_practice[pid] = {
        "name": en_s["name"],
        "place": en_s["place"],
        "year": en_s["year"],
        "era": en_s["era"],
        "source": en_s["source"],
        "lead": en_s["lead"],
        "btitle": en_s["btitle"],
        "why": en_s["why"],
        "win": en_s["win"],
        "loss": en_s["loss"],
        "ruleText": en_s["ruleText"],
        "opponents": en_s["opponents"]
    }

    # Japanese
    ja_practice[pid] = {
        "name": ja_s["name"],
        "place": ja_s["place"],
        "year": ja_s["year"],
        "era": ja_s["era"],
        "source": ja_s["source"],
        "lead": ja_s["lead"],
        "btitle": ja_s["btitle"],
        "why": ja_s["why"],
        "win": ja_s["win"],
        "loss": ja_s["loss"],
        "ruleText": ja_s["ruleText"],
        "opponents": ja_s["opponents"]
    }

    # Traditional Chinese (100% OpenCC s2t)
    tw_opps = [{"title": cc.convert(op.get("title", ""))} for op in raw.get("opponents", [])]
    tw_practice[pid] = {
        "name": cc.convert(raw.get("name", "")),
        "place": cc.convert(raw.get("place", "")),
        "year": cc.convert(raw.get("year", "")),
        "era": cc.convert(raw.get("era", "")),
        "source": cc.convert(raw.get("source", "")),
        "lead": cc.convert(raw.get("lead", "")),
        "btitle": cc.convert(raw.get("btitle", "")),
        "why": cc.convert(raw.get("why", "")),
        "win": cc.convert(raw.get("win", "")),
        "loss": cc.convert(raw.get("loss", "")),
        "ruleText": cc.convert(raw.get("ruleText", "")),
        "opponents": tw_opps
    }

dest_dir = os.path.join(ROOT, 'src', 'locales', 'practice')
os.makedirs(dest_dir, exist_ok=True)

with open(os.path.join(dest_dir, 'en.js'), 'w', encoding='utf-8') as f:
    f.write(f"export default {json.dumps(en_practice, ensure_ascii=False, indent=2)};\n")

with open(os.path.join(dest_dir, 'ja.js'), 'w', encoding='utf-8') as f:
    f.write(f"export default {json.dumps(ja_practice, ensure_ascii=False, indent=2)};\n")

with open(os.path.join(dest_dir, 'zh-TW.js'), 'w', encoding='utf-8') as f:
    f.write(f"export default {json.dumps(tw_practice, ensure_ascii=False, indent=2)};\n")

print(f"Generated all {len(en_practice)} practice arenas in EN, JA, and ZH-TW!")
