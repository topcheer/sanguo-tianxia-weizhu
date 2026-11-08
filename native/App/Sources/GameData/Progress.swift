// Progress.swift —— 进度模型(与 Web 版 localStorage 存档同构,可互导)。
// 容错解码:合成 Codable 不理会默认值,web 版稀疏存档(缺键/浅对象)会 keyNotFound;
// 各 struct 手写 init(from:) 用 decodeIfPresent+默认值,缺键回退默认(web normalizeProgress 同口径)。
import Foundation

public struct AnnalTell: Codable {
  public var n: Int = 0
  public var hit: Int = 0
  public init() {}
  public init(from decoder: Decoder) throws {
    let c = try decoder.container(keyedBy: CodingKeys.self)
    n = try c.decodeIfPresent(Int.self, forKey: .n) ?? 0
    hit = try c.decodeIfPresent(Int.self, forKey: .hit) ?? 0
  }
}
public struct Annal: Codable {
  public var seen: Int = 0
  public var won: Int = 0
  public var tells: [String: AnnalTell] = [:]
  public init() {}
  public init(from decoder: Decoder) throws {
    let c = try decoder.container(keyedBy: CodingKeys.self)
    seen = try c.decodeIfPresent(Int.self, forKey: .seen) ?? 0
    won = try c.decodeIfPresent(Int.self, forKey: .won) ?? 0
    tells = try c.decodeIfPresent([String: AnnalTell].self, forKey: .tells) ?? [:]
  }
}
public struct PracticeRecord: Codable {
  public var seen: Int
  public var won: Int
  public init(seen: Int, won: Int) { self.seen = seen; self.won = won }
  public init(from decoder: Decoder) throws {
    let c = try decoder.container(keyedBy: CodingKeys.self)
    seen = try c.decodeIfPresent(Int.self, forKey: .seen) ?? 0
    won = try c.decodeIfPresent(Int.self, forKey: .won) ?? 0
  }
}
public struct Settings: Codable {
  public var equityAssist: Bool = true
  public init() {}
  public init(from decoder: Decoder) throws {
    let c = try decoder.container(keyedBy: CodingKeys.self)
    equityAssist = try c.decodeIfPresent(Bool.self, forKey: .equityAssist) ?? true
  }
}
public struct StoryState: Codable {
  public var seen: [String: Int] = [:]
  public var choices: [String: String] = [:]
  public var facts: [String: Bool] = [:]
  public var clues: [String: Bool] = [:]
  public var outcomes: [String: String] = [:]
  public init() {}
  public init(from decoder: Decoder) throws {
    let c = try decoder.container(keyedBy: CodingKeys.self)
    seen = try c.decodeIfPresent([String: Int].self, forKey: .seen) ?? [:]
    choices = try c.decodeIfPresent([String: String].self, forKey: .choices) ?? [:]
    facts = try c.decodeIfPresent([String: Bool].self, forKey: .facts) ?? [:]
    clues = try c.decodeIfPresent([String: Bool].self, forKey: .clues) ?? [:]
    outcomes = try c.decodeIfPresent([String: String].self, forKey: .outcomes) ?? [:]
  }
}
public struct TutorialState: Codable {
  public var version: Int = 1
  public var introDone: Bool = false
  public var steps: [String: Bool] = [:]
  public var skipped: Bool = false
  public init() {}
  public init(from decoder: Decoder) throws {
    let c = try decoder.container(keyedBy: CodingKeys.self)
    version = try c.decodeIfPresent(Int.self, forKey: .version) ?? 1
    introDone = try c.decodeIfPresent(Bool.self, forKey: .introDone) ?? false
    steps = try c.decodeIfPresent([String: Bool].self, forKey: .steps) ?? [:]
    skipped = try c.decodeIfPresent(Bool.self, forKey: .skipped) ?? false
  }
}

public struct Progress: Codable {
  public var version: Int = 2
  public var pages: [String: String] = [:]
  public var endings: [String] = []
  public var annals: [String: Annal] = [:]
  public var practice: [String: PracticeRecord] = [:]
  public var flags: [String: String] = [:]
  public var apocWins: Int = 0
  public var settings = Settings()
  public var story = StoryState()
  public var tutorial = TutorialState()
  public init() {}
  public init(from decoder: Decoder) throws {
    let c = try decoder.container(keyedBy: CodingKeys.self)
    version = try c.decodeIfPresent(Int.self, forKey: .version) ?? 2
    pages = try c.decodeIfPresent([String: String].self, forKey: .pages) ?? [:]
    endings = try c.decodeIfPresent([String].self, forKey: .endings) ?? []
    annals = try c.decodeIfPresent([String: Annal].self, forKey: .annals) ?? [:]
    practice = try c.decodeIfPresent([String: PracticeRecord].self, forKey: .practice) ?? [:]
    flags = try c.decodeIfPresent([String: String].self, forKey: .flags) ?? [:]
    apocWins = try c.decodeIfPresent(Int.self, forKey: .apocWins) ?? 0
    settings = try c.decodeIfPresent(Settings.self, forKey: .settings) ?? Settings()
    story = try c.decodeIfPresent(StoryState.self, forKey: .story) ?? StoryState()
    tutorial = try c.decodeIfPresent(TutorialState.self, forKey: .tutorial) ?? TutorialState()
  }
}

public let SAVE_KEY_VERSION = 2
public let SAVE_FORMAT = "sanguo-tianxia-weizhu-save"

public final class ProgressStore: ObservableObject {
  public static let shared = ProgressStore()
  @Published public var progress: Progress {
    didSet { persist() }
  }
  private let fileURL: URL

  init() {
    let dir = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
    try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
    fileURL = dir.appendingPathComponent("sanguo-progress.json")
    if let data = try? Data(contentsOf: fileURL), let p = try? JSONDecoder().decode(Progress.self, from: data) {
      progress = p
    } else {
      progress = Progress()
    }
  }

  public func persist() {
    if let data = try? JSONEncoder().encode(progress) {
      try? data.write(to: fileURL, options: .atomic)
    }
  }

  public func replace(with p: Progress) {
    progress = p
  }

  // MARK: Web 存档互导

  public func exportWebSave() -> Data {
    struct Payload: Codable {
      let format: String
      let formatVersion: Int
      let exportedAt: Date
      let data: Progress
    }
    let payload = Payload(format: SAVE_FORMAT, formatVersion: 1, exportedAt: Date(), data: progress)
    let encoder = JSONEncoder()
    encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
    encoder.dateEncodingStrategy = .iso8601
    return (try? encoder.encode(payload)) ?? Data()
  }

  /// 校验并读取 Web/本作 JSON 存档;返回摘要(确认覆盖用)。
  /// 接受三种形态(与 web save-transfer.js 同口径):
  /// ① {format,formatVersion,exportedAt,data} 本作包装 ② {data:Progress} 裸包裹 ③ 顶层即 Progress(至少含一个已知键)。
  /// 稀疏对象(缺键)合法:各 struct 容错解码(见文件头注),缺键回退默认值。
  public static func readWebSave(_ data: Data) throws -> (progress: Progress, exportedAt: Date?) {
    guard let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
      throw EngineError.message(L("save.invalid"))
    }
    var raw = obj
    var exportedAt: Date? = nil
    if let format = obj["format"] as? String {
      guard format == SAVE_FORMAT, (obj["formatVersion"] as? Int) == 1, let inner = obj["data"] as? [String: Any] else {
        throw EngineError.message(L("save.invalid"))
      }
      raw = inner
      if let iso = obj["exportedAt"] as? String {
        exportedAt = ISO8601DateFormatter().date(from: iso)
      }
    } else if let inner = obj["data"] as? [String: Any] {
      raw = inner
    }
    // 已知键校验:防任意 JSON 被吞成空白进度
    let known: Set<String> = ["version", "pages", "endings", "annals", "practice", "flags", "apocWins", "settings", "story", "tutorial"]
    guard !known.isDisjoint(with: raw.keys) else {
      throw EngineError.message(L("save.invalid"))
    }
    guard let rawData = try? JSONSerialization.data(withJSONObject: raw),
          let progress = try? JSONDecoder().decode(Progress.self, from: rawData) else {
      throw EngineError.message(L("save.invalid"))
    }
    return (normalize(progress), exportedAt)
  }

  public static func normalize(_ p: Progress) -> Progress {
    var q = p
    q.version = 2
    q.endings = q.endings.filter { !$0.isEmpty }
    for (id, rec) in q.practice {
      var r = rec
      r.seen = max(0, r.seen)
      r.won = min(r.seen, max(0, r.won))
      if r.seen == 0 { q.practice[id] = nil } else { q.practice[id] = r }
    }
    q.apocWins = max(0, q.apocWins)
    return q
  }

  // MARK: 页状态(移植 scroll.js)

  public func pageState(_ id: String) -> String { progress.pages[id] ?? "unread" }
  public static func isYeshi(_ st: String) -> Bool { st == "yeshi" || st == "yeshiB" || st == "yeshiAB" }
  public func isYeshi(_ id: String) -> Bool { ProgressStore.isYeshi(pageState(id)) }
  public func markPage(_ id: String, _ st: String) {
    let cur = pageState(id)
    if st == "history" && ProgressStore.isYeshi(cur) { return } // 原卷不覆盖野史
    if ProgressStore.isYeshi(st) && ProgressStore.isYeshi(cur) && cur != st {
      progress.pages[id] = "yeshiAB"
    } else {
      progress.pages[id] = st
    }
  }
  public func yeshiCount() -> Int {
    GameData.shared.normalIds.filter { isYeshi($0) }.count
  }
  public func scrollUnlocked(_ s: Int) -> Bool {
    if s == 1 { return true }
    if s == 5 { return finaleUnlocked() }
    guard let gate = GameData.shared.chapters.first(where: { $0["scroll"].int == s - 1 && ($0["gate"].bool ?? false) }) else { return false }
    return isYeshi(gate["id"].string ?? "")
  }
  public func finaleUnlocked() -> Bool {
    GameData.shared.gateIds.allSatisfy { isYeshi($0) } && yeshiCount() >= 30
  }

  // MARK: 列传

  public func annal(_ gid: String) -> Annal {
    if let a = progress.annals[gid] { return a }
    let a = Annal()
    progress.annals[gid] = a
    return a
  }
  public func annalsRecord(_ gid: String, win: Bool) {
    var a = annal(gid)
    a.seen += 1
    if win { a.won += 1 }
    progress.annals[gid] = a
  }
  public func annalsTell(_ gid: String, shown: String, hit: Bool) {
    var a = annal(gid)
    var t = a.tells[shown] ?? AnnalTell()
    t.n += 1
    if hit { t.hit += 1 }
    a.tells[shown] = t
    progress.annals[gid] = a
  }
  public func tellRecord(_ gid: String) -> (n: Int, hit: Int, lies: Int)? {
    guard let a = progress.annals[gid], !a.tells.isEmpty else { return nil }
    let n = a.tells.values.reduce(0) { $0 + $1.n }
    let hit = a.tells.values.reduce(0) { $0 + $1.hit }
    return n > 0 ? (n, hit, n - hit) : nil
  }
}
