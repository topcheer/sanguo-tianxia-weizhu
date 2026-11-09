// poker.js —— 牌堆、洗牌(种子可验)、牌型评估、单挑 AI
// 牌的表示:id = rank * 4 + suit。rank 0..12 即 2..A;suit 0♠ 1♥ 2♦ 3♣
import { PREFLOP_EQUITY } from './preflop.js';
import { t } from './i18n.js';

export const SUITS = ['♠', '♥', '♦', '♣'];
export const SUIT_RED = [false, true, true, false];
export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
export const HAND_NAMES = ['高牌', '一对', '两对', '三条', '顺子', '同花', '葫芦', '四条', '同花顺'];
export const HAND_KEYS = [
  'highCard',
  'pair',
  'twoPair',
  'threeOfAKind',
  'straight',
  'flush',
  'fullHouse',
  'fourOfAKind',
  'straightFlush',
];

export function getHandName(cat) {
  const key = HAND_KEYS[cat];
  if (!key) return HAND_NAMES[cat] || '';
  return t(`poker.hands.${key}`) || HAND_NAMES[cat];
}

export function hashSeed(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeDeck() {
  const d = [];
  for (let r = 0; r < 13; r++) for (let s = 0; s < 4; s++) d.push(r * 4 + s);
  return d;
}

export function shuffle(deck, rng) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export const rankOf = id => (id >> 2);
export const suitOf = id => (id & 3);
export const cardName = id => RANKS[rankOf(id)] + SUITS[suitOf(id)];

// ---------- 5 张牌评估,返回可比分的数组 ----------
function evaluate5(ids) {
  const rs = ids.map(rankOf).sort((a, b) => b - a);
  const ss = ids.map(suitOf);
  const flush = ss.every(s => s === ss[0]);

  const uniq = [...new Set(rs)];
  let straightHigh = -1;
  if (uniq.length === 5) {
    if (uniq[0] - uniq[4] === 4) straightHigh = uniq[0];
    else if (uniq[0] === 12 && uniq[1] === 3) straightHigh = 3; // A-5 轮子
  }

  const cnt = new Map();
  for (const r of rs) cnt.set(r, (cnt.get(r) || 0) + 1);
  // 按(数量, 点数)降序
  const groups = [...cnt.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);

  if (flush && straightHigh >= 0) return [8, straightHigh];
  if (groups[0][1] === 4) return [7, groups[0][0], groups[1][0]];
  if (groups[0][1] === 3 && groups[1][1] === 2) return [6, groups[0][0], groups[1][0]];
  if (flush) return [5, ...rs];
  if (straightHigh >= 0) return [4, straightHigh];
  if (groups[0][1] === 3) return [3, groups[0][0], groups[1][0], groups[2][0]];
  if (groups[0][1] === 2 && groups[1][1] === 2) return [2, groups[0][0], groups[1][0], groups[2][0]];
  if (groups[0][1] === 2) return [1, groups[0][0], groups[1][0], groups[2][0], groups[3][0]];
  return [0, ...rs];
}

export function compareScore(a, b) {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const d = (a[i] ?? -1) - (b[i] ?? -1);
    if (d !== 0) return d;
  }
  return 0;
}

// 7 选 5 枚举,返回 { score, cat, name, best5 }
export function evaluate7(ids) {
  let best = null;
  const n = ids.length;
  for (let a = 0; a < n - 4; a++)
    for (let b = a + 1; b < n - 3; b++)
      for (let c = b + 1; c < n - 2; c++)
        for (let d = c + 1; d < n - 1; d++)
          for (let e = d + 1; e < n; e++) {
            const hand = [ids[a], ids[b], ids[c], ids[d], ids[e]];
            const score = evaluate5(hand);
            if (!best || compareScore(score, best.score) > 0) best = { score, best5: hand };
          }
  best.cat = best.score[0];
  best.name = getHandName(best.cat);
  return best;
}

// 少于 5 张时的粗略牌型名(翻牌前用)
export function madeName(hole, board) {
  const ids = [...hole, ...board];
  if (ids.length >= 5) return evaluate7(ids).name;
  const cnt = new Map();
  for (const id of ids) cnt.set(rankOf(id), (cnt.get(rankOf(id)) || 0) + 1);
  const mx = Math.max(...cnt.values());
  if (mx >= 3) return getHandName(3);
  if (mx === 2) return getHandName(1);
  return getHandName(0);
}

// ---------- 起手牌强度 0..1 ----------
export function preflopStrength(hole) {
  const [a, b] = hole;
  const r1 = Math.max(rankOf(a), rankOf(b)), r2 = Math.min(rankOf(a), rankOf(b));
  const suited = suitOf(a) === suitOf(b);
  if (r1 === r2) return Math.min(1, 0.55 + r1 * 0.038); // 对子
  let s = (r1 * 2 + r2) / 36; // 高牌权重
  if (suited) s += 0.09;
  const gap = r1 - r2;
  if (gap === 1) s += 0.06; else if (gap === 2) s += 0.03; else if (gap >= 4) s -= 0.05;
  return Math.max(0.02, Math.min(1, s));
}

// 翻牌前决策使用离线生成的 169 类真实胜率;旧 preflopStrength 仅用于破绽分级。
export function preflopEquity(hole) {
  if (!Array.isArray(hole) || hole.length !== 2 || new Set(hole).size !== 2
    || hole.some(id => !Number.isInteger(id) || id < 0 || id >= 52)) {
    throw new Error('手牌必须为两张不同的合法牌');
  }
  const [a, b] = hole;
  const hi = Math.max(rankOf(a), rankOf(b)), lo = Math.min(rankOf(a), rankOf(b));
  const key = hi === lo ? `${hi},${hi}` : `${hi},${lo}${suitOf(a) === suitOf(b) ? 's' : 'o'}`;
  const e = PREFLOP_EQUITY[key];
  if (e === undefined) throw new Error(`未登记的起手牌类型:${key}`);
  return e;
}

// ---------- 翻牌后强度估计:成牌 + 听牌 ----------
const MADE_EQUITY = [0.16, 0.40, 0.55, 0.66, 0.75, 0.83, 0.90, 0.95, 0.99];

export function postflopEquity(hole, board) {
  const ids = [...hole, ...board];
  const made = evaluate7(ids);
  let e = MADE_EQUITY[made.cat];

  // 同花听牌
  const suitCnt = [0, 0, 0, 0];
  for (const id of ids) suitCnt[suitOf(id)]++;
  const flushDraw = suitCnt.some(c => c === 4);

  // 顺子听牌(粗算:看 rank 集合里 5 张窗口缺 1 张的数量)
  const set = new Set(ids.map(rankOf));
  if (set.has(12)) set.add(-1); // A 可当 1
  let oesd = false, gutshot = false;
  for (let lo = -1; lo <= 8; lo++) {
    let have = 0;
    for (let k = 0; k < 5; k++) if (set.has(lo + k)) have++;
    if (have === 4) {
      if (set.has(lo) && set.has(lo + 4)) oesd = true;
      else gutshot = true;
    }
  }

  if (made.cat < 4) { // 已成顺子/同花以上不再算听牌
    if (flushDraw) e += 0.14;
    if (oesd) e += 0.11; else if (gutshot) e += 0.05;
    // 两张高牌(相对牌面)
    const boardMax = board.length ? Math.max(...board.map(rankOf)) : -1;
    if (made.cat === 0 && rankOf(hole[0]) > boardMax && rankOf(hole[1]) > boardMax) e += 0.05;
  }
  return { e: Math.min(0.99, e), made, flushDraw, oesd };
}

// ---------- 蒙特卡洛胜率:全范围对手,支持多人平分池份额 ----------
// e 是期望底池份额,单挑等于 win + tie / 2;多人按实际并列人数分配。
// rng 必须由调用方注入,种子牌局与行为测试才能完整复现。
export function estimateEquity(hole, board = [], { opponents = 1, runs = 400, rng = Math.random } = {}) {
  if (!Array.isArray(hole) || hole.length !== 2) throw new Error('手牌必须为两张');
  if (!Array.isArray(board) || board.length > 5) throw new Error('公共牌必须为 0 到 5 张');
  if (!Number.isInteger(opponents) || opponents < 1 || opponents > 9) throw new Error('对手数必须为 1 到 9');
  if (!Number.isInteger(runs) || runs < 1) throw new Error('模拟次数必须为正整数');
  if (typeof rng !== 'function') throw new Error('胜率模拟需要 RNG');
  const known = [...hole, ...board];
  if (new Set(known).size !== known.length || known.some(id => !Number.isInteger(id) || id < 0 || id >= 52)) {
    throw new Error('手牌或公共牌包含重复/非法牌');
  }

  const baseDeck = makeDeck().filter(id => !known.includes(id));
  let wins = 0, ties = 0, losses = 0, share = 0;
  for (let run = 0; run < runs; run++) {
    const deck = shuffle(baseDeck.slice(), rng);
    let cursor = 0;
    const oppHoles = Array.from({ length: opponents }, () => [deck[cursor++], deck[cursor++]]);
    const runBoard = [...board, ...deck.slice(cursor, cursor + 5 - board.length)];
    const hero = evaluate7([...hole, ...runBoard]).score;
    let better = 0, equal = 0;
    for (const oppHole of oppHoles) {
      const cmp = compareScore(hero, evaluate7([...oppHole, ...runBoard]).score);
      if (cmp < 0) better++;
      else if (cmp === 0) equal++;
    }
    if (better > 0) losses++;
    else if (equal > 0) { ties++; share += 1 / (equal + 1); }
    else { wins++; share += 1; }
  }
  return { win: wins / runs, tie: ties / runs, loss: losses / runs, e: share / runs, runs };
}

// 相同决策状态复用确定性模拟,临界赔率再提高精度;不消耗人格动作的 RNG。
const EQUITY_CACHE = new Map();
function decisionEquity(o) {
  const opponents = Math.max(1, Math.min(9, o.opponents ?? 1));
  if (o.street === 0 && opponents === 1) return { e: preflopEquity(o.hole), runs: 0 };
  const cards = [...o.hole].sort((a, b) => a - b).join(',') + '|' + [...o.board].sort((a, b) => a - b).join(',');
  const signature = `${cards}|${opponents}`;
  const simulate = runs => {
    const key = `${signature}|${runs}`;
    if (EQUITY_CACHE.has(key)) return EQUITY_CACHE.get(key);
    const rng = mulberry32(hashSeed(`equity-v1|${key}`));
    const result = estimateEquity(o.hole, o.board, { opponents, runs, rng });
    EQUITY_CACHE.set(key, result);
    if (EQUITY_CACHE.size > 512) EQUITY_CACHE.delete(EQUITY_CACHE.keys().next().value);
    return result;
  };
  const baseRuns = o.equityRuns || 160;
  let result = simulate(baseRuns);
  if (!o.equityRuns && o.toCall > 0) {
    const odds = o.toCall / Math.max(1, o.pot + o.toCall);
    if (Math.abs(result.e - odds) < 0.08) result = simulate(Math.max(800, baseRuns));
  }
  return result;
}

// ---------- 对手倾向跟踪(读人的数据基座) ----------
// battle 与 eval 引擎共用:记录对手每个动作,产出平滑后的倾向率
export function createRead() {
  const s = { actions: 0, faced: 0, folds: 0, calls: 0, raises: 0, bets: 0 };
  return {
    track(toCall, type) {
      s.actions++;
      if (toCall > 0) {
        s.faced++;
        if (type === 'fold') s.folds++;
        else if (type === 'call') s.calls++;
        else if (type === 'raise') s.raises++;
      } else if (type === 'bet' || type === 'raise') s.bets++;
    },
    view() {
      return {
        hands: s.faced,
        foldToBet: (s.folds + 0.5) / (s.faced + 2),
        callRate: (s.calls + 0.5) / (s.faced + 2),
        aggro: (s.raises + s.bets + 0.5) / (s.actions + 3),
      };
    },
  };
}

// ---------- 单挑 AI ----------
// personality 战术维度(缺省 = 旧行为;由 persona.js 从六维三国属性生成):
//   aggr 主动进攻 / bluff 诈唬频率 / semi 半诈唬选择 / trap 慢打埋伏
//   read 读人权重 / callBias 跟注火候 / courage 抗压 / plan 连环诈唬
//   scare 借题发挥 / valueMin 价值阈值 / morale 士气 / moraleSens / moraleStyle
// 决策输入可选:villain 对手倾向 / slowplayed 上手埋伏 / bluffLine 诈唬一线
export const AI_DEFAULTS = {
  aggr: 0.8, bluff: 0.16, semi: 0, trap: 0, read: 0,
  callBias: 0.04, courage: 1, plan: 0, scare: 0, valueMin: 0.82,
  moraleSens: 0.5, moraleStyle: 'rage', tilt: 0, morale: 0,
};

// 惊悚牌面:三张同花,或牌面自身三张可连成顺子(拥有「代表权」)
function isScary(board) {
  if (!board || board.length < 3) return false;
  const sc = [0, 0, 0, 0];
  for (const id of board) sc[suitOf(id)]++;
  if (sc.some(c => c >= 3)) return true;
  const rs = new Set(board.map(rankOf));
  if (rs.has(12)) rs.add(-1);
  for (let lo = -1; lo <= 8; lo++) {
    let have = 0;
    for (let k = 0; k < 5; k++) if (rs.has(lo + k)) have++;
    if (have >= 3) return true;
  }
  return false;
}

export function aiDecide(o) {
  const { street, hole, board, toCall, pot, stack, minRaise, raisesLeft, rng } = o;
  const P = { ...AI_DEFAULTS, ...o.personality };
  const tiltK = 1 + P.tilt * 0.45;

  // 士气修正:rage 受挫更凶 / sulk 受挫更缩 / 得意价值打薄、诈唬变多
  const m = Math.max(-3, Math.min(3, P.morale));
  const sens = P.moraleSens, style = P.moraleStyle;
  let mAggr = 1, mBluff = 1, mCall = 0, mCour = 1, mValue = 0;
  if (m < 0 && style !== 'steady' && sens > 0) {
    if (style === 'rage') { mAggr = 1 + (-m) * 0.3 * sens; mBluff = 1 + (-m) * 0.5 * sens; mCall = 0.06 * (-m) * sens; }
    else { mCour = 1 + (-m) * 0.5 * sens; mAggr = Math.max(0.4, 1 - (-m) * 0.12 * sens); }
  } else if (m > 0 && sens > 0) { mBluff = 1 + m * 0.2 * sens; mValue = -0.02 * m * sens; }

  const eq = street === 0 ? null : postflopEquity(hole, board);
  const e = decisionEquity(o).e;

  // 读人:跟踪到的对手倾向 → 剥削式调整(样本 <3 手不轻动)
  let bluffMult = 1, vMin = P.valueMin + mValue, cBias = P.callBias + mCall,
    trapEff = P.trap, courEff = Math.min(1, P.courage) / mCour;
  const V = o.villain;
  if (P.read > 0 && V && V.hands >= 3) {
    bluffMult = Math.max(0.1, 1 + P.read * (V.foldToBet - 0.35) * 2.2 - P.read * Math.max(0, V.callRate - 0.5) * 1.6);
    vMin -= P.read * Math.max(0, V.callRate - 0.5) * 0.08;
    // 慢打只对会主动下注的对手有利可图;对跟注站埋伏是白烧价值
    const aggroK = Math.max(0, Math.min(1, (V.aggro - 0.15) / 0.3));
    trapEff = Math.min(0.95, trapEff * aggroK + P.read * 0.4 * Math.max(0, V.aggro - 0.35) * 2);
    if (V.aggro > 0.35) cBias += P.read * 0.05 * (V.aggro - 0.35) * 2;
  }

  // 借题:惊悚牌面给予代表权
  const scareK = P.scare > 0 && isScary(board) ? P.scare : 0;

  // 诈唬意愿:半诈唬优先听牌,纯空气收敛
  const hasDraw = eq ? (eq.flushDraw || eq.oesd) : false;
  const drawMult = street === 0 ? 1 : (hasDraw ? 1 + P.semi * 1.2 : 1 - P.semi * 0.55);
  let wantBluff = rng() < P.bluff * tiltK * mBluff * bluffMult * drawMult * (street === 0 ? 0.35 : 0.8);
  if (!wantBluff && scareK > 0) wantBluff = rng() < scareK * 0.3;

  // 连环:诈唬一线未被打断,按计谋续街
  const planBluff = toCall === 0 && !!o.bluffLine && P.plan > 0 && street > 0 && e < vMin && rng() < P.plan;

  if (toCall > 0) {
    const odds = toCall / Math.max(1, pot + toCall);
    const callEdge = e + (P.tilt >= 2 ? 0.12 : cBias);
    // 慢打:怪兽埋伏一手(同一手牌只埋一次)
    if (trapEff > 0 && !o.slowplayed && street < 3 && e >= vMin && stack > toCall && rng() < trapEff) {
      return { type: 'call', trapped: true };
    }
    if (wantBluff && raisesLeft > 0 && stack > toCall + minRaise) {
      const amt = Math.min(stack - toCall, Math.max(minRaise, Math.round(pot * (0.6 + rng() * 0.6))));
      return { type: 'raise', amount: toCall + amt, bluff: true };
    }
    // 收网:上手埋伏,这街对手送上门
    if (o.slowplayed && e >= vMin - 0.05 && raisesLeft > 0 && stack > toCall + minRaise) {
      const amt = Math.min(stack - toCall, Math.max(minRaise, Math.round(pot * (0.8 + rng() * 0.6))));
      return { type: 'raise', amount: toCall + amt, sprung: true };
    }
    if (e > vMin && raisesLeft > 0 && stack > toCall + minRaise) {
      const amt = Math.min(stack - toCall, Math.max(minRaise, Math.round(pot * (0.7 + rng() * 0.7))));
      return { type: 'raise', amount: toCall + amt };
    }
    if (callEdge >= odds) {
      // 抗压闸:边缘牌遭遇重压,胆识不足者多弃
      if (courEff < 1 && e < 0.62 && toCall > pot * 0.5) {
        const foldP = Math.min(0.9, 1 - courEff);
        if (rng() < foldP) return { type: 'fold' };
      }
      return { type: 'call' };
    }
    return { type: 'fold' };
  }

  // 无压力慢打:怪兽过牌藏锋(翻牌后,同一手只藏一次)
  if (trapEff > 0 && !o.slowplayed && street > 0 && street < 3 && e >= vMin && rng() < trapEff) {
    return { type: 'check', trapped: true };
  }

  const rawBetProb = e * P.aggr * tiltK * mAggr + ((wantBluff || planBluff) ? 0.55 : 0) + scareK * 0.4;
  const valueFloor = e >= vMin ? Math.max(0.78, Math.min(0.95, P.aggr)) : 0;
  const betProb = Math.min(0.95, Math.max(valueFloor, rawBetProb));
  if (rng() < betProb && stack > 0) {
    const amt = Math.min(stack, Math.max(minRaise, Math.round(pot * (0.45 + rng() * 0.55)) || minRaise));
    const air = e < 0.45 + scareK * 0.2;
    return { type: 'bet', amount: amt, bluff: planBluff || (wantBluff && air) };
  }
  return { type: 'check' };
}
