// Odds.swift —— 仅基于公开信息的胜率、终局牌型分布与 outs 分析。移植自 src/odds.js。
import Foundation

public struct DrawInfo {
  public var cat: Int
  public var name: String
  public var probability: Double
  public var nextProbability: Double
  public var outs: [Int]
}

public struct OddsResult {
  public var equity: EquityResult
  public var categories: [Double]   // 9 类终局牌型频率
  public var runouts: Int
  public var exact: Bool
  public var draws: [DrawInfo]
  public var currentCat: Int
  public var currentName: String
  public var opponents: Int
  public var street: Int
}

struct DistributionResult { var categories: [Double]; var runouts: Int; var exact: Bool }

func finalHandDistribution(_ hole: [Int], _ board: [Int], _ deck: [Int], runs: Int, rng: inout some RngSource) -> DistributionResult {
  var counts = [Double](repeating: 0, count: 9)
  var runouts = 0
  func record(_ cards: [Int]) {
    counts[evaluate7(cards).cat] += 1
    runouts += 1
  }
  if board.count >= 3 {
    let missing = 5 - board.count
    if missing == 0 {
      record(hole + board)
    } else if missing == 1 {
      for card in deck { record(hole + board + [card]) }
    } else if missing == 2 {
      for a in 0..<(deck.count - 1) {
        for b in (a + 1)..<deck.count {
          record(hole + board + [deck[a], deck[b]])
        }
      }
    }
    return DistributionResult(categories: counts.map { $0 / Double(max(1, runouts)) }, runouts: runouts, exact: true)
  }
  for _ in 0..<runs {
    var d = deck
    shuffle(&d, rng: &rng)
    record(hole + Array(d.prefix(5)))
  }
  return DistributionResult(categories: counts.map { $0 / Double(max(1, runouts)) }, runouts: runouts, exact: false)
}

func drawAnalysis(_ hole: [Int], _ board: [Int], _ deck: [Int], _ currentCat: Int, _ distribution: DistributionResult) -> [DrawInfo] {
  guard board.count == 3 || board.count == 4 else { return [] }
  var outs: [[Int]] = Array(repeating: [], count: 9)
  for card in deck {
    let cat = evaluate7(hole + board + [card]).cat
    if cat > currentCat { outs[cat].append(card) }
  }
  var draws: [DrawInfo] = []
  if currentCat < 8 {
    for cat in max(1, currentCat + 1)...8 {
      if outs[cat].isEmpty { continue }
      draws.append(DrawInfo(
        cat: cat, name: HAND_NAMES[cat],
        probability: distribution.categories[cat],
        nextProbability: Double(outs[cat].count) / Double(deck.count),
        outs: outs[cat]
      ))
    }
  }
  return draws.sorted { a, b in
    if a.probability != b.probability { return a.probability > b.probability }
    return a.cat > b.cat
  }
}

public func analyzeOdds(_ hole: [Int], _ board: [Int] = [], opponents: Int = 1, runs: Int? = nil) -> OddsResult {
  let simulationRuns = runs ?? (opponents > 1 ? 1200 : 1800)
  let cards = hole.sorted().map(String.init).joined(separator: ",") + "|" + board.sorted().map(String.init).joined(separator: ",")
  let seed = hashSeed("public-odds-v1|\(cards)|\(opponents)")
  var equityRng = Mulberry32(seed: seed)
  let equity = estimateEquity(hole, board, opponents: opponents, runs: simulationRuns, rng: &equityRng)
  let deck = makeDeck().filter { !(hole + board).contains($0) }
  var distRng = Mulberry32(seed: seed ^ 0x9e3779b9)
  let distribution = finalHandDistribution(hole, board, deck, runs: simulationRuns, rng: &distRng)
  let evaluated = board.count >= 3 ? evaluate7(hole + board) : nil
  let currentCat = evaluated?.cat ?? (rankOf(hole[0]) == rankOf(hole[1]) ? 1 : 0)
  let currentName = evaluated?.name ?? madeName(hole, board)
  return OddsResult(
    equity: equity,
    categories: distribution.categories,
    runouts: distribution.runouts,
    exact: distribution.exact,
    draws: drawAnalysis(hole, board, deck, currentCat, distribution),
    currentCat: currentCat,
    currentName: currentName,
    opponents: opponents,
    street: board.count
  )
}
