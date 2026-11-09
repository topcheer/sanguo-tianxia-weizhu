# -*- coding: utf-8 -*-
"""
scripts/build_briefings_locales.py
Generates src/locales/briefings/{zh-TW,ja,en}.js with 100% complete literary briefings.
"""

import json
import os
import re
import sys
import opencc

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'scripts'))

from translation_data.common import to_trad
from translation_data.sources_data import SOURCE_TRANSLATIONS
from translation_data.briefings_scroll1 import BRIEFINGS_SCROLL1
from translation_data.briefings_scroll2 import BRIEFINGS_SCROLL2
from translation_data.briefings_scroll3 import BRIEFINGS_SCROLL3
from translation_data.briefings_scroll4 import BRIEFINGS_SCROLL4

ALL_BRIEFINGS = {}
ALL_BRIEFINGS.update(BRIEFINGS_SCROLL1)
ALL_BRIEFINGS.update(BRIEFINGS_SCROLL2)
ALL_BRIEFINGS.update(BRIEFINGS_SCROLL3)
ALL_BRIEFINGS.update(BRIEFINGS_SCROLL4)

with open(os.path.join(ROOT, 'briefings_dump.json'), 'r', encoding='utf-8') as f:
    RAW_BRIEFINGS = json.load(f)

def translate_era(raw_era, lang):
    if not raw_era:
        return "Undated" if lang == "en" else "無紀年"
    if lang == "tw":
        return to_trad(raw_era)
    if lang == "ja":
        if "史事" in raw_era:
            return "史実 202年 · 演義設定 207年"
        if "无纪年" in raw_era:
            return "無紀年"
        ja_era = raw_era.replace(" ", "")
        ja_era = ja_era.replace("年春", "年 春").replace("年秋", "年 秋").replace("年冬", "年 冬")
        return ja_era
    if lang == "en":
        if "史事" in raw_era:
            return "Historical 202 AD / Romance setting 207 AD"
        if "无纪年" in raw_era:
            return "Undated"
        en_era = raw_era.replace("年春", " AD · Spring").replace("年秋", " AD · Autumn").replace("年冬", " AD · Winter")
        en_era = en_era.replace("年", " AD")
        return re.sub(r'\s+', ' ', en_era).strip()

def deep_s2t(obj):
    if isinstance(obj, str):
        return to_trad(obj)
    elif isinstance(obj, list):
        return [deep_s2t(x) for x in obj]
    elif isinstance(obj, dict):
        return {k: deep_s2t(v) for k, v in obj.items()}
    return obj

en_briefings = {}
ja_briefings = {}
tw_briefings = {}

for cid, raw_b in RAW_BRIEFINGS.items():
    trans_c = ALL_BRIEFINGS.get(cid, {})
    en_s = trans_c.get("en", {})
    ja_s = trans_c.get("ja", {})

    raw_s = raw_b.get("source", "")
    en_source = SOURCE_TRANSLATIONS.get(raw_s, {}).get("en", "Historical Record")
    ja_source = SOURCE_TRANSLATIONS.get(raw_s, {}).get("ja", to_trad(raw_s))

    en_briefings[cid] = {
        "era": translate_era(raw_b.get("era", ""), "en"),
        "source": en_source,
        "record": en_s.get("record", ""),
        "adaptation": en_s.get("adaptation", ""),
        "lead": en_s.get("lead", ""),
        "skirmish": en_s.get("skirmish", {}),
        "boss": en_s.get("boss", {}),
    }
    if "rounds" in en_s:
        en_briefings[cid]["rounds"] = en_s["rounds"]
    if "revive" in en_s:
        en_briefings[cid]["revive"] = en_s["revive"]

    ja_briefings[cid] = {
        "era": translate_era(raw_b.get("era", ""), "ja"),
        "source": ja_source,
        "record": ja_s.get("record", ""),
        "adaptation": ja_s.get("adaptation", ""),
        "lead": ja_s.get("lead", ""),
        "skirmish": ja_s.get("skirmish", {}),
        "boss": ja_s.get("boss", {}),
    }
    if "rounds" in ja_s:
        ja_briefings[cid]["rounds"] = ja_s["rounds"]
    if "revive" in ja_s:
        ja_briefings[cid]["revive"] = ja_s["revive"]

    tw_briefings[cid] = deep_s2t(raw_b)

dest_dir = os.path.join(ROOT, 'src', 'locales', 'briefings')
os.makedirs(dest_dir, exist_ok=True)

with open(os.path.join(dest_dir, 'en.js'), 'w', encoding='utf-8') as f:
    f.write(f"export default {json.dumps(en_briefings, ensure_ascii=False, indent=2)};\n")

with open(os.path.join(dest_dir, 'ja.js'), 'w', encoding='utf-8') as f:
    f.write(f"export default {json.dumps(ja_briefings, ensure_ascii=False, indent=2)};\n")

with open(os.path.join(dest_dir, 'zh-TW.js'), 'w', encoding='utf-8') as f:
    f.write(f"export default {json.dumps(tw_briefings, ensure_ascii=False, indent=2)};\n")

print(f"Generated all {len(en_briefings)} briefings in EN, JA, and ZH-TW!")
