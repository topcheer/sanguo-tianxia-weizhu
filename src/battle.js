// battle.js —— 2.5D 多人牌桌:有序席位、独立 AI、破绽、边池、淘汰与演出
import * as PK from './poker.js';
import * as T from './table.js';
import { makePersona } from './persona.js';
import { wait } from './fx2d.js';
import { POSE, renderSeatRoles } from './character.js';
import { tellCategory, tellLine, INTENT_NOTES } from './tell-lines.js';
import { battleBeatsFor, speakerName } from './story-engine.js';
import { createOddsCalculator } from './odds-client.js';
import { t } from './i18n.js';

const $ = id => document.getElementById(id);
const SLOTS = {
  community: i => ({ x: 50 + (i - 2) * 11.5, y: 45 }),
  pot: { x: 50, y: 38 },
  betP: { x: 50, y: 66 }, stackP: { x: 87, y: 74 },
  deck: { x: 10, y: 42 },
  muck: { x: 10, y: 66 },
};
const LINES = {
  deal: ['又是一手。', '洗牌、发牌,阵前再见。'], bet: ['下注。', '跟上,或者让开。'],
  raise: ['加注。', '此注,翻倍。'], call: ['跟。', '看你这一手。'], check: ['过。', '……慢慢来。'],
  fold: ['这手让给你。', '……不值得。'], allin: ['全压。', '要么全跟,要么退。'],
  win: ['筹码,该是我的。', '承让。'], lose: ['……留着吧。', '这一手,记下。'],
  taunt: ['……口舌之快。', '阵前斗口,输家的把戏。'], tauntTilt: ['放肆!', '你、再、说、一、遍?'],
};

function cardEl(id, big = false, seatId = '') {
  const el = document.createElement('div');
  el.className = 'card' + (PK.SUIT_RED[PK.suitOf(id)] ? ' red' : '') + (big ? ' big' : '');
  const r = PK.RANKS[PK.rankOf(id)], s = PK.SUITS[PK.suitOf(id)];
  const face = r >= 9 ? `<div class="pip big-letter">${r}</div><div class="pip mid-suit">${s}</div>`
    : `<div class="pip mid-suit only">${s}</div><div class="pip small-rank">${r}</div>`;
  el.innerHTML = `<div class="inner"><div class="face front"><div class="corner tl">${r}<br>${s}</div><div class="center">${face}</div><div class="corner br">${r}<br>${s}</div></div><div class="face back"><div class="back-sig">♠</div></div></div>`;
  el.dataset.cardId = id;
  if (seatId) el.dataset.seatId = seatId;
  return el;
}

function renderStack(el, count, tone) {
  el.innerHTML = '';
  const n = Math.min(Math.max(0, Math.round(count)), 12);
  for (let i = 0; i < n; i++) {
    const chip = document.createElement('div');
    chip.className = 'chip ' + tone;
    chip.style.bottom = i * 5 + 'px';
    el.appendChild(chip);
  }
}

// 对手席位坐标(牌桌百分比)。1-3 人沿用原设计位;4 人以上沿弧线展开,
// 两端席位更低(更靠近玩家)、中路更高,避免相邻手牌与下注堆重叠。
function opponentSpot(index, count) {
  if (count === 1) return { x: 50, y: 27 };
  if (count === 2) return { x: [31, 69][index], y: 22 };
  if (count === 3) return { x: [20, 50, 80][index], y: 22 };
  const t = index / (count - 1);
  return { x: 8 + t * 84, y: Math.round(13 + 21 * (1 - Math.sin(Math.PI * t))) };
}

export function startBattle(opts) {
  const {
    playerStack = 1000, oppStack = 1000, blinds0 = [10, 20], escalateEvery = 4,
    boss = false, oppName = '无名敌将', rule = {}, oppMorale0 = 0, general = null,
    ui, audio, oppChar, onEnd, odds, oddsEnabled = () => false,
  } = opts;
  const table = $('table'), cardLayer = $('cardLayer'), scene = $('scene');
  const single = {
    name: oppName, stack: oppStack, persona: opts.persona || makePersona(), general,
    skin: opts.oppSkin || general?.skin || 'default', morale: oppMorale0, gen: opts.oppGen || null,
  };
  const configs = opts.opponents?.length ? opts.opponents : [single];
  const hero = { id: 'player', name: opts.playerName || '你', isHero: true, stack: playerStack, hole: [] };
  const opponents = configs.map((cfg, index) => {
    const persona = cfg.persona || makePersona(cfg.traits);
    const id = cfg.id || (index === 0 ? 'opponent' : `opponent-${index + 1}`);
    const seat = {
      id, isHero: false, name: cfg.name || `敌将 ${index + 1}`, stack: cfg.stack,
      initialStack: cfg.stack, hole: [], gen: cfg.general || null, genId: cfg.gen || cfg.generalId || null,
      skin: cfg.skin || cfg.general?.skin || 'default', persona, morale: cfg.morale ?? oppMorale0,
      lossStreak: 0, slowplayed: false, bluffLine: false, tell: null, tellLog: [], tellIntentUsed: false, read: PK.createRead(),
    };
    seat.ai = {
      ...persona.ai,
      get tilt() { return tiltOf(seat); },
      get morale() { return seat.morale; },
    };
    return seat;
  });
  const G = {
    handNum: 0, blindLv: 0, button: 0, blinds: [...blinds0], H: null,
    hero, opponents, seats: [hero, ...opponents], board: [], deck: [], deckPtr: 0, deckLog: [],
    over: false, taunted: false, spectate: false, selected: opponents[0].id,
    meshByCard: new Map(), boardEls: [], seed: opts.seed, keenEye: !!opts.keenEye,
  };
  const oddsCalculator = createOddsCalculator();
  let oddsRevision = 0;
  const BL = level => {
    const m = Math.pow(1.5, level);
    return [Math.round(blinds0[0] * m / 5) * 5, Math.round(blinds0[1] * m / 5) * 5];
  };
  const tiltOf = seat => Math.max(0, Math.min(3, -seat.morale));
  const BARK = (seat, key, fallback) => seat.gen?.barks?.[key] || fallback;

  // 调试/测试钩子:直接驱动席位气泡与履历角标(e2e 用,不涉存档)
  window.__tellUI = {
    show: payload => oppChar.tell(payload),
    record: (record, id) => oppChar.setTellRecord(record, id),
  };

  oppChar.setPlayers(opponents.map(seat => ({ id: seat.id, name: seat.name, stack: seat.stack, skin: seat.skin, boss })));
  for (const seat of opponents) {
    oppChar.setProfile({ bio: seat.gen?.bio || '乱世群雄,各有一局。', traits: seat.persona.traits }, seat.id);
    oppChar.setBoss(boss, seat.id);
    oppChar.setTilt(tiltOf(seat), seat.id);
    if (seat.genId) oppChar.setTellRecord(opts.getTellRecord?.(seat.genId) || null, seat.id);
  }
  oppChar.setSelected(true, G.selected);
  ui.setPlayerName?.(opts.playerName);
  ui.setTauntLabel?.(opts.zhiZi ? '观 星' : '攻 心');
  ui.setHand('—');
  ui.clearCodex();
  ui.setPot(0);

  const piles = { pot: $('stPot'), bet: new Map([['player', $('stBetP')]]), stack: new Map([['player', $('stStackP')]]) };
  for (const [index, seat] of opponents.entries()) {
    const betEl = index === 0 ? $('stBetO') : document.createElement('div');
    const stackEl = index === 0 ? $('stStackO') : document.createElement('div');
    if (index > 0) {
      betEl.id = `stBet-${seat.id}`; stackEl.id = `stStack-${seat.id}`;
      betEl.className = 'stack opponent-bet'; stackEl.className = 'stack opponent-stack';
      betEl.dataset.dynamicPile = '1'; stackEl.dataset.dynamicPile = '1';
      table.append(betEl, stackEl);
    }
    betEl.dataset.seatId = seat.id; stackEl.dataset.seatId = seat.id;
    piles.bet.set(seat.id, betEl); piles.stack.set(seat.id, stackEl);
  }

  function seatSlot(seat, kind, cardIndex = 0) {
    if (seat.isHero) {
      if (kind === 'hole') {
        const gap = window.innerWidth <= 640 ? 28 : 10;
        return { x: 50 + (cardIndex ? gap / 2 : -gap / 2), y: 97 };
      }
      if (kind === 'bet') return SLOTS.betP;
      return SLOTS.stackP;
    }
    const index = opponents.indexOf(seat), count = opponents.length;
    const spot = opponentSpot(index, count);
    if (kind === 'hole') {
      const offset = window.innerWidth <= 640 ? (count >= 4 ? 6 : 8) : (count >= 4 ? 4.5 : 5.5);
      return { x: spot.x + (cardIndex ? offset : -offset), y: spot.y };
    }
    if (kind === 'bet') return { x: spot.x, y: count === 1 ? 26 : spot.y + 8 };
    return { x: count === 1 ? 11 : spot.x, y: count === 1 ? 13 : Math.max(3, spot.y - 11) };
  }
  function slotPos(slot, el) {
    const r = cardLayer.getBoundingClientRect(), er = el.getBoundingClientRect();
    return { x: r.width * slot.x / 100 - er.width / 2, y: r.height * slot.y / 100 - er.height / 2 };
  }
  function place(el, slot, immediate = false) {
    if (immediate) el.classList.add('no-anim');
    el.style.transform = `translate(${slotPos(slot, el).x}px, ${slotPos(slot, el).y}px)`;
    if (immediate) { el.offsetHeight; el.classList.remove('no-anim'); }
  }
  function pileTo(el, slot) {
    const r = cardLayer.getBoundingClientRect();
    el.style.left = (r.width * slot.x / 100) + 'px';
    el.style.top = (r.height * slot.y / 100) + 'px';
  }
  function layoutPiles() {
    pileTo(piles.pot, SLOTS.pot);
    pileTo($('deckEl'), SLOTS.deck);
    for (const seat of G.seats) {
      pileTo(piles.bet.get(seat.id), seatSlot(seat, 'bet'));
      pileTo(piles.stack.get(seat.id), seatSlot(seat, 'stack'));
    }
  }
  layoutPiles();
  const relayout = () => layoutPiles();
  addEventListener('resize', relayout);

  function refreshPiles() {
    for (const seat of G.seats) {
      renderStack(piles.stack.get(seat.id), seat.stack, seat.isHero ? 'ivory' : 'ebony');
      renderStack(piles.bet.get(seat.id), seat.bet || 0, seat.isHero ? 'ivory' : 'ebony');
      if (!seat.isHero) {
        oppChar.setStack(seat.stack, seat.id);
        oppChar.setTilt(tiltOf(seat), seat.id);
      }
    }
    renderStack(piles.pot, G.H ? T.potTotal(G.H.seats) : 0, 'pot');
    ui.setStacks(hero.stack, opponents[0].stack);
    ui.setPot(G.H ? T.potTotal(G.H.seats) : 0);
    ui.setTilt(tiltOf(opponents[0]));
  }
  function clearOdds() {
    oddsRevision++;
    oddsCalculator.cancel();
    odds?.clear();
  }
  function refreshOdds() {
    const revision = ++oddsRevision;
    if (!oddsEnabled() || !G.H || hero.folded || hero.hole.length !== 2
      || ![0, 3, 4, 5].includes(G.board.length) || T.liveSeats(G.H.seats).length < 2) {
      oddsCalculator.cancel();
      odds?.clear();
      return;
    }
    const opponentsLeft = G.H.seats.filter(seat => !seat.isHero && !seat.folded).length;
    const hole = [...hero.hole], board = [...G.board];
    odds?.pending();
    oddsCalculator.analyze({ hole, board, opponents: opponentsLeft }).then(result => {
      if (revision === oddsRevision) odds?.render(result);
    }).catch(error => {
      if (error.name === 'AbortError' || revision !== oddsRevision) return;
      console.warn('局势分析暂时不可用', error);
      odds?.error();
    });
  }
  const onOddsSettingChange = () => refreshOdds();
  addEventListener('odds-setting-change', onOddsSettingChange);

  function refreshDealer() {
    const seat = G.H?.seats[G.H.button];
    if (!seat) return;
    const button = $('dealerBtn');
    button.title = `庄位 · ${seat.isHero ? '你' : seat.name}`;
    button.dataset.seatId = seat.id;
    if (seat.isHero) { button.style.left = '36%'; button.style.top = '82%'; }
    else {
      const spot = opponentSpot(opponents.indexOf(seat), opponents.length);
      button.style.left = `${spot.x}%`;
      button.style.top = `${spot.y - (opponents.length === 1 ? 10 : 5)}%`;
    }
  }
  function refreshFoldState(seat) {
    const folded = !!G.H?.seats.includes(seat) && seat.folded;
    if (seat.isHero) {
      $('youPlate').classList.toggle('is-folded', folded);
      $('playerFoldStatus').classList.toggle('hidden', !folded);
    } else {
      oppChar.setFolded(folded, seat.id);
    }
  }
  function refreshSeatStates() {
    for (const seat of G.seats) {
      const pos = G.H.seats.findIndex(item => item.id === seat.id);
      const roles = [];
      if (pos === G.H.button) roles.push({ kind: 'button', label: '庄' });
      if (pos === G.H.sb) roles.push({ kind: 'sb', label: `小盲 ${G.blinds[0]}` });
      if (pos === G.H.bb) roles.push({ kind: 'bb', label: `大盲 ${G.blinds[1]}` });
      if (seat.isHero) renderSeatRoles($('playerRoles'), roles);
      else oppChar.setRoles(roles, seat.id);
      refreshFoldState(seat);
    }
  }
  refreshPiles();

  async function flyChips(fromSlot, toSlot, tone) {
    const el = document.createElement('div');
    el.className = 'stack fly';
    renderStack(el, 8, tone);
    cardLayer.appendChild(el);
    place(el, fromSlot, true);
    await wait(0.03);
    place(el, toSlot);
    audio.chip();
    await wait(0.42);
    el.remove();
  }
  async function collectBets() {
    if (!G.H) return;
    const bets = G.H.seats.filter(seat => seat.bet > 0);
    await Promise.all(bets.map(seat => flyChips(seatSlot(seat, 'bet'), SLOTS.pot, seat.isHero ? 'ivory' : 'ebony')));
    T.closeRound(G.H);
    refreshPiles();
  }
  async function dealCard(id, slot, faceUp, big = false, seatId = '') {
    const el = cardEl(id, big, seatId);
    cardLayer.appendChild(el);
    G.meshByCard.set(id, el);
    place(el, SLOTS.deck, true);
    if (faceUp) el.classList.add('flipped');
    await wait(0.03);
    audio.card();
    place(el, slot);
    await wait(0.4);
    return el;
  }
  async function muckCards(seat) {
    const cards = seat.hole.map(id => ({ id, el: G.meshByCard.get(id) })).filter(item => item.el);
    for (const { el } of cards) {
      el.classList.remove('flipped', 'hl', 'peek');
      el.style.pointerEvents = 'none';
      place(el, SLOTS.muck);
      el.style.opacity = 0;
    }
    await wait(0.42);
    for (const { id, el } of cards) {
      G.meshByCard.delete(id);
      el.remove();
    }
  }
  const nextCard = () => G.deck[G.deckPtr++];
  async function clearTable() {
    const all = [...G.meshByCard.values()].filter(Boolean);
    for (const el of all) {
      el.classList.remove('flipped', 'hl');
      place(el, { x: 50, y: -30 });
      el.style.opacity = 0;
    }
    await wait(0.5);
    all.forEach(el => el.remove());
    G.meshByCard.clear(); G.boardEls = [];
  }

  function applyTell(seat, street, rng) {
    if (seat.folded || seat.stack <= 0 && !seat.hole.length) return;
    const tells = seat.gen?.tells || { strong: '右手护住筹码堆', weak: '左手抚上瓷面' };
    const recordSuffix = () => {
      const rec = seat.genId ? opts.getTellRecord?.(seat.genId) : null;
      return rec && rec.n ? ` · 识破${rec.hit}/${rec.n}` : '';
    };
    // 意图型破绽:诈唬线/慢打埋伏进行中,小概率露真(每手至多一次,恒真,
    // 与当街牌力破绽互斥)。泄露的是决策机的真实状态,是玩家最想买的信息。
    // 演出层概率与选词一律用 Math.random:破绽呈现不得消耗共享游戏 RNG,
    // 否则种子局的发牌流会被洗掉(见 generals.spec 秋风起用例)。
    if (!seat.tellIntentUsed && street > 0 && (seat.bluffLine || seat.slowplayed)) {
      const p = Math.min(0.34, 0.08 + seat.persona.ai.plan * 0.22 + (G.keenEye ? 0.12 : 0));
      if (Math.random() < p) {
        seat.tellIntentUsed = true;
        const intent = seat.slowplayed ? 'trap' : 'bluff';
        seat.tell = { street, shown: intent, actual: intent, kind: 'intent' };
        seat.tellLog.push({ street, shown: intent, actual: intent, kind: 'intent' });
        oppChar.setPose(intent === 'bluff' ? POSE.STRONG : POSE.BLUFF, seat.id);
        oppChar.tell({
          line: tellLine({ genId: seat.genId, category: `${intent}Leak`, traits: seat.persona.traits }),
          note: `${INTENT_NOTES[intent]}${recordSuffix()}`,
          tone: 'intent', dur: 3.2, id: seat.id,
        });
        opts.onTellShown?.({ seatId: seat.id, gen: seat.genId, street, shown: intent, kind: 'intent' });
        return;
      }
    }
    const e = street === 0 ? PK.preflopStrength(seat.hole) : PK.postflopEquity(seat.hole, G.board).e;
    const actual = e > 0.66 ? 'strong' : e < 0.34 ? 'weak' : 'mid';
    let shown = actual;
    const lieChance = (G.keenEye ? seat.persona.lieChance * 0.35 : seat.persona.lieChance) * (rule.lieMult || 1);
    if (rule.lieAll && G.handNum <= rule.lieAll) shown = actual === 'weak' ? 'strong' : 'weak';
    else if (tiltOf(seat) < 2 && rng() < lieChance) shown = actual === 'strong' ? 'weak' : 'strong';
    seat.tell = { street, shown, actual, kind: 'equity' };
    if (shown !== 'mid') seat.tellLog.push({ street, shown, actual, kind: 'equity' });
    oppChar.setPose(shown === 'strong' ? POSE.STRONG : shown === 'weak' ? POSE.BLUFF : POSE.NEUTRAL, seat.id);
    if (shown === 'mid') return;
    // 台词层携带真伪的"语气"(真强笃定/装强用力,见 tell-lines.js),注解层
    // 只给可观察信息:动作文案 + 此人生平识破履历。判真伪是玩家的功课。
    oppChar.tell({
      line: tellLine({ genId: seat.genId, category: tellCategory(shown, actual), traits: seat.persona.traits }),
      note: `${tells[shown]}${recordSuffix()}`,
      dur: 3, id: seat.id,
    });
    opts.onTellShown?.({ seatId: seat.id, gen: seat.genId, street, shown });
  }
  function codexFromShowdown(seat, handName) {
    // 每手所有已示破绽逐条验真(按 shown+actual 去重):意图泄露会顶替当街
    // 牌力破绽,若只验最后一条,签名破绽可能整手不出现(图鉴断言曾因此翻车)。
    const seen = new Set();
    const entries = seat.tellLog.filter(entry => {
      const key = `${entry.kind}:${entry.shown}:${entry.actual}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    if (!entries.length) return;
    const tells = seat.gen?.tells || { strong: '右手护住筹码堆', weak: '左手抚上瓷面' };
    const who = opponents.length === 1 ? '他' : seat.name;
    const rows = entries.map(entry => {
      const isIntent = entry.kind === 'intent';
      const truth = entry.actual === 'strong' ? '强牌' : entry.actual === 'weak' ? '弱牌' : '中牌';
      const hit = entry.shown === entry.actual;
      return `「${isIntent ? INTENT_NOTES[entry.shown] : tells[entry.shown]}」 → ${isIntent ? '果然在演' : `${truth} ${hit ? '✓ 命中' : '✗ 是假动作'}`}`;
    });
    ui.codexAdd(`第${G.handNum}手 · ${who}亮出<b>${handName}</b><br>${rows.join('<br>')}`);
    // 摊牌验真高光以最后一条为准:命中/被骗是破绽系统的心跳,从战书小字升到台面。
    const last = entries[entries.length - 1];
    const lastHit = last.shown === last.actual;
    const lastIsIntent = last.kind === 'intent';
    const lastDesc = lastIsIntent ? INTENT_NOTES[last.shown] : tells[last.shown];
    const lastTruth = last.actual === 'strong' ? '强牌' : last.actual === 'weak' ? '弱牌' : '中牌';
    if (opponents.length === 1) {
      oppChar.tell({
        line: lastIsIntent ? '……被你看了去。' : lastHit ? '被你看穿了。' : '你上当了。',
        note: `${lastIsIntent ? '他方才在演' : `「${lastDesc}」→ ${lastTruth}`} · ${lastHit ? '你读对了' : '是假动作'}`,
        tone: lastHit ? 'verdict-hit' : 'verdict-lie', dur: 2.8, id: seat.id,
      });
    } else {
      ui.banner(lastHit ? `你读对了 · ${seat.name}` : `他骗了你 · ${seat.name}`, lastIsIntent ? '他方才在演' : `「${lastDesc}」→ ${lastTruth}`);
    }
    if (lastHit) audio.chime(); else audio.thud();
    for (const entry of entries) {
      opts.onTell?.({ ...entry, hit: entry.shown === entry.actual, seatId: seat.id, gen: seat.genId, name: seat.name });
    }
    // 履历入账后立绘角标即时刷新(识破X中Y / 诓N)
    if (seat.genId) oppChar.setTellRecord(opts.getTellRecord?.(seat.genId) || null, seat.id);
  }

  function say(seat, key, probability = 0.55) {
    if (Math.random() >= probability) return;
    const lines = LINES[key];
    oppChar.say(lines[Math.floor(Math.random() * lines.length)], 2.6, seat.id);
  }
  function clearActive() { for (const seat of opponents) oppChar.setActive(false, seat.id); }

  async function playerAct(seat, view) {
    clearActive();
    const presets = [];
    if (view.canRaise) {
      for (const f of [0.5, 1, 2]) {
        const extra = Math.max(view.minRaise, Math.round(view.pot * f / 5) * 5);
        const amount = Math.min(view.stack, view.toCall + extra);
        if (amount > view.toCall && !presets.some(p => p.amount === amount)) {
          const potTxt = t('battle.pot');
          presets.push({ label: f === 0.5 ? `½ ${potTxt}` : f === 1 ? `1 ${potTxt}` : `2 ${potTxt}`, amount });
        }
      }
    }
    const action = await ui.promptAction({ toCall: view.toCall, stack: view.stack, presets, canRaise: view.canRaise });
    if (action.type === 'raise') return { type: 'raise', amount: action.amount };
    return { type: action.type };
  }

  async function oppAct(seat, street, rng) {
    clearActive();
    oppChar.setActive(true, seat.id);
    oppChar.setPose(POSE.THINKING, seat.id);
    await wait(G.spectate ? 0.08 : 0.8 + Math.random() * 0.8);
    const view = T.actionView(G.H, seat.id);
    const personality = rule.cornered && seat.stack < seat.initialStack * 0.3
      ? { ...seat.ai, aggr: seat.ai.aggr * 1.4 } : seat.ai;
    const decision = PK.aiDecide({
      ...view, street, hole: seat.hole, board: G.board,
      personality, rng, villain: seat.read.view(),
      slowplayed: seat.slowplayed, bluffLine: seat.bluffLine,
      equityRuns: opponents.length > 1 ? 96 : undefined,
    });
    seat.slowplayed = !!decision.trapped;
    seat.bluffLine = (decision.type === 'bet' || decision.type === 'raise') && !!decision.bluff;
    if (decision.type === 'fold') say(seat, 'fold');
    if (decision.type === 'check') say(seat, 'check', 0.3);
    if (decision.type === 'call') say(seat, 'call', 0.35);
    if (decision.type === 'bet' || decision.type === 'raise') say(seat, view.toCall > 0 ? 'raise' : 'bet', 0.7);
    oppChar.setActive(false, seat.id);
    return decision;
  }

  async function performAction(seat, decision) {
    const view = T.actionView(G.H, seat.id);
    const result = T.applyAction(G.H, seat.id, decision);
    if (result.allin && result.amount > 0) {
      ui.banner(result.type === 'call' ? '全压跟注' : '全压', `${seat.isHero ? '你' : seat.name} 投入 ${result.amount} · 剩余筹码 0`);
    }
    if (seat.isHero) {
      const tracked = decision.type === 'allin' ? (view.stack <= view.toCall ? 'call' : 'raise') : decision.type;
      for (const opponent of opponents) opponent.read.track(view.toCall, tracked);
      if (result.folded && T.liveSeats(G.H.seats).length > 1) G.spectate = true;
    } else if (result.allin) {
      say(seat, 'allin', 0.7);
    }
    if (result.folded) {
      refreshFoldState(seat);
      await muckCards(seat);
      refreshOdds();
    }
    if (result.amount > 0) audio.chip();
    if (result.allin) await dramatic(true);
    refreshPiles();
    return result;
  }

  async function bettingRound(street, rng) {
    T.beginRound(G.H, street);
    while (!G.H.roundComplete) {
      const seat = G.H.seats.find(item => item.id === G.H.actor);
      const decision = seat.isHero ? await playerAct(seat, T.actionView(G.H, seat.id)) : await oppAct(seat, street, rng);
      await performAction(seat, decision);
      await wait(G.spectate ? 0.04 : 0.22);
    }
    await collectBets();
  }

  let dramaticOn = false;
  async function dramatic(on) {
    dramaticOn = on;
    ui.vignette(on);
    if (on) { audio.heartStart(); scene.classList.add('allin'); }
    else { audio.heartStop(); scene.classList.remove('allin'); }
  }

  async function dealStreet(street) {
    clearOdds();
    audio.card(); nextCard();
    const burnEl = document.createElement('div');
    burnEl.className = 'burnCard';
    cardLayer.appendChild(burnEl);
    place(burnEl, SLOTS.deck, true);
    await wait(0.02); place(burnEl, SLOTS.muck); burnEl.style.opacity = 0;
    setTimeout(() => burnEl.remove(), 460);
    const count = street === 1 ? 3 : 1;
    for (let i = 0; i < count; i++) {
      const id = nextCard();
      G.board.push(id);
      const boardIndex = G.board.length - 1;
      G.boardEls[boardIndex] = await dealCard(id, SLOTS.community(boardIndex), true);
      await wait(0.12);
    }
    ui.setHand(PK.madeName(hero.hole, G.board));
    refreshOdds();
  }

  function bumpMorale(seat, amount) {
    const before = seat.morale;
    seat.morale = Math.max(-3, Math.min(2, seat.morale + amount));
    oppChar.setTilt(tiltOf(seat), seat.id);
    oppChar.setTilted(tiltOf(seat) >= 2, seat.id);
    if (tiltOf(seat) >= 2) oppChar.say(BARK(seat, 'tilt', LINES.tauntTilt[0]), 2.6, seat.id);
    else if (amount <= -2 && seat.morale < before) oppChar.say(BARK(seat, 'badbeat', '……这一手,记下。'), 2.6, seat.id);
    else if (amount > 0 && seat.morale > 0) oppChar.say(BARK(seat, 'smug', '承让。'), 2.6, seat.id);
  }
  function updateMorale() {
    const bb = G.blinds[1];
    for (const seat of opponents) {
      const net = seat.stack - seat.handStartStack;
      if (net < 0) {
        seat.lossStreak++;
        if (net <= -Math.max(200, bb * 8)) bumpMorale(seat, -2);
        else if (net <= -bb * 4) bumpMorale(seat, -1);
        if (seat.lossStreak >= 3) { bumpMorale(seat, -1); seat.lossStreak = 0; }
      } else if (net > 0) {
        seat.lossStreak = 0;
        if (net >= bb * 8) bumpMorale(seat, 1);
      }
    }
  }

  async function awardPots(settled) {
    // 退款说明必须在筹码动画之前出现，避免后续结算横幅覆盖它。
    const refunds = settled.pots.filter(pot => pot.refund && pot.amount > 0);
    if (refunds.length) {
      const text = refunds.map(refund => {
        const seat = G.H.seats.find(item => item.id === refund.id);
        return `${seat?.isHero ? '你' : seat?.name || refund.id} +${refund.amount}`;
      }).join(' · ');
      ui.banner($('bannerMain').textContent, `${$('bannerSub').textContent} · 其中 ${text} 为未跟注退回`);
    }
    const winners = G.H.seats.filter(seat => settled.awards[seat.id] > 0);
    await Promise.all(winners.map(seat => flyChips(SLOTS.pot, seatSlot(seat, 'stack'), 'pot')));
    refreshPiles();
  }

  async function resolveFold() {
    const winner = T.liveSeats(G.H.seats)[0];
    const pot = T.potTotal(G.H.seats);
    const settled = T.settleHand(G.H);
    const potLbl = t('battle.pot');
    if (winner.isHero && opponents.length === 1) ui.banner(t('poker.actions.fold'), `${potLbl} ${pot}`);
    else if (hero.folded && opponents.length === 1) ui.banner(t('poker.actions.fold'), `${potLbl} ${pot}`);
    else ui.banner(`${winner.name}`, `${potLbl} ${pot}`);
    await awardPots(settled);
    updateMorale();
    await wait(0.5);
  }

  async function showdown() {
    const live = T.liveSeats(G.H.seats);
    for (const seat of live) {
      if (!seat.isHero) for (const id of seat.hole) G.meshByCard.get(id)?.classList.add('flipped');
    }
    audio.card();
    await wait(1.05); // 亮牌先看清,再盖章
    const evaluations = {}, scores = {};
    for (const seat of live) {
      evaluations[seat.id] = PK.evaluate7([...seat.hole, ...G.board]);
      scores[seat.id] = evaluations[seat.id].score;
      if (!seat.isHero) {
        codexFromShowdown(seat, evaluations[seat.id].name);
        oppChar.setShowdown(evaluations[seat.id].name, '', seat.id);
      }
    }
    await wait(0.5);
    const settled = T.settleHand(G.H, scores);
    const winners = [...new Set(settled.pots.flatMap(pot => pot.winners))];
    // 判印定谳:赢家鎏金,输家沉墨
    for (const seat of live) {
      if (!seat.isHero) oppChar.setShowdown(evaluations[seat.id].name, winners.includes(seat.id) ? 'win' : 'lose', seat.id);
    }
    for (const id of winners) {
      for (const card of evaluations[id]?.best5 || []) G.meshByCard.get(card)?.classList.add('hl');
    }
    if (opponents.length === 1) {
      const opponent = opponents[0];
      const cmp = live.some(seat => seat.isHero) && live.includes(opponent)
        ? PK.compareScore(scores.player, scores[opponent.id]) : 0;
      if (cmp > 0) ui.banner(evaluations.player.name, `你赢下底池 ${settled.awards.player}`);
      else if (cmp < 0) ui.banner(evaluations[opponent.id].name, `他赢下底池 ${settled.awards[opponent.id]}`);
      else ui.banner('平分底池', `同为${evaluations.player.name}`);
      if (cmp > 0) { audio.win(); say(opponent, 'lose'); }
      if (cmp < 0) say(opponent, 'win');
    } else {
      const summary = winners.map(id => {
        const seat = G.H.seats.find(item => item.id === id);
        const hand = evaluations[id]?.name;
        return `${seat.isHero ? '你' : seat.name}${hand ? `·${hand}` : ''} +${settled.awards[id]}`;
      }).join(' · ');
      ui.banner('群英摊牌', summary);
      if (settled.awards.player > 0) audio.win();
    }
    await awardPots(settled);
    updateMorale();
    await wait(1.8); // 判印与战报停足,筹码归位后牌才离桌
  }

  function showStoryBeat() {
    const story = opts.story;
    if (!story?.chapter) return false;
    const low = opponents.some(seat => seat.stack > 0 && seat.stack <= seat.initialStack * 0.55);
    const triggers = G.handNum === 1 ? ['start', 'hand:1', 'low'] : [`hand:${G.handNum}`, 'low'];
    for (const trigger of triggers) {
      if (trigger === 'low' && !low) continue;
      const ctx = { P: story.P, R: story.R, chapter: story.chapter, round: story.round, handNum: G.handNum, multi: opponents.length > 1 };
      const beat = battleBeatsFor(story.chapter, trigger, ctx).find(item => !story.R.storyBeats?.has(item.id));
      if (!beat) continue;
      story.R.storyBeats?.add(beat.id);
      ui.banner(speakerName(beat.speaker), beat.text);
      return true;
    }
    return false;
  }

  async function playHand() {
    clearOdds();
    G.handNum++;
    G.taunted = false; G.spectate = false;
    ui.enableTaunt(true);
    G.board = []; G.boardEls = [];
    ui.setHand('—');
    const level = Math.min(6, Math.floor((G.handNum - 1) / escalateEvery));
    const [SB, BB] = BL(level);
    G.blinds = [SB, BB];
    ui.setBlind(`小盲 ${SB} · 大盲 ${BB} · 第 ${G.handNum} 手${opponents.length > 1 ? ` · ${opponents.length + 1}人桌` : ''}`);
    if (level !== G.blindLv) {
      G.blindLv = level;
      ui.banner('盲注升级', `${SB} / ${BB}`);
      audio.chime(); await wait(1.1);
    }
    const rng = PK.mulberry32(PK.hashSeed(G.seed + '#' + G.handNum));
    G.deck = PK.shuffle(PK.makeDeck(), rng); G.deckPtr = 0; G.deckLog = [...G.deck];
    for (const seat of G.seats) {
      seat.hole = []; seat.slowplayed = false; seat.bluffLine = false; seat.tell = null; seat.tellLog = []; seat.tellIntentUsed = false;
    }
    for (const seat of opponents) oppChar.clearShowdown(seat.id);
    G.H = T.createHand(G.seats, { button: G.button, blinds: [SB, BB] });
    G.H.board = G.board;
    refreshSeatStates();
    refreshDealer();
    refreshPiles();
    const storyShown = showStoryBeat();
    if (G.handNum === 1 && opponents[0].gen?.barks?.open) oppChar.say(opponents[0].gen.barks.open, 3.2, opponents[0].id);
    if (rule.autumnWind && G.handNum === rule.autumnWind) {
      ui.banner('秋风起', '他等到了他要等的。');
      bumpMorale(opponents[0], 1);
      await wait(1.4);
    }
    if (!storyShown && !(G.handNum === 1 && opponents[0].gen?.barks?.open)) say(opponents[0], 'deal', 0.4);

    for (const seat of G.H.seats) {
      seat.hole = [nextCard(), nextCard()];
      await dealCard(seat.hole[0], seatSlot(seat, 'hole', 0), seat.isHero, seat.isHero, seat.id);
      await dealCard(seat.hole[1], seatSlot(seat, 'hole', 1), seat.isHero, seat.isHero, seat.id);
    }
    ui.setHand(PK.madeName(hero.hole, []));
    refreshOdds();
    for (const seat of opponents) if (!seat.folded) applyTell(seat, 0, rng);
    await bettingRound(0, rng);
    for (const street of [1, 2, 3]) {
      if (T.liveSeats(G.H.seats).length <= 1) break;
      await dealStreet(street);
      for (const seat of opponents) if (!seat.folded) applyTell(seat, street, rng);
      await bettingRound(street, rng);
    }
    await finishHand();
  }

  async function finishHand() {
    clearOdds();
    if (T.liveSeats(G.H.seats).length === 1) await resolveFold();
    else await showdown();
    await dramatic(false);
    await clearTable();
    for (const seat of G.H.seats) { seat.committed = 0; seat.bet = 0; }
    G.H = null;
    refreshPiles();
    for (const seat of opponents) if (seat.stack <= 0) oppChar.setEliminated(true, seat.id);
    if (hero.stack <= 0) { G.over = true; return endBattle(false); }
    if (opponents.every(seat => seat.stack <= 0)) { G.over = true; return endBattle(true); }
    G.button = T.nextButton(G.seats, G.button);
    await wait(1.1);
  }

  async function endBattle(win) {
    if (win) {
      clearActive();
      ui.banner(boss ? '关隘已破' : (opponents.length > 1 ? '群英尽数离席' : '他被清台了'), boss ? '这一页,等你改写' : '他掷杖离席');
      audio.win(); await wait(1.8);
    }
    cleanup();
    onEnd(win, hero.stack, {
      opponents: opponents.map(seat => ({ id: seat.id, gen: seat.genId, name: seat.name, stack: seat.stack, eliminated: seat.stack <= 0 })),
    });
  }

  const onSeatSelect = event => {
    const id = event.detail?.id;
    const seat = opponents.find(item => item.id === id && item.stack > 0);
    if (!seat) return;
    G.selected = seat.id;
    for (const other of opponents) oppChar.setSelected(other.id === seat.id, other.id);
  };
  $('oppChar').addEventListener('seatselect', onSeatSelect);
  const onPeek = event => { event.target.closest('.card.big')?.classList.toggle('peek'); };
  cardLayer.addEventListener('pointerdown', onPeek);

  function cleanup() {
    clearOdds();
    removeEventListener('odds-setting-change', onOddsSettingChange);
    removeEventListener('resize', relayout);
    $('oppChar').removeEventListener('seatselect', onSeatSelect);
    cardLayer.removeEventListener('pointerdown', onPeek);
    table.querySelectorAll('[data-dynamic-pile]').forEach(el => el.remove());
    for (const seat of opponents) { oppChar.setTilted(false, seat.id); oppChar.clearShowdown(seat.id); }
    ui.enableTaunt(false);
    ui.vignette(false);
    ui.setPlayerName?.();
    renderSeatRoles($('playerRoles'), []);
    $('youPlate').classList.remove('is-folded');
    $('playerFoldStatus').classList.add('hidden');
    ui.setTauntLabel?.();
    if (dramaticOn) audio.heartStop();
  }

  ui.onTaunt(() => {
    if (G.taunted || G.over || !G.H) return;
    let seat = opponents.find(item => item.id === G.selected && item.stack > 0 && !item.folded)
      || opponents.find(item => item.stack > 0 && !item.folded);
    if (!seat) return;
    G.taunted = true;
    ui.enableTaunt(false);
    if (opts.zhiZi) {
      const actual = seat.tell?.actual;
      const text = actual ? `观星 · 其势实为${actual === 'strong' ? '强' : actual === 'weak' ? '弱' : '中'}` : '观星 · 星象未明';
      if (opponents.length === 1) oppChar.say(text, 3, seat.id);
      else ui.banner(`观星 · ${seat.name}`, text);
      audio.chime(); return;
    }
    if (rule.tauntImmune || seat.persona.tauntMult === 0) {
      oppChar.say(BARK(seat, 'taunt', '(他不动声色,仿佛没听见。)'), 2.6, seat.id);
      audio.thud(); return;
    }
    seat.morale = Math.max(-3, seat.morale - seat.persona.tauntMult);
    oppChar.setTilt(tiltOf(seat), seat.id);
    oppChar.setTilted(tiltOf(seat) >= 2, seat.id);
    oppChar.say(tiltOf(seat) >= 2 ? BARK(seat, 'tilt', LINES.tauntTilt[0]) : BARK(seat, 'taunt', LINES.taunt[0]), 2.6, seat.id);
    audio.thud();
  });
  ui.onVerify(() => {
    const html = G.deckLog.length
      ? G.deckLog.map(id => `<span class="${PK.SUIT_RED[PK.suitOf(id)] ? 'red' : 'blk'}">${PK.cardName(id)}</span>`).join(' ')
      : '第一手尚未发出。';
    ui.showSeedModal('#' + G.seed + ' · 第' + Math.max(1, G.handNum) + '手', html);
  });

  $('playerCardsHint').classList.remove('hidden');
  (async () => { while (!G.over) await playHand(); })();
}
