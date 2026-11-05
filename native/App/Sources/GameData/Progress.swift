// Progress.swift —— 进度模型(与 Web 版 localStorage 存档同构,可互导)。
import Foundation

public struct AnnalTell: Codable {
  public var n: Int = 0
  public var hit: Int = 0
}
public struct Annal: Codable {
  public var seen: Int = 0
  public var won: Int = 0
  public var tells: [String: AnnalTell] = [:]
}
public struct PracticeRecord: Codable {
  public var seen: Int
  public var won: Int
}
public struct Settings: Codable {
  public var equityAssist: Bool = false
}
public struct StoryState: Codable {
  public var seen: [String: Int] = [:]
  public var choices: [String: String] = [:]
  public var facts: [String: Bool] = [:]
  public var clues: [String: Bool] = [:]
  public var outcomes: [String: String] = [:]
}
public struct TutorialState: Codable {
  public var version: Int = 1
  public var introDone: Bool = false
  public var steps: [String: Bool] = [:]
  public var skipped: Bool = false
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
  public static func readWebSave(_ data: Data) throws -> (progress: Progress, exportedAt: Date?) {
    struct Payload: Codable {
      let format: String?
      let formatVersion: Int?
      let exportedAt: Date?
      let data: Progress?
    }
    guard let payload = try? JSONDecoder().decode(Payload.self, from: data) else {
      throw EngineError.message(L("save.invalid"))
    }
    if payload.format != nil {
      guard payload.format == SAVE_FORMAT, payload.formatVersion == 1, payload.data != nil else {
        throw EngineError.message(L("save.invalid"))
      }
      return (normalize(payload.data!), payload.exportedAt)
    }
    guard let raw = payload.data else { throw EngineError.message(L("save.invalid")) }
    return (normalize(raw), nil)
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
