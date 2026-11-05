// MoreScreens.swift —— 野战点兵台、观阵录、设置、存档导入导出、语言切换。
import SwiftUI

// MARK: - 野战练习场

struct PracticeScreen: View {
  @ObservedObject var game = GameViewModel.shared
  @ObservedObject var store = ProgressStore.shared
  private let tierNames: [(String, String)] = [
    ("duel", "practice.tier.duel"), ("trio", "practice.tier.trio"), ("four", "practice.tier.four"),
    ("five", "practice.tier.five"), ("six", "practice.tier.six"), ("seven", "practice.tier.seven"), ("eight", "practice.tier.eight"),
  ]
  var body: some View {
    ZStack {
      Theme.inkDeep.ignoresSafeArea()
      VStack(spacing: 0) {
        HStack {
          VStack(alignment: .leading, spacing: 4) {
            Text(L("practice.title")).font(Theme.serif(28, bold: true)).kerning(6).foregroundColor(Theme.goldLight)
            let seen = store.progress.practice.values.reduce(0) { $0 + $1.seen }
            let won = store.progress.practice.values.reduce(0) { $0 + $1.won }
            Text("\(L("practice.recordTotal")) \(won) \(L("practice.w")) / \(seen - won) \(L("practice.l")) · \(L("practice.broken")) \(store.progress.practice.filter { $0.value.won > 0 }.count)/\(GameData.shared.arenas.count)")
              .font(Theme.serif(12)).foregroundColor(Theme.muted)
          }
          Spacer()
          Button { game.showCodex() } label: { InkButton(title: L("common.back")) }.buttonStyle(.plain)
        }
        .padding(.horizontal, 22).padding(.vertical, 12)
        ScrollView {
          VStack(alignment: .leading, spacing: 18) {
            ForEach(tierNames, id: \.0) { tier, key in
              let arenas = GameData.shared.arenas.filter { $0["size"].int == sizeOfTier(tier) }
              if !arenas.isEmpty {
                VStack(alignment: .leading, spacing: 8) {
                  Text("\(L(key)) · \(L("practice.sizeN")) \(sizeOfTier(tier))").font(Theme.serif(15, bold: true)).kerning(2).foregroundColor(Theme.gold)
                  FlowLayout(spacing: 8) {
                    ForEach(Array(arenas.enumerated()), id: \.offset) { _, arena in
                      let rec = store.progress.practice[arena["id"].string ?? ""]
                      Button {
                        Task { await game.startPracticeArena(arena) }
                      } label: {
                        VStack(spacing: 3) {
                          Text(arena["name"].string ?? "").font(Theme.serif(14)).foregroundColor(Theme.textMain)
                          Text(arena["place"].string ?? "").font(Theme.serif(10)).foregroundColor(Theme.muted)
                          if let rec {
                            Text("\(L("practice.record")) \(rec.won)/\(rec.seen)").font(Theme.serif(10)).foregroundColor(rec.won > 0 ? Theme.goldLight : Theme.paperDim)
                          }
                        }
                        .padding(.horizontal, 12).padding(.vertical, 8)
                        .background(Theme.lacquer)
                        .overlay(RoundedRectangle(cornerRadius: 2).strokeBorder(rec.map { $0.won > 0 ? Theme.gold.opacity(0.8) : Theme.gold.opacity(0.2) } ?? Theme.gold.opacity(0.2), lineWidth: 1))
                      }.buttonStyle(.plain)
                    }
                  }
                }
              }
            }
          }
          .padding(.horizontal, 22).padding(.bottom, 30)
        }
      }
    }
  }

  private func sizeOfTier(_ tier: String) -> Int {
    switch tier {
    case "duel": return 2
    case "trio": return 3
    case "four": return 4
    case "five": return 5
    case "six": return 6
    case "seven": return 7
    default: return 8
    }
  }
}

// MARK: - 观阵录(列传)

struct AnnalsSheet: View {
  @ObservedObject var store = ProgressStore.shared
  var body: some View {
    VStack(spacing: 12) {
      Text(L("annals.title")).font(Theme.serif(24, bold: true)).kerning(5).foregroundColor(Theme.goldLight)
      if store.progress.annals.isEmpty {
        Text(L("annals.empty")).font(Theme.serif(14)).foregroundColor(Theme.muted)
      } else {
        ScrollView {
          LazyVGrid(columns: [GridItem(.adaptive(minimum: 250), spacing: 12)], spacing: 12) {
            ForEach(Array(store.progress.annals.keys.sorted()), id: \.self) { gid in
              AnnalCard(gid: gid)
            }
          }
        }
      }
      Button { GameViewModel.shared.sheet = nil } label: { InkButton(title: L("common.close")) }.buttonStyle(.plain)
    }
    .padding(26)
    .frame(minWidth: 560, minHeight: 420)
    .background(Theme.ink.opacity(0.98))
  }
}

struct AnnalCard: View {
  @ObservedObject var store = ProgressStore.shared
  let gid: String
  var body: some View {
    let a = store.progress.annals[gid] ?? Annal()
    let g = GameData.shared.general(gid)
    let appearances: String = {
      var chapters: [String] = []
      for chapter in GameData.shared.chapters {
        for enc in chapterEncounters(chapter) where enc.cfg["gen"].string == gid {
          if let name = chapter["name"].string, !chapters.contains(name) { chapters.append(name) }
        }
      }
      return chapters.joined(separator: "、")
    }()
    let traits = traitsOfGen(gid)
    let tellSummary: String? = {
      guard let rec = store.tellRecord(gid) else { return nil }
      return "\(L("tell.seen")) \(rec.n) · \(L("tell.read")) \(rec.hit) · \(L("tell.lies")) \(rec.lies)"
    }()
    return VStack(alignment: .leading, spacing: 6) {
      HStack(spacing: 10) {
        PortraitView(skin: g?["skin"].string ?? "default", size: 44)
        VStack(alignment: .leading, spacing: 2) {
          Text(g?["name"].string ?? gid).font(Theme.serif(16, bold: true)).foregroundColor(Theme.goldLight)
          Text("\(a.won) \(L("practice.w")) / \(a.seen - a.won) \(L("practice.l"))").font(Theme.serif(11)).foregroundColor(Theme.paperDim)
        }
        Spacer()
      }
      Text("\(L("annals.appearances")) \(appearances.isEmpty ? "—" : appearances)")
        .font(Theme.serif(10)).foregroundColor(Theme.muted).lineLimit(2)
      TraitGridView(traits: traits)
      Text(tellSummary ?? L("annals.noTell")).font(Theme.serif(10)).foregroundColor(tellSummary != nil ? Theme.goldLight : Theme.muted)
    }
    .padding(12)
    .background(Theme.lacquer.opacity(0.7))
    .overlay(RoundedRectangle(cornerRadius: 3).strokeBorder(Theme.gold.opacity(0.25), lineWidth: 1))
  }

  func traitsOfGen(_ gid: String) -> [String: Int] {
    for chapter in GameData.shared.chapters {
      if let enc = chapterEncounters(chapter).first(where: { $0.cfg["gen"].string == gid }) {
        return enc.cfg["traits"].dict.compactMapValues { ($0 as? NSNumber)?.intValue }
      }
    }
    return [:]
  }
}

// MARK: - 设置

struct SettingsSheet: View {
  @ObservedObject var store = ProgressStore.shared
  @ObservedObject var l10n = L10n.shared
  var body: some View {
    VStack(spacing: 18) {
      Text(L("settings.title")).font(Theme.serif(24, bold: true)).kerning(5).foregroundColor(Theme.goldLight)
      Toggle(isOn: Binding(
        get: { store.progress.settings.equityAssist },
        set: { v in
          store.progress.settings.equityAssist = v
          store.persist()
        })) {
        VStack(alignment: .leading, spacing: 2) {
          Text(L("settings.equityAssist")).font(Theme.serif(15)).foregroundColor(Theme.textMain)
          Text(L("settings.equityAssistDesc")).font(Theme.serif(11)).foregroundColor(Theme.muted)
        }
      }
      .toggleStyle(.switch)
      .frame(maxWidth: 360)
      Divider().overlay(Theme.gold.opacity(0.3))
      VStack(spacing: 6) {
        Text(L("settings.language")).font(Theme.serif(13)).foregroundColor(Theme.muted)
        Picker("", selection: $l10n.language) {
          ForEach(AppLanguage.allCases) { lang in
            Text(lang.displayName).tag(lang)
          }
        }
        .pickerStyle(.segmented)
        .frame(maxWidth: 380)
        Text(L("settings.languageNote")).font(Theme.serif(10)).foregroundColor(Theme.muted)
      }
      Button { GameViewModel.shared.sheet = nil } label: { InkButton(title: L("common.close")) }.buttonStyle(.plain)
    }
    .padding(30)
    .frame(minWidth: 460)
    .background(Theme.ink.opacity(0.98))
  }
}

// MARK: - 存档

struct SaveSheet: View {
  @ObservedObject var store = ProgressStore.shared
  @State private var importSummary: String? = nil
  @State private var pendingImport: Progress? = nil
  @State private var exportedAt: Date? = nil
  var body: some View {
    VStack(spacing: 16) {
      Text(L("save.title")).font(Theme.serif(24, bold: true)).kerning(5).foregroundColor(Theme.goldLight)
      let yeshi = store.progress.pages.values.filter { ProgressStore.isYeshi($0) }.count
      Text("\(L("save.summary")) \(yeshi) \(L("save.pages")) · \(store.progress.annals.count) \(L("save.generals")) · \(store.progress.endings.count) \(L("save.endings")) · \(store.progress.practice.values.reduce(0) { $0 + $1.seen }) \(L("save.practice"))")
        .font(Theme.serif(13)).foregroundColor(Theme.muted)
      HStack(spacing: 14) {
        Button { exportSave() } label: { InkButton(title: L("save.export")) }.buttonStyle(.plain)
        Button { importSave() } label: { InkButton(title: L("save.import")) }.buttonStyle(.plain)
        Button { GameViewModel.shared.sheet = nil } label: { InkButton(title: L("common.close")) }.buttonStyle(.plain)
      }
      if let summary = importSummary {
        Text(summary).font(Theme.serif(13)).foregroundColor(Theme.paper).multilineTextAlignment(.center)
        if pendingImport != nil {
          Button {
            if let p = pendingImport {
              store.replace(with: p)
            }
            pendingImport = nil
            importSummary = nil
            GameViewModel.shared.sheet = nil
            GameViewModel.shared.showCodex()
          } label: { InkButton(title: L("save.confirmOverwrite"), prominent: true) }.buttonStyle(.plain)
        }
      }
      Text(L("save.note")).font(Theme.serif(10)).foregroundColor(Theme.muted)
    }
    .padding(30)
    .frame(minWidth: 460)
    .background(Theme.ink.opacity(0.98))
  }

  private func exportSave() {
    let data = store.exportWebSave()
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd"
    let name = "sanguo-save-\(formatter.string(from: Date())).json"
    #if os(macOS)
    let panel = NSSavePanel()
    panel.nameFieldStringValue = name
    panel.allowedContentTypes = [.json]
    if panel.runModal() == .OK, let url = panel.url {
      try? data.write(to: url)
      importSummary = "\(L("save.exported")) \(url.lastPathComponent)"
    }
    #else
    let url = FileManager.default.temporaryDirectory.appendingPathComponent(name)
    try? data.write(to: url)
    let share = UIActivityViewController(activityItems: [url], applicationActivities: nil)
    UIApplication.shared.connectedScenes.compactMap { ($0 as? UIWindowScene)?.keyWindow?.rootViewController }.first?.present(share, animated: true)
    importSummary = L("save.exported")
    #endif
  }

  private func importSave() {
    #if os(macOS)
    let panel = NSOpenPanel()
    panel.allowedContentTypes = [.json]
    if panel.runModal() == .OK, let url = panel.url, let data = try? Data(contentsOf: url) {
      applyImport(data)
    }
    #else
    let picker = UIDocumentPickerViewController(forOpeningContentTypes: [.json])
    picker.delegate = DocumentPickerDelegate { data in
      applyImport(data)
    }
    UIApplication.shared.connectedScenes.compactMap { ($0 as? UIWindowScene)?.keyWindow?.rootViewController }.first?.present(picker, animated: true)
    #endif
  }

  private func applyImport(_ data: Data) {
    do {
      let parsed = try ProgressStore.readWebSave(data)
      pendingImport = parsed.progress
      importSummary = SaveSheet.importSummaryText(parsed)
    } catch {
      pendingImport = nil
      let message = (error as? EngineError)?.errorDescription
      importSummary = message ?? L("save.invalid")
    }
  }

  static func importSummaryText(_ parsed: (progress: Progress, exportedAt: Date?)) -> String {
    let yeshi = parsed.progress.pages.values.filter { ProgressStore.isYeshi($0) }.count
    let practice = parsed.progress.practice.values.reduce(0) { $0 + $1.seen }
    var text = L("save.importSummary")
    text += " " + String(yeshi) + " " + L("save.pages")
    text += " · " + String(parsed.progress.annals.count) + " " + L("save.generals")
    text += " · " + String(parsed.progress.endings.count) + " " + L("save.endings")
    text += " · " + String(practice) + " " + L("save.practice")
    if let date = parsed.exportedAt {
      text += "\n" + L("save.exportedAt") + " " + date.formatted()
    }
    return text
  }
}

#if os(iOS)
final class DocumentPickerDelegate: NSObject, UIDocumentPickerDelegate {
  let handler: (Data) -> Void
  init(handler: @escaping (Data) -> Void) { self.handler = handler }
  func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
    if let url = urls.first, let data = try? Data(contentsOf: url) {
      handler(data)
    }
  }
}
#endif

// MARK: - App 根

struct RootView: View {
  @ObservedObject var game = GameViewModel.shared
  @ObservedObject var l10n = L10n.shared
  var body: some View {
    ZStack {
      switch game.screen {
      case .title: TitleScreen()
      case .codex: CodexScreen()
      case .chapterPage: ChapterPageScreen()
      case .map: MapScreen()
      case .battle: BattleScreen()
      case .practice: PracticeScreen()
      }
      sheetLayer
      if let toast = game.toast {
        VStack {
          Spacer()
          Text(toast).font(Theme.serif(13)).foregroundColor(Theme.paper)
            .padding(12).background(Theme.ink.opacity(0.92))
            .overlay(RoundedRectangle(cornerRadius: 3).strokeBorder(Theme.gold.opacity(0.5), lineWidth: 1))
            .padding(.bottom, 24)
        }
      }
    }
    .task {
      _ = GameData.shared // 触发加载
      #if DEBUG
      // 截图/验收: ggcode-weizhu -ggcodeDebugBattle=0.6 (参数为战书自动确认延迟秒数)
      if let arg = ProcessInfo.processInfo.arguments.first(where: { $0.hasPrefix("-ggcodeDebugBattle") }) {
        let delay = Double(arg.split(separator: "=").last.map(String.init) ?? "") ?? 0.6
        await game.debugStartBattle(autoAcceptAfter: delay)
      }
      if let arg = ProcessInfo.processInfo.arguments.first(where: { $0.hasPrefix("-ggcodeDebugResult") }) {
        game.debugShowBattleResult(win: !arg.lowercased().contains("loss"))
      }
      #endif
    }
  }

  @ViewBuilder
  private var sheetLayer: some View {
    switch game.sheet {
    case .omen: OmenSheet()
    case .storyScene(let nodeId): StorySceneSheet(nodeId: nodeId)
    case .event(let type): EventSheet(type: type)
    case .briefing: if case .briefing(let n, let b, let r, let rs) = game.sheet { BriefingSheet(sheet: .briefing(nodeId: n, boss: b, round: r, rounds: rs)) }
    case .generalIntro(let i, let c, let b): GeneralIntroSheet(index: i, count: c, boss: b)
    case .settle(let w): SettleSheet(win: w)
    case .battleResult(let w): BattleResultSheet(win: w)
    case .finale: FinaleSheet()
    case .annals: AnnalsSheet()
    case .settings: SettingsSheet()
    case .save: SaveSheet()
    case .verify: EmptyView()
    case nil: EmptyView()
    }
  }
}
