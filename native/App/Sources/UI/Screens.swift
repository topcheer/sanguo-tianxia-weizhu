// Screens.swift —— 开卷/目录/题记/天时/行军/战书/武将卡/结算/终局/练习场/观阵录/设置/存档。
import SwiftUI

// MARK: - 开卷(标题)

struct TitleScreen: View {
  @ObservedObject var game = GameViewModel.shared
  @ObservedObject var l10n = L10n.shared
  var body: some View {
    ZStack {
      Theme.inkDeep.ignoresSafeArea()
      VStack(spacing: 26) {
        Text(L("title.era")).font(Theme.serif(13)).kerning(5).foregroundColor(Theme.muted)
        HStack(spacing: 18) {
          SealStamp(text: "注")
          VStack(spacing: 8) {
            Text(L("title.name")).font(Theme.serif(56, bold: true)).kerning(6).foregroundColor(Color(hex: 0xe5d8b7))
            Text(L("title.sub")).font(.system(size: 11)).kerning(4).foregroundColor(Theme.muted)
          }
        }
        HStack(spacing: 14) {
          ForEach(["魏", "蜀", "吴"], id: \.self) { k in
            Text(k).font(Theme.serif(22)).foregroundColor(Theme.gold)
              .frame(width: 50, height: 50)
              .overlay(Circle().strokeBorder(Color(hex: 0x736748), lineWidth: 1))
          }
        }
        Text(L("title.story"))
          .font(Theme.serif(15)).foregroundColor(Color(hex: 0xc3b99e))
          .multilineTextAlignment(.center)
          .lineSpacing(9).kerning(1.5)
          .frame(maxWidth: 560)
        Button {
          game.enterGame()
        } label: {
          InkButton(title: L("title.start"), subtitle: L("title.startSub"), prominent: true)
        }.buttonStyle(.plain)
        Text(L("title.hint")).font(.system(size: 11)).kerning(2).foregroundColor(Color(hex: 0x777662))
      }
      .padding()
    }
  }
}

// MARK: - 目录(残卷)

struct CodexScreen: View {
  @ObservedObject var game = GameViewModel.shared
  @ObservedObject var store = ProgressStore.shared
  @ObservedObject var l10n = L10n.shared
  @State private var showOnboardingReplay = false

  var body: some View {
    ZStack {
      Theme.inkDeep.ignoresSafeArea()
      VStack(spacing: 0) {
        header
        ScrollView {
          VStack(alignment: .leading, spacing: 22) {
            ForEach(1...5, id: \.self) { s in
              scrollGroup(s)
            }
            practiceGate
            if !store.progress.endings.isEmpty {
              Button { game.openApocrypha() } label: {
                InkButton(title: "\(L("apoc.entry"))\(store.progress.apocWins > 0 ? " · \(L("apoc.won")) \(store.progress.apocWins)" : "")")
              }.buttonStyle(.plain)
            }
          }
          .padding(.horizontal, 24).padding(.bottom, 40)
        }
      }
    }
    #if os(macOS)
    .frame(minWidth: 960, minHeight: 620)
    #endif
  }

  private var header: some View {
    HStack(spacing: 16) {
      VStack(alignment: .leading, spacing: 6) {
        Text(L("codex.title")).font(Theme.serif(30, bold: true)).kerning(8).foregroundColor(Theme.goldLight)
        Text("\(L("codex.progress")) \(store.yeshiCount()) / \(GameData.shared.normalIds.count)")
          .font(Theme.serif(13)).foregroundColor(Theme.muted)
        if store.finaleUnlocked() {
          Text(L("codex.finaleUnlocked")).font(Theme.serif(12)).foregroundColor(Theme.goldLight)
        }
      }
      Spacer()
      Button { game.sheet = .annals } label: { InkButton(title: L("codex.annals")) }.buttonStyle(.plain)
      Button { game.sheet = .save } label: { InkButton(title: L("codex.save")) }.buttonStyle(.plain)
      Button { game.sheet = .settings } label: { InkButton(title: L("codex.settings")) }.buttonStyle(.plain)
    }
    .padding(.horizontal, 24).padding(.vertical, 14)
    .background(LinearGradient(colors: [Theme.ink.opacity(0.9), Theme.inkDeep], startPoint: .top, endPoint: .bottom))
  }

  private func scrollGroup(_ s: Int) -> some View {
    let unlocked = store.scrollUnlocked(s)
    let title = s == 5 ? L("scroll.lastPage") : "\(L("scroll.volume"))\(String(["一", "二", "三", "四"][s - 1])) · \(L("scroll.\(s)"))"
    return VStack(alignment: .leading, spacing: 10) {
      HStack {
        Text(title + (unlocked ? "" : " 🔒")).font(Theme.serif(18, bold: true)).kerning(3).foregroundColor(unlocked ? Theme.goldLight : Theme.muted)
        Rectangle().fill(Theme.gold.opacity(0.25)).frame(height: 1).frame(maxWidth: .infinity)
      }
      FlowLayout(spacing: 8) {
        ForEach(Array(GameData.shared.chapters.filter { $0["scroll"].int == s }.enumerated()), id: \.offset) { _, c in
          let st = store.pageState(c["id"].string ?? "")
          let mark = ["unread": "○", "history": L("mark.history"), "yeshi": L("mark.yeshi"), "yeshiB": L("mark.yeshi"), "yeshiAB": L("mark.both")][st] ?? "○"
          Button {
            if unlocked { game.openChapter(c) }
          } label: {
            HStack(spacing: 5) {
              Text(mark).font(Theme.serif(12)).foregroundColor(ProgressStore.isYeshi(st) ? Theme.goldLight : Theme.paperDim)
              Text(c["name"].string ?? "").font(Theme.serif(15)).kerning(1)
            }
            .padding(.horizontal, 12).padding(.vertical, 7)
            .background(unlocked ? Theme.lacquer : Theme.lacquer.opacity(0.4))
            .overlay(RoundedRectangle(cornerRadius: 2).strokeBorder(ProgressStore.isYeshi(st) ? Theme.gold.opacity(0.8) : Theme.gold.opacity(0.25), lineWidth: 1))
            .foregroundColor(unlocked ? Theme.textMain : Theme.muted)
          }
          .buttonStyle(.plain)
          .disabled(!unlocked)
        }
      }
    }
    .opacity(unlocked ? 1 : 0.55)
  }

  private var practiceGate: some View {
    Button { game.enterPractice() } label: {
      HStack {
        VStack(alignment: .leading, spacing: 4) {
          Text(L("practice.entry")).font(Theme.serif(19, bold: true)).kerning(4).foregroundColor(Theme.goldLight)
          Text(L("practice.entrySub")).font(Theme.serif(12)).foregroundColor(Theme.muted)
        }
        Spacer()
        Text("33 \(L("practice.tables"))").font(Theme.serif(13)).foregroundColor(Theme.paperDim)
      }
      .padding(16)
      .background(LinearGradient(colors: [Theme.jade.opacity(0.25), Theme.lacquer], startPoint: .leading, endPoint: .trailing))
      .overlay(RoundedRectangle(cornerRadius: 3).strokeBorder(Theme.jade.opacity(0.7), lineWidth: 1))
    }
    .buttonStyle(.plain)
  }
}

// 简易流式布局
struct FlowLayout<Content: View>: View {
  var spacing: CGFloat = 8
  var content: Content
  init(spacing: CGFloat = 8, @ViewBuilder content: () -> Content) {
    self.spacing = spacing
    self.content = content()
  }
  var body: some View {
    LazyVGrid(columns: [GridItem(.adaptive(minimum: 130), alignment: .leading)], alignment: .leading, spacing: spacing) {
      content
    }
  }
}

// MARK: - 章节页(题记 + 史实底稿)

struct ChapterPageScreen: View {
  @ObservedObject var game = GameViewModel.shared
  @ObservedObject var store = ProgressStore.shared
  var body: some View {
    guard let chapter = game.selectedChapter else { return AnyView(EmptyView()) }
    let brief = GameData.shared.briefingOf(chapter["id"].string ?? "")
    let ctx = StoryContext(P: store.progress, chapter: chapter)
    let coldOpen = coldOpenFor(chapter, ctx)
    let objective = GameData.shared.storyOf(chapter["id"].string ?? "")?["objective"].string
    let siblings = GameData.shared.chapters.filter { $0["scroll"].int == chapter["scroll"].int }
    let ordinal = (siblings.firstIndex { $0["id"].string == chapter["id"].string } ?? -1) + 1
    let folio = chapter["apocrypha"].bool == true ? L("page.apocFolio")
      : chapter["type"].string == "finale" ? L("page.finaleFolio")
      : "\(L("scroll.volume"))\(String(["一", "二", "三", "四"][max(0, (chapter["scroll"].int ?? 1) - 1)])) · \(L("page.chapterNo")) \(ordinal)"
    let altShow = chapter["id"].string == "wuzhangyuan" && store.isYeshi("wuzhangyuan")
    return AnyView(
      ZStack {
        Theme.inkDeep.ignoresSafeArea()
        ScrollView {
          VStack(alignment: .leading, spacing: 18) {
            HStack {
              Text(folio).font(Theme.serif(12)).kerning(3).foregroundColor(Theme.muted)
              Spacer()
              Text(chapter["year"].string ?? "").font(Theme.serif(12)).kerning(2).foregroundColor(Theme.muted)
            }
            Text(chapter["name"].string ?? "").font(Theme.serif(38, bold: true)).kerning(5).foregroundColor(Theme.goldLight)
            Text(chapter["premise"].string ?? "").font(Theme.serif(17)).foregroundColor(Theme.paper).kerning(1)
            // 史实底稿
            if let brief {
              PaperCard {
                VStack(alignment: .leading, spacing: 8) {
                  Text(L("page.briefKicker")).font(Theme.serif(11)).kerning(4).foregroundColor(Theme.gold)
                  LabeledRow(label: L("page.era"), value: brief["era"].string ?? "")
                  LabeledRow(label: L("page.source"), value: brief["source"].string ?? "")
                  LabeledRow(label: L("page.record"), value: brief["record"].string ?? "")
                  LabeledRow(label: L("page.adaptation"), value: brief["adaptation"].string ?? "")
                  LabeledRow(label: L("page.lead"), value: brief["lead"].string ?? "")
                }
              }
            }
            if let regret = chapter["regret"].string, !regret.isEmpty {
              Text("\(L("page.regret")) \(regret)").font(Theme.serif(13)).foregroundColor(Theme.paperDim)
            }
            // 冷开场
            if !coldOpen.isEmpty {
              VStack(alignment: .leading, spacing: 12) {
                ForEach(Array(coldOpen.enumerated()), id: \.offset) { _, line in
                  StoryLineRow(speaker: speakerName(line["speaker"].string ?? "narrator"), text: line["text"].string ?? "")
                }
              }
            }
            if let objective, !objective.isEmpty {
              Text("\(L("page.objective")) \(objective)").font(Theme.serif(14)).foregroundColor(Theme.jade.opacity(0.9))
            }
            // 行军路线
            HStack(spacing: 8) {
              ForEach(Array((chapter["map"].stringArray).enumerated()), id: \.offset) { i, place in
                if i > 0 { Text("→").foregroundColor(Theme.muted) }
                Text(place).font(Theme.serif(14)).foregroundColor(Theme.paperDim)
              }
            }
            if let ruleText = chapter["ruleText"].string, !ruleText.isEmpty {
              Text(ruleText).font(Theme.serif(13)).foregroundColor(Theme.cinnabarLight)
            }
            Text(chapter["note"].string ?? "").font(Theme.serif(12)).foregroundColor(Theme.muted)
            HStack(spacing: 14) {
              Button {
                game.pickOmen()
                game.omenPick = { fx in
                  game.startMarch(chapter, omenFx: fx)
                }
              } label: { InkButton(title: L("page.start"), prominent: true) }.buttonStyle(.plain)
              if altShow {
                Button {
                  game.pickOmen()
                  game.omenPick = { fx in
                    game.startMarch(chapter, omenFx: fx, asZhuge: true)
                  }
                } label: { InkButton(title: L("page.zhizishou")) }.buttonStyle(.plain)
              }
              Button { game.showCodex() } label: { InkButton(title: L("common.back")) }.buttonStyle(.plain)
              Spacer()
            }
          }
          .padding(28)
          .frame(maxWidth: 760, alignment: .leading)
        }
      }
    )
  }
}

struct LabeledRow: View {
  let label: String
  let value: String
  var body: some View {
    HStack(alignment: .top, spacing: 10) {
      Text(label).font(Theme.serif(12)).foregroundColor(Theme.gold).frame(width: 64, alignment: .trailing)
      Text(value).font(Theme.serif(13)).foregroundColor(Theme.paper.opacity(0.9)).fixedSize(horizontal: false, vertical: true)
    }
  }
}

struct StoryLineRow: View {
  let speaker: String
  let text: String
  var body: some View {
    HStack(alignment: .top, spacing: 10) {
      Text(speaker).font(Theme.serif(12, bold: true)).foregroundColor(Theme.gold)
        .frame(width: 58, alignment: .trailing).padding(.top, 3)
      Text(text).font(Theme.serif(15)).foregroundColor(Theme.textMain).lineSpacing(6).fixedSize(horizontal: false, vertical: true)
    }
  }
}

// MARK: - 天时

struct OmenSheet: View {
  @ObservedObject var game = GameViewModel.shared
  var body: some View {
    let chapter = game.selectedChapter
    return VStack(spacing: 20) {
      Text(L("omen.title")).font(Theme.serif(26, bold: true)).kerning(8).foregroundColor(Theme.goldLight)
      Text("\(chapter?["year"].string ?? "") · \(chapter?["name"].string ?? "")\n\(L("omen.pick"))")
        .font(Theme.serif(14)).foregroundColor(Theme.muted).multilineTextAlignment(.center)
      ForEach(Array((chapter?["omens"].array ?? []).enumerated()), id: \.offset) { _, o in
        let om = Dyn(o)
        let fx = om["fx"].string ?? ""
        let desc = GameData.shared.chaptersRoot["fx"][fx]["desc"].string ?? ""
        Button {
          game.applyOmen(fx)
        } label: {
          HStack {
            Text(om["n"].string ?? "").font(Theme.serif(17)).foregroundColor(Theme.textMain)
            Spacer()
            Text(desc).font(Theme.serif(13)).foregroundColor(Theme.goldLight)
          }
          .padding(.horizontal, 22).padding(.vertical, 12)
          .background(Theme.lacquer)
          .overlay(RoundedRectangle(cornerRadius: 2).strokeBorder(Theme.gold.opacity(0.4), lineWidth: 1))
          .frame(minWidth: 380)
        }.buttonStyle(.plain)
      }
    }
    .padding(34)
    .background(Theme.ink.opacity(0.98))
  }
}

// MARK: - 行军图

struct MapScreen: View {
  @ObservedObject var game = GameViewModel.shared
  var body: some View {
    guard let R = game.R else { return AnyView(EmptyView()) }
    let available = Set(game.availableNodes())
    return AnyView(
      ZStack {
        LinearGradient(colors: [Color(hex: 0x1a2116), Theme.inkDeep], startPoint: .top, endPoint: .bottom).ignoresSafeArea()
        VStack(spacing: 14) {
          HStack {
            Text("\(L("map.title")) · \(R.chapter["name"].string ?? "")").font(Theme.serif(22, bold: true)).kerning(4).foregroundColor(Theme.goldLight)
            Spacer()
            VStack(alignment: .trailing) {
              Text("\(L("term.chips")) \(R.chips)").font(Theme.serif(16)).foregroundColor(Theme.goldLight)
              Text(R.marchInfo).font(Theme.serif(11)).foregroundColor(Theme.muted)
            }
          }
          ScrollView(.horizontal, showsIndicators: true) {
            HStack(alignment: .center, spacing: 0) {
              ForEach(Array(R.nodes.enumerated()), id: \.element.id) { i, node in
                if i > 0 {
                  Path { p in
                    p.move(to: CGPoint(x: 0, y: 0))
                    p.addCurve(to: CGPoint(x: 64, y: 0), control1: CGPoint(x: 16, y: -14), control2: CGPoint(x: 48, y: -14))
                  }
                  .stroke(node.done ? Theme.gold : Theme.gold.opacity(0.3), style: StrokeStyle(lineWidth: 1.4, dash: [4, 3]))
                  .frame(width: 64, height: 20)
                }
                MapNodeView(node: node, available: available.contains(node.id) && !node.done, isCurrent: R.current == node.id) {
                  Task { await game.pickNode(node) }
                }
              }
            }
            .padding(.horizontal, 40).padding(.vertical, 24)
          }
          Spacer()
        }.padding(24)
      }
    )
  }
}

struct MapNodeView: View {
  let node: MarchNode
  let available: Bool
  let isCurrent: Bool
  let action: () -> Void
  var body: some View {
    let glyph = ["battle": "♠", "rest": "♨", "shop": "✦", "chest": "◆", "boss": "♛"][node.type] ?? "•"
    let label = [ "battle": L("map.battle"), "rest": L("map.rest"), "shop": L("map.shop"), "chest": L("map.chest"), "boss": L("map.boss")][node.type] ?? ""
    return VStack(spacing: 6) {
      if isCurrent { Text("▼ \(L("map.youHere"))").font(Theme.serif(11)).foregroundColor(Theme.cinnabarLight) } else { Text(" ").font(Theme.serif(11)) }
      Button(action: action) {
        VStack(spacing: 4) {
          Text(glyph).font(Theme.serif(node.type == "boss" ? 30 : 24))
            .foregroundColor(node.done ? Theme.muted : (node.type == "boss" ? Theme.goldLight : Theme.paper))
          Text("\(label) · \(node.name)").font(Theme.serif(12)).kerning(1)
            .foregroundColor(node.done ? Theme.muted : Theme.paperDim)
        }
        .frame(width: node.type == "boss" ? 96 : 82, height: node.type == "boss" ? 96 : 82)
        .background(RoundedRectangle(cornerRadius: 6).fill(node.done ? Theme.lacquer.opacity(0.5) : (available ? Theme.jade.opacity(0.28) : Theme.lacquer.opacity(0.8))))
        .overlay(RoundedRectangle(cornerRadius: 6).strokeBorder(available ? Theme.gold : Theme.gold.opacity(0.22), lineWidth: available ? 1.6 : 1))
        .opacity(available ? 1 : 0.85)
      }
      .buttonStyle(.plain)
      .disabled(!available)
    }
  }
}

// MARK: - 战书

struct BriefingSheet: View {
  @ObservedObject var game = GameViewModel.shared
  let sheet: Sheet
  var body: some View {
    VStack(spacing: 16) {
      Text(L("brief.kicker")).font(Theme.serif(11)).kerning(5).foregroundColor(Theme.gold)
      if case .briefing(_, let boss, let round, let rounds) = sheet {
        // 标题与缘由
        let isPractice = game.R == nil
        let arenaBrief: Dyn? = isPractice ? game.practiceArena : nil
        Group {
          if let arena = arenaBrief {
            VStack(spacing: 6) {
              Text("\(arena["place"].string ?? "") · \(arena["name"].string ?? "")").font(Theme.serif(24, bold: true)).kerning(3).foregroundColor(Theme.goldLight)
              Text(arena["why"].string ?? "").font(Theme.serif(14)).foregroundColor(Theme.paper).multilineTextAlignment(.center)
            }
          } else if let chapter = game.selectedChapter ?? game.R?.chapter,
                    let brief = GameData.shared.briefingOf(chapter["id"].string ?? "") {
            let node = brief[boss ? "boss" : "skirmish"]
            VStack(spacing: 6) {
              Text(node["title"].string ?? "").font(Theme.serif(24, bold: true)).kerning(3).foregroundColor(Theme.goldLight)
              Text(node["why"].string ?? "").font(Theme.serif(14)).foregroundColor(Theme.paper).multilineTextAlignment(.center).frame(maxWidth: 520)
            }
          }
        }
        // 阵容
        rosterRow
        if rounds > 1 {
          Text("\(L("battle.round")) \(round) / \(rounds)").font(Theme.serif(13)).foregroundColor(Theme.cinnabarLight)
        }
        HStack(spacing: 14) {
          Button { game.pendingBriefing?(false) } label: { InkButton(title: L("brief.back")) }.buttonStyle(.plain)
          Button { game.pendingBriefing?(true) } label: { InkButton(title: L("brief.accept"), prominent: true) }.buttonStyle(.plain)
        }
      }
    }
    .padding(34)
    .background(Theme.ink.opacity(0.98))
    .frame(maxWidth: 640)
  }

  private var rosterRow: some View {
    let roster: [Dyn]
    if game.R == nil, let arena = game.practiceArena {
      roster = arena["roster"].array.map(Dyn.init)
    } else if let chapter = game.selectedChapter ?? game.R?.chapter, case .briefing(_, let boss, _, _) = sheet {
      // 简化:取对应阵容(boss/skirmish)
      let cfg = boss ? (game.R?.chapter ?? chapter)["boss"] : (game.R?.chapter ?? chapter)["skirmish"]
      roster = rosterOf(roundConfig(cfg, game.R?.bossRound ?? 1))
    } else {
      roster = []
    }
    return HStack(spacing: 12) {
      ForEach(Array(roster.enumerated()), id: \.offset) { _, m in
        let gen = GameData.shared.general(m["gen"].string)
        VStack(spacing: 4) {
          PortraitView(skin: gen?["skin"].string ?? (m["skin"].string ?? "soldier"), size: 52)
          Text(m["name"].string ?? "").font(Theme.serif(13)).foregroundColor(Theme.textMain)
          Text("\(L("term.chips")) \(m["stack"].int ?? 1000)").font(Theme.serif(11)).foregroundColor(Theme.gold)
        }
      }
    }
  }
}

// MARK: - 武将亮相卡

struct GeneralIntroSheet: View {
  @ObservedObject var game = GameViewModel.shared
  let index: Int
  let count: Int
  let boss: Bool
  var body: some View {
    let chapter = game.R?.chapter
    let ctx = { () -> StoryContext in
      var c = StoryContext(P: ProgressStore.shared.progress, chapter: chapter)
      c.asZhuge = game.R?.asZhuge ?? false
      return c
    }()
    let cfg: Dyn = {
      guard let chapter else { return Dyn([String: Any]()) }
      let encs = chapterEncounters(chapter).filter { $0.kind == (boss ? "boss" : "skirmish") }
      let idx = min(index, max(0, encs.count - 1))
      return encs.isEmpty ? chapter["skirmish"] : encs[idx].cfg
    }()
    let intro = introFor(chapter, cfg, ctx)
    let gen = GameData.shared.general(cfg["gen"].string)
    let bio = intro["bio"].string ?? gen?["bio"].string ?? (boss ? L("intro.bossBio") : L("intro.skirmishBio"))
    let quote = intro["quote"].string ?? gen?["barks"]["open"].string ?? (boss ? L("intro.bossQuote") : L("intro.skirmishQuote"))
    let ruleText = intro["rule"].string ?? chapter?["ruleText"].string ?? GameData.shared.storyOf(chapter?["id"].string ?? "")?["objective"].string ?? chapter?["premise"].string ?? ""
    let traits = cfg["traits"].dict.compactMapValues { ($0 as? NSNumber)?.intValue }
    return VStack(spacing: 14) {
      Text(boss ? (chapter?["gate"].bool == true ? L("intro.gateKicker") : L("intro.bossKicker")) : L("intro.skirmishKicker"))
        .font(Theme.serif(11)).kerning(5).foregroundColor(boss ? Theme.cinnabarLight : Theme.gold)
      HStack(spacing: 18) {
        PortraitView(skin: gen?["skin"].string ?? (boss ? "commander" : "soldier"), size: 96)
        VStack(alignment: .leading, spacing: 8) {
          Text(cfg["name"].string ?? "").font(Theme.serif(28, bold: true)).kerning(3).foregroundColor(Theme.goldLight)
          Text(bio).font(Theme.serif(13)).foregroundColor(Theme.paperDim)
          Text("「\(quote)」").font(Theme.serif(15)).foregroundColor(Theme.paper).kerning(1)
        }
      }
      TraitGridView(traits: traits)
      if !ruleText.isEmpty {
        Text(ruleText).font(Theme.serif(13)).foregroundColor(Theme.jade.opacity(0.95)).multilineTextAlignment(.center)
      }
      Button {
        game.pendingIntro?(true)
      } label: {
        InkButton(title: count > 1 ? (index < count - 1 ? L("intro.next") : L("intro.fight")) : L("intro.fight"),
                  subtitle: count > 1 ? "\(index + 1) / \(count)" : nil, prominent: boss)
      }.buttonStyle(.plain)
    }
    .padding(34)
    .background(Theme.ink.opacity(0.98))
    .frame(maxWidth: 620)
  }
}

struct TraitGridView: View {
  let traits: [String: Int]
  var body: some View {
    let labels = describeTraits(traits)
    return HStack(spacing: 10) {
      ForEach(labels, id: \.trait) { item in
        VStack(spacing: 2) {
          Text(item.trait).font(Theme.serif(13)).foregroundColor(Theme.gold)
          Text("\(Int(item.value))").font(Theme.serif(15, bold: true)).foregroundColor(Theme.paperLight)
          Text(item.label).font(Theme.serif(9)).foregroundColor(Theme.muted)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 6)
        .background(Theme.lacquer.opacity(0.6))
        .overlay(RoundedRectangle(cornerRadius: 2).strokeBorder(Theme.gold.opacity(0.2), lineWidth: 1))
      }
    }
  }
}

// MARK: - 事件弹窗

struct EventSheet: View {
  @ObservedObject var game = GameViewModel.shared
  let type: String
  var body: some View {
    VStack(spacing: 16) {
      if type == "rest" {
        Text(L("event.rest.title")).font(Theme.serif(24, bold: true)).kerning(6).foregroundColor(Theme.goldLight)
        Text(L("event.rest.story")).font(Theme.serif(14)).foregroundColor(Theme.paper).multilineTextAlignment(.center)
        eventButton("heal", L("event.rest.heal"))
        eventButton("calm", L("event.rest.calm"))
      } else if type == "shop" {
        Text(L("event.shop.title")).font(Theme.serif(24, bold: true)).kerning(6).foregroundColor(Theme.goldLight)
        Text(L("event.shop.story")).font(Theme.serif(14)).foregroundColor(Theme.paper).multilineTextAlignment(.center)
        eventButton("money", L("event.shop.money"))
        eventButton("bribe", L("event.shop.bribe"))
        eventButton("eye", L("event.shop.eye"))
      } else {
        Text(L("event.chest.title")).font(Theme.serif(24, bold: true)).kerning(6).foregroundColor(Theme.goldLight)
        Text(L("event.chest.story")).font(Theme.serif(14)).foregroundColor(Theme.paper).multilineTextAlignment(.center)
        eventButton("loot", L("event.chest.loot"))
      }
    }
    .padding(34)
    .background(Theme.ink.opacity(0.98))
  }

  private func eventButton(_ key: String, _ label: String) -> some View {
    Button { game.eventPick?(key) } label: {
      InkButton(title: label)
    }.buttonStyle(.plain)
  }
}

// MARK: - 章节场景

struct StorySceneSheet: View {
  @ObservedObject var game = GameViewModel.shared
  let nodeId: String
  var body: some View {
    let chapter = game.R?.chapter
    let node = game.R?.nodes.first { $0.id == nodeId }
    let scene = mapSceneFor(chapter, Dyn(["col": node?.col ?? -1, "id": nodeId]))
    let ctx = StoryContext(P: ProgressStore.shared.progress, chapter: chapter)
    let lines = scene.map { linesFor($0["lines"].array.map(Dyn.init), ctx) } ?? []
    let previousChoice: String? = {
      guard let chapterId = chapter?["id"].string, let sceneId = scene?["id"].string else { return nil }
      return choiceFor(ProgressStore.shared.progress, chapterId, sceneId)
    }()
    return VStack(spacing: 14) {
      Text(L("scene.kicker")).font(Theme.serif(11)).kerning(5).foregroundColor(Theme.gold)
      Text(scene?["title"].string ?? "").font(Theme.serif(24, bold: true)).kerning(3).foregroundColor(Theme.goldLight)
      VStack(spacing: 10) {
        ForEach(Array(lines.enumerated()), id: \.offset) { _, line in
          StoryLineRow(speaker: speakerName(line["speaker"].string ?? "narrator"), text: line["text"].string ?? "")
        }
      }
      if previousChoice != nil {
        Text(L("scene.memory")).font(Theme.serif(11)).foregroundColor(Theme.muted)
      }
      ForEach(Array((scene?["choices"].array ?? []).enumerated()), id: \.offset) { _, c in
        let choice = Dyn(c)
        Button {
          game.sheet = nil
          game.storyChoicePick?(choice)
        } label: {
          VStack(spacing: 2) {
            Text((previousChoice == choice["id"].string ? L("scene.oldChoice") : "") + (choice["text"].string ?? ""))
              .font(Theme.serif(15)).foregroundColor(Theme.textMain)
            if let detail = choice["detail"].string, !detail.isEmpty {
              Text(detail).font(Theme.serif(12)).foregroundColor(Theme.gold)
            }
          }
          .padding(.horizontal, 22).padding(.vertical, 10)
          .background(Theme.lacquer)
          .overlay(RoundedRectangle(cornerRadius: 2).strokeBorder(Theme.gold.opacity(0.4), lineWidth: 1))
          .frame(minWidth: 360)
        }.buttonStyle(.plain)
      }
      Button { game.sheet = nil; game.storyChoicePick?(nil) } label: {
        Text(L("scene.skip")).font(Theme.serif(12)).foregroundColor(Theme.muted)
      }.buttonStyle(.plain)
    }
    .padding(34)
    .background(Theme.ink.opacity(0.98))
    .frame(maxWidth: 620)
  }
}

// MARK: - 结算(朱批)

struct SettleSheet: View {
  @ObservedObject var game = GameViewModel.shared
  @ObservedObject var store = ProgressStore.shared
  let win: Bool
  @State private var yeshiKey: String? = nil
  var body: some View {
    let chapter = game.R?.chapter ?? game.selectedChapter
    let ctx = { () -> StoryContext in
      var c = StoryContext(P: store.progress, chapter: chapter)
      c.asZhuge = game.R?.asZhuge ?? false
      return c
    }()
    let outcome = outcomeFor(chapter, win, ctx)
    let ruleChoiceA = chapter?["rule"]["choice"]["a"].string
    let next = win ? game.nextAfterWin(chapter ?? Dyn([:])) : nil
    let variant = yeshiKey.flatMap { outcomeVariant(outcome, $0) }
    let outcomeText = chapter?["rule"]["choice"] != nil && variant == nil
      ? (yeshiKey == "yeshiB" ? chapter?["yeshiB"].string : chapter?["yeshi"].string)
      : (variant?["text"].string ?? outcome.text ?? chapter?["yeshi"].string)
    return VStack(spacing: 16) {
      HStack(spacing: 18) {
        SealStamp(text: win ? L("settle.stampWin") : L("settle.stampLoss"), dim: !win)
        VStack(alignment: .leading, spacing: 8) {
          Text(win ? L("settle.titleWin") : L("settle.titleLoss"))
            .font(Theme.serif(26, bold: true)).kerning(3)
            .foregroundColor(win ? Color(hex: 0xe9d9b0) : Theme.cinnabarLight)
          Text(win ? "\(L("settle.original"))\(chapter?["history"].string ?? "")"
               : "\(L("settle.original"))\(chapter?["history"].string ?? "")")
            .font(Theme.serif(13))
            .strikethrough(win, color: Theme.muted)
            .foregroundColor(Theme.muted)
        }
      }
      if win {
        if let key = yeshiKey {
          VStack(spacing: 10) {
            Text("\(L("settle.yeshi"))\(outcomeText ?? "")").font(Theme.serif(16)).foregroundColor(Theme.paper).fixedSize(horizontal: false, vertical: true)
            if let hook = variant?["hook"].string ?? outcome.hook, !hook.isEmpty {
              Text(hook).font(Theme.serif(13)).foregroundColor(Theme.goldLight)
            }
          }
        } else if let a = ruleChoiceA {
          Text(L("settle.chooseYeshi")).font(Theme.serif(13)).foregroundColor(Theme.muted)
          HStack(spacing: 12) {
            Button { yeshiKey = "yeshi" } label: { InkButton(title: a) }.buttonStyle(.plain)
            Button { yeshiKey = "yeshiB" } label: { InkButton(title: chapter?["rule"]["choice"]["b"].string ?? "") }.buttonStyle(.plain)
          }
        } else {
          Text("\(L("settle.yeshi"))\(outcome.text ?? chapter?["yeshi"].string ?? "")")
            .font(Theme.serif(16)).foregroundColor(Theme.paper)
          if let hook = outcome.hook, !hook.isEmpty {
            Text(hook).font(Theme.serif(13)).foregroundColor(Theme.goldLight)
          }
        }
      } else {
        if let clue = outcome.clue, !clue.isEmpty {
          Text(clue).font(Theme.serif(14)).foregroundColor(Theme.cinnabarLight).multilineTextAlignment(.center)
        }
        Text(outcome.text ?? chapter?["defeat"].string ?? "").font(Theme.serif(14)).foregroundColor(Theme.paper)
      }
      HStack(spacing: 14) {
        if !win {
          Button { game.chooseSettle(.init(r: "retry", yeshiKey: nil)) } label: {
            InkButton(title: L("settle.retry"), prominent: true)
          }.buttonStyle(.plain)
        }
        if win && yeshiKey != nil && next != nil {
          Button { game.chooseSettle(.init(r: "next", yeshiKey: yeshiKey)) } label: {
            InkButton(title: "\(L("settle.next")) · \(next?["name"].string ?? "")", prominent: true)
          }.buttonStyle(.plain)
        }
        Button { game.chooseSettle(.init(r: "home", yeshiKey: yeshiKey)) } label: {
          InkButton(title: L("settle.home"))
        }.buttonStyle(.plain)
      }
    }
    .padding(34)
    .background(Theme.ink.opacity(0.98))
    .frame(maxWidth: 640)
    .onAppear {
      if win && chapter?["rule"]["choice"] == nil { yeshiKey = "yeshi" }
    }
  }
}

// MARK: - 终局

struct FinaleSheet: View {
  @ObservedObject var game = GameViewModel.shared
  @State private var answer: String? = nil
  var body: some View {
    let endings: [(String, String, String)] = [
      ("seal", L("finale.seal.q"), L("finale.seal.a")),
      ("restore", L("finale.restore.q"), L("finale.restore.a")),
      ("unwritten", L("finale.unwritten.q"), L("finale.unwritten.a")),
    ]
    let P = ProgressStore.shared.progress
    let huarong = P.story.choices["huarong"] ?? P.pages["huarong"]
    let maicheng = P.pages["maicheng"]
    let memory = (huarong == "yeshiB" ? L("finale.memoryHuarong") : "")
      + (maicheng != nil && maicheng != "unread" ? L("finale.memoryMaicheng") : L("finale.memoryDefault"))
    return VStack(spacing: 18) {
      Text(L("finale.kicker")).font(Theme.serif(11)).kerning(5).foregroundColor(Theme.gold)
      Text(L("finale.title")).font(Theme.serif(28, bold: true)).kerning(4).foregroundColor(Theme.goldLight)
      Text(memory).font(Theme.serif(14)).foregroundColor(Theme.paper).multilineTextAlignment(.center).fixedSize(horizontal: false, vertical: true)
      if let answer {
        Text(answer).font(Theme.serif(15)).foregroundColor(Theme.paperLight).multilineTextAlignment(.center).fixedSize(horizontal: false, vertical: true)
        Button { game.chooseFinale("done") } label: { InkButton(title: L("common.back"), prominent: true) }.buttonStyle(.plain)
      } else {
        ForEach(endings, id: \.0) { key, q, a in
          Button {
            answer = a
            game.chooseFinale(key)
          } label: {
            Text(q).font(Theme.serif(16)).foregroundColor(Theme.textMain).kerning(1)
              .padding(.horizontal, 24).padding(.vertical, 12)
              .background(Theme.lacquer)
              .overlay(RoundedRectangle(cornerRadius: 2).strokeBorder(Theme.gold.opacity(0.5), lineWidth: 1))
          }.buttonStyle(.plain)
        }
      }
    }
    .padding(34)
    .background(Theme.ink.opacity(0.98))
    .frame(maxWidth: 640)
  }
}
