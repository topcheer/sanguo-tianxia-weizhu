// merge-translations.mjs —— 合并翻译分块 + UI 词条 → Localizations/<lang>.json。
// 运行:node native/bridge/merge-translations.mjs
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const trDir = join(root, 'native', 'translation');
const locDir = join(root, 'native', 'App', 'Resources', 'Localizations');

const contentZh = JSON.parse(readFileSync(join(locDir, 'zh.json'), 'utf8')); // 内容源(含全部内容键)
const ui = JSON.parse(readFileSync(join(trDir, 'ui-strings.json'), 'utf8'));

const langs = ['zh', 'ja', 'ko', 'en', 'es', 'de'];
const report = [];
for (const lang of langs) {
  let pack = {};
  if (lang === 'zh') {
    pack = { ...contentZh };
  } else {
    const dir = join(trDir, 'out', lang);
    if (existsSync(dir)) {
      for (const f of readdirSync(dir).sort()) {
        if (!f.endsWith('.json')) continue;
        try {
          const chunk = JSON.parse(readFileSync(join(dir, f), 'utf8'));
          Object.assign(pack, chunk);
        } catch (e) {
          console.warn(`[warn] ${lang}/${f} 解析失败,已跳过: ${e.message.split('\n')[0]}`);
        }
      }
    }
  }
  // UI 词条
  let uiCount = 0;
  for (const [k, v] of Object.entries(ui)) {
    if (v[lang] != null) { pack[k] = v[lang]; uiCount++; }
  }
  writeFileSync(join(locDir, `${lang}.json`), JSON.stringify(pack, null, 1));
  const contentTotal = Object.keys(contentZh).length;
  const contentDone = Object.keys(pack).filter(k => k in contentZh).length;
  report.push({ lang, keys: Object.keys(pack).length, ui: uiCount, content: `${contentDone}/${contentTotal}` });
}
console.table(report);
console.log('DONE merge-translations');
