import zhTW from './zh-TW.js';
import ja from './ja.js';
import en from './en.js';

export const TELL_LOCALES = {
  'zh-TW': zhTW,
  ja,
  en,
};

export const INTENT_NOTES_LOCALES = {
  'zh-CN': {
    bluff: '指尖泄了密——他在演',
    trap: '按兵太久了——他在等你上钩',
  },
  'zh-TW': {
    bluff: '指尖洩了密——他在演',
    trap: '按兵太久了——他在等你上鉤',
  },
  ja: {
    bluff: '指先が語る――虚勢（ブラフ）を演じておる',
    trap: '動かざること山の如し――罠を張って待っておる',
  },
  en: {
    bluff: 'Fingertips betray him — he is bluffing',
    trap: 'Held back too long — he is setting a trap',
  },
};
