// GameData.swift —— 数据仓库:章节/武将/剧本/练习场/破绽词池/起手表,含本地化覆盖。
import Foundation

public final class GameData {
  public static let shared = GameData()
  public private(set) var chaptersRoot: Dyn   // {scrolls, gateIds, normalIds, fx, chapters}
  public private(set) var generals: Dyn       // {gid: {...}}
  public private(set) var practice: Dyn       // {arenas: [...]}
  public private(set) var story: Dyn          // {stories:{}, briefings:{}}
  public private(set) var telllines: Dyn      // {INTENT_NOTES, FAMOUS, ARCHETYPE}

  private init() {
    func load(_ name: String) -> Dyn {
      let bundle = Bundle.main
      guard let url = bundle.url(forResource: name, withExtension: "json", subdirectory: "GameData"),
            let d = Dyn(data: (try? Data(contentsOf: url)) ?? Data()) else {
        return Dyn(NSNull())
      }
      return d
    }
    chaptersRoot = load("chapters")
    generals = load("generals")
    practice = load("practice")
    story = load("story")
    telllines = load("telllines")
    applyLocalization(L10n.shared)
  }

  // MARK: 章节访问

  public var chapters: [Dyn] { chaptersRoot["chapters"].array.map(Dyn.init) }
  public var scrolls: [String] { chaptersRoot["scrolls"].stringArray }
  public var gateIds: [String] { chaptersRoot["gateIds"].stringArray }
  public var normalIds: [String] { chaptersRoot["normalIds"].stringArray }
  public func chapter(_ id: String) -> Dyn? {
    chapters.first { $0["id"].string == id }
  }
  public func general(_ gid: String?) -> Dyn? {
    guard let gid, generals.has(gid) else { return nil }
    return generals[gid]
  }
  public func generalName(_ gid: String?) -> String? {
    guard let gid, let g = general(gid) else { return nil }
    return g["name"].string
  }
  public var arenas: [Dyn] { practice["arenas"].array.map(Dyn.init) }
  public func storyOf(_ chapterId: String) -> Dyn? {
    let s = story["stories"][chapterId]
    return s.isNull ? nil : s
  }
  public func briefingOf(_ chapterId: String) -> Dyn? {
    let b = story["briefings"][chapterId]
    return b.isNull ? nil : b
  }

  // MARK: 本地化覆盖(键路径生成与 native/bridge/extract-strings.mjs 严格一致)

  private static let skipKeys: Set<String> = [
    "id", "node", "speaker", "when", "at", "fx", "clueFx", "effects", "choiceFact", "gen", "skin",
    "stack", "blinds", "escalate", "type", "scroll", "size", "rounds", "rule", "traits", "opponents",
    "key", "seen", "won", "n", "hit", "file", "label", "desc",
  ]

  private func walk(_ obj: Any, _ prefix: String, _ pack: [String: String]) -> Any {
    if let str = obj as? String {
      return pack[prefix] ?? str
    }
    if let arr = obj as? [Any] {
      return arr.enumerated().map { (i, item) -> Any in
        if let s = item as? String { return pack["\(prefix).\(i)"] ?? s }
        return walk(item, "\(prefix).\(i)", pack)
      }
    }
    if var dict = obj as? [String: Any] {
      for (k, v) in dict {
        if GameData.skipKeys.contains(k) { continue }
        if let s = v as? String { dict[k] = pack["\(prefix).\(k)"] ?? s }
        else if v is [Any] || v is [String: Any] { dict[k] = walk(v, "\(prefix).\(k)", pack) }
      }
      return dict
    }
    return obj
  }

  /// 应用语言包:zh 之外的语言用覆盖表就地替换数据文本。
  public func applyLocalization(_ l10n: L10n) {
    let pack = l10n.contentPack
    // chapters
    var root = chaptersRoot.value
    if var chaptersArr = (root as? [String: Any])?["chapters"] as? [Any] {
      chaptersArr = chaptersArr.map { chapter in
        var c = chapter as? [String: Any] ?? [:]
        let id = c["id"] as? String ?? ""
        let p = "ch.\(id)"
        for k in ["name", "year", "premise", "regret", "ruleText", "history", "yeshi", "note", "defeat"] {
          if let s = c[k] as? String { c[k] = pack["\(p).\(k)"] ?? s }
        }
        if let map = c["map"] as? [Any] {
          c["map"] = map.enumerated().map { (i, m) -> Any in pack["\(p).map.\(i)"] ?? m }
        }
        if let omens = c["omens"] as? [[String: Any]] {
          c["omens"] = omens.enumerated().map { (i, o) in
            var o = o
            if let n = o["n"] as? String { o["n"] = pack["\(p).omen.\(i)"] ?? n }
            return o
          }
        }
        if var sk = c["skirmish"] as? [String: Any], let n = sk["name"] as? String {
          sk["name"] = pack["\(p).skirmish.name"] ?? n
          c["skirmish"] = sk
        }
        if var boss = c["boss"] as? [String: Any] {
          if let n = boss["name"] as? String { boss["name"] = pack["\(p).boss.name"] ?? n }
          if let opps = boss["opponents"] as? [[String: Any]] {
            boss["opponents"] = opps.enumerated().map { (j, m) in
              var m = m
              if let n = m["name"] as? String { m["name"] = pack["\(p).boss.op.\(j).name"] ?? n }
              return m
            }
          }
          c["boss"] = boss
        }
        return c
      }
      if var r = root as? [String: Any] {
        r["chapters"] = chaptersArr
        root = r
      }
      chaptersRoot.value = root
    }
    // fx / scrolls
    var cr = chaptersRoot.value
    if var r = cr as? [String: Any] {
      if var fx = r["fx"] as? [String: Any] {
        for (k, v) in fx {
          if var d = v as? [String: Any] {
            if let s = d["label"] as? String { d["label"] = pack["fx.\(k).label"] ?? s }
            if let s = d["desc"] as? String { d["desc"] = pack["fx.\(k).desc"] ?? s }
            fx[k] = d
          }
        }
        r["fx"] = fx
      }
      if let scrolls = r["scrolls"] as? [Any] {
        r["scrolls"] = scrolls.enumerated().map { (i, s) -> Any in pack["scroll.\(i + 1)"] ?? s }
      }
      cr = r
      chaptersRoot.value = cr
    }
    // generals / story / practice
    generals.value = walkWithSpecials(generals.value, "gen", pack) { prefix, dict in
      // gen.<gid>.[name,bio,tell.*,bark.*]
      var d = dict
      let gid = prefix
      for k in ["name", "bio"] {
        if let s = d[k] as? String { d[k] = pack["gen.\(gid).\(k)"] ?? s }
      }
      if var tells = d["tells"] as? [String: Any] {
        for (k, v) in tells { if let s = v as? String { tells[k] = pack["gen.\(gid).tell.\(k)"] ?? s } }
        d["tells"] = tells
      }
      if var barks = d["barks"] as? [String: Any] {
        for (k, v) in barks { if let s = v as? String { barks[k] = pack["gen.\(gid).bark.\(k)"] ?? s } }
        d["barks"] = barks
      }
      return d
    }
    story.value = walkWithSpecials(story.value, "storyroot", pack) { _, dict in walk(dict, "", pack) as? [String: Any] ?? dict }

    // 讲好 story/brief 的前缀:story.<cid> 与 brief.<cid>
    if var sv = story.value as? [String: Any] {
      if var stories = sv["stories"] as? [String: Any] {
        for (cid, v) in stories { stories[cid] = walk(v, "story.\(cid)", pack) }
        sv["stories"] = stories
      }
      if var briefs = sv["briefings"] as? [String: Any] {
        for (cid, v) in briefs { briefs[cid] = walk(v, "brief.\(cid)", pack) }
        sv["briefings"] = briefs
      }
      story.value = sv
    }
    // practice.arenas 特定字段 + walk brief
    if var pv = practice.value as? [String: Any], var arenas = pv["arenas"] as? [Any] {
      arenas = arenas.map { arena in
        var a = arena as? [String: Any] ?? [:]
        let id = a["id"] as? String ?? ""
        for k in ["name", "place", "era", "source", "lead", "btitle", "why", "win", "loss", "ruleText"] {
          if let s = a[k] as? String { a[k] = pack["arena.\(id).\(k)"] ?? s }
        }
        if var roster = a["roster"] as? [Any] {
          roster = roster.enumerated().map { (i, m) in
            var m = m as? [String: Any] ?? [:]
            if (m["gen"] as? String) == nil, let n = m["name"] as? String {
              m["name"] = pack["arena.\(id).member.\(i)"] ?? n
            }
            return m
          }
          a["roster"] = roster
        }
        if let brief = a["brief"] { a["brief"] = walk(brief, "arena.\(id).brief", pack) }
        return a
      }
      pv["arenas"] = arenas
      practice.value = pv
    }
    // telllines 词池
    if var tv = telllines.value as? [String: Any] {
      for (pool, prefix) in [("FAMOUS", "tell.famous"), ("ARCHETYPE", "tell.archetype")] {
        if var groups = tv[pool] as? [String: Any] {
          for (gid, cats) in groups {
            if var catDict = cats as? [String: Any] {
              for (cat, lines) in catDict {
                if let arr = lines as? [Any] {
                  catDict[cat] = arr.enumerated().map { (i, l) in pack["\(prefix).\(gid).\(cat).\(i)"] ?? l }
                }
              }
              groups[gid] = catDict
            }
          }
          tv[pool] = groups
        }
      }
      if var notes = tv["INTENT_NOTES"] as? [String: Any] {
        for (k, v) in notes { if let s = v as? String { notes[k] = pack["tell.intent.\(k)"] ?? s } }
        tv["INTENT_NOTES"] = notes
      }
      telllines.value = tv
    }
  }

  private func walkWithSpecials(_ obj: Any, _ prefix: String, _ pack: [String: String], leaf: (String, [String: Any]) -> [String: Any]) -> Any {
    // generals:每个 gid 应用专用键;story/practice 走通用 walk
    if prefix == "gen", var gens = obj as? [String: Any] {
      for (gid, v) in gens {
        if let d = v as? [String: Any] { gens[gid] = leaf(gid, d) }
      }
      return gens
    }
    return walk(obj, "", pack)
  }
}
