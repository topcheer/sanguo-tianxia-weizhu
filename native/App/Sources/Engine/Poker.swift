// Poker.swift —— 牌堆、洗牌(种子可验)、牌型评估、AI 决策。
// 逐行移植自 src/poker.js,语义与 RNG 消耗顺序与原版严格一致。
import Foundation

public let SUITS = ["♠", "♥", "♦", "♣"]
public let SUIT_RED = [false, true, true, false]
public let RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
public let HAND_NAMES = ["高牌", "一对", "两对", "三条", "顺子", "同花", "葫芦", "四条", "同花顺"]

public enum EngineError: Error, LocalizedError {
  case message(String)
  public var errorDescription: String? {
    if case .message(let m) = self { return m }
    return nil
  }
}

// MARK: - RNG

/// FNV-1a,按 UTF-16 code unit 迭代(与 JS charCodeAt 一致)。
public func hashSeed(_ s: String) -> UInt32 {
  var h: UInt32 = 2166136261
  for u in s.utf16 {
    h ^= UInt32(u)
    h = h &* 16777619
  }
  return h
}

public protocol RngSource {
  mutating func next() -> Double
}

/// mulberry32 —— 与 JS 版逐位一致。
public struct Mulberry32: RngSource {
  public var a: UInt32
  public init(seed: UInt32) { a = seed }
  public init(seed: Int) { a = UInt32(truncatingIfNeeded: seed) }
  public mutating func next() -> Double {
    a = a &+ 0x6D2B79F5
    var t = (a ^ (a >> 15)) &* (1 | a)
    t = (t &+ ((t ^ (t >> 7)) &* (61 | t))) ^ t
    return Double(t ^ (t >> 14)) / 4294967296.0
  }
}

/// 非确定性随机(演出层,对应 Math.random)。
public struct SystemRng: RngSource {
  public init() {}
  public mutating func next() -> Double {
    Double(UInt64.random(in: 0..<UInt64(1) << 54)) / Double(UInt64(1) << 54)
  }
}

/// Math.round:四舍五入 half-up(正数场景与 JS 一致)。
@inlinable public func jsRound(_ x: Double) -> Double { Foundation.floor(x + 0.5) }

// MARK: - 牌

public func makeDeck() -> [Int] {
  var d: [Int] = []
  d.reserveCapacity(52)
  for r in 0..<13 { for s in 0..<4 { d.append(r * 4 + s) } }
  return d
}

public func shuffle(_ deck: inout [Int], rng: inout some RngSource) {
  guard deck.count > 1 else { return }
  var i = deck.count - 1
  while i > 0 {
    let j = Int(Foundation.floor(rng.next() * Double(i + 1)))
    deck.swapAt(i, j)
    i -= 1
  }
}

@inlinable public func rankOf(_ id: Int) -> Int { id >> 2 }
@inlinable public func suitOf(_ id: Int) -> Int { id & 3 }
public func cardName(_ id: Int) -> String { RANKS[rankOf(id)] + SUITS[suitOf(id)] }

// MARK: - 牌型评估

func evaluate5(_ ids: [Int]) -> [Int] {
  let rs = ids.map(rankOf).sorted(by: >)
  let ss = ids.map(suitOf)
  let flush = ss.allSatisfy { $0 == ss[0] }

  var uniq: [Int] = []
  for r in rs where uniq.last != r && !uniq.contains(r) { uniq.append(r) }
  var straightHigh = -1
  if uniq.count == 5 {
    if uniq[0] - uniq[4] == 4 { straightHigh = uniq[0] }
    else if uniq[0] == 12 && uniq[1] == 3 { straightHigh = 3 } // A-5 轮子
  }

  var cnt: [Int: Int] = [:]
  for r in rs { cnt[r, default: 0] += 1 }
  // 按(数量, 点数)降序
  let groups = cnt.sorted { a, b in
    if a.value != b.value { return a.value > b.value }
    return a.key > b.key
  }

  if flush && straightHigh >= 0 { return [8, straightHigh] }
  if groups[0].value == 4 { return [7, groups[0].key, groups[1].key] }
  if groups[0].value == 3 && groups[1].value == 2 { return [6, groups[0].key, groups[1].key] }
  if flush { return [5] + rs }
  if straightHigh >= 0 { return [4, straightHigh] }
  if groups[0].value == 3 { return [3, groups[0].key, groups[1].key, groups[2].key] }
  if groups[0].value == 2 && groups[1].value == 2 { return [2, groups[0].key, groups[1].key, groups[2].key] }
  if groups[0].value == 2 { return [1, groups[0].key, groups[1].key, groups[2].key, groups[3].key] }
  return [0] + rs
}

public func compareScore(_ a: [Int], _ b: [Int]) -> Int {
  let n = max(a.count, b.count)
  for i in 0..<n {
    let d = (i < a.count ? a[i] : -1) - (i < b.count ? b[i] : -1)
    if d != 0 { return d }
  }
  return 0
}

public struct Evaluation {
  public var score: [Int]
  public var best5: [Int]
  public var cat: Int
  public var name: String
}

/// 7 选 5 枚举,返回最佳牌型。
public func evaluate7(_ ids: [Int]) -> Evaluation {
  var bestScore: [Int]? = nil
  var bestHand: [Int] = []
  let n = ids.count
  for a in 0..<(n - 4) {
    for b in (a + 1)..<(n - 3) {
      for c in (b + 1)..<(n - 2) {
        for d in (c + 1)..<(n - 1) {
          for e in (d + 1)..<n {
            let hand = [ids[a], ids[b], ids[c], ids[d], ids[e]]
            let score = evaluate5(hand)
            if bestScore == nil || compareScore(score, bestScore!) > 0 {
              bestScore = score
              bestHand = hand
            }
          }
        }
      }
    }
  }
  let s = bestScore!
  return Evaluation(score: s, best5: bestHand, cat: s[0], name: HAND_NAMES[s[0]])
}

public func madeName(_ hole: [Int], _ board: [Int]) -> String {
  let ids = hole + board
  if ids.count >= 5 { return evaluate7(ids).name }
  var cnt: [Int: Int] = [:]
  for id in ids { cnt[rankOf(id), default: 0] += 1 }
  let mx = cnt.values.max() ?? 0
  if mx >= 3 { return "三条" }
  if mx == 2 { return "一对" }
  return "高牌"
}

// MARK: - 起手牌强度

public func preflopStrength(_ hole: [Int]) -> Double {
  let a = hole[0], b = hole[1]
  let r1 = max(rankOf(a), rankOf(b)), r2 = min(rankOf(a), rankOf(b))
  let suited = suitOf(a) == suitOf(b)
  if r1 == r2 { return min(1, 0.55 + Double(r1) * 0.038) }
  var s = (Double(r1) * 2 + Double(r2)) / 36
  if suited { s += 0.09 }
  let gap = r1 - r2
  if gap == 1 { s += 0.06 } else if gap == 2 { s += 0.03 } else if gap >= 4 { s -= 0.05 }
  return max(0.02, min(1, s))
}

/// 翻牌前决策使用离线生成的 169 类真实胜率表(由 preflop.json 提供)。
public func preflopEquity(_ hole: [Int]) -> Double {
  guard hole.count == 2, Set(hole).count == 2,
        hole.allSatisfy({ $0 >= 0 && $0 < 52 }) else {
    fatalError("手牌必须为两张不同的合法牌")
  }
  let a = hole[0], b = hole[1]
  let hi = max(rankOf(a), rankOf(b)), lo = min(rankOf(a), rankOf(b))
  let key = hi == lo ? "\(hi),\(hi)" : "\(hi),\(lo)\(suitOf(a) == suitOf(b) ? "s" : "o")"
  guard let e = PreflopTable.shared.equity[key] else {
    fatalError("未登记的起手牌类型:\(key)")
  }
  return e
}

// MARK: - 翻牌后强度估计

let MADE_EQUITY = [0.16, 0.40, 0.55, 0.66, 0.75, 0.83, 0.90, 0.95, 0.99]

public struct PostflopEval {
  public var e: Double
  public var made: Evaluation
  public var flushDraw: Bool
  public var oesd: Bool
}

public func postflopEquity(_ hole: [Int], _ board: [Int]) -> PostflopEval {
  let ids = hole + board
  let made = evaluate7(ids)
  var e = MADE_EQUITY[made.cat]

  var suitCnt = [0, 0, 0, 0]
  for id in ids { suitCnt[suitOf(id)] += 1 }
  let flushDraw = suitCnt.contains { $0 == 4 }

  var set = Set(ids.map(rankOf))
  if set.contains(12) { set.insert(-1) } // A 可当 1
  var oesd = false, gutshot = false
  var lo = -1
  while lo <= 8 {
    var have = 0
    for k in 0..<5 { if set.contains(lo + k) { have += 1 } }
    if have == 4 {
      if set.contains(lo) && set.contains(lo + 4) { oesd = true } else { gutshot = true }
    }
    lo += 1
  }

  if made.cat < 4 { // 已成顺子/同花以上不再算听牌
    if flushDraw { e += 0.14 }
    if oesd { e += 0.11 } else if gutshot { e += 0.05 }
    let boardMax = board.isEmpty ? -1 : board.map(rankOf).max()!
    if made.cat == 0 && rankOf(hole[0]) > boardMax && rankOf(hole[1]) > boardMax { e += 0.05 }
  }
  return PostflopEval(e: min(0.99, e), made: made, flushDraw: flushDraw, oesd: oesd)
}

// MARK: - 蒙特卡洛胜率

public struct EquityResult: Equatable {
  public var win: Double
  public var tie: Double
  public var loss: Double
  public var e: Double
  public var runs: Int
}

public func estimateEquity(_ hole: [Int], _ board: [Int] = [], opponents: Int = 1, runs: Int = 400, rng: inout some RngSource) -> EquityResult {
  let known = hole + board
  let baseDeck = makeDeck().filter { !known.contains($0) }
  var wins = 0, ties = 0, losses = 0
  var share = 0.0
  for _ in 0..<runs {
    var deck = baseDeck
    shuffle(&deck, rng: &rng)
    var cursor = 0
    var oppHoles: [[Int]] = []
    for _ in 0..<opponents { oppHoles.append([deck[cursor], deck[cursor + 1]]); cursor += 2 }
    let runBoard = board + deck[cursor..<(cursor + 5 - board.count)]
    let hero = evaluate7(hole + runBoard).score
    var better = 0, equal = 0
    for oppHole in oppHoles {
      let cmp = compareScore(hero, evaluate7(oppHole + runBoard).score)
      if cmp < 0 { better += 1 } else if cmp == 0 { equal += 1 }
    }
    if better > 0 { losses += 1 }
    else if equal > 0 { ties += 1; share += 1.0 / Double(equal + 1) }
    else { wins += 1; share += 1.0 }
  }
  let r = Double(runs)
  return EquityResult(win: Double(wins) / r, tie: Double(ties) / r, loss: Double(losses) / r, e: share / r, runs: runs)
}

// MARK: - 决策用确定性胜率(缓存)

struct DecisionEquityInput {
  var street: Int
  var hole: [Int]
  var board: [Int]
  var opponents: Int
  var toCall: Int
  var pot: Int
  var equityRuns: Int?
}

var equityCache: [String: EquityResult] = [:]

func decisionEquity(_ o: DecisionEquityInput) -> EquityResult {
  let opponents = max(1, min(9, o.opponents))
  if o.street == 0 && opponents == 1 {
    return EquityResult(win: preflopEquity(o.hole), tie: 0, loss: 0, e: preflopEquity(o.hole), runs: 0)
  }
  let cards = o.hole.sorted().map(String.init).joined(separator: ",") + "|" + o.board.sorted().map(String.init).joined(separator: ",")
  let signature = "\(cards)|\(opponents)"
  func simulate(_ runs: Int) -> EquityResult {
    let key = "\(signature)|\(runs)"
    if let cached = equityCache[key] { return cached }
    var rng = Mulberry32(seed: hashSeed("equity-v1|\(key)"))
    let result = estimateEquity(o.hole, o.board, opponents: opponents, runs: runs, rng: &rng)
    equityCache[key] = result
    return result
  }
  let baseRuns = o.equityRuns ?? 160
  var result = simulate(baseRuns)
  if o.equityRuns == nil && o.toCall > 0 {
    let odds = Double(o.toCall) / Double(max(1, o.pot + o.toCall))
    if abs(result.e - odds) < 0.08 { result = simulate(max(800, baseRuns)) }
  }
  return result
}

// MARK: - 对手倾向跟踪

public struct VillainView: Equatable {
  public var hands: Int
  public var foldToBet: Double
  public var callRate: Double
  public var aggro: Double
}

public final class ReadTracker {
  var actions = 0, faced = 0, folds = 0, calls = 0, raises = 0, bets = 0
  public init() {}
  public func track(_ toCall: Int, _ type: String) {
    actions += 1
    if toCall > 0 {
      faced += 1
      if type == "fold" { folds += 1 }
      else if type == "call" { calls += 1 }
      else if type == "raise" { raises += 1 }
    } else if type == "bet" || type == "raise" { bets += 1 }
  }
  public func view() -> VillainView {
    VillainView(
      hands: faced,
      foldToBet: (Double(folds) + 0.5) / Double(faced + 2),
      callRate: (Double(calls) + 0.5) / Double(faced + 2),
      aggro: (Double(raises + bets) + 0.5) / Double(actions + 3)
    )
  }
}

// MARK: - 单挑 AI

public struct AIPersonality {
  public var aggr = 0.8
  public var bluff = 0.16
  public var semi = 0.0
  public var trap = 0.0
  public var read = 0.0
  public var callBias = 0.04
  public var courage = 1.0
  public var plan = 0.0
  public var scare = 0.0
  public var valueMin = 0.82
  public var moraleSens = 0.5
  public var moraleStyle = "rage"
  public var tilt = 0.0
  public var morale = 0.0
  public init() {}
}

public struct AIDecideInput {
  public var street: Int
  public var hole: [Int]
  public var board: [Int]
  public var toCall: Int
  public var pot: Int
  public var stack: Int
  public var minRaise: Int
  public var raisesLeft: Int
  public var opponents: Int = 1
  public var canRaise: Bool = true
  public var personality = AIPersonality()
  public var villain: VillainView? = nil
  public var slowplayed = false
  public var bluffLine = false
  public var equityRuns: Int? = nil
  public init(street: Int, hole: [Int], board: [Int], toCall: Int, pot: Int, stack: Int, minRaise: Int, raisesLeft: Int) {
    self.street = street; self.hole = hole; self.board = board; self.toCall = toCall
    self.pot = pot; self.stack = stack; self.minRaise = minRaise; self.raisesLeft = raisesLeft
  }
}

public struct AIDecision: Equatable {
  public var type: String
  public var amount: Int? = nil
  public var bluff: Bool? = nil
  public var trapped: Bool? = nil
  public var sprung: Bool? = nil
}

/// 惊悚牌面:三张同花,或牌面自身三张可连成顺子。
func isScary(_ board: [Int]) -> Bool {
  guard board.count >= 3 else { return false }
  var sc = [0, 0, 0, 0]
  for id in board { sc[suitOf(id)] += 1 }
  if sc.contains(where: { $0 >= 3 }) { return true }
  var rs = Set(board.map(rankOf))
  if rs.contains(12) { rs.insert(-1) }
  var lo = -1
  while lo <= 8 {
    var have = 0
    for k in 0..<5 { if rs.contains(lo + k) { have += 1 } }
    if have >= 3 { return true }
    lo += 1
  }
  return false
}

public func aiDecide(_ o: AIDecideInput, rng: inout some RngSource) -> AIDecision {
  var P = o.personality
  let tiltK = 1 + P.tilt * 0.45

  // 士气修正
  let m = max(-3.0, min(3.0, P.morale))
  let sens = P.moraleSens, style = P.moraleStyle
  var mAggr = 1.0, mBluff = 1.0, mCall = 0.0, mCour = 1.0, mValue = 0.0
  if m < 0 && style != "steady" && sens > 0 {
    if style == "rage" {
      mAggr = 1 + (-m) * 0.3 * sens; mBluff = 1 + (-m) * 0.5 * sens; mCall = 0.06 * (-m) * sens
    } else {
      mCour = 1 + (-m) * 0.5 * sens; mAggr = max(0.4, 1 - (-m) * 0.12 * sens)
    }
  } else if m > 0 && sens > 0 {
    mBluff = 1 + m * 0.2 * sens; mValue = -0.02 * m * sens
  }

  let eq = o.street == 0 ? nil : postflopEquity(o.hole, o.board)
  let e = decisionEquity(DecisionEquityInput(
    street: o.street, hole: o.hole, board: o.board,
    opponents: o.opponents, toCall: o.toCall, pot: o.pot, equityRuns: o.equityRuns
  )).e

  // 读人
  var bluffMult = 1.0
  var vMin = P.valueMin + mValue
  var cBias = P.callBias + mCall
  var trapEff = P.trap
  var courEff = min(1, P.courage) / mCour
  if let V = o.villain, P.read > 0, V.hands >= 3 {
    bluffMult = max(0.1, 1 + P.read * (V.foldToBet - 0.35) * 2.2 - P.read * max(0, V.callRate - 0.5) * 1.6)
    vMin -= P.read * max(0, V.callRate - 0.5) * 0.08
    let aggroK = max(0, min(1, (V.aggro - 0.15) / 0.3))
    trapEff = min(0.95, trapEff * aggroK + P.read * 0.4 * max(0, V.aggro - 0.35) * 2)
    if V.aggro > 0.35 { cBias += P.read * 0.05 * (V.aggro - 0.35) * 2 }
  }

  // 借题:惊悚牌面给予代表权
  let scareK = P.scare > 0 && isScary(o.board) ? P.scare : 0

  // 诈唬意愿
  let hasDraw = eq.map { $0.flushDraw || $0.oesd } ?? false
  let drawMult = o.street == 0 ? 1.0 : (hasDraw ? 1 + P.semi * 1.2 : 1 - P.semi * 0.55)
  var wantBluff = rng.next() < P.bluff * tiltK * mBluff * bluffMult * drawMult * (o.street == 0 ? 0.35 : 0.8)
  if !wantBluff && scareK > 0 { wantBluff = rng.next() < scareK * 0.3 }

  // 连环诈唬
  let planBluff = o.toCall == 0 && o.bluffLine && P.plan > 0 && o.street > 0 && e < vMin && rng.next() < P.plan

  if o.toCall > 0 {
    let odds = Double(o.toCall) / Double(max(1, o.pot + o.toCall))
    let callEdge = e + (P.tilt >= 2 ? 0.12 : cBias)
    // 慢打:怪兽埋伏一手
    if trapEff > 0 && !o.slowplayed && o.street < 3 && e >= vMin && o.stack > o.toCall && rng.next() < trapEff {
      return AIDecision(type: "call", trapped: true)
    }
    if wantBluff && o.raisesLeft > 0 && o.stack > o.toCall + o.minRaise {
      let amt = min(o.stack - o.toCall, max(o.minRaise, Int(jsRound(Double(o.pot) * (0.6 + rng.next() * 0.6)))))
      return AIDecision(type: "raise", amount: o.toCall + amt, bluff: true)
    }
    // 收网
    if o.slowplayed && e >= vMin - 0.05 && o.raisesLeft > 0 && o.stack > o.toCall + o.minRaise {
      let amt = min(o.stack - o.toCall, max(o.minRaise, Int(jsRound(Double(o.pot) * (0.8 + rng.next() * 0.6)))))
      return AIDecision(type: "raise", amount: o.toCall + amt, sprung: true)
    }
    if e > vMin && o.raisesLeft > 0 && o.stack > o.toCall + o.minRaise {
      let amt = min(o.stack - o.toCall, max(o.minRaise, Int(jsRound(Double(o.pot) * (0.7 + rng.next() * 0.7)))))
      return AIDecision(type: "raise", amount: o.toCall + amt)
    }
    if callEdge >= odds {
      // 抗压闸
      if courEff < 1 && e < 0.62 && Double(o.toCall) > Double(o.pot) * 0.5 {
        let foldP = min(0.9, 1 - courEff)
        if rng.next() < foldP { return AIDecision(type: "fold") }
      }
      return AIDecision(type: "call")
    }
    return AIDecision(type: "fold")
  }

  // 无压力慢打
  if trapEff > 0 && !o.slowplayed && o.street > 0 && o.street < 3 && e >= vMin && rng.next() < trapEff {
    return AIDecision(type: "check", trapped: true)
  }

  let rawBetProb = e * P.aggr * tiltK * mAggr + ((wantBluff || planBluff) ? 0.55 : 0) + scareK * 0.4
  let valueFloor = e >= vMin ? max(0.78, min(0.95, P.aggr)) : 0
  let betProb = min(0.95, max(valueFloor, rawBetProb))
  if rng.next() < betProb && o.stack > 0 {
    let rounded = jsRound(Double(o.pot) * (0.45 + rng.next() * 0.55))
    let base = rounded == 0 ? Double(o.minRaise) : rounded
    let amt = min(o.stack, max(o.minRaise, Int(base)))
    let air = e < 0.45 + scareK * 0.2
    return AIDecision(type: "bet", amount: amt, bluff: planBluff || (wantBluff && air))
  }
  return AIDecision(type: "check")
}
