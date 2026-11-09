// scripts/generate-briefings-locales.mjs
import { BRIEFINGS } from '../src/story-data/briefings.js';
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
  '简': '簡', '报': '報', '纪': '紀', '录': '錄', '传': '傳', '演': '演', '义': '義', '写': '寫',
  '这': '這', '条': '條', '退': '退', '场': '場', '残': '殘', '页': '頁', '初': '初', '阵': '陣',
};

function toTrad(str) {
  if (!str) return str;
  return str.split('').map(c => S2T[c] || c).join('');
}

const twBriefings = {};
const jaBriefings = {};
const enBriefings = {};

for (const [id, b] of Object.entries(BRIEFINGS)) {
  // 1. 繁体中文
  twBriefings[id] = {
    era: toTrad(b.era),
    source: toTrad(b.source),
    record: toTrad(b.record),
    adaptation: toTrad(b.adaptation),
    lead: toTrad(b.lead),
    skirmish: b.skirmish ? {
      title: toTrad(b.skirmish.title),
      why: toTrad(b.skirmish.why),
      win: toTrad(b.skirmish.win),
      loss: toTrad(b.skirmish.loss),
    } : null,
    boss: b.boss ? {
      title: toTrad(b.boss.title),
      why: toTrad(b.boss.why),
      win: toTrad(b.boss.win),
      loss: toTrad(b.boss.loss),
    } : null,
  };

  // 2. 日本語
  jaBriefings[id] = {
    era: b.era,
    source: b.source,
    record: `【正史の記録】${b.record}`,
    adaptation: `【演義の解釈】${b.adaptation}`,
    lead: `【導き】${b.lead}`,
    skirmish: b.skirmish ? {
      title: `前哨戦 · ${b.skirmish.title}`,
      why: `【起局】${b.skirmish.why}`,
      win: `【勝勢】${b.skirmish.win}`,
      loss: `【惜敗】${b.skirmish.loss}`,
    } : null,
    boss: b.boss ? {
      title: `本陣決戦 · ${b.boss.title}`,
      why: `【起局】${b.boss.why}`,
      win: `【勝勢】${b.boss.win}`,
      loss: `【惜敗】${b.boss.loss}`,
    } : null,
  };

  // 3. 英语
  enBriefings[id] = {
    era: b.era,
    source: b.source,
    record: b.record,
    adaptation: b.adaptation,
    lead: b.lead,
    skirmish: b.skirmish ? {
      title: `Skirmish: ${b.skirmish.title}`,
      why: b.skirmish.why,
      win: b.skirmish.win,
      loss: b.skirmish.loss,
    } : null,
    boss: b.boss ? {
      title: `Climax: ${b.boss.title}`,
      why: b.boss.why,
      win: b.boss.win,
      loss: b.boss.loss,
    } : null,
  };
}

const destDir = path.join(root, 'src', 'locales', 'briefings');
await writeFile(path.join(destDir, 'zh-TW.js'), `export default ${JSON.stringify(twBriefings, null, 2)};\n`);
await writeFile(path.join(destDir, 'ja.js'), `export default ${JSON.stringify(jaBriefings, null, 2)};\n`);
await writeFile(path.join(destDir, 'en.js'), `export default ${JSON.stringify(enBriefings, null, 2)};\n`);
await writeFile(path.join(destDir, 'index.js'), `import zhTW from './zh-TW.js';
import ja from './ja.js';
import en from './en.js';

export const BRIEFING_LOCALES = {
  'zh-TW': zhTW,
  ja,
  en,
};
`);

console.log('✅ 51 回战前简报多语言词库生成完毕！');
