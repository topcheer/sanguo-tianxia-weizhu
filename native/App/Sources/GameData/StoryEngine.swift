// StoryEngine.swift —— 剧本解析:条件、场景、入场与牌局拍点(移植 story-engine.js)。
import Foundation

public let SPEAKERS: [String: String] = [
  "narrator": "旁白", "writer": "写卷人", "you": "你", "unknown": "？？？",
]

public func speakerName(_ id: String) -> String {
  if let s = SPEAKERS[id] { return PL("speaker.\(id)", s) }
  if let g = GameData.shared.general(id) { return g["name"].string ?? id }
  return id
}

public struct StoryContext {
  public var P: Progress
  public var chapter: Dyn?
  public var round: Int = 1
  public var handNum: Int = 1
  public var multi: Bool = false
  public var asZhuge: Bool = false
  public var omenFx: String? = nil
  public init(P: Progress, chapter: Dyn?) {
    self.P = P; self.chapter = chapter
  }
}

func isYeshiState(_ s: String) -> Bool { ["yeshi", "yeshiB", "yeshiAB"].contains(s) }

func conditionAtom(_ atom: String, _ ctx: StoryContext) -> Bool {
  if atom.isEmpty { return true }
  if atom.hasPrefix("!") { return !conditionAtom(String(atom.dropFirst()), ctx) }
  let parts = atom.split(separator: ":", maxSplits: 1).map(String.init)
  let kind = parts[0]
  let value = parts.count > 1 ? parts[1] : ""
  let sub = value.split(separator: ":", maxSplits: 1).map(String.init)
  let id = sub.first ?? ""
  let wanted = sub.count > 1 ? sub[1] : ""
  switch kind {
  case "page":
    let actual = ctx.P.pages[id] ?? "unread"
    return wanted == "yeshi" ? isYeshiState(actual) : actual == wanted
  case "choice":
    // JS: P.story?.choices?.[id] || P.pages?.[id]
    let actual = ctx.P.story.choices[id] ?? ctx.P.pages[id] ?? "unread"
    return wanted == "yeshi" ? isYeshiState(actual) : actual == wanted
  case "clue":
    return ctx.P.story.clues[value.isEmpty ? (ctx.chapter?["id"].string ?? "") : value] ?? false
  case "fact":
    return ctx.P.story.facts[value] ?? false
  case "seen":
    return (ctx.P.annals[value]?.seen ?? 0) > 0
  case "round":
    return Int(value) == ctx.round
  case "hand":
    return Int(value) == ctx.handNum
  case "multi":
    return ctx.multi
  case "single":
    return !ctx.multi
  case "asZhuge":
    return ctx.asZhuge
  case "omen":
    return ctx.omenFx == value
  default:
    return false
  }
}

public func matchesWhen(_ when: Dyn, _ ctx: StoryContext) -> Bool {
  if when.isNull { return true }
  if let s = when.string { return conditionAtom(s, ctx) }
  return when.array.allSatisfy { conditionAtom($0 as? String ?? "", ctx) }
}

public func linesFor(_ lines: [Dyn], _ ctx: StoryContext) -> [Dyn] {
  lines.filter { matchesWhen($0["when"], ctx) }
}

public func coldOpenFor(_ chapter: Dyn?, _ ctx: StoryContext) -> [Dyn] {
  guard let story = GameData.shared.storyOf(chapter?["id"].string ?? "") else { return [] }
  return linesFor(story["coldOpen"].array.map(Dyn.init), ctx)
}

public func mapSceneFor(_ chapter: Dyn?, _ node: Dyn) -> Dyn? {
  guard let story = GameData.shared.storyOf(chapter?["id"].string ?? "") else { return nil }
  let nodeCol = node["col"].int ?? -1
  let nodeId = node["id"].string ?? ""
  for scene in story["map"].array {
    let s = Dyn(scene)
    let sn = s["node"]
    if sn.int == nodeCol || sn.string == nodeId { return s }
  }
  return nil
}

public func introFor(_ chapter: Dyn?, _ cfg: Dyn, _ ctx: StoryContext) -> Dyn {
  guard let story = GameData.shared.storyOf(chapter?["id"].string ?? "") else { return Dyn([String: Any]()) }
  let gen = cfg["gen"].string ?? cfg["name"].string ?? ""
  let intros = story["intros"]
  var entries: [Dyn] = []
  let byGen = intros[gen]
  if !byGen.isNull {
    entries = byGen.array.map(Dyn.init)
  } else if intros.has(cfg["name"].string ?? "") {
    entries = intros[cfg["name"].string ?? ""].array.map(Dyn.init)
  }
  if entries.isEmpty { return Dyn([String: Any]()) }
  let matched = entries.first { matchesWhen($0["when"], ctx) }
  let fallback = entries.first { $0["when"].isNull }
  return matched ?? fallback ?? entries[0]
}

public func battleBeatsFor(_ chapter: Dyn?, _ trigger: String, _ ctx: StoryContext) -> [Dyn] {
  guard let story = GameData.shared.storyOf(chapter?["id"].string ?? "") else { return [] }
  return story["battle"].array.compactMap { b -> Dyn? in
    let d = Dyn(b)
    if d["at"].string == trigger && matchesWhen(d["when"], ctx) { return d }
    return nil
  }
}

public struct StoryOutcome {
  public var raw: Dyn
  public var text: String?
  public var hook: String?
  public var clue: String?
  public var clueFx: String?
  public var choiceFact: String?
  public var lines: [Dyn]
  public var variants: [Dyn]
  public var objective: String?
}

public func outcomeFor(_ chapter: Dyn?, _ win: Bool, _ ctx: StoryContext) -> StoryOutcome {
  let empty = Dyn([String: Any]())
  guard let story = GameData.shared.storyOf(chapter?["id"].string ?? "") else {
    return StoryOutcome(raw: empty, text: nil, hook: nil, clue: nil, clueFx: nil, choiceFact: nil, lines: [], variants: [], objective: nil)
  }
  let o = story[win ? "win" : "loss"]
  return StoryOutcome(
    raw: o,
    text: o["text"].string,
    hook: o["hook"].string,
    clue: o["clue"].string,
    clueFx: o["clueFx"].string,
    choiceFact: o["choiceFact"].string,
    lines: linesFor(o["lines"].array.map(Dyn.init), ctx),
    variants: o["variants"].array.map(Dyn.init),
    objective: story["objective"].string
  )
}

public func outcomeVariant(_ outcome: StoryOutcome, _ key: String) -> Dyn? {
  outcome.variants.first { $0["key"].string == key }
}

public func sceneKey(_ chapterId: String, _ sceneId: String) -> String { "\(chapterId).\(sceneId)" }

public func markSceneSeen(_ P: inout Progress, _ chapterId: String, _ sceneId: String) {
  let key = sceneKey(chapterId, sceneId)
  P.story.seen[key, default: 0] += 1
}
public func sceneSeen(_ P: Progress, _ chapterId: String, _ sceneId: String) -> Bool {
  (P.story.seen[sceneKey(chapterId, sceneId)] ?? 0) > 0
}
public func choiceFor(_ P: Progress, _ chapterId: String, _ sceneId: String = "") -> String? {
  P.story.choices[sceneId.isEmpty ? chapterId : sceneKey(chapterId, sceneId)]
}
