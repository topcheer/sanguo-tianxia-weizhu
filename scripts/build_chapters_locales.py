# -*- coding: utf-8 -*-
"""
scripts/build_chapters_locales.py
Generates src/locales/chapters/{zh-TW,ja,en}.js with 100% complete, authentic Three Kingdoms texts.
"""

import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'scripts'))

from translation_data.common import to_trad, PLACES, YEARS, OMENS

with open(os.path.join(ROOT, 'chapters_dump.json'), 'r', encoding='utf-8') as f:
    RAW_CHAPTERS = json.load(f)

CHAPTER_DATA = {
  "taoyuan": {
    "en": {
      "name": "The Peach Garden",
      "premise": "What if the age of turmoil began over a cup of wine?",
      "regret": "The Yellow Turban Rebellion was but the opening chapter of chaos.",
      "history": "In 184 AD, the Yellow Turbans rose across the land. Liu Bei gathered volunteers in Zhuo Commandery to fight alongside imperial troops.",
      "yeshi": "At Zhuo Commandery, the bandits were routed. Inside the peach garden, the ceremonial wine was still warm.",
      "note": "Chronicler's Note: This page is easily read, depart now.",
      "defeat": "The wine is still warm, but the heroes have departed.",
    },
    "ja": {
      "name": "桃園の契り",
      "premise": "乱世が一杯の酒から始まったとしたら。",
      "regret": "黄巾の乱、乱世の幕開けなり。",
      "history": "中平元年、黄巾の乱起こり、劉備は涿郡にて義勇兵を募り官軍に従軍せり。",
      "yeshi": "涿郡の一戦にて黄巾は散ず。桃園の酒はなお温し。",
      "note": "筆記者注：此の頁は読み易し。行かん。",
      "defeat": "酒はなお温きも、人はすでに去りぬ。",
    }
  },
  "sishui": {
    "en": {
      "name": "Sishui Pass",
      "premise": "What if it was you who warmed the wine, not Guan Yu?",
      "regret": "Warm wine slays Hua Xiong; a second late leaves eternal regret.",
      "history": "Hua Xiong felled coalition commanders in succession until Guan Yu took his head before the wine cooled.",
      "yeshi": "Before the cup went cold, Hua Xiong had fallen. Never again did the lords look down upon the brothers.",
      "note": "Chronicler's Note: Strike while the wine is hot and the cards are sharp.",
      "defeat": "The wine turned cold, and the pass remains unbreached.",
    },
    "ja": {
      "name": "汜水関",
      "premise": "温め酒を掲げたのが関羽ならず、貴殿であったなら。",
      "regret": "温め酒に華雄を斬る、寸毫の遅れも無念を残す。",
      "history": "華雄、諸侯の猛将を連破す。関羽、酒の温かなるうちにこれを討つ。",
      "yeshi": "杯の酒未だ冷めざるに華雄討死す。諸侯、二度と軽んずること能わず。",
      "note": "筆記者注：酒は熱いうちに、手牌は鋭く打て。",
      "defeat": "酒は冷え、関はなお破れず。",
    }
  },
  "hulao": {
    "en": {
      "name": "Hulao Pass",
      "premise": "What if Lu Bu never retreats an inch?",
      "regret": "Three heroes encircled Lu Bu, but none could break his unmatched halberd.",
      "history": "Lu Bu rode Red Hare and wielded the Sky Piercer, striking dread into the coalition outside Hulao.",
      "yeshi": "Three blades crossed his halberd. The gate opened wide, awaiting the bravest under heaven.",
      "note": "Chronicler's Note: He advances relentlessly; outlast his fury.",
      "defeat": "The halberd cleaved the banner, and the alliance fell back.",
    },
    "ja": {
      "name": "虎牢関",
      "premise": "呂布が決して一歩も退かぬとしたら。",
      "regret": "三英、呂布を囲むも、天下一の武を折る能わず。",
      "history": "呂布、赤兎に跨がり画戟を振るい、諸侯を虎牢関前に震え上がらしむ。",
      "yeshi": "三刃交錯し、戟光天を衝く。天下無双の前に道は開けたり。",
      "note": "筆記者注：此の男只進みて退かず、力尽きるを待て。",
      "defeat": "画戟軍旗を裂き、諸侯退散せり。",
    }
  },
  "xianshan": {
    "en": {
      "name": "Xianshan Ridge",
      "premise": "What if the Tiger of Jiangdong saw through the ambush in the bamboo?",
      "regret": "Sun Jian's early death halted Jiangdong's first charge across the Yangtze.",
      "history": "Sun Jian pursued Huang Zu into the hills of Mount Xian, where hidden arrows felled the Tiger of Jiangdong.",
      "yeshi": "The arrows struck stone, not flesh. The tiger turned around with his great seal blazing.",
      "note": "Chronicler's Note: The fiercest tiger falls when he rushes his breath.",
      "defeat": "Concealed arrows whistled through the night, leaving Jiangdong in mourning.",
    },
    "ja": {
      "name": "峴山の露",
      "premise": "江東の虎が竹林の伏兵を見破っていたなら。",
      "regret": "孫堅の早逝、江東最初の雄飛を挫く。",
      "history": "孫堅、黄祖を追いて峴山に入り、伏兵の暗箭に倒れたり。",
      "yeshi": "矢は石に弾かれ、虎は咆哮す。伝国の玉璽、月下に輝けり。",
      "note": "筆記者注：猛虎の過ちは、一息の焦りにあり。",
      "defeat": "暗箭竹林を射貫き、江東の旗折れたり。",
    }
  },
  "jieqiao": {
    "en": {
      "name": "Battle of Jieqiao",
      "premise": "What if white horse cavalry could outmaneuver crossbow volleys?",
      "regret": "Gongsun Zan's proud elite horsemen broke against the shield walls of Qu Yi.",
      "history": "Yuan Shao clashed with Gongsun Zan at Jieqiao; Qu Yi's eight hundred crossbowmen crushed the White Horse Volunteers.",
      "yeshi": "Zhao Yun's spear cleaved the shield line, turning the tide above the river bank.",
      "note": "Chronicler's Note: Even the swiftest steed cannot outrun a line of drawn bows.",
      "defeat": "The bridge collapsed in dust, and the white horses never returned.",
    },
    "ja": {
      "name": "界橋の戦い",
      "premise": "白馬義従が強弩の一斉射を突破したなら。",
      "regret": "公孫瓚の誇る騎兵、麹義の弩列に散る。",
      "history": "袁紹、公孫瓚と界橋に戦い、麹義の強弩隊が白馬義従を壊滅せしむ。",
      "yeshi": "趙雲の一槍、陣形を穿ち、界橋の白波を朱に染む。",
      "note": "筆記者注：駿馬速しといえども、一列の強弩には勝てず。",
      "defeat": "橋落ち騎兵散じ、白馬は二度と戻らず。",
    }
  },
  "fengyiting": {
    "en": {
      "name": "Fengyi Pavilion",
      "premise": "What if the halberd struck the tyrant, not the courtyard pavilion?",
      "regret": "The scheme of chained stratagems traded one brutal tyrant for chaotic warlords.",
      "history": "Wang Yun devised the beauty stratagem with Diaochan, driving an irreparable wedge between Dong Zhuo and Lu Bu.",
      "yeshi": "By the pavilion railings, whispers turned to cold steel. The tyrant's blood washed the imperial court.",
      "note": "Chronicler's Note: On this page, what you see with your eyes may be pure illusion.",
      "defeat": "The plot was laid bare, and the chained stratagem crumbled into ashes.",
    },
    "ja": {
      "name": "鳳儀亭",
      "premise": "投げ放たれし画戟が亭ならず、暴虐の胸を貫いたなら。",
      "regret": "連環の計成るも、さらなる群雄割拠を招く。",
      "history": "王允、貂蝉を用い連環の計を巡らせ、董卓と呂布を相克せしむ。",
      "yeshi": "亭前の密語、やがて冷たき白刃と化し、宮門に暴君を討つ。",
      "note": "筆記者注：此の頁、目に見ゆるもの真ならず。",
      "defeat": "計謀漏れ、連環は瓦解せり。",
    }
  },
  "shenting": {
    "en": {
      "name": "Shenting Ridge",
      "premise": "What if Sun Ce and Taishi Ci fought to the end of time?",
      "regret": "Two young peerless champions wrestled in dust, destined to meet only in legend.",
      "history": "Sun Ce and Taishi Ci fought hand to hand at Shenting Ridge, seizing each other's helmet and halberd without a victor.",
      "yeshi": "Beneath thunderstorm and rain, neither yielded. Handshakes replaced steel, uniting Jiangdong's soul.",
      "note": "Chronicler's Note: Let them finish their bout; do not judge victory too soon.",
      "defeat": "The storm washed away the footprints, leaving the duel unresolved.",
    },
    "ja": {
      "name": "神亭嶺",
      "premise": "孫策と太史慈の一騎討ち、果てなき激闘の行方は。",
      "regret": "若き両雄、泥まみれに戦いて、勝負つかずして分かれき。",
      "history": "孫策と太史慈、神亭嶺にて単騎相見え、兜と短戟を奪い合いて雌雄を決せず。",
      "yeshi": "驟雨の中、刃を収めて手を握り、江東の英魂一つに結ばれん。",
      "note": "筆記者注：打ち尽くすまで待て、勝敗を焦るべからず。",
      "defeat": "雨に足跡流され、両雄の行方知れず。",
    }
  },
  "yuanshemen": {
    "en": {
      "name": "Feat at Camp Gate",
      "premise": "What if the arrow pierced the tiny halberd prong on the first shot?",
      "regret": "A solitary arrow pacified two armies, but could not pacify Lu Bu's restless soul.",
      "history": "Lu Bu set up his halberd at one hundred and fifty paces outside the camp gate, shooting his arrow through the side prong to halt war between Liu Bei and Ji Ling.",
      "yeshi": "The bowstring hummed like thunder. Ji Ling sheathed his blade in awe, bowing before the god of war.",
      "note": "Chronicler's Note: The peacemaker carries the heaviest wager.",
      "defeat": "The arrow drifted in the wind, and two armies clashed in slaughter.",
    },
    "ja": {
      "name": "轅門射戟",
      "premise": "百五十歩の彼方、矢が画戟の小枝を一矢で貫いたなら。",
      "regret": "一矢もて両軍を和解せしむるも、呂布自身の迷走は止められず。",
      "history": "呂布、轅門に画戟を立て、百五十歩より射て戟の小枝を射貫き、劉備と紀霊の戦を収む。",
      "yeshi": "弦音雷のごとく響き、紀霊は刀を収めて畏服せり。",
      "note": "筆記者注：仲裁者こそ、最も牌難き役回りなり。",
      "defeat": "矢は風に逸れ、両軍血戦になだれ込めり。",
    }
  },
  "wancheng": {
    "en": {
      "name": "Wancheng Crisis",
      "premise": "What if Dian Wei never lost his twin twin iron halberds?",
      "regret": "Dian Wei died barring the camp gate, guarding Cao Cao with his bare fists.",
      "history": "Zhang Xiu launched a night raid on Cao Cao's camp in Wancheng. Dian Wei held the gate with unmatched fury until he perished.",
      "yeshi": "With halberds firmly in grasp, the iron warrior stood immovable like Mount Tai, escorting his lord to safety.",
      "note": "Chronicler's Note: Protecting your weapon is protecting your life.",
      "defeat": "The night raid engulfed the tent, and the twin halberds were lost forever.",
    },
    "ja": {
      "name": "宛城の変",
      "premise": "典韋が双鉄戟を奪われず、手に握りしめていたなら。",
      "regret": "典韋、営門に立ち塞がり、素手にて曹操を逃して討死す。",
      "history": "張繍、夜陰に乗じて曹操の陣を急襲。典韋、門を死守して奮戦の末に斃る。",
      "yeshi": "鉄戟手にあれば、鬼神なお近づく能わず。主君を背に退路を死守す。",
      "note": "筆記者注：兵器を守るは、命を守るに如かず。",
      "defeat": "夜襲陣営を呑み、双鉄戟は失われぬ。",
    }
  },
  "baimenlou": {
    "en": {
      "name": "White Gate Tower",
      "premise": "What if the tiger tied with ropes found one final chance to negotiate?",
      "regret": "The strongest general fell not in battle, but to bound cords and whispered words.",
      "history": "Cao Cao flooded Xiapi, captured Lu Bu at White Gate Tower, and executed him after consulting Liu Bei.",
      "yeshi": "Looking down from the ramparts, he saw the chessboard of history and refused to bow his head.",
      "note": "Chronicler's Note: A cornered beast fights with all fury; how much more so for Lu Bu.",
      "defeat": "The cords tightened, and the white tower witnessed the end of a legend.",
    },
    "ja": {
      "name": "白門楼",
      "premise": "縛られし猛虎が、最後に言葉を交わす機を得ていたなら。",
      "regret": "天下無双の武、合戦に敗れずして縄と囁きに倒る。",
      "history": "曹操、下邳を水攻めにして呂布を白門楼に捕らえ、劉備の進言を容れてこれを斬る。",
      "yeshi": "楼上より盤上を見下ろし、一度として頭を垂れぬ武人の魂よ。",
      "note": "筆記者注：困獣なお闘う、況や呂布においてをや。",
      "defeat": "麻縄締められ、白門楼に英雄の首落ちぬ。",
    }
  },
  "zhujiu": {
    "en": {
      "name": "Heroes Over Wine",
      "premise": "What if the words 'My Lord' were aimed directly at you?",
      "regret": "Discussing heroes in the plum garden, thunder masked a fallen pair of chopsticks.",
      "history": "Cao Cao hosted Liu Bei over warm plum wine, declaring: 'The only heroes in the realm are you and I.'",
      "yeshi": "The thunder crashed across the pavilion. The chopsticks dropped to the floor, concealing an emperor's ambition.",
      "note": "Chronicler's Note: He reads your tells while you read his gaze.",
      "defeat": "The secret leaked from the wine cup, and Xuchang became a gilded cage.",
    },
    "ja": {
      "name": "煮酒論英雄",
      "premise": "「使君」の二字が、貴殿に向けられたものだとしたら。",
      "regret": "青梅の酒を煮て英雄を論ず、雷鳴に箸を落とし胸中を隠す。",
      "history": "曹操、劉備を青梅亭に招き、「天下の英雄は使君と操のみ」と言い放つ。",
      "yeshi": "轟く雷鳴、落つる箸。大志を隠す演技に、乱世の覇者も欺かれたり。",
      "note": "筆記者注：彼は汝を読み、汝もまた彼を読む。",
      "defeat": "酒杯より真意漏れ、許都は逃れ得ぬ檻となれり。",
    }
  },
  "baima": {
    "en": {
      "name": "Siege of Baima",
      "premise": "What if that farewell toast was poured for the wrong man?",
      "regret": "Yan Liang and Wen Chou fell in quick succession, sealing Guan Yu's pledge to depart.",
      "history": "Guan Yu rode into Yuan Shao's army at Baima, beheading Yan Liang amidst ten thousand soldiers.",
      "yeshi": "The Green Dragon blade severed the siege banner in a single pass, paying Cao Cao's debt in full.",
      "note": "Chronicler's Note: Hebei's twin pillars fell—one to arrogance, one to wrath.",
      "defeat": "The siege lines held firm, and the debt of gratitude remained unpaid.",
    },
    "ja": {
      "name": "白馬の囲み",
      "premise": "かの惜別の酒、注ぐ相手を違えていたなら。",
      "regret": "顔良・文醜相次いで倒れ、関羽の義気天を衝く。",
      "history": "関羽、白馬陣中に単騎駆け入り、万軍の中より顔良の首級を挙げたり。",
      "yeshi": "青龍偃月刀の一閃、包囲の陣旗を薙ぎ倒し、曹操への恩義を晴らして去らんとす。",
      "note": "筆記者注：河北の双璧、一人は驕りに、一人は怒りに散る。",
      "defeat": "包囲網崩れず、恩義は重荷となりて残れり。",
    }
  },
  "qianli": {
    "en": {
      "name": "Riding Alone A Thousand Miles",
      "premise": "What if the five passes refused to let you pass at all costs?",
      "regret": "Severing ties with five passes and six captains, Guan Yu journeyed toward his brother.",
      "history": "Guan Yu escorted Liu Bei's families out of Xuchang, crossing five mountain passes and slaying six opposing commanders.",
      "yeshi": "Red Hare galloped across mountains and rivers. Every pass yielded before the lone rider's oath.",
      "note": "Chronicler's Note: Fight on the move; do not linger at any single pass.",
      "defeat": "The mountain pass gates slammed shut, cutting off the brothers' reunion.",
    },
    "ja": {
      "name": "千里走単騎",
      "premise": "五つの関門が、一歩たりとも通さぬとしたら。",
      "regret": "五関を破り六将を斬る、兄弟の義を胸に万里を駆く。",
      "history": "関羽、劉備の妻子を護り許都を去り、五つの関門を突破して六将を討ち果たす。",
      "yeshi": "赤兎馬は山河を越え、関羽の義風に塞門ことごとく開かれたり。",
      "note": "筆記者注：連戦連走、一局に執着することなかれ。",
      "defeat": "関門堅く閉ざされ、義兄弟の再会は断たれぬ。",
    }
  },
  "guandu": {
    "en": {
      "name": "Battle of Guandu",
      "premise": "What if Xu You never defected in the dead of night?",
      "regret": "A massive host of a hundred thousand collapsed in flame at Wuchao.",
      "history": "Cao Cao burned Yuan Shao's granaries at Wuchao, routing the vastly superior northern army at Guandu.",
      "yeshi": "Torchlight lit the night sky at Wuchao. The fate of the Central Plains was decided in a single blaze.",
      "note": "Chronicler's Note: He has mountains of grain, you have little; victory requires absolute speed.",
      "defeat": "Grain supplies ran dry, and Cao Cao's camp was overwhelmed by northern hordes.",
    },
    "ja": {
      "name": "官渡の決戦",
      "premise": "かの夜、許攸が寝返り来たらざりせば。",
      "regret": "烏巣の火焔、袁紹十万の大軍を一夕にして灰燼に帰す。",
      "history": "曹操、許攸の策を容れて烏巣の糧道を奇襲し、官渡にて袁紹の大軍を破る。",
      "yeshi": "烏巣の焔、夜天を焦がす。中原の覇権は一夜の炎に決せられたり。",
      "note": "筆記者注：敵は糧多し、我は少なし。速攻こそ命脈。",
      "defeat": "糧食尽き果て、曹操陣営は北方の波に呑まれぬ。",
    }
  },
  "sangu": {
    "en": {
      "name": "Three Visits to the Cottage",
      "premise": "What if on the third visit, he still refused to meet?",
      "regret": "Three visits in rain and snow brought the Sleeping Dragon into a fractured world.",
      "history": "Liu Bei visited Longzhong three times before Zhuge Liang presented the Longzhong Plan to divide the realm into three.",
      "yeshi": "Snow melted outside the thatch cottage. A cup of tea was poured, unfolding the strategy for forty years of war.",
      "note": "Chronicler's Note: Even if you lose the first two hands, you must return for the third.",
      "defeat": "The thatched door stayed barred, and the Sleeping Dragon never woke.",
    },
    "ja": {
      "name": "三顧の礼",
      "premise": "三度目もなお、主に応対せぬとしたら。",
      "regret": "雪中三たび訪ねて、臥竜ついに天下に起つ。",
      "history": "劉備、三顧の礼を尽くし、諸葛亮は草廬を出でて『隆中対』を説く。",
      "yeshi": "草廬の雪解け、湯気立ち上る茶杯の前で、天下三分の計は定められたり。",
      "note": "筆記者注：初めの二戦、敗れてもなお挑め。",
      "defeat": "草門は閉ざされたまま、臥竜は目覚めず。",
    }
  },
  "bowang": {
    "en": {
      "name": "Bowangpo Ambush",
      "premise": "What if the strategist's first fire was kindled by your hands?",
      "regret": "The fire of Bowangpo shattered Xiahou Dun's vanguard in one night.",
      "history": "Zhuge Liang directed Liu Bei's forces to lure Xiahou Dun into the narrow valley of Bowangpo and set it ablaze.",
      "yeshi": "Flames engulfed the reed plains. Guan Yu and Zhang Fei yielded in complete reverence to their new strategist.",
      "note": "Chronicler's Note: Endure the pressure until the trap is fully sprung.",
      "defeat": "The fire failed to catch the dry brush, and the vanguard was overwhelmed.",
    },
    "ja": {
      "name": "博望坡の火",
      "premise": "軍師最初の火計、貴殿こそがその火種であったなら。",
      "regret": "博望の焔、夏侯惇の精鋭を一夜にして焼き払う。",
      "history": "諸葛亮、博望坡にて敵を誘い込み火計を放ち、劉備軍初陣を大勝利に導く。",
      "yeshi": "葦原を焔が舐め尽くす。関羽・張飛、初めて軍師の奇才に服せり。",
      "note": "筆記者注：火計の放たれるまで、忍の一字を保て。",
      "defeat": "火は燃え広がらず、伏兵は返り討ちに遭いぬ。",
    }
  },
  "changban": {
    "en": {
      "name": "Changban Slope",
      "premise": "What if that mighty roar at Dangyang Bridge fell hoarse?",
      "regret": "Zhao Yun rode seven times through the army, and Zhang Fei roared alone at the bridge.",
      "history": "Cao Cao pursued Liu Bei to Changban. Zhao Yun rescued Liu Bei's infant son Liu Shan, while Zhang Fei broke the bridge.",
      "yeshi": "The silver spear shone like white lightning through fifty legions. A single shout stopped ten thousand cavalry in their tracks.",
      "note": "Chronicler's Note: When retreat is impossible, there is no need to step back.",
      "defeat": "The river swept away the broken planks, and the bridge fell into enemy hands.",
    },
    "ja": {
      "name": "長坂坡",
      "premise": "当陽橋上の一喝、もしも声嗄れて響かざりせば。",
      "regret": "趙雲七度駆け抜け、張飛橋上に仁王立ちす。",
      "history": "曹操軍、長坂坡にて劉備を追撃。趙雲幼主を救い、張飛当陽橋を断ちて追撃を阻む。",
      "yeshi": "銀槍一閃、大軍を切り裂きて幼主を抱く。橋上の一喝、十万の騎兵を釘付けにせり。",
      "note": "筆記者注：退く道なき時は、退く必要もなし。",
      "defeat": "濁流橋板を呑み、追撃の軍勢に呑み込まれぬ。",
    }
  },
  "shezhan": {
    "en": {
      "name": "Debating the Scholars",
      "premise": "What if the scholars of Jiangdong argued you into silence?",
      "regret": "Eloquent scholars debated war and peace before the gathering storm of Red Cliffs.",
      "history": "Zhuge Liang traveled to Chaisang and confronted Sun Quan's civil officials one by one, winning Jiangdong to the alliance.",
      "yeshi": "With words as sharp as swords and composure like iron, he dismantled every argument in the council hall.",
      "note": "Chronicler's Note: Use quiet poise to overcome the multitude.",
      "defeat": "The council yielded to surrender, and the alliance was stillborn.",
    },
    "ja": {
      "name": "舌戦群儒",
      "premise": "江東の諸儒、貴殿を論破せしとしたら。",
      "regret": "赤壁の前夜、舌戦もて江東の降伏論を打ち砕く。",
      "history": "諸葛亮、柴桑に赴き孫権配下の文官諸儒と舌戦を交え、同盟を勝ち取る。",
      "yeshi": "言葉は刃の如く鋭く、議事堂を静寂が包む。一人の弁論、天下の趨勢を動かせり。",
      "note": "筆記者注：静をもって動を制し、寡をもって衆に敵す。",
      "defeat": "降伏論が陣営を覆い、同盟の機は永遠に失われぬ。",
    }
  },
  "caochuan": {
    "en": {
      "name": "Borrowing Arrows with Straw Boats",
      "premise": "What if no thick mist rose over the river that night?",
      "regret": "Ten thousand bundles of straw stood ready beneath the fog of the Yangtze.",
      "history": "Zhuge Liang sailed twenty straw-covered boats into the mist near Cao Cao's camp, returning with a hundred thousand arrows.",
      "yeshi": "Arrows fell like driving rain into the straw hulls. Drums beat in celebration as they returned with the tide.",
      "note": "Chronicler's Note: You are not the only one blinded by the fog.",
      "defeat": "The fog cleared too early, and imperial archers loaded flaming arrows.",
    },
    "ja": {
      "name": "草船借箭",
      "premise": "かの夜の大江、霧立ち込めざりせば。",
      "regret": "長江の濃霧の中、藁束十万本の矢を迎え撃つ。",
      "history": "諸葛亮、藁を積んだ二十隻の小舟を曹操陣営に近づけ、十万本の矢を無償で得たり。",
      "yeshi": "矢衾の如く藁に刺さる矢の雨。太鼓を打ち鳴らし、大江の霧を抜け帰りなん。",
      "note": "筆記者注：見えざるは汝一人にあらず。",
      "defeat": "霧晴れて火矢を浴び、草船ことごとく炎上せり。",
    }
  },
  "chibi": {
    "en": {
      "name": "Battle of Red Cliffs",
      "premise": "What if the southeast wind never stirred that night?",
      "regret": "Chained warships burned across the waves, setting the Three Kingdoms into history.",
      "history": "Zhou Yu and Huang Gai executed the fire attack, burning Cao Cao's naval fleet at Red Cliffs.",
      "yeshi": "The east wind blew gale-force over the river. Flames leapt from ship to ship, painting the cliff face in crimson glory.",
      "note": "Chronicler's Note: Wait for the wind, and force the wind to blow.",
      "defeat": "The wind refused to turn, and northern ironclads crushed Jiangdong's fleet.",
    },
    "ja": {
      "name": "赤壁大戦",
      "premise": "東南の風、一夜にして起きざりせば。",
      "regret": "鎖されし船団炎上し、天下三分の礎定まる。",
      "history": "周瑜・黄蓋の火計成り、赤壁にて曹操の八十万水軍を焼き尽くす。",
      "yeshi": "東南の風吹き荒れ、赤壁の岸辺を業火が舐める。英雄たちの野望、炎の中に交錯せり。",
      "note": "筆記者注：風を待ち、風を起こせ。",
      "defeat": "風は起きず、北方の巨艦に押し潰されぬ。",
    }
  },
  "huarong": {
    "en": {
      "name": "Huarong Trail",
      "premise": "What if in that fleeting instant, the blade fell—or stayed?",
      "regret": "Guan Yu released Cao Cao on Huarong Trail, repaying his ancient debt of chivalry.",
      "history": "Cao Cao retreated through the mud of Huarong Trail, where Guan Yu stood waiting with halberds drawn.",
      "yeshi": "A lone rider blocked the mountain pass. Looking back on old warmth, the Green Dragon blade returned to its sheath.",
      "note": "Chronicler's Note: On this page, even winning demands a choice.",
      "defeat": "The mountain trail collapsed, leaving neither honor nor victory intact.",
    },
    "ja": {
      "name": "華容道",
      "premise": "かの刹那、刃落つるか、留まるか。",
      "regret": "関羽、華容道にて曹操を逃し、往年の恩義を返す。",
      "history": "曹操敗走して華容道の泥濘を抜け、待ち受ける関羽と相見ゆ。",
      "yeshi": "青龍刀一閃の前に、往年の旧恩去来す。刃を収め道を譲りし義の極致。",
      "note": "筆記者注：此の頁、勝ちてもなお選ぶことあり。",
      "defeat": "泥濘に足を取られ、恩義も勝敗も霧散せり。",
    }
  },
  "nanjun": {
    "en": {
      "name": "Contest for Nanjun",
      "premise": "What if the commander's arrow wound tore open once more?",
      "regret": "Zhou Yu labored at Nanjun, only for Liu Bei to claim Jingzhou's prize.",
      "history": "Zhou Yu fought Cao Ren for over a year at Jiangling, suffering an arrow wound that shortened his life.",
      "yeshi": "While the southern army drew Cao Ren's main force, Shu Han's banners silently rose over Nanjun's gate.",
      "note": "Chronicler's Note: Defenders fear nothing from time; attackers fear every day.",
      "defeat": "Cao Ren's counterattack shattered the siege, reclaiming Jiangling.",
    },
    "ja": {
      "name": "南郡争奪",
      "premise": "都督の矢傷、今一度裂けたりせば。",
      "regret": "周瑜南郡に血戦するも、果実は劉備の手に落ちぬ。",
      "history": "周瑜、江陵にて曹仁と一年余り対峙し、重傷を負いて南郡を奪取す。",
      "yeshi": "呉軍が曹仁を引きつける隙に、劉備の軍旗が南郡城頭に翻れり。",
      "note": "筆記者注：城を守る者は時を恐れず、攻むる者こそ焦る。",
      "defeat": "曹仁の逆襲に遭い、江陵城下にて敗退せり。",
    }
  },
  "sanqi": {
    "en": {
      "name": "Three Provocations of Zhou Yu",
      "premise": "What if Zhou Yu could not endure the third provocation?",
      "regret": "'Since Heaven made Zhou Yu, why did it also give birth to Zhuge Liang?'",
      "history": "Zhou Yu's strategy to conquer Western Ba Shu was repeatedly thwarted by Liu Bei, leading to his demise at Baqiu.",
      "yeshi": "The great commander gazed across the Yangtze waves, his brilliant mind outmaneuvered by destiny itself.",
      "note": "Chronicler's Note: His pride was more brittle than an arrowhead.",
      "defeat": "The fleet sailed in confusion, and Jiangdong's strategic plans collapsed.",
    },
    "ja": {
      "name": "三気周瑜",
      "premise": "周郎の矢傷、三度目の激越に耐え得ざりせば。",
      "regret": "「天は既に瑜を生みながら、何ぞ亮をも生みしや！」",
      "history": "周瑜、西蜀併呑の策を立てるも劉備に阻まれ、巴丘にて無念の憤死を遂ぐ。",
      "yeshi": "大江の白波を見つめ、稀代の英傑ついに天を仰ぎて嘆息せり。",
      "note": "筆記者注：彼の誇りは、矢傷よりも脆し。",
      "defeat": "船団混乱し、西征の策は水泡に帰せり。",
    }
  },
  "tongguan": {
    "en": {
      "name": "Battle of Tongguan",
      "premise": "What if night never fell on the day he cut his beard and shed his robe?",
      "regret": "Ma Chao's ferocious charge almost claimed Cao Cao's life beside the Wei River.",
      "history": "Ma Chao and Han Sui rebelled in Liangzhou, driving Cao Cao into desperate flight at Tongguan.",
      "yeshi": "Cao Cao cut his beard and threw off his red robe in haste, narrowly escaping across the Wei River.",
      "note": "Chronicler's Note: Liangzhou lacks no warhorses, only someone willing to sit across the table.",
      "defeat": "The spear tip caught the retreating warlord, rewriting the history of Wei.",
    },
    "ja": {
      "name": "潼関の戦い",
      "premise": "髭を切り袍を捨てし夕べ、夜の帳下りざりせば。",
      "regret": "錦馬超の突撃、曹操を潼関にて死地の淵に追い詰む。",
      "history": "馬超・韓遂、涼州の兵を率いて挙兵し、曹操を潼関の渭水に敗走せしむ。",
      "yeshi": "髭を切り紅袍を捨てて逃げ惑う覇者。一歩違えば天下は覆りたり。",
      "note": "筆記者注：西涼に名馬は尽きず、盤上に対す者を欠くのみ。",
      "defeat": "馬超の一槍届き、覇権の主は泥濘に斃れぬ。",
    }
  },
  "ruxu": {
    "en": {
      "name": "Defense of Ruxu",
      "premise": "What if of the hundred raiding riders, one failed to return?",
      "regret": "Gan Ning's hundred brave horsemen raided Cao Cao's camp without losing a man.",
      "history": "Gan Ning led one hundred cavalrymen with goose plumes in their helmets into Cao Cao's camp, returning unscathed.",
      "yeshi": "Silver bells rang in the dark night. A hundred shadows danced through the enemy ranks, shocking ten legions.",
      "note": "Chronicler's Note: A hundred men can break the courage of ten legions.",
      "defeat": "The silver bells fell silent, and the hundred riders were encircled.",
    },
    "ja": {
      "name": "濡須口の戦い",
      "premise": "百騎劫営、もし一騎として戻らざりせば。",
      "regret": "甘寧、百騎を率いて曹操の大軍に夜襲をかけ、一騎の損耗もなく帰還す。",
      "history": "甘寧、兜に白羽を挿し百騎にて敵陣を奇襲し、曹操軍を大いに震撼せしむ。",
      "yeshi": "銀の鈴、夜陰に鳴り響く。百騎の影、大軍を翻弄して凱旋せり。",
      "note": "筆記者注：百人の勇、十万人の胆を折る。",
      "defeat": "鈴の音途絶え、百騎は重囲の中に呑み込まれぬ。",
    }
  },
  "luofengpo": {
    "en": {
      "name": "Fallen Phoenix Slope",
      "premise": "What if the fateful steed Dilu was never traded?",
      "regret": "Pang Tong fell beneath a rain of arrows at the Valley of the Fallen Phoenix.",
      "history": "Pang Tong was killed by a stray arrow while leading the assault on Luocheng during the conquest of Shu.",
      "yeshi": "The ominous valley name rang true. The strategist traded his own life to grant Liu Bei righteous cause for war.",
      "note": "Chronicler's Note: When place names carry ill omen, make early preparations.",
      "defeat": "Arrows fell like hail from the cliffs, and the Young Phoenix spread his wings no more.",
    },
    "ja": {
      "name": "落鳳坡",
      "premise": "かの的盧馬、主を乗り換えざりせば。",
      "regret": "鳳雛・龐統、落鳳坡の暗谷にて乱箭に斃る。",
      "history": "龐統、劉備の蜀親征にて雒城を攻め、流矢に当たって三十六歳にて夭折す。",
      "yeshi": "不吉なる地名、運命の如く。龐統、己が命を賭して劉備に進軍の大義を与えたり。",
      "note": "筆記者注：地名凶なれば、早き手当てを期せ。",
      "defeat": "谷間を矢が覆い、鳳雛ついに羽ばたく能わず。",
    }
  },
  "jiameng": {
    "en": {
      "name": "Night Battle at Jiameng",
      "premise": "What if during the torchlit duel, someone blinked first?",
      "regret": "Zhang Fei and Ma Chao fought from daytime into torchlight without a victor.",
      "history": "Ma Chao assaulted Jiameng Pass, dueling Zhang Fei over several hundred rounds under torches.",
      "yeshi": "Hundreds of torches lit the mountain pass like noon. Two peerless warriors traded blows until dawn broke.",
      "note": "Chronicler's Note: When both sides fight to exhaustion, their true hearts show.",
      "defeat": "The torches sputtered out, leaving the pass vulnerable in darkness.",
    },
    "ja": {
      "name": "葭萌関の夜戦",
      "premise": "篝火を掲げし夜戦、誰か先に瞬きせしなら。",
      "regret": "張飛と馬超、日没まで戦い篝火を焚きてなお勝負つかず。",
      "history": "馬超葭萌関を攻め、張飛と数百合にわたり死闘を演ず。",
      "yeshi": "百の篝火が闇を白日に変ず。二人の猛将、一歩も退かずして明け方に至る。",
      "note": "筆記者注：打ち疲れ果てし時にこそ、人の本性現る。",
      "defeat": "篝火燃え尽き、関門は闇の恐怖に呑まれぬ。",
    }
  },
  "daodan": {
    "en": {
      "name": "Alone to the Feast",
      "premise": "What if that famous blade truly left its scabbard?",
      "regret": "A single blade went to the river feast, maintaining the fragile alliance between Shu and Wu.",
      "history": "Guan Yu met Lu Su on the riverbank to discuss the borders of Jingzhou, holding his blade in reserve.",
      "yeshi": "Stepping into the banquet with his blade in hand, his towering presence held Jiangdong's swords in awe.",
      "note": "Chronicler's Note: This page was won not by raw courage, but by unyielding righteousness.",
      "defeat": "The ambush tripped the guest, and diplomatic peace turned into blood.",
    },
    "ja": {
      "name": "単刀赴会",
      "premise": "かの青龍刀、真に鞘走らばいかに。",
      "regret": "単刀もて会に赴き、劉孫同盟の命脈を繋ぎ止む。",
      "history": "関羽、魯粛の招きに応じ単刀佩きて川辺の会談に臨み、荊州の帰属を談ず。",
      "yeshi": "大杯を傾けつつ魯粛の手を執る。伏兵を威圧し悠然と舟に乗り帰りぬ。",
      "note": "筆記者注：此の頁を勝ちたるは度胸にあらず、理の力なり。",
      "defeat": "伏兵斬りかかり、舟は長江の藻屑と消えぬ。",
    }
  },
  "xiaoyaojin": {
    "en": {
      "name": "Battle of Xiaoyaojin",
      "premise": "What if the horsemen at the broken bridge waited one incense time longer?",
      "regret": "Zhang Liao's eight hundred warriors routed Sun Quan's hundred thousand at Xiaoyaojin.",
      "history": "Zhang Liao led eight hundred shock troops out of Hefei, crushing Sun Quan's main army at Xiaoyaojin.",
      "yeshi": "Sun Quan leaped across the broken wooden bridge on horseback, forever trembling at the name of Zhang Liao.",
      "note": "Chronicler's Note: His valor was built on your moment of hesitation.",
      "defeat": "Sun Quan fell into the river, and the Eastern Wu throne shattered.",
    },
    "ja": {
      "name": "逍遥津の奇襲",
      "premise": "破橋の騎兵、今一炷香の間待ちたりせば。",
      "regret": "張遼八百騎、逍遥津にて孫権十万の大軍を壊滅せしむ。",
      "history": "張遼、合肥を出でて奇襲を仕掛け、孫権軍を完膚なきまでに叩く。",
      "yeshi": "孫権、橋を飛び越えて九死に一生を得たり。『遼来来』の声、江東に鳴り止まず。",
      "note": "筆記者注：彼の勇姿は、汝の乱れの上に築かれしもの。",
      "defeat": "馬足橋を越えず、孫権は長江に沈みぬ。",
    }
  },
  "dingjunshan": {
    "en": {
      "name": "Mount Dingjun",
      "premise": "What if the veteran general's downward slash had struck empty air?",
      "regret": "Huang Zhong charged down from the heights, cutting down Xiahou Yuan in one blow.",
      "history": "Huang Zhong occupied the high ground at Mount Dingjun and launched a sudden charge, killing Xiahou Yuan.",
      "yeshi": "Descending from the mountain crest like a thunderbolt, the veteran warrior secured the conquest of Hanzhong.",
      "note": "Chronicler's Note: Those who hold the heights command the momentum.",
      "defeat": "The charge faltered uphill, and the veteran army was cut off from supplies.",
    },
    "ja": {
      "name": "定軍山",
      "premise": "老将の一太刀、もしも空を薙ぎしなら。",
      "regret": "黄忠、高所より駆け下り、一撃のもとに夏侯淵を討ち取る。",
      "history": "黄忠、法正の策に従いて定軍山の高嶺を奪い、夏侯淵を急襲して斬首す。",
      "yeshi": "白髪を風になびかせ雷霆の如く下る。漢中争奪の均衡、一太刀に破れたり。",
      "note": "筆記者注：高きに居る者は、勢いを制す。",
      "defeat": "老将の刀は逸れ、返り討ちの凶刃に散りぬ。",
    }
  },
  "shuiyan": {
    "en": {
      "name": "Flooding the Seven Armies",
      "premise": "What if the autumn torrents arrived three days too late?",
      "regret": "The floodwaters drowned Yu Jin's seven armies, echoing Guan Yu's fame across China.",
      "history": "Heavy autumn rains swelled the Han River. Guan Yu diverted the waters, drowning Yu Jin's seven legions outside Fancheng.",
      "yeshi": "War barges sailed above flooded ramparts. Guan Yu stood in armor, terrifying Cao Cao into considering moving his capital.",
      "note": "Chronicler's Note: The heavens themselves fought on your side this day.",
      "defeat": "The dikes held firm, and Guan Yu's vanguard was surrounded by dry walls.",
    },
    "ja": {
      "name": "水淹七軍",
      "premise": "かの秋雨、三日遅れて降りしなら。",
      "regret": "漢水氾濫し、于禁の七軍ことごとく魚服に帰す。",
      "history": "関羽、長雨に増水せし漢水を決壊させ、于禁・龐徳の援軍七軍を水没せしむ。",
      "yeshi": "城壁の上を巨艦が往く。関羽の武威天下を震わせ、曹操をして遷都を謀らしむ。",
      "note": "筆記者注：天時、汝の背にあり。",
      "defeat": "堤防決壊せず、水軍は乾きし大地に取り残されぬ。",
    }
  },
  "maicheng": {
    "en": {
      "name": "Retreat to Maicheng",
      "premise": "What if Jingzhou was never lost?",
      "regret": "White clothes crossed the river in stealth, and the God of War fell at Linju.",
      "history": "Lu Meng feigned illness while crossed the river in merchant disguise. Guan Yu lost Jingzhou and was ambushed at Maicheng.",
      "yeshi": "Surrounded in the lone citadel of Maicheng, he gazed across the snowy plains, keeping his honor to the last breath.",
      "note": "Chronicler's Note: On this page lies the bitterest tear in all history.",
      "defeat": "The snow swallowed his footsteps, and the Green Dragon fell silent forever.",
    },
    "ja": {
      "name": "麦城の落日",
      "premise": "もし荊州、失われざりせば。",
      "regret": "白衣大江を渡り、軍神ついに臨沮に落つ。",
      "history": "呂蒙白衣にて長江を渡り荊州を急襲。関羽麦城に追い詰められ、臨沮にて刑戮さる。",
      "yeshi": "孤城麦城に雪降りしきる。天下無双の義将、至高の誇りを胸に最期を迎えたり。",
      "note": "筆記者注：此の頁、全巻最大の涙を湛えり。",
      "defeat": "雪原に朱色の血流れ、軍神の魂は天に昇りぬ。",
    }
  },
  "yiling": {
    "en": {
      "name": "Fire at Yiling",
      "premise": "What if the seven hundred li of camps were never pitched among trees?",
      "regret": "Lu Xun's fire scorched seven hundred li of camps, ending Shu's golden host.",
      "history": "Liu Bei attacked Wu to avenge Guan Yu. Lu Xun held his lines until autumn and burned Liu Bei's camps.",
      "yeshi": "Flames turned night into blinding noon across the mountains. Liu Bei fled into the safety of Baidi City.",
      "note": "Chronicler's Note: The wrath was his, but the consequence was yours.",
      "defeat": "The fire spread unchecked, consuming the army and the emperor's ambitions.",
    },
    "ja": {
      "name": "夷陵の炎",
      "premise": "七百里の連営、深林になかりせば。",
      "regret": "陸遜の火攻め、七百里の連営を一夕にして焼き払う。",
      "history": "劉備、関羽の仇を討つべく東征す。陸遜粘り強く守りて、火計もて蜀軍を潰走せしむ。",
      "yeshi": "連峰を埋め尽くす劫火。白帝城へと逃れゆく先主の背に、時代の落日が重なる。",
      "note": "筆記者注：怒りは彼のもの、焦りは汝のもの。",
      "defeat": "炎は山を覆い、蜀漢の精鋭は灰と化しぬ。",
    }
  },
  "baidicheng": {
    "en": {
      "name": "Entrusting the Orphan at Baidi",
      "premise": "What if the final entrustment never needed to be spoken?",
      "regret": "At Yong'an Palace, Liu Bei placed his son and kingdom into Zhuge Liang's hands.",
      "history": "On his deathbed at Baidi City, Liu Bei entrusted the orphan and the Han restoration to Zhuge Liang.",
      "yeshi": "Hands clasped in tearful devotion, a bond between sovereign and minister was forged stronger than gold.",
      "note": "Chronicler's Note: Some opponents are not sitting across the card table.",
      "defeat": "The emperor died without heir, and the kingdom fell into factional ruin.",
    },
    "ja": {
      "name": "白帝城の託孤",
      "premise": "かの悲痛の遺言、口にせざりせば。",
      "regret": "永安宮の病床、君臣の義は金石よりも固し。",
      "history": "劉備、白帝城に病篤く、諸葛亮に幼主と蜀漢の社稷を託して崩御す。",
      "yeshi": "涙ながらに交わされし手と手。君臣の契りは、乱世の暗雲を貫く光となりたり。",
      "note": "筆記者注：卓上におらぬ敵こそ、最も恐ろしきもの。",
      "defeat": "遺言定まらぬまま先主崩御し、国は内紛に沈みぬ。",
    }
  },
  "qiqin": {
    "en": {
      "name": "Seven Captures of Meng Huo",
      "premise": "What if on the seventh capture, he remained unyielding?",
      "regret": "Capturing and releasing Meng Huo seven times won the hearts of the southern tribes forever.",
      "history": "Zhuge Liang pacified the southern barbarians, capturing and releasing Meng Huo seven times to win true loyalty.",
      "yeshi": "Across poisonous marshes and burning valleys, loyalty was won not by iron, but by benevolence.",
      "note": "Chronicler's Note: To capture him seven times, you must release him six times.",
      "defeat": "The southern warriors retreated into impenetrable marshes, refusing all peace.",
    },
    "ja": {
      "name": "七擒孟獲",
      "premise": "七度目もなお、心服せざりせば。",
      "regret": "七度捕らえて七度放ち、南中の心を永遠に勝ち取る。",
      "history": "諸葛亮南征し、孟獲を七度捕らえて七度釈放し、南蛮の真の服従を得たり。",
      "yeshi": "瘴気の沼を越え、武力ならず徳をもって心を征す。南蛮の地、蜀漢の後背地とならん。",
      "note": "筆記者注：七度捕らえるには、六度放たねばならず。",
      "defeat": "南蛮の民心を失い、背後を脅かされ続けぬ。",
    }
  },
  "qishan": {
    "en": {
      "name": "Northern Expedition from Qishan",
      "premise": "What if the Memorial on the Northern Expedition was not the final chapter?",
      "regret": "Leading the armies through the mountain passes six times to restore the Han.",
      "history": "Zhuge Liang submitted the Memorial on the Northern Expedition and marched out of Hanzhong toward Qishan.",
      "yeshi": "The green dragon banners crested the mountain pass. An old minister dedicated his remaining years to an impossible oath.",
      "note": "Chronicler's Note: Knowing that it cannot be done, yet doing it anyway.",
      "defeat": "Supplies failed in the rugged mountains, forcing a bitter retreat.",
    },
    "ja": {
      "name": "祁山出陣",
      "premise": "『出師の表』、最後の編にあらざりせば。",
      "regret": "漢室復興を誓い、六度祁山に出でて天下を震わす。",
      "history": "諸葛亮、『前出師表』を奉りて漢中より北伐を開始す。",
      "yeshi": "剣閣を越え祁山に翻る蜀漢の旗。不可能な大望に全生涯を捧ぐ孤高の忠臣。",
      "note": "筆記者注：不可なるを知りて、なおこれを行わん。",
      "defeat": "険道に兵站途絶え、空しく漢中へ撤退せり。",
    }
  },
  "tianshui": {
    "en": {
      "name": "Subduing Jiang Wei",
      "premise": "What if the veteran of Fengming Mountain was bested by a youth?",
      "regret": "At Tianshui, the Sleeping Dragon found the young disciple who would carry his dream.",
      "history": "Jiang Wei saw through Zhuge Liang's stratagem at Tianshui, and was later recruited to inherit his military lore.",
      "yeshi": "Looking at the brilliant young officer kneeling before him, Zhuge Liang passed down the secret scrolls of Shu Han.",
      "note": "Chronicler's Note: On this page, victory means recruiting him, not crushing him.",
      "defeat": "Jiang Wei slipped through the trap, denying Shu Han its last great general.",
    },
    "ja": {
      "name": "天水・姜維降る",
      "premise": "鳳鳴山の老将、若き俊英に敗れたりせば。",
      "regret": "天水の野にて、臥竜ついに後継者・姜維を見出だす。",
      "history": "姜維、諸葛亮の計略を破るも、後に策に落ちて蜀に降伏し軍を継承す。",
      "yeshi": "若き麒麟児を前に、軍師微笑みて兵書を授く。漢室復興の炎は受け継がれたり。",
      "note": "筆記者注：此の頁は敵を倒すにあらず、迎え入れることなり。",
      "defeat": "姜維は魏に残り、蜀漢の後継者は現れざりき。",
    }
  },
  "jieting": {
    "en": {
      "name": "The Loss of Jieting",
      "premise": "What if Ma Su had camped right across the main road?",
      "regret": "Camping on the hilltop led to total loss, forcing the tears at Ma Su's execution.",
      "history": "Ma Su ignored orders and camped atop Mount Jieting; Zhang He cut off his water supply and annihilated the outpost.",
      "yeshi": "Water supplies ran dry in the summer heat. Jieting fell, collapsing the entire Northern Expedition.",
      "note": "Chronicler's Note: Defense brings victory; overconfidence brings ruin.",
      "defeat": "Water dried on the hill, and the Northern Expedition was shattered.",
    },
    "ja": {
      "name": "街亭の敗戦",
      "premise": "馬謖、もし要道を押さえて布陣せば。",
      "regret": "山頂に陣を布き水を断たれ、泣いて馬謖を斬るの悲哀を招く。",
      "history": "馬謖、命令に背き街亭の山頂に布陣す。張郃に水源を断たれて全軍壊滅す。",
      "yeshi": "渇きに狂う兵卒。街亭の失陥は、北伐最大の機運を一瞬にして吹き飛ばせり。",
      "note": "筆記者注：守れば勝ち、過信せば滅ぶ。",
      "defeat": "山頂の水尽き、街亭は敵手に落ちぬ。",
    }
  },
  "kongcheng": {
    "en": {
      "name": "The Empty Fort Stratagem",
      "premise": "What if the zither atop the rampart snapped a single string?",
      "regret": "An empty city gate and a quiet zither drove away Sima Yi's fifteen legions.",
      "history": "Zhuge Liang opened the city gates and played the zither calmly, causing Sima Yi to suspect an ambush and retreat.",
      "yeshi": "Incense smoke drifted lazily above the open city gate. The calm notes of the zither echoed with unfathomable depth.",
      "note": "Chronicler's Note: The smarter your opponent, the easier he falls to an empty bluff.",
      "defeat": "The zither string broke with a snap, and the enemy cavalry rushed the open gate.",
    },
    "ja": {
      "name": "空城の計",
      "premise": "城楼上の琴、もし一弦断ぜらば。",
      "regret": "空城を開きて琴を弾じ、司馬懿十五万の大軍を退散せしむ。",
      "history": "諸葛亮、西城にて門を開き悠然と琴を奏で、司馬懿に伏兵を疑わせて退かせたり。",
      "yeshi": "城門開け放たれ、香の煙漂う。静けき琴の調べに、老獪な将も背筋を凍らせ退却せり。",
      "note": "筆記者注：利口な敵ほど、ブラフにかかり易きもの。",
      "defeat": "琴の弦断ち切られ、騎兵怒涛の如く乱入せり。",
    }
  },
  "chencang": {
    "en": {
      "name": "Siege of Chencang",
      "premise": "What if when siege ladders shattered, a final letter remained?",
      "regret": "Hao Zhao held Chencang with one thousand men, defying all siege machinery for weeks.",
      "history": "Hao Zhao fortified Chencang with a small garrison, repelling Zhuge Liang's siege engines until relief arrived.",
      "yeshi": "Cloud ladders burned and tunnels collapsed. Two masters of siege and defense traded stratagems under the stars.",
      "note": "Chronicler's Note: If you cannot breach the fortress, attack his reason for holding it.",
      "defeat": "Supplies ran out before the stone walls, forcing a retreat.",
    },
    "ja": {
      "name": "陳倉の攻防",
      "premise": "雲梯尽き果て、なお一通の書状あらば。",
      "regret": "郝昭千人にて城を死守し、諸葛亮の攻城兵器をことごとく阻む。",
      "history": "郝昭、寡兵にて陳倉城を堅守し、諸葛亮の二十日間にわたる猛攻を退けたり。",
      "yeshi": "雲梯燃え落城ならず。攻城と防衛の達人二人、夜空の下で知謀を尽くせり。",
      "note": "筆記者注：城を落とせざらば、守る理由を崩せ。",
      "defeat": "城壁はびくともせず、糧食尽きて退却を余儀なくされぬ。",
    }
  },
  "shangfanggu": {
    "en": {
      "name": "Rain at Shangfang Valley",
      "premise": "What if the heavens delayed the downpour by half a moment?",
      "regret": "'Man proposes, Heaven disposes.' A Sudden rain saved Sima Yi from the valley of fire.",
      "history": "Zhuge Liang trapped Sima Yi in Shangfang Valley and set fire to it, but a sudden downpour extinguished the flames.",
      "yeshi": "Flames rose like dragons before the clouds burst with torrential rain. Zhuge Liang sighed into the heavens.",
      "note": "Chronicler's Note: At the end of human strategy lies the breath of heaven.",
      "defeat": "The rain quenched the fire, and Sima Yi rode out to safety.",
    },
    "ja": {
      "name": "上方谷の雨",
      "premise": "かの驟雨、半刻遅れて降りしなら。",
      "regret": "「謀るは人にあり、成すは天にあり」天の驟雨、司馬懿を火海より救う。",
      "history": "諸葛亮、司馬懿父子を上方谷に誘い込み火計を放つも、突如の豪雨に阻まる。",
      "yeshi": "天を衝く紅蓮の炎、一転して雷鳴轟く豪雨に消ゆ。軍師天を仰ぎて大息す。",
      "note": "筆記者注：人知の極みは、天運の巡り合わせにあり。",
      "defeat": "豪雨炎を消し去り、司馬懿父子逃走せり。",
    }
  },
  "wuzhangyuan": {
    "en": {
      "name": "Wuzhang Plains",
      "premise": "What if this time, the stars in the southeast shone bright?",
      "regret": "The prime minister died before victory, leaving tears on the robes of all heroes.",
      "history": "Zhuge Liang confronted Sima Yi at Wuzhang Plains for one hundred days, perishing from illness in the camp.",
      "yeshi": "The fallen star was obscured in the mist. Even in death, the wooden statue of Zhuge drove away the living Sima.",
      "note": "Chronicler's Note: If he refuses battle, your supply line is your very life.",
      "defeat": "The lantern of the big dipper went dark, and the army fell into grief.",
    },
    "ja": {
      "name": "五丈原の星",
      "premise": "今ひとたび、東南の星輝かば。",
      "regret": "出師未だ捷たざるに身先ず死し、長使英雄涙満襟。",
      "history": "諸葛亮、五丈原にて司馬懿と百日対峙し、秋風の陣中に病没す。",
      "yeshi": "巨星落つるも木像なお活ける仲達を走らす。蜀漢の英魂、万代に語り継がれん。",
      "note": "筆記者注：彼が出陣せざる時、兵糧こそが汝の命脈。",
      "defeat": "祈祷の灯火吹き消され、五丈原の秋風冷たし。",
    }
  },
  "gaopingling": {
    "en": {
      "name": "Incident at Gaopingling",
      "premise": "What if feigned sickness failed to deceive your eyes?",
      "regret": "Ten years of patient endurance culminated in the coup that usurped the throne of Wei.",
      "history": "Sima Yi feigned decrepit illness to lower Cao Shuang's guard, seizing Luoyang while Cao Shuang visited Gaopingling.",
      "yeshi": "The shaking hands suddenly drew steel. Decades of hidden ambition seized the imperial capital in one strike.",
      "note": "Chronicler's Note: His apparent weakness was only bait.",
      "defeat": "Cao Shuang saw through the coup, executing Sima Yi's family in Luoyang.",
    },
    "ja": {
      "name": "高平陵の変",
      "premise": "かの「仮病」、見破りたりせば。",
      "regret": "十年の忍従、一朝にして魏の皇権を奪う。",
      "history": "司馬懿、病と偽り曹爽を油断させ、高平陵参詣の隙を突きて洛陽を占拠す。",
      "yeshi": "震える老手が突如として鋭き白刃を抜く。長年の忍耐、一朝にして天下を制せり。",
      "note": "筆記者注：彼の隙は、すべて罠の餌なり。",
      "defeat": "計略露見し、司馬一族は洛陽にて捕縛されぬ。",
    }
  },
  "tielongshan": {
    "en": {
      "name": "Siege of Mount Tielong",
      "premise": "What if when springs dried up, the Qiang advanced instead of retreating?",
      "regret": "Surrounded on Mount Tielong, Sima Zhao struck stone to find water, while Jiang Wei had to retreat.",
      "history": "Jiang Wei besieged Sima Zhao on Mount Tielong, but Guo Huai attacked his rear and lifted the siege.",
      "yeshi": "Spring water gushed from dry rock like an omen from heaven. The Qiang withdrew, and the mountain siege broke.",
      "note": "Chronicler's Note: Those who besiege others must first calculate how long they can survive.",
      "defeat": "Guo Huai's flanking force severed the pass, trapping the Northern Expedition in the mountain.",
    },
    "ja": {
      "name": "鉄籠山の囲み",
      "premise": "泉涸れしとき、羌兵退かずして攻め寄せば。",
      "regret": "鉄籠山に包囲され、司馬昭石を穿ちて泉を得、姜維無念の撤退。",
      "history": "姜維、司馬昭を鉄籠山に包囲するも、郭淮の背後奇襲により囲みを解かる。",
      "yeshi": "枯れたる岩より突如として清泉湧き出づ。羌兵退散し、包囲は崩れ去りぬ。",
      "note": "筆記者注：敵を囲む者は、まず自らの耐えうる日数を算せよ。",
      "defeat": "背後を断たれ、鉄籠山の谷底にて壊滅せり。",
    }
  },
  "huainan": {
    "en": {
      "name": "Three Rebellions in Huainan",
      "premise": "What if the manifesto against usurpers lacked just one name?",
      "regret": "Loyalists rose three times in Huainan, but none could stop the rise of Jin.",
      "history": "Wang Ling, Guanqiu Jian, and Zhuge Dan rebelled sequentially in Huainan, all crushed by the Sima clan.",
      "yeshi": "Banners of loyalty rose across the Huai River, shedding the final drops of Han and Wei blood.",
      "note": "Chronicler's Note: The more names on the banner, the more important to win men's hearts first.",
      "defeat": "The rebellion was suppressed, cementing the supremacy of the Sima family.",
    },
    "ja": {
      "name": "淮南三叛",
      "premise": "逆賊を討つ檄文、只一人の名を欠かば。",
      "regret": "淮南に三度忠臣起つも、司馬氏の勢いを止むる能わず。",
      "history": "王凌・毋丘倹・諸葛誕、相次ぎて淮南に挙兵するも、司馬師・司馬昭に平定さる。",
      "yeshi": "淮水の波を朱に染むる忠烈の血。魏朝最後の忠義、落日の光を放ちて散りぬ。",
      "note": "筆記者注：名の多き時ほど、人心を勝ち取るを先とせよ。",
      "defeat": "寿春城陥落し、忠臣の首級は都へ送られぬ。",
    }
  },
  "ganlu": {
    "en": {
      "name": "Incident at Ganlu Hall",
      "premise": "What if the Poem of the Hidden Dragon was inscribed after blades were drawn?",
      "regret": "The young emperor took up arms himself, dying in the street outside Ganlu Hall.",
      "history": "Emperor Cao Mao led his guards to attack Sima Zhao, but was killed in the palace street by Cheng Ji.",
      "yeshi": "Drawing his imperial sword against usurpers, the young sovereign preferred death to subjugation.",
      "note": "Chronicler's Note: This page wagers not on victory, but on the verdict of history.",
      "defeat": "The palace chariot overturned, and the dynasty fell into silence.",
    },
    "ja": {
      "name": "甘露殿の変",
      "premise": "『潜竜の詩』、刃抜き放ちし後に吟ぜらば。",
      "regret": "若き天子自ら剣を執り、甘露殿前の街頭に散る。",
      "history": "魏帝・曹髦、司馬昭の専横に怒り兵を率いて討たんとするも、成済に刺殺さる。",
      "yeshi": "天子自ら御剣を振るい逆賊に立ち向かう。敗れてなお、漢魏の気概を天下に示せり。",
      "note": "筆記者注：此の頁は勝敗を賭くるにあらず、歴史の筆を賭くるなり。",
      "defeat": "御車倒れ、天子の血宮門を染めぬ。",
    }
  },
  "jiange": {
    "en": {
      "name": "Cliffs of Jiange",
      "premise": "What if when one held the pass, no secret trail bypassed the rear?",
      "regret": "Jiang Wei held Jiange firmly, but Chengdu had already opened its gates.",
      "history": "Jiang Wei locked horns with Zhong Hui at the cliffs of Jiange, holding the pass until Liu Shan surrendered.",
      "yeshi": "Ten legions could not breach the iron cliffs. Yet the surrender decree came from the emperor's court behind him.",
      "note": "Chronicler's Note: Even if you hold the front, never forget your flanks.",
      "defeat": "The mountain pass was bypassed, rendering heroic resistance futile.",
    },
    "ja": {
      "name": "剣閣の絶壁",
      "premise": "一夫関を守り、背後に抜け道なかりせば。",
      "regret": "姜維剣閣を死守するも、成都はすでに降伏の門を開けり。",
      "history": "姜維、鍾会の大軍を剣閣にて食い止めるも、後方の劉禅が鄧艾に降伏す。",
      "yeshi": "絶壁の如き関門、十万の敵も抜く能わず。されど背後より届きしは降伏の勅命なりき。",
      "note": "筆記者注：正面を守るも、側面を忘るることなかれ。",
      "defeat": "抜け道を突かれ、剣閣の死守は水泡に帰せり。",
    }
  },
  "yinping": {
    "en": {
      "name": "Yinping Trail",
      "premise": "What if guards were stationed atop the cliffs of Motian Ridge?",
      "regret": "Deng Ai wrapped himself in felt to roll down the cliff, taking Chengdu in one blow.",
      "history": "Deng Ai marched through seven hundred li of uninhabited mountains, bypassing Jiange to seize Jiangyou and Chengdu.",
      "yeshi": "Rolling down treacherous cliffs wrapped in wool, ghost soldiers appeared out of the southern mountains.",
      "note": "Chronicler's Note: On the most perilous path, the greatest fear is someone waiting at the end.",
      "defeat": "The cliff fell under surprise attack, and the road to Chengdu opened wide.",
    },
    "ja": {
      "name": "陰平の険",
      "premise": "摩天嶺の絶壁、守備兵あらば。",
      "regret": "鄧艾、毛布に身を包みて断崖を転がり下り、奇襲にて成都を陥落せしむ。",
      "history": "鄧艾、道なき陰平の険を踏破し、剣閣を迂回して成都に迫り劉禅を降す。",
      "yeshi": "絶壁を転がり下りて現れし幽霊の如き奇兵。誰も信ぜざる道より天下は覆りたり。",
      "note": "筆記者注：険しき道ほど、待ち受くる者を恐るべし。",
      "defeat": "奇襲陣形を砕かれ、山岳にて立ち往生せり。",
    }
  },
  "yanglu": {
    "en": {
      "name": "Friendship of Yang and Lu",
      "premise": "What if two years across the frontier hung on a single cup of medicine?",
      "regret": "Yang Hu and Lu Kang guarded opposite sides of the border with profound mutual chivalry.",
      "history": "Yang Hu and Lu Kang commanded the Jin and Wu borders, treating each other with unmatched chivalric respect.",
      "yeshi": "Medicine sent without poison, wine drunk without hesitation. An oasis of peerless honor amidst final war.",
      "note": "Chronicler's Note: The hardest opponent is the one who makes you wish not to defeat him.",
      "defeat": "Poison entered the wine cup, and chivalry died on the frontier.",
    },
    "ja": {
      "name": "羊陸の交わり",
      "premise": "国境を挟みて二年、只一杯の良薬を交わさば。",
      "regret": "羊祜と陸抗、敵陣相対峙しつつも高潔なる信義を交わす。",
      "history": "羊祜と陸抗、西陵・襄陽の境にて対陣し、互いに医薬を贈り合い礼を尽くす。",
      "yeshi": "疑いなく良薬を飲み、信を尽くして国境を守る。乱世の終幕に咲き誇りし君子の徳。",
      "note": "筆記者注：最も難敵たるは、勝ちたくないとさえ思わせる者なり。",
      "defeat": "信義失われ、国境に暗殺の風吹き荒れぬ。",
    }
  },
  "guijin": {
    "en": {
      "name": "Three Kingdoms Return to Jin",
      "premise": "What if the cards of the Three Kingdoms had one final hand?",
      "regret": "The Three Kingdoms unified under Jin, ending a century of epic strife.",
      "history": "In 280 AD, Jin forces attacked Wu from multiple routes; Sun Hao surrendered, bringing the realm under unified rule.",
      "yeshi": "Iron chains dissolved in the river waves. The board was cleared, leaving centuries of legendary lore.",
      "note": "Chronicler's Note: That which is long divided must unite; yet unity is never the final word.",
      "defeat": "The river fleets sank, leaving the realm divided forever.",
    },
    "ja": {
      "name": "三国帰晋",
      "premise": "三国の盤上、なお最後の一局あらば。",
      "regret": "百年の英雄の死闘、ついに晋の一統に帰す。",
      "history": "太康元年、晋軍六道より呉を討ち、孫皓降伏して三国乱世ついに統一さる。",
      "yeshi": "長江を鎖す鉄鎖も砕け散り、天下は静けさを取り戻す。盤上の英雄たち、永遠の伝説とならん。",
      "note": "筆記者注：分かつこと久しければ必ず合す。されど合すもまた……。",
      "defeat": "水軍壊滅し、天下は泥沼の分裂に逆戻りせり。",
    }
  },
  "zuizhong": {
    "en": {
      "name": "The Final Page: The Chronicler",
      "premise": "What if the chronicler who penned this scroll sat across to play a hand with you?",
      "regret": "All five scrolls are read, yet the yearning of history never truly fades.",
      "history": "Beyond the fifty chapters lies the chronicler's desk, where ink dries on the blank parchment of fate.",
      "yeshi": "Placing the cards upon the table, the chronicler smiled: 'You have finally arrived.'",
      "note": "Chronicler's Note: You have arrived.",
      "defeat": "The scroll rolls closed, awaiting your next reading.",
    },
    "ja": {
      "name": "最終頁 · 筆記者",
      "premise": "この書を著せし筆記者、腰を据えて貴殿と一局交わすなら。",
      "regret": "五巻読み終われども、歴史の未練は尽きることなし。",
      "history": "五十回の果てに広がるは白紙の頁。筆記者の机上に乾きゆく墨の跡。",
      "yeshi": "卓上に手牌を置き、筆記者は静かに微笑みたり。「よくぞ参られた」",
      "note": "筆記者注：貴殿、参られたか。",
      "defeat": "巻は静かに閉じられ、再び開かれん日を待つ。",
    }
  }
}


RULE_TEXTS = {
    "hulao": {
        "en": "Peerless under heaven, he only advances. Duck low and wait for him to tire.",
        "ja": "天下無双の男は退くを知らず。身を伏せ、その息切れを待て。",
        "tw": "他天下無雙，只進不退。蹲下，等他力竭。"
    },
    "fengyiting": {
        "en": "Eyes deceive on this page: tells and feints are doubled.",
        "ja": "見ゆるもの全て真にあらず：虚勢と見せかけの仕草が倍加す。",
        "tw": "此頁眼見未必為實：破綻假動作加倍。"
    },
    "baima": {
        "en": "Two battles in sequence: blades at Baima, steeds at Yanjin. Warm the wine twice.",
        "ja": "二連戦なり：白馬に刃を交え、延津に騎を突く。酒は二度温めよ。",
        "tw": "連戰兩陣：白馬對刀，延津對馬。酒要溫兩回。"
    },
    "qianli": {
        "en": "Five bouts in sequence, close-quarters combat each time. Your chips carry through.",
        "ja": "五連戦の死闘、幾度も白刃を交ゆ。己の籌碼は終始持ち越されん。",
        "tw": "連戰五場，場場短兵。你的籌碼一路相隨。"
    },
    "guandu": {
        "en": "He has rations, you do not; the blinds rise swifter—strike swiftly.",
        "ja": "敵の兵糧は多く己は乏し。ブラインドの上昇は急なり——速戦あるのみ。",
        "tw": "他糧多你糧少，盲注漲得更快——速戰。"
    },
    "sangu": {
        "en": "Visit three times before he takes his seat. Sincerity is the only key.",
        "ja": "三度訪ねて初めて座に着かん。誠意こそが唯一の扉を開く鍵なり。",
        "tw": "連訪三次，他才肯落座。誠意是唯一的敲門磚。"
    },
    "shezhan": {
        "en": "Three scholars share the table, each with debates. Let them clash, led by none.",
        "ja": "三人の碩学が同席し難問を投げかく。互いに論駁させ、翻弄さるるなかれ。",
        "tw": "三儒同席，各有問難。讓他們彼此反駁，也別被任何一人牽著走。"
    },
    "chibi": {
        "en": "Three sides share the table, each for himself. Blinds rise faster—clear the table before fire dies.",
        "ja": "三方鼎立の卓にて各々争う。ブラインドは速やかに迫る——炎が消える前に敵を払え。",
        "tw": "三方同桌，各自為戰。盲注漲得更快——讓所有對手離席，火才不等人。"
    },
    "huarong": {
        "en": "On this page, victory demands a choice.",
        "ja": "此の頁、勝ちたる後もなお選択を迫られん。",
        "tw": "這一頁，贏了還要選。"
    },
    "sanqi": {
        "en": "He flares at a spark—psychological warfare is your blade here.",
        "ja": "一撃で激昂す——心を攻むるこそ、此の頁における真の刃なり。",
        "tw": "他一點就著——攻心，是這一頁的刀。"
    },
    "ruxu": {
        "en": "Raid swiftly: his reinforcements draw closer with every hand played.",
        "ja": "夜襲は迅速を旨とす：一手進むごとに敵の援軍は一歩近づかん。",
        "tw": "劫營要快：他的援軍每過一手就更近一步。"
    },
    "xiaoyaojin": {
        "en": "He strikes fiercest when you are midway across—steady your lines before the bridge.",
        "ja": "半ば渡る時こそ最も凶猛なり——まず足場を固め、然る後に津橋を渡れ。",
        "tw": "他在你半渡時最凶——先把陣腳站穩，再過津橋。"
    },
    "yiling": {
        "en": "Blinds climb swiftly—his flames wait for your mistake.",
        "ja": "ブラインドは急速に迫る——彼の炎は、汝の失策を待ち受けたり。",
        "tw": "盲注漲得更快——他的火，在等你犯錯。"
    },
    "qiqin": {
        "en": "Seven rounds in sequence. Capture him seven times, release him six.",
        "ja": "七連戦の試練。七度捕らえ、六度放擲せよ。",
        "tw": "連戰七場。擒他七次，也要放他六次。"
    },
    "kongcheng": {
        "en": "The wiser he is, the easier he is deceived—bluffs are worth more on this page.",
        "ja": "賢者ほど欺き易し——此の頁においてブラフの価値は倍加せん。",
        "tw": "他越聰明，越好騙——詐唬在這一頁更值錢。"
    },
    "shangfanggu": {
        "en": "Fire rises at the valley entrance: claim his retreat before driving him in.",
        "ja": "谷口より火の手上がる：谷奥へ追い詰むる前に、まず退路を断て。",
        "tw": "火起於谷口：逼他入谷前，先贏下他的退路。"
    },
    "wuzhangyuan": {
        "en": "Behind high walls he will not engage; double-speed blinds—force battle before rations empty.",
        "ja": "堅壁に籠もりて出でず。ブラインドは倍速——糧尽くる前に決戦を迫れ。",
        "tw": "他堅壁不戰，攻心於他無用；盲注兩倍速——糧盡之前，逼他決戰。"
    },
    "gaopingling": {
        "en": "Every tell he shows is staged for your eyes—beware abundant feints.",
        "ja": "見する隙は全て罠なり——偽りの仕草、極めて多し。",
        "tw": "他的一切破綻，都是給你看的——假動作極多。"
    },
    "huainan": {
        "en": "Two rebellions back-to-back: one fails for grain, one fails from distrust.",
        "ja": "二重の反乱に連戦す：一は糧に敗れ、一は疑心に崩れん。",
        "tw": "連戰兩叛：一叛敗於糧，一叛敗於疑。"
    },
    "ganlu": {
        "en": "He waits for your reveal—the Son of Heaven is your only chip; do not stake it all.",
        "ja": "先に見せるを待つ——天子の名こそ唯一のチップ、軽々しく全賭けするなかれ。",
        "tw": "他等你先亮牌——天子之名是唯一的籌碼，別孤注一擲。"
    },
    "yanglu": {
        "en": "His path to victory is non-engagement—if you rush, you play into his hand.",
        "ja": "「戦わずして勝つ」を狙う——焦りて攻むれば、まさに術中に落ちん。",
        "tw": "他贏的方式是「不戰」——你若急攻，正中其懷。"
    },
    "zuizhong": {
        "en": "He is omniscient—except for the cards. And cards can be verified.",
        "ja": "彼は全知全能なり——手札を除いては。札は、検証可能なり。",
        "tw": "他全知全能——除了牌。牌，是可以驗的。"
    }
}

SKIRMISH_BOSS = {
    "taoyuan": {
        "en": {"sk": "Yellow Turbans · Cheng Yuanzhi", "boss": "Yellow Turban Commander"},
        "ja": {"sk": "黄巾・程遠志", "boss": "黄巾渠帥"},
    },
    "sishui": {
        "en": {"sk": "Liangzhou Cavalry", "boss": "Hua Xiong"},
        "ja": {"sk": "西涼驍騎", "boss": "華雄"},
    },
    "hulao": {
        "en": {"sk": "Bingzhou Wolf Cavalry", "boss": "Lu Bu"},
        "ja": {"sk": "并州狼騎", "boss": "呂布"},
    },
    "xianshan": {
        "en": {"sk": "Xianshan Ambush Crossbows", "boss": "Huang Zu · Arrow of Jiangxia"},
        "ja": {"sk": "峴山伏弩", "boss": "黄祖・江夏の矢"},
    },
    "jieqiao": {
        "en": {"sk": "Xiandeng Vanguard · Qu Yi", "boss": "Wen Chou · Iron Spear of Hebei"},
        "ja": {"sk": "先登営・麹義", "boss": "文醜・河北の鉄槍"},
    },
    "fengyiting": {
        "en": {"sk": "Dong Residence Guards", "boss": "Dong Zhuo"},
        "ja": {"sk": "董府侍衛", "boss": "董卓"},
    },
    "shenting": {
        "en": {"sk": "Liu Yao's Retainers", "boss": "Taishi Ci · Divine Archer"},
        "ja": {"sk": "劉繇府衛", "boss": "太史慈・猿臂の神射"},
    },
    "yuanshemen": {
        "en": {"sk": "Ji Ling's Troops", "boss": "Ji Ling"},
        "ja": {"sk": "紀霊部曲", "boss": "紀霊"},
    },
    "wancheng": {
        "en": {"sk": "Hu Che'er · Night of the Stolen Halberd", "boss": "Zhang Xiu"},
        "ja": {"sk": "胡車児・盗戟の夜", "boss": "張繍"},
    },
    "baimenlou": {
        "en": {"sk": "Camp Formation · Gao Shun", "boss": "Lu Bu · Cornered Beast"},
        "ja": {"sk": "陥陣営・高順", "boss": "呂布・孤影の獣"},
    },
    "zhujiu": {
        "en": {"sk": "Xudu Gatekeeper", "boss": "Cao Cao · Shared Wine"},
        "ja": {"sk": "許都門吏", "boss": "曹操・対酌"},
    },
    "baima": {
        "en": {"sk": "Cao Camp Vanguard · Song Xian", "boss": "Twin Pillars of Hebei"},
        "ja": {"sk": "曹営先鋒・宋憲", "boss": "河北の双璧"},
    },
    "qianli": {
        "en": {"sk": "Pass Guards", "boss": "Guardians of the Five Passes"},
        "ja": {"sk": "関隘守将", "boss": "五関守将"},
    },
    "guandu": {
        "en": {"sk": "Famed Hebei General · Gao Lan", "boss": "Yuan Shao"},
        "ja": {"sk": "河北名将・高覧", "boss": "袁紹"},
    },
    "sangu": {
        "en": {"sk": "Longzhong Page", "boss": "Sleeping Dragon · Zhuge Liang"},
        "ja": {"sk": "隆中書童", "boss": "臥龍・諸葛亮"},
    },
    "bowang": {
        "en": {"sk": "Cao Vanguard", "boss": "Xiahou Dun"},
        "ja": {"sk": "曹軍前鋒", "boss": "夏侯惇"},
    },
    "changban": {
        "en": {"sk": "Pursuing Cavalry · Wen Pin", "boss": "Cao Cao · Pursuing Army"},
        "ja": {"sk": "追騎・文聘", "boss": "曹操・追撃軍"},
    },
    "shezhan": {
        "en": {"sk": "Jiangdong Scholars", "boss": "Jiangdong Scholars · Zhang Zhao"},
        "ja": {"sk": "江東儒生", "boss": "江東諸儒・張昭"},
    },
    "caochuan": {
        "en": {"sk": "Feigned Defector · Cai Zhong", "boss": "Cao Cao · On the River"},
        "ja": {"sk": "詐降細作・蔡中", "boss": "曹操・江上"},
    },
    "chibi": {
        "en": {"sk": "Northern Flotilla Riders", "boss": "Cao Cao · Linked Armada"},
        "ja": {"sk": "北軍水騎", "boss": "曹操・連環船"},
    },
    "huarong": {
        "en": {"sk": "Remnants of Defeated Army", "boss": "Cao Cao · Desperate Flight"},
        "ja": {"sk": "敗軍残部", "boss": "曹操・窮途"},
    },
    "nanjun": {
        "en": {"sk": "Rearguard · Cao Hong", "boss": "Cao Ren · Iron Defense"},
        "ja": {"sk": "殿軍・曹洪", "boss": "曹仁・天人守城"},
    },
    "sanqi": {
        "en": {"sk": "Eastern Wu Captain", "boss": "Zhou Yu"},
        "ja": {"sk": "東呉小将", "boss": "周瑜"},
    },
    "tongguan": {
        "en": {"sk": "Liangzhou Vanguard · Pang De", "boss": "Fury of Liangzhou"},
        "ja": {"sk": "西涼先鋒・龐徳", "boss": "西涼の怒火"},
    },
    "ruxu": {
        "en": {"sk": "Wei Vanguard · Yue Jin", "boss": "King of Wei's Guards"},
        "ja": {"sk": "魏塁前鋒・楽進", "boss": "魏王親軍"},
    },
    "luofengpo": {
        "en": {"sk": "Xichuan Ambushers", "boss": "Zhang Ren"},
        "ja": {"sk": "西川伏兵", "boss": "張任"},
    },
    "jiameng": {
        "en": {"sk": "Liangzhou Lieutenant · Ma Dai", "boss": "Ma Chao · Silver Spear"},
        "ja": {"sk": "西涼偏将・馬岱", "boss": "馬超・錦袍銀槍"},
    },
    "daodan": {
        "en": {"sk": "Concealed Troops · Ding Feng", "boss": "Lu Su · Banquet at Lukou"},
        "ja": {"sk": "帳下伏兵・丁奉", "boss": "魯粛・陸口の宴"},
    },
    "xiaoyaojin": {
        "en": {"sk": "Hefei Garrison · Li Dian", "boss": "The Eight Hundred Braves"},
        "ja": {"sk": "合肥守備・李典", "boss": "八百の勇士"},
    },
    "dingjunshan": {
        "en": {"sk": "Hanzhong Veteran · Guo Huai", "boss": "Xiahou Yuan"},
        "ja": {"sk": "漢中宿将・郭淮", "boss": "夏侯淵"},
    },
    "shuiyan": {
        "en": {"sk": "Vanguard of the Seven Armies", "boss": "The Seven Armies · Yu Jin"},
        "ja": {"sk": "七軍前部", "boss": "七軍・于禁"},
    },
    "maicheng": {
        "en": {"sk": "Eastern Wu · Pan Zhang", "boss": "Lu Meng & Lu Xun"},
        "ja": {"sk": "東呉・潘璋", "boss": "呂蒙・陸遜"},
    },
    "yiling": {
        "en": {"sk": "Wu Forces · Zhu Ran", "boss": "Lu Xun"},
        "ja": {"sk": "呉軍・朱然", "boss": "陸遜"},
    },
    "baidicheng": {
        "en": {"sk": "Imperial Guards", "boss": "Destiny · Failing Health"},
        "ja": {"sk": "宮中宿衛", "boss": "天命・沈疴"},
    },
    "qiqin": {
        "en": {"sk": "Nanman Rattan Armor Soldiers", "boss": "Meng Huo"},
        "ja": {"sk": "南蛮藤甲兵", "boss": "孟獲"},
    },
    "qishan": {
        "en": {"sk": "Wei Outpost", "boss": "Cao Zhen"},
        "ja": {"sk": "魏軍前哨", "boss": "曹真"},
    },
    "tianshui": {
        "en": {"sk": "Jicheng Garrison", "boss": "Jiang Wei · Youth of Jicheng"},
        "ja": {"sk": "冀城郡兵", "boss": "姜維・冀城の少年"},
    },
    "jieting": {
        "en": {"sk": "Wei Vanguard", "boss": "Zhang He"},
        "ja": {"sk": "魏軍先鋒", "boss": "張郃"},
    },
    "kongcheng": {
        "en": {"sk": "Wei Scouts", "boss": "Sima Yi · Phantom Army"},
        "ja": {"sk": "魏軍斥候", "boss": "司馬懿・疑兵"},
    },
    "chencang": {
        "en": {"sk": "Longxi Champion · Wang Shuang", "boss": "Hao Zhao · Defense of a Thousand"},
        "ja": {"sk": "隴西猛将・王双", "boss": "郝昭・千人の守城"},
    },
    "shangfanggu": {
        "en": {"sk": "Wei Camp Scouts", "boss": "Sima Father & Sons"},
        "ja": {"sk": "魏塁斥候", "boss": "司馬父子"},
    },
    "wuzhangyuan": {
        "en": {"sk": "Mumen Trail · Zhang He", "boss": "Sima Yi · Impassable Wall"},
        "ja": {"sk": "木門道・張郃", "boss": "司馬懿・堅壁"},
    },
    "gaopingling": {
        "en": {"sk": "Sima Household Retainers", "boss": "Sima Yi · Feigned Illness"},
        "ja": {"sk": "司馬府家兵", "boss": "司馬懿・仮病"},
    },
    "tielongshan": {
        "en": {"sk": "Sima Zhao's Probe", "boss": "Guo Huai · Veteran of Longyou"},
        "ja": {"sk": "昭営試探・司馬昭", "boss": "郭淮・隴右の宿将"},
    },
    "huainan": {
        "en": {"sk": "Yue Lin · Defender of Huainan", "boss": "Righteous Army of Huainan"},
        "ja": {"sk": "楽綝・淮南守将", "boss": "淮南の義兵"},
    },
    "ganlu": {
        "en": {"sk": "Traitor's Brush · Wang Shen", "boss": "Blade of Sima Zhao"},
        "ja": {"sk": "密告の筆・王沈", "boss": "司馬昭の刃"},
    },
    "jiange": {
        "en": {"sk": "Wei Vanguard before the Pass", "boss": "Zhong Hui · The 180,000 Host"},
        "ja": {"sk": "関前魏軍先鋒", "boss": "鍾会・十八万の軍"},
    },
    "yinping": {
        "en": {"sk": "Deng Ai's Strike Force", "boss": "Deng Ai"},
        "ja": {"sk": "鄧艾の奇兵", "boss": "鄧艾"},
    },
    "yanglu": {
        "en": {"sk": "Xiling Rebels", "boss": "Yang Hu · Cloaked in Elegance"},
        "ja": {"sk": "西陵の叛卒", "boss": "羊祜・軽裘緩帯"},
    },
    "guijin": {
        "en": {"sk": "Jin Vanguard", "boss": "Sima Yan"},
        "ja": {"sk": "晋軍前鋒", "boss": "司馬炎"},
    },
    "zuizhong": {
        "en": {"sk": "The Chronicler", "boss": "The Chronicler"},
        "ja": {"sk": "筆記者", "boss": "筆記者"},
    },
}

en_chapters = {}
ja_chapters = {}
tw_chapters = {}

for chap in RAW_CHAPTERS:
    cid = chap["id"]
    cd = CHAPTER_DATA.get(cid, {})
    en_spec = cd.get("en", {})
    ja_spec = cd.get("ja", {})

    # Map places
    raw_map = chap.get("map", [])
    en_map = [PLACES.get(p, {}).get("en", p) for p in raw_map]
    ja_map = [PLACES.get(p, {}).get("ja", p) for p in raw_map]
    tw_map = [PLACES.get(p, {}).get("tw", to_trad(p)) for p in raw_map]

    # Year
    raw_year = chap.get("year", "")
    en_year = YEARS.get(raw_year, {}).get("en", raw_year)
    ja_year = YEARS.get(raw_year, {}).get("ja", raw_year)
    tw_year = YEARS.get(raw_year, {}).get("tw", to_trad(raw_year))

    # Omens
    raw_omens = chap.get("omens", [])
    en_omens = [{"n": OMENS.get(o["n"], {}).get("en", o["n"])} for o in raw_omens]
    ja_omens = [{"n": OMENS.get(o["n"], {}).get("ja", o["n"])} for o in raw_omens]
    tw_omens = [{"n": OMENS.get(o["n"], {}).get("tw", to_trad(o["n"]))} for o in raw_omens]

    # Skirmish & Boss names
    sk_name = chap.get("skirmish", {}).get("name", "")
    boss_name = chap.get("boss", {}).get("name", "")

    sb = SKIRMISH_BOSS.get(cid, {})
    en_sk = sb.get("en", {}).get("sk", "Skirmish Vanguard")
    en_boss = sb.get("en", {}).get("boss", "Climax Commander")

    ja_sk = sb.get("ja", {}).get("sk", to_trad(sk_name))
    ja_boss = sb.get("ja", {}).get("boss", to_trad(boss_name))

    tw_sk = to_trad(sk_name)
    tw_boss = to_trad(boss_name)

    # Rule text
    rt = RULE_TEXTS.get(cid, {})
    en_rule = rt.get("en", "")
    ja_rule = rt.get("ja", "")
    tw_rule = rt.get("tw", to_trad(chap.get("ruleText", "")))

    en_chapters[cid] = {
        "name": en_spec.get("name", cid),
        "year": en_year,
        "premise": en_spec.get("premise", ""),
        "regret": en_spec.get("regret", ""),
        "ruleText": en_rule,
        "history": en_spec.get("history", ""),
        "yeshi": en_spec.get("yeshi", ""),
        "note": en_spec.get("note", ""),
        "defeat": en_spec.get("defeat", ""),
        "map": en_map,
        "omens": en_omens,
        "skirmish": {"name": en_sk},
        "boss": {"name": en_boss},
    }

    ja_chapters[cid] = {
        "name": ja_spec.get("name", chap.get("name", "")),
        "year": ja_year,
        "premise": ja_spec.get("premise", ""),
        "regret": ja_spec.get("regret", ""),
        "ruleText": ja_rule,
        "history": ja_spec.get("history", ""),
        "yeshi": ja_spec.get("yeshi", ""),
        "note": ja_spec.get("note", ""),
        "defeat": ja_spec.get("defeat", ""),
        "map": ja_map,
        "omens": ja_omens,
        "skirmish": {"name": ja_sk},
        "boss": {"name": ja_boss},
    }

    tw_chapters[cid] = {
        "name": to_trad(chap.get("name", "")),
        "year": tw_year,
        "premise": to_trad(chap.get("premise", "")),
        "regret": to_trad(chap.get("regret", "")),
        "ruleText": tw_rule,
        "history": to_trad(chap.get("history", "")),
        "yeshi": to_trad(chap.get("yeshi", "")),
        "note": to_trad(chap.get("note", "")),
        "defeat": to_trad(chap.get("defeat", "")),
        "map": tw_map,
        "omens": tw_omens,
        "skirmish": {"name": tw_sk},
        "boss": {"name": tw_boss},
    }

dest_dir = os.path.join(ROOT, 'src', 'locales', 'chapters')
os.makedirs(dest_dir, exist_ok=True)

with open(os.path.join(dest_dir, 'en.js'), 'w', encoding='utf-8') as f:
    f.write(f"export default {json.dumps(en_chapters, ensure_ascii=False, indent=2)};\n")

with open(os.path.join(dest_dir, 'ja.js'), 'w', encoding='utf-8') as f:
    f.write(f"export default {json.dumps(ja_chapters, ensure_ascii=False, indent=2)};\n")

with open(os.path.join(dest_dir, 'zh-TW.js'), 'w', encoding='utf-8') as f:
    f.write(f"export default {json.dumps(tw_chapters, ensure_ascii=False, indent=2)};\n")

print(f"Generated all {len(en_chapters)} chapters in EN, JA, and ZH-TW!")
