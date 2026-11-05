// export-data.mjs —— 把游戏数据模块导出为 JSON,供 Swift 端打包进 App。
// 运行:node native/bridge/export-data.mjs
// 输出:native/App/Resources/GameData/*.json
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const outDir = join(root, 'native', 'App', 'Resources', 'GameData');
mkdirSync(outDir, { recursive: true });

const { CHAPTERS, SCROLLS, GATE_IDS, NORMAL_IDS, FX, getChapter } = await import(join(root, 'src/chapters.js'));
const { GENERALS, getGeneral } = await import(join(root, 'src/generals.js'));
const { PRACTICE_ARENAS, arenaRoster, practiceBrief } = await import(join(root, 'src/practice-data.js'));
const { PREFLOP_EQUITY } = await import(join(root, 'src/preflop.js'));
const { STORY_DATA } = await import(join(root, 'src/story-data/index.js'));
const { BRIEFINGS } = await import(join(root, 'src/story-data/briefings.js'));
const { INTENT_NOTES } = await import(join(root, 'src/tell-lines.js'));
const { SUITS, SUIT_RED, RANKS, HAND_NAMES, AI_DEFAULTS } = await import(join(root, 'src/poker.js'));
const { TRAITS, describeTraits } = await import(join(root, 'src/persona.js'));

const dump = (name, data) => {
  const json = JSON.stringify(data, null, 1);
  writeFileSync(join(outDir, name), json);
  console.log(`${name}: ${(json.length / 1024).toFixed(1)} KB`);
};

// 章节卷册
dump('chapters.json', {
  scrolls: SCROLLS, gateIds: GATE_IDS, normalIds: NORMAL_IDS, fx: FX, chapters: CHAPTERS,
});

// 武将档案(含破绽文案、台词、皮肤、头像编号)
dump('generals.json', GENERALS);

// 野战练习场:预解析每个竞技场的出战名单与战书摘要
dump('practice.json', {
  arenas: PRACTICE_ARENAS.map(arena => ({
    ...arena,
    roster: arenaRoster(arena),
    brief: practiceBrief(arena),
  })),
});

// 起手牌 169 类胜率表
dump('preflop.json', PREFLOP_EQUITY);

// 剧本数据(四卷五十回全部剧情/战书)
dump('story.json', { stories: STORY_DATA, briefings: BRIEFINGS });

// 破绽台词:INTENT_NOTES 公开导出;FAMOUS/ARCHETYPE 池在源码内为私有,正则提取后求值
{
  const src = readFileSync(join(root, 'src/tell-lines.js'), 'utf8');
  const grab = name => {
    const start = src.indexOf(`const ${name} = {`);
    if (start < 0) throw new Error(`cannot find ${name}`);
    let i = src.indexOf('{', start), depth = 0, end = -1;
    for (; i < src.length; i++) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end < 0) throw new Error(`unbalanced ${name}`);
    return src.slice(src.indexOf('{', start), end + 1);
  };
  const pools = { INTENT_NOTES, FAMOUS: eval(`(${grab('FAMOUS')})`), ARCHETYPE: eval(`(${grab('ARCHETYPE')})`) };
  dump('telllines.json', pools);
}

// 常量与词表
dump('constants.json', { SUITS, SUIT_RED, RANKS, HAND_NAMES, AI_DEFAULTS, TRAITS });

// 头像映射:直接复制 portrait.js 的映射逻辑所需的原始表
{
  const src = readFileSync(join(root, 'src/portrait.js'), 'utf8');
  writeFileSync(join(outDir, 'portrait-source.txt'), src);
  console.log(`portrait-source.txt: ${(src.length / 1024).toFixed(1)} KB`);
  const start = src.indexOf('export const PORTRAITS = {');
  const objStart = src.indexOf('{', start);
  let depth = 0, end = -1;
  for (let i = objStart; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  const PORTRAITS = eval(`(${src.slice(objStart, end + 1)})`);
  const table = {};
  for (const [k, v] of Object.entries(PORTRAITS)) table[k] = { file: v.file, name: v.name };
  dump('portraits.json', table);
}

// schema 摘要(给 Swift 建模参考,不进 App 包)
{
  const sampleChapter = CHAPTERS.find(c => c.id === 'taoyuan') || CHAPTERS[0];
  const bossChapter = CHAPTERS.find(c => c.boss?.opponents) || CHAPTERS.find(c => c.boss);
  const summary = {
    chapterKeys: Object.keys(sampleChapter),
    chapterSample: sampleChapter,
    multiBossKeys: bossChapter ? Object.keys(bossChapter) : null,
    multiBossSample: bossChapter?.boss ?? null,
    generalKeys: Object.keys(Object.values(GENERALS)[0]),
    generalSample: Object.values(GENERALS)[0],
    arenaKeys: Object.keys(PRACTICE_ARENAS[0]),
    storyKeys: Object.keys(Object.values(STORY_DATA)[0]),
    briefingKeys: Object.keys(Object.values(BRIEFINGS)[0]),
    counts: {
      chapters: CHAPTERS.length, generals: Object.keys(GENERALS).length,
      arenas: PRACTICE_ARENAS.length, stories: Object.keys(STORY_DATA).length,
      briefings: Object.keys(BRIEFINGS).length,
    },
  };
  writeFileSync(join(outDir, '..', 'schema-notes.json'), JSON.stringify(summary, null, 1));
  console.log('schema-notes.json written');
}
console.log('DONE export-data');
