// check-coverage.mjs —— 校验各语言覆盖:源键 vs out/<lang>/*.json 的键集合
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const source = {};
for (const f of readdirSync(join(here, 'chunks')).filter(f => f.endsWith('.json')).sort()) {
  Object.assign(source, JSON.parse(readFileSync(join(here, 'chunks', f), 'utf8')));
}
const srcKeys = new Set(Object.keys(source));
const langs = process.argv.slice(2).length ? process.argv.slice(2) : ['ja', 'ko', 'en', 'es', 'de'];
const rows = [];
for (const lang of langs) {
  const dir = join(here, 'out', lang);
  const have = new Map();
  if (existsSync(dir)) {
    for (const f of readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
      try { Object.assign(Object.fromEntries(have), {}); } catch { /* noop */ }
      const o = JSON.parse(readFileSync(join(dir, f), 'utf8'));
      for (const [k, v] of Object.entries(o)) have.set(k, v);
    }
  }
  const missing = [...srcKeys].filter(k => !have.has(k));
  const empty = [...srcKeys].filter(k => have.has(k) && typeof have.get(k) === 'string' && !have.get(k).trim());
  const untranslated = [...srcKeys].filter(k => {
    const zh = source[k], t = have.get(k);
    return typeof zh === 'string' && typeof t === 'string' && /[\u4e00-\u9fff]/.test(t) && !/[\u4e00-\u9fff]/.test(zh) === false && t === zh;
  });
  rows.push({ lang, total: srcKeys.size, have: srcKeys.size - missing.length, missing: missing.length, empty: empty.length, sameAsZh: untranslated.length });
}
console.table(rows);
