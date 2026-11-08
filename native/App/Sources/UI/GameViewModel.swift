// GameViewModel.swift —— 主流程:开卷 → 目录 → 题记 → 天时 → 行军 → 战书 → 亮相 → 牌局 → 结算。
import SwiftUI

// MARK: 行军节点

struct MarchNode: Identifiable {
  let id: String
  let col: Int
  let type: String  // battle|rest|shop|chest|boss
  let name: String
  var done = false
  // 原版 map.js 的行军线坐标(1000×420 坐标系)与后继节点
  var x: Double = 500
  var y: Double = 210
  var next: [String] = []
}

enum Screen {
  case title
  case codex
  case chapterPage
  case map
  case battle
  case practice
}

// MARK: 运行态

struct RunState {
  var chapter: Dyn
  var omenFx: String
  var asZhuge: Bool
  var chips: Int
  var nodes: [MarchNode]
  var current: String?
  var seed: String
  var keenEye: Bool
  var oppMorale0: Int
  var raid: Bool
  var bribe: Bool = false
  var storyOppChips: Int = 0
  var mapScenes: Set<String> = []
  var clueActive: Bool = false
  var marchInfo: String
  var revived = false
  var bossRound = 1
}

// MARK: 弹窗态

enum Sheet: Identifiable {
  case omen
  case storyScene(nodeId: String)
  case event(nodeType: String)
  case briefing(nodeId: String, boss: Bool, round: Int, rounds: Int)
  case generalIntro(index: Int, count: Int, boss: Bool)
  case settle(win: Bool)
  case battleResult(win: Bool)
  case finale
  case annals
  case settings
  case save
  case verify
  var id: String {
    switch self {
    case .omen: return "omen"
    case .storyScene(let n): return "scene-\(n)"
    case .event(let t): return "event-\(t)"
    case .briefing(let n, let b, _, _): return "briefing-\(n)-\(b)"
    case .generalIntro(let i, let c, let b): return "intro-\(i)-\(c)-\(b)"
    case .settle(let w): return "settle-\(w)"
    case .battleResult(let w): return "battleResult-\(w)"
    case .finale: return "finale"
    case .annals: return "annals"
    case .settings: return "settings"
    case .save: return "save"
    case .verify: return "verify"
    }
  }
}

@MainActor
final class GameViewModel: ObservableObject {
  static let shared = GameViewModel()

  @Published var screen: Screen = .title
  @Published var sheet: Sheet? = nil
  @Published var selectedChapter: Dyn? = nil
  @Published var R: RunState? = nil
  @Published var pendingBriefing: ((Bool) -> Void)? = nil
  @Published var pendingIntro: ((Bool) -> Void)? = nil
  @Published var settleResult: SettleChoice? = nil
  /// 小规模遭遇战的战果(胜/负后弹一次场景,对应原版牌局结算面板)
  @Published var battleResultInfo: (opponent: String, chips: Int, gained: Int)? = nil
  @Published var finaleChoice: ((String) -> Void)? = nil
  @Published var omenPick: ((String) -> Void)? = nil
  @Published var eventPick: ((String) -> Void)? = nil
  @Published var storyChoicePick: ((Dyn?) -> Void)? = nil
  @Published var activeBattle: BattleEngine? = nil
  /// 截图调试:自动跟注/过牌(仅 DEBUG,由 -ggcodeAutoAct=1 开启)
  var debugAutoAct = false
  /// 演示节奏:行动用人类思考延迟(-ggcodeDemoPace=1,配合录制)
  var demoPace = false
  /// 玩家行动提示:由引擎侧 provider 直接驱动,不依赖视图 onAppear 时序
  @Published var actionPrompt: (view: ActionView, presets: [BattleEngine.BetPreset])? = nil
  private var actionContinuation: ResumeOnce<AIDecision>? = nil

  /// 引擎请求玩家决策(唯一入口;保证每局只等一次)
  func awaitPlayerAction(_ view: ActionView, _ presets: [BattleEngine.BetPreset]) async -> AIDecision {
    await withCheckedContinuation { cont in
      let once = ResumeOnce(cont)
      Task { @MainActor in
        #if DEBUG
        if self.debugAutoAct {
          let base = self.demoPace ? 1.7 : 0.9
          let jitter = self.demoPace ? Double.random(in: 0...1.3) : 0
          try? await Task.sleep(nanoseconds: UInt64((base + jitter) * 1_000_000_000))
          let d = view.toCall > 0 ? AIDecision(type: "call") : AIDecision(type: "check")
          self.actionPrompt = nil
          self.actionContinuation = nil
          once.resume(d)
          return
        }
        #endif
        self.actionContinuation = once
        self.actionPrompt = (view, presets)
      }
    }
  }

  func submitPlayerAction(_ decision: AIDecision) {
    actionPrompt = nil
    let once = actionContinuation
    actionContinuation = nil
    once?.resume(decision)
  }
  @Published var practiceArena: Dyn? = nil
  @Published var toast: String? = nil

  let progressStore = ProgressStore.shared

  var P: Progress { progressStore.progress }

  // MARK: 开卷/目录

  func enterGame() {
    withAnimation { screen = .codex }
  }

  #if DEBUG
  /// 截图/验收专用:绕过开卷与目录,直接落进第一场「遭遇战」。
  /// autoAcceptAfter = 战书/亮相自动确认的延迟秒数(给截图留时间)。
  var debugAutoAcceptAfter: Double?

  func debugStartBattle(autoAcceptAfter: Double) async {
    let args = ProcessInfo.processInfo.arguments
    // -ggcodeDebugRoster=N (2..4):直入练兵场多对手局,验收 1vX 布局
    if let a = args.first(where: { $0.hasPrefix("-ggcodeDebugRoster") }),
       let n = Int(a.split(separator: "=").last.map(String.init) ?? ""), (2...4).contains(n) {
      let arenas = GameData.shared.arenas.filter { $0["size"].int == n }
      guard let arena = arenas.first else { return }
      debugAutoAcceptAfter = autoAcceptAfter
      screen = .battle
      await startPracticeArena(arena)
      return
    }
    guard let chapter = GameData.shared.chapters.first(where: { !($0["map"].stringArray.isEmpty) }) else { return }
    selectedChapter = chapter
    startMarch(chapter, omenFx: "supply")
    debugAutoAcceptAfter = autoAcceptAfter
    guard let node = R?.nodes.first(where: { $0.type == "battle" }) ?? R?.nodes.first else { return }
    _ = await enterBattle(node, cfg: chapter["skirmish"], stack: chapter["skirmish"]["stack"].int ?? 500,
                          boss: false, round: 1, rounds: 1)
  }  /// 截图/验收专用:模拟「牌局刚结束」的真实条件(牌桌仍在画面上)再走战果面板。
  func debugShowBattleResult(win: Bool) {
    if R == nil, let chapter = GameData.shared.chapters.first {
      selectedChapter = chapter
      startMarch(chapter, omenFx: "supply")
    }
    screen = .battle
    activeBattle = nil
    battleResultInfo = (opponent: "黄巾 · 程远志", chips: R?.chips ?? 1190, gained: 0)
    Task { await showBattleResult(node: nil, win: win, cfg: R?.chapter["skirmish"] ?? Dyn([:])) }
  }

  /// 截图/验收专用:按名直达界面(与 UI 交互共用同一套状态设置,布局真实)
  /// 用法: -ggcodeDebugScreen=codex|chapter|map|omen|briefing|practice|settings|save|annals
  func debugJumpScreen(name: String) {
    let ch = GameData.shared.chapters.first { !($0["map"].stringArray.isEmpty) } ?? GameData.shared.chapters.first
    switch name {
    case "codex": screen = .codex
    case "chapter": if let ch { openChapter(ch) }
    case "map":
      if let ch {
        selectedChapter = ch
        startMarch(ch, omenFx: "supply")
        screen = .map
      }
    case "omen":
      screen = .codex
      pickOmen()
    case "briefing":
      if let ch {
        selectedChapter = ch
        startMarch(ch, omenFx: "supply")
        screen = .map
        if let node = R?.nodes.first(where: { $0.type == "battle" }) ?? R?.nodes.first {
          sheet = .briefing(nodeId: node.id, boss: false, round: 1, rounds: 1)
        }
      }
    case "practice": screen = .practice
    case "battle": debugBattle() // 截图/验收直达:野战牌桌(跳过战书确认)
    case "settings": screen = .codex; sheet = .settings
    case "save": screen = .codex; sheet = .save
    case "annals": screen = .codex; sheet = .annals
    default: break
    }
  }

  #endif

  func openChapter(_ chapter: Dyn) {
    selectedChapter = chapter
    screen = .chapterPage
  }

  // MARK: 天时三选

  func pickOmen() {
    sheet = .omen
  }

  func applyOmen(_ fx: String) {
    sheet = nil
    omenPick?(fx)
  }

  // MARK: 行军(移植 buildMarch + onPick)

  static func buildMarch(_ chapter: Dyn) -> [MarchNode] {
    let names = chapter["map"].stringArray
    let n = names.count
    let midTypes = ["chest", "battle", "rest", "shop", "battle"]
    return names.enumerated().map { (i, nm) in
      MarchNode(
        id: "m\(i)", col: i,
        type: n == 1 ? "boss" : (i == n - 1 ? "boss" : (i == 0 ? "battle" : midTypes[(i - 1) % midTypes.count])),
        name: nm,
        x: n == 1 ? 500 : 90 + Double(i) * (820 / Double(max(1, n - 1))),
        y: 210 + sin(Double(i) * 1.7) * 60,
        next: i < n - 1 ? ["m\(i + 1)"] : []
      )
    }
  }

  func startMarch(_ chapter: Dyn, omenFx: String, asZhuge: Bool = false) {
    let story = GameData.shared.storyOf(chapter["id"].string ?? "")
    let chapterId = chapter["id"].string ?? ""
    let clueFx = P.story.clues[chapterId] == true ? story?["loss"]["clueFx"].string : nil
    let baseChips = 1000 + (clueFx == "supply" ? 150 : 0)
    var systemRng = SystemRng()
    let seed = String(format: "%06X", UInt32(systemRng.next() * 16777216.0))
    R = RunState(
      chapter: chapter, omenFx: omenFx, asZhuge: asZhuge,
      chips: baseChips + (omenFx == "supply" ? 200 : 0),
      nodes: GameViewModel.buildMarch(chapter),
      current: nil, seed: seed,
      keenEye: omenFx == "keenEye" || clueFx == "keenEye",
      oppMorale0: (omenFx == "sow" ? -1 : 0) - (clueFx == "sow" ? 1 : 0),
      raid: omenFx == "raid" || clueFx == "raid",
      marchInfo: "\(chapter["year"].string ?? L("scroll.frag")) · \(chapter["name"].string ?? "")\(clueFx != nil ? " · \(L("clue.active"))" : "")"
    )
    screen = .map
  }

  func availableNodes() -> [String] {
    guard let R else { return [] }
    if R.current == nil { return R.nodes.filter { $0.col == 0 }.map(\.id) }
    guard let cur = R.nodes.first(where: { $0.id == R.current }) else { return [] }
    return nodesAfter(cur).map(\.id)
  }

  func nodesAfter(_ node: MarchNode) -> [MarchNode] {
    guard let R else { return [] }
    return R.nodes.filter { $0.col == node.col + 1 }
  }

  func pickNode(_ node: MarchNode) async {
    guard var run = R else { return }
    let chapter = run.chapter
    let chapterId = chapter["id"].string ?? ""
    // 章节场景
    if let scene = mapSceneFor(chapter, Dyn(["col": node.col, "id": node.id])), !run.mapScenes.contains(scene["id"].string ?? node.id) {
      let sceneId = scene["id"].string ?? node.id
      sheet = .storyScene(nodeId: node.id)
      let choice: Dyn? = await withCheckedContinuation { cont in
        storyChoicePick = { choice in
          self.sheet = nil
          cont.resume(returning: choice)
        }
      }
      run.mapScenes.insert(sceneId)
      if let choice, let cid = choice["id"].string {
        progressStore.progress.story.choices["\(chapterId).\(sceneId)"] = cid
        // 排斥兄弟选择的 fact
        for sibling in scene["choices"].array {
          let s = Dyn(sibling)
          if s["id"].string != cid, let fact = s["effects"]["fact"].string {
            progressStore.progress.story.facts[fact] = nil
          }
        }
        applyStoryEffects(s: choice["effects"], run: &run)
      }
      R = run
    }
    guard var run2 = R else { return }
    if node.type == "battle" {
      let win = await enterBattle(node, cfg: chapter["skirmish"], stack: chapter["skirmish"]["stack"].int ?? 500, boss: false, round: 1, rounds: 1)
      if win == nil { return } // 返回行军
      if win == false {
        // 负:先给一场战果场景,再走「回原卷」结算(史鉴)
        await showBattleResult(node: node, win: false, cfg: chapter["skirmish"])
        return await endChapter(false)
      }
      // 胜:先给一场牌局结算场景,再标记节点继续行军
      await showBattleResult(node: node, win: true, cfg: chapter["skirmish"])
      markNodeDone(node)
      return
    }
    if node.type == "boss" { return await enterBoss(node) }
    // 通用事件
    sheet = .event(nodeType: node.type)
    let key: String = await withCheckedContinuation { cont in
      eventPick = { k in
        self.sheet = nil
        cont.resume(returning: k)
      }
    }
    if key == "heal" { run2.chips += 80 }
    if key == "money" { run2.chips += 150 }
    if key == "loot" { run2.chips += 150 }
    if key == "calm" { run2.keenEye = true }
    if key == "eye" { run2.keenEye = true }
    if key == "bribe" { run2.bribe = true }
    R = run2
    markNodeDone(node)
  }

  private func markNodeDone(_ node: MarchNode) {
    guard var run = R else { return }
    if let idx = run.nodes.firstIndex(where: { $0.id == node.id }) {
      run.nodes[idx].done = true
    }
    run.current = node.id
    R = run
  }

  func applyStoryEffects(s effects: Dyn, run: inout RunState) {
    if let chips = effects["chips"].int { run.chips += chips }
    if effects["keenEye"].bool == true { run.keenEye = true }
    if let sow = effects["sow"].int { run.oppMorale0 -= sow }
    if effects["raid"].bool == true { run.raid = true }
    if let oppChips = effects["oppChips"].int { run.storyOppChips += oppChips }
    if let fact = effects["fact"].string { progressStore.progress.story.facts[fact] = true }
  }

  // MARK: 战书 → 亮相 → 牌局(移植 enterBattle)

  func enterBattle(_ node: MarchNode?, cfg: Dyn, stack: Int?, boss: Bool, round: Int, rounds: Int, revive: Bool = false) async -> Bool? {
    guard let run = R else { return nil }
    let roster = rosterOf(cfg)
    let displayRoster = roster.enumerated().map { (index, member) -> BattleOpponentConfig in
      var memberStack: Int
      if roster.count == 1 {
        memberStack = stack ?? member["stack"].int ?? cfg["stack"].int ?? 1000
      } else {
        memberStack = index == 0 ? (stack ?? member["stack"].int ?? cfg["stack"].int ?? 1000) : (member["stack"].int ?? cfg["stack"].int ?? 1000)
      }
      let gen = GameData.shared.general(member["gen"].string)
      let skin = gen?["skin"].string ?? (boss ? "commander" : "soldier")
      return BattleOpponentConfig(
        id: index == 0 ? "opponent" : "opponent-\(index + 1)",
        name: member["name"].string ?? L("battle.oppDefault"),
        gen: member["gen"].string, stack: memberStack,
        traits: member["traits"].dict.compactMapValues { ($0 as? NSNumber)?.intValue },
        morale: run.oppMorale0, skin: skin
      )
    }

    // 战书确认
    let accepted: Bool = await withCheckedContinuation { cont in
      let once = ResumeOnce(cont)
      pendingBriefing = { ok in
        self.sheet = nil
        once.resume(ok)
      }
      sheet = .briefing(nodeId: node?.id ?? "", boss: boss, round: round, rounds: rounds)
      #if DEBUG
      if let d = debugAutoAcceptAfter {
        DispatchQueue.main.asyncAfter(deadline: .now() + d) { [weak self] in self?.pendingBriefing?(true) }
      }
      #endif
    }
    guard accepted else { return nil }

    var run2 = R!
    var members = displayRoster
    if run2.bribe {
      members[0].stack = max(300, members[0].stack - 250)
      run2.bribe = false
    }
    if run2.raid && boss {
      members[0].stack = max(300, members[0].stack - 200)
      run2.raid = false
    }
    if run2.storyOppChips != 0 {
      members[0].stack = max(100, members[0].stack + run2.storyOppChips)
      run2.storyOppChips = 0
    }
    R = run2

    // 武将亮相(逐将;重复挑战不重播)
    for (i, member) in members.enumerated() {
      let genId = member.gen
      let intro = introFor(selectedChapter ?? R!.chapter, cfg, StoryContext(P: P, chapter: R!.chapter))
      let introId = "intro:\(R!.chapter["id"].string ?? ""):\(genId ?? member.name):\(intro["quote"].string ?? "base")"
      let seen = sceneSeen(P, R!.chapter["id"].string ?? "", introId)
      if !seen {
        _ = await withCheckedContinuation { (cont: CheckedContinuation<Bool, Never>) in
          let once = ResumeOnce(cont)
          pendingIntro = { _ in
            self.sheet = nil
            once.resume(true)
          }
          sheet = .generalIntro(index: i, count: members.count, boss: boss)
          #if DEBUG
          if let d = debugAutoAcceptAfter {
            // 亮相卡停留更久(4x),便于截图取证
            DispatchQueue.main.asyncAfter(deadline: .now() + d * 4) { [weak self] in self?.pendingIntro?(true) }
          }
          #endif
        }
        markSceneSeen(&progressStore.progress, R!.chapter["id"].string ?? "", introId)
      }
    }

    // 开局
    let battleSeed = "\(run.seed)#\(run.chapter["id"].string ?? "")#\(node?.id ?? "")\(revive ? "#revive" : "#r\(round)")"
    var config = BattleConfig(opponents: members, seed: battleSeed)
    config.playerStack = R!.chips
    config.blinds0 = cfg["blinds"].intArray.count == 2 ? cfg["blinds"].intArray : (roster[0]["blinds"].intArray.count == 2 ? roster[0]["blinds"].intArray : [10, 20])
    config.escalateEvery = cfg["escalate"].int ?? 4
    config.boss = boss
    config.rule = BattleRule(run.chapter["rule"].isNull ? cfg["rule"] : run.chapter["rule"])
    config.playerName = boss && R!.asZhuge ? "诸葛亮" : nil
    config.zhiZi = boss && R!.asZhuge
    config.keenEye = R!.keenEye

    let engine = BattleEngine(config: config)
    engine.playerActionProvider = { [weak self] view, presets in
      guard let self else { return AIDecision(type: "check") }
      return await self.awaitPlayerAction(view, presets)
    }
    engine.oddsEnabled = { [weak engine] in
      ProgressStore.shared.progress.settings.equityAssist && engine != nil
    }
    var pendingOpponents = members
    engine.onEvent = { [weak self] event in
      Task { @MainActor in
        self?.handleBattleEvent(event, engine: engine, members: &pendingOpponents)
      }
    }
    activeBattle = engine
    screen = .battle

    let result: (win: Bool, finalStack: Int) = await withCheckedContinuation { cont in
      battleEndContinuation = ResumeOnce(cont)
      Task.detached { [weak engine] in
        guard let engine else { return }
        await engine.run()
      }
    }
    battleEndContinuation = nil
    var run3 = R!
    run3.chips = max(0, result.finalStack)
    R = run3
    activeBattle = nil
    // 牌局一结束就离开牌桌:否则结算/战果等待期间会露出一张空桌面
    if screen == .battle { screen = .map }
    // 列传入账
    if members.count == 1, let gid = members[0].gen {
      progressStore.annalsRecord(gid, win: result.win)
    } else {
      for m in members where m.gen != nil {
        progressStore.annalsRecord(m.gen!, win: result.win)
      }
    }
    return result.win
  }

  private var battleEndContinuation: ResumeOnce<(win: Bool, finalStack: Int)>? = nil

  func handleBattleEvent(_ event: BattleEvent, engine: BattleEngine, members: inout [BattleOpponentConfig]) {
    // 音效(移植原版 AudioFX):发牌/下注/结算
    switch event {
    case .board: AudioFX.shared.card()
    case .dealt: AudioFX.shared.card()
    case .action: AudioFX.shared.chip()
    case .settle(let result):
      AudioFX.shared.heartStop()
      if (result.awards["player"] ?? 0) > 0 { AudioFX.shared.win() } else { AudioFX.shared.thud() }
    case .end: AudioFX.shared.heartStop()
    default: break
    }
    if case .end(let win, let finalStack) = event {
      let cont = battleEndContinuation
      battleEndContinuation = nil
      cont?.resume((win, finalStack))
    }
  }

  // MARK: 关卡/连战(移植 enterBoss)

  func enterBoss(_ node: MarchNode) async {
    guard let run = R else { return }
    let chapter = run.chapter
    let rounds = chapter["rule"]["gauntlet"].int ?? 1
    let firstRound = max(1, min(rounds, run.bossRound))
    for r in firstRound...rounds {
      R!.bossRound = r
      let currentBoss = roundConfig(chapter["boss"], r)
      if rounds > 1 {
        activeBattle?.emit(.banner("\(L("battle.round")) \(r)", chapter["id"].string == "qiqin" ? L("battle.qiqinSub") : ""))
        try? await Task.sleep(nanoseconds: 800_000_000)
      }
      let win = await enterBattle(node, cfg: currentBoss, stack: currentBoss["stack"].int, boss: true, round: r, rounds: rounds)
      if win == nil { return } // 返回行军
      if win == false {
        let advanceOnLoss = chapter["rule"]["advanceOnLoss"].int ?? 0
        if advanceOnLoss >= r && r < rounds {
          R!.chips = 650
          activeBattle?.emit(.banner(L("banner.loseButContinue"), L("banner.loseButContinue.sub")))
          try? await Task.sleep(nanoseconds: 1_000_000_000)
          continue
        }
        // 七进七出
        if chapter["rule"]["reviveOnce"].bool == true && !R!.revived {
          R!.revived = true
          R!.chips = max(500, R!.chips)
          let again = await enterBattle(node, cfg: chapter["boss"], stack: max(300, (currentBoss["stack"].int ?? 1000) * 6 / 10), boss: true, round: r, rounds: rounds, revive: true)
          if again == true {
            markNodeDone(node)
            return await endChapter(true)
          }
        }
        return await endChapter(false)
      }
      if r < rounds {
        R!.chips += 100
        try? await Task.sleep(nanoseconds: 600_000_000)
      }
    }
    markNodeDone(node)
    await endChapter(true)
  }

  // MARK: 结算(移植 endChapter + settle)

  func endChapter(_ win: Bool) async {
    guard let run = R else { return }
    let chapter = run.chapter
    let chapterId = chapter["id"].string ?? ""
    var ctx = StoryContext(P: progressStore.progress, chapter: chapter)
    ctx.asZhuge = run.asZhuge
    let storyOutcome = outcomeFor(chapter, win, ctx)
    if !win {
      progressStore.markPage(chapterId, "history")
      progressStore.progress.story.outcomes[chapterId] = "history"
      if storyOutcome.clue != nil {
        progressStore.progress.story.clues[chapterId] = true
      }
    }
    // 结算面板不要叠在空牌桌上:牌局结束后先回到行军图/目录背景
    activeBattle = nil
    if screen == .battle { screen = R == nil ? .codex : .map }
    sheet = .settle(win: win)
    let choice: SettleChoice = await withCheckedContinuation { cont in
      settleContinuation = ResumeOnce(cont)
    }
    settleContinuation = nil
    sheet = nil

    if win {
      let resultKey = choice.yeshiKey ?? "yeshi"
      progressStore.markPage(chapterId, resultKey)
      progressStore.progress.story.outcomes[chapterId] = resultKey
      progressStore.progress.story.choices[chapterId] = resultKey
      if let fact = storyOutcome.choiceFact {
        progressStore.progress.story.facts[fact] = true
      }
      if chapter["apocrypha"].bool == true {
        progressStore.progress.apocWins += 1
      }
      if run.asZhuge { progressStore.progress.flags["zhizishou"] = "1" }
      if chapter["type"].string == "finale" {
        // 终章:三种署名
        sheet = .finale
        let ending: String = await withCheckedContinuation { cont in
          finaleChoice = { key in
            self.sheet = nil
            cont.resume(returning: key)
          }
        }
        finaleChoice = nil
        progressStore.progress.endings.append(ending)
        progressStore.progress.flags["ending"] = ending
      }
      if choice.r == "next", let next = nextAfterWin(chapter) {
        return openChapter(next)
      }
      return showCodex()
    }
    if choice.r == "retry" {
      progressStore.markPage(chapterId, "history")
      return startMarch(chapter, omenFx: run.omenFx, asZhuge: run.asZhuge)
    }
    showCodex()
  }

  private var battleResultContinuation: (() -> Void)? = nil

  /// 牌局战果面板:胜/负后都要停一次,让玩家看清军资与对手。
  func showBattleResult(node: MarchNode?, win: Bool, cfg: Dyn) async {
    let before = R?.chips ?? 0
    let opponent = cfg["name"].string
      ?? GameData.shared.general(cfg["gen"].string)?["name"].string
      ?? cfg["gen"].string ?? node?.name ?? ""
    // 牌局已结束:先离开牌桌(否则战果面板后面会留一张空桌面),再在图上的战果场景里展示
    activeBattle = nil
    screen = .map
    battleResultInfo = (opponent: opponent, chips: before, gained: max(0, before))
    sheet = .battleResult(win: win)
    await withCheckedContinuation { (cont: CheckedContinuation<Void, Never>) in
      let once = ResumeOnce(cont)
      battleResultContinuation = { once.resume(()) }
    }
    battleResultContinuation = nil
    sheet = nil
    battleResultInfo = nil
  }

  func dismissBattleResult() { battleResultContinuation?() }

  private var settleContinuation: ResumeOnce<SettleChoice>? = nil

  struct SettleChoice {
    var r: String  // next | retry | home
    var yeshiKey: String?
  }

  func chooseSettle(_ choice: SettleChoice) {
    settleContinuation?.resume(choice)
  }

  func chooseFinale(_ key: String) {
    finaleChoice?(key)
  }

  func nextAfterWin(_ chapter: Dyn) -> Dyn? {
    if chapter["apocrypha"].bool == true || chapter["type"].string == "finale" { return nil }
    let chapters = GameData.shared.chapters
    guard let index = chapters.firstIndex(where: { $0["id"].string == chapter["id"].string }),
          index + 1 < chapters.count else { return nil }
    let next = chapters[index + 1]
    if next["scroll"].int == chapter["scroll"].int { return next }
    if next["scroll"].int == 5 {
      var projected = progressStore.progress
      projected.pages[chapter["id"].string ?? ""] = "yeshi"
      return progressStore.finaleUnlocked() ? next : nil
    }
    return chapter["gate"].bool == true ? next : nil
  }

  func showCodex() {
    R = nil
    screen = .codex
  }

  // MARK: 野战练习场

  func enterPractice() {
    screen = .practice
  }

  func startPracticeArena(_ arena: Dyn) async {
    let roster = arena["roster"].array.map(Dyn.init)
    let members = roster.enumerated().map { (index, m) -> BattleOpponentConfig in
      let gen = GameData.shared.general(m["gen"].string)
      return BattleOpponentConfig(
        id: m["id"].string ?? (index == 0 ? "opponent" : "opponent-\(index + 1)"),
        name: m["name"].string ?? L("battle.oppDefault"),
        gen: m["gen"].string,
        stack: m["stack"].int ?? arena["stack"].int ?? 1000,
        traits: m["traits"].dict.compactMapValues { ($0 as? NSNumber)?.intValue },
        morale: 0,
        skin: gen?["skin"].string ?? m["skin"].string ?? "soldier"
      )
    }
    // 战书
    let accepted: Bool = await withCheckedContinuation { cont in
      let once = ResumeOnce(cont)
      pendingBriefing = { ok in
        self.sheet = nil
        once.resume(ok)
      }
      sheet = .briefing(nodeId: "practice-\(arena["id"].string ?? "")", boss: false, round: 1, rounds: 1)
    }
    if !accepted { return enterPractice() }
    practiceArena = arena

    var systemRng = SystemRng()
    let seed = String(format: "%06X", UInt32(systemRng.next() * 16777216.0))
    var config = BattleConfig(opponents: members, seed: "\(seed)#practice#\(arena["id"].string ?? "")")
    config.playerStack = arena["stack"].int ?? 1000
    config.blinds0 = arena["blinds"].intArray.count == 2 ? arena["blinds"].intArray : [10, 20]
    config.escalateEvery = arena["escalate"].int ?? 6

    let engine = BattleEngine(config: config)
    engine.playerActionProvider = { [weak self] view, presets in
      guard let self else { return AIDecision(type: "check") }
      return await self.awaitPlayerAction(view, presets)
    }
    engine.oddsEnabled = { ProgressStore.shared.progress.settings.equityAssist }
    engine.onEvent = { [weak self] event in
      Task { @MainActor in
        if case .end(let win, let finalStack) = event {
          let cont = self?.battleEndContinuation
          self?.battleEndContinuation = nil
          cont?.resume((win, finalStack))
        }
      }
    }
    activeBattle = engine
    screen = .battle

    let result: (win: Bool, finalStack: Int) = await withCheckedContinuation { cont in
      battleEndContinuation = ResumeOnce(cont)
      Task.detached { [weak engine] in
        guard let engine else { return }
        await engine.run()
      }
    }
    battleEndContinuation = nil
    let arenaId = arena["id"].string ?? ""
    var rec = progressStore.progress.practice[arenaId] ?? PracticeRecord(seen: 0, won: 0)
    rec.seen += 1
    if result.win { rec.won += 1 }
    progressStore.progress.practice[arenaId] = rec
    for m in members where m.gen != nil {
      progressStore.annalsRecord(m.gen!, win: result.win)
    }
    toast = "\(result.win ? L("practice.winToast") : L("practice.lossToast")) · \(L("practice.record")) \(rec.won)/\(rec.seen)"
    enterPractice()
  }

  // MARK: 残卷无终稿

  /// 截图/验收直达:固定种子野战牌桌。跳过战书 continuation,玩家侧行动栏保持等待态。
  func debugBattle() {
    guard let arena = GameData.shared.arenas.first else { return }
    let roster = arena["roster"].array.map(Dyn.init)
    let members = roster.enumerated().map { (index, m) -> BattleOpponentConfig in
      let gen = GameData.shared.general(m["gen"].string)
      return BattleOpponentConfig(
        id: m["id"].string ?? (index == 0 ? "opponent" : "opponent-\(index + 1)"),
        name: m["name"].string ?? L("battle.oppDefault"),
        gen: m["gen"].string,
        stack: m["stack"].int ?? arena["stack"].int ?? 1000,
        traits: m["traits"].dict.compactMapValues { ($0 as? NSNumber)?.intValue },
        morale: 0,
        skin: gen?["skin"].string ?? m["skin"].string ?? "soldier"
      )
    }
    var config = BattleConfig(opponents: members, seed: "D3BUG1#practice#\(arena["id"].string ?? "")")
    config.playerStack = arena["stack"].int ?? 1000
    config.blinds0 = arena["blinds"].intArray.count == 2 ? arena["blinds"].intArray : [10, 20]
    config.escalateEvery = arena["escalate"].int ?? 6
    let engine = BattleEngine(config: config)
    engine.playerActionProvider = { [weak self] view, presets in
      guard let self else { return AIDecision(type: "check") }
      return await self.awaitPlayerAction(view, presets)
    }
    engine.oddsEnabled = { ProgressStore.shared.progress.settings.equityAssist }
    engine.onEvent = { _ in }
    activeBattle = engine
    screen = .battle
    Task.detached { [weak engine] in
      guard let engine else { return }
      await engine.run()
    }
  }

  func openApocrypha() {
    var rng = SystemRng()
    let chapter = genApocrypha(rng: &rng)
    openChapter(chapter)
  }
}
