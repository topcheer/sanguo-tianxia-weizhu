// golden-vectors.mjs —— 引擎黄金向量:用原版 JS 引擎生成确定性基准,Swift 端逐一对照。
// 运行:node native/bridge/golden-vectors.mjs
// 输出:native/Tests/GoldenVectors/*.json
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const outDir = join(root, 'native', 'Tests', 'GoldenVectors');
mkdirSync(outDir, { recursive: true });

import * as PK from '../../src/poker.js';
import * as T from '../../src/table.js';
import { makePersona, describeTraits, estimateDifficulty } from '../../src/persona.js';
import { analyzeOdds } from '../../src/odds.js';
import { matchesWhen, linesFor, coldOpenFor, introFor, outcomeFor, battleBeatsFor, normalizeStoryState, createStoryState } from '../../src/story-engine.js';
import { chapterEncounters, rosterOf, roundConfig } from '../../src/encounters.js';
import { STORY_DATA } from '../../src/story-data/index.js';
import { CHAPTERS } from '../../src/chapters.js';
import { getGeneral } from '../../src/generals.js';

const dump = (name, data) => {
  writeFileSync(join(outDir, name), JSON.stringify(data, null, 1));
  console.log(`${name} ok`);
};
const F = x => x; // JSON 序列化保持 double 精度

// ---------- 1. RNG 与牌评估 ----------
{
  const seeds = [0, 1, 42, 12345, 0xFFFFFFFF, PK.hashSeed('ABC123'), PK.hashSeed('桃园#结义'), PK.hashSeed('equity-v1|17,21|0,1|2')];
  const rngStreams = seeds.map(s => ({ seed: s, out: Array.from({ length: 12 }, (_, i) => { const r = PK.mulberry32(s); for (let k = 0; k < i; k++) r(); return r(); }) }));
  const cases = [
    [0, 4, 8, 12, 16, 20, 24],   // 同花 A 高
    [48, 49, 50, 51, 0],          // 四条 A + 单张
    [0, 1, 4, 5, 8],              // 葫芦 AAAKK? (rank0 对? 检查)
    [12, 11, 10, 9, 8, 0, 4],     // A K Q J 10 同花? suitOf(12..8)=0 → 同花顺
    [12, 8, 4, 0, 3],             // A 5 4 3 2 同花 → 钢轮直flush?
    [12, 8, 4, 0, 1],             // A2345 杂色轮子顺
    [0, 2, 4, 6, 8, 10, 12],      // 全同花♠ A K Q J 10 9... rank0,2,4..
    [1, 5, 9, 13, 17],            // ♥ 同花
    [0, 1, 2, 3, 20, 24, 28],     // 对子 A + 杂
    [0, 1, 16, 17, 32, 33, 48],   // 两对 AA KK + Q
    [8, 9, 10, 44, 45, 46, 12],   // 三条+对(葫芦?) rank2x3 + rank11x3
    [4, 5, 6, 36, 40, 48, 52 - 1],// 杂项
    [51, 50, 49, 48, 47, 46, 45], // ♣A ♦K ...
  ];
  const evals = cases.map(ids => { const r = PK.evaluate7(ids); return { ids, score: r.score, cat: r.cat, name: r.name, best5: r.best5 }; });
  const comparePairs = [
    [[8, 12], [8, 11]], [[5, 4, 3], [5, 4, 2]], [[0], [0]], [[2, 9, 9], [2, 9, 8]],
  ].map(([a, b]) => ({ a, b, cmp: PK.compareScore(a, b) }));
  dump('poker-rng.json', {
    hashSeed: [['ABC123', PK.hashSeed('ABC123')], ['A1B2C3#taoyuan#m0', PK.hashSeed('A1B2C3#taoyuan#m0')], ['', PK.hashSeed('')], ['中文种子', PK.hashSeed('中文种子')], ['♠♥', PK.hashSeed('♠♥')], ['3F2A1B#taoyuan#m0#r1', PK.hashSeed('3F2A1B#taoyuan#m0#r1')]],
    streams: rngStreams,
    evals, comparePairs,
    cardNames: [0, 12, 13, 25, 51].map(id => ({ id, name: PK.cardName(id) })),
    madeName: [
      { hole: [0, 2], board: [] }, { hole: [0, 1], board: [] },
      { hole: [0, 2], board: [4, 8, 12] }, { hole: [0, 2], board: [4, 8, 12, 16] },
    ].map(x => ({ ...x, name: PK.madeName(x.hole, x.board) })),
    preflopStrength: [[0, 1], [12, 11], [12, 8], [0, 4], [5, 6], [48, 49]].map(h => ({ hole: h, s: PK.preflopStrength(h) })),
    preflopEquity: [[0, 1], [12, 11], [12, 8], [3, 2], [9, 8]].map(h => ({ hole: h, e: PK.preflopEquity(h) })),
    postflop: [
      { hole: [12, 11], board: [10, 9, 8] },                      // 同花听/顺
      { hole: [0, 4], board: [8, 12, 16] },                       // 同花听牌
      { hole: [12, 0], board: [1, 2, 3] },                        // 轮子双头听
      { hole: [0, 2], board: [4, 8, 12, 16] },                    // 已成对
      { hole: [48, 49], board: [50, 51, 20, 24] },                // 后同花听
    ].map(x => { const r = PK.postflopEquity(x.hole, x.board); return { ...x, e: r.e, made: r.made.name, flushDraw: r.flushDraw, oesd: r.oesd }; }),
    estimateEquity: [
      { hole: [12, 11], board: [], opponents: 1, runs: 200 },
      { hole: [0, 2], board: [4, 8, 12], opponents: 1, runs: 200 },
      { hole: [48, 49], board: [50, 51, 20], opponents: 3, runs: 150 },
      { hole: [12, 8], board: [10, 9, 2, 3], opponents: 2, runs: 150 },
    ].map(x => { const r = PK.estimateEquity(x.hole, x.board, { opponents: x.opponents, runs: x.runs, rng: PK.mulberry32(PK.hashSeed('gv|' + x.hole.join(',') + '|' + x.board.join(',') + '|' + x.opponents)) }); return { ...x, result: r }; }),
    readTrack: (() => { const rd = PK.createRead(); const seq = [[0, 'bet'], [20, 'call'], [20, 'fold'], [0, 'check'], [30, 'raise'], [30, 'call'], [30, 'fold']]; seq.forEach(([tc, ty]) => rd.track(tc, ty)); return { seq, view: rd.view() }; })(),
  });
}

// ---------- 2. AI 决策向量 ----------
{
  const mk = (traits) => makePersona(traits).ai;
  const scenarios = [];
  let autoSeed = 0
  const push = (name, o) => {
    const seed = ++autoSeed;
    const { rng: _drop, ...input } = o;
    const scenario = { name, input: { ...input, seed }, out: PK.aiDecide({ ...o, rng: PK.mulberry32(seed) }) };
    scenarios.push(scenario);
  };
  const base = { street: 1, hole: [12, 11], board: [10, 9, 8], toCall: 0, pot: 100, stack: 1000, minRaise: 20, raisesLeft: 3, rng: null, personality: undefined };
  // 无压力:价值下注 / 埋伏 / 诈唬 / 过牌
  push('bet-strong-default', { ...base, rng: PK.mulberry32(1) });
  push('bet-strong-pairAI', { ...base, rng: PK.mulberry32(2) });
  push('trap-nai', { ...base, rng: PK.mulberry32(3), personality: mk({ 耐性: 95, 智谋: 80 }) });
  push('bluff-zha', { ...base, rng: PK.mulberry32(4), hole: [2, 6], personality: mk({ 诈术: 95, 智谋: 60 }), street: 1 });
  push('planBluff-line', { ...base, rng: PK.mulberry32(5), hole: [3, 7], personality: { ...PK.AI_DEFAULTS, plan: 0.9, valueMin: 0.9 }, bluffLine: true, board: [22, 26, 30] });
  push('check-air', { ...base, rng: PK.mulberry32(6), hole: [2, 3], board: [40, 44, 48] });
  // 有压力:跟/加/弃
  push('call-odds', { ...base, toCall: 30, rng: PK.mulberry32(7) });
  push('raise-value', { ...base, toCall: 30, rng: PK.mulberry32(8), hole: [48, 49], board: [50, 51, 20] });
  push('fold-weak', { ...base, toCall: 200, rng: PK.mulberry32(9), hole: [2, 6], board: [12, 24, 36] });
  push('bluff-raise-zha', { ...base, toCall: 40, rng: PK.mulberry32(10), hole: [5, 13], personality: mk({ 诈术: 90 }) });
  push('trap-call-monster', { ...base, toCall: 50, rng: PK.mulberry32(11), hole: [0, 1], personality: mk({ 耐性: 90, 智谋: 70 }), board: [12, 11, 10] });
  push('sprung-slowplay', { ...base, toCall: 50, rng: PK.mulberry32(12), hole: [0, 1], slowplayed: true, board: [12, 11, 10] });
  push('courage-fold-edge', { ...base, toCall: 120, rng: PK.mulberry32(13), hole: [6, 14], board: [12, 11, 10], personality: mk({ 胆识: 10 }) });
  push('preflop-hu-call20', { street: 0, hole: [12, 8], board: [], toCall: 20, pot: 30, stack: 980, minRaise: 20, raisesLeft: 3, rng: PK.mulberry32(14) });
  push('preflop-hu-raise', { street: 0, hole: [0, 1], board: [], toCall: 20, pot: 30, stack: 980, minRaise: 20, raisesLeft: 3, rng: PK.mulberry32(15), personality: mk({ 武勇: 90 }) });
  push('multiway-3opp', { ...base, opponents: 3, rng: PK.mulberry32(16) });
  push('tilt-rage-aggro', { ...base, rng: PK.mulberry32(17), personality: { ...PK.AI_DEFAULTS, tilt: 3, morale: -3, moraleSens: 1, moraleStyle: 'rage' }, hole: [4, 5] });
  push('morale-sulk', { ...base, toCall: 60, rng: PK.mulberry32(18), personality: { ...PK.AI_DEFAULTS, morale: -2, moraleSens: 1, moraleStyle: 'sulk' } });
  push('read-exploit-folder', { ...base, toCall: 30, rng: PK.mulberry32(19), personality: mk({ 智谋: 90 }), villain: { hands: 5, foldToBet: 0.8, callRate: 0.15, aggro: 0.2 } });
  push('read-vs-callingstation', { ...base, toCall: 30, rng: PK.mulberry32(20), personality: mk({ 智谋: 85 }), villain: { hands: 6, foldToBet: 0.1, callRate: 0.8, aggro: 0.5 } });
  push('scary-board', { ...base, rng: PK.mulberry32(21), hole: [2, 6], board: [0, 4, 8], personality: mk({ 智谋: 70, 诈术: 70 }) });
  push('shortstack-allinable', { ...base, toCall: 250, pot: 400, stack: 260, minRaise: 20, rng: PK.mulberry32(22) });
  dump('ai-decisions.json', scenarios);
}

// ---------- 3. 牌桌规则向量(合成场景) ----------
{
  const synth = [];
  const run = (name, seatsSpec, scores) => {
    const seats = seatsSpec.map(s => ({ id: s.id, stack: 0, bet: 0, committed: s.committed, folded: s.folded, hole: [] }));
    const { pots, refunds } = T.buildPots(seats);
    // settleHand 需要真实 Hand 结构;手工构造
    const H = { seats, button: 0, blinds: [10, 20], currentBet: 0, minRaise: 20, raisesLeft: 3, pending: [], actor: null, roundComplete: true, street: 3, sb: 0, bb: 1 };
    const settled = T.settleHand(H, scores || {});
    synth.push({ name, spec: seatsSpec, scores: scores || null, pots, refunds, awards: settled.awards, results: settled.pots, before: settled.before, after: settled.after });
  };
  run('hu-split-pot', [
    { id: 'a', committed: 100, folded: false }, { id: 'b', committed: 100, folded: false },
  ], { a: [2, 9], b: [2, 9] });
  run('three-way-odd-chip', [
    { id: 'a', committed: 100, folded: false }, { id: 'b', committed: 100, folded: false }, { id: 'c', committed: 100, folded: false },
  ], { a: [5], b: [5], c: [5] });
  run('side-pots-unequal', [
    { id: 'short', committed: 100, folded: false }, { id: 'mid', committed: 300, folded: true }, { id: 'big', committed: 400, folded: false },
  ], { short: [7, 12], big: [3] });
  run('refund-uncalled', [
    { id: 'a', committed: 500, folded: false }, { id: 'b', committed: 200, folded: true },
  ], null);
  run('all-fold-one-left', [
    { id: 'a', committed: 60, folded: true }, { id: 'b', committed: 20, folded: false }, { id: 'c', committed: 0, folded: true },
  ], null);
  run('two-side-pots-live', [
    { id: 'a', committed: 150, folded: false }, { id: 'b', committed: 150, folded: false }, { id: 'c', committed: 80, folded: true }, { id: 'd', committed: 40, folded: true },
  ], { a: [4, 9], b: [4, 8] });

  // applyAction 错误分支
  const errs = [];
  const mkH = () => {
    const seats = [
      { id: 'a', stack: 1000, bet: 0, committed: 0, folded: false, hole: [] },
      { id: 'b', stack: 1000, bet: 0, committed: 0, folded: false, hole: [] },
    ];
    return T.createHand(seats, { button: 0, blinds: [10, 20] });
  };
  const tryErr = (name, fn) => { try { fn(); errs.push({ name, error: null }); } catch (e) { errs.push({ name, error: e.message }); } };
  {
    const H = mkH();
    tryErr('fold-no-toCall', () => T.applyAction(H, H.actor, { type: 'fold' })); // actor 是 sb,有 toCall → fold 合法? sb toCall>0 → 合法
  }
  {
    const H = mkH();
    // 让 currentBet 清零的街开始后过牌场景
    T.beginRound(H, 1);
    tryErr('check-when-toCall? street1 first actor', () => T.applyAction(H, H.actor, { type: 'check' }));
    tryErr('wrong-actor', () => T.applyAction(H, H.seats.find(s => s.id !== H.actor).id, { type: 'check' }));
    tryErr('raise-below-min', () => T.applyAction(H, H.actor, { type: 'raise', amount: H.currentBet + 5 }));
    tryErr('raise-over-stack', () => T.applyAction(H, H.actor, { type: 'raise', amount: 99999 }));
  }
  dump('table-rules.json', { synth, errs });
}

// ---------- 4. 整局复放(AI 对 AI,全种子) ----------
{
  const TRAITS_SETS = [
    null, // 默认人格
    { 武勇: 92, 智谋: 78, 诈术: 30, 胆识: 95, 耐性: 40, 心性: 70 },  // 关羽型
    { 武勇: 96, 智谋: 40, 诈术: 20, 胆识: 90, 耐性: 20, 心性: 25 },  // 张飞型
    { 武勇: 40, 智谋: 96, 诈术: 80, 胆识: 55, 耐性: 85, 心性: 80 },  // 诸葛型
    { 武勇: 60, 智谋: 90, 诈术: 90, 胆识: 70, 耐性: 95, 心性: 90 },  // 司马型
  ];
  const BL = (blinds0, level) => {
    const m = Math.pow(1.5, level);
    return [Math.round(blinds0[0] * m / 5) * 5, Math.round(blinds0[1] * m / 5) * 5];
  };
  const replay = ({ tag, stacks, traitsIdx, seed, hands, blinds0 = [10, 20], escalateEvery = 4, rule = {} }) => {
    const seats = stacks.map((stack, i) => ({
      id: i === 0 ? 'player' : (i === 1 ? 'opponent' : `opponent-${i + 1}`),
      isHero: i === 0, name: `S${i}`, stack, initialStack: stack, hole: [],
      persona: makePersona(TRAITS_SETS[traitsIdx[i]] || {}),
      morale: 0, lossStreak: 0, slowplayed: false, bluffLine: false, read: PK.createRead(),
    }));
    for (const seat of seats) seat.ai = { ...seat.persona.ai, tilt: 0, morale: 0 };
    const tiltOf = seat => Math.max(0, Math.min(3, -seat.morale));
    const bump = (seat, amount) => { seat.morale = Math.max(-3, Math.min(2, seat.morale + amount)); };
    let button = 0, handNum = 0;
    const log = [];
    while (handNum < hands) {
      handNum++;
      const level = Math.min(6, Math.floor((handNum - 1) / escalateEvery));
      const [SB, BB] = BL(blinds0, level);
      const rng = PK.mulberry32(PK.hashSeed(seed + '#' + handNum));
      const deck = PK.shuffle(PK.makeDeck(), rng); let ptr = 0;
      const next = () => deck[ptr++];
      for (const seat of seats) { seat.hole = []; seat.slowplayed = false; seat.bluffLine = false; }
      const H = T.createHand(seats, { button, blinds: [SB, BB] });
      H.board = [];
      for (const seat of H.seats) seat.hole = [next(), next()];
      const trace = [{ h: `#${handNum}`, blinds: [SB, BB], button: H.button, hole: Object.fromEntries(H.seats.map(s => [s.id, s.hole])), level }];
      const act = (seat, street) => {
        const view = T.actionView(H, seat.id);
        const personality = rule.cornered && seat.stack < seat.initialStack * 0.3
          ? { ...seat.ai, aggr: seat.ai.aggr * 1.4 } : seat.ai;
        const decision = PK.aiDecide({
          ...view, street, hole: seat.hole, board: H.board,
          personality: { ...personality, tilt: tiltOf(seat), morale: seat.morale },
          rng, villain: seat.read.view(),
          slowplayed: seat.slowplayed, bluffLine: seat.bluffLine,
          equityRuns: seats.length > 2 ? 96 : undefined,
        });
        seat.slowplayed = !!decision.trapped;
        seat.bluffLine = (decision.type === 'bet' || decision.type === 'raise') && !!decision.bluff;
        const result = T.applyAction(H, seat.id, decision);
        // read 仅跟踪主位(原版 hero)动作
        if (seat.isHero) {
          const tracked = decision.type === 'allin' ? (view.stack <= view.toCall ? 'call' : 'raise') : decision.type;
          for (const other of seats) if (!other.isHero) other.read.track(view.toCall, tracked);
        }
        trace.push({ s: seat.id, st: street, d: decision, r: { type: result.type, amount: result.amount, allin: result.allin, folded: result.folded } });
        return result;
      };
      const round = street => {
        T.beginRound(H, street);
        while (!H.roundComplete) {
          const seat = H.seats.find(item => item.id === H.actor);
          act(seat, street);
        }
        T.closeRound(H);
      };
      round(0);
      for (const street of [1, 2, 3]) {
        if (T.liveSeats(H.seats).length <= 1) break;
        next(); // burn
        const count = street === 1 ? 3 : 1;
        for (let i = 0; i < count; i++) H.board.push(next());
        trace.push({ board: [...H.board] });
        round(street);
      }
      let settled;
      const live = T.liveSeats(H.seats);
      if (live.length === 1) settled = T.settleHand(H);
      else {
        const scores = {};
        for (const seat of live) scores[seat.id] = PK.evaluate7([...seat.hole, ...H.board]).score;
        settled = T.settleHand(H, scores);
        trace.push({ scores });
      }
      trace.push({ settle: { awards: settled.awards, pots: settled.pots, before: settled.before, after: settled.after } });
      // 士气
      const bb = BB;
      const moraleLog = [];
      for (const seat of seats) {
        if (seat.stack <= 0) continue;
        const net = seat.stack - seat.handStartStack;
        const before = seat.morale;
        if (net < 0) {
          seat.lossStreak++;
          if (net <= -Math.max(200, bb * 8)) bump(seat, -2);
          else if (net <= -bb * 4) bump(seat, -1);
          if (seat.lossStreak >= 3) { bump(seat, -1); seat.lossStreak = 0; }
        } else if (net > 0) {
          seat.lossStreak = 0;
          if (net >= bb * 8) bump(seat, 1);
        }
        if (seat.morale !== before) moraleLog.push({ s: seat.id, from: before, to: seat.morale });
      }
      if (moraleLog.length) trace.push({ morale: moraleLog });
      log.push(trace);
      if (seats.some(s => s.stack <= 0)) {
        // 清台即终局(与原版一致);记录谁出局
        trace.push({ eliminated: seats.filter(s => s.stack <= 0).map(s => s.id) });
        break;
      }
      button = T.nextButton(seats, button);
    }
    return { tag, seed, stacks, config: { blinds0, escalateEvery, rule, traitsIdx, traitSets: TRAITS_SETS.map(t => t || {}) }, finalStacks: seats.map(s => s.id + ':' + s.stack), hands: log };
  };
  const replays = [
    replay({ tag: 'hu-default', stacks: [1000, 1000], traitsIdx: [0, 0], seed: 'GVHU42', hands: 6 }),
    replay({ tag: 'hu-personas', stacks: [1000, 1000], traitsIdx: [1, 4], seed: 'GVHU7', hands: 6 }),
    replay({ tag: '3way', stacks: [1000, 1000, 1000], traitsIdx: [0, 1, 2], seed: 'GV3W7', hands: 4 }),
    replay({ tag: '4way-uneven', stacks: [1000, 300, 700, 1500], traitsIdx: [1, 2, 3, 4], seed: 'GV4U9', hands: 5 }),
    replay({ tag: 'cornered-rule', stacks: [1000, 1000], traitsIdx: [1, 1], seed: 'GVCN1', hands: 6, rule: { cornered: true } }),
  ];
  dump('replays.json', replays);
}

// ---------- 5. 局势分析向量 ----------
{
  dump('odds.json', [
    { hole: [12, 11], board: [], opponents: 1 },
    { hole: [0, 2], board: [4, 8, 12], opponents: 1 },
    { hole: [48, 49], board: [50, 51, 20], opponents: 3 },
    { hole: [12, 8], board: [10, 9, 2, 3], opponents: 2 },
    { hole: [5, 6], board: [9, 13, 17, 21], opponents: 1 },
    { hole: [0, 3], board: [7, 11, 15], opponents: 2 },
  ].map(x => ({ ...x, result: analyzeOdds(x.hole, x.board, { opponents: x.opponents }) })));
}

// ---------- 6. 人格向量 ----------
{
  const sets = [{}, { 武勇: 92, 智谋: 78, 诈术: 30, 胆识: 95, 耐性: 40, 心性: 70 }, { 武勇: 40, 智谋: 96, 诈术: 80, 胆识: 55, 耐性: 85, 心性: 80 }, { 武勇: 60, 智谋: 20, 诈术: 10, 胆识: 15, 耐性: 10, 心性: 10 }, { 心性: 90 }, { 心性: 10 }, { 武勇: 50, 智谋: 50, 诈术: 50, 胆识: 50, 耐性: 50, 心性: 50 }];
  dump('persona.json', {
    personas: sets.map(t => makePersona(t)),
    describe: sets.slice(0, 3).map(t => describeTraits(t)),
    difficulty: sets.map(t => estimateDifficulty(t)),
  });
}

// ---------- 7. 剧本引擎向量 ----------
{
  const chapter = id => CHAPTERS.find(c => c.id === id);
  const P = {
    pages: { taoyuan: 'yeshi', baimenlou: 'history' },
    story: { choices: { 'taoyuan.choice1': 'spare', baimenlou: 'kill' }, clues: { jieqiao: true }, facts: { factA: true } },
    annals: { lvbu: { seen: 2 } },
  };
  const ctxBase = { P, chapter: chapter('taoyuan'), round: 1, handNum: 1, multi: false };
  const cases = [
    { when: null }, { when: 'page:taoyuan:yeshi' }, { when: 'page:taoyuan:history' },
    { when: 'page:taoyuan:yeshi' }, { when: '!page:taoyuan:yeshi' },
    { when: 'choice:baimenlou:kill' }, { when: 'clue:jieqiao' }, { when: 'fact:factA' },
    { when: 'seen:lvbu' }, { when: 'round:1' }, { when: 'hand:2' }, { when: 'multi' },
    { when: 'single' }, { when: 'asZhuge' }, { when: 'omen:supply' },
    { when: ['single', 'round:1', '!fact:factA'] }, { when: 'page:baimenlou:yeshi' },
  ];
  const matchResults = cases.map(c => ({ when: c.when, ok: matchesWhen(c.when, ctxBase) }));
  const storyIds = ['taoyuan', 'baimenlou', 'huarong', 'maicheng', 'wuzhangyuan', 'chibi'];
  const storyOut = {};
  for (const id of storyIds) {
    const ch = chapter(id); if (!ch) continue;
    storyOut[id] = {
      coldOpen: coldOpenFor(ch, ctxBase),
      coldOpenAlt: coldOpenFor(ch, { ...ctxBase, P: { ...P, pages: { ...P.pages, [id]: 'yeshi' } } }),
      introFirst: (() => { const boss = rosterOf(ch.boss || ch.skirmish || {})[0] || {}; return introFor(ch, boss, ctxBase); })(),
      outcomeWin: outcomeFor(ch, true, ctxBase),
      outcomeLoss: outcomeFor(ch, false, ctxBase),
      battleBeats: battleBeatsFor(ch, 'hand:1', ctxBase),
    };
  }
  const enc = {};
  for (const id of ['qianli', 'sangu', 'huainan', 'qiqin', 'chibi', 'taoyuan']) {
    const ch = chapter(id); if (!ch) continue;
    enc[id] = chapterEncounters(ch).map(e => ({ kind: e.kind, round: e.round, cfg: { name: e.cfg.name, gen: e.cfg.gen, stack: e.cfg.stack, blinds: e.cfg.blinds, escalate: e.cfg.escalate } }));
  }
  dump('story-engine.json', { matchResults, stories: storyOut, encounters: enc });
}

console.log('DONE golden-vectors');
