// Encounters.swift + Apocrypha.swift —— 遭遇归一化与残卷无终稿(移植 encounters.js / apocrypha.js)。
import Foundation

public func rosterOf(_ cfg: Dyn) -> [Dyn] {
  let opps = cfg["opponents"]
  if let arr = opps.value as? [Any], !arr.isEmpty {
    return arr.map(Dyn.init)
  }
  return [cfg]
}

public func roundConfig(_ cfg: Dyn, _ round: Int) -> Dyn {
  guard let rounds = cfg["rounds"].value as? [Any], round >= 1, round <= rounds.count else { return cfg }
  var merged = cfg.dict
  let override = (rounds[round - 1] as? [String: Any]) ?? [:]
  for (k, v) in override { merged[k] = v }
  if override["traits"] == nil { merged["traits"] = cfg["traits"].value }
  merged["rounds"] = nil
  return Dyn(merged)
}

public struct Encounter {
  public var kind: String  // skirmish | boss
  public var cfg: Dyn
  public var round: Int
}

public func chapterEncounters(_ chapter: Dyn) -> [Encounter] {
  var out: [Encounter] = []
  let skirmish = chapter["skirmish"]
  if !skirmish.isNull { out.append(Encounter(kind: "skirmish", cfg: skirmish, round: 1)) }
  let boss = chapter["boss"]
  if !boss.isNull {
    let ruleGauntlet = chapter["rule"]["gauntlet"].int ?? 1
    for round in 1...max(1, ruleGauntlet) {
      let cfg = roundConfig(boss, round)
      for opponent in rosterOf(cfg) {
        out.append(Encounter(kind: "boss", cfg: opponent, round: round))
      }
    }
  }
  return out
}

// ---------- 残卷无终稿 ----------
// UI 文案经 L10n key 渲染(apoc.*);数组与 RNG 消费顺序不变,golden 安全。

let APOC_TITLES = ["风雪劫", "雾中约", "夜半局", "孤城计", "渡口灯", "残卷尾页", "驿亭对坐", "江雾残牌"]
let APOC_PLACES = ["虎牢道", "渭水", "乌林岸", "隆中径", "街亭道", "麦城道", "斜谷口", "濡须坞", "五丈原下", "白帝城头"]
let APOC_OMEN_NAMES = ["江雾四合", "天狼未陨", "粮道已通", "北风乍起", "残灯将尽", "驿马星动"]
let APOC_RULES: [(rule: [String: Any]?, text: String)] = [
  (nil, ""),
  (["lieMult": 1.6], "此页眼见未必为实:破绽假动作加多。"),
  (["gauntlet": 3], "连战三场,筹码一路相随。"),
  (["tauntImmune": true], "他不接话,也不动气——攻心无用。"),
]

public func genApocrypha(rng: inout some RngSource) -> Dyn {
  let gids = GameData.shared.generals.dictKeys
  let gid = gids[Int(rng.next() * Double(gids.count)) % gids.count]
  let r = APOC_RULES[Int(rng.next() * Double(APOC_RULES.count)) % APOC_RULES.count]
  let mapN = 3 + Int(rng.next() * 2) % 2
  let map = Array(APOC_PLACES.shuffled(using: &rng).prefix(mapN))
  let omenFx = Array(["supply", "sow", "keenEye", "raid"].shuffled(using: &rng).prefix(3))
  let omenNames = Array(APOC_OMEN_NAMES.shuffled(using: &rng).prefix(3))
  func clampTrait(_ v: Double) -> Int { Int(max(5, min(95, v))) }
  let bossTraits: [String: Any] = [
    "武勇": clampTrait(40 + rng.next() * 55), "智谋": clampTrait(40 + rng.next() * 55),
    "诈术": clampTrait(30 + rng.next() * 60), "胆识": clampTrait(40 + rng.next() * 50),
    "耐性": clampTrait(35 + rng.next() * 55), "心性": clampTrait(30 + rng.next() * 60),
  ]
  let gen = GameData.shared.general(gid)
  let suffix = String(format: "%06X", UInt32(rng.next() * 16777216.0))
  let tIdx = Int(rng.next() * Double(APOC_TITLES.count)) % APOC_TITLES.count
  // 生成后字符串经 L() 本地化;RNG 调用次数与顺序与原实现严格一致
  let mapL = map.map { L("apoc.place.\(APOC_PLACES.firstIndex(of: $0) ?? 0)") }
  let omenNamesL = omenNames.map { L("apoc.omen.\(APOC_OMEN_NAMES.firstIndex(of: $0) ?? 0)") }
  let rIdx = APOC_RULES.firstIndex { $0.text == r.text } ?? 0
  let chapter: [String: Any] = [
    "id": "apoc-\(suffix)", "apocrypha": true, "scroll": 0, "year": "",
    "name": "\(L("apoc.prefix")) · \(L("apoc.title.\(tIdx)"))",
    "type": "assault", "premise": L("apoc.premise"),
    "map": mapL,
    "skirmish": ["name": L("apoc.skirmishName"), "traits": ["武勇": 50, "智谋": 45, "诈术": 45, "胆识": 50, "耐性": 45, "心性": 45]],
    "boss": ["name": "\(gen?["name"].string ?? PL("apoc.oldFriend", "故人"))\(L("apoc.bossSuffix"))", "gen": gid, "traits": bossTraits, "stack": 800 + Int(rng.next() * 600)],
    "omens": (0..<3).map { ["n": omenNamesL[$0], "fx": omenFx[$0]] },
    "rule": r.rule ?? [:], "ruleText": rIdx == 0 ? "" : L("apoc.rule.\(rIdx)"),
    "history": L("apoc.history"), "yeshi": L("apoc.yeshi"),
    "note": L("apoc.note"), "defeat": L("apoc.defeat"),
  ]
  _ = rng.next()
  return Dyn(chapter)
}

extension Array {
  func shuffled<T: RngSource>(using rng: inout T) -> [Element] {
    var copy = self
    var i = copy.count - 1
    while i > 0 {
      let j = Int(Foundation.floor(rng.next() * Double(i + 1)))
      copy.swapAt(i, j)
      i -= 1
    }
    return copy
  }
}
