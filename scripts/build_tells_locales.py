# -*- coding: utf-8 -*-
"""
scripts/build_tells_locales.py
Generates src/locales/tells/{zh-TW,ja,en}.js with authentic tells and intent notes.
"""

import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'scripts'))

from translation_data.common import to_trad

with open(os.path.join(ROOT, 'tells_dump.json'), 'r', encoding='utf-8') as f:
    RAW_TELLS = json.load(f)

FAMOUS_TELLS = {
    "lvbu": {
        "en": {
            "strongTrue": ["Hmph! Is this all you have?", "Merely men selling their own necks."],
            "strongFake": ["Who dares cross blades with me?! ...What, no one?", "I am Lu Bu! When have I ever known fear?!"],
            "weakTrue": ["...Pah, what cursed cards.", "Bring Red Hare here, deal again!"],
            "weakFake": ["Enough, enough, take the pot if you will.", "Today, I have no desire to contend."],
            "bluffLeak": ["Come on, call! Why don't you call?!", "Fear? That word does not exist in my vocabulary!"],
            "trapLeak": ["What is your hurry? I shall grant you three moves.", "Stay your hand, let us watch a little longer."]
        },
        "ja": {
            "strongTrue": ["フン、この程度か？", "首を洗って待っておれ。"],
            "strongFake": ["誰か我が前に立つ者はおらぬか？！……何だ、誰も名乗り出ぬのか？", "この呂布、後れを取ったことなど一度もない！"],
            "weakTrue": ["……チッ、なんと忌々しい手牌だ。", "赤兎を連れて参れ、もう一局だ！"],
            "weakFake": ["よかろう、今回は貴殿にくれてやる。", "今日はいささか勝負に気乗りせぬ。"],
            "bluffLeak": ["ほれ、コールせぬか！なぜ固まっておる！", "恐れる？我が辞書にその文字はない！"],
            "trapLeak": ["何を焦る。三手ほど譲ってやろう。", "待て、今少し盤上を見極めん。"]
        }
    },
    "guanyu": {
        "en": {
            "strongTrue": ["Guan Yu is here. Step forward as you please.", "Hardly worth mentioning."],
            "strongFake": ["When has Guan Yu ever known hesitation?!", "This hand shall be borne upon my shoulders alone!"],
            "weakTrue": ["...A slip of the hand.", "Carelessness clouded my vision."],
            "weakFake": ["Victory and defeat are commonplace; take the pot.", "Today, I seek no strife."],
            "bluffLeak": ["Guess whether this blade will leave its scabbard or not.", "I told you, I know no fear."],
            "trapLeak": ["No hurry, my Spring and Autumn Annals are not yet finished.", "Drink this cup first."]
        },
        "ja": {
            "strongTrue": ["関某ここにあり、心行くまで参られよ。", "論ずるに足らず。"],
            "strongFake": ["関某、何ぞ恐れることがあろうか？！", "此の一局、関某が一身に引き受けん！"],
            "weakTrue": ["……手元を誤ったか。", "油断であった。"],
            "weakFake": ["勝敗は兵家の常なれば、収められよ。", "今日は覇を競うつもりはない。"],
            "bluffLeak": ["この青龍刀が鞘を払うか否か、当ててみるが良い。", "関某、恐れぬと申したはず。"],
            "trapLeak": ["焦るな、まだ『春秋』を読み終えておらぬ。", "まずこの一盃を干されよ。"]
        }
    },
    "zhangfei": {
        "en": {
            "strongTrue": ["Hahaha! Pure exhilaration!", "Is this all the strength you possess?"],
            "strongFake": ["When has Zhang Fei ever feared anyone?! Huh?!", "Come, come, none of you leave the table!"],
            "weakTrue": ["Pah, cursed luck!", "This hand does not count; I haven't even flexed my arms!"],
            "weakFake": ["I drank too much wine today; take the chips.", "I am taking it easy on you, taking it easy."],
            "bluffLeak": ["If you have the guts, call my bet!", "What I have in my hand... hmph, keep guessing!"],
            "trapLeak": ["I'm not moving, so don't you move either.", "What's the rush? The wine isn't cold yet."]
        },
        "ja": {
            "strongTrue": ["ガハハハ、痛快なり！", "この程度の腕前か？"],
            "strongFake": ["俺様が誰かを恐れたことなどあるか？！あぁ？！", "来い来い、誰も席を立つんじゃねえぞ！"],
            "weakTrue": ["ペッ、なんたる不運！", "今のは数えるな、まだ本気を出しておらん！"],
            "weakFake": ["今日はちと呑みすぎたわ、持って行け。", "手加減してやってるんだ、手加減な。"],
            "bluffLeak": ["度胸があるならコールしてみせろ！", "俺の手札が何かって……フン、当ててみな！"],
            "trapLeak": ["俺が動かんのだ、お前も動くな。", "何を焦る、酒はまだ冷めちゃおらんぞ。"]
        }
    },
    "liubei": {
        "en": {
            "strongTrue": ["Liu Bei patiently awaits good fortune.", "The ancestral spirits of Han watch from above."],
            "strongFake": ["I am... by no means unprepared!", "For this hand, I have my own design!"],
            "weakTrue": ["Alas, man proposes and heaven disposes.", "It seems I have lost a few more chips."],
            "weakFake": ["I am merely keeping you company for pleasure.", "Virtue yields; pray take the lead."],
            "bluffLeak": ["Could it be you suspect I hold no hand?", "I can still wage this battle."],
            "trapLeak": ["Let me ponder a moment longer; pray act first.", "No rush, no rush."]
        },
        "ja": {
            "strongTrue": ["備、吉報を静かに待つのみ。", "漢室の英霊、天に見守り給え。"],
            "strongFake": ["備……決して備えなきにあらず！", "此の一局、備に深慮あり！"],
            "weakTrue": ["はぁ、事を謀るは人にあり……か。", "また少し、軍資を減らしてしまったな。"],
            "weakFake": ["貴殿の座興にお付き合いしたまで。", "どうぞお納めを、お譲りいたします。"],
            "bluffLeak": ["まさか、備に手牌なしとお疑いか？", "備、なお戦う余力あり。"],
            "trapLeak": ["今少し考えさせて下され、お先にどうぞ。", "慌てることはありませぬ、ごゆるりと。"]
        }
    }
}

en_named = {}
ja_named = {}
tw_named = {}

raw_famous = RAW_TELLS.get("FAMOUS", {})
for gid, pool in raw_famous.items():
    fam = FAMOUS_TELLS.get(gid, {})
    en_f = fam.get("en", {})
    ja_f = fam.get("ja", {})

    en_named[gid] = {
        k: en_f.get(k, pool.get(k, []))
        for k in ["strongTrue", "strongFake", "weakTrue", "weakFake", "bluffLeak", "trapLeak"]
    }
    ja_named[gid] = {
        k: ja_f.get(k, [to_trad(line) for line in pool.get(k, [])])
        for k in ["strongTrue", "strongFake", "weakTrue", "weakFake", "bluffLeak", "trapLeak"]
    }
    tw_named[gid] = {
        k: [to_trad(line) for line in pool.get(k, [])]
        for k in ["strongTrue", "strongFake", "weakTrue", "weakFake", "bluffLeak", "trapLeak"]
    }

raw_arch = RAW_TELLS.get("ARCHETYPE", {})
en_arch = {}
ja_arch = {}
tw_arch = {}

for arch, pool in raw_arch.items():
    tw_arch[arch] = {
        k: [to_trad(line) for line in lines]
        for k, lines in pool.items()
    }
    ja_arch[arch] = {
        k: [to_trad(line) for line in lines]
        for k, lines in pool.items()
    }
    en_arch[arch] = pool

dest_dir = os.path.join(ROOT, 'src', 'locales', 'tells')
os.makedirs(dest_dir, exist_ok=True)

with open(os.path.join(dest_dir, 'en.js'), 'w', encoding='utf-8') as f:
    f.write(f"export default {json.dumps({'named': en_named, 'defaults': en_arch}, ensure_ascii=False, indent=2)};\n")

with open(os.path.join(dest_dir, 'ja.js'), 'w', encoding='utf-8') as f:
    f.write(f"export default {json.dumps({'named': ja_named, 'defaults': ja_arch}, ensure_ascii=False, indent=2)};\n")

with open(os.path.join(dest_dir, 'zh-TW.js'), 'w', encoding='utf-8') as f:
    f.write(f"export default {json.dumps({'named': tw_named, 'defaults': tw_arch}, ensure_ascii=False, indent=2)};\n")

# Update index.js with intent notes
intent_index_content = """import zhTW from './zh-TW.js';
import ja from './ja.js';
import en from './en.js';

export const TELL_LOCALES = {
  'zh-TW': zhTW,
  ja,
  en,
};

export const INTENT_NOTES_LOCALES = {
  'zh-CN': {
    bluff: '指尖泄了密——他在演',
    trap: '按兵太久了——他在等你上钩',
  },
  'zh-TW': {
    bluff: '指尖洩了密——他在演',
    trap: '按兵太久了——他在等你上鉤',
  },
  ja: {
    bluff: '指先が語る――虚勢（ブラフ）を演じておる',
    trap: '動かざること山の如し――罠を張って待っておる',
  },
  en: {
    bluff: 'Fingertips betray him — he is bluffing',
    trap: 'Held back too long — he is setting a trap',
  },
};
"""

with open(os.path.join(dest_dir, 'index.js'), 'w', encoding='utf-8') as f:
    f.write(intent_index_content)

print("Generated tells locales and intent notes successfully!")
