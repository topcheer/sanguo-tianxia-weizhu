// auto-translate.mjs —— headless 批量机翻补全（DeepSeek chat completions）
// 用法: node native/translation/auto-translate.mjs [langs...]
// 断点续传: 已存在于 out/<lang>/*.json 的键会被跳过
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const locDir = join(root, 'native', 'App', 'Resources', 'Localizations');

const API = process.env.DS_BASE || 'https://api.deepseek.com/chat/completions';
const KEY = process.env.DEEPSEEK_API_KEY;
if (!KEY) { console.error('missing DEEPSEEK_API_KEY'); process.exit(1); }
const MODEL = process.env.DS_MODEL || 'deepseek-chat';

const LANG_NAME = { ja: 'Japanese', ko: 'Korean', en: 'English', es: 'Spanish', de: 'German' };
const BATCH_KEYS = Number(process.env.BATCH_KEYS || 45);
const CONC = Number(process.env.CONC || 4);

const guide = readFileSync(join(here, 'GUIDE.md'), 'utf8');

// 源内容 = 所有 chunk 合并
const chunksDir = join(here, 'chunks');
const source = {};
for (const f of readdirSync(chunksDir).filter(f => f.endsWith('.json')).sort()) {
  Object.assign(source, JSON.parse(readFileSync(join(chunksDir, f), 'utf8')));
}
const srcKeys = Object.keys(source);
console.log(`source keys: ${srcKeys.length}`);

function loadDone(lang) {
  const dir = join(here, 'out', lang);
  const done = new Set();
  if (!existsSync(dir)) return done;
  for (const f of readdirSync(dir).filter(f => f.endsWith('.json'))) {
    try {
      const o = JSON.parse(readFileSync(join(dir, f), 'utf8'));
      for (const k of Object.keys(o)) done.add(k);
    } catch { /* ignore broken */ }
  }
  return done;
}

function batches(keys, lang) {
  const out = [];
  let cur = [];
  let size = 0;
  for (const k of keys) {
    const v = source[k] ?? '';
    const n = typeof v === 'string' ? v.length : JSON.stringify(v).length;
    if (cur.length && (cur.length >= BATCH_KEYS || size + n > 2200)) { out.push(cur); cur = []; size = 0; }
    cur.push(k); size += n;
  }
  if (cur.length) out.push(cur);
  return out;
}

function systemPrompt(lang) {
  return `You are a professional literary localizer. Translate the Chinese game text of a "Three Kingdoms × Texas Hold'em" narrative poker game into ${LANG_NAME[lang]}.

Follow this project guide strictly (glossary, name conventions, per-language style). It is authoritative.

${guide}

OUTPUT RULES:
- Reply with ONE JSON object only. No prose, no markdown fences.
- Keys must be byte-identical to the input keys, same count, no additions or omissions.
- Values are the ${LANG_NAME[lang]} translation. Never leave Chinese characters in the value, except where the guide explicitly keeps original names.`;
}

async function callOnce(lang, obj) {
  const body = {
    model: MODEL,
    temperature: 1.0,
    max_tokens: 8000,
    messages: [
      { role: 'system', content: systemPrompt(lang) },
      { role: 'user', content: `Translate every value. Input JSON:\n${JSON.stringify(obj, null, 1)}` },
    ],
  };
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${KEY}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${(await res.text()).slice(0, 300)}`);
  const j = await res.json();
  let text = j.choices?.[0]?.message?.content ?? '';
  text = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end < 0) throw new Error('no JSON in reply');
  return JSON.parse(text.slice(start, end + 1));
}

async function translateBatch(lang, keys) {
  const payload = {};
  for (const k of keys) payload[k] = source[k];
  let lastErr;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const got = await callOnce(lang, payload);
      const missing = keys.filter(k => typeof got[k] !== 'string' || !got[k].trim());
      const extra = Object.keys(got).filter(k => !(k in payload));
      if (missing.length === 0) {
        const clean = {};
        for (const k of keys) clean[k] = got[k];
        return clean;
      }
      lastErr = new Error(`missing ${missing.length}: ${missing.slice(0, 3).join(',')} extra ${extra.length}`);
    } catch (e) { lastErr = e; }
    await new Promise(r => setTimeout(r, 1200 * attempt));
  }
  throw lastErr;
}

async function runLang(lang) {
  const done = loadDone(lang);
  const todo = srcKeys.filter(k => !done.has(k));
  console.log(`[${lang}] done ${done.size}/${srcKeys.length}, todo ${todo.length}`);
  if (!todo.length) return { lang, added: 0 };
  const dir = join(here, 'out', lang);
  mkdirSync(dir, { recursive: true });
  const bs = batches(todo, lang);
  console.log(`[${lang}] ${bs.length} batches`);
  let idx = 0, added = 0, failed = 0;
  let next = 0;
  async function worker() {
    while (next < bs.length) {
      const my = next++;
      const keys = bs[my];
      try {
        const out = await translateBatch(lang, keys);
        writeFileSync(join(dir, `auto-${String(my).padStart(3, '0')}.json`), JSON.stringify(out, null, 1));
        added += keys.length;
        process.stdout.write(`[${lang}] batch ${my + 1}/${bs.length} +${keys.length} (total ${added})\n`);
      } catch (e) {
        failed++;
        console.log(`[${lang}] batch ${my + 1}/${bs.length} FAILED: ${String(e.message).slice(0, 160)}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  return { lang, added, failed };
}

const langs = process.argv.slice(2).length ? process.argv.slice(2) : ['ja', 'ko', 'en', 'es', 'de'];
const results = [];
for (const lang of langs) results.push(await runLang(lang));
console.log('=== summary ===');
console.table(results);
