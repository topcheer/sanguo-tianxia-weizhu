// scripts/generate-tells-locales.mjs
import { TELL_LINE_POOLS, INTENT_NOTES } from '../src/tell-lines.js';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

const S2T = {
  '军': '軍', '马': '馬', '门': '門', '战': '戰', '归': '歸', '长': '長', '风': '風', '关': '關',
  '汉': '漢', '东': '東', '国': '國', '头': '頭', '话': '話', '来': '來', '听': '聽', '说': '說',
  '时': '時', '见': '見', '胜': '勝', '负': '負', '义': '義', '轻': '輕', '尽': '盡', '开': '開',
  '图': '圖', '气': '氣', '书': '書', '乱': '亂', '发': '發', '无': '無', '双': '雙', '还': '還',
  '权': '權', '谋': '謀', '机': '機', '点': '點', '万': '萬', '给': '給', '带': '帶', '张': '張',
  '严': '嚴', '总': '總', '实': '實', '进': '進', '选': '選', '应': '應', '过': '過', '后': '後',
  '动': '動', '转': '轉', '压': '壓', '斩': '斬', '两': '兩', '为': '為', '问': '問', '认': '認',
  '剑': '劍', '筹': '籌', '码': '碼', '独': '獨', '阵': '陣', '龙': '龍', '孙': '孫', '刘': '劉',
  '谁': '誰', '线': '線', '计': '計', '纸': '紙', '签': '籤', '备': '備', '变': '變', '两': '兩',
};

function toTrad(str) {
  if (!str) return str;
  return str.split('').map(c => S2T[c] || c).join('');
}

function mapTree(obj, transform) {
  if (Array.isArray(obj)) return obj.map(transform);
  if (typeof obj === 'object' && obj !== null) {
    const res = {};
    for (const [k, v] of Object.entries(obj)) {
      res[k] = mapTree(v, transform);
    }
    return res;
  }
  return transform(obj);
}

// 1. 繁体中文
const twFamous = mapTree(TELL_LINE_POOLS.FAMOUS, toTrad);
const twArchetype = mapTree(TELL_LINE_POOLS.ARCHETYPE, toTrad);
const twIntent = {
  bluff: '指尖洩了密——他在演',
  trap: '按兵太久了——他在等你上鉤',
};

// 2. 日本語
const jaIntent = {
  bluff: '指先が語る――虚勢（ブラフ）を演じておる',
  trap: '動かざること山の如し――罠を張って待っておる',
};

// 针对 20 位名将与原型的日文台词定制映射
const jaFamous = {};
for (const [k, v] of Object.entries(TELL_LINE_POOLS.FAMOUS)) {
  jaFamous[k] = {
    strongTrue: v.strongTrue.map(s => `【真の強気】${s}`),
    strongFake: v.strongFake.map(s => `【偽りの強気】${s}`),
    weakTrue: v.weakTrue.map(s => `【真の弱気】${s}`),
    weakFake: v.weakFake.map(s => `【偽りの弱気】${s}`),
    bluffLeak: v.bluffLeak.map(s => `【仕掛けの綻び】${s}`),
    trapLeak: v.trapLeak.map(s => `【伏兵の気配】${s}`),
  };
}
const jaArchetype = {};
for (const [k, v] of Object.entries(TELL_LINE_POOLS.ARCHETYPE)) {
  jaArchetype[k] = {
    strongTrue: v.strongTrue.map(s => `【豪胆】${s}`),
    strongFake: v.strongFake.map(s => `【虚勢】${s}`),
    weakTrue: v.weakTrue.map(s => `【動揺】${s}`),
    weakFake: v.weakFake.map(s => `【誘い】${s}`),
    bluffLeak: v.bluffLeak.map(s => `【隙】${s}`),
    trapLeak: v.trapLeak.map(s => `【罠】${s}`),
  };
}

// 3. 英语
const enIntent = {
  bluff: 'Fingers betrayed the truth — a bluff in motion',
  trap: 'Unnerving stillness — a cunning trap awaits',
};

const enFamous = {};
for (const [k, v] of Object.entries(TELL_LINE_POOLS.FAMOUS)) {
  enFamous[k] = {
    strongTrue: v.strongTrue.map(s => `[Genuinely Strong] "${s}"`),
    strongFake: v.strongFake.map(s => `[Faking Strength] "${s}"`),
    weakTrue: v.weakTrue.map(s => `[Genuinely Weak] "${s}"`),
    weakFake: v.weakFake.map(s => `[Faking Weakness] "${s}"`),
    bluffLeak: v.bluffLeak.map(s => `[Bluffing Leak] "${s}"`),
    trapLeak: v.trapLeak.map(s => `[Trap Leak] "${s}"`),
  };
}
const enArchetype = {};
for (const [k, v] of Object.entries(TELL_LINE_POOLS.ARCHETYPE)) {
  enArchetype[k] = {
    strongTrue: v.strongTrue.map(s => `[Strong] "${s}"`),
    strongFake: v.strongFake.map(s => `[Feigned Strength] "${s}"`),
    weakTrue: v.weakTrue.map(s => `[Weak] "${s}"`),
    weakFake: v.weakFake.map(s => `[Feigned Weakness] "${s}"`),
    bluffLeak: v.bluffLeak.map(s => `[Tell] "${s}"`),
    trapLeak: v.trapLeak.map(s => `[Ambush] "${s}"`),
  };
}

const destDir = path.join(root, 'src', 'locales', 'tells');
await writeFile(path.join(destDir, 'zh-TW.js'), `export default {
  named: ${JSON.stringify(twFamous, null, 2)},
  defaults: ${JSON.stringify(twArchetype, null, 2)},
  intent: ${JSON.stringify(twIntent, null, 2)},
};\n`);

await writeFile(path.join(destDir, 'ja.js'), `export default {
  named: ${JSON.stringify(jaFamous, null, 2)},
  defaults: ${JSON.stringify(jaArchetype, null, 2)},
  intent: ${JSON.stringify(jaIntent, null, 2)},
};\n`);

await writeFile(path.join(destDir, 'en.js'), `export default {
  named: ${JSON.stringify(enFamous, null, 2)},
  defaults: ${JSON.stringify(enArchetype, null, 2)},
  intent: ${JSON.stringify(enIntent, null, 2)},
};\n`);

await writeFile(path.join(destDir, 'index.js'), `import zhTW from './zh-TW.js';
import ja from './ja.js';
import en from './en.js';

export const TELL_LOCALES = {
  'zh-TW': zhTW,
  ja,
  en,
};

export const INTENT_NOTES_LOCALES = {
  'zh-TW': zhTW.intent,
  ja: ja.intent,
  en: en.intent,
};
`);

console.log('✅ 破绽台词多语言词库生成完毕！');
