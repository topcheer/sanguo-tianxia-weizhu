// runtime.js —— 浏览器端章节与剧情数据仓库;全部静态打包打入首包,完全离线可用
import { BRIEFINGS as RAW_BRIEFINGS } from './briefings.js';
import { SCROLL_1_STORIES } from './scroll-1.js';
import { SCROLL_2_STORIES } from './scroll-2.js';
import { SCROLL_3_STORIES } from './scroll-3.js';
import { SCROLL_4_STORIES } from './scroll-4.js';
import { localizeBriefing, localizeStory } from '../i18n.js';

export const BRIEFINGS = { ...RAW_BRIEFINGS };
export const STORY_DATA = {
  ...SCROLL_1_STORIES,
  ...SCROLL_2_STORIES,
  ...SCROLL_3_STORIES,
  ...SCROLL_4_STORIES,
};

const CHAPTER_SCROLL_MAP = {};
for (const id of Object.keys(SCROLL_1_STORIES)) CHAPTER_SCROLL_MAP[id] = 1;
for (const id of Object.keys(SCROLL_2_STORIES)) CHAPTER_SCROLL_MAP[id] = 2;
for (const id of Object.keys(SCROLL_3_STORIES)) CHAPTER_SCROLL_MAP[id] = 3;
for (const id of Object.keys(SCROLL_4_STORIES)) CHAPTER_SCROLL_MAP[id] = 4;

export async function loadChapterData(chapter) {
  // 数据已全量内联首包,无需网络等待
  return Promise.resolve();
}

export const briefingFor = chapter => {
  const id = typeof chapter === 'string' ? chapter : chapter?.id;
  const raw = BRIEFINGS[id] || null;
  return raw ? localizeBriefing(raw, id) : null;
};

export const getLocalizedStory = (chapterId, scrollId) => {
  const raw = STORY_DATA[chapterId];
  if (!raw) return null;
  const scroll = scrollId || CHAPTER_SCROLL_MAP[chapterId] || 1;
  return localizeStory(raw, chapterId, scroll);
};
