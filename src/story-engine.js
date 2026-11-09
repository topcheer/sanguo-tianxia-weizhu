// story-engine.js —— 无 DOM 的剧本解析：条件、场景、入场与牌局拍点
import { STORY_DATA, getLocalizedStory } from './story-data/runtime.js';
import { GENERALS, getGeneral } from './generals.js';
import { getLocale } from './i18n.js';

export const SPEAKERS = {
  narrator: '旁白', writer: '写卷人', you: '你', unknown: '？？？',
};

const LOCALIZED_SPEAKERS = {
  'zh-CN': { narrator: '旁白', writer: '写卷人', you: '你', unknown: '？？？' },
  'zh-TW': { narrator: '旁白', writer: '寫卷人', you: '你', unknown: '？？？' },
  ja: { narrator: '語り手', writer: '筆記者', you: '貴殿', unknown: '？？？' },
  en: { narrator: 'Narrator', writer: 'Chronicler', you: 'You', unknown: '???' },
};

export const speakerName = id => {
  const lang = getLocale();
  const dict = LOCALIZED_SPEAKERS[lang] || LOCALIZED_SPEAKERS['zh-CN'];
  if (dict[id]) return dict[id];
  const g = getGeneral(id) || GENERALS[id];
  return g?.name || id;
};

export const createStoryState = () => ({
  seen: {}, choices: {}, facts: {}, clues: {}, outcomes: {},
});

export function normalizeStoryState(value = {}) {
  const base = createStoryState();
  for (const key of Object.keys(base)) {
    const incoming = value?.[key];
    base[key] = incoming && typeof incoming === 'object' && !Array.isArray(incoming) ? { ...incoming } : {};
  }
  return base;
}

export const storyFor = chapter => {
  const id = typeof chapter === 'string' ? chapter : chapter?.id;
  if (!id) return null;
  const scroll = typeof chapter === 'object' ? chapter?.scroll : undefined;
  return getLocalizedStory(id, scroll) || STORY_DATA[id] || null;
};

const isYeshi = state => ['yeshi', 'yeshiB', 'yeshiAB'].includes(state);

function conditionAtom(atom, ctx) {
  if (!atom) return true;
  if (atom.startsWith('!')) return !conditionAtom(atom.slice(1), ctx);
  const [kind, ...rest] = atom.split(':');
  const value = rest.join(':');
  const P = ctx.P || {};
  if (kind === 'page') {
    const [id, wanted] = value.split(':');
    const actual = P.pages?.[id] || 'unread';
    return wanted === 'yeshi' ? isYeshi(actual) : actual === wanted;
  }
  if (kind === 'choice') {
    const [id, wanted] = value.split(':');
    const actual = P.story?.choices?.[id] || P.pages?.[id];
    return wanted === 'yeshi' ? isYeshi(actual) : actual === wanted;
  }
  if (kind === 'clue') return !!P.story?.clues?.[value || ctx.chapter?.id];
  if (kind === 'fact') return !!P.story?.facts?.[value];
  if (kind === 'seen') return (P.annals?.[value]?.seen || 0) > 0;
  if (kind === 'round') return Number(value) === Number(ctx.round || 1);
  if (kind === 'hand') return Number(value) === Number(ctx.handNum || 1);
  if (kind === 'multi') return !!ctx.multi;
  if (kind === 'single') return !ctx.multi;
  if (kind === 'asZhuge') return !!ctx.R?.asZhuge;
  if (kind === 'omen') return ctx.R?.omenFx === value;
  return false;
}

export function matchesWhen(when, ctx = {}) {
  if (!when) return true;
  if (Array.isArray(when)) return when.every(atom => conditionAtom(atom, ctx));
  return conditionAtom(when, ctx);
}

export function linesFor(lines = [], ctx = {}) {
  return lines.filter(line => matchesWhen(line.when, ctx));
}

export function coldOpenFor(chapter, ctx = {}) {
  const story = storyFor(chapter);
  return linesFor(story?.coldOpen || [], ctx);
}

export function mapSceneFor(chapter, node) {
  const story = storyFor(chapter);
  return (story?.map || []).find(scene => scene.node === node.col || scene.node === node.id) || null;
}

export function introFor(chapter, cfg, ctx = {}) {
  const story = storyFor(chapter);
  const entries = story?.intros?.[cfg.gen] || story?.intros?.[cfg.name] || (cfg.name === '写卷人' ? (story?.intros?.writer || story?.intros?.['写卷人']) : undefined) || [];
  const list = Array.isArray(entries) ? entries : [entries];
  return list.find(entry => matchesWhen(entry.when, ctx)) || list.find(entry => !entry.when) || {};
}

export function battleBeatsFor(chapter, trigger, ctx = {}) {
  const story = storyFor(chapter);
  return (story?.battle || []).filter(beat => beat.at === trigger && matchesWhen(beat.when, ctx));
}

export function outcomeFor(chapter, win, ctx = {}) {
  const story = storyFor(chapter);
  const outcome = story?.[win ? 'win' : 'loss'] || {};
  return { ...outcome, lines: linesFor(outcome.lines || [], ctx) };
}

export const outcomeVariant = (outcome, key) => outcome?.variants?.find(variant => variant.key === key) || null;

export function sceneKey(chapterId, sceneId) { return `${chapterId}.${sceneId}`; }

export function markSceneSeen(P, chapterId, sceneId) {
  if (!P.story) P.story = createStoryState();
  const key = sceneKey(chapterId, sceneId);
  P.story.seen[key] = (P.story.seen[key] || 0) + 1;
}

export function sceneSeen(P, chapterId, sceneId) {
  return (P.story?.seen?.[sceneKey(chapterId, sceneId)] || 0) > 0;
}

export function choiceFor(P, chapterId, sceneId = '') {
  return P.story?.choices?.[sceneId ? sceneKey(chapterId, sceneId) : chapterId];
}
