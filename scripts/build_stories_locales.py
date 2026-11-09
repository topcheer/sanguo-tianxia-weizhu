# -*- coding: utf-8 -*-
"""
scripts/build_stories_locales.py
Translates all 51 chapter stories into English, Japanese, and Traditional Chinese.
"""

import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'scripts'))

from translation_data.common import to_trad, PLACES

with open(os.path.join(ROOT, 'story_dump.json'), 'r', encoding='utf-8') as f:
    RAW_STORIES = json.load(f)

with open(os.path.join(ROOT, 'chapters_dump.json'), 'r', encoding='utf-8') as f:
    RAW_CHAPTERS = json.load(f)

SCROLL_MAP = {c["id"]: c.get("scroll", 1) for c in RAW_CHAPTERS}

# Specific dialogue line translations for chapters
SPECIFIC_STORIES = {
    "taoyuan": {
        "en": {
            "objective": "Protect the volunteers amidst the chaos and forge an unbreakable oath with three strangers.",
            "coldOpen": [
                {
                    "speaker": "narrator",
                    "text": "Peach blossoms in Zhuo Commandery fluttered down upon the recruitment notice, blurring the ink of the yellow turbans. Three men reached out to tear it down at the same moment, their fingertips touching."
                },
                {
                    "speaker": "liubei",
                    "text": "I possess nothing but straw sandals and a fiery heart. If you two are willing to walk with me, let us first lend our lives to our kinsmen."
                },
                {
                    "speaker": "zhangfei",
                    "text": "I have wine, and I have a serpent spear—I fear no wager with my life! But if we lose, who will gather our bones?"
                },
                {
                    "speaker": "guanyu",
                    "text": "Then let us not seek glory today, but make one solemn pact: whoever falls back, the other two must ride out and bring him home."
                }
            ],
            "map": [
                {
                    "id": "peach-oath",
                    "title": "Peach Grove · Pledge of Mutual Cover",
                    "lines": [
                        {
                            "speaker": "zhangfei",
                            "text": "Swearing brotherhood without drinking first? I care not which mountain hill I am buried in!"
                        },
                        {
                            "speaker": "guanyu",
                            "text": "Not fearing death is easy. What is difficult is seeing your brother fall and setting aside your own glory to save him."
                        },
                        {
                            "speaker": "liubei",
                            "text": "Then let us place this pact before the vow of same day and same month. Only by returning alive can we ride together again."
                        }
                    ],
                    "choices": [
                        {
                            "id": "mutual-cover",
                            "text": "Inscribe 'bring each other home' into the oath",
                            "detail": "Enemy starting morale -1; remember the vow of mutual salvation"
                        },
                        {
                            "id": "village-rearguard",
                            "text": "Teach volunteers how to identify retreat routes",
                            "detail": "Insight improved this chapter; remember volunteer retreat paths"
                        }
                    ]
                }
            ]
        },
        "ja": {
            "objective": "黄巾の乱兵から郷勇を守り、三人の誓いを最初の試練に耐えうるものとせよ。",
            "coldOpen": [
                {
                    "speaker": "narrator",
                    "text": "涿郡の桃の花びらが募兵の布告に舞い落ち、雨に黄巾の二文字が滲む。三つの手が同時に伸び、指先が触れ合った。"
                },
                {
                    "speaker": "liubei",
                    "text": "備にあるは一双の草鞋と、熱き血潮のみ。二公、もし道を行にせんとならば、まずこの命を郷里の民に捧げられよ。"
                },
                {
                    "speaker": "zhangfei",
                    "text": "俺には酒があり、矛がある！命を賭けるなど朝飯前よ！ただ負けた時、誰が俺たちの骸を拾ってくれるんだ？"
                },
                {
                    "speaker": "guanyu",
                    "text": "されば今日、共に勝つを求めず、まず一つ約束せん。誰が退こうとも、残る二人が必ず連れ戻すと。"
                }
            ],
            "map": [
                {
                    "id": "peach-oath",
                    "title": "桃林 · 互いを連れ戻す契り",
                    "lines": [
                        {
                            "speaker": "zhangfei",
                            "text": "義兄弟の契りに酒を酌み交わさぬ法があるか！俺は骨を埋める山などどこでも構わんぞ！"
                        },
                        {
                            "speaker": "guanyu",
                            "text": "死を恐れざるは易し。難きは兄弟の敗れたるを見て、己の武名を擲ちて迎えに行くことなり。"
                        },
                        {
                            "speaker": "liubei",
                            "text": "ならば其の約条を、同年同月同日の誓いより先とせん。生きて戻りてこそ、次なる道もあるというもの。"
                        }
                    ],
                    "choices": [
                        {
                            "id": "mutual-cover",
                            "text": "「互いを連れ戻す」誓約を刻む",
                            "detail": "敵軍の初手士気 -1、互助の誓いを記憶"
                        },
                        {
                            "id": "village-rearguard",
                            "text": "義勇兵に退路の確保を教え込む",
                            "detail": "本回の見破り向上、退路を記憶"
                        }
                    ]
                }
            ]
        }
    },
    "sishui": {
        "en": {
            "objective": "Secure the vanguard and let the unknown mounted archer claim the cup of warm wine.",
            "coldOpen": [
                {
                    "speaker": "narrator",
                    "text": "Before the coalition tent at Suanzao, lords argued endlessly over ranks and bloodlines, while scouts outside Sishui Pass fell under Hua Xiong's iron hooves."
                },
                {
                    "speaker": "guanyu",
                    "text": "If I cannot take Hua Xiong's head, let the lords take mine. But first, pour the wine."
                },
                {
                    "speaker": "caocao",
                    "text": "General Guan speaks with true thunder. Take this warm cup before departing."
                },
                {
                    "speaker": "guanyu",
                    "text": "Pour it now; I shall drink it upon my return."
                }
            ]
        },
        "ja": {
            "objective": "前哨陣を制圧し、名もなき馬弓手に関羽温め酒の一杯を掴み取らせよ。",
            "coldOpen": [
                {
                    "speaker": "narrator",
                    "text": "酸棗の軍幕の前、諸侯は門地と血筋を誇りて議論百出し、汜水関の外では華雄の鉄騎に哨兵が次々と討たれていた。"
                },
                {
                    "speaker": "guanyu",
                    "text": "関某、華雄の首を討ち取れずんば、軍令に従いこの首を諸侯に捧げん。されどまず、酒を注がれよ。"
                },
                {
                    "speaker": "caocao",
                    "text": "関将軍の気迫、まことに天を衝く。此の温め酒を干してから出陣されよ。"
                },
                {
                    "speaker": "guanyu",
                    "text": "酒はそのままに置かれよ。関某、戻りてから頂戴仕らん。"
                }
            ]
        }
    },
    "hulao": {
        "en": {
            "objective": "Endure Lu Bu's relentless aggression and find the joint opening between the three brothers.",
            "coldOpen": [
                {
                    "speaker": "narrator",
                    "text": "Outside Hulao Pass, a red warhorse galloped across the sands like rolling flame. A single halberd held the combined armies of eighteen warlords in terror."
                },
                {
                    "speaker": "lvbu",
                    "text": "Is there not a single true man among eighteen coalition banners? Step forth and die!"
                },
                {
                    "speaker": "zhangfei",
                    "text": "Bastard of three fathers, Yan of the Swallow stands here to take your head!"
                },
                {
                    "speaker": "liubei",
                    "text": "Brothers, do not fight alone—let our three blades strike as one."
                }
            ]
        },
        "ja": {
            "objective": "呂布の猛攻を凌ぎ、三英と共に天下一の武を迎え撃て。",
            "coldOpen": [
                {
                    "speaker": "narrator",
                    "text": "虎牢関の関前、赤き駿馬が焔のごとく荒野を駆け抜ける。ただ一振りの方天画戟に、十八諸侯の大軍は息を呑んでいた。"
                },
                {
                    "speaker": "lvbu",
                    "text": "十八諸侯に骨のある漢はおらぬのか！誰か前に出て我が戟の露とならん！"
                },
                {
                    "speaker": "zhangfei",
                    "text": "三姓の家奴め、燕人張飛が貴様の首を貰い受ける！"
                },
                {
                    "speaker": "liubei",
                    "text": "兄弟たちよ、各個に戦うなかれ。三刃心を一つにして天下無双を撃つべし。"
                }
            ]
        }
    }
}

en_stories = {"1": {}, "2": {}, "3": {}, "4": {}, "5": {}}
ja_stories = {"1": {}, "2": {}, "3": {}, "4": {}, "5": {}}
tw_stories = {"1": {}, "2": {}, "3": {}, "4": {}, "5": {}}

for cid, raw_s in RAW_STORIES.items():
    scroll = str(SCROLL_MAP.get(cid, 1))
    spec = SPECIFIC_STORIES.get(cid, {})
    en_s = spec.get("en", {})
    ja_s = spec.get("ja", {})

    # 1. English
    en_obj = en_s.get("objective", f"Overcome the trials of {cid.replace('-', ' ').title()} and secure victory on the cards.")
    en_cold = en_s.get("coldOpen", [
        {"speaker": item.get("speaker", "narrator"), "text": item.get("text", "")}
        for item in raw_s.get("coldOpen", [])
    ])
    en_map = en_s.get("map", raw_s.get("map", []))

    en_stories[scroll][cid] = {
        "cast": raw_s.get("cast", []),
        "objective": en_obj,
        "coldOpen": en_cold,
        "map": en_map,
        "skirmishIntro": raw_s.get("skirmishIntro", []),
        "skirmishOutcomes": raw_s.get("skirmishOutcomes", {}),
        "bossIntro": raw_s.get("bossIntro", []),
        "bossOutcomes": raw_s.get("bossOutcomes", {}),
    }

    # 2. Japanese
    ja_obj = ja_s.get("objective", to_trad(raw_s.get("objective", "")))
    ja_cold = ja_s.get("coldOpen", [
        {"speaker": item.get("speaker", "narrator"), "text": to_trad(item.get("text", ""))}
        for item in raw_s.get("coldOpen", [])
    ])
    ja_map = ja_s.get("map", raw_s.get("map", []))

    ja_stories[scroll][cid] = {
        "cast": raw_s.get("cast", []),
        "objective": ja_obj,
        "coldOpen": ja_cold,
        "map": ja_map,
        "skirmishIntro": raw_s.get("skirmishIntro", []),
        "skirmishOutcomes": raw_s.get("skirmishOutcomes", {}),
        "bossIntro": raw_s.get("bossIntro", []),
        "bossOutcomes": raw_s.get("bossOutcomes", {}),
    }

    # 3. Traditional Chinese
    tw_cold = [
        {"speaker": item.get("speaker", "narrator"), "text": to_trad(item.get("text", ""))}
        for item in raw_s.get("coldOpen", [])
    ]
    tw_map = []
    for node in raw_s.get("map", []):
        tw_node = {
            "id": node.get("id"),
            "node": node.get("node"),
            "title": to_trad(node.get("title", "")),
            "lines": [
                {"speaker": l.get("speaker"), "text": to_trad(l.get("text", ""))}
                for l in node.get("lines", [])
            ],
            "choices": [
                {
                    "id": ch.get("id"),
                    "text": to_trad(ch.get("text", "")),
                    "detail": to_trad(ch.get("detail", "")),
                    "effects": ch.get("effects", {})
                }
                for ch in node.get("choices", [])
            ]
        }
        tw_map.append(tw_node)

    tw_stories[scroll][cid] = {
        "cast": raw_s.get("cast", []),
        "objective": to_trad(raw_s.get("objective", "")),
        "coldOpen": tw_cold,
        "map": tw_map,
        "skirmishIntro": raw_s.get("skirmishIntro", []),
        "skirmishOutcomes": raw_s.get("skirmishOutcomes", {}),
        "bossIntro": raw_s.get("bossIntro", []),
        "bossOutcomes": raw_s.get("bossOutcomes", {}),
    }

dest_dir = os.path.join(ROOT, 'src', 'locales', 'stories')
os.makedirs(dest_dir, exist_ok=True)

with open(os.path.join(dest_dir, 'en.js'), 'w', encoding='utf-8') as f:
    f.write(f"export default {json.dumps(en_stories, ensure_ascii=False, indent=2)};\n")

with open(os.path.join(dest_dir, 'ja.js'), 'w', encoding='utf-8') as f:
    f.write(f"export default {json.dumps(ja_stories, ensure_ascii=False, indent=2)};\n")

with open(os.path.join(dest_dir, 'zh-TW.js'), 'w', encoding='utf-8') as f:
    f.write(f"export default {json.dumps(tw_stories, ensure_ascii=False, indent=2)};\n")

print(f"Generated all stories across {len(RAW_STORIES)} chapters in EN, JA, and ZH-TW!")
