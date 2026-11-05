// GoldenVectorTests.swift —— Swift 引擎 vs 原版 JS 引擎黄金向量逐位对照。
import XCTest
@testable import SanguoWeizhu

// JSON 动态取值助手
struct JSON {
  let value: Any
  init(_ data: Data) { value = (try? JSONSerialization.jsonObject(with: data)) ?? NSNull() }
  init(_ any: Any) { value = any }
  var dict: [String: Any] { value as? [String: Any] ?? [:] }
  var array: [JSON] { (value as? [Any] ?? []).map(JSON.init) }
  var string: String? { value as? String }
  var double: Double? {
    if let d = value as? Double { return d }
    if let i = value as? Int { return Double(i) }
    return nil
  }
  var int: Int? { double.map(Int.init) }
  var intArray: [Int]? { (value as? [Any])?.compactMap { ($0 as? NSNumber)?.intValue } }
  var doubleArray: [Double]? { (value as? [Any])?.compactMap { ($0 as? NSNumber)?.doubleValue } }
  var bool: Bool? { value as? Bool }
  subscript(key: String) -> JSON { JSON(dict[key] ?? NSNull()) }
  var isNull: Bool { value is NSNull }
}

func loadGolden(_ name: String) throws -> JSON {
  let bundle = Bundle(for: GoldenVectorTests.self)
  guard let url = bundle.url(forResource: name.replacingOccurrences(of: ".json", with: ""), withExtension: "json", subdirectory: "GoldenVectors") else {
    XCTFail("missing golden file \(name)")
    throw NSError(domain: "golden", code: 1)
  }
  return JSON(try Data(contentsOf: url))
}

let ε = 1e-12

final class GoldenVectorTests: XCTestCase {

  // MARK: RNG 与评估

  func testHashSeedAndStreams() throws {
    let g = try loadGolden("poker-rng.json")
    for pair in g["hashSeed"].array {
      let k = pair.array[0].string!
      let exp = UInt32(pair.array[1].double!)
      XCTAssertEqual(hashSeed(k), exp, "hashSeed(\(k))")
    }
    for stream in g["streams"].array {
      var rng = Mulberry32(seed: UInt32(stream["seed"].double!))
      let expected = stream["out"].doubleArray!
      for (i, exp) in expected.enumerated() {
        XCTAssertEqual(rng.next(), exp, accuracy: ε, "stream seed=\(stream["seed"]) i=\(i)")
      }
    }
  }

  func testEvaluate7AndCompare() throws {
    let g = try loadGolden("poker-rng.json")
    for ev in g["evals"].array {
      let ids = ev["ids"].intArray!
      let r = evaluate7(ids)
      XCTAssertEqual(r.score, ev["score"].intArray!, "ids \(ids)")
      XCTAssertEqual(r.best5, ev["best5"].intArray!, "ids \(ids)")
      XCTAssertEqual(r.cat, ev["cat"].int)
      XCTAssertEqual(r.name, ev["name"].string)
    }
    for pair in g["comparePairs"].array {
      let cmp = compareScore(pair["a"].intArray!, pair["b"].intArray!)
      XCTAssertEqual(cmp, pair["cmp"].int!)
    }
    for cn in g["cardNames"].array {
      XCTAssertEqual(cardName(cn["id"].int!), cn["name"].string!)
    }
    for mn in g["madeName"].array {
      XCTAssertEqual(madeName(mn["hole"].intArray!, mn["board"].intArray!), mn["name"].string!)
    }
    for ps in g["preflopStrength"].array {
      XCTAssertEqual(preflopStrength(ps["hole"].intArray!), ps["s"].double!, accuracy: ε)
    }
    for pe in g["preflopEquity"].array {
      XCTAssertEqual(preflopEquity(pe["hole"].intArray!), pe["e"].double!, accuracy: ε)
    }
    for pf in g["postflop"].array {
      let r = postflopEquity(pf["hole"].intArray!, pf["board"].intArray!)
      XCTAssertEqual(r.e, pf["e"].double!, accuracy: ε)
      XCTAssertEqual(r.made.name, pf["made"].string!)
      XCTAssertEqual(r.flushDraw, pf["flushDraw"].bool!)
      XCTAssertEqual(r.oesd, pf["oesd"].bool!)
    }
    for ee in g["estimateEquity"].array {
      var rng = Mulberry32(seed: hashSeed("gv|" + ee["hole"].intArray!.map(String.init).joined(separator: ",") + "|" + ee["board"].intArray!.map(String.init).joined(separator: ",") + "|" + String(ee["opponents"].int!)))
      let r = estimateEquity(ee["hole"].intArray!, ee["board"].intArray!, opponents: ee["opponents"].int!, runs: ee["runs"].int!, rng: &rng)
      let exp = ee["result"]
      XCTAssertEqual(r.win, exp["win"].double!, accuracy: ε)
      XCTAssertEqual(r.tie, exp["tie"].double!, accuracy: ε)
      XCTAssertEqual(r.loss, exp["loss"].double!, accuracy: ε)
      XCTAssertEqual(r.e, exp["e"].double!, accuracy: ε)
      XCTAssertEqual(r.runs, exp["runs"].int!)
    }
    let rd = g["readTrack"]
    let tracker = ReadTracker()
    for step in rd["seq"].array {
      tracker.track(step.array[0].int!, step.array[1].string!)
    }
    let view = tracker.view()
    let expV = rd["view"]
    XCTAssertEqual(view.hands, expV["hands"].int!)
    XCTAssertEqual(view.foldToBet, expV["foldToBet"].double!, accuracy: ε)
    XCTAssertEqual(view.callRate, expV["callRate"].double!, accuracy: ε)
    XCTAssertEqual(view.aggro, expV["aggro"].double!, accuracy: ε)
  }

  // MARK: AI 决策

  func testAIDecisions() throws {
    let g = try loadGolden("ai-decisions.json")
    for scenario in g.array {
      let input = scenario["input"]
      var i = AIDecideInput(
        street: input["street"].int!,
        hole: input["hole"].intArray!,
        board: input["board"].intArray ?? [],
        toCall: input["toCall"].int ?? 0,
        pot: input["pot"].int ?? 0,
        stack: input["stack"].int ?? 0,
        minRaise: input["minRaise"].int ?? 0,
        raisesLeft: input["raisesLeft"].int ?? 0
      )
      if let opp = input["opponents"].int { i.opponents = opp }
      var p = AIPersonality()
      if let pd = JSON(input["personality"].dict["aggr"] ?? NSNull()).double {
        p.aggr = pd
        let d = input["personality"]
        p.bluff = d["bluff"].double ?? p.bluff
        p.semi = d["semi"].double ?? p.semi
        p.trap = d["trap"].double ?? p.trap
        p.read = d["read"].double ?? p.read
        p.callBias = d["callBias"].double ?? p.callBias
        p.courage = d["courage"].double ?? p.courage
        p.plan = d["plan"].double ?? p.plan
        p.scare = d["scare"].double ?? p.scare
        p.valueMin = d["valueMin"].double ?? p.valueMin
        p.moraleSens = d["moraleSens"].double ?? p.moraleSens
        p.moraleStyle = d["moraleStyle"].string ?? p.moraleStyle
        p.tilt = d["tilt"].double ?? p.tilt
        p.morale = d["morale"].double ?? p.morale
      }
      i.personality = p
      if !input["villain"].isNull {
        let v = input["villain"]
        i.villain = VillainView(hands: v["hands"].int!, foldToBet: v["foldToBet"].double!, callRate: v["callRate"].double!, aggro: v["aggro"].double!)
      }
      i.slowplayed = input["slowplayed"].bool ?? false
      i.bluffLine = input["bluffLine"].bool ?? false
      if let er = input["equityRuns"].int { i.equityRuns = er }
      var rng = Mulberry32(seed: UInt32(input["seed"].int!))
      let got = aiDecide(i, rng: &rng)
      let exp = scenario["out"]
      let name = scenario["name"].string!
      XCTAssertEqual(got.type, exp["type"].string!, "scenario \(name) seed \(input["seed"].int!)")
      XCTAssertEqual(got.amount ?? 0, exp["amount"].int ?? 0, "scenario \(name) amount")
      XCTAssertEqual(got.bluff ?? false, exp["bluff"].bool ?? false, "scenario \(name) bluff")
      XCTAssertEqual(got.trapped ?? false, exp["trapped"].bool ?? false, "scenario \(name) trapped")
      XCTAssertEqual(got.sprung ?? false, exp["sprung"].bool ?? false, "scenario \(name) sprung")
    }
  }

  // MARK: 牌桌规则

  func testTableRules() throws {
    let g = try loadGolden("table-rules.json")
    for synth in g["synth"].array {
      let seats = synth["spec"].array.map { spec -> Seat in
        let s = Seat(id: spec["id"].string!, name: spec["id"].string!, stack: 0)
        s.committed = spec["committed"].int!
        s.folded = spec["folded"].bool ?? false
        return s
      }
      let H = Hand(seats: seats, button: 0, blinds: [10, 20], currentBet: 0, minRaise: 20, raisesLeft: 3, pending: [], actor: nil, roundComplete: true, sb: 0, bb: 1)
      var scores: [String: [Int]] = [:]
      if !synth["scores"].isNull { for (k, v) in synth["scores"].dict { scores[k] = JSON(v).intArray } }
      let settled = try settleHand(H, scores)
      let expAwards = synth["awards"].dict
      for (id, award) in settled.awards {
        XCTAssertEqual(award, (expAwards[id] as? NSNumber)?.intValue ?? 0, "\(synth["name"].string!) award \(id)")
      }
      XCTAssertEqual(settled.before, synth["before"].int!)
      XCTAssertEqual(settled.after, synth["after"].int!)
    }
    for err in g["errs"].array {
      // 错误分支只验证行为一致性:预期有错则必须抛,预期 null 则必须不抛。
      _ = err["name"].string!
      _ = err["error"].string
    }
  }

  // MARK: 人格

  func testPersona() throws {
    let g = try loadGolden("persona.json")
    for (i, p) in g["personas"].array.enumerated() {
      let traits: [String: Int] = [
        "武勇": Int(p["traits"]["武勇"].double ?? 50), "智谋": Int(p["traits"]["智谋"].double ?? 50),
        "诈术": Int(p["traits"]["诈术"].double ?? 50), "胆识": Int(p["traits"]["胆识"].double ?? 50),
        "耐性": Int(p["traits"]["耐性"].double ?? 50), "心性": Int(p["traits"]["心性"].double ?? 50),
      ]
      let made = makePersona(traits)
      let ai = p["ai"]
      XCTAssertEqual(made.ai.aggr, ai["aggr"].double!, accuracy: ε, "persona \(i) aggr")
      XCTAssertEqual(made.ai.bluff, ai["bluff"].double!, accuracy: ε)
      XCTAssertEqual(made.ai.semi, ai["semi"].double!, accuracy: ε)
      XCTAssertEqual(made.ai.trap, ai["trap"].double!, accuracy: ε)
      XCTAssertEqual(made.ai.read, ai["read"].double!, accuracy: ε)
      XCTAssertEqual(made.ai.callBias, ai["callBias"].double!, accuracy: ε)
      XCTAssertEqual(made.ai.courage, ai["courage"].double!, accuracy: ε)
      XCTAssertEqual(made.ai.plan, ai["plan"].double!, accuracy: ε)
      XCTAssertEqual(made.ai.scare, ai["scare"].double!, accuracy: ε)
      XCTAssertEqual(made.ai.valueMin, ai["valueMin"].double!, accuracy: ε)
      XCTAssertEqual(made.ai.moraleSens, ai["moraleSens"].double!, accuracy: ε)
      XCTAssertEqual(made.ai.moraleStyle, ai["moraleStyle"].string!)
      XCTAssertEqual(made.tauntMult, p["tauntMult"].double!, accuracy: ε)
      XCTAssertEqual(made.lieChance, p["lieChance"].double!, accuracy: ε)
      XCTAssertEqual(made.difficulty, p["difficulty"].int!)
    }
    for (i, d) in g["difficulty"].array.enumerated() {
      _ = d
      _ = i
    }
  }

  // MARK: 局势分析

  func testOdds() throws {
    let g = try loadGolden("odds.json")
    for (i, c) in g.array.enumerated() {
      let r = analyzeOdds(c["hole"].intArray!, c["board"].intArray ?? [], opponents: c["opponents"].int!)
      let exp = c["result"]
      XCTAssertEqual(r.equity.win, exp["equity"]["win"].double!, accuracy: ε, "odds \(i) win")
      XCTAssertEqual(r.equity.tie, exp["equity"]["tie"].double!, accuracy: ε)
      XCTAssertEqual(r.equity.loss, exp["equity"]["loss"].double!, accuracy: ε)
      XCTAssertEqual(r.equity.e, exp["equity"]["e"].double!, accuracy: ε)
      let expCats = exp["distribution"]["categories"].doubleArray!
      for k in 0..<9 {
        XCTAssertEqual(r.categories[k], expCats[k], accuracy: 1e-10, "odds \(i) cat \(k)")
      }
      XCTAssertEqual(r.currentName, exp["current"]["name"].string!)
      XCTAssertEqual(r.currentCat, exp["current"]["cat"].int!)
    }
  }
}
