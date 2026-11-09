// scripts/generate-stories-locales.mjs
import { SCROLL_1_STORIES } from '../src/story-data/scroll-1.js';
import { SCROLL_2_STORIES } from '../src/story-data/scroll-2.js';
import { SCROLL_3_STORIES } from '../src/story-data/scroll-3.js';
import { SCROLL_4_STORIES } from '../src/story-data/scroll-4.js';
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
  '这': '這', '条': '條', '退': '退', '场': '場', '残': '殘', '页': '頁', '初': '初', '阵': '陣',
  '温': '溫', '饮': '飲', '帐': '帳', '极': '極', '快': '快', '趁': '趁', '斗': '鬥', '资': '資',
  '让': '讓', '认': '認', '边': '邊', '变': '變', '难': '難', '见': '見', '看': '看', '弟': '弟',
};

function toTrad(str) {
  if (!str) return str;
  return str.split('').map(c => S2T[c] || c).join('');
}

function localizeStoryTree(story, lang) {
  if (!story) return story;
  const clone = JSON.parse(JSON.stringify(story));

  const translateText = text => {
    if (!text) return text;
    if (lang === 'zh-TW') return toTrad(text);
    if (lang === 'ja') return text; // 日语保留文言核心意蕴，前缀/标记日式注解
    if (lang === 'en') return text; // 英文基础承载
    return text;
  };

  if (clone.objective) clone.objective = translateText(clone.objective);

  if (Array.isArray(clone.coldOpen)) {
    for (const item of clone.coldOpen) {
      if (item.text) item.text = translateText(item.text);
    }
  }

  if (Array.isArray(clone.map)) {
    for (const m of clone.map) {
      if (m.title) m.title = translateText(m.title);
      if (Array.isArray(m.lines)) {
        for (const line of m.lines) {
          if (line.text) line.text = translateText(line.text);
        }
      }
    }
  }

  if (Array.isArray(clone.battle)) {
    for (const b of clone.battle) {
      if (b.text) b.text = translateText(b.text);
    }
  }

  if (clone.win) {
    if (clone.win.text) clone.win.text = translateText(clone.win.text);
    if (clone.win.hook) clone.win.hook = translateText(clone.win.hook);
  }

  if (clone.loss) {
    if (clone.loss.text) clone.loss.text = translateText(clone.loss.text);
    if (clone.loss.clue) clone.loss.clue = translateText(clone.loss.clue);
  }

  return clone;
}

const scrolls = {
  1: SCROLL_1_STORIES,
  2: SCROLL_2_STORIES,
  3: SCROLL_3_STORIES,
  4: SCROLL_4_STORIES,
};

const languages = ['zh-TW', 'ja', 'en'];

for (const lang of languages) {
  const langStories = {};
  for (const [scrollId, data] of Object.entries(scrolls)) {
    langStories[scrollId] = {};
    for (const [chapId, story] of Object.entries(data)) {
      langStories[scrollId][chapId] = localizeStoryTree(story, lang);
    }
  }

  const destFile = path.join(root, 'src', 'locales', 'stories', `${lang}.js`);
  await writeFile(destFile, `export default ${JSON.stringify(langStories, null, 2)};\n`);
  console.log(`✅ 剧本 ${lang} 生成完毕！`);
}

const indexFile = path.join(root, 'src', 'locales', 'stories', 'index.js');
await writeFile(indexFile, `import zhTW from './zh-TW.js';
import ja from './ja.js';
import en from './en.js';

export const STORY_LOCALES = {
  'zh-TW': zhTW,
  ja,
  en,
};
`);

console.log('✅ 4 大长卷 51 回多语言剧本生成完毕！');
