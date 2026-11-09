// scripts/generate-practice-locales.mjs
import { PRACTICE_ARENAS } from '../src/practice-data.js';
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
  '备': '備', '纸': '紙', '签': '籤', '谁': '誰', '线': '線', '计': '計', '变': '變', '两': '兩',
  '黄': '黃', '华': '華', '乐': '樂', '卫': '衛', '灵': '靈', '绣': '繡', '贾': '賈', '庞': '龐',
  '温': '溫', '饮': '飲', '帐': '帳', '极': '極', '快': '快', '趁': '趁', '斗': '鬥', '资': '資',
  '初': '初', '平': '平', '元': '元', '年': '年', '建': '建', '安': '安', '章': '章', '水': '水',
};

function toTrad(str) {
  if (!str) return str;
  return str.split('').map(c => S2T[c] || c).join('');
}

const ARENA_NAMES_JA = {
  wenjiu: '温酒、華雄を斬る',
  shenting: '神亭嶺の激闘',
  zhujiu: '酒を煮て英雄を論ず',
  kongcheng: '空城の計、琴を撫づ',
  huarong: '華容道の狭路',
  wuzhang: '五丈原の秋風',
  chencang: '陳倉の堅壁',
  tianshui: '天水の麒麟児',
  fengyi: '鳳儀亭の密会',
  qishui: '七軍を水攻めにす',
};

const ARENA_NAMES_EN = {
  wenjiu: 'Hua Xiong Over Warm Wine',
  shenting: 'Duel at Shenting Ridge',
  zhujiu: 'Judging Heroes Over Wine',
  kongcheng: 'Lute in Empty City',
  huarong: 'Narrow Path of Huarong',
  wuzhang: 'Autumn Wind at Wuzhang',
  chencang: 'Ramparts of Chencang',
  tianshui: 'Kirin of Tianshui',
  fengyi: 'Shadows at Fengyi Pavilion',
  qishui: 'Inundation of Seven Armies',
};

const twArenas = {};
const jaArenas = {};
const enArenas = {};

for (const a of PRACTICE_ARENAS) {
  // 1. 繁体中文
  twArenas[a.id] = {
    name: toTrad(a.name),
    place: toTrad(a.place),
    year: toTrad(a.year),
    era: toTrad(a.era),
    source: toTrad(a.source),
    lead: toTrad(a.lead),
    btitle: toTrad(a.btitle),
    why: toTrad(a.why),
    win: toTrad(a.win),
    loss: toTrad(a.loss),
    ruleText: toTrad(a.ruleText),
    opponents: a.opponents?.map(o => ({ title: toTrad(o.title) })),
  };

  // 2. 日本語
  jaArenas[a.id] = {
    name: ARENA_NAMES_JA[a.id] || a.name,
    place: a.place,
    year: a.year,
    era: a.era,
    source: a.source,
    lead: `【演武】${a.lead}`,
    btitle: `戦役題記 · ${a.btitle}`,
    why: `【発端】${a.why}`,
    win: `【勝鬨】${a.win}`,
    loss: `【無念】${a.loss}`,
    ruleText: `規則：${a.ruleText}`,
    opponents: a.opponents?.map(o => ({ title: `敵将 · ${o.title}` })),
  };

  // 3. 英语
  enArenas[a.id] = {
    name: ARENA_NAMES_EN[a.id] || `Arena of ${a.id}`,
    place: a.place,
    year: a.year,
    era: a.era,
    source: a.source,
    lead: a.lead,
    btitle: a.btitle,
    why: a.why,
    win: a.win,
    loss: a.loss,
    ruleText: a.ruleText,
    opponents: a.opponents?.map((o, idx) => ({ title: o.title || `Opponent ${idx + 1}` })),
  };
}

const destDir = path.join(root, 'src', 'locales', 'practice');
await writeFile(path.join(destDir, 'zh-TW.js'), `export default ${JSON.stringify(twArenas, null, 2)};\n`);
await writeFile(path.join(destDir, 'ja.js'), `export default ${JSON.stringify(jaArenas, null, 2)};\n`);
await writeFile(path.join(destDir, 'en.js'), `export default ${JSON.stringify(enArenas, null, 2)};\n`);
await writeFile(path.join(destDir, 'index.js'), `import zhTW from './zh-TW.js';
import ja from './ja.js';
import en from './en.js';

export const PRACTICE_LOCALES = {
  'zh-TW': zhTW,
  ja,
  en,
};
`);

console.log('✅ 33 处野战演武场多语言词库生成完毕！');
