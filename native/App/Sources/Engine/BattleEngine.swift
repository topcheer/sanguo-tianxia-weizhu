// BattleEngine.swift —— 牌局编排:盲注、发牌、AI、破绽、士气、攻心/观星、结算。
// 逐段移植 src/battle.js 的逻辑;演出时序由 view 注入 clock 决定。
import Foundation

// MARK: 对局配置

public struct BattleOpponentConfig {
  public var id: String
  public var name: String
  public var gen: String?
  public var stack: Int
  public var traits: [String: Int]?
  public var morale: Int
  public var skin: String?
  public init(id: String, name: String, gen: String? = nil, stack: Int, traits: [String: Int]? = nil, morale: Int = 0, skin: String? = nil) {
    self.id = id; self.name = name; self.gen = gen; self.stack = stack
    self.traits = traits; self.morale = morale; self.skin = skin
  }
}

public struct BattleRule {
  public var cornered = false
  public var lieAll = 0
  public var lieMult = 1.0
  public var autumnWind = 0
  public var tauntImmune = false
  public init() {}
  public init(_ dyn: Dyn) {
    cornered = dyn["cornered"].bool ?? false
    lieAll = dyn["lieAll"].int ?? 0
    lieMult = dyn["lieMult"].double ?? 1.0
    autumnWind = dyn["autumnWind"].int ?? 0
    tauntImmune = dyn["tauntImmune"].bool ?? false
  }
}

public struct BattleConfig {
  public var playerStack: Int = 1000
  public var opponents: [BattleOpponentConfig]
  public var blinds0: [Int] = [10, 20]
  public var escalateEvery: Int = 4
  public var boss: Bool = false
  public var rule = BattleRule()
  public var playerName: String? = nil
  public var zhiZi: Bool = false
  public var seed: String
  public var keenEye: Bool = false
  public init(opponents: [BattleOpponentConfig], seed: String) {
    self.opponents = opponents
    self.seed = seed
  }
}

// MARK: 席位


public struct PotView {
  public var amount: Int
  public var eligible: [String]
  public var winners: [String]
  public var refund: Bool
}

// MARK: 引擎事件

public enum BattleEvent {
  case handStart(hand: Int, sb: Int, bb: Int)
  case blindsUp(sb: Int, bb: Int)
  case dealt(seatId: String, cards: [Int])
  case burn
  case board([Int])
  case action(seatId: String, decision: AIDecision, result: ActionResult)
  case tell(seatId: String, line: String, note: String, tone: String)
  case banner(String, String)
  case codex(String)
  case showdownStart(seatId: String, hole: [Int])
  case settle(awards: [String: Int], pots: [PotView])
  case morale(seatId: String, from: Int, to: Int)
  case eliminated(seatId: String)
  case taunted(seatId: String, line: String, tilted: Bool)
  case zhiZi(seatId: String, text: String)
  case allin(seatId: String, amount: Int)
  case end(win: Bool, finalStack: Int)
}

// MARK: 对局引擎

public final class BattleEngine: ObservableObject {
  public let config: BattleConfig
  public private(set) var seats: [Seat]
  public var hero: Seat { seats[0] }
  public var opponents: [Seat] { Array(seats.dropFirst()) }
  public private(set) var handNum = 0
  public private(set) var blinds: [Int]
  public private(set) var board: [Int] = []
  public private(set) var deckLog: [Int] = []
  public private(set) var H: Hand? = nil
  public private(set) var over = false
  public private(set) var taunted = false
  public private(set) var spectate = false
  public var selectedSeat: String
  public var keenEye: Bool
  public var onEvent: ((BattleEvent) -> Void)? = nil
  public let eventBridge = BattleEventBridge()
  @Published public var latestOdds: OddsResult? = nil
  public var oddsEnabled: () -> Bool = { false }

  // 玩家决策入口(由 UI 提供续体)
  public var playerActionProvider: ((_ view: ActionView, _ presets: [BetPreset]) async -> AIDecision)? = nil
  // 演出时钟
  public var clock: (_ seconds: Double) async -> Void = { _ in }
  public var fastClock = false

  private var button: Int = 0
  private var systemRng = SystemRng()

  public init(config: BattleConfig) {
    self.config = config
    self.blinds = config.blinds0
    self.keenEye = config.keenEye
    var all: [Seat] = [Seat(
      id: "player", isHero: true, name: config.playerName ?? "你",
      stack: config.playerStack, persona: makePersona(), gen: nil, genId: nil,
      skin: "default", morale: 0
    )]
    for (index, cfg) in config.opponents.enumerated() {
      let persona = makePersona(cfg.traits ?? [:])
      let gen = GameData.shared.general(cfg.gen)
      let seat = Seat(
        id: index == 0 ? "opponent" : "opponent-\(index + 1)",
        isHero: false, name: cfg.name, stack: cfg.stack,
        persona: persona, gen: gen, genId: cfg.gen,
        skin: cfg.skin ?? gen?["skin"].string ?? "default", morale: cfg.morale
      )
      all.append(seat)
    }
    seats = all
    selectedSeat = seats.count > 1 ? seats[1].id : "player"
  }

  // 便捷视角
  public var seatsForHand: [Seat] { H?.seats.map { seatById($0.id) } ?? seats }
  public func seatById(_ id: String) -> Seat { seats.first { $0.id == id } ?? seats[0] }
  public var liveOpponentCount: Int { opponents.filter { !$0.folded && $0.stack > 0 }.count }

  func emit(_ e: BattleEvent) {
    onEvent?(e)
    switch e {
    case .banner(let main, let sub):
      eventBridge.bannerPub.send((main, sub))
    case .codex(let entry):
      eventBridge.codexPub.send(entry)
    case .tell(let seatId, let line, let note, _):
      if let seat = seatByIdOpt(seatId) {
        seat.bubble = note.isEmpty ? line : "\(line)\n\(note)"
        let text = seat.bubble
        Task { @MainActor in
          try? await Task.sleep(nanoseconds: 3_400_000_000)
          if seat.bubble == text { seat.bubble = nil }
        }
      }
    case .taunted(let seatId, let line, _):
      if let seat = seatByIdOpt(seatId) {
        seat.bubble = line
        Task { @MainActor in
          try? await Task.sleep(nanoseconds: 2_600_000_000)
          if seat.bubble == line { seat.bubble = nil }
        }
      }
    case .zhiZi(let seatId, let text):
      if let seat = seatByIdOpt(seatId) {
        seat.bubble = text
        Task { @MainActor in
          try? await Task.sleep(nanoseconds: 3_000_000_000)
          if seat.bubble == text { seat.bubble = nil }
        }
      }
    case .action, .board:
      refreshOdds()
    case .settle:
      latestOdds = nil
    default:
      break
    }
  }

  func refreshOdds() {
    guard oddsEnabled(), let H, hero.hole.count == 2, !hero.folded,
          [0, 3, 4, 5].contains(board.count), liveSeats(H.seats).count >= 2 else {
      latestOdds = nil
      return
    }
    let hole = hero.hole
    let currentBoard = board
    let opponents = max(1, H.seats.filter { !$0.isHero && !$0.folded }.count)
    Task.detached(priority: .utility) { [weak self] in
      let result = analyzeOdds(hole, currentBoard, opponents: opponents)
      await MainActor.run { self?.latestOdds = result }
    }
  }
  private func wait(_ s: Double) async {
    if fastClock { return }
    await clock(spectate ? min(s, 0.05) : s)
  }

  static func blindLevel(_ blinds0: [Int], _ level: Int) -> [Int] {
    let m = pow(1.5, Double(level))
    return [Int(jsRound(Double(blinds0[0]) * m / 5)) * 5, Int(jsRound(Double(blinds0[1]) * m / 5)) * 5]
  }

  // MARK: 主循环

  public func run() async {
    while !over {
      await playHand()
    }
  }

  public func playHand() async {
    handNum += 1
    taunted = false
    spectate = false
    board = []
    let level = min(6, (handNum - 1) / config.escalateEvery)
    let bl = BattleEngine.blindLevel(config.blinds0, level)
    let newBlinds = bl[0] != blinds[0] && handNum > 1
    blinds = bl
    emit(.handStart(hand: handNum, sb: bl[0], bb: bl[1]))
    if newBlinds {
      emit(.banner(L("banner.blindsUp"), "\(bl[0]) / \(bl[1])"))
      await wait(0.8)
    }
    var rng = Mulberry32(seed: hashSeed(config.seed + "#" + String(handNum)))
    var deck = makeDeck()
    shuffle(&deck, rng: &rng)
    var deckPtr = 0
    deckLog = deck
    func nextCard() -> Int { deckPtr += 1; return deck[deckPtr - 1] }

    for seat in seats {
      seat.hole = []
      seat.slowplayed = false
      seat.bluffLine = false
      seat.tell = nil
      seat.tellLog = []
      seat.tellIntentUsed = false
      seat.showdownName = nil
      seat.showdownVerdict = nil
      seat.pose = "neutral"
    }
    let H: Hand
    do { H = try createHand(seats, button: button, blinds: blinds) } catch {
      over = true
      return
    }
    self.H = H
    H.board = []
    for seat in H.seats {
      let s = seatById(seat.id)
      seat.hole = [nextCard(), nextCard()]
      s.hole = seat.hole
      emit(.dealt(seatId: seat.id, cards: seat.hole))
      await wait(0.12)
    }
    if config.rule.autumnWind == handNum {
      emit(.banner(L("banner.autumnWind"), L("banner.autumnWind.sub")))
      bumpMorale(opponents[0], 1)
      await wait(1.0)
    }

    // 街前破绽
    for seat in opponents where !seat.folded {
      applyTell(seat, street: 0, rng: &rng)
    }
    await bettingRound(street: 0, rng: &rng)
    for street in [1, 2, 3] {
      if liveSeats(H.seats).count <= 1 { break }
      emit(.burn)
      _ = nextCard()
      let count = street == 1 ? 3 : 1
      for _ in 0..<count {
        board.append(nextCard())
        emit(.board(board))
        await wait(0.12)
      }
      for seat in opponents where !seat.folded {
        applyTell(seat, street: street, rng: &rng)
      }
      await bettingRound(street: street, rng: &rng)
    }
    await finishHand()
  }

  // MARK: 下注轮

  func bettingRound(street: Int, rng: inout Mulberry32) async {
    guard let H else { return }
    beginRound(H, street)
    while !H.roundComplete {
      guard let actorId = H.actor, let seat = seatByIdOpt(actorId) else { break }
      let view = try! actionView(H, actorId)
      let decision: AIDecision
      if seat.isHero {
        decision = await playerAct(seat, view: view)
      } else {
        decision = await oppAct(seat, view: view, street: street, rng: &rng)
      }
      await performAction(seat, decision: decision)
      await wait(0.16)
    }
    closeRound(H)
  }

  public func seatByIdOpt(_ id: String) -> Seat? { seats.first { $0.id == id } }

  public struct BetPreset {
    public var label: String
    public var amount: Int
  }

  func playerAct(_ seat: Seat, view: ActionView) async -> AIDecision {
    guard let provider = playerActionProvider else { return AIDecision(type: "check") }
    var presets: [BetPreset] = []
    if view.canRaise {
      for (f, label) in [(0.5, "½ \(L("term.pot"))"), (1.0, "1 \(L("term.pot"))"), (2.0, "2 \(L("term.pot"))")] {
        let extra = max(view.minRaise, Int(jsRound(Double(view.pot) * f / 5)) * 5)
        let amount = min(view.stack, view.toCall + extra)
        if amount > view.toCall && !presets.contains(where: { $0.amount == amount }) {
          presets.append(BetPreset(label: label, amount: amount))
        }
      }
    }
    let d = await provider(view, presets)
    return d
  }

  func oppAct(_ seat: Seat, view: ActionView, street: Int, rng: inout Mulberry32) async -> AIDecision {
    seat.pose = "thinking"
    await wait(0.6 + Double.random(in: 0...0.6))
    var personality = seat.persona.ai
    personality.tilt = Double(tiltOf(seat))
    personality.morale = Double(seat.morale)
    if config.rule.cornered && seat.stack < seat.initialStack * 3 / 10 {
      personality.aggr *= 1.4
    }
    var input = AIDecideInput(
      street: street, hole: seat.hole, board: board,
      toCall: view.toCall, pot: view.pot, stack: view.stack,
      minRaise: view.minRaise, raisesLeft: view.raisesLeft
    )
    input.opponents = view.opponents
    input.canRaise = view.canRaise
    input.personality = personality
    input.villain = seat.read.view()
    input.slowplayed = seat.slowplayed
    input.bluffLine = seat.bluffLine
    if seats.count > 2 { input.equityRuns = 96 }
    let decision = aiDecide(input, rng: &rng)
    seat.slowplayed = decision.trapped ?? false
    seat.bluffLine = (decision.type == "bet" || decision.type == "raise") && (decision.bluff ?? false)
    seat.pose = "neutral"
    return decision
  }

  func performAction(_ seat: Seat, decision: AIDecision) async {
    guard let H else { return }
    let view = (try? actionView(H, seat.id)) ?? ActionView(street: 0, hole: [], board: [], toCall: 0, pot: 0, stack: seat.stack, minRaise: 20, raisesLeft: 0, opponents: 0, canRaise: false)
    let result: ActionResult
    do {
      result = try applyAction(H, seat.id, decision)
    } catch {
      return
    }
    if seat.isHero {
      let tracked = decision.type == "allin" ? (view.stack <= view.toCall ? "call" : "raise") : decision.type
      for opponent in opponents {
        opponent.read.track(view.toCall, tracked)
      }
      if result.folded && liveSeats(H.seats).count > 1 { spectate = true }
    }
    if result.allin && result.amount > 0 {
      emit(.allin(seatId: seat.id, amount: result.amount))
      await wait(0.5)
    }
    if result.folded { seat.folded = true }
    emit(.action(seatId: seat.id, decision: decision, result: result))
  }

  // MARK: 破绽

  func applyTell(_ seat: Seat, street: Int, rng: inout Mulberry32) {
    if seat.folded || (seat.stack <= 0 && seat.hole.isEmpty) { return }
    let tells = seat.gen?["tells"]
    let strongText = tells?["strong"].string ?? "右手护住筹码堆"
    let weakText = tells?["weak"].string ?? "左手抚上瓷面"
    let intentNotes = GameData.shared.telllines["INTENT_NOTES"]
    // 意图泄露(演出层随机,不消耗共享 RNG)
    if !seat.tellIntentUsed && street > 0 && (seat.bluffLine || seat.slowplayed) {
      let p = min(0.34, 0.08 + seat.persona.ai.plan * 0.22 + (keenEye ? 0.12 : 0))
      if systemRng.next() < p {
        seat.tellIntentUsed = true
        let intent = seat.slowplayed ? "trap" : "bluff"
        let rec = TellRecord(street: street, shown: intent, actual: intent, kind: "intent")
        seat.tell = rec
        seat.tellLog.append(rec)
        seat.pose = intent == "bluff" ? "strong" : "weak"
        emit(.tell(seatId: seat.id,
                   line: tellLine(genId: seat.genId, category: "\(intent)Leak", traits: seat.persona),
                   note: (intentNotes[intent].string ?? "") + recordSuffix(seat),
                   tone: "intent"))
        return
      }
    }
    let e = street == 0 ? preflopStrength(seat.hole) : postflopEquity(seat.hole, board).e
    let actual = e > 0.66 ? "strong" : (e < 0.34 ? "weak" : "mid")
    var shown = actual
    let lieChance = (keenEye ? seat.persona.lieChance * 0.35 : seat.persona.lieChance) * config.rule.lieMult
    if config.rule.lieAll > 0 && handNum <= config.rule.lieAll {
      shown = actual == "weak" ? "strong" : "weak"
    } else if tiltOf(seat) < 2 && rng.next() < lieChance {
      shown = actual == "strong" ? "weak" : "strong"
    }
    let rec = TellRecord(street: street, shown: shown, actual: actual, kind: "equity")
    seat.tell = rec
    if shown != "mid" { seat.tellLog.append(rec) }
    seat.pose = shown == "strong" ? "strong" : (shown == "weak" ? "weak" : "neutral")
    if shown == "mid" { return }
    emit(.tell(seatId: seat.id,
               line: tellLine(genId: seat.genId, category: tellCategory(shown, actual), traits: seat.persona),
               note: (shown == "strong" ? strongText : weakText) + recordSuffix(seat),
               tone: "tell"))
  }

  func recordSuffix(_ seat: Seat) -> String {
    guard let genId = seat.genId, let rec = ProgressStore.shared.tellRecord(genId), rec.n > 0 else { return "" }
    return " · \(L("tell.read"))\(rec.hit)/\(rec.n)"
  }

  func codexFromShowdown(_ seat: Seat, handName: String) {
    var seen = Set<String>()
    var entries: [TellRecord] = []
    for entry in seat.tellLog {
      let key = "\(entry.kind):\(entry.shown):\(entry.actual)"
      if seen.contains(key) { continue }
      seen.insert(key)
      entries.append(entry)
    }
    guard !entries.isEmpty else { return }
    let tells = seat.gen?["tells"]
    let strongText = tells?["strong"].string ?? "右手护住筹码堆"
    let weakText = tells?["weak"].string ?? "左手抚上瓷面"
    let intentNotes = GameData.shared.telllines["INTENT_NOTES"]
    let who = opponents.count == 1 ? L("tell.he") : seat.name
    var rows: [String] = []
    for entry in entries {
      let isIntent = entry.kind == "intent"
      let truth = entry.actual == "strong" ? L("tell.strongHand") : entry.actual == "weak" ? L("tell.weakHand") : L("tell.midHand")
      let hit = entry.shown == entry.actual
      let desc = isIntent ? (intentNotes[entry.shown].string ?? "") : (entry.shown == "strong" ? strongText : weakText)
      rows.append("「\(desc)」 → \(isIntent ? L("tell.acting") : "\(truth) \(hit ? "✓ \(L("tell.hit"))" : "✗ \(L("tell.fake"))")")")
    }
    emit(.codex("\(L("odds.hand")) \(handNum) · \(who)\(L("tell.shows"))\(handName)\n" + rows.joined(separator: "\n")))
    let last = entries[entries.count - 1]
    let lastHit = last.shown == last.actual
    let lastIsIntent = last.kind == "intent"
    let lastDesc = lastIsIntent ? (intentNotes[last.shown].string ?? "") : (last.shown == "strong" ? strongText : weakText)
    let lastTruth = last.actual == "strong" ? L("tell.strongHand") : last.actual == "weak" ? L("tell.weakHand") : L("tell.midHand")
    if opponents.count == 1 {
      let line = lastIsIntent ? L("tell.exposed") : (lastHit ? L("tell.readRight") : L("tell.fooled"))
      let note = "\(lastIsIntent ? L("tell.wasActing") : "「\(lastDesc)」→ \(lastTruth)") · \(lastHit ? L("tell.youReadRight") : L("tell.isFake"))"
      emit(.tell(seatId: seat.id, line: line, note: note, tone: lastHit ? "verdict-hit" : "verdict-lie"))
    } else {
      emit(.banner(lastHit ? "\(L("tell.readRight")) · \(seat.name)" : "\(L("tell.fooledYou")) · \(seat.name)",
                   lastIsIntent ? L("tell.wasActing") : "「\(lastDesc)」→ \(lastTruth)"))
    }
    for entry in entries {
      if let genId = seat.genId {
        ProgressStore.shared.annalsTell(genId, shown: entry.shown, hit: entry.shown == entry.actual)
      }
    }
  }

  // MARK: 士气

  func tiltOf(_ seat: Seat) -> Int { max(0, min(3, -seat.morale)) }

  func bumpMorale(_ seat: Seat, _ amount: Int) {
    let before = seat.morale
    seat.morale = max(-3, min(2, seat.morale + amount))
    if seat.morale != before {
      emit(.morale(seatId: seat.id, from: before, to: seat.morale))
      if tiltOf(seat) >= 2 {
        seat.bubble = bark(seat, "tilt", L("line.tiltDefault"))
      }
    }
  }

  func bark(_ seat: Seat, _ key: String, _ fallback: String) -> String {
    seat.gen?["barks"][key].string ?? fallback
  }

  func updateMorale() {
    let bb = blinds[1]
    for seat in opponents where seat.stack > 0 {
      let net = seat.stack - seat.handStartStack
      if net < 0 {
        seat.lossStreak += 1
        if net <= -max(200, bb * 8) { bumpMorale(seat, -2) }
        else if net <= -bb * 4 { bumpMorale(seat, -1) }
        if seat.lossStreak >= 3 { bumpMorale(seat, -1); seat.lossStreak = 0 }
      } else if net > 0 {
        seat.lossStreak = 0
        if net >= bb * 8 { bumpMorale(seat, 1) }
      }
    }
  }

  // MARK: 结算

  func finishHand() async {
    guard let H else { return }
    let live = liveSeats(H.seats)
    var settled: SettleResult
    if live.count <= 1 {
      settled = (try? settleHand(H)) ?? SettleResult(awards: [:], pots: [], before: 0, after: 0)
      let winner = live.first
      let pot = potTotal(H.seats)
      let name = winner?.isHero == true ? L("you") : (winner?.name ?? "")
      emit(.banner(opponents.count == 1 && winner?.isHero == true ? L("banner.heFolded") : "\(name) \(L("banner.takesPot"))", "\(L("term.pot")) \(pot)"))
    } else {
      // 摊牌
      for seat in live where !seat.isHero {
        let s = seatById(seat.id)
        emit(.showdownStart(seatId: seat.id, hole: seat.hole))
      }
      await wait(1.0)
      var scores: [String: [Int]] = [:]
      for seat in live {
        let s = seatById(seat.id)
        let ev = evaluate7(seat.hole + board)
        scores[seat.id] = ev.score
        if !seat.isHero {
          codexFromShowdown(s, handName: ev.name)
          s.showdownName = ev.name
        }
      }
      await wait(0.4)
      settled = (try? settleHand(H, scores)) ?? SettleResult(awards: [:], pots: [], before: 0, after: 0)
      let winners = Array(Set(settled.pots.flatMap { ($0["winners"] as? [String]) ?? [] }))
      for seat in live where !seat.isHero {
        let s = seatById(seat.id)
        s.showdownVerdict = winners.contains(seat.id) ? "win" : "lose"
      }
      if opponents.count == 1 {
        let cmp = live.contains(where: { $0.isHero }) && live.contains(where: { !$0.isHero })
          ? compareScore(scores["player"]!, scores["opponent"]!) : 0
        if cmp > 0 { emit(.banner(evaluate7(hero.hole + board).name, "\(L("banner.youWinPot")) \(settled.awards["player"] ?? 0)")) }
        else if cmp < 0 { emit(.banner(evaluate7(opponents[0].hole + board).name, "\(L("banner.heWinsPot")) \(settled.awards["opponent"] ?? 0)")) }
        else { emit(.banner(L("banner.splitPot"), L("banner.sameHand"))) }
      } else {
        let summary = winners.map { id in
          let seat = seatById(id)
          let hand = scores[id].map { _ in evaluate7(seat.hole + board).name } ?? ""
          return "\(seat.isHero ? L("you") : seat.name)\(hand.isEmpty ? "" : "·\(hand)") +\(settled.awards[id] ?? 0)"
        }.joined(separator: " · ")
        emit(.banner(L("banner.showdown"), summary))
      }
    }
    let pots = settled.pots.map { p in
      PotView(amount: p["amount"] as? Int ?? 0,
             eligible: (p["eligible"] as? [String]) ?? [],
             winners: (p["winners"] as? [String]) ?? [],
             refund: (p["refund"] as? Bool) ?? false)
    }
    // 退款说明
    let refunds = pots.filter { $0.refund && $0.amount > 0 }
    if !refunds.isEmpty {
      let text = refunds.map { r in
        let seat = seatById(r.eligible.first ?? "")
        return "\(seat.isHero ? L("you") : seat.name) +\(r.amount)"
      }.joined(separator: " · ")
      emit(.banner(L("banner.refundTitle"), "\(L("banner.refundOf")) \(text)"))
    }
    emit(.settle(awards: settled.awards, pots: pots))
    updateMorale()
    for seat in seats { seat.folded = false; seat.bet = 0; seat.committed = 0 }
    for seat in opponents where seat.stack <= 0 {
      emit(.eliminated(seatId: seat.id))
    }
    self.H = nil
    if hero.stack <= 0 {
      over = true
      emit(.end(win: false, finalStack: 0))
      return
    }
    if opponents.allSatisfy({ $0.stack <= 0 }) {
      over = true
      if config.boss {
        emit(.banner(L("banner.gateBroken"), L("banner.gateBroken.sub")))
      } else {
        emit(.banner(opponents.count > 1 ? L("banner.allLeft") : L("banner.heBusted"), L("banner.allLeft.sub")))
      }
      await wait(1.2)
      emit(.end(win: true, finalStack: hero.stack))
      return
    }
    button = nextButton(seats, button)
    await wait(0.8)
  }

  // MARK: 攻心/观星(每手一次)

  public func taunt() {
    guard !taunted, !over, H != nil else { return }
    var seat = opponents.first { $0.id == selectedSeat && $0.stack > 0 && !$0.folded }
      ?? opponents.first { $0.stack > 0 && !$0.folded }
    guard let target = seat else { return }
    taunted = true
    if config.zhiZi {
      let actual = target.tell?.actual
      let text = actual.map { "\(L("zhiZi.prefix")) \(L("zhiZi.\($0)"))" } ?? L("zhiZi.unknown")
      emit(.zhiZi(seatId: target.id, text: text))
      return
    }
    if config.rule.tauntImmune || target.persona.tauntMult == 0 {
      target.bubble = bark(target, "taunt", L("line.tauntImmune"))
      return
    }
    target.morale = max(-3, Int(Double(target.morale) - target.persona.tauntMult.rounded()))
    let tilted = tiltOf(target) >= 2
    target.bubble = tilted ? bark(target, "tilt", L("line.tiltDefault")) : bark(target, "taunt", L("line.tauntDefault"))
    emit(.taunted(seatId: target.id, line: target.bubble ?? "", tilted: tilted))
  }
}

// MARK: 破绽词池(移植 tell-lines.js 选词)

public func tellCategory(_ shown: String, _ actual: String) -> String {
  if shown == "strong" { return actual == "strong" ? "strongTrue" : "strongFake" }
  return actual == "weak" ? "weakTrue" : "weakFake"
}

public func tellLine(genId: String?, category: String, traits persona: Persona) -> String {
  let pools = GameData.shared.telllines
  if let genId, let famous = pools["FAMOUS"][genId][category].value as? [Any],
     !famous.isEmpty {
    let idx = Int(Double.random(in: 0..<1) * Double(famous.count)) % famous.count
    return famous[idx] as? String ?? ""
  }
  // 原型分档:武勇压智谋为猛将,智谋压武勇为谋士,双高为统帅,其余宿将
  let wu = persona.traits.武勇, zhi = persona.traits.智谋
  let arch: String
  if wu >= 70 && zhi >= 70 { arch = "commander" }
  else if wu > zhi + 15 { arch = "fierce" }
  else if zhi > wu + 15 { arch = "sage" }
  else { arch = "veteran" }
  let pool = pools["ARCHETYPE"][arch][category]
  if let arr = pool.value as? [Any], !arr.isEmpty {
    let idx = Int(Double.random(in: 0..<1) * Double(arr.count)) % arr.count
    return arr[idx] as? String ?? ""
  }
  return ""
}

// MARK: 事件桥与 UI 支撑

import Combine

public final class BattleEventBridge: ObservableObject {
  public let bannerPub = PassthroughSubject<(String, String), Never>()
  public let codexPub = PassthroughSubject<String, Never>()
}

extension BattleEngine {

  static func makeBridgeEmitter() -> (BattleEventBridge, (BattleEvent) -> Void) {
    let bridge = BattleEventBridge()
    return (bridge, { event in
      Task { @MainActor in
        switch event {
        case .banner(let main, let sub):
          bridge.bannerPub.send((main, sub))
        case .codex(let entry):
          bridge.codexPub.send(entry)
        default:
          break
        }
      }
    })
  }

  /// 席位角色标签(庄/小盲/大盲)
  public func roles(for seat: Seat) -> [String] {
    guard let H, let pos = H.seats.firstIndex(where: { $0.id == seat.id }) else { return [] }
    var out: [String] = []
    if pos == H.button { out.append(L("role.button")) }
    if pos == H.sb { out.append("\(L("role.sb")) \(blinds[0])") }
    if pos == H.bb { out.append("\(L("role.bb")) \(blinds[1])") }
    return out
  }

  public func moraleBadges(for seat: Seat) -> Int {
    seat.morale < 0 ? max(1, -seat.morale) : 0
  }

  public var heroWinHighlight: Bool { false }
}
