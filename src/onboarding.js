// onboarding.js —— 四短节开卷 + 第一次真实操作时的非阻塞引导
// 文案从 i18n 词表读取(prologue.N.* 与 native 同源);词表未覆盖处用中文原文回退。
import { i18n, PL } from './i18n.js';
const $ = id => document.getElementById(id);

const PROLOGUE_KEYS = ['prologue.0', 'prologue.1', 'prologue.2', 'prologue.3'];
function prologueData(step) {
  const base = PROLOGUE_KEYS[step] ?? `prologue.${step}`;
  const t = k => i18n.t(`${base}.${k}`);
  const points = [];
  for (let i = 0; i < 4; i++) {
    const hit = i18n.t(`${base}.p${i}`);
    if (hit !== `${base}.p${i}`) points.push(hit);
  }
  return { kicker: t('kicker'), title: t('title'), text: t('text'), points };
}

const PROLOGUE = [
  {
    kicker: '序 · 残卷择人', title: '史书只写了沙场，没写牌桌。',
    text: '你是残卷外的读卷人。写卷人请你进入《英雄记》，不是让你无名顶替刘备或关羽，而是让你坐到故人身旁，在关键一局里替他们争另一种可能。集齐三十枚野史朱印，就能见到写卷人，问出这卷书为何选中你。',
    points: ['四卷五十回，都有史籍底稿与演义边界', '故人记得你的胜负，也记得你的选择'],
  },
  {
    kicker: '序 · 胜负皆成章', title: '赢，改一段遗憾；输，多懂一层真相。',
    text: '赢下关底，原卷会被改写成野史。兵败并非白打：你会亲历原本的遗憾，并得到一条“史鉴”，下次重来便知道该看什么。',
    points: ['胜则改写，败亦入卷', '大关改写后，下一卷才会展开'],
  },
  {
    kicker: '序 · 牌桌就是战场', title: '两张手牌，五张公共牌；赢军资，不争一手意气。',
    text: '用手牌与公共牌组成最大的五张牌型。通过下注、跟注或弃牌保住军资；让关底敌将的军资归零，就能改写本回。多人局要淘汰所有敌将。',
    points: ['过牌／跟注：控制代价', '加注／全压：逼对手做难选的决定'],
  },
  {
    kicker: '序 · 牌外三门课', title: '看牌，也看人；争先，也借天时。',
    text: '开卷前选一项天时。牌桌上，武将的神态会泄露强弱，但也会作假；摊牌后破绽簿会验证你的判断。每手可用一次攻心，挑动他的心性。',
    points: ['破绽：强未必强，弱未必弱', '攻心：张飞易怒，司马懿不动如山', '行军：军资相随，途中选择会留下后果'],
  },
];

const TIPS = {
  page: ['第一回怎么读', '先看史实底稿，知道旧页借用了哪段史事与演义；再读前页余波和冷开场。每场战斗前还会有战书，写清对手、缘由与胜负代价。'],
  omen: ['天时只需选一项', '粮草加你的军资，夺气压敌士气，看破减少假破绽，劫营削弱关底军资。没有标准答案，选你想采用的打法。'],
  map: ['军令所至', '点击发光节点前进。军资会随你进入下一场；剧情节点的选择会被残卷记住。最后的“关卡”才是改写之处。'],
  action: ['第一手怎么打', '按钮会随局面变化：无注可过牌，有注可跟或弃。加注会展开三档尺度；不必每手都争，保存军资也是选择。'],
  tell: ['他在露破绽', '席位的姿态对应强或弱，名将还有自己的签名动作。可能是假意示弱；等摊牌，破绽簿会记下哪次判断命中。'],
  taunt: ['攻心每手一次', '点击攻心影响当前选中的敌将。易怒者更容易失守，也有人完全免疫；多人局先点席位，再决定攻谁的心。'],
  settle: ['这一页已经留下', '野史会解锁后续内容，原卷会留下史鉴。故人重逢与后续剧情，都会读到这一页的结果。'],
};

export function createOnboarding(P, { save, onFinish, force = '' } = {}) {
  let step = 0;
  let active = false;
  let transitioning = false;
  let transitionVersion = 0;
  const pendingTips = [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fast = new URLSearchParams(location.search).get('fast') === '1';
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  const prologueElements = () => [$('introStep'), $('introNarrative')];
  // 语言切换时开卷若仍在场,按键表重刷当前节(词表未覆盖处自然回退)
  window.addEventListener('app-language-change', () => {
    if (!active && $('intro') && !$('intro').classList.contains('hidden')) render();
  });

  function render() {
    const data = prologueData(step);
    const total = PROLOGUE_KEYS.length;
    $('introStep').textContent = `${data.kicker} · ${step + 1} / ${total}`;
    $('introStory').textContent = data.text;
    $('introLesson').textContent = data.title;
    $('introPoints').innerHTML = data.points.map(point => `<span>${point}</span>`).join('');
    $('startBtn').innerHTML = `${step === PROLOGUE_KEYS.length - 1 ? PL('onboarding.open', '展 开 英 雄 记') : PL('onboarding.next', '继 续')}<span>${step === PROLOGUE_KEYS.length - 1 ? PL('onboarding.openSub', '进入残卷目录') : PL('onboarding.tapHint', '点击推进 · 可随时跳过')}</span>`;
    $('prologueSkip').classList.remove('hidden');
    $('introHint').textContent = '背景序章约三十秒；机制还会在第一次操作时分别提示';
  }

  function resetTransition() {
    transitionVersion++;
    transitioning = false;
    for (const el of prologueElements()) el.classList.remove('is-leaving', 'is-entering');
    $('startBtn').disabled = false;
  }

  async function transitionRender() {
    if (transitioning) return;
    const version = ++transitionVersion;
    if (reducedMotion.matches) { render(); return; }
    transitioning = true;
    $('startBtn').disabled = true;
    const enter = fast ? 200 : 620;
    const leave = fast ? 60 : 160;
    const child = fast ? 120 : 420;
    const elements = prologueElements();
    for (const el of elements) {
      el.style.setProperty('--prologue-enter', `${enter}ms`);
      el.style.setProperty('--prologue-leave', `${leave}ms`);
      el.style.setProperty('--prologue-child', `${child}ms`);
      el.classList.remove('is-entering');
      el.classList.add('is-leaving');
    }
    await pause(leave);
    if (version !== transitionVersion) return;
    for (const el of elements) {
      el.classList.remove('is-leaving');
      el.classList.add('is-entering');
    }
    render();
    void $('introNarrative').offsetWidth;
    for (const el of elements) el.classList.remove('is-entering');
    await pause(enter + 100);
    if (version !== transitionVersion) return;
    transitioning = false;
    $('startBtn').disabled = false;
  }

  function finish() {
    resetTransition();
    active = false;
    P.tutorial.introDone = true;
    save(P);
    onFinish();
  }

  function start() {
    if (force === '0' || (P.tutorial.introDone && force !== '1' && !active)) { onFinish(); return; }
    if (transitioning) return;
    if (!active) { active = true; step = 0; transitionRender(); return; }
    if (step >= PROLOGUE.length - 1) { finish(); return; }
    step++;
    transitionRender();
  }

  function replay() {
    resetTransition();
    active = true;
    step = 0;
    transitionRender();
  }

  function skip() {
    if (!active) return;
    finish();
  }

  function tip(key) {
    const data = TIPS[key];
    if (!data || P.tutorial.skipped || P.tutorial.steps[key] || force === '0') return;
    if (!$('coachmark').classList.contains('hidden')) {
      if (!pendingTips.includes(key)) pendingTips.push(key);
      return;
    }
    P.tutorial.steps[key] = true;
    save(P);
    $('coachTitle').textContent = data[0];
    $('coachText').textContent = data[1];
    $('coachmark').classList.remove('hidden');
  }

  function closeTip() {
    $('coachmark').classList.add('hidden');
    const next = pendingTips.shift();
    if (next) setTimeout(() => tip(next), 80);
  }

  $('coachClose').addEventListener('click', closeTip);
  $('coachNever').addEventListener('click', () => {
    P.tutorial.skipped = true;
    pendingTips.length = 0;
    save(P);
    $('coachmark').classList.add('hidden');
  });

  return { start, replay, skip, tip, hideTip: () => { pendingTips.length = 0; $('coachmark').classList.add('hidden'); } };
}
