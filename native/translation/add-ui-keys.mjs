// add-ui-keys.mjs —— 补齐「开卷/四短节序章」的 UI 词条(zh 为源,其余语言用 DeepSeek 一次性翻译)。
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const uiPath = join(here, 'ui-strings.json');
const guide = readFileSync(join(here, 'GUIDE.md'), 'utf8');

const ADD = {
  'title.badge': '残卷',
  'prologue.0.kicker': '序 · 残卷择人',
  'prologue.0.title': '史书只写了沙场，没写牌桌。',
  'prologue.0.text': '你是残卷外的读卷人。写卷人请你进入《英雄记》，不是让你无名顶替刘备或关羽，而是让你坐到故人身旁，在关键一局里替他们争另一种可能。集齐三十枚野史朱印，就能见到写卷人，问出这卷书为何选中你。',
  'prologue.0.p0': '四卷五十回，都有史籍底稿与演义边界',
  'prologue.0.p1': '故人记得你的胜负，也记得你的选择',
  'prologue.1.kicker': '序 · 胜负皆成章',
  'prologue.1.title': '赢，改一段遗憾；输，多懂一层真相。',
  'prologue.1.text': '赢下关底，原卷会被改写成野史。兵败并非白打：你会亲历原本的遗憾，并得到一条“史鉴”，下次重来便知道该看什么。',
  'prologue.1.p0': '胜则改写，败亦入卷',
  'prologue.1.p1': '大关改写后，下一卷才会展开',
  'prologue.2.kicker': '序 · 牌桌就是战场',
  'prologue.2.title': '两张手牌，五张公共牌；赢军资，不争一手意气。',
  'prologue.2.text': '用手牌与公共牌组成最大的五张牌型。通过下注、跟注或弃牌保住军资；让关底敌将的军资归零，就能改写本回。多人局要淘汰所有敌将。',
  'prologue.2.p0': '过牌／跟注：控制代价',
  'prologue.2.p1': '加注／全压：逼对手做难选的决定',
  'prologue.3.kicker': '序 · 牌外三门课',
  'prologue.3.title': '看牌，也看人；争先，也借天时。',
  'prologue.3.text': '开卷前选一项天时。牌桌上，武将的神态会泄露强弱，但也会作假；摊牌后破绽簿会验证你的判断。每手可用一次攻心，挑动他的心性。',
  'prologue.3.p0': '破绽：强未必强，弱未必弱',
  'prologue.3.p1': '攻心：张飞易怒，司马懿不动如山',
  'prologue.3.p2': '行军：军资相随，途中选择会留下后果',
  'prologue.next': '继 续',
  'prologue.nextSub': '点击推进 · 可随时跳过',
  'prologue.open': '展 开 英 雄 记',
  'prologue.openSub': '进入残卷目录',
  'prologue.skip': '跳过背景，直接入卷',
  'prologue.hint': '背景序章约三十秒；机制还会在第一次操作时分别提示',
};

const ui = JSON.parse(readFileSync(uiPath, 'utf8'));
for (const [k, zh] of Object.entries(ADD)) {
  if (!ui[k]) ui[k] = { zh };
  else ui[k].zh = zh;
}

const LANGS = ['ja', 'ko', 'en', 'es', 'de'];
const LANG_NAME = { ja: 'Japanese', ko: 'Korean', en: 'English', es: 'Spanish', de: 'German' };
const KEY = process.env.DEEPSEEK_API_KEY;
if (!KEY) { console.error('missing DEEPSEEK_API_KEY'); process.exit(1); }

async function translate(lang, pairs) {
  const body = {
    model: process.env.DS_MODEL || 'deepseek-chat',
    temperature: 1.0, max_tokens: 8000,
    messages: [
      { role: 'system', content: `You are a professional literary localizer for a "Three Kingdoms × Texas Hold'em" narrative poker game. Translate the Chinese UI/prologue strings into ${LANG_NAME[lang]}. Follow this guide strictly (glossary, names, per-language style):\n\n${guide}\n\nReply with ONE JSON object only (no markdown fences). Keys identical to the input keys, same count. Values = ${LANG_NAME[lang]} translation, no Chinese characters left.` },
      { role: 'user', content: JSON.stringify(pairs, null, 1) },
    ],
  };
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${KEY}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j = await res.json();
  const text = (j.choices?.[0]?.message?.content ?? '').trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/, '');
  const s = text.indexOf('{'), e = text.lastIndexOf('}');
  return JSON.parse(text.slice(s, e + 1));
}

for (const lang of LANGS) {
  const pairs = {};
  for (const k of Object.keys(ADD)) if (!ui[k][lang]) pairs[k] = ui[k].zh;
  if (!Object.keys(pairs).length) { console.log(`[${lang}] already complete`); continue; }
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const got = await translate(lang, pairs);
      let n = 0;
      for (const k of Object.keys(pairs)) {
        if (typeof got[k] === 'string' && got[k].trim()) { ui[k][lang] = got[k]; n++; }
      }
      console.log(`[${lang}] filled ${n}/${Object.keys(pairs).length}`);
      if (n === Object.keys(pairs).length) break;
    } catch (err) {
      console.log(`[${lang}] attempt ${attempt} failed: ${String(err.message).slice(0, 120)}`);
      await new Promise(r => setTimeout(r, 1500 * attempt));
    }
  }
}

writeFileSync(uiPath, JSON.stringify(ui, null, 1));
console.log('ui-strings.json keys:', Object.keys(ui).length);
for (const lang of ['zh', ...LANGS]) {
  const miss = Object.keys(ADD).filter(k => !ui[k][lang]);
  console.log(lang, 'missing', miss.length);
}
