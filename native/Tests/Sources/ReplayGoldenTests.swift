// ReplayGoldenTests.swift —— 整局复放:Swift 引擎 vs 原版 JS 引擎逐步对拍。
// 对拍内容:盲注升级、发牌(含烧牌)、逐条 AI 决策(座位/街/类型/金额)、
// 公共牌推进、结算(各席净收、底池前后)、士气变动、终局筹码。
import XCTest
@testable import SanguoWeizhu

final class ReplayGoldenTests: XCTestCase {

  func testReplays() throws {
    let g = try loadGolden("replays")
    var totalDecisions = 0
    var replayCount = 0
    var handCount = 0

    for replay in g.array {
      replayCount += 1
      let tag = replay["tag"].string!
      let config = replay["config"]
      let traitSets: [[String: Int]] = config["traitSets"].array.map { ts in
        var t: [String: Int] = [:]
        for (k, v) in ts.dict {
          if let n = (v as? NSNumber)?.intValue { t[k] = n }
        }
        return t
      }
      let traitsIdx = config["traitsIdx"].intArray ?? []
      let blinds0 = config["blinds0"].intArray ?? [10, 20]
      let escalateEvery = config["escalateEvery"].int ?? 4
      let stacks = replay["stacks"].intArray ?? []
      let seed = replay["seed"].string!
      let ruleCornered = config["rule"]["cornered"].bool ?? false

      final class RSeat {
        let id: String
        let isHero: Bool
        let persona: Persona
        let seat: Seat
        var morale = 0
        var lossStreak = 0
        var slowplayed = false
        var bluffLine = false
        let read = ReadTracker()
        init(id: String, isHero: Bool, persona: Persona, seat: Seat) {
          self.id = id
          self.isHero = isHero
          self.persona = persona
          self.seat = seat
        }
      }
      var rseats: [RSeat] = []
      for (i, stack) in stacks.enumerated() {
        let id = i == 0 ? "player" : (i == 1 ? "opponent" : "opponent-\(i + 1)")
        let persona = makePersona(traitSets[traitsIdx[i]] ?? [:])
        let engineSeat = Seat(id: id, isHero: i == 0, name: id, stack: stack,
                              persona: persona, gen: nil, genId: nil, skin: "default", morale: 0)
        rseats.append(RSeat(id: id, isHero: i == 0, persona: persona, seat: engineSeat))
      }
      let seats: [Seat] = rseats.map { $0.seat }
      let tiltOf = { (rs: RSeat) in max(0, min(3, -rs.morale)) }
      let bump = { (rs: RSeat, amount: Int) in
        rs.morale = max(-3, min(2, rs.morale + amount))
      }
      var button = 0
      var handNum = 0

      for hand in replay["hands"].array {
        handNum += 1
        handCount += 1
        let events = hand.array
        let header = events[0]
        let handTag = "\(tag) \(header["h"].string ?? "h\(handNum)")"

        // —— 盲注:原版每 4 手 ×1.5,再按 5 取整
        let level = header["level"].int ?? min(6, (handNum - 1) / escalateEvery)
        let m = pow(1.5, Double(level))
        let SB = Int(jsRound(Double(blinds0[0]) * m / 5)) * 5
        let BB = Int(jsRound(Double(blinds0[1]) * m / 5)) * 5
        XCTAssertEqual([SB, BB], header["blinds"].intArray ?? [], "\(handTag) blinds")
        XCTAssertEqual(button, header["button"].int ?? button, "\(handTag) button")

        // —— 洗牌与发牌
        var rng = Mulberry32(seed: hashSeed("\(seed)#\(handNum)"))
        var deck = makeDeck()
        shuffle(&deck, rng: &rng)
        var ptr = 0
        for rs in rseats {
          rs.slowplayed = false
          rs.bluffLine = false
        }
        let H = try createHand(seats, button: button, blinds: [SB, BB])
        H.board = []
        for seat in H.seats {
          seat.hole = [deck[ptr], deck[ptr + 1]]
          ptr += 2
        }
        let holeDict = header["hole"].dict
        for seat in H.seats {
          XCTAssertEqual(seat.hole, JSON(holeDict[seat.id] ?? NSNull()).intArray ?? [],
                         "\(handTag) hole \(seat.id)")
        }

        // —— 黄金事件分桶
        let actionEvents = events.filter { !$0["d"].isNull && !$0["s"].isNull }
        let boardEvents = events.filter { !$0["board"].isNull }
        let settleEvent = events.first { !$0["settle"].isNull }
        let moraleEvent = events.first { !$0["morale"].isNull }
        var actionIdx = 0

        func act(_ rs: RSeat, _ street: Int) throws {
          let view = try actionView(H, rs.id)
          var personality = rs.persona.ai
          personality.tilt = Double(tiltOf(rs))
          personality.morale = Double(rs.morale)
          if ruleCornered && rs.seat.stack < rs.seat.initialStack * 3 / 10 {
            personality.aggr *= 1.4
          }
          var input = AIDecideInput(street: street, hole: rs.seat.hole, board: H.board,
                                    toCall: view.toCall, pot: view.pot, stack: view.stack,
                                    minRaise: view.minRaise, raisesLeft: view.raisesLeft)
          input.opponents = view.opponents
          input.canRaise = view.canRaise
          input.personality = personality
          input.villain = rs.read.view()
          input.slowplayed = rs.slowplayed
          input.bluffLine = rs.bluffLine
          if seats.count > 2 { input.equityRuns = 96 }
          let decision = aiDecide(input, rng: &rng)

          // 与黄金决策逐条对拍
          if actionIdx < actionEvents.count {
            let golden = actionEvents[actionIdx]
            let gd = golden["d"]
            XCTAssertEqual(golden["s"].string, rs.id, "\(handTag) #\(actionIdx) actor")
            XCTAssertEqual(golden["st"].int, street, "\(handTag) #\(actionIdx) street")
            XCTAssertEqual(decision.type, gd["type"].string, "\(handTag) #\(actionIdx) type")
            if let gAmt = gd["amount"].int {
              XCTAssertEqual(decision.amount, gAmt, "\(handTag) #\(actionIdx) amount")
            }
            if let gBluff = gd["bluff"].bool {
              XCTAssertEqual(decision.bluff ?? false, gBluff, "\(handTag) #\(actionIdx) bluff")
            }
            actionIdx += 1
          } else {
            XCTFail("\(handTag) 引擎多出决策 \(decision.type) by \(rs.id)")
          }

          rs.slowplayed = decision.trapped ?? false
          rs.bluffLine = (decision.type == "bet" || decision.type == "raise") && (decision.bluff ?? false)
          _ = try applyAction(H, rs.id, decision)
          if rs.isHero {
            let tracked = decision.type == "allin" ? (view.stack <= view.toCall ? "call" : "raise") : decision.type
            for other in rseats where !other.isHero { other.read.track(view.toCall, tracked) }
          }
          totalDecisions += 1
        }

        func playRound(_ street: Int) throws {
          beginRound(H, street)
          while !H.roundComplete {
            guard let actorId = H.actor, let rs = rseats.first(where: { $0.id == actorId }) else { break }
            try act(rs, street)
          }
          closeRound(H)
        }

        try playRound(0)
        for street in [1, 2, 3] {
          if liveSeats(H.seats).count <= 1 { break }
          ptr += 1 // 烧牌
          let count = street == 1 ? 3 : 1
          for _ in 0..<count {
            H.board.append(deck[ptr])
            ptr += 1
          }
          // 公共牌对照
          if street - 1 < boardEvents.count {
            XCTAssertEqual(H.board, boardEvents[street - 1]["board"].intArray ?? [],
                           "\(handTag) board after street \(street)")
          }
          try playRound(street)
        }

        let live = liveSeats(H.seats)
        let settled: SettleResult
        if live.count == 1 {
          settled = try settleHand(H)
        } else {
          var scores: [String: [Int]] = [:]
          for seat in live { scores[seat.id] = evaluate7(seat.hole + H.board).score }
          settled = try settleHand(H, scores)
        }

        // —— 结算对照
        if let settleEvent {
          let expAwards = settleEvent["settle"]["awards"].dict
          for seat in seats {
            let got = settled.awards[seat.id] ?? 0
            let exp = (expAwards[seat.id] as? NSNumber)?.intValue ?? 0
            XCTAssertEqual(got, exp, "\(handTag) award \(seat.id)")
          }
          XCTAssertEqual(settled.before, settleEvent["settle"]["before"].int ?? -1, "\(handTag) before")
          XCTAssertEqual(settled.after, settleEvent["settle"]["after"].int ?? -1, "\(handTag) after")
        } else {
          XCTFail("\(handTag) 缺少 settle 黄金事件")
        }

        // —— 士气
        for rs in rseats where rs.seat.stack > 0 {
          let net = rs.seat.stack - rs.seat.handStartStack
          if net < 0 {
            rs.lossStreak += 1
            if net <= -max(200, BB * 8) { bump(rs, -2) }
            else if net <= -BB * 4 { bump(rs, -1) }
            if rs.lossStreak >= 3 { bump(rs, -1); rs.lossStreak = 0 }
          } else if net > 0 {
            rs.lossStreak = 0
            if net >= BB * 8 { bump(rs, 1) }
          }
        }
        if let moraleEvent {
          for entry in moraleEvent["morale"].array {
            guard let id = entry["s"].string,
                  let rs = rseats.first(where: { $0.id == id }) else { continue }
            XCTAssertEqual(rs.morale, entry["to"].int ?? rs.morale, "\(handTag) morale \(id)")
          }
        }
        XCTAssertEqual(actionIdx, actionEvents.count,
                       "\(handTag) 决策条数 \(actionIdx) vs 黄金 \(actionEvents.count)")

        if seats.contains(where: { $0.stack <= 0 }) { break }
        button = nextButton(seats, button)
      }

      // —— 终局筹码
      let finals = replay["finalStacks"].stringArray
      XCTAssertFalse(finals.isEmpty, "\(tag) 缺少 finalStacks")
      for fin in finals {
        let parts = fin.split(separator: ":")
        guard parts.count == 2 else { continue }
        let id = String(parts[0])
        let value = Int(parts[1]) ?? -1
        let seat = seats.first { $0.id == id }
        XCTAssertEqual(seat?.stack ?? -1, value, "\(tag) final stack \(id)")
      }
    }

    XCTAssertEqual(replayCount, 5, "复放场景应为 5 场")
    XCTAssertGreaterThan(handCount, 10, "复放应覆盖多手牌")
    XCTAssertGreaterThan(totalDecisions, 100, "复放应覆盖足量决策")
  }
}
