// extract-strings.mjs —— 全量文案抽取:数据内容 + UI 候选 → zh.json 源语言包 + 翻译分块。
// 运行:node native/bridge/extract-strings.mjs
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const dataDir = join(root, 'native', 'App', 'Resources', 'GameData');
const locDir = join(root, 'native', 'App', 'Resources', 'Localizations');
const trDir = join(root, 'native', 'translation');
mkdirSync(locDir, { recursive: true });
mkdirSync(join(trDir, 'chunks'), { recursive: true });
mkdirSync(join(trDir, 'out'), { recursive: true });

const read = p => JSON.parse(readFileSync(join(dataDir, p), 'utf8'));
const chaptersFile = read('chapters.json');
const generals = read('generals.json');
const practice = read('practice.json');
const story = read('story.json');
const telllines = read('telllines.json');

const T = {}; // key -> zh string
// 通用叶子遍历:跳过非文案键
const SKIP = new Set(['id', 'node', 'speaker', 'when', 'at', 'fx', 'clueFx', 'effects', 'choiceFact', 'gen', 'skin', 'stack', 'blinds', 'escalate', 'type', 'scroll', 'size', 'rounds', 'rule', 'traits', 'opponents', 'key', 'seen', 'won', 'n', 'hit', 'file', 'label', 'desc']);
// (label/desc 只在 fx 对象中手动提取,通用遍历跳过避免误收)
const walk = (obj, prefix, emit) => {
  for (const [k, v] of Object.entries(obj || {})) {
    if (SKIP.has(k)) continue;
    if (typeof v === 'string') { if (v.trim()) emit(prefix + '.' + k, v); }
    else if (Array.isArray(v)) v.forEach((item, i) => {
      if (typeof item === 'string') { if (item.trim()) emit(`${prefix}.${k}.${i}`, item); }
      else if (item && typeof item === 'object') walk(item, `${prefix}.${k}.${i}`, emit);
    });
    else if (v && typeof v === 'object') walk(v, `${prefix}.${k}`, emit);
  }
};

// ---------- 章节 ----------
for (const c of chaptersFile.chapters) {
  const p = `ch.${c.id}`;
  const emitChapterField = (k, v) => { if (typeof v === 'string' && v.trim()) T[`${p}.${k}`] = v; };
  for (const k of ['name', 'year', 'premise', 'regret', 'ruleText', 'history', 'yeshi', 'note', 'defeat']) emitChapterField(k, c[k]);
  (c.map || []).forEach((place, i) => T[`${p}.map.${i}`] = place);
  (c.omens || []).forEach((o, i) => T[`${p}.omen.${i}`] = o.n);
  if (c.skirmish?.name) T[`${p}.skirmish.name`] = c.skirmish.name;
  if (c.boss) {
    if (c.boss.name) T[`${p}.boss.name`] = c.boss.name;
    (c.boss.opponents || []).forEach((m, j) => { if (m.name) T[`${p}.boss.op.${j}.name`] = m.name; });
  }
}
for (const [fx, def] of Object.entries(chaptersFile.fx)) {
  T[`fx.${fx}.label`] = def.label;
  T[`fx.${fx}.desc`] = def.desc;
}
chaptersFile.scrolls.forEach((s, i) => T[`scroll.${i + 1}`] = s);

// ---------- 武将 ----------
for (const [gid, g] of Object.entries(generals)) {
  T[`gen.${gid}.name`] = g.name;
  if (g.bio) T[`gen.${gid}.bio`] = g.bio;
  if (g.tells?.strong) T[`gen.${gid}.tell.strong`] = g.tells.strong;
  if (g.tells?.weak) T[`gen.${gid}.tell.weak`] = g.tells.weak;
  for (const [k, v] of Object.entries(g.barks || {})) T[`gen.${gid}.bark.${k}`] = v;
}

// ---------- 剧本与战书 ----------
for (const [cid, st] of Object.entries(story.stories)) walk(st, `story.${cid}`, (k, v) => T[k] = v);
for (const [cid, b] of Object.entries(story.briefings)) walk(b, `brief.${cid}`, (k, v) => T[k] = v);

// ---------- 野战练习场 ----------
for (const arena of practice.arenas) {
  const p = `arena.${arena.id}`;
  for (const k of ['name', 'place', 'era', 'source', 'lead', 'btitle', 'why', 'win', 'loss', 'ruleText']) {
    if (typeof arena[k] === 'string' && arena[k].trim()) T[`${p}.${k}`] = arena[k];
  }
  (arena.roster || []).forEach((m, i) => { if (m.name && !m.gen) T[`${p}.member.${i}`] = m.name; });
  if (arena.brief && typeof arena.brief === 'object') walk(arena.brief, `${p}.brief`, (k, v) => T[k] = v);
}

// ---------- 破绽台词 ----------
for (const [gid, cats] of Object.entries(telllines.FAMOUS || {})) {
  for (const [cat, lines] of Object.entries(cats)) lines.forEach((line, i) => T[`tell.famous.${gid}.${cat}.${i}`] = line);
}
for (const [arch, cats] of Object.entries(telllines.ARCHETYPE || {})) {
  for (const [cat, lines] of Object.entries(cats)) lines.forEach((line, i) => T[`tell.archetype.${arch}.${cat}.${i}`] = line);
}
for (const [k, v] of Object.entries(telllines.INTENT_NOTES || {})) T[`tell.intent.${k}`] = v;

// ---------- 残卷无终稿(apocrypha.js 字面量) ----------
{
  const src = readFileSync(join(root, 'src/apocrypha.js'), 'utf8');
  const grabArr = name => {
    const m = src.match(new RegExp(`const ${name} = \\[([^\\]]+)\\]`));
    if (!m) return [];
    return m[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
  };
  grabArr('TITLES').forEach((v, i) => T[`apoc.title.${i}`] = v);
  grabArr('PLACES').forEach((v, i) => T[`apoc.place.${i}`] = v);
  grabArr('OMEN_NAMES').forEach((v, i) => T[`apoc.omen.${i}`] = v);
  // RULES 文案
  const ruleTexts = [...src.matchAll(/\{ rule: \{?[^}]*\}?, text: '([^']*)' \}/g)].map(m => m[1]).filter(Boolean);
  ruleTexts.forEach((v, i) => T[`apoc.rule.${i}`] = v);
  for (const [k, v] of Object.entries({
    name: '外传', premise: '这一页不在正卷里。它只属于今夜。',
    yeshi: '你赢下这一页,纸页随风而散,又生新页。', note: '写卷人注:无终稿,无终局。',
    defeat: '风把这一页吹回了原处。', history: '此页不入史。', skirmish: '夜行人',
  })) T[`apoc.${k}`] = v;
}

// ---------- 游戏术语(非数据文件,人工核对自源码常量) ----------
T['term.suit.spade'] = '♠'; T['term.suit.heart'] = '♥'; T['term.suit.diamond'] = '♦'; T['term.suit.club'] = '♣';
['高牌', '一对', '两对', '三条', '顺子', '同花', '葫芦', '四条', '同花顺'].forEach((n, i) => T[`term.hand.${i}`] = n);
['武勇', '智谋', '诈术', '胆识', '耐性', '心性'].forEach((n, i) => T[`term.trait.${i}`] = n);
['旁白', '写卷人', '你', '？？？'].forEach((n, i) => T[`term.speaker.${i}`] = n);

// ---------- UI 候选(从源码与 index.html 抽取 CJK 字面量,交由人工归键) ----------
{
  const cjk = /[\u4e00-\u9fff][\u4e00-\u9fff0-9a-zA-Z·、,。:;!?"'“”‘’()（）《》—…\s×・]{2,}/;
  const files = ['index.html', 'src/main.js', 'src/battle.js', 'src/map.js', 'src/scroll.js', 'src/briefing.js',
    'src/onboarding.js', 'src/practice.js', 'src/character.js', 'src/general-card.js', 'src/save-transfer.js',
    'src/odds-panel.js', 'src/scroll.js', 'src/audio.js'];
  const seen = new Map();
  for (const f of files) {
    const path = join(root, f);
    if (!existsSync(path)) continue;
    const src = readFileSync(path, 'utf8');
    // 模板串与普通串
    for (const m of src.matchAll(/['"`]([^'"`\n]{2,80})['"`]/g)) {
      const s = m[1].trim();
      if (cjk.test(s) && !/^[.#{[]/.test(s) && !s.includes('$')) seen.set(s, (seen.get(s) || 0) + 1);
    }
    // index.html 文本节点
    if (f === 'index.html') {
      for (const m of src.matchAll(/>([^<>{}]{2,80})</g)) {
        const s = m[1].trim();
        if (cjk.test(s)) seen.set(s, (seen.get(s) || 0) + 1);
      }
    }
  }
  const candidates = [...seen.entries()].map(([s, count]) => ({ zh: s, count })).sort((a, b) => b.count - a.count);
  writeFileSync(join(trDir, 'ui-candidates.json'), JSON.stringify(candidates, null, 1));
  console.log(`ui-candidates: ${candidates.length} strings`);
}

// ---------- 输出 zh.json(内容层;ui.* 由 Swift UI 编码时持续并入) ----------
writeFileSync(join(locDir, 'zh.json'), JSON.stringify(T, null, 1));
console.log(`zh.json: ${Object.keys(T).length} keys, ${Object.values(T).reduce((a, s) => a + s.length, 0)} chars`);

// ---------- 翻译分块(每块 ≤ 12000 字符) ----------
const entries = Object.entries(T);
const CHUNK = 12000;
let ci = 0;
for (let i = 0; i < entries.length; ) {
  let size = 0; const chunk = {};
  while (i < entries.length && (size < CHUNK || Object.keys(chunk).length === 0)) {
    const [k, v] = entries[i]; chunk[k] = v; size += v.length + k.length; i++;
  }
  ci++;
  writeFileSync(join(trDir, 'chunks', `chunk-${String(ci).padStart(2, '0')}.json`), JSON.stringify(chunk, null, 1));
}
console.log(`chunks: ${ci} files -> native/translation/chunks/`);
writeFileSync(join(trDir, 'manifest.json'), JSON.stringify({ totalKeys: entries.length, chunks: ci, generatedAt: new Date().toISOString() }, null, 1));
console.log('DONE extract-strings');
