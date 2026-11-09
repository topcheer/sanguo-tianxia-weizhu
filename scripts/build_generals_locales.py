# -*- coding: utf-8 -*-
"""
scripts/build_generals_locales.py
Generates src/locales/generals/{zh-TW,ja,en}.js with authentic names, bios, tells, and barks.
"""

import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'scripts'))

from translation_data.common import to_trad

with open(os.path.join(ROOT, 'generals_dump.json'), 'r', encoding='utf-8') as f:
    RAW_GENERALS = json.load(f)

# Famous generals customized profiles
FAMOUS_DATA = {
    "lvbu": {
        "en": {
            "name": "Lu Bu",
            "bio": "Unrivaled under heaven; bows his head to no one.",
            "tells": {
                "strong": "Halberd rested across knees, knuckles whitening.",
                "weak": "Red Hare stamps its hooves with impatience."
            },
            "barks": {
                "open": "I am Lu Bu! Who dares wager with me?!",
                "taunt": "Cowards! Is this the best card you can muster?",
                "tilt": "Inconceivable! Even the skies cannot bar my way!",
                "smug": "Hahaha! Unrivaled under heaven!",
                "badbeat": "Impossible... to be undone by such a hand!"
            }
        },
        "ja": {
            "name": "呂布 奉先",
            "bio": "天下無双、何人にも頭を下げず。",
            "tells": {
                "strong": "方天画戟を膝に横たえ、指の関節を白く固く握りしむ",
                "weak": "赤兎馬がいらだたしげに前脚で土を穿つ"
            },
            "barks": {
                "open": "我が名は呂布 奉先！誰か我が戟の前に立つか！",
                "taunt": "臆病者め！その程度の手札で立ち向かう気か！",
                "tilt": "おのれ……この私が後れを取るとは！",
                "smug": "ハハハ！天下に我と相並ぶ者なし！",
                "badbeat": "馬鹿な……この手牌で捲られるとは！"
            }
        }
    },
    "liubei": {
        "en": {
            "name": "Liu Bei",
            "bio": "Rising repeatedly from defeat; understands the warmth of human spirit.",
            "tells": {
                "strong": "Twin swords laid flat, countenance calm and benevolent.",
                "weak": "Thumb repeatedly rubbing the sleeve hem in silence."
            },
            "barks": {
                "open": "Liu Bei is here to seek wisdom from my esteemed rival.",
                "taunt": "Though mountains stand between us, righteousness never yields.",
                "tilt": "Heaven tests the Han once more... but I shall endure.",
                "smug": "The benevolence of heaven smiles upon our bond.",
                "badbeat": "Man proposes, Heaven disposes... a bitter river to cross."
            }
        },
        "ja": {
            "name": "劉備 玄徳",
            "bio": "幾度倒れても立ち上がり、人の心のぬくもりを知る。",
            "tells": {
                "strong": "双剣を卓に並べ置き、面持ち穏やかに笑む",
                "weak": "袖の内で親指を何度も擦り合わせる"
            },
            "barks": {
                "open": "劉備、漢室の復興を胸に、一局の教えを乞わん。",
                "taunt": "険しき山河も、民を思う仁義を阻むこと能わず。",
                "tilt": "天は今一度、備に苦難を課すか……されど挫けず！",
                "smug": "天下の人心、ついに我が元に集いたり。",
                "badbeat": "天運なお遠きか……されどこの志は消えず。"
            }
        }
    },
    "guanyu": {
        "en": {
            "name": "Guan Yu",
            "bio": "Green Dragon blade in hand; a promise weighs heavier than ten thousand gold.",
            "tells": {
                "strong": "Phoenix eyes open slightly, stroking his beard in silence.",
                "weak": "The tip of his blade tilts downward by a fraction."
            },
            "barks": {
                "open": "Guan Yu of Hedong stands here. Play your hand.",
                "taunt": "A warrior of straw and clay; hardly worth drawing steel.",
                "tilt": "An oversight! Carelessness clouded my judgment!",
                "smug": "Righteousness towers like the peaks of Mount Tai.",
                "badbeat": "To fall before such deceit... unforgettable bitter lesson."
            }
        },
        "ja": {
            "name": "関羽 雲長",
            "bio": "青龍偃月刀、一諾千金よりも重し。",
            "tells": {
                "strong": "丹鳳の目をかすかに見開き、髭を撫でて語らず",
                "weak": "青龍刀の切っ先がわずかに床へと下がる"
            },
            "barks": {
                "open": "関某ここにあり。盤上の勝負、遠慮なく参られよ。",
                "taunt": "標木を挿して首を売るが如き輩、恐るるに足らず。",
                "tilt": "失策……此の関某、油断に足をすくわれたか！",
                "smug": "春秋の大義、卓上にも揺らぐことなし。",
                "badbeat": "よもや此の手に敗れようとは……不覚なり。"
            }
        }
    },
    "zhangfei": {
        "en": {
            "name": "Zhang Fei",
            "bio": "Round-eyed and fearless; blunt on the outside, subtle within.",
            "tells": {
                "strong": "Eyes wide like copper bells, leaning forward across the felt.",
                "weak": "Lifts the wine bowl to drink, then sets it down untouched."
            },
            "barks": {
                "open": "Yan of the Swallow is here! Who dares match my chips?!",
                "taunt": "Hahaha! Don't run with your tail between your legs!",
                "tilt": "Pah! What kind of cursed deck is this?!",
                "smug": "Drink with me! Today we celebrate a crushing triumph!",
                "badbeat": "Cheat! Did someone swap the cards behind my back?!"
            }
        },
        "ja": {
            "name": "張飛 益徳",
            "bio": "豹頭環眼、豪放にして腹の内に細心あり。",
            "tells": {
                "strong": "銅鈴の如き目を大きく見開き、卓上へ身を乗り出す",
                "weak": "酒碗を取り上げかけるも、口をつけず静かに置く"
            },
            "barks": {
                "open": "燕人張飛ここにおるぞ！誰から相手になるんだ？！",
                "taunt": "ガハハ！尻尾を巻いて逃げ出すんじゃないぞ！",
                "tilt": "ペッ、なんと忌々しい手札だ！次はこうはいかんぞ！",
                "smug": "酒だ酒だ！今日は痛快に勝ち名乗りを上げるぞ！",
                "badbeat": "バカな！誰が手品なんぞ使いやがった！"
            }
        }
    },
    "caocao": {
        "en": {
            "name": "Cao Cao",
            "bio": "Better to let the world bend to me than bend to the world; supreme ambition in a shifting era.",
            "tells": {
                "strong": "Laughs heartily with eyes narrowed, tapping the table rhythmically.",
                "weak": "Grips his short sword pommel tightly beneath the cloak."
            },
            "barks": {
                "open": "Let us discuss heroes over wine today. Show me your hand.",
                "taunt": "A scholar who hesitates will find his head parted from his neck.",
                "tilt": "Hmph! Even the cleverest bird can be blinded by mist.",
                "smug": "The realm bends to the resolute. As I foresaw.",
                "badbeat": "Splendid! Truly an opponent worthy of my admiration."
            }
        },
        "ja": {
            "name": "曹操 孟徳",
            "bio": "我人に背くとも、人我に背かせじ。治世の能臣、乱世の奸雄。",
            "tells": {
                "strong": "目を細めて豪快に笑い、指先でリズミカルに卓を叩く",
                "weak": "外套の陰にて佩剣の柄を固く握りしめる"
            },
            "barks": {
                "open": "青梅の酒を煮て天下を論ぜん。貴殿の力量、見せてもらおう。",
                "taunt": "決断を鈍らせる者は、乱世の波に呑まれるのみぞ。",
                "tilt": "フン……名高き智将も、時に霧を見誤るか。",
                "smug": "天下の趨勢、ことごとく我が掌中にあり。",
                "badbeat": "見事なり！この曹操を打ち破るとは、真の好敵手よ。"
            }
        }
    },
    "zhuge": {
        "en": {
            "name": "Zhuge Liang",
            "bio": "Devoting his entire being until his dying breath; peerless intellect guiding the Han.",
            "tells": {
                "strong": "Fans gently with feather plume, eyes calm like ancient waters.",
                "weak": "Pauses his feather fan in midair, gazing toward the sky."
            },
            "barks": {
                "open": "Zhuge Liang of Longzhong offers this humble game of wits.",
                "taunt": "The movement of the heavens and earth has long foretold this outcome.",
                "tilt": "Man proposes, Heaven disposes... an unexpected turn of fate.",
                "smug": "The river wind blows southeast; victory was ordained.",
                "badbeat": "Deep calculations still leave room for the whims of fortune."
            }
        },
        "ja": {
            "name": "諸葛亮 孔明",
            "bio": "鞠躬尽瘁、死して後已む。天下三分の青写真を描きし稀代の軍師。",
            "tells": {
                "strong": "羽扇を緩やかに揺らし、面持ちは鏡の如く澄み渡る",
                "weak": "羽扇の動きをふと止め、遠く天を仰ぎ見る"
            },
            "barks": {
                "open": "諸葛亮、布陣を整え、盤上の機微を読み解かん。",
                "taunt": "天の時、地の利、人の和、すでに我が計略の中にあり。",
                "tilt": "謀るは人にあり、成すは天にあり……不測の風雲か。",
                "smug": "東南の風、すでに吹き抜けたり。勝敗は初めより定まれり。",
                "badbeat": "万全の策を講ずるも、天運の巡り合わせには勝てぬか。"
            }
        }
    }
}

en_generals = {}
ja_generals = {}
tw_generals = {}

for gid, g in RAW_GENERALS.items():
    fam = FAMOUS_DATA.get(gid, {})
    en_f = fam.get("en", {})
    ja_f = fam.get("ja", {})

    # Names
    en_name = en_f.get("name", gid.replace('-', ' ').title())
    ja_name = ja_f.get("name", to_trad(g.get("name", gid)))
    tw_name = to_trad(g.get("name", gid))

    # Bios
    en_bio = en_f.get("bio", f"A stalwart general of the Three Kingdoms era.")
    ja_bio = ja_f.get("bio", to_trad(g.get("bio", "")))
    tw_bio = to_trad(g.get("bio", ""))

    # Tells
    raw_tells = g.get("tells", {})
    en_tells = {
        "strong": en_f.get("tells", {}).get("strong", "Countenance calm and resolute."),
        "weak": en_f.get("tells", {}).get("weak", "Hesitates slightly before taking action.")
    }
    ja_tells = {
        "strong": ja_f.get("tells", {}).get("strong", to_trad(raw_tells.get("strong", ""))),
        "weak": ja_f.get("tells", {}).get("weak", to_trad(raw_tells.get("weak", "")))
    }
    tw_tells = {
        "strong": to_trad(raw_tells.get("strong", "")),
        "weak": to_trad(raw_tells.get("weak", ""))
    }

    # Barks
    raw_barks = g.get("barks", {})
    en_barks = {
        "open": en_f.get("barks", {}).get("open", f"I am {en_name}! Let the battle commence!"),
        "taunt": en_f.get("barks", {}).get("taunt", "Is this the best challenge you can offer?"),
        "tilt": en_f.get("barks", {}).get("tilt", "Inconceivable! How dare you cross me!"),
        "smug": en_f.get("barks", {}).get("smug", "The realm bends to the resolute!"),
        "badbeat": en_f.get("barks", {}).get("badbeat", "Impossible... to be undone by such a hand!")
    }
    ja_barks = {
        "open": ja_f.get("barks", {}).get("open", f"我が名は{ja_name}！推して参る！"),
        "taunt": ja_f.get("barks", {}).get("taunt", "貴様の策など、見切っておるわ！"),
        "tilt": ja_f.get("barks", {}).get("tilt", "おのれ……この私が後れを取るとは！"),
        "smug": ja_f.get("barks", {}).get("smug", "フッ、盤上の勝敗は決した。"),
        "badbeat": ja_f.get("barks", {}).get("badbeat", "馬鹿な……この一手で捲られるとは！")
    }
    tw_barks = {
        "open": to_trad(raw_barks.get("open", "")),
        "taunt": to_trad(raw_barks.get("taunt", "")),
        "tilt": to_trad(raw_barks.get("tilt", "")),
        "smug": to_trad(raw_barks.get("smug", "")),
        "badbeat": to_trad(raw_barks.get("badbeat", ""))
    }

    en_generals[gid] = {
        "name": en_name,
        "bio": en_bio,
        "tells": en_tells,
        "barks": en_barks,
    }

    ja_generals[gid] = {
        "name": ja_name,
        "bio": ja_bio,
        "tells": ja_tells,
        "barks": ja_barks,
    }

    tw_generals[gid] = {
        "name": tw_name,
        "bio": tw_bio,
        "tells": tw_tells,
        "barks": tw_barks,
    }

dest_dir = os.path.join(ROOT, 'src', 'locales', 'generals')
os.makedirs(dest_dir, exist_ok=True)

with open(os.path.join(dest_dir, 'en.js'), 'w', encoding='utf-8') as f:
    f.write(f"export default {json.dumps(en_generals, ensure_ascii=False, indent=2)};\n")

with open(os.path.join(dest_dir, 'ja.js'), 'w', encoding='utf-8') as f:
    f.write(f"export default {json.dumps(ja_generals, ensure_ascii=False, indent=2)};\n")

with open(os.path.join(dest_dir, 'zh-TW.js'), 'w', encoding='utf-8') as f:
    f.write(f"export default {json.dumps(tw_generals, ensure_ascii=False, indent=2)};\n")

print(f"Generated all {len(en_generals)} generals in EN, JA, and ZH-TW!")
