// main.js —— 主流程:开卷 → 目录 → 翻页题记 → 天时 → 行军图 → 战役 → 结算 → 目录
import { startBackdrop, wait } from './fx2d.js';
import { AudioFX } from './audio.js';
import { createOpponent } from './character.js';
import { startBattle } from './battle.js';
import { buildMarch, createMap, eventModal, storyModal } from './map.js';
import { makePersona, TRAITS, describeTraits } from './persona.js';
import { FX, getChapter, CHAPTERS } from './chapters.js';
import { getGeneral, GENERALS } from './generals.js';
import { renderGeneralCard } from './general-card.js';
import { rosterOf, roundConfig, chapterEncounters } from './encounters.js';
import { PRACTICE_ARENAS, arenaRoster, practiceBrief } from './practice-data.js';
import { renderPractice, initPracticeScreen } from './practice.js';
import * as SC from './scroll.js';
import { createOnboarding } from './onboarding.js';
import { createBattleBriefing } from './briefing.js';
import { initRuntimeInfo } from './runtime-info.js';
import { watchRuntimeVersion, forceReloadLatest } from './auto-update.js';
import { initFullscreen } from './fullscreen.js';
import { loadChapterData } from './story-data/runtime.js';
import { initPwa } from './pwa.js';
import { createSaveTransfer } from './save-transfer.js';
import { createOddsPanel } from './odds-panel.js';
import {
  storyFor, mapSceneFor, introFor, outcomeFor, markSceneSeen, sceneSeen, choiceFor,
} from './story-engine.js';
import { t, getLocale, setLocale, translatePage, onLocaleChange } from './i18n.js';

const $ = id => document.getElementById(id);
window.addEventListener('error', e => { $('errBox').textContent += e.message + '\n'; });
window.addEventListener('unhandledrejection', e => { $('errBox').textContent += (e.reason?.message || e.reason) + '\n'; });

startBackdrop($('backdrop'));
initRuntimeInfo();
watchRuntimeVersion();
document.getElementById('forceRefresh')?.addEventListener('click', () => { void forceReloadLatest(); });
initFullscreen($('fullscreenToggle'));

// 初始化多语言界面与切换监听
translatePage();
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const locale = btn.dataset.locale;
    setLocale(locale);
  });
});
onLocaleChange(() => {
  if (!$('scroll').classList.contains('hidden')) {
    SC.renderCodex(P, openChapterPage, enterPractice);
  }
  if ($('page') && !$('page').classList.contains('hidden') && currentChapter) {
    renderChapterPage(currentChapter);
  }
  if ($('practice') && !$('practice').classList.contains('hidden')) {
    renderPractice(P, startPracticeArena);
  }
});

const audio = new AudioFX();
const oppChar = createOpponent($('oppChar'));
const oddsPanel = createOddsPanel();

// ---------------- HUD 适配层 ----------------
const actions = $('actions'), raiseOpts = $('raiseOpts');

const ui = {
  setOppName(n) { oppChar.setName(n); },
  setStacks(you, opp) { $('youStack').textContent = you; oppChar.setStack(opp); },
  setPot(n) { $('potNum').textContent = n; },
  setBlind(t) { $('blindLabel').textContent = t; },
  setHand(str) { $('handLabel').textContent = t('poker.handDesc.lead') + ' ' + (str || t('poker.handDesc.none')); },
  setSeed(t) { $('seedVal').textContent = t; },
  setTilt(n) { oppChar.setTilt(n); },
  setPlayerName(n) { $('youName').textContent = n || t('app.playerName', { default: '你' }); },
  setTauntLabel(lbl) { $('tauntBtn').textContent = lbl || t('poker.actions.taunt'); },
  enableTaunt(v) { $('tauntBtn').disabled = !v; },
  clearCodex() { $('codexList').innerHTML = `<li class="empty">${t('battle.emptyLog')}</li>`; },
  codexAdd(html) {
    const list = $('codexList');
    list.querySelector('.empty')?.remove();
    const li = document.createElement('li');
    li.innerHTML = html;
    list.prepend(li);
    while (list.children.length > 6) list.lastChild.remove();
  },
  bubble(text, dur = 2.6) { oppChar.say(text, dur); },
  banner(main, sub = '') {
    $('bannerMain').textContent = main;
    $('bannerSub').textContent = sub;
    const b = $('banner');
    b.classList.remove('hidden', 'show');
    void b.offsetWidth;
    b.classList.add('show');
  },
  vignette(on) { $('vignette').classList.toggle('on', on); },
  showSeedModal(seedTxt, deckHtml) {
    $('modalSeed').textContent = seedTxt;
    $('deckOrder').innerHTML = deckHtml;
    $('seedModal').classList.remove('hidden');
  },
  promptAction({ toCall, stack, presets, canRaise }) {
    onboarding.tip('action');
    onboarding.tip('taunt');
    return new Promise(resolve => {
      const btns = [...actions.querySelectorAll('button')];
      const vis = {
        fold: toCall > 0,
        check: toCall === 0,
        call: toCall > 0,
        raise: stack > toCall && presets.length > 0,
        allin: stack > 0 && canRaise,
      };
      const cleanup = () => {
        actions.classList.add('hidden');
        raiseOpts.classList.add('hidden');
      };
      actions.classList.remove('hidden');
      const fresh = btns.map(b => { const c = b.cloneNode(true); b.replaceWith(c); return c; });
      for (const b of fresh) {
        const act = b.dataset.act;
        b.style.display = vis[act] ? '' : 'none';
        if (act === 'fold') b.textContent = t('poker.actions.fold');
        if (act === 'check') b.textContent = t('poker.actions.check');
        if (act === 'call') b.innerHTML = toCall >= stack ? `${t('poker.actions.allInCall')} <b>${stack}</b>` : `${t('poker.actions.call')} <b>${toCall}</b>`;
        if (act === 'raise') b.textContent = toCall > 0 ? t('poker.actions.raise') : t('poker.actions.bet');
        if (act === 'allin') b.innerHTML = `${t('poker.actions.allIn')} <b>${stack}</b>`;
        b.addEventListener('click', () => {
          if (act === 'raise') {
            raiseOpts.innerHTML = '';
            raiseOpts.classList.remove('hidden');
            for (const p of presets) {
              const pb = document.createElement('button');
              pb.innerHTML = `${p.label} <b>${p.amount}</b>`;
              pb.addEventListener('click', () => { cleanup(); resolve({ type: 'raise', amount: p.amount }); });
              raiseOpts.appendChild(pb);
            }
            const cancel = document.createElement('button');
            cancel.textContent = t('poker.actions.cancel');
            cancel.addEventListener('click', () => raiseOpts.classList.add('hidden'));
            raiseOpts.appendChild(cancel);
          } else {
            cleanup();
            resolve({ type: act });
          }
        });
      }
    });
  },
  onTaunt(fn) { $('tauntBtn').onclick = fn; },
  onVerify(fn) { $('verifyBtn').onclick = fn; },
};
$('closeSeed').addEventListener('click', () => $('seedModal').classList.add('hidden'));

// 席位详情复用完整武将卡;只关闭详情,不触发任何战斗流程。
$('oppChar').addEventListener('seatinspect', e => {
  const profile = e.detail;
  const el = $('bossIntro');
  renderGeneralCard($('generalIntroCard'), {
    name: profile.name || '敌将',
    bio: profile.bio || '乱世群雄,各有一局。',
    traits: profile.traits || {},
    rule: '牌桌之上,观其取舍。',
    skin: profile.skin || 'default',
    eyebrow: '阵 前 将 谱',
    year: '当前对局',
    gate: !!profile.boss,
  });
  $('introSkip').innerHTML = '合 卷<small>返回牌桌</small>';
  el.dataset.kind = 'boss';
  el.classList.toggle('gate', !!profile.boss);
  el.classList.remove('hidden');
  void el.offsetWidth;
  el.classList.add('show');
  $('introSkip').addEventListener('click', () => {
    el.classList.remove('show');
    el.classList.add('hidden');
  }, { once: true });
});

// ---------------- 屏幕切换 ----------------
const SCREENS = ['intro', 'scroll', 'practice', 'page', 'map', 'battle'];
function show(name) {
  for (const s of SCREENS) $(s).classList.toggle('hidden', s !== name);
  document.body.dataset.screen = name;
  if (name === 'intro') $('intro').classList.remove('fade');
}

// ---------------- 调试钩子 ----------------
const PARAMS = new URLSearchParams(location.search);
// ?seed=固定种子 ?chips=起手筹码 ?opp=对方筹码 ?bossopp=关卡筹码 ?fast=演出加速 ?traits=六维覆盖
// ?chapter=回目id 直达某页 ?omen=fx 预选天时 ?stage=boss 直达关卡(行军图前段置为已竟)
function traitsParam() {
  const s = PARAMS.get('traits');
  if (!s) return null;
  const t = {};
  s.split(',').forEach((v, i) => { if (Number.isFinite(+v) && TRAITS[i]) t[TRAITS[i]] = +v; });
  return t;
}
const TRAITS_OVERRIDE = traitsParam();
const personaOf = traits => makePersona(TRAITS_OVERRIDE || traits);
const battleBriefing = createBattleBriefing({
  audio,
  reduced: PARAMS.get('fast') === '1' || window.matchMedia('(prefers-reduced-motion: reduce)').matches,
});

// 无名部曲使用原版通用头像,名将按档案匹配。
function opponentSkin(cfg, gen, boss) {
  if (gen?.skin) return gen.skin;
  if (/写卷人|天命/.test(cfg.name || '')) return 'default';
  return boss ? 'commander' : 'soldier';
}

// ---------------- 残卷主循环 ----------------
let P = SC.loadProgress();     // 补全度(持久)
SC.saveProgress(P);            // 原地完成旧存档迁移,不回写任何剧情结果
let R = null;                  // 当前回的运行态

function syncSettings() { $('equityAssist').checked = !!P.settings.equityAssist; }
function notifyOddsSetting() {
  window.dispatchEvent(new CustomEvent('odds-setting-change', { detail: { enabled: !!P.settings.equityAssist } }));
}
function closeSettings() {
  $('settingsModal').classList.add('hidden');
  $('settingsToggle').focus({ preventScroll: true });
}
syncSettings();
$('settingsToggle').addEventListener('click', () => {
  syncSettings();
  $('settingsModal').classList.remove('hidden');
  $('equityAssist').focus({ preventScroll: true });
});
$('settingsClose').addEventListener('click', closeSettings);
$('equityAssist').addEventListener('change', event => {
  P.settings.equityAssist = event.currentTarget.checked;
  SC.saveProgress(P);
  notifyOddsSetting();
});
document.addEventListener('keydown', event => {
  if ($('settingsModal').classList.contains('hidden')) return;
  if (event.key === 'Escape') { closeSettings(); return; }
  if (event.key !== 'Tab') return;
  const first = $('equityAssist'), last = $('settingsClose');
  if (event.shiftKey && (document.activeElement === first || !$('settingsModal').contains(document.activeElement))) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && (document.activeElement === last || !$('settingsModal').contains(document.activeElement))) {
    event.preventDefault(); first.focus();
  }
});

const onboarding = createOnboarding(P, {
  save: SC.saveProgress,
  onFinish: enterGame,
  force: PARAMS.get('tutorial') || '',
});
createSaveTransfer({
  read: () => P,
  onImported(imported) {
    SC.saveProgress(imported);
    for (const key of Object.keys(P)) delete P[key];
    Object.assign(P, imported);
    syncSettings();
    notifyOddsSetting();
    showCodex();
  },
});

let marchBusy = false; // 亮相/战斗/事件期间锁住军令,防连点重入
const map = createMap({
  getRun: () => R,
  async onPick(node) {
    if (marchBusy) return;
    marchBusy = true;
    try {
      const scene = mapSceneFor(R.chapter, node);
      if (scene && !R.mapScenes.has(scene.id)) {
        const previous = choiceFor(P, R.chapter.id, scene.id);
        const result = await storyModal(scene, { P, chapter: R.chapter, previousChoice: previous });
        markSceneSeen(P, R.chapter.id, scene.id);
        R.mapScenes.add(scene.id);
        if (result.choice) {
          P.story.choices[`${R.chapter.id}.${scene.id}`] = result.choice.id;
          for (const sibling of scene.choices || []) {
            if (sibling.id !== result.choice.id && sibling.effects?.fact) delete P.story.facts[sibling.effects.fact];
          }
          applyStoryEffects(result.choice.effects, R, P);
        }
        SC.saveProgress(P);
      }
      if (node.type === 'battle') {
        const win = await enterBattle(node, R.chapter.skirmish, { stack: R.chapter.skirmish.stack ?? 500 });
        if (win === null) return returnToMarch(node);
        if (!win) return await endChapter(false);
        node.done = true;
        R.current = node.id;
        show('map');
        map.render();
        return;
      }
      if (node.type === 'boss') return await enterBoss(node);
      if (!scene) {
        const key = await eventModal(node.type, R);
        if (key === 'heal') R.chips += 80;
        if (key === 'money') R.chips += 150;
        if (key === 'loot') R.chips += 150;
        if (key === 'calm') R.keenEye = true;
        if (key === 'eye') R.keenEye = true;
        if (key === 'bribe') R.bribe = true;
      }
      node.done = true;
      R.current = node.id;
      map.render();
    } finally {
      marchBusy = false;
    }
  },
});

function applyStoryEffects(effects = {}, run = R, progress = P) {
  if (effects.chips) run.chips += effects.chips;
  if (effects.keenEye) run.keenEye = true;
  if (effects.sow) run.oppMorale0 -= effects.sow;
  if (effects.raid) run.raid = true;
  if (effects.oppChips) run.storyOppChips = (run.storyOppChips || 0) + effects.oppChips;
  if (effects.fact) progress.story.facts[effects.fact] = true;
}

function showCodex() {
  R = null;
  $('chapterLoadStatus').classList.add('hidden');
  $('chapterLoadRetry').classList.add('hidden');
  show('scroll');
  SC.renderCodex(P, openChapterPage, enterPractice);
}

// ---------------- 野战练习场:与正史并列的全屏点兵台 ----------------
function enterPractice() {
  show('practice');
  renderPractice(P, startPracticeArena);
}

let currentChapter = null;
function renderChapterPage(chapter) {
  currentChapter = chapter;
  const ov = SC.causalFor(P, chapter); // 页间因果:前页改写,此页题记随变
  const alt = chapter.id === 'wuzhangyuan' && SC.isYeshi(SC.pageState(P, 'wuzhangyuan'));
  const begin = (asZhuge) => async () => {
    let fx = PARAMS.get('omen');
    if (!fx) {
      onboarding.tip('omen');
      fx = await SC.pickOmen(chapter, FX);
    }
    startMarch(chapter, fx, { asZhuge });
  };
  show('page');
  SC.renderPage(chapter, begin(false), showCodex, {
    premise: ov?.premise,
    note: ov?.note,
    P,
    alt: alt ? { label: '执子之手', start: begin(true) } : null,
  });
  onboarding.tip('page');
}

let chapterLoading = false;
let requestedChapter = null;
async function openChapterPage(chapter) {
  if (chapterLoading) return;
  chapterLoading = true;
  requestedChapter = chapter;
  if ($('scroll').classList.contains('hidden')) showCodex();
  const status = $('chapterLoadStatus');
  status.dataset.state = 'loading';
  status.classList.remove('hidden');
  $('chapterLoadMessage').textContent = `正在下载《${chapter.name}》剧本与战书…`;
  $('chapterLoadRetry').classList.add('hidden');
  $('scrollList').inert = true;
  try {
    await loadChapterData(chapter);
    status.classList.add('hidden');
    renderChapterPage(chapter);
  } catch (error) {
    status.dataset.state = 'error';
    $('chapterLoadMessage').textContent = `《${chapter.name}》下载未完成，请检查网络后重试。`;
    $('chapterLoadRetry').classList.remove('hidden');
    console.error('章节资源加载失败', error);
  } finally {
    $('scrollList').inert = false;
    chapterLoading = false;
  }
}
$('chapterLoadRetry').addEventListener('click', () => {
  if (requestedChapter) void openChapterPage(requestedChapter);
});

function startMarch(chapter, omenFx, { asZhuge = false } = {}) {
  const story = storyFor(chapter);
  const clueFx = P.story.clues[chapter.id] ? story?.loss?.clueFx : null;
  const baseChips = parseInt(PARAMS.get('chips') || '1000', 10) + (clueFx === 'supply' ? 150 : 0);
  R = {
    chapter, omenFx, asZhuge,
    chips: baseChips + (omenFx === 'supply' ? 200 : 0),
    nodes: buildMarch(chapter),
    current: null,
    seed: PARAMS.get('seed') || Math.random().toString(16).slice(2, 8).toUpperCase(),
    keenEye: omenFx === 'keenEye' || clueFx === 'keenEye',
    oppMorale0: (omenFx === 'sow' ? -1 : 0) - (clueFx === 'sow' ? 1 : 0),
    raid: omenFx === 'raid' || clueFx === 'raid',
    bribe: false,
    storyOppChips: 0,
    storyBeats: new Set(),
    mapScenes: new Set(),
    clueActive: !!clueFx,
    marchInfo: `${chapter.year || '残卷'} · ${chapter.name}${clueFx ? ' · 史鉴生效' : ''}`,
  };
  const debugTarget = PARAMS.get('stage') === 'boss' ? R.nodes[R.nodes.length - 1]?.id : PARAMS.get('node');
  if (debugTarget) { // 调试:直达指定行军节点(stage=boss 为兼容别名)
    const targetIndex = R.nodes.findIndex(n => n.id === debugTarget);
    if (targetIndex >= 0) {
      for (const n of R.nodes) if (n.col < targetIndex) n.done = true;
      R.current = R.nodes[targetIndex - 1]?.id || null;
    }
  }
  const mapTitle = t('map.title') || '行 军 图';
  $('marchTitle').textContent = `${mapTitle} · ${chapter.name}`;
  show('map');
  map.render();
  onboarding.tip('map');
}

function returnToMarch(node) {
  show('map');
  map.render();
  document.querySelector(`#mapSvg [data-node="${node.id}"]`)?.focus({ preventScroll: true });
}

// 一场战斗(遭遇战/关卡单场);先展战书,再亮相,最后才进入牌桌
async function enterBattle(node, cfg, { stack, roundInfo = '', noOverride = false } = {}) {
  const boss = node.type === 'boss';
  const roster = rosterOf(cfg);
  const rawOverride = noOverride ? null : ((boss && PARAMS.get('bossopp')) || PARAMS.get('opp'));
  const overrides = rawOverride?.split(',').map(value => parseInt(value, 10)).filter(Number.isFinite) || [];
  const round = Number(roundInfo.match(/#r(\d+)/)?.[1] || 1);
  const revive = roundInfo === '#revive';
  const displayRoster = roster.map((member, index) => {
    const memberStack = overrides.length === 1 ? overrides[0] : (overrides[index] ?? (roster.length === 1 ? (stack ?? member.stack) : (index === 0 ? (stack ?? member.stack ?? cfg.stack) : (member.stack ?? cfg.stack))));
    const gen = getGeneral(member.gen);
    return { ...member, stack: memberStack, general: gen, skin: opponentSkin(member, gen, boss) };
  });
  onboarding.hideTip();
  const accepted = await battleBriefing.show({
    chapter: R.chapter, node, roster: displayRoster,
    round, rounds: R.chapter.rule?.gauntlet || 1, revive, allowBack: !revive,
  });
  if (!accepted) return null;

  // 玩家确认入席后才消耗行军效果;返回地图不会白失增益。
  const members = displayRoster.map((member, index) => {
    let memberStack = member.stack;
    if (index === 0 && R.bribe) { memberStack = Math.max(300, memberStack - 250); R.bribe = false; }
    if (index === 0 && R.raid && boss) { memberStack = Math.max(300, memberStack - 200); R.raid = false; }
    if (index === 0 && R.storyOppChips) { memberStack = Math.max(100, memberStack + R.storyOppChips); R.storyOppChips = 0; }
    return {
      id: index === 0 ? 'opponent' : `opponent-${index + 1}`,
      name: member.name, stack: memberStack, gen: member.gen, general: member.general,
      persona: personaOf(member.traits), skin: member.skin, morale: R.oppMorale0,
    };
  });
  const primary = members[0], gen = primary.general;
  const battleSeed = `${R.seed}#${R.chapter.id}#${node.id}${roundInfo}`;
  ui.setSeed('#' + battleSeed);
  if (boss) await bossIntro(R.chapter, cfg);
  else await opponentIntro(R.chapter, cfg, false);

  show('battle');
  return new Promise(resolve => {
    startBattle({
      playerStack: R.chips,
      oppStack: primary.stack,
      opponents: members,
      blinds0: cfg.blinds || roster[0].blinds || [10, 20],
      escalateEvery: cfg.escalate || 4,
      boss,
      oppName: primary.name,
      oppGen: primary.gen,
      persona: primary.persona,
      rule: R.chapter.rule || {},
      oppMorale0: R.oppMorale0,
      general: gen,
      oppSkin: primary.skin,
      playerName: boss && R.asZhuge ? '诸葛亮' : undefined,
      zhiZi: boss && R.asZhuge,
      seed: battleSeed,
      story: boss ? { chapter: R.chapter, P, R, round } : null,
      keenEye: R.keenEye,
      odds: oddsPanel,
      oddsEnabled: () => !!P.settings.equityAssist,
      ui, audio, oppChar,
      // 破绩履历聚合(识破命中/总数/诓骗次数)上牌桌:立绘角标与气泡注解共用。
      getTellRecord(genId) {
        const t = annals()[genId]?.tells;
        if (!t) return null;
        let n = 0, hit = 0;
        for (const kind of Object.values(t)) { n += kind.n; hit += kind.hit; }
        return n ? { n, hit, lies: n - hit } : null;
      },
      onTell(t) { const genId = t.gen || members.find(member => member.id === t.seatId)?.gen; if (genId) annalsTell(genId, t); },
      onTellShown() { onboarding.tip('tell'); },
      onEnd(win, finalStack, summary) {
        R.chips = Math.max(0, finalStack);
        if (members.length === 1 && primary.gen) annalsRecord(primary.gen, win);
        else for (const opponent of summary.opponents || []) if (opponent.gen) annalsRecord(opponent.gen, win);
        resolve(win);
      },
    });
  });
}

// 全对手亮相:章节专属小传与旧账台词;新条件版本仍会出现,重复挑战不阻塞
async function opponentIntro(chapter, cfg, boss, { index = 0, count = 1 } = {}) {
  const el = $('bossIntro');
  const gen = getGeneral(cfg.gen);
  const local = introFor(chapter, cfg, { P, R, chapter });
  const introId = `intro:${chapter.id}:${cfg.gen || cfg.name}:${local.quote || 'base'}`;
  if (sceneSeen(P, chapter.id, introId) && PARAMS.get('intro') !== '1') return;
  renderGeneralCard($('generalIntroCard'), {
    name: cfg.name,
    bio: local.bio || gen?.bio || (boss ? '乱世群雄,各有一局。' : '无名之辈,也守着不肯退的一步。'),
    quote: local.quote || gen?.barks?.open || (boss ? '此路,先问过我的牌。' : '前路遭遇,胜负手上见。'),
    traits: cfg.traits,
    rule: local.rule || chapter.ruleText || storyFor(chapter)?.objective || chapter.premise,
    skin: opponentSkin(cfg, gen, boss),
    eyebrow: boss ? (chapter.gate ? '大 关' : '敌 将 亮 相') : '遭 遇',
    year: chapter.year || '残卷深处',
    gate: boss && chapter.gate,
    skirmish: !boss,
  });
  el.dataset.kind = boss ? 'boss' : 'skirmish';
  if (boss && count > 1) $('introSkip').innerHTML = `${index < count - 1 ? '下 一 位' : '应 战'}<small>${index + 1} / ${count} · 点击继续</small>`;
  el.classList.toggle('gate', !!(boss && chapter.gate));
  el.classList.remove('hidden');
  void el.offsetWidth;
  el.classList.add('show');
  let skip;
  const skipped = new Promise(resolve => { skip = resolve; });
  $('introSkip').addEventListener('click', skip, { once: true });
  await Promise.race([wait(boss ? (storyFor(chapter) ? 5.2 : (chapter.gate ? 3.6 : 3.0)) : 2.2), skipped]);
  markSceneSeen(P, chapter.id, introId);
  SC.saveProgress(P);
  el.classList.remove('show');
  el.classList.add('hidden');
}
async function bossIntro(chapter, cfg = chapter.boss) {
  const roster = rosterOf(cfg);
  for (let i = 0; i < roster.length; i++) await opponentIntro(chapter, roster[i], true, { index: i, count: roster.length });
}

// 关卡:单场或连战(gauntlet)
async function enterBoss(node) {
  const c = R.chapter;
  const rounds = c.rule?.gauntlet || 1;
  const requestedRound = R.bossRound || parseInt(PARAMS.get('round') || '1', 10) || 1;
  const firstRound = Math.max(1, Math.min(rounds, requestedRound));
  for (let r = firstRound; r <= rounds; r++) {
    R.bossRound = r;
    const currentBoss = roundConfig(c.boss, r);
    R.marchInfo = rounds > 1 ? `${c.name} · 第 ${r} / ${rounds} 阵` : `${c.year || '残卷'} · ${c.name}`;
    if (rounds > 1) {
      ui.banner(`第 ${r} 阵`, rounds > 1 && c.id === 'qiqin' ? '擒他,也放他。' : '');
      await wait(1.0);
    }
    const win = await enterBattle(node, currentBoss, { stack: currentBoss.stack, roundInfo: '#r' + r });
    if (win === null) return returnToMarch(node);
    if (!win) {
      if ((c.rule?.advanceOnLoss || 0) >= r && r < rounds) {
        R.chips = 650;
        ui.banner('输了，也要再来', `第 ${r + 1} 顾，考的不是上一阵输赢。`);
        await wait(1.2);
        continue;
      }
      // 专属机制·七进七出:本场首次清台,半仓再战
      if (c.rule?.reviveOnce && !R.revived) {
        R.revived = true;
        R.chips = Math.max(500, R.chips);
        ui.banner('七进七出', '你杀出重围,又杀了回来。');
        audio.chime();
        await wait(1.6);
        const again = await enterBattle(node, c.boss, {
          stack: Math.max(300, Math.floor(currentBoss.stack * 0.6)),
          roundInfo: '#revive',
          noOverride: true, // 复活战不受 ?opp/?bossopp 影响(测试以此制造必败首战)
        });
        if (again) { node.done = true; R.current = node.id; return endChapter(true); }
      }
      return endChapter(false);
    }
    if (r < rounds) {
      R.chips += 100; // 阵间小补给
      await wait(0.8);
    }
  }
  delete R.bossRound;
  node.done = true;
  R.current = node.id;
  return endChapter(true);
}

// ---------------- 野战练习场对局 ----------------
// 等筹码典故对局:战书 → 牌桌 → 练习簿记一笔(顺带入列传),再回点兵台。
async function startPracticeArena(arena) {
  const roster = arenaRoster(arena);
  onboarding.hideTip();
  const accepted = await battleBriefing.show({
    practice: practiceBrief(arena), roster, allowBack: true,
    node: { type: 'battle', name: arena.place }, chapter: null, // practice 分支不读章节
  });
  if (!accepted) return enterPractice();

  const members = roster.map(member => ({
    id: member.id, name: member.name, stack: member.stack,
    gen: member.gen, general: getGeneral(member.gen),
    persona: personaOf(member.traits), skin: member.skin, morale: 0,
  }));
  const primary = members[0];
  const battleSeed = `${Math.random().toString(16).slice(2, 8).toUpperCase()}#practice#${arena.id}`;
  ui.setSeed('#' + battleSeed);
  show('battle');
  return new Promise(resolve => {
    startBattle({
      playerStack: arena.stack,
      oppStack: arena.stack,
      opponents: members,
      blinds0: [...arena.blinds],
      escalateEvery: arena.escalate,
      boss: false,
      oppName: primary.name,
      oppGen: primary.gen,
      persona: primary.persona,
      rule: arena.rule || {},
      oppMorale0: 0,
      general: primary.general,
      oppSkin: primary.skin,
      seed: battleSeed,
      story: null,
      keenEye: false,
      odds: oddsPanel,
      oddsEnabled: () => !!P.settings.equityAssist,
      ui, audio, oppChar,
      getTellRecord(genId) {
        const t = annals()[genId]?.tells;
        if (!t) return null;
        let n = 0, hit = 0;
        for (const kind of Object.values(t)) { n += kind.n; hit += kind.hit; }
        return n ? { n, hit, lies: n - hit } : null;
      },
      onTell(t) { const genId = t.gen || members.find(member => member.id === t.seatId)?.gen; if (genId) annalsTell(genId, t); },
      onEnd: async (win, finalStack, summary) => {
        const rec = P.practice[arena.id] || { seen: 0, won: 0 };
        rec.seen++;
        if (win) rec.won++;
        P.practice[arena.id] = rec;
        for (const opponent of summary.opponents || []) if (opponent.gen) annalsRecord(opponent.gen, win);
        SC.saveProgress(P);
        ui.banner(win ? '野史练笔 · 此局你赢' : '野史练笔 · 此局你输',
          `${arena.name} · 练习簿 ${rec.won} 胜 / ${rec.seen - rec.won} 负`);
        await wait(1.6);
        enterPractice();
        resolve(win);
      },
    });
  });
}
initPracticeScreen(showCodex);

// ---------------- 列传(观阵录持久化) ----------------
function annals() { return P.annals || (P.annals = {}); }
function annalsRecord(genId, win) {
  const a = annals()[genId] || (annals()[genId] = { seen: 0, won: 0, tells: {} });
  a.seen++;
  if (win) a.won++;
  SC.saveProgress(P);
}
function annalsTell(genId, t) {
  const a = annals()[genId] || (annals()[genId] = { seen: 0, won: 0, tells: {} });
  const k = t.shown;
  a.tells[k] = a.tells[k] || { n: 0, hit: 0 };
  a.tells[k].n++;
  if (t.hit) a.tells[k].hit++;
  SC.saveProgress(P);
}
// 列传六维:取该武将首次出场回的属性包
function traitsOfGen(genId) {
  for (const chapter of CHAPTERS) {
    const encounter = chapterEncounters(chapter).find(item => item.cfg.gen === genId);
    if (encounter) return encounter.cfg.traits;
  }
  return {};
}

$('annalsBtn').addEventListener('click', () => {
  SC.renderAnnals(P, { generals: GENERALS, chapters: CHAPTERS, describeTraits, traitsOf: traitsOfGen });
  $('annalsModal').classList.remove('hidden');
});
$('annalsClose').addEventListener('click', () => $('annalsModal').classList.add('hidden'));

function nextAfterWin(chapter) {
  if (chapter.apocrypha || chapter.type === 'finale') return null;
  const index = CHAPTERS.findIndex(item => item.id === chapter.id);
  const next = index >= 0 ? CHAPTERS[index + 1] : null;
  if (!next) return null;
  if (next.scroll === chapter.scroll) return next;
  if (next.scroll === 5) {
    const projected = { ...P, pages: { ...P.pages, [chapter.id]: 'yeshi' } };
    return SC.finaleUnlocked(projected) ? next : null;
  }
  return chapter.gate ? next : null;
}

async function endChapter(win) {
  const c = R.chapter;
  const storyOutcome = outcomeFor(c, win, { P, R, chapter: c });
  if (!win) { // 兵败即刻入账:原卷与史鉴写入残卷
    SC.markPage(P, c.id, 'history');
    P.story.outcomes[c.id] = 'history';
    if (storyOutcome.clue) P.story.clues[c.id] = true;
    SC.saveProgress(P);
  }
  const yeshiExtra = R.asZhuge ? '批注:这一局,你亲手执过丞相之手。' : '';
  const next = nextAfterWin(c);
  const res = await SC.settle(c, { win, annotation: storyOutcome.text || c.defeat, yeshiExtra, storyOutcome, next });
  if (win) {
    const resultKey = res.yeshiKey || 'yeshi';
    SC.markPage(P, c.id, resultKey);
    P.story.outcomes[c.id] = resultKey;
    P.story.choices[c.id] = resultKey;
    if (storyOutcome.choiceFact) P.story.facts[storyOutcome.choiceFact] = true;
    if (c.apocrypha) P.apocWins = (P.apocWins || 0) + 1; // 无终稿:只计数,不占正卷
    if (R.asZhuge) P.flags = { ...P.flags, zhizishou: true };
    SC.saveProgress(P);
    if (c.type === 'finale') {
      const q = await SC.finale(P);
      P.endings.push(q);
      P.flags.ending = q;
      SC.saveProgress(P);
    }
    onboarding.tip('settle');
    if (res.r === 'next' && next) return openChapterPage(next);
    return showCodex();
  }
  SC.markPage(P, c.id, 'history');
  SC.saveProgress(P);
  if (res.r === 'retry') return startMarch(c, R.omenFx, { asZhuge: R.asZhuge });
  onboarding.tip('settle');
  return showCodex();
}

// ---------------- 残卷无终稿(NG+:随机外传) ----------------
import { genApocrypha } from './apocrypha.js';
$('apocBtn').addEventListener('click', () => openChapterPage(genApocrypha()));

// ---------------- 开卷 ----------------
function enterGame() {
  $('intro').classList.add('fade');
  setTimeout(() => {
    const direct = PARAMS.get('chapter');
    const c = direct ? getChapter(direct) : null;
    if (c) openChapterPage(c);
    else showCodex();
  }, 900);
}
$('startBtn').addEventListener('click', () => {
  audio.resume();
  onboarding.start();
});
$('prologueSkip').addEventListener('click', () => onboarding.skip());
$('replayIntroBtn').addEventListener('click', () => {
  show('intro');
  onboarding.replay();
});
$('startBtn').disabled = false;
initPwa();
