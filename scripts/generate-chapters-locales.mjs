// scripts/generate-chapters-locales.mjs
import { CHAPTERS, FX } from '../src/chapters.js';
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
  '这': '這', '条': '條', '写': '寫', '页': '頁', '罢': '罷', '热': '熱', '温': '溫', '饮': '飲',
  '帐': '帳', '公': '公', '看': '看', '冷': '冷', '斗': '鬥', '极': '極', '快': '快', '趁': '趁',
  '酒': '酒', '尚': '尚', '已': '已', '破': '破', '退': '退', '场': '場', '残': '殘', '卷': '卷',
  '中': '中', '平': '平', '元': '元', '年': '年', '初': '初', '建': '建', '安': '安', '章': '章',
};

function toTrad(str) {
  if (!str) return str;
  return str.split('').map(c => S2T[c] || c).join('');
}

const CHAPTER_NAMES_JA = {
  taoyuan: '桃園の契り',
  sishui: '汜水関',
  hulao: '虎牢関',
  xianshan: '峴山の露',
  jieqiao: '界橋の戦い',
  fengyiting: '鳳儀亭',
  shenting: '神亭嶺',
  yuanshemen: '轅門射戟',
  wancheng: '宛城の変',
  baimenlou: '白門楼',
  guandu: '官渡の決戦',
  changban: '長坂坡',
  chibi: '赤壁大戦',
  yiling: '夷陵の炎',
  wuzhangyuan: '五丈原',
};

const CHAPTER_NAMES_EN = {
  taoyuan: 'The Peach Garden',
  sishui: 'Sishui Pass',
  hulao: 'Hulao Pass',
  xianshan: 'Xianshan Ridge',
  jieqiao: 'Jieqiao Bridge',
  fengyiting: 'Fengyi Pavilion',
  shenting: 'Shenting Ridge',
  yuanshemen: 'Feat at Camp Gate',
  wancheng: 'Wancheng Crisis',
  baimenlou: 'White Gate Tower',
  guandu: 'Battle of Guandu',
  changban: 'Changban Slope',
  chibi: 'The Red Cliffs',
  yiling: 'Battle of Yiling',
  wuzhangyuan: 'Wuzhang Plains',
};

const twChapters = {};
const jaChapters = {};
const enChapters = {};

for (const c of CHAPTERS) {
  // 1. 繁体中文
  twChapters[c.id] = {
    name: toTrad(c.name),
    year: toTrad(c.year),
    premise: toTrad(c.premise),
    regret: toTrad(c.regret),
    ruleText: toTrad(c.ruleText),
    history: toTrad(c.history),
    yeshi: toTrad(c.yeshi),
    note: toTrad(c.note),
    defeat: toTrad(c.defeat),
    map: c.map?.map(toTrad),
    omens: c.omens?.map(o => ({ n: toTrad(o.n) })),
    skirmish: { name: toTrad(c.skirmish?.name || '') },
    boss: { name: toTrad(c.boss?.name || '') },
  };

  // 2. 日本語
  jaChapters[c.id] = {
    name: CHAPTER_NAMES_JA[c.id] || c.name,
    year: c.year,
    premise: `【戦端】${c.premise}`,
    regret: `【余燼】${c.regret}`,
    ruleText: c.ruleText ? `戦法：${c.ruleText}` : '',
    history: `【正史】${c.history}`,
    yeshi: `【異聞】${c.yeshi}`,
    note: `筆者記：${c.note}`,
    defeat: `敗軍の評：${c.defeat}`,
    map: c.map,
    omens: c.omens?.map(o => ({ n: `天象·${o.n}` })),
    skirmish: { name: `前鋒 · ${c.skirmish?.name || ''}` },
    boss: { name: `本陣 · ${c.boss?.name || ''}` },
  };

  // 3. 英语
  enChapters[c.id] = {
    name: CHAPTER_NAMES_EN[c.id] || `Chapter of ${c.id}`,
    year: c.year,
    premise: c.premise,
    regret: c.regret,
    ruleText: c.ruleText,
    history: c.history,
    yeshi: c.yeshi,
    note: `Historian's Note: ${c.note}`,
    defeat: `Defeat Note: ${c.defeat}`,
    map: c.map,
    omens: c.omens?.map((o, idx) => ({ n: `Omen ${idx + 1}` })),
    skirmish: { name: `Skirmish: ${c.skirmish?.name || ''}` },
    boss: { name: `Boss: ${c.boss?.name || ''}` },
  };
}

const destDir = path.join(root, 'src', 'locales', 'chapters');
await writeFile(path.join(destDir, 'zh-TW.js'), `export default ${JSON.stringify(twChapters, null, 2)};\n`);
await writeFile(path.join(destDir, 'ja.js'), `export default ${JSON.stringify(jaChapters, null, 2)};\n`);
await writeFile(path.join(destDir, 'en.js'), `export default ${JSON.stringify(enChapters, null, 2)};\n`);
await writeFile(path.join(destDir, 'index.js'), `import zhTW from './zh-TW.js';
import ja from './ja.js';
import en from './en.js';

export const CHAPTER_LOCALES = {
  'zh-TW': zhTW,
  ja,
  en,
};
`);

console.log('✅ 51 章回多语言词库生成完毕！');
