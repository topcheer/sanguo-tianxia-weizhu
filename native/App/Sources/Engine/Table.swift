// Table.swift —— 无 DOM 的多人德州规则:行动轮、总贡献、主/边池与守恒结算。
// 逐行移植自 src/table.js。
import Foundation

public final class Seat: ObservableObject, Identifiable {
  public let id: String
  public var isHero: Bool
  public var name: String
  @Published public var stack: Int
  @Published public var bet: Int = 0
  public var committed: Int = 0
  @Published public var folded: Bool = false
  public var hole: [Int] = []
  public var handStartStack: Int = 0

  // 牌局演出与人格(BattleEngine 使用)
  public var persona = makePersona()
  public var gen: Dyn? = nil
  public var genId: String? = nil
  public var skin: String = "default"
  public var morale: Int = 0
  public var initialStack: Int = 0
  public var lossStreak = 0
  public var slowplayed = false
  public var bluffLine = false
  public var tell: TellRecord? = nil
  public var tellLog: [TellRecord] = []
  public var tellIntentUsed = false
  public var read = ReadTracker()
  @Published public var bubble: String? = nil
  @Published public var pose: String = "neutral"
  @Published public var showdownName: String? = nil
  @Published public var showdownVerdict: String? = nil

  public init(id: String, isHero: Bool = false, name: String, stack: Int,
              persona: Persona = makePersona(), gen: Dyn? = nil, genId: String? = nil,
              skin: String = "default", morale: Int = 0) {
    self.id = id; self.isHero = isHero; self.name = name; self.stack = stack
    self.initialStack = stack; self.persona = persona; self.gen = gen; self.genId = genId
    self.skin = skin; self.morale = morale
  }
}

public struct TellRecord {
  public var street: Int
  public var shown: String  // strong | weak | mid | bluff | trap
  public var actual: String
  public var kind: String   // equity | intent
}

public func potTotal(_ seats: [Seat]) -> Int { seats.reduce(0) { $0 + $1.committed } }
public func liveSeats(_ seats: [Seat]) -> [Seat] { seats.filter { !$0.folded } }
public func actionableSeats(_ seats: [Seat]) -> [Seat] { seats.filter { !$0.folded && $0.stack > 0 } }

func nextPos(_ seats: [Seat], from: Int, predicate: (Seat, Int) -> Bool = { _, _ in true }, include: Bool = false) -> Int {
  let n = seats.count
  let start = include ? 0 : 1
  if start == 0, predicate(seats[(from + n) % n], (from + n) % n) { return (from + n) % n }
  for step in start...n {
    let pos = (from + step + n) % n
    if predicate(seats[pos], pos) { return pos }
  }
  return -1
}

func contribute(_ seat: Seat, _ amount: Int) -> Int {
  let actual = max(0, min(seat.stack, Int(jsRound(Double(amount)))))
  seat.stack -= actual
  seat.bet += actual
  seat.committed += actual
  return actual
}

public final class Hand {
  public var seats: [Seat]
  public var button: Int
  public var blinds: [Int]
  public var currentBet: Int
  public var minRaise: Int
  public var raisesLeft: Int
  public var pending: [String]
  public var actor: String?
  public var roundComplete: Bool
  public var street: Int = 0
  public var sb: Int
  public var bb: Int
  public var board: [Int] = []
  public init(seats: [Seat], button: Int, blinds: [Int], currentBet: Int, minRaise: Int, raisesLeft: Int, pending: [String], actor: String?, roundComplete: Bool, sb: Int, bb: Int) {
    self.seats = seats; self.button = button; self.blinds = blinds; self.currentBet = currentBet
    self.minRaise = minRaise; self.raisesLeft = raisesLeft; self.pending = pending
    self.actor = actor; self.roundComplete = roundComplete; self.sb = sb; self.bb = bb
  }
}

public func createHand(_ seats: [Seat], button: Int = 0, blinds: [Int] = [10, 20]) throws -> Hand {
  let active = seats.filter { $0.stack > 0 }
  guard active.count >= 2 else { throw EngineError.message("至少需要两位有筹码的玩家") }
  let buttonId = seats.indices.contains(button) && seats[button].stack > 0 ? seats[button].id : active[0].id
  for seat in active {
    seat.bet = 0
    seat.committed = 0
    seat.folded = false
    seat.handStartStack = seat.stack
  }
  let buttonPos = max(0, active.firstIndex { $0.id == buttonId } ?? 0)
  let H = Hand(
    seats: active, button: buttonPos, blinds: blinds,
    currentBet: 0, minRaise: blinds[1], raisesLeft: 3,
    pending: [], actor: nil, roundComplete: true, sb: 0, bb: 0
  )
  H.sb = H.seats.count == 2 ? H.button : nextPos(H.seats, from: H.button)
  H.bb = nextPos(H.seats, from: H.sb)
  _ = contribute(H.seats[H.sb], blinds[0])
  _ = contribute(H.seats[H.bb], blinds[1])
  H.currentBet = H.seats.map(\.bet).max() ?? 0
  beginRound(H, 0)
  return H
}

func roundDone(_ H: Hand) -> Bool {
  let live = liveSeats(H.seats)
  if live.count <= 1 { return true }
  let actionable = actionableSeats(live)
  if actionable.isEmpty || H.pending.isEmpty { return true }
  if actionable.count == 1 && actionable[0].bet >= H.currentBet { return true }
  return false
}

public func beginRound(_ H: Hand, _ street: Int) {
  H.street = street
  if street > 0 {
    for seat in H.seats { seat.bet = 0 }
    H.currentBet = 0
  }
  H.minRaise = H.blinds[1]
  H.raisesLeft = 3
  let live = liveSeats(H.seats)
  let actionable = actionableSeats(live)
  H.pending = actionable.map(\.id)
  H.roundComplete = live.count <= 1 || actionable.isEmpty
    || (actionable.count == 1 && actionable[0].bet >= H.currentBet)
  if H.roundComplete {
    H.pending = []
    H.actor = nil
    return
  }
  let first = street == 0
    ? (H.seats.count == 2 ? H.button : nextPos(H.seats, from: H.bb))
    : nextPos(H.seats, from: H.button)
  let pendingIds = Set(H.pending)
  let actorPos = nextPos(H.seats, from: first, predicate: { seat, _ in pendingIds.contains(seat.id) }, include: true)
  H.actor = actorPos >= 0 ? H.seats[actorPos].id : nil
}

public struct ActionView {
  public var street: Int
  public var hole: [Int]
  public var board: [Int]
  public var toCall: Int
  public var pot: Int
  public var stack: Int
  public var minRaise: Int
  public var raisesLeft: Int
  public var opponents: Int
  public var canRaise: Bool
}

public func actionView(_ H: Hand, _ seatId: String) throws -> ActionView {
  guard let seat = H.seats.first(where: { $0.id == seatId }) else {
    throw EngineError.message("未知席位:\(seatId)")
  }
  let toCall = max(0, H.currentBet - seat.bet)
  let live = liveSeats(H.seats)
  let canRespond = live.contains { $0.id != seatId && $0.stack > 0 }
  let raisesLeft = canRespond ? H.raisesLeft : 0
  return ActionView(
    street: H.street, hole: seat.hole, board: H.board,
    toCall: toCall, pot: potTotal(H.seats), stack: seat.stack,
    minRaise: H.minRaise, raisesLeft: raisesLeft,
    opponents: live.count - 1,
    canRaise: raisesLeft > 0 && seat.stack > toCall && canRespond
  )
}

func finishAction(_ H: Hand, _ actorId: String, _ reopened: Bool) {
  H.pending.removeAll { $0 == actorId }
  if reopened {
    for seat in actionableSeats(H.seats) where seat.id != actorId && !H.pending.contains(seat.id) {
      H.pending.append(seat.id)
    }
  }
  H.roundComplete = roundDone(H)
  if H.roundComplete {
    H.actor = nil
    H.pending = []
    return
  }
  let from = H.seats.firstIndex { $0.id == actorId } ?? 0
  let pendingIds = Set(H.pending)
  let pos = nextPos(H.seats, from: from, predicate: { seat, _ in pendingIds.contains(seat.id) })
  H.actor = pos >= 0 ? H.seats[pos].id : nil
}

public struct ActionResult {
  public var type: String
  public var amount: Int
  public var allin: Bool
  public var reopened: Bool
  public var folded: Bool
}

public func applyAction(_ H: Hand, _ seatId: String, _ decision: AIDecision) throws -> ActionResult {
  if H.roundComplete || H.actor != seatId { throw EngineError.message("未到 \(seatId) 行动") }
  guard let seat = H.seats.first(where: { $0.id == seatId }) else {
    throw EngineError.message("未知席位:\(seatId)")
  }
  let view = try actionView(H, seatId)
  // 无人可再响应时,全压只能补齐跟注
  let type = decision.type == "allin"
    ? (view.toCall > 0 && (seat.stack <= view.toCall || !view.canRaise) ? "call" : (!view.canRaise ? "check" : "raise"))
    : decision.type
  var amount = 0
  var reopened = false

  switch type {
  case "fold":
    if view.toCall <= 0 { throw EngineError.message("无注可弃时不能执行弃牌动作") }
    seat.folded = true
  case "check":
    if view.toCall != 0 { throw EngineError.message("有跟注压力时不能过牌") }
  case "call":
    if view.toCall <= 0 { throw EngineError.message("无需跟注时不能跟注") }
    amount = contribute(seat, view.toCall)
  case "bet", "raise":
    if type == "bet" && view.toCall != 0 { throw EngineError.message("有跟注压力时不能下注") }
    if !view.canRaise { throw EngineError.message("当前不能加注") }
    let requested = decision.type == "allin" ? seat.stack : (decision.amount ?? 0)
    let extra = requested - view.toCall
    if !(requested > view.toCall) { throw EngineError.message("加注必须超过跟注额") }
    if extra < H.minRaise && requested < seat.stack { throw EngineError.message("加注低于最小加注额") }
    amount = contribute(seat, requested)
    if seat.bet <= H.currentBet { throw EngineError.message("加注未超过当前注额") }
    let raisedBy = seat.bet - H.currentBet
    H.currentBet = seat.bet
    if raisedBy >= H.minRaise { H.minRaise = raisedBy }
    H.raisesLeft = max(0, H.raisesLeft - 1)
    reopened = true
  default:
    throw EngineError.message("未知动作:\(decision.type)")
  }

  finishAction(H, seatId, reopened)
  return ActionResult(type: type, amount: amount, allin: seat.stack == 0, reopened: reopened, folded: seat.folded)
}

public func closeRound(_ H: Hand) {
  for seat in H.seats { seat.bet = 0 }
  H.currentBet = 0
  H.pending = []
  H.actor = nil
  H.roundComplete = true
}

public struct PotLevel {
  public var amount: Int
  public var eligible: [String]
}

public struct BuiltPots {
  public var pots: [PotLevel]
  public var refunds: [PotLevel]
}

public func buildPots(_ seats: [Seat]) -> BuiltPots {
  var levels = Set(seats.filter { $0.committed > 0 }.map(\.committed)).sorted()
  var pots: [PotLevel] = []
  var refunds: [PotLevel] = []
  var previous = 0
  for level in levels {
    let contributors = seats.filter { $0.committed >= level }
    let amount = (level - previous) * contributors.count
    previous = level
    if contributors.count == 1 && !contributors[0].folded {
      refunds.append(PotLevel(amount: amount, eligible: [contributors[0].id]))
      continue
    }
    let eligible = contributors.filter { !$0.folded }.map(\.id)
    if eligible.isEmpty {
      if !pots.isEmpty { pots[pots.count - 1].amount += amount }
      else { pots.append(PotLevel(amount: amount, eligible: liveSeats(seats).map(\.id))) }
    } else {
      pots.append(PotLevel(amount: amount, eligible: eligible))
    }
  }
  return BuiltPots(pots: pots, refunds: refunds)
}

public struct SettleResult {
  public var awards: [String: Int]
  public var pots: [[String: Any]]  // 兼容 JSON 对照: {amount, eligible, winners, refund?}
  public var before: Int
  public var after: Int
}

public func settleHand(_ H: Hand, _ scores: [String: [Int]] = [:]) throws -> SettleResult {
  let before = H.seats.reduce(0) { $0 + $1.stack + $1.committed }
  let built = buildPots(H.seats)
  var awards: [String: Int] = [:]
  for seat in H.seats { awards[seat.id] = 0 }
  var results: [[String: Any]] = []
  for refund in built.refunds {
    awards[refund.eligible[0], default: 0] += refund.amount
    results.append(["amount": refund.amount, "id": refund.eligible[0], "refund": true, "winners": refund.eligible])
  }
  let order: [Int] = H.seats.indices.map { (H.button + 1 + $0) % H.seats.count }
  for pot in built.pots {
    var best: [Int]? = nil
    var winners: [String] = []
    for id in pot.eligible {
      let score = scores[id]
      if pot.eligible.count > 1 && score == nil { throw EngineError.message("摊牌缺少 \(id) 的牌型评分") }
      let cmp: Int = best.map { compareScore(score ?? [], $0) } ?? 1
      if best == nil || cmp > 0 { best = score; winners = [id] }
      else if cmp == 0 { winners.append(id) }
    }
    let share = pot.amount / winners.count
    var odd = pot.amount - share * winners.count
    for id in winners { awards[id, default: 0] += share }
    if odd > 0 {
      let ranked = winners.sorted { a, b in
        let pa = H.seats.firstIndex { $0.id == a } ?? 0
        let pb = H.seats.firstIndex { $0.id == b } ?? 0
        return order.firstIndex(of: pa)! < order.firstIndex(of: pb)!
      }
      for id in ranked {
        if odd == 0 { break }
        awards[id, default: 0] += 1
        odd -= 1
      }
    }
    results.append(["amount": pot.amount, "eligible": pot.eligible, "winners": winners])
  }
  for seat in H.seats { seat.stack += awards[seat.id] ?? 0 }
  let after = H.seats.reduce(0) { $0 + $1.stack }
  if after != before { throw EngineError.message("筹码不守恒:\(before) -> \(after)") }
  return SettleResult(awards: awards, pots: results, before: before, after: after)
}

public func nextButton(_ seats: [Seat], _ button: Int) -> Int {
  guard !seats.isEmpty else { return 0 }
  return nextPos(seats, from: button, predicate: { seat, _ in seat.stack > 0 })
}
