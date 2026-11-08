// i18n.js —— web 六语言运行时:与 native L10n.swift 同语义
// (首启随系统语言 → 手动选择持久化 → 非中文键回退中文 → 最终回退键名)。
// 词表直接 import native 的 Localizations/*.json,单一事实源,零拷贝。
import zh from '../native/App/Resources/Localizations/zh.json';
import ja from '../native/App/Resources/Localizations/ja.json';
import ko from '../native/App/Resources/Localizations/ko.json';
import en from '../native/App/Resources/Localizations/en.json';
import es from '../native/App/Resources/Localizations/es.json';
import de from '../native/App/Resources/Localizations/de.json';

const PACKS = { zh, ja, ko, en, es, de };
export const LANGUAGES = [
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
];
const STORE_KEY = 'app.language';

function detect() {
  const saved = localStorage.getItem(STORE_KEY);
  if (saved && PACKS[saved]) return saved;
  for (const code of navigator.languages || [navigator.language || 'en']) {
    const c = String(code).toLowerCase();
    for (const p of ['zh', 'ja', 'ko', 'es', 'de', 'en']) if (c.startsWith(p)) return p;
  }
  return 'en';
}

export const i18n = {
  language: detect(),
  get pack() { return PACKS[this.language] || {}; },
  setLanguage(code) {
    if (!PACKS[code] || code === this.language) return;
    this.language = code;
    localStorage.setItem(STORE_KEY, code);
    document.documentElement.lang = code === 'zh' ? 'zh-Hans' : code;
    window.dispatchEvent(new CustomEvent('app-language-change', { detail: { language: code } }));
  },
  t(key) {
    const hit = this.pack[key];
    if (hit != null) return hit;
    if (this.language !== 'zh' && zh[key] != null) return zh[key];
    return key;
  },
};

/// 键查询:命中词条表用词条;否则用代码内中文兜底(与 native PL 同构)。
export function L(key) { return i18n.t(key); }
export function PL(key, zhFallback) {
  const hit = i18n.pack[key];
  return hit != null ? hit : zhFallback;
}
export function LF(key, ...args) {
  let i = 0;
  return L(key).replace(/%[sd@]/g, () => (args[i++] ?? ''));
}

/// 扫描静态文案:[data-i18n]=文本,[data-i18n-ph]=placeholder,[data-i18n-title]=title。
/// 逐元素记录原文(首次所见),语言切换后可重刷,不依赖重建 DOM。
export function applyTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (el.dataset.i18nOrig == null) el.dataset.i18nOrig = el.textContent;
    el.textContent = i18n.t(key) !== key ? i18n.t(key) : el.dataset.i18nOrig;
    // 标题字符数驱动自适应字号(CSS: clamp 上限 = 88vw / --title-ch);
    // 长标题(如 en "Three Kingdoms: All In")自动缩号不溢出,短标题(中文)不受影响。
    if (key === 'title.name') {
      el.style.setProperty('--title-ch', String(Math.max(1, Math.round(el.textContent.length * 1.18))));
    }
  });
  root.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    const key = el.dataset.i18nPh;
    if (el.dataset.i18nPhOrig == null) el.dataset.i18nPhOrig = el.placeholder || '';
    const hit = i18n.t(key);
    if (hit !== key) el.placeholder = hit;
  });
  root.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.dataset.i18nTitle;
    if (el.dataset.i18nTitleOrig == null) el.dataset.i18nTitleOrig = el.title || '';
    const hit = i18n.t(key);
    if (hit !== key) el.title = hit;
  });
}
