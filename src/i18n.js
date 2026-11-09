// i18n.js —— 全局多语言引擎(上游 locale 体系 × native JSON 桥接融合版)
// 双引擎:上游 locales/ 提供四语(zh-CN/zh-TW/ja/en)UI 字典与内容适配器;
// native Localizations JSON(单一事实源)提供全部七语 UI 词条与内容 key 回退。
// 查找链:t(key) → 上游 UI_STRINGS[locale] → native pack[locale] 扁平 key
//         → zh-CN 上游 → native zh → key。
import { UI_STRINGS } from './locales/ui/index.js';
import { GENERAL_LOCALES } from './locales/generals/index.js';
import { CHAPTER_LOCALES } from './locales/chapters/index.js';
import { PRACTICE_LOCALES } from './locales/practice/index.js';
import { TELL_LOCALES, INTENT_NOTES_LOCALES } from './locales/tells/index.js';
import { BRIEFING_LOCALES } from './locales/briefings/index.js';
import { STORY_LOCALES } from './locales/stories/index.js';
import zhJson from '../native/App/Resources/Localizations/zh.json';
import jaJson from '../native/App/Resources/Localizations/ja.json';
import koJson from '../native/App/Resources/Localizations/ko.json';
import enJson from '../native/App/Resources/Localizations/en.json';
import esJson from '../native/App/Resources/Localizations/es.json';
import deJson from '../native/App/Resources/Localizations/de.json';

export const SUPPORTED_LOCALES = ['zh-CN', 'zh-TW', 'ja', 'en', 'ko', 'es', 'de'];

export const LOCALE_LABELS = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'ja': '日本語',
  'en': 'English',
  'ko': '한국어',
  'es': 'Español',
  'de': 'Deutsch',
};

// locale → native pack(native JSON 无 zh-TW,繁体走上游字典)
const NATIVE_PACKS = {
  'zh-CN': zhJson, 'ja': jaJson, 'en': enJson,
  'ko': koJson, 'es': esJson, 'de': deJson,
};

const STORAGE_KEY = 'app.language';
const listeners = new Set();

function normalizeSaved(raw) {
  if (!raw) return null;
  if (raw === 'zh') return 'zh-CN';           // 旧值迁移(我们历史存 zh)
  return SUPPORTED_LOCALES.includes(raw) ? raw : null;
}

function resolveInitialLocale() {
  if (typeof window === 'undefined') return 'zh-CN';
  try {
    const params = new URLSearchParams(window.location.search);
    const qLang = params.get('lang') || params.get('locale');
    if (qLang) {
      const n = qLang === 'zh' ? 'zh-CN' : qLang;
      if (SUPPORTED_LOCALES.includes(n)) return n;
    }
    const saved = normalizeSaved(localStorage.getItem(STORAGE_KEY));
    if (saved) return saved;
    for (const code of navigator.languages || [navigator.language || '']) {
      const c = code.toLowerCase();
      if (c.startsWith('zh')) {
        if (c.includes('tw') || c.includes('hk') || c.includes('hant')) return 'zh-TW';
        return 'zh-CN';
      }
      for (const l of ['ja', 'ko', 'en', 'es', 'de']) if (c.startsWith(l)) return l;
    }
  } catch {}
  return 'zh-CN';
}

let currentLocale = resolveInitialLocale();

export function getLocale() { return currentLocale; }

export function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return;
  if (currentLocale === locale) { applyDocumentLocale(locale); return; }
  currentLocale = locale;
  try { localStorage.setItem(STORAGE_KEY, locale); } catch {}
  applyDocumentLocale(locale);
  translatePage();
  for (const fn of listeners) {
    try { fn(locale); } catch (e) { console.error('Locale listener error:', e); }
  }
}

export function onLocaleChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function applyDocumentLocale(locale) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = locale;
  document.documentElement.dataset.lang = locale;
  document.body?.setAttribute('data-lang', locale);
}

const getNested = (obj, path) => path.split('.').reduce((acc, part) => acc?.[part], obj);

// 核心翻译函数: t('section.key', { varName: 'value' }) —— 嵌套(上游)与扁平(native)通吃
export function t(key, params = {}) {
  const dicts = [
    UI_STRINGS[currentLocale],
    NATIVE_PACKS[currentLocale],
    UI_STRINGS['zh-CN'],
    zhJson,
  ];
  let val;
  for (const d of dicts) {
    if (!d) continue;
    val = typeof d === 'object' ? (d[key] !== undefined ? d[key] : getNested(d, key)) : undefined;
    if (val !== undefined && val !== null) break;
  }
  if (val === undefined || val === null) return key;
  if (typeof val === 'string' && Object.keys(params).length > 0) {
    return val.replace(/\{(\w+)\}/g, (m, p1) => (params[p1] !== undefined ? params[p1] : m));
  }
  return val;
}

// DOM 翻译自动化
export function translatePage() {
  if (typeof document === 'undefined') return;
  applyDocumentLocale(currentLocale);

  for (const el of document.querySelectorAll('[data-i18n]')) {
    const key = el.getAttribute('data-i18n');
    if (!key) continue;
    const translated = t(key);
    if (el.tagName === 'INPUT' && el.getAttribute('type') === 'button') el.value = translated;
    else el.textContent = translated;
  }
  for (const el of document.querySelectorAll('[data-i18n-title]')) {
    const key = el.getAttribute('data-i18n-title');
    if (key) el.setAttribute('title', t(key));
  }
  for (const el of document.querySelectorAll('[data-i18n-aria]')) {
    const key = el.getAttribute('data-i18n-aria');
    if (key) el.setAttribute('aria-label', t(key));
  }

  const activeLangBtn = document.querySelector(`.lang-btn[data-locale="${currentLocale}"]`);
  if (activeLangBtn) {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    activeLangBtn.classList.add('active');
  }

  // 深度更新首页及主要界面核心节点
  const startBtn = document.getElementById('startBtn');
  if (startBtn) {
    const sub = startBtn.querySelector('span');
    const startTxt = t('app.startBtn');
    const subTxt = t('toc.readStory');
    if (sub) {
      if (startBtn.childNodes[0]?.nodeType === Node.TEXT_NODE) startBtn.childNodes[0].textContent = startTxt + ' ';
      sub.textContent = subTxt;
    } else startBtn.textContent = startTxt;
  }

  const introTitle = document.querySelector('#intro h1');
  if (introTitle) {
    introTitle.textContent = t('app.title');
    // 标题自适应(长语言防溢出,见 style.css #intro h1 clamp)
    introTitle.style.setProperty('--title-ch', String(Math.max(1, Math.round(introTitle.textContent.length * 1.18))));
  }
  const introSub = document.querySelector('#intro .sub');
  if (introSub) introSub.textContent = t('app.tagline');
  const introStory = document.getElementById('introStory');
  if (introStory) introStory.textContent = t('app.introPoem');
  const fullscreenToggle = document.getElementById('fullscreenToggle');
  if (fullscreenToggle) fullscreenToggle.textContent = t('app.fullscreen');

  // 印信/装饰字(各语形)
  const pageSpine = document.getElementById('pageSpine');
  if (pageSpine) {
    if (currentLocale === 'en') pageSpine.innerHTML = '<span>H</span><span>E</span><span>R</span><span>O</span><span>E</span><span>S</span>';
    else if (['zh-TW', 'ja'].includes(currentLocale)) pageSpine.innerHTML = '<span>英</span><span>雄</span><span>記</span>';
    else pageSpine.innerHTML = '<span>英</span><span>雄</span><span>记</span>';
  }
  const set = (id, map) => { const el = document.getElementById(id); if (el) el.textContent = map[currentLocale] ?? map['zh-CN']; };
  set('pageDividerSeal', { 'zh-CN': '若', 'zh-TW': '若', ja: '若', ko: '약', en: 'IF', es: 'Si', de: 'Falls' });
  set('pageStamp', { 'zh-CN': '改', 'zh-TW': '改', ja: '変', ko: '고침', en: 'FATE', es: 'Reescribir', de: 'Umschreiben' });
  set('briefingSeal', { 'zh-CN': '战', 'zh-TW': '戰', ja: '戦', ko: '전', en: 'WAR', es: 'Guerra', de: 'Krieg' });
  set('dealerBtn', { 'zh-CN': '庄', 'zh-TW': '莊', ja: '親', ko: '딜', en: 'D', es: 'D', de: 'D' });
  set('deckSig', { 'zh-CN': '汉', 'zh-TW': '漢', ja: '漢', ko: '한', en: 'HAN', es: 'HAN', de: 'HAN' });
  const feltMain = document.getElementById('feltMain');
  const feltSub = document.getElementById('feltSub');
  if (feltMain && feltSub) { feltMain.textContent = t('battle.emblemMain'); feltSub.textContent = t('battle.emblemSub'); }
  const potLabelText = document.getElementById('potLabelText');
  if (potLabelText) potLabelText.textContent = t('battle.pot');
  const pageHistoryLabel = document.getElementById('pageHistoryLabel');
  if (pageHistoryLabel) pageHistoryLabel.textContent = t('page.historyLabel');
  const pageAdaptationLabel = document.getElementById('pageAdaptationLabel');
  if (pageAdaptationLabel) pageAdaptationLabel.textContent = t('page.adaptationLabel');
  const openPage = document.getElementById('openPage');
  if (openPage) openPage.textContent = t('page.depart');
  const pageBack = document.getElementById('pageBack');
  if (pageBack) pageBack.textContent = t('page.back');
  const scrollTitleSeal = document.getElementById('scrollTitleSeal');
  if (scrollTitleSeal) scrollTitleSeal.textContent = currentLocale === 'en' ? 'VOL' : '卷';
  const practiceSeal = document.getElementById('practiceSeal');
  if (practiceSeal) practiceSeal.textContent = currentLocale === 'en' ? 'WAR' : '野';
}

// ======================== 数据对象本地化适配器(上游) ========================

export function localizeGeneral(gen, id) {
  if (!gen) return gen;
  if (currentLocale === 'zh-CN') return gen;
  const loc = GENERAL_LOCALES[currentLocale]?.[id];
  if (!loc) return gen;
  return {
    ...gen,
    name: loc.name || gen.name,
    bio: loc.bio || gen.bio,
    tells: {
      strong: loc.tells?.strong || gen.tells?.strong,
      weak: loc.tells?.weak || gen.tells?.weak,
    },
    barks: {
      open: loc.barks?.open || gen.barks?.open,
      taunt: loc.barks?.taunt || gen.barks?.taunt,
      tilt: loc.barks?.tilt || gen.barks?.tilt,
      smug: loc.barks?.smug || gen.barks?.smug,
      badbeat: loc.barks?.badbeat || gen.barks?.badbeat,
    },
  };
}

export function localizeChapter(chap) {
  if (!chap) return chap;
  if (currentLocale === 'zh-CN') return chap;
  const loc = CHAPTER_LOCALES[currentLocale]?.[chap.id];
  if (!loc) return chap;
  return {
    ...chap,
    year: loc.year || chap.year,
    name: loc.name || chap.name,
    premise: loc.premise || chap.premise,
    regret: loc.regret || chap.regret,
    ruleText: loc.ruleText !== undefined ? loc.ruleText : chap.ruleText,
    history: loc.history || chap.history,
    yeshi: loc.yeshi || chap.yeshi,
    note: loc.note || chap.note,
    defeat: loc.defeat || chap.defeat,
    map: loc.map || chap.map,
    omens: chap.omens?.map((o, idx) => ({ ...o, n: loc.omens?.[idx]?.n || o.n })) || chap.omens,
    skirmish: chap.skirmish ? { ...chap.skirmish, name: loc.skirmish?.name || chap.skirmish.name } : chap.skirmish,
    boss: chap.boss ? { ...chap.boss, name: loc.boss?.name || chap.boss.name } : chap.boss,
  };
}

export function localizePracticeArena(arena) {
  if (!arena) return arena;
  if (currentLocale === 'zh-CN') return arena;
  const loc = PRACTICE_LOCALES[currentLocale]?.[arena.id];
  if (!loc) return arena;
  return {
    ...arena,
    name: loc.name || arena.name,
    place: loc.place || arena.place,
    year: loc.year || arena.year,
    era: loc.era || arena.era,
    source: loc.source || arena.source,
    lead: loc.lead || arena.lead,
    btitle: loc.btitle || arena.btitle,
    why: loc.why || arena.why,
    win: loc.win || arena.win,
    loss: loc.loss || arena.loss,
    ruleText: loc.ruleText || arena.ruleText,
    opponents: arena.opponents?.map((opp, idx) => ({ ...opp, title: loc.opponents?.[idx]?.title || opp.title })) || arena.opponents,
  };
}

export function localizeTells(namedTells, defaultTells) {
  if (currentLocale === 'zh-CN') return { named: namedTells, defaults: defaultTells };
  const loc = TELL_LOCALES[currentLocale];
  if (!loc) return { named: namedTells, defaults: defaultTells };
  return { named: loc.named || namedTells, defaults: loc.defaults || defaultTells };
}

export function localizeIntentNotes(notes) {
  if (currentLocale === 'zh-CN') return notes;
  return INTENT_NOTES_LOCALES[currentLocale] || notes;
}

export function localizeBriefing(briefing, chapterId) {
  if (!briefing) return briefing;
  if (currentLocale === 'zh-CN') return briefing;
  const loc = BRIEFING_LOCALES[currentLocale]?.[chapterId];
  if (!loc) return briefing;
  return {
    ...briefing,
    era: loc.era || briefing.era,
    source: loc.source || briefing.source,
    record: loc.record || briefing.record,
    adaptation: loc.adaptation || briefing.adaptation,
    lead: loc.lead || briefing.lead,
    skirmish: briefing.skirmish ? {
      ...briefing.skirmish,
      title: loc.skirmish?.title || briefing.skirmish.title,
      why: loc.skirmish?.why || briefing.skirmish.why,
      win: loc.skirmish?.win || briefing.skirmish.win,
      loss: loc.skirmish?.loss || briefing.skirmish.loss,
    } : briefing.skirmish,
    boss: briefing.boss ? {
      ...briefing.boss,
      title: loc.boss?.title || briefing.boss.title,
      why: loc.boss?.why || briefing.boss.why,
      win: loc.boss?.win || briefing.boss.win,
      loss: loc.boss?.loss || briefing.boss.loss,
    } : briefing.boss,
    rounds: loc.rounds ? briefing.rounds?.map((r, idx) => ({
      ...r,
      title: loc.rounds?.[idx]?.title || r.title,
      why: loc.rounds?.[idx]?.why || r.why,
      win: loc.rounds?.[idx]?.win || r.win,
      loss: loc.rounds?.[idx]?.loss || r.loss,
    })) : briefing.rounds,
    revive: loc.revive ? {
      ...briefing.revive,
      title: loc.revive.title || briefing.revive?.title,
      why: loc.revive.why || briefing.revive?.why,
      win: loc.revive.win || briefing.revive?.win,
      loss: loc.revive.loss || briefing.revive?.loss,
    } : briefing.revive,
  };
}

export function localizeStory(story, chapterId, scrollId) {
  if (!story) return story;
  if (currentLocale === 'zh-CN') return story;
  const scrollStories = STORY_LOCALES[currentLocale]?.[scrollId];
  let loc = scrollStories?.[chapterId];
  if (!loc && STORY_LOCALES[currentLocale]) {
    for (const s of Object.values(STORY_LOCALES[currentLocale])) {
      if (s && s[chapterId]) { loc = s[chapterId]; break; }
    }
  }
  if (!loc) return story;
  return {
    ...story,
    objective: loc.objective || story.objective,
    coldOpen: loc.coldOpen || story.coldOpen,
    map: loc.map || story.map,
    skirmishIntro: loc.skirmishIntro || story.skirmishIntro,
    skirmishOutcomes: loc.skirmishOutcomes || story.skirmishOutcomes,
    bossIntro: loc.bossIntro || story.bossIntro,
    bossOutcomes: loc.bossOutcomes || story.bossOutcomes,
    epilogue: loc.epilogue || story.epilogue,
    choicePrompt: loc.choicePrompt || story.choicePrompt,
    choices: loc.choices || story.choices,
    battle: loc.battle || story.battle,
    win: loc.win || story.win,
    loss: loc.loss || story.loss,
    intros: loc.intros || story.intros,
  };
}

// ======================== 兼容层(我们既有调用点) ========================

export const LANGUAGES = SUPPORTED_LOCALES.map(code => ({ code, name: LOCALE_LABELS[code] }));

export const i18n = {
  t,
  get language() { return currentLocale === 'zh-CN' ? 'zh' : currentLocale; },
  get pack() { return NATIVE_PACKS[currentLocale] || zhJson; },
  set language(code) {
    const n = code === 'zh' ? 'zh-CN' : code;
    if (SUPPORTED_LOCALES.includes(n)) setLocale(n);
  },
};

export function applyTranslations(root = document) {
  translatePage();
}
