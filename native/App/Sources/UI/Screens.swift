// Screens.swift —— 开卷/目录/题记/天时/行军/战书/武将卡/结算/终局/练习场/观阵录/设置/存档。
import SwiftUI

// MARK: - 开卷(标题 + 四步序章)


/// 开卷背景:月、远山、近山、江线、旗(对应 intro-landscape SVG)。
struct IntroLandscape: View {
  var body: some View {
    Canvas { ctx, size in
      let w = size.width, h = size.height
      // 月
      ctx.fill(Path(ellipseIn: CGRect(x: w * 0.79, y: -h * 0.05, width: 230, height: 230)),
               with: .color(Color(hex: 0xd2bd83).opacity(0.20)))
      func ridge(_ pts: [(CGFloat, CGFloat)], _ fill: Color, _ alpha: Double) {
        var p = Path()
        p.move(to: CGPoint(x: 0, y: h))
        for (x, y) in pts { p.addLine(to: CGPoint(x: x, y: y)) }
        p.addLine(to: CGPoint(x: w, y: h))
        p.closeSubpath()
        ctx.fill(p, with: .color(fill.opacity(alpha)))
      }
      ridge([(0, h * 0.62), (w * 0.13, h * 0.38), (w * 0.22, h * 0.55), (w * 0.33, h * 0.32),
             (w * 0.45, h * 0.56), (w * 0.58, h * 0.40), (w * 0.72, h * 0.57), (w * 0.86, h * 0.36), (w, h * 0.58)],
            Color(hex: 0x252c22), 0.70)
      ridge([(0, h * 0.88), (w * 0.10, h * 0.66), (w * 0.20, h * 0.82), (w * 0.30, h * 0.60),
             (w * 0.40, h * 0.84), (w * 0.52, h * 0.64), (w * 0.64, h * 0.85), (w * 0.78, h * 0.62), (w, h * 0.82)],
            Color(hex: 0x11170f), 0.94)
      // 江线
      var river = Path()
      river.move(to: CGPoint(x: 0, y: h * 0.87))
      river.addCurve(to: CGPoint(x: w, y: h * 0.90),
                     control1: CGPoint(x: w * 0.30, y: h * 0.78),
                     control2: CGPoint(x: w * 0.62, y: h * 1.00))
      ctx.stroke(river, with: .color(Color(hex: 0xb4b08a).opacity(0.08)), lineWidth: 14)
      // 旗
      guard w > 820 else { return }
      let fx = w * 0.83, fy = h * 0.40
      var pole = Path()
      pole.move(to: CGPoint(x: fx - 8, y: fy - 46))
      pole.addLine(to: CGPoint(x: fx - 6, y: fy + 200))
      ctx.stroke(pole, with: .color(Color(hex: 0x746648).opacity(0.65)), lineWidth: 4)
      var flag = Path()
      flag.move(to: CGPoint(x: fx - 6, y: fy))
      flag.addLine(to: CGPoint(x: fx + 80, y: fy + 12))
      flag.addLine(to: CGPoint(x: fx + 72, y: fy + 34))
      flag.addLine(to: CGPoint(x: fx - 6, y: fy + 26))
      flag.closeSubpath()
      ctx.fill(flag, with: .color(Color(hex: 0x78352b).opacity(0.65)))
      ctx.stroke(flag, with: .color(Color(hex: 0x746648).opacity(0.65)), lineWidth: 3)
    }
    .allowsHitTesting(false)
  }
}

// MARK: - 目录(残卷)

struct CodexScreen: View {
  @ObservedObject var game = GameViewModel.shared
  @ObservedObject var store = ProgressStore.shared
  @ObservedObject var l10n = L10n.shared
  @Environment(\.horizontalSizeClass) private var hSize
  private var horizontalCompact: Bool { hSize == .compact }

  var body: some View {
    ZStack {
      Theme.inkDeep
      LinearGradient(colors: [Color(hex: 0x0d110d).opacity(0.80),
                              Color(hex: 0x161a13).opacity(0.67),
                              Color(hex: 0x0d110d).opacity(0.80)],
                     startPoint: .leading, endPoint: .trailing)
      ScrollView {
        VStack(spacing: 0) {
          mast
          legend
          VStack(spacing: 14) {
            ForEach(1...5, id: \.self) { s in scrollGroup(s) }
          }
          .padding(.top, 22)
          practiceGate.padding(.top, 26)
          if !store.progress.endings.isEmpty {
            Button { game.openApocrypha() } label: {
              Text("\(L("apoc.entry"))\(store.progress.apocWins > 0 ? " · \(L("apoc.won")) \(store.progress.apocWins)" : "")")
                .font(Theme.serif(15)).kerning(2).foregroundColor(Theme.paperLight)
                .lineLimit(1).minimumScaleFactor(0.7)
                .padding(.horizontal, 20).padding(.vertical, 10)
                .overlay(Rectangle().strokeBorder(Color(hex: 0x897345), lineWidth: 1))
            }.buttonStyle(.plain).padding(.top, 22)
          }
        }
        .frame(maxWidth: 1180)
        .padding(.horizontal, 24).padding(.top, 28).padding(.bottom, 54)
        .frame(maxWidth: .infinity)
      }
    }
    #if os(macOS)
    .frame(minWidth: 960, minHeight: 620)
    #endif
  }

  private var mast: some View {
    VStack(spacing: 0) {
      HStack(alignment: .center, spacing: 16) {
        Text(PL("codex.seal", "卷")).font(Theme.serif(25)).foregroundColor(Color(hex: 0xd9bd8e))
          .frame(width: 42, height: 52)
          .background(Color(hex: 0x82352b))
          .overlay(Rectangle().strokeBorder(Color(hex: 0xb2634d), lineWidth: 1))
        VStack(alignment: .leading, spacing: 4) {
          Text(PL("codex.title", "英 雄 记")).font(Theme.serif(31)).kerning(8).foregroundColor(Theme.goldLight)
          Text(PL("codex.sub", "以牌为刃 · 重写意难平")).font(Theme.serif(11)).kerning(3).lineSpacing(4).foregroundColor(Color(hex: 0x8f8a73))
        }
        Spacer()
        if horizontalCompact {
          HStack(spacing: 8) {
            SfxToggleButton()
            codexMenu
          }
        } else {
          Text("\(L("codex.progress")) \(store.yeshiCount()) / \(GameData.shared.normalIds.count)")
            .font(Theme.serif(13)).foregroundColor(Color(hex: 0xaaa185)).fixedSize()
          HStack(spacing: 8) {
            SfxToggleButton()
            codexButtons
          }
        }
      }
      if horizontalCompact {
        HStack(spacing: 8) {
          Text("\(L("codex.progress")) \(store.yeshiCount()) / \(GameData.shared.normalIds.count)")
            .font(Theme.serif(12)).foregroundColor(Color(hex: 0xaaa185))
          Spacer()
        }
        .padding(.top, 10)
      }
    }
    .padding(.bottom, 20)
    .overlay(alignment: .bottom) { Rectangle().fill(Color(hex: 0x615538)).frame(height: 1) }
  }

  private var codexButtons: some View {
    HStack(spacing: 8) {
      ForEach([("codex.annals", "观阵录", Sheet.annals),
               ("codex.save", "存档", Sheet.save),
               ("codex.settings", "设置", Sheet.settings)], id: \.0) { key, zh, sheet in
        Button { game.sheet = sheet } label: {
          Text(PL(key, zh)).font(Theme.serif(12)).kerning(2).foregroundColor(Theme.paperLight)
            .padding(.horizontal, 14).padding(.vertical, 10)
            .background(Color(hex: 0x29291f))
            .overlay(Rectangle().strokeBorder(Color(hex: 0x897345), lineWidth: 1))
        }.buttonStyle(.plain)
      }
    }
  }

  private var codexMenu: some View {
    Menu {
      ForEach([("codex.annals", "观阵录", Sheet.annals),
               ("codex.save", "存档", Sheet.save),
               ("codex.settings", "设置", Sheet.settings)], id: \.0) { key, zh, sheet in
        Button { game.sheet = sheet } label: { Label(PL(key, zh), systemImage: key == "codex.annals" ? "books.vertical" : key == "codex.save" ? "tray.full" : "gearshape") }
      }
    } label: {
      Image(systemName: "line.3.horizontal")
        .font(Theme.serif(15)).foregroundColor(Theme.paperLight)
        .frame(width: 42, height: 40)
        .background(Color(hex: 0x29291f))
        .overlay(Rectangle().strokeBorder(Color(hex: 0x897345), lineWidth: 1))
    }
  }

  private var legend: some View {
    let items = [("○", "mark.unread", "未读"), ("原", "mark.history", "原卷已录"),
                 ("野", "mark.yeshi", "野史已改"), ("全", "mark.both", "两卷皆录")]
    return Group {
      if horizontalCompact {
        VStack(alignment: .leading, spacing: 7) {
          LazyVGrid(columns: [GridItem(.adaptive(minimum: 84), alignment: .leading)], alignment: .leading, spacing: 6) {
            ForEach(items, id: \.0) { mark, key, zh in
              HStack(spacing: 5) {
                Text(mark).font(Theme.serif(11)).foregroundColor(Color(hex: 0xb49b6a))
                Text(PL(key, zh)).font(Theme.serif(11)).foregroundColor(Color(hex: 0x777461)).lineLimit(1)
              }
            }
          }
          Text(PL("codex.motto", "不必每页皆胜，败亦成章"))
            .font(Theme.serif(11)).lineSpacing(4).foregroundColor(Color(hex: 0x8b8066))
        }
      } else {
        HStack(spacing: 20) {
          ForEach(items, id: \.0) { mark, key, zh in
            HStack(spacing: 5) {
              Text(mark).font(Theme.serif(11)).foregroundColor(Color(hex: 0xb49b6a))
              Text(PL(key, zh)).font(Theme.serif(11)).foregroundColor(Color(hex: 0x777461))
            }
          }
          Spacer()
          Text(PL("codex.motto", "不必每页皆胜，败亦成章"))
            .font(Theme.serif(11)).lineSpacing(4).foregroundColor(Color(hex: 0x8b8066))
        }
      }
    }
    .padding(.top, 13)
  }

  private func scrollGroup(_ s: Int) -> some View {
    let unlocked = store.scrollUnlocked(s)
    let title = s == 5 ? L("scroll.lastPage")
      : "\(L("scroll.volume"))\(String(["一", "二", "三", "四"][s - 1])) · \(L("scroll.\(s)"))"
    let titleText = Text(title + (unlocked ? "" : " 🔒"))
      .font(Theme.serif(16)).kerning(3).foregroundColor(Color(hex: 0xc5ae79))
      .lineSpacing(6)
    let grid = LazyVGrid(columns: [GridItem(.adaptive(minimum: horizontalCompact ? 252 : 132), spacing: 8, alignment: .leading)],
              alignment: .leading, spacing: 8) {
      ForEach(Array(GameData.shared.chapters.filter { $0["scroll"].int == s }.enumerated()), id: \.offset) { _, c in
        if unlocked {
          Button { game.openChapter(c) } label: { chipBody(c) }.buttonStyle(.plain)
        } else {
          chipBody(c)
        }
      }
    }
    return Group {
      if horizontalCompact {
        VStack(alignment: .leading, spacing: 10) {
          titleText.padding(.horizontal, 16).padding(.top, 14)
          grid.padding(.horizontal, 14).padding(.bottom, 14)
        }
      } else {
        HStack(spacing: 0) {
          titleText
            .frame(width: 170, alignment: .leading)
            .padding(.horizontal, 20).padding(.vertical, 18)
            .overlay(alignment: .trailing) { Rectangle().fill(Color(hex: 0x4c4734)).frame(width: 1) }
          grid.padding(14)
        }
      }
    }
    .frame(minHeight: 92)
    .background(Color(hex: 0x1c1f17).opacity(0.93))
    .overlay(Rectangle().strokeBorder(Color(hex: 0x4e4935), lineWidth: 1))
    .overlay(alignment: .top) {
      Rectangle().fill(Color(hex: 0x5d5136)).frame(height: 4)
        .padding(.horizontal, -5).offset(y: -3)
        .overlay(Rectangle().strokeBorder(Color(hex: 0x85734c), lineWidth: 1).padding(.horizontal, -5).offset(y: -3))
    }
    .overlay(alignment: .bottom) {
      Rectangle().fill(Color(hex: 0x5d5136)).frame(height: 4)
        .padding(.horizontal, -5).offset(y: 3)
        .overlay(Rectangle().strokeBorder(Color(hex: 0x85734c), lineWidth: 1).padding(.horizontal, -5).offset(y: 3))
    }
    .opacity(unlocked ? 1 : 0.42)
  }

  private func chipBody(_ c: Dyn) -> some View {
    let st = store.pageState(c["id"].string ?? "")
    let yeshi = ProgressStore.isYeshi(st)
    let mark = ["unread": "○",
                "history": PL("mark.history", "原"),
                "yeshi": PL("mark.yeshi", "野"),
                "yeshiB": PL("mark.yeshi", "野"),
                "yeshiAB": PL("mark.both", "全")][st] ?? "○"
    let fg: Color = yeshi ? Color(hex: 0x392a1c) : (st == "history" ? Color(hex: 0x5d5b50) : Color(hex: 0x332f24))
    let bg: Color = yeshi ? Color(hex: 0xdbc58f) : (st == "history" ? Color(hex: 0xaaa590) : Color(hex: 0xc9bfa3))
    return HStack(spacing: 10) {
      Text(mark).font(Theme.serif(13))
        .foregroundColor(yeshi ? Color(hex: 0x94392c) : Color(hex: 0x6b6757))
        .frame(width: 24, height: 24)
        .overlay(Rectangle().strokeBorder(yeshi ? Color(hex: 0xa34b39) : Color(hex: 0x8f856b), lineWidth: 1))
      Text(c["name"].string ?? "").font(Theme.serif(15)).kerning(2).lineSpacing(4).lineLimit(1).minimumScaleFactor(0.7)
      Spacer(minLength: 0)
    }
    .foregroundColor(fg)
    .frame(height: 48)
    .frame(maxWidth: .infinity, alignment: .leading)
    .padding(.horizontal, 12)
    .background(bg)
    .overlay(Rectangle().strokeBorder(yeshi ? Color(hex: 0xf0d99f) : Color(hex: 0xe0d4b6), lineWidth: 1))
  }

  private var practiceGate: some View {
    Button { game.enterPractice() } label: {
      // 叠像:负间距叠放,布局宽即真实视觉宽(74*3-22*2=178),无需 offset 硬夹
      let portraits = HStack(spacing: -22) {
        ForEach(Array(["commander", "soldier", "advisor"].enumerated()), id: \.offset) { _, skin in
          PortraitView(skin: skin, size: 74)
            .overlay(Rectangle().strokeBorder(Color(hex: 0x6c5c3c), lineWidth: 1))
        }
      }
      let texts = VStack(alignment: .leading, spacing: 7) {
        Text(L("practice.entry")).font(Theme.serif(19)).kerning(3).foregroundColor(Color(hex: 0xe8d8b2))
        Text(PL("practice.entrySub", "野战练兵场 · 与正史各卷并列，永不上锁"))
          .font(Theme.serif(11)).kerning(2).lineSpacing(4).foregroundColor(Color(hex: 0x8f8a73))
      }
      let goPanel = VStack(spacing: 3) {
        Text(PL("practice.go", "点 兵")).font(Theme.serif(15)).kerning(5).foregroundColor(Color(hex: 0x141109))
        Text("33 \(L("practice.tables"))").font(Theme.serif(9)).kerning(2)
          .foregroundColor(Color(hex: 0x141109)).opacity(0.75)
      }
      .padding(.horizontal, 18).padding(.vertical, 12)
      .background(LinearGradient(colors: [Color(hex: 0xd8bd85), Color(hex: 0xb2914f)],
                                 startPoint: .top, endPoint: .bottom))
      .overlay(Rectangle().strokeBorder(Color(hex: 0xe8d3a0), lineWidth: 1))
      return Group {
        if horizontalCompact {
          // 竖版:叠像独占一行居中,文字与点兵钮并排居下一行
          VStack(alignment: .center, spacing: 14) {
            portraits
            HStack(alignment: .center, spacing: 12) {
              texts
              Spacer(minLength: 0)
              goPanel
            }
          }
        } else {
          HStack(spacing: 20) {
            portraits
            texts
            Spacer()
            goPanel
          }
        }
      }
      .padding(.horizontal, 22).padding(.vertical, 16)
      .background(LinearGradient(colors: [Color(hex: 0x2a2417), Color(hex: 0x1c2015), Color(hex: 0x241f13)],
                                 startPoint: .topLeading, endPoint: .bottomTrailing))
      .overlay(Rectangle().strokeBorder(Color(hex: 0x8c7548), lineWidth: 1))
      .overlay(Rectangle().strokeBorder(Color(hex: 0x4c4531), lineWidth: 1).padding(4))
    }
    .buttonStyle(.plain)
  }
}

// 简易流式布局
struct FlowLayout<Content: View>: View {
  var spacing: CGFloat = 8
  var lineSpacing: CGFloat?
  var content: Content
  init(spacing: CGFloat = 8, lineSpacing: CGFloat? = nil, @ViewBuilder content: () -> Content) {
    self.spacing = spacing
    self.lineSpacing = lineSpacing
    self.content = content()
  }
  var body: some View {
    _FlowLayoutImpl(spacing: spacing, lineSpacing: lineSpacing ?? spacing) { content }
  }
}

/// 真实换行流式布局(对齐 CSS flex-wrap:同一行内按 spacing,行间按 lineSpacing)。
private struct _FlowLayoutImpl: Layout {
  var spacing: CGFloat
  var lineSpacing: CGFloat

  func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
    let maxW = proposal.width ?? .infinity
    var x: CGFloat = 0, y: CGFloat = 0, lineH: CGFloat = 0, widest: CGFloat = 0
    for sv in subviews {
      let s = sv.sizeThatFits(.unspecified)
      if x > 0, x + s.width > maxW {
        widest = max(widest, x - spacing)
        x = 0; y += lineH + lineSpacing; lineH = 0
      }
      x += s.width + spacing
      lineH = max(lineH, s.height)
    }
    widest = max(widest, x - spacing)
    return CGSize(width: min(widest, maxW == .infinity ? widest : maxW), height: y + lineH)
  }

  func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    var x = bounds.minX, y = bounds.minY, lineH: CGFloat = 0
    for sv in subviews {
      let s = sv.sizeThatFits(.unspecified)
      if x > bounds.minX, x + s.width > bounds.maxX {
        x = bounds.minX; y += lineH + lineSpacing; lineH = 0
      }
      sv.place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(s))
      x += s.width + spacing
      lineH = max(lineH, s.height)
    }
  }
}

// MARK: - 章节页(题记 + 史实底稿)

struct ChapterPageScreen: View {
  @ObservedObject var game = GameViewModel.shared
  @ObservedObject var store = ProgressStore.shared

  private let paper = Color(hex: 0xd8cbaa)
  private let inkText = Color(hex: 0x302d23)
  private let bodyText = Color(hex: 0x413a2b)
  private let labelRed = Color(hex: 0x8f4334)

  var body: some View {
    guard let chapter = game.selectedChapter else { return AnyView(EmptyView()) }
    let brief = GameData.shared.briefingOf(chapter["id"].string ?? "")
    let story = GameData.shared.storyOf(chapter["id"].string ?? "")
    let ctx = StoryContext(P: store.progress, chapter: chapter)
    let coldOpen = coldOpenFor(chapter, ctx)
    let objective = story?["objective"].string
    let cast = story?["cast"].stringArray ?? []
    let siblings = GameData.shared.chapters.filter { $0["scroll"].int == chapter["scroll"].int }
    let ordinal = (siblings.firstIndex { $0["id"].string == chapter["id"].string } ?? -1) + 1
    let folio = chapter["apocrypha"].bool == true ? PL("page.apocFolio", "无终稿 · 随机外传")
      : chapter["type"].string == "finale" ? PL("page.finaleFolio", "最后一页 · 写卷人")
      : "\(L("scroll.volume"))\(String(["一", "二", "三", "四"][max(0, (chapter["scroll"].int ?? 1) - 1)])) · \(PL("page.chapterNoShort", "第 "))\(ordinal) \(PL("page.chapterSuffix", "回"))"
    let altShow = chapter["id"].string == "wuzhangyuan" && store.isYeshi("wuzhangyuan")
    return AnyView(
      GeometryReader { geo in
        ZStack {
          Color(hex: 0x0c100b).opacity(0.72)
          HStack(spacing: 0) {
            // 书脊
            VStack(spacing: 10) {
              Text("英\n雄\n记")
                .font(Theme.serif(24)).foregroundColor(Color(hex: 0xd3b98b))
                .multilineTextAlignment(.center).lineSpacing(6)
              Spacer()
              Text(PL("page.spineFoot", "残卷"))
                .font(Theme.serif(12)).kerning(4).foregroundColor(Color(hex: 0xa38b61))
            }
            .padding(.top, 44).padding(.bottom, 35)
            .frame(width: geo.size.width < 620 ? 44 : 68)
            .background(Color(hex: 0x43392a))
            .overlay(alignment: .trailing) { Rectangle().fill(Color(hex: 0x796746)).frame(width: 5) }
            // 正文
            VStack(spacing: 0) {
              ScrollView {
                VStack(spacing: 0) {
                  Text(folio).font(Theme.serif(10)).kerning(4).foregroundColor(Color(hex: 0x847658))
                  Text(chapter["year"].string ?? "")
                    .font(Theme.serif(13)).kerning(4).foregroundColor(Color(hex: 0x73674d))
                    .padding(.top, 14)
                  Text(chapter["name"].string ?? "").kerning(12).foregroundColor(inkText)
                    .font(Theme.serif(min(64, max(44, geo.size.width * 0.05))))
                    .padding(.top, 10)
                    .multilineTextAlignment(.center)
                  // 分隔 + 朱印
                  HStack(spacing: 12) {
                    Rectangle().fill(Color(hex: 0x9b8a65)).frame(height: 1)
                    Text(PL("page.dividerSeal", "若")).font(Theme.serif(17)).foregroundColor(Color(hex: 0x963c30))
                      .frame(width: 26, height: 26)
                      .overlay(Rectangle().strokeBorder(Color(hex: 0x9d4335), lineWidth: 1))
                      .rotationEffect(.degrees(-4))
                    Rectangle().fill(Color(hex: 0x9b8a65)).frame(height: 1)
                  }
                  .frame(width: min(520, geo.size.width * 0.5)).padding(.top, 14)
                  Text(chapter["premise"].string ?? "")
                    .font(Theme.serif(20)).lineSpacing(11).kerning(2)
                    .foregroundColor(bodyText).multilineTextAlignment(.center)
                    .padding(.top, 20)
                  // 史实底稿
                  if let brief {
                    VStack(alignment: .leading, spacing: 6) {
                      HStack(spacing: 8) {
                        Text(PL("page.briefKicker", "史实底稿")).font(Theme.serif(13)).kerning(2).foregroundColor(labelRed)
                        Text(brief["era"].string ?? "").font(Theme.serif(12)).foregroundColor(Color(hex: 0x6f624a))
                      }
                      Text(brief["source"].string ?? "")
                        .font(Theme.serif(11)).foregroundColor(Color(hex: 0x7e7056)).padding(.top, 2)
                      Text(brief["record"].string ?? "")
                        .font(Theme.serif(13)).lineSpacing(7).foregroundColor(bodyText)
                        .fixedSize(horizontal: false, vertical: true).padding(.top, 6)
                      Text(PL("page.adaptKicker", "演义与改写"))
                        .font(Theme.serif(13)).kerning(2).foregroundColor(labelRed).padding(.top, 14)
                      Text(brief["adaptation"].string ?? "")
                        .font(Theme.serif(13)).lineSpacing(7).foregroundColor(bodyText)
                        .fixedSize(horizontal: false, vertical: true).padding(.top, 4)
                      HStack(alignment: .top, spacing: 10) {
                        Rectangle().fill(Color(hex: 0xa4483a)).frame(width: 2)
                        Text(brief["lead"].string ?? "")
                          .font(Theme.serif(13)).lineSpacing(7)
                          .foregroundColor(Color(hex: 0x4a4130)).fixedSize(horizontal: false, vertical: true)
                      }
                      .padding(.top, 12)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 18).padding(.vertical, 16)
                    .background(Color(hex: 0xcfc3a2).opacity(0.55))
                    .overlay(Rectangle().strokeBorder(Color(hex: 0x9b8a65).opacity(0.45), lineWidth: 1))
                    .padding(.top, 26)
                  }
                  if !coldOpen.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                      ForEach(Array(coldOpen.enumerated()), id: \.offset) { _, line in
                        HStack(alignment: .top, spacing: 12) {
                          Text(speakerName(line["speaker"].string ?? "narrator"))
                            .font(Theme.serif(13, bold: true)).foregroundColor(labelRed)
                            .frame(width: 60, alignment: .trailing).padding(.top, 2)
                          Rectangle().fill(labelRed.opacity(0.5)).frame(width: 2)
                          Text(line["text"].string ?? "")
                            .font(Theme.serif(14)).lineSpacing(8)
                            .foregroundColor(Color(hex: 0x3d3628)).fixedSize(horizontal: false, vertical: true)
                        }
                      }
                    }
                    .padding(.top, 22)
                  }
                  if let objective, !objective.isEmpty {
                    Text("\(L("page.objective")) \(objective)")
                      .font(Theme.serif(12)).lineSpacing(6).foregroundColor(Color(hex: 0x3f6b46))
                      .multilineTextAlignment(.center).padding(.top, 16)
                  }
                  if let ruleText = chapter["ruleText"].string, !ruleText.isEmpty {
                    Text(PL("brief.rulePrefix", "本回战法 · ") + ruleText)
                      .font(Theme.serif(12)).lineSpacing(6).foregroundColor(Color(hex: 0x84372d))
                      .multilineTextAlignment(.center)
                      .padding(.horizontal, 12).padding(.vertical, 8)
                      .background(Color(hex: 0xa44b36).opacity(0.06))
                      .overlay(alignment: .top) { Rectangle().fill(Color(hex: 0xa48258).opacity(0.38)).frame(height: 1) }
                      .overlay(alignment: .bottom) { Rectangle().fill(Color(hex: 0xa48258).opacity(0.38)).frame(height: 1) }
                      .padding(.top, 12)
                  }
                  Text(chapter["note"].string ?? "")
                    .font(Theme.serif(12)).kerning(1).foregroundColor(Color(hex: 0x766d57))
                    .multilineTextAlignment(.center).padding(.top, 17)
                  HStack(spacing: 7) {
                    ForEach(Array((chapter["map"].stringArray).enumerated()), id: \.offset) { i, place in
                      if i > 0 { Text("→").font(Theme.serif(11)).foregroundColor(Color(hex: 0x9b4738)) }
                      Text(place).font(Theme.serif(11)).foregroundColor(Color(hex: 0x625a45))
                        .padding(.horizontal, 8).padding(.vertical, 4)
                        .background(Color(hex: 0xe1d5b8).opacity(0.5))
                        .overlay(Rectangle().strokeBorder(Color(hex: 0x9c8d6b), lineWidth: 1))
                    }
                  }
                  .padding(.top, 20)
                }
                .padding(.top, 34).padding(.horizontal, geo.size.width < 620 ? 20 : 58).padding(.bottom, 24)
                .frame(maxWidth: .infinity)
              }
              // 页脚:故人(固定在按钮之上,同原版)
              if !cast.isEmpty {
                HStack(spacing: 8) {
                  ForEach(cast, id: \.self) { id in
                    Text("\(PL("page.cast", "故人")) · \(speakerName(id))")
                      .font(Theme.serif(11)).foregroundColor(Color(hex: 0x4a4130))
                      .padding(.horizontal, 10).padding(.vertical, 5)
                      .background(Color(hex: 0xe1d5b8).opacity(0.55))
                      .overlay(Rectangle().strokeBorder(Color(hex: 0x9c8d6b), lineWidth: 1))
                  }
                }
                .padding(.bottom, 12)
              }
              // 底部按钮条(窄屏按钮收窄,防双边裁切)
              HStack(spacing: geo.size.width < 620 ? 8 : 12) {
                SfxToggleButton()
                Spacer()
                if altShow {
                  Button {
                    game.pickOmen()
                    game.omenPick = { fx in game.startMarch(chapter, omenFx: fx, asZhuge: true) }
                  } label: {
                    Text(L("page.zhizishou")).font(Theme.serif(15))
                      .foregroundColor(Color(hex: 0x655c48))
                      .frame(minWidth: geo.size.width < 620 ? 0 : 116)
                      .padding(.horizontal, geo.size.width < 620 ? 14 : 24).padding(.vertical, 11)
                      .overlay(Rectangle().strokeBorder(Color(hex: 0x8d8063), lineWidth: 1))
                  }.buttonStyle(.plain)
                }
                Button {
                  game.pickOmen()
                  game.omenPick = { fx in game.startMarch(chapter, omenFx: fx) }
                } label: {
                  Text(PL("page.start", "启 程")).font(Theme.serif(15)).kerning(4)
                    .foregroundColor(Color(hex: 0xf0dfb8))
                    .frame(minWidth: geo.size.width < 620 ? 0 : 116)
                    .padding(.horizontal, geo.size.width < 620 ? 14 : 24).padding(.vertical, 11)
                    .background(Color(hex: 0x6e3028))
                    .overlay(Rectangle().strokeBorder(Color(hex: 0x934b3b), lineWidth: 1))
                }.buttonStyle(.plain)
                Button { game.showCodex() } label: {
                  Text(L("common.back")).font(Theme.serif(15)).kerning(2)
                    .foregroundColor(Color(hex: 0x655c48))
                    .frame(minWidth: geo.size.width < 620 ? 0 : 116)
                    .padding(.horizontal, geo.size.width < 620 ? 14 : 24).padding(.vertical, 11)
                    .overlay(Rectangle().strokeBorder(Color(hex: 0x8d8063), lineWidth: 1))
                }.buttonStyle(.plain)
                Spacer()
              }
              .padding(.horizontal, geo.size.width < 620 ? 14 : 58).padding(.top, 14).padding(.bottom, 14)
              .background(LinearGradient(colors: [Color(hex: 0xe0d3b1), paper], startPoint: .top, endPoint: .bottom))
              .overlay(alignment: .top) { Rectangle().fill(Color(hex: 0x9b8a65).opacity(0.4)).frame(height: 1) }
            }
          }
          .frame(width: min(850, geo.size.width * 0.92), height: min(780, geo.size.height * 0.94))
          .background(paper)
          .overlay(Rectangle().strokeBorder(Color(hex: 0xe1d5b7), lineWidth: 1))
          .overlay(PaperTexture(opacity: 0.07))
          .overlay(alignment: .bottomTrailing) {
            Text(PL("page.stamp", "改"))
              .font(Theme.serif(28)).foregroundColor(Color(hex: 0xa43d31))
              .frame(width: 48, height: 48)
              .overlay(Rectangle().strokeBorder(Color(hex: 0xa43d31), lineWidth: 3).padding(1))
              .rotationEffect(.degrees(-9)).opacity(0.55)
              .padding(.trailing, geo.size.width < 620 ? 12 : 27)
              .padding(.bottom, geo.size.width < 620 ? 150 : 92)
          }
          .shadow(color: .black.opacity(0.55), radius: 45, y: 30)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
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
    ZStack {
      Color(hex: 0x080b08).opacity(0.82).ignoresSafeArea()
      VStack(spacing: 0) {
        Text(PL("omen.title", "天 时")).font(Theme.serif(22)).kerning(11).foregroundColor(Color(hex: 0xdec58e))
        Text("\(chapter?["year"].string ?? "") · \(chapter?["name"].string ?? "")\n\(PL("omen.pick", "临行前，择一天时。"))")
          .font(Theme.serif(13)).lineSpacing(10).foregroundColor(Color(hex: 0xb7b095))
          .multilineTextAlignment(.center).padding(.top, 18)
        VStack(spacing: 10) {
          ForEach(Array((chapter?["omens"].array ?? []).enumerated()), id: \.offset) { _, o in
            let om = Dyn(o)
            let fx = om["fx"].string ?? ""
            let desc = GameData.shared.chaptersRoot["fx"][fx]["desc"].string ?? ""
            Button { game.applyOmen(fx) } label: {
              HStack(spacing: 12) {
                Text(om["n"].string ?? "").font(Theme.serif(13)).kerning(2).foregroundColor(Theme.textMain)
                Spacer(minLength: 12)
                Text(desc).font(Theme.serif(13)).foregroundColor(Color(hex: 0xd4b573))
              }
              .padding(.horizontal, 18).padding(.vertical, 12)
              .frame(maxWidth: .infinity)
              .background(Color(hex: 0x29291f))
              .overlay(Rectangle().strokeBorder(Color(hex: 0x897345), lineWidth: 1))
            }.buttonStyle(.plain)
          }
        }
        .padding(.top, 22)
      }
      .padding(.horizontal, 34).padding(.vertical, 30)
      #if os(iOS)
      .frame(width: min(570, UIScreen.main.bounds.width * 0.96))
      #else
      .frame(width: 570)
      #endif
      .background(LinearGradient(colors: [Color(hex: 0x25271c), Color(hex: 0x171a13)],
                                 startPoint: .topLeading, endPoint: .bottomTrailing))
      .overlay(Rectangle().strokeBorder(Color(hex: 0x8c7548), lineWidth: 1))
      .overlay(Rectangle().strokeBorder(Color(hex: 0x51472f), lineWidth: 1).padding(5))
      .overlay(alignment: .topLeading) { CornerTick().padding(10) }
      .overlay(alignment: .bottomTrailing) { CornerTick().rotationEffect(.degrees(180)).padding(10) }
      .shadow(color: .black.opacity(0.6), radius: 40, y: 24)
    }
  }
}

// MARK: - 行军图

struct MapScreen: View {
  @ObservedObject var game = GameViewModel.shared

  var body: some View {
    guard let R = game.R else { return AnyView(EmptyView()) }
    let available = Set(game.availableNodes())
    return AnyView(
      GeometryReader { geo in
        let portrait = geo.size.height > geo.size.width
        let paperW0 = portrait ? min(geo.size.width * 0.9, 420) : min(geo.size.width * 0.92, 1100)
        // 横屏:纸面高度受顶栏/底栏之间净空约束(否则木轴压住上下文字),按 0.42 比例回缩宽度
        let paperH = portrait ? min(geo.size.height * 0.58, paperW0 * 1.7)
                              : min(paperW0 * 0.42, max(160, geo.size.height - 190))
        let paperW = portrait ? paperW0 : min(paperW0, paperH / 0.42)
        let centerY = portrait ? geo.size.height * 0.54
                               : max(geo.size.height * 0.5, min(geo.size.height * 0.54, 84 + paperH / 2 + 14))
        let xs = R.nodes.map { $0.x }; let ys = R.nodes.map { $0.y }
        let x0 = xs.min() ?? 0; let x1 = xs.max() ?? 1
        let y0 = ys.min() ?? 0; let y1 = ys.max() ?? 1
        // 竖屏:转置映射,横向进军改纵向铺开(归一化到节点实际范围)
        let px: (MarchNode) -> CGFloat = { n in
          portrait ? paperW - 40 - (n.y - y0) / max(y1 - y0, 1) * (paperW - 80) : n.x
        }
        let py: (MarchNode) -> CGFloat = { n in
          portrait ? 46 + (n.x - x0) / max(x1 - x0, 1) * (paperH - 92) : n.y
        }
        ZStack {
          Theme.inkDeep
          RadialGradient(colors: [Color(hex: 0x253021).opacity(0.60), Color(hex: 0x0b100b).opacity(0.87)],
                         center: .center, startRadius: 60,
                         endRadius: max(geo.size.width, geo.size.height) * 0.72)
          // 顶栏(竖屏:标题与筹码分两行)
          Group {
            if portrait {
              VStack(alignment: .leading, spacing: 8) {
                VStack(alignment: .leading, spacing: 3) {
                  Text(PL("map.kicker", "军令所至")).font(Theme.serif(10)).kerning(5).foregroundColor(Color(hex: 0x81785f))
                  Text("\(PL("map.title", "行 军 图")) · \(R.chapter["name"].string ?? "")")
                    .font(Theme.serif(24)).kerning(5).lineLimit(1).minimumScaleFactor(0.7).foregroundColor(Theme.goldLight)
                }
                HStack(spacing: 10) {
                  HStack(spacing: 0) {
                    Text("\(L("term.chips")) ").font(Theme.serif(13)).foregroundColor(Color(hex: 0xaaa185))
                    Text("\(R.chips)").font(Theme.serif(18)).foregroundColor(Theme.goldLight)
                    Text("  ·  \(R.marchInfo)").font(Theme.serif(13)).kerning(1).lineLimit(1).minimumScaleFactor(0.7).foregroundColor(Color(hex: 0xaaa185))
                  }
                  .padding(.horizontal, 14).padding(.vertical, 8)
                  .background(Color(hex: 0x151910).opacity(0.73))
                  .overlay(Rectangle().strokeBorder(Color(hex: 0x514a35), lineWidth: 1))
                  Spacer(minLength: 0)
                  SfxToggleButton()
                }
              }
            } else {
              HStack(alignment: .bottom) {
                VStack(alignment: .leading, spacing: 3) {
                  Text(PL("map.kicker", "军令所至")).font(Theme.serif(10)).kerning(5).foregroundColor(Color(hex: 0x81785f))
                  Text("\(PL("map.title", "行 军 图")) · \(R.chapter["name"].string ?? "")")
                    .font(Theme.serif(28)).kerning(6).lineLimit(1).minimumScaleFactor(0.6).foregroundColor(Theme.goldLight)
                }
                Spacer()
                HStack(spacing: 10) {
                  HStack(spacing: 0) {
                    Text("\(L("term.chips")) ").font(Theme.serif(13)).foregroundColor(Color(hex: 0xaaa185))
                    Text("\(R.chips)").font(Theme.serif(18)).foregroundColor(Theme.goldLight)
                    Text("  ·  \(R.marchInfo)").font(Theme.serif(13)).kerning(1).lineLimit(1).minimumScaleFactor(0.6).foregroundColor(Color(hex: 0xaaa185))
                  }
                  .padding(.horizontal, 14).padding(.vertical, 8)
                  .background(Color(hex: 0x151910).opacity(0.73))
                  .overlay(Rectangle().strokeBorder(Color(hex: 0x514a35), lineWidth: 1))
                  SfxToggleButton()
                }
              }
            }
          }
          .frame(width: min(1100, geo.size.width * 0.92))
          .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
          .padding(.top, 23)
          // 卷轴(竖屏:纵向卷;横屏:横向卷)
          ZStack {
            ZStack(alignment: .topLeading) {
              MarchTerrainCanvas()
              Canvas { ctx, _ in
                for n in R.nodes {
                  for nid in n.next {
                    guard let m = R.nodes.first(where: { $0.id == nid }) else { continue }
                    let a = CGPoint(x: px(n), y: py(n))
                    let b = CGPoint(x: px(m), y: py(m))
                    let ctrl = portrait
                      ? CGPoint(x: (a.x + b.x) / 2 + 24, y: (a.y + b.y) / 2)
                      : CGPoint(x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - 26)
                    var p = Path()
                    p.move(to: a)
                    p.addQuadCurve(to: b, control: ctrl)
                    ctx.stroke(p, with: .color(n.done ? Color(hex: 0x8e3d30).opacity(0.72)
                                                      : Color(hex: 0x826d46).opacity(0.55)),
                               style: StrokeStyle(lineWidth: 3, dash: n.done ? [] : [7, 7]))
                  }
                }
              }
              ForEach(R.nodes) { node in
                let isAvail = available.contains(node.id) && !node.done
                Button { Task { await game.pickNode(node) } } label: {
                  MapNodeView(node: node, available: isAvail, isCurrent: R.current == node.id)
                    .scaleEffect(portrait ? 0.82 : 1)
                }
                .buttonStyle(.plain).disabled(!isAvail)
                .position(x: px(node), y: py(node))
              }
            }
            .frame(width: portrait ? paperW : 1000, height: portrait ? paperH : 420)
            .scaleEffect(portrait ? 1 : paperW / 1000, anchor: .topLeading)
            .frame(width: paperW, height: paperH, alignment: .topLeading)
            .clipped()
            .background(Color(hex: 0xcbbc96))
            .overlay(PaperTexture(opacity: 0.10))
            .overlay(Rectangle().strokeBorder(Color(hex: 0xd8c69d), lineWidth: 1))
            .shadow(color: .black.opacity(0.55), radius: 28, y: 20)
            // 木轴(比纸面宽 60;竖屏改纵轴)
            if portrait {
              ZStack {
                RollerBar().frame(width: paperH + 60, height: 20).rotationEffect(.degrees(90))
                  .offset(x: -(paperW / 2 + 17))
                RollerBar().frame(width: paperH + 60, height: 20).rotationEffect(.degrees(90))
                  .offset(x: paperW / 2 + 17)
              }
              .frame(width: paperW + 60, height: paperH)
            } else {
              VStack(spacing: 0) {
                RollerBar().frame(width: paperW + 60, height: 20).offset(y: -13)
                Spacer()
                RollerBar().frame(width: paperW + 60, height: 20).offset(y: 7)
              }
              .frame(width: paperW + 60, height: paperH)
            }
          }
          .frame(width: paperW, height: paperH)
          .position(x: geo.size.width / 2, y: centerY)
          // 底部:返回钮 + 军令提示,同一 HStack 防窄屏重叠
          HStack(spacing: 12) {
            Button { game.showCodex() } label: {
              Text(L("common.back")).font(Theme.serif(12)).kerning(3).foregroundColor(Color(hex: 0x9d957a))
                .padding(.horizontal, 12).padding(.vertical, 8)
                .overlay(Rectangle().strokeBorder(Color(hex: 0x514a35), lineWidth: 1))
            }
            .buttonStyle(.plain)
            .fixedSize()
            Group {
              Text(PL("map.badge", "军令"))
                .font(Theme.serif(12)).foregroundColor(Color(hex: 0xd6b683))
                .padding(.horizontal, 7).padding(.vertical, 4)
                .background(Color(hex: 0x79352b))
                .overlay(Rectangle().strokeBorder(Color(hex: 0xa25e45), lineWidth: 1))
              Text(PL("map.hint", "择亮起之处而行")).font(Theme.serif(12)).kerning(2).foregroundColor(Color(hex: 0x9d957a)).lineLimit(1).minimumScaleFactor(0.6)
            }
            .fixedSize()
            Text("· " + PL("map.hint2", "胜则改史 · 败亦入卷"))
              .font(Theme.serif(12)).kerning(2).foregroundColor(Color(hex: 0x696b58))
              .lineLimit(1).minimumScaleFactor(0.6)
            Spacer(minLength: 0)
          }
          .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottom)
          .padding(.leading, 20).padding(.trailing, 16).padding(.bottom, 18)
        }
      }
    )
  }
}

struct MapNodeView: View {
  let node: MarchNode
  let available: Bool
  let isCurrent: Bool

  var body: some View {
    let boss = node.type == "boss"
    let glyph = ["battle": "♠", "rest": "♨", "shop": "✦", "chest": "◆", "boss": "♛"][node.type] ?? "•"
    let label = ["battle": L("map.battle"), "rest": L("map.rest"), "shop": L("map.shop"),
                 "chest": L("map.chest"), "boss": L("map.boss")][node.type] ?? ""
    let r: CGFloat = boss ? 30 : 24
    let ringR: CGFloat = boss ? 38 : 31
    // 原版配色:可用=朱红底描金边;关底=深朱;已完成=灰
    let circleFill: Color = node.done ? Color(hex: 0x6e6c58)
      : available ? (boss ? Color(hex: 0x6d2a22) : Color(hex: 0x7e362b))
      : (boss ? Color(hex: 0x55271f) : Color(hex: 0x292d22))
    let circleStroke: Color = available ? Color(hex: 0xe2c27d) : (boss ? Color(hex: 0xa64836) : Color(hex: 0x9a8052))
    let glyphColor: Color = available ? Color(hex: 0xf0d9a2) : (boss ? Color(hex: 0xe2b875) : Color(hex: 0xd6bd82))
    let labelColor: Color = available ? Color(hex: 0x742f27) : Color(hex: 0x39392c)
    let halo = Color(hex: 0xcfc29e)

    return ZStack {
      Diamond()
        .stroke(available ? Color(hex: 0xe2c27d).opacity(0.9) : Color(hex: 0x6f6042).opacity(0.7), lineWidth: 1)
        .frame(width: ringR * 2, height: ringR * 2)
      Circle()
        .fill(circleFill)
        .overlay(Circle().strokeBorder(circleStroke, lineWidth: 3))
        .frame(width: r * 2, height: r * 2)
        .shadow(color: available ? Color(hex: 0x8f392c).opacity(0.55) : .clear, radius: 8)
      Text(glyph).font(Theme.serif(23)).foregroundColor(glyphColor)
      Text("▼ \(L("map.youHere"))")
        .font(Theme.serif(14, bold: true)).foregroundColor(Color(hex: 0x8c332a))
        .shadow(color: Color(hex: 0xd8cba6), radius: 2)
        .offset(y: -(ringR + 20))
        .opacity(isCurrent ? 1 : 0)
      Text(label.isEmpty ? "" : "\(label) · \(node.name)")
        .font(Theme.serif(13, bold: true)).kerning(1)
        .foregroundColor(labelColor)
        .shadow(color: halo, radius: 2)
        .fixedSize()
        .offset(y: boss ? 48 : 42)
    }
    .frame(width: 220, height: 200)
    .opacity(node.done ? 0.38 : 1)
  }
}

// MARK: - 战书

struct BriefingSheet: View {
  @ObservedObject var game = GameViewModel.shared
  let sheet: Sheet
  @State private var unroll: Double = 0

  private let tagRed = Color(hex: 0x7d352b)

  private struct RosterMember { let name: String; let stack: Int; let skin: String }

  var body: some View {
    GeometryReader { geo in
      let paperW = min(1100, geo.size.width * 0.96)
      ZStack {
        RadialGradient(colors: [Color(hex: 0x343326).opacity(0.53), Color(hex: 0x080b08).opacity(0.96)],
                       center: UnitPoint(x: 0.5, y: 0.42), startRadius: 60, endRadius: geo.size.height * 0.9)
        ScrollView {
          briefingPaper(geo)
            .frame(width: paperW)
            .modifier(UnrollMask(progress: unroll))
            .overlay(alignment: .leading) {
              RollerBar(horizontal: false)
                .offset(x: -12 + (1 - unroll) * (paperW / 2 - 12))
            }
            .overlay(alignment: .trailing) {
              RollerBar(horizontal: false)
                .offset(x: 12 - (1 - unroll) * (paperW / 2 - 12))
            }
            .shadow(color: .black.opacity(0.6), radius: 45, y: 28)
            .padding(.vertical, 18)
        }
      }
      .onAppear {
        unroll = 0.02
        withAnimation(.timingCurve(0.2, 0.78, 0.2, 1, duration: 0.9)) { unroll = 1 }
      }
    }
  }

  private func briefingPaper(_ geo: GeometryProxy) -> some View {
    let practice = game.R == nil
    let arena = game.practiceArena
    let chapter = game.selectedChapter ?? game.R?.chapter
    let brief = chapter.flatMap { GameData.shared.briefingOf($0["id"].string ?? "") }
    var boss = false
    var round = 1
    var rounds = 1
    if case .briefing(_, let b, let r, let rs) = sheet { boss = b; round = r; rounds = rs }
    let node: Dyn = {
      guard let brief else { return Dyn([String: Any]()) }
      let arr = brief["rounds"].array
      if rounds > 1, round - 1 < arr.count { return Dyn(arr[round - 1]) }
      return brief[boss ? "boss" : "skirmish"]
    }()
    let roster = rosterForBriefing(practice: practice, boss: boss)
    let lead = roster.first
    let opponentLabel = roster.count > 1
      ? String(format: L("brief.andNMore"), (lead?.name ?? ""), roster.count)
      : (lead?.name ?? "")
    let kicker: String = practice
      ? "\(arena?["year"].string ?? "") · \(arena?["name"].string ?? "") · \(PL("brief.practiceKicker", "野战战书"))"
      : "\(chapter?["year"].string ?? PL("brief.deepScroll", "残卷深处")) · \(chapter?["name"].string ?? "") · \(boss ? PL("brief.bossKicker2", "关底战书") : PL("brief.skirmishKicker2", "遭遇战书"))"
    let title = practice ? (arena?["name"].string ?? "") : (node["title"].string ?? "")
    let why = practice ? (arena?["why"].string ?? "") : (node["why"].string ?? "")
    let win = practice ? (arena?["win"].string ?? "") : (node["win"].string ?? "")
    let loss = practice ? (arena?["loss"].string ?? "") : (node["loss"].string ?? "")
    let source = practice ? (arena?["ruleText"].string ?? "") : (brief?["source"].string ?? "")
    let ruleText = practice ? (arena?["ruleText"].string ?? "") : (chapter?["ruleText"].string ?? "")
    let place = game.R?.nodes.first { $0.id == game.R?.current }?.name ?? chapter?["name"].string ?? ""
    let coords = practice
      ? "\(PL("brief.place", "战地")) · \(arena?["place"].string ?? "") · \(roster.count + 1) \(PL("brief.players", "人同桌"))"
      : "\(PL("brief.place", "战地")) · \(place) · \(chapter?["year"].string ?? "") · \(boss ? PL("brief.bossMeta", "关底决胜 · 胜则改页") : PL("brief.skirmishMeta", "行军遭遇 · 败亦入卷"))"
    let compact = geo.size.width < 620

    return VStack(spacing: 0) {
      let headerLeft = VStack(alignment: .leading, spacing: 0) {
        Text(kicker).font(Theme.serif(10)).kerning(3).foregroundColor(Color(hex: 0x8f4334))
        HStack(alignment: .center, spacing: 16) {
          Text(title)
            .font(Theme.serif(compact ? 34 : min(48, max(30, geo.size.width * 0.036)))).kerning(3)
            .foregroundColor(Color(hex: 0x2f2b20))
            .lineLimit(2).minimumScaleFactor(0.6)
          Text(PL("brief.seal", "战"))
            .font(Theme.serif(27)).foregroundColor(Color(hex: 0xa13c30))
            .frame(width: 44, height: 51)
            .overlay(Rectangle().strokeBorder(Color(hex: 0xa13c30), lineWidth: 3).padding(1))
            .rotationEffect(.degrees(-6)).opacity(0.7)
        }
        .padding(.top, 8)
        Text(coords).font(Theme.serif(11)).kerning(1)
          .foregroundColor(Color(hex: 0x6f624a)).padding(.top, 9).lineLimit(2)
      }
      let sourceText = Text(source).font(Theme.serif(10)).lineSpacing(5)
        .foregroundColor(Color(hex: 0x7e7056))
      Group {
        if compact {
          VStack(alignment: .leading, spacing: 0) {
            headerLeft
            sourceText.multilineTextAlignment(.leading).lineLimit(4).frame(maxWidth: .infinity, alignment: .leading).padding(.top, 10)
          }
        } else {
          HStack(alignment: .top, spacing: 24) {
            headerLeft
            Spacer(minLength: 0)
            sourceText.multilineTextAlignment(.trailing).frame(width: 240, alignment: .trailing)
          }
        }
      }
      .padding(.bottom, 15)
      .overlay(alignment: .bottom) { Rectangle().fill(Color(hex: 0x9d895d).opacity(0.5)).frame(height: 1) }
      Group {
        if compact {
          VStack(alignment: .leading, spacing: 16) {
        VStack(alignment: .leading, spacing: 0) {
          HStack(spacing: 10) {
            Text(PL("brief.vsTag", "对 阵")).font(Theme.serif(12)).kerning(2).foregroundColor(Color(hex: 0xe6d4ac)).lineLimit(1).minimumScaleFactor(0.7)
              .padding(.horizontal, 7).padding(.vertical, 3).background(tagRed)
            Text(PL("brief.vsTitle", "此席与谁争锋")).font(Theme.serif(12)).kerning(1).foregroundColor(Color(hex: 0x5f513a)).lineLimit(1).minimumScaleFactor(0.7)
          }
          VStack(spacing: 9) {
            ForEach(Array(roster.enumerated()), id: \.offset) { index, member in
              if compact {
                // 竖排卡:像上文下,人像完整展示;纸面浅底与卷面同族
                VStack(spacing: 6) {
                  ZStack(alignment: .topLeading) {
                    PortraitView(skin: member.skin, size: 96)
                      .overlay(Rectangle().strokeBorder(Color(hex: 0x8a7550), lineWidth: 1))
                    Text("\(index + 1)").font(Theme.serif(11)).foregroundColor(Color(hex: 0xf0dfb8))
                      .frame(width: 19, height: 22).background(Color(hex: 0xa34c35)).padding(4)
                  }
                  Text(member.name).font(Theme.serif(16)).foregroundColor(Color(hex: 0x4a3d2a))
                  Text("\(boss ? PL("brief.bossRole", "关底敌将") : PL("brief.enemyRole", "遭遇敌将")) · \(L("term.chips")) \(member.stack)")
                    .font(Theme.serif(9)).foregroundColor(Color(hex: 0x84704e))
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(LinearGradient(colors: [Color(hex: 0xdccfa9), Color(hex: 0xd2c49d)],
                                           startPoint: .top, endPoint: .bottom))
                .overlay(Rectangle().strokeBorder(Color(hex: 0x9d895d).opacity(0.55), lineWidth: 1))
              } else {
                HStack(spacing: 0) {
                  ZStack(alignment: .topLeading) {
                    PortraitView(skin: member.skin, size: 70)
                      .overlay(Rectangle().strokeBorder(Color(hex: 0x76643f), lineWidth: 1))
                    Text("\(index + 1)").font(Theme.serif(11)).foregroundColor(Color(hex: 0xe9d3a3))
                      .frame(width: 19, height: 22).background(Color(hex: 0x84362b)).padding(4)
                  }
                  VStack(alignment: .leading, spacing: 4) {
                    Text(member.name).font(Theme.serif(16)).foregroundColor(Color(hex: 0xead7ab))
                    Text("\(boss ? PL("brief.bossRole", "关底敌将") : PL("brief.enemyRole", "遭遇敌将")) · \(L("term.chips")) \(member.stack)")
                      .font(Theme.serif(9)).foregroundColor(Color(hex: 0x9e957b))
                  }
                  .padding(.horizontal, 10).padding(.vertical, 9)
                  Spacer(minLength: 0)
                }
                .frame(minHeight: 82)
                .background(LinearGradient(colors: [Color(hex: 0x292b21), Color(hex: 0x1c2018)],
                                           startPoint: .topLeading, endPoint: .bottomTrailing))
                .overlay(Rectangle().strokeBorder(Color(hex: 0x76643f), lineWidth: 1))
              }
            }
          }
          .padding(.top, 13)
          if !ruleText.isEmpty {
            Text(PL("brief.rulePrefix", "本回战法 · ") + ruleText)
              .font(Theme.serif(11)).lineSpacing(6).foregroundColor(Color(hex: 0x813b30))
              .fixedSize(horizontal: false, vertical: true)
              .padding(.horizontal, 11).padding(.vertical, 9)
              .background(Color(hex: 0xa34c35).opacity(0.06))
              .overlay(alignment: .leading) { Rectangle().fill(Color(hex: 0x9d4737)).frame(width: 2) }
              .padding(.top, 12)
          }
        }
        .frame(width: compact ? nil : 300, alignment: .leading)
        .padding(.trailing, compact ? 0 : 25)
        .overlay(alignment: .trailing) { if !compact { Rectangle().fill(Color(hex: 0x9d895d).opacity(0.4)).frame(width: 1) } }
            Rectangle().fill(Color(hex: 0x9d895d).opacity(0.4)).frame(height: 1)
        VStack(alignment: .leading, spacing: 0) {
          HStack(spacing: 10) {
            Text(PL("brief.whyTag", "起 因")).font(Theme.serif(12)).kerning(2).foregroundColor(Color(hex: 0xe6d4ac)).lineLimit(1).minimumScaleFactor(0.7)
              .padding(.horizontal, 7).padding(.vertical, 3).background(tagRed)
            Text(PL("brief.whyTitle", "为何非战不可")).font(Theme.serif(12)).kerning(1).foregroundColor(Color(hex: 0x5f513a)).lineLimit(1).minimumScaleFactor(0.7)
          }
          Text(why).font(Theme.serif(17)).lineSpacing(12).kerning(1)
            .foregroundColor(Color(hex: 0x3d3628))
            .fixedSize(horizontal: false, vertical: true)
            .padding(.top, 12)
          HStack(alignment: .top, spacing: 15) {
            stakesBox(tag: PL("brief.winTag", "胜 利"), title: PL("brief.winTitle", "此局之后"), body: win,
                      tint: Color(hex: 0x5f6d4e), border: Color(hex: 0x6c7955))
            stakesBox(tag: PL("brief.lossTag", "负 则"), title: PL("brief.lossTitle", "所失为何"), body: loss,
                      tint: tagRed, border: Color(hex: 0xa14c3c))
          }
          .padding(.top, 19)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
          }
        } else {
          HStack(alignment: .top, spacing: 28) {
        VStack(alignment: .leading, spacing: 0) {
          HStack(spacing: 10) {
            Text(PL("brief.vsTag", "对 阵")).font(Theme.serif(12)).kerning(2).foregroundColor(Color(hex: 0xe6d4ac)).lineLimit(1).minimumScaleFactor(0.7)
              .padding(.horizontal, 7).padding(.vertical, 3).background(tagRed)
            Text(PL("brief.vsTitle", "此席与谁争锋")).font(Theme.serif(12)).kerning(1).foregroundColor(Color(hex: 0x5f513a)).lineLimit(1).minimumScaleFactor(0.7)
          }
          VStack(spacing: 9) {
            ForEach(Array(roster.enumerated()), id: \.offset) { index, member in
              if compact {
                // 竖排卡:像上文下,人像完整展示;纸面浅底与卷面同族
                VStack(spacing: 6) {
                  ZStack(alignment: .topLeading) {
                    PortraitView(skin: member.skin, size: 96)
                      .overlay(Rectangle().strokeBorder(Color(hex: 0x8a7550), lineWidth: 1))
                    Text("\(index + 1)").font(Theme.serif(11)).foregroundColor(Color(hex: 0xf0dfb8))
                      .frame(width: 19, height: 22).background(Color(hex: 0xa34c35)).padding(4)
                  }
                  Text(member.name).font(Theme.serif(16)).foregroundColor(Color(hex: 0x4a3d2a))
                  Text("\(boss ? PL("brief.bossRole", "关底敌将") : PL("brief.enemyRole", "遭遇敌将")) · \(L("term.chips")) \(member.stack)")
                    .font(Theme.serif(9)).foregroundColor(Color(hex: 0x84704e))
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(LinearGradient(colors: [Color(hex: 0xdccfa9), Color(hex: 0xd2c49d)],
                                           startPoint: .top, endPoint: .bottom))
                .overlay(Rectangle().strokeBorder(Color(hex: 0x9d895d).opacity(0.55), lineWidth: 1))
              } else {
                HStack(spacing: 0) {
                  ZStack(alignment: .topLeading) {
                    PortraitView(skin: member.skin, size: 70)
                      .overlay(Rectangle().strokeBorder(Color(hex: 0x76643f), lineWidth: 1))
                    Text("\(index + 1)").font(Theme.serif(11)).foregroundColor(Color(hex: 0xe9d3a3))
                      .frame(width: 19, height: 22).background(Color(hex: 0x84362b)).padding(4)
                  }
                  VStack(alignment: .leading, spacing: 4) {
                    Text(member.name).font(Theme.serif(16)).foregroundColor(Color(hex: 0xead7ab))
                    Text("\(boss ? PL("brief.bossRole", "关底敌将") : PL("brief.enemyRole", "遭遇敌将")) · \(L("term.chips")) \(member.stack)")
                      .font(Theme.serif(9)).foregroundColor(Color(hex: 0x9e957b))
                  }
                  .padding(.horizontal, 10).padding(.vertical, 9)
                  Spacer(minLength: 0)
                }
                .frame(minHeight: 82)
                .background(LinearGradient(colors: [Color(hex: 0x292b21), Color(hex: 0x1c2018)],
                                           startPoint: .topLeading, endPoint: .bottomTrailing))
                .overlay(Rectangle().strokeBorder(Color(hex: 0x76643f), lineWidth: 1))
              }
            }
          }
          .padding(.top, 13)
          if !ruleText.isEmpty {
            Text(PL("brief.rulePrefix", "本回战法 · ") + ruleText)
              .font(Theme.serif(11)).lineSpacing(6).foregroundColor(Color(hex: 0x813b30))
              .fixedSize(horizontal: false, vertical: true)
              .padding(.horizontal, 11).padding(.vertical, 9)
              .background(Color(hex: 0xa34c35).opacity(0.06))
              .overlay(alignment: .leading) { Rectangle().fill(Color(hex: 0x9d4737)).frame(width: 2) }
              .padding(.top, 12)
          }
        }
        .frame(width: compact ? nil : 300, alignment: .leading)
        .padding(.trailing, compact ? 0 : 25)
        .overlay(alignment: .trailing) { if !compact { Rectangle().fill(Color(hex: 0x9d895d).opacity(0.4)).frame(width: 1) } }
        VStack(alignment: .leading, spacing: 0) {
          HStack(spacing: 10) {
            Text(PL("brief.whyTag", "起 因")).font(Theme.serif(12)).kerning(2).foregroundColor(Color(hex: 0xe6d4ac)).lineLimit(1).minimumScaleFactor(0.7)
              .padding(.horizontal, 7).padding(.vertical, 3).background(tagRed)
            Text(PL("brief.whyTitle", "为何非战不可")).font(Theme.serif(12)).kerning(1).foregroundColor(Color(hex: 0x5f513a)).lineLimit(1).minimumScaleFactor(0.7)
          }
          Text(why).font(Theme.serif(17)).lineSpacing(12).kerning(1)
            .foregroundColor(Color(hex: 0x3d3628))
            .fixedSize(horizontal: false, vertical: true)
            .padding(.top, 12)
          HStack(alignment: .top, spacing: 15) {
            stakesBox(tag: PL("brief.winTag", "胜 利"), title: PL("brief.winTitle", "此局之后"), body: win,
                      tint: Color(hex: 0x5f6d4e), border: Color(hex: 0x6c7955))
            stakesBox(tag: PL("brief.lossTag", "负 则"), title: PL("brief.lossTitle", "所失为何"), body: loss,
                      tint: tagRed, border: Color(hex: 0xa14c3c))
          }
          .padding(.top, 19)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
          }
        }
      }
      .padding(.vertical, 20)
      HStack(spacing: 10) {
        Button { game.pendingBriefing?(false) } label: {
          Text(L("brief.back")).font(Theme.serif(14)).kerning(2).foregroundColor(Color(hex: 0x675c46))
            .frame(minHeight: 44).padding(.horizontal, 17).padding(.vertical, 9)
            .overlay(Rectangle().strokeBorder(Color(hex: 0x948360), lineWidth: 1))
        }.buttonStyle(.plain)
        Spacer()
        Button { game.pendingBriefing?(true) } label: {
          VStack(spacing: 3) {
            Text(PL("brief.enterNow", "击 鼓 入 席")).font(Theme.serif(18)).kerning(3).lineLimit(1).minimumScaleFactor(0.8)
              .foregroundColor(Color(hex: 0xf0dfb8))
            Text("\(PL("brief.enterSub", "进入牌桌")) · \(PL("brief.vs", "对战"))\(opponentLabel)")
              .font(Theme.serif(9)).kerning(1).foregroundColor(Color(hex: 0xd1af82)).lineLimit(1).minimumScaleFactor(0.7)
          }
          .frame(minWidth: 190)
          .padding(.horizontal, 17).padding(.vertical, 9)
          .background(Color(hex: 0x743128))
          .overlay(Rectangle().strokeBorder(Color(hex: 0xa65d43), lineWidth: 1))
        }.buttonStyle(.plain)
      }
      .padding(.vertical, 14)
      .overlay(alignment: .top) { Rectangle().fill(Color(hex: 0x9d895d).opacity(0.5)).frame(height: 1) }
    }
    .padding(.horizontal, 32).padding(.top, 25)
    .background(
      LinearGradient(stops: [.init(color: Color(hex: 0xc8b88f), location: 0),
                             .init(color: Color(hex: 0xe2d5b3), location: 0.12),
                             .init(color: Color(hex: 0xd9cba6), location: 0.5),
                             .init(color: Color(hex: 0xe5d9b9), location: 0.88),
                             .init(color: Color(hex: 0xc4b187), location: 1)],
                     startPoint: .leading, endPoint: .trailing)
    )
    .overlay(Rectangle().strokeBorder(Color(hex: 0xeadbb6), lineWidth: 1))
    .overlay(PaperTexture(opacity: 0.18))
  }

  private func stakesBox(tag: String, title: String, body: String, tint: Color, border: Color) -> some View {
    VStack(alignment: .leading, spacing: 0) {
      HStack(spacing: 10) {
        Text(tag).font(Theme.serif(12)).kerning(2).foregroundColor(Color(hex: 0xe6d4ac)).lineLimit(1).minimumScaleFactor(0.7)
          .lineLimit(1).minimumScaleFactor(0.7)
          .padding(.horizontal, 7).padding(.vertical, 3).background(tint)
        Text(title).font(Theme.serif(12)).kerning(1).foregroundColor(Color(hex: 0x5f513a)).lineLimit(1).minimumScaleFactor(0.7)
          .lineLimit(1).minimumScaleFactor(0.7)
      }
      Text(body).font(Theme.serif(12)).lineSpacing(8)
        .foregroundColor(Color(hex: 0x514735))
        .fixedSize(horizontal: false, vertical: true)
        .padding(.top, 10)
    }
    .padding(.horizontal, 14).padding(.vertical, 13)
    .frame(maxWidth: .infinity, alignment: .leading)
    .background(Color(hex: 0xf3e8ca).opacity(0.21))
    .overlay(alignment: .top) { Rectangle().fill(border).frame(height: 2) }
  }

  private func rosterForBriefing(practice: Bool, boss: Bool) -> [RosterMember] {
    if practice, let arena = game.practiceArena {
      return arena["roster"].array.map(Dyn.init).map {
        RosterMember(name: $0["name"].string ?? "",
                     stack: $0["stack"].int ?? 1000,
                     skin: GameData.shared.general($0["gen"].string)?["skin"].string ?? ($0["skin"].string ?? "soldier"))
      }
    }
    guard let chapter = game.selectedChapter ?? game.R?.chapter else { return [] }
    let cfg = boss ? chapter["boss"] : chapter["skirmish"]
    return rosterOf(roundConfig(cfg, game.R?.bossRound ?? 1)).map {
      RosterMember(name: $0["name"].string ?? "",
                   stack: $0["stack"].int ?? 1000,
                   skin: GameData.shared.general($0["gen"].string)?["skin"].string ?? ($0["skin"].string ?? "soldier"))
    }
  }
}

// MARK: - 武将亮相卡

struct GeneralIntroSheet: View {
  @ObservedObject var game = GameViewModel.shared
  let index: Int
  let count: Int
  let boss: Bool
  @State private var reveal: Double = 0
  @State private var shown = false

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
    let bio = intro["bio"].string ?? gen?["bio"].string ?? (boss ? PL("intro.bossBio", "乱世群雄，各有一局。") : PL("intro.skirmishBio", "无名之辈，也守着不肯退的一步。"))
    let quote = intro["quote"].string ?? gen?["barks"]["open"].string ?? (boss ? PL("intro.bossQuote", "此路，先问过我的牌。") : PL("intro.skirmishQuote", "前路遭遇，胜负手上见。"))
    let ruleText = intro["rule"].string ?? chapter?["ruleText"].string
      ?? GameData.shared.storyOf(chapter?["id"].string ?? "")?["objective"].string
      ?? chapter?["premise"].string ?? ""
    let traits = cfg["traits"].dict.compactMapValues { ($0 as? NSNumber)?.intValue }
    let gate = chapter?["gate"].bool == true
    let skin = gen?["skin"].string ?? (boss ? "commander" : "soldier")

    return GeometryReader { geo in
      ZStack {
        Color(hex: 0x090c09).opacity(shown ? 0.92 : 0)
        HStack(spacing: 0) {
          // 立绘:自左揭开
          ZStack {
            RadialGradient(colors: [Color(hex: 0x625b3d), Color(hex: 0x252a20)],
                           center: UnitPoint(x: 0.5, y: 0.3), startRadius: 10, endRadius: 240)
            // 立绘铺满左栏(对应 #bossIntroArt 的 object-fit: cover)
            GeometryReader { g in
              PortraitView(skin: skin, size: max(g.size.width, g.size.height) * 1.08)
            }
            .clipped()
            .offset(x: shown ? 0 : -45)
            .scaleEffect(shown ? 1 : 1.08)
            .opacity(shown ? 1 : 0)
            .animation(.timingCurve(0.16, 0.84, 0.24, 1, duration: 0.8), value: shown)
            VStack {
              Spacer()
              Text(PL("intro.caption", "残卷留影"))
                .font(Theme.serif(10)).kerning(4).foregroundColor(Color(hex: 0x9a9276)).opacity(0.75)
                .padding(.bottom, 12)
            }
            VStack {
              HStack {
                Spacer()
                Text(gate ? PL("intro.sealGate", "关") : PL("intro.sealMeet", "遇"))
                  .font(Theme.serif(gate ? 36 : 27)).foregroundColor(Color(hex: 0xe8d3a3))
                  .frame(width: gate ? 52 : 46, height: gate ? 68 : 58)
                  .background(gate ? Color(hex: 0xa02f25) : Color(hex: 0x84362b))
                  .overlay(Rectangle().strokeBorder(Color(hex: 0xb95c48), lineWidth: 1))
                  .scaleEffect(shown ? 1 : 2.3)
                  .rotationEffect(.degrees(shown ? -3 : -15))
                  .opacity(shown ? 1 : 0)
                  .animation(.timingCurve(0.2, 1.4, 0.4, 1, duration: 0.45).delay(0.48), value: shown)
                  .padding(14)
              }
              Spacer()
            }
          }
          .frame(width: min(360, geo.size.width * 0.4))
          .modifier(RevealLeading(progress: reveal))
          // 信息
          VStack(alignment: .leading, spacing: 0) {
            HStack(spacing: 10) {
              Text(boss ? (gate ? PL("intro.gateKicker", "大 关") : PL("intro.bossKicker", "敌 将 亮 相")) : PL("intro.skirmishKicker", "遭 遇"))
                .font(Theme.serif(11)).kerning(4).foregroundColor(Color(hex: 0xa88d5b))
              Text(chapter?["year"].string ?? PL("intro.deepScroll", "残卷深处"))
                .font(Theme.serif(11)).foregroundColor(Color(hex: 0x8f8a73))
            }
            HStack(alignment: .firstTextBaseline, spacing: 12) {
              Text(cfg["name"].string ?? "")
                .font(Theme.serif(min(46, max(32, geo.size.width * 0.036)))).kerning(4)
                .foregroundColor(gate ? Color(hex: 0xefcf92) : Color(hex: 0xe5d5ae))
                .lineLimit(2).minimumScaleFactor(0.6)
                .offset(x: shown ? 0 : 35).opacity(shown ? 1 : 0)
                .animation(.easeOut(duration: 0.55).delay(0.25), value: shown)
              Text(PL("intro.faction", "汉末")).font(Theme.serif(11)).kerning(2).foregroundColor(Color(hex: 0x8f8a73))
              Spacer()
            }
            .padding(.top, 8)
            Text(bio).font(Theme.serif(12)).kerning(1).lineSpacing(5)
              .foregroundColor(Color(hex: 0xa8a185))
              .fixedSize(horizontal: false, vertical: true)
              .padding(.top, 9)
            // 本回战法
            HStack(alignment: .top, spacing: 10) {
              Text(PL("intro.ruleLabel", "本回战法")).font(Theme.serif(12)).kerning(1).foregroundColor(Color(hex: 0xa88d5b))
                .frame(width: 68, alignment: .leading)
              Text(ruleText).font(Theme.serif(12)).lineSpacing(6).foregroundColor(Color(hex: 0xd2c5a4))
                .fixedSize(horizontal: false, vertical: true)
            }
            .padding(.vertical, 10)
            .overlay(alignment: .top) { Rectangle().fill(Color(hex: 0x4b4834)).frame(height: 1) }
            .overlay(alignment: .bottom) { Rectangle().fill(Color(hex: 0x4b4834)).frame(height: 1) }
            .padding(.top, 14)
            TraitGridView(traits: traits).padding(.top, 17)
            Spacer(minLength: 8)
            HStack(alignment: .bottom, spacing: 14) {
              Text("「\(quote)」").font(Theme.serif(13)).lineSpacing(6).foregroundColor(Color(hex: 0xb0a487))
                .frame(maxWidth: .infinity, alignment: .leading)
                .fixedSize(horizontal: false, vertical: true)
              Button { game.pendingIntro?(true) } label: {
                VStack(spacing: 3) {
                  Text(count > 1 ? (index < count - 1 ? PL("intro.next", "下 一 位") : PL("intro.fight", "应 战")) : PL("intro.fight", "应 战"))
                    .font(Theme.serif(18)).kerning(2).foregroundColor(Color(hex: 0xefdbac))
                  Text(count > 1 ? "\(index + 1) / \(count) · \(PL("intro.tap", "点击继续"))" : PL("intro.tap", "点击继续"))
                    .font(Theme.serif(9)).kerning(2).foregroundColor(Color(hex: 0xc09d75))
                }
                .frame(width: 126)
                .padding(.horizontal, 14).padding(.vertical, 9)
                .background(Color(hex: 0x743128))
                .overlay(Rectangle().strokeBorder(Color(hex: 0xaa5c43), lineWidth: 1))
              }.buttonStyle(.plain)
            }
            .padding(.top, 14)
          }
          .padding(.horizontal, 26).padding(.vertical, 24)
          .frame(maxWidth: .infinity, alignment: .leading)
          .opacity(shown ? 1 : 0)
          .animation(.easeIn(duration: 0.55).delay(0.12), value: shown)
        }
        .frame(width: min(920, geo.size.width * 0.92), height: min(510, geo.size.height * 0.78))
        .background(Color(hex: 0x1b1e16))
        .overlay(Rectangle().strokeBorder(gate ? Color(hex: 0xb54e3a) : Color(hex: 0x76643f), lineWidth: 1))
        .overlay(Rectangle().strokeBorder(gate ? Color(hex: 0x79372a) : Color(hex: 0x4c4531), lineWidth: 1).padding(5))
        .shadow(color: .black.opacity(0.72), radius: 50, y: 30)
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity)
      .onAppear {
        reveal = 0
        shown = false
        withAnimation(.easeOut(duration: 0.65)) { reveal = 1 }
        DispatchQueue.main.async { shown = true }
      }
    }
  }
}

struct TraitGridView: View {
  let traits: [String: Int]
  var body: some View {
    let labels = describeTraits(traits)
    return HStack(spacing: 10) {
      ForEach(labels, id: \.trait) { item in
        VStack(spacing: 2) {
          // 六维名/档位词本地化:引擎存 zh 名,UI 反查 term.trait.N / term.band.N.M
          let ti = TRAITS.firstIndex(of: item.trait) ?? 0
          Text(TRAITS.firstIndex(of: item.trait).map { L("term.trait.\($0)") } ?? item.trait)
            .font(Theme.serif(13)).foregroundColor(Theme.gold)
            .lineLimit(1).minimumScaleFactor(0.6)
          Text("\(Int(item.value))").font(Theme.serif(15, bold: true)).foregroundColor(Theme.paperLight)
          Text(L("term.band.\(ti).\(item.band)")).font(Theme.serif(9)).foregroundColor(Theme.muted)
            .lineLimit(1).minimumScaleFactor(0.6)
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

/// 战果面板 —— 小规模遭遇战结束后的场景(赢/输都要停一次,对应原版牌局结算)。
struct BattleResultSheet: View {
  @ObservedObject var game = GameViewModel.shared
  let win: Bool

  var body: some View {
    VStack(spacing: 18) {
      HStack(spacing: 18) {
        SealStamp(text: win ? L("settle.stampWin") : L("settle.stampLoss"), dim: !win)
        VStack(alignment: .leading, spacing: 8) {
          Text(win ? PL("battle.resultWin", "此阵已下") : PL("battle.resultLoss", "此阵未下"))
            .font(Theme.serif(24, bold: true)).kerning(3)
            .foregroundColor(win ? Color(hex: 0xe9d9b0) : Theme.cinnabarLight)
          Text(win ? PL("battle.resultWinSub", "对手军资归零,你带着这一桌的军资继续行军。")
                   : PL("battle.resultLossSub", "军资见底,这一阵没守住。"))
            .font(Theme.serif(13)).foregroundColor(Theme.muted)
            .fixedSize(horizontal: false, vertical: true)
        }
        Spacer(minLength: 0)
      }
      if let info = game.battleResultInfo {
        HStack(spacing: 0) {
          cell(PL("battle.resultOpponent", "对手"), info.opponent)
          divider
          cell(PL("battle.resultChips", "余军资"), "\(info.chips)")
          divider
          cell(PL("battle.resultOutcome", "战果"), win ? PL("battle.resultWon", "胜") : PL("battle.resultLost", "负"))
        }
        .padding(.vertical, 12)
        .background(Theme.lacquer.opacity(0.5))
        .overlay(Rectangle().strokeBorder(Theme.gold.opacity(0.25), lineWidth: 1))
      }
      HStack(spacing: 14) {
        Button { game.dismissBattleResult() } label: {
          InkButton(title: win ? PL("battle.resultContinue", "继续行军") : PL("battle.resultBack", "回目录"),
                    prominent: true)
        }.buttonStyle(.plain)
          .accessibilityIdentifier("battleResult.continue")
        if win {
          Button { game.dismissBattleResult(); game.showCodex() } label: {
            InkButton(title: L("settle.home"))
          }.buttonStyle(.plain)
        }
      }
    }
    .padding(34)
    .background(Theme.ink.opacity(0.98))
    .frame(maxWidth: 580)
    .overlay(Rectangle().strokeBorder(Theme.gold.opacity(0.35), lineWidth: 1))
    .shadow(color: .black.opacity(0.6), radius: 40, y: 20)
  }

  private func cell(_ label: String, _ value: String) -> some View {
    VStack(spacing: 6) {
      Text(label).font(Theme.serif(10)).kerning(3).foregroundColor(Theme.muted)
      Text(value).font(Theme.serif(17)).foregroundColor(Theme.paperLight).lineLimit(1).minimumScaleFactor(0.7)
    }
    .frame(maxWidth: .infinity)
    .padding(.horizontal, 10)
  }

  private var divider: some View {
    Rectangle().fill(Theme.gold.opacity(0.25)).frame(width: 1, height: 34)
  }
}

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
