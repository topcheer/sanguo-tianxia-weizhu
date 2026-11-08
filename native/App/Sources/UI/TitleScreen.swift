// TitleScreen.swift —— 开卷:汉末残卷。
// 逐条对应 index.html#intro + style.css 的排版规则(含 900/640 宽度断点与 560 高度断点)。
import SwiftUI

struct TitleScreen: View {
  @ObservedObject var game = GameViewModel.shared
  @ObservedObject var l10n = L10n.shared
  @State private var step = 0
  @State private var wipe: Double = 0

  // 序章文案:以 zh 为固件内默认值,多语言时由 ui-strings 覆盖。
  private let kickersZh = ["序 · 残卷择人", "序 · 胜负皆成章", "序 · 牌桌就是战场", "序 · 牌外三门课"]
  private let titlesZh = [
    "史书只写了沙场，没写牌桌。",
    "赢，改一段遗憾；输，多懂一层真相。",
    "两张手牌，五张公共牌；赢军资，不争一手意气。",
    "看牌，也看人；争先，也借天时。",
  ]
  private let textsZh = [
    "你是残卷外的读卷人。写卷人请你进入《英雄记》，不是让你无名顶替刘备或关羽，而是让你坐到故人身旁，在关键一局里替他们争另一种可能。集齐三十枚野史朱印，就能见到写卷人，问出这卷书为何选中你。",
    "赢下关底，原卷会被改写成野史。兵败并非白打：你会亲历原本的遗憾，并得到一条“史鉴”，下次重来便知道该看什么。",
    "用手牌与公共牌组成最大的五张牌型。通过下注、跟注或弃牌保住军资；让关底敌将的军资归零，就能改写本回。多人局要淘汰所有敌将。",
    "开卷前选一项天时。牌桌上，武将的神态会泄露强弱，但也会作假；摊牌后破绽簿会验证你的判断。每手可用一次攻心，挑动他的心性。",
  ]
  private let pointsZh: [[String]] = [
    ["四卷五十回，都有史籍底稿与演义边界", "故人记得你的胜负，也记得你的选择"],
    ["胜则改写，败亦入卷", "大关改写后，下一卷才会展开"],
    ["过牌／跟注：控制代价", "加注／全压：逼对手做难选的决定"],
    ["破绽：强未必强，弱未必弱", "攻心：张飞易怒，司马懿不动如山", "行军：军资相随，途中选择会留下后果"],
  ]

  private func kicker(_ i: Int) -> String { PL("prologue.\(i).kicker", kickersZh[min(i, 3)]) }
  private func lessonTitle(_ i: Int) -> String { PL("prologue.\(i).title", titlesZh[min(i, 3)]) }
  private func lessonText(_ i: Int) -> String { PL("prologue.\(i).text", textsZh[min(i, 3)]) }
  private func lessonPoints(_ i: Int) -> [String] {
    pointsZh[min(i, 3)].enumerated().map { PL("prologue.\(i).p\($0.offset)", $0.element) }
  }

  /// 由 style.css 断点推导出的封面度量。
  private struct Metrics {
    var titleMaxW: CGFloat
    var innerW: CGFloat
    var leadInset: CGFloat
    var contentW: CGFloat
    var compact: Bool
    var hideKingdoms: Bool
    var hidePoints: Bool
    var hideHint: Bool
    var hideFoot: Bool
    var eraFont: CGFloat
    var eraBottom: CGFloat
    var titleGap: CGFloat
    var sealW: CGFloat
    var sealH: CGFloat
    var sealFont: CGFloat
    var titleFont: CGFloat
    var titleKerning: CGFloat
    var subFont: CGFloat
    var subKerning: CGFloat
    var subTop: CGFloat
    var chip: CGFloat
    var chipFont: CGFloat
    var linkW: CGFloat
    var chipGap: CGFloat
    var chipTop: CGFloat
    var lessonFont: CGFloat
    var lessonTop: CGFloat
    var storyFont: CGFloat
    var storyLine: CGFloat
    var storyTop: CGFloat
    var pointsTop: CGFloat
    var buttonTop: CGFloat
    var buttonMinW: CGFloat
    var buttonPadH: CGFloat
    var buttonPadV: (CGFloat, CGFloat)
    var buttonFont: CGFloat

    init(w: CGFloat, h: CGFloat, longTitle: Bool = false) {
      let tiny = w <= 640
      // 长标题语种(en/es/de)标题宽度远超中文,魏蜀吴改流式排列避免叠字
      let compact = w <= 900 || longTitle
      let short = h <= 560          // 横屏手机等矮视口:@media (max-height:560px)
      innerW = min(1180, w * (tiny ? 0.92 : 0.88))
      leadInset = w * (tiny ? 0.02 : 0.05)
      contentW = max(0, innerW - leadInset)
      self.compact = compact
      hideKingdoms = short           // .intro-kingdoms { display:none }
      hidePoints = short             // .intro-points { display:none }
      hideHint = short               // #intro .hint { display:none }
      hideFoot = short               // .intro-foot { display:none }
      eraFont = tiny ? 10 : 13
      eraBottom = short ? 10 : (tiny ? 18 : 26)
      titleGap = short ? 14 : (tiny ? 14 : 26)
      sealW = short ? 36 : (tiny ? 40 : 56)
      sealH = short ? 54 : (tiny ? 62 : 82)
      sealFont = short ? 24 : (tiny ? 28 : 38)
      if short {
        titleFont = min(40, max(22, h * 0.052))
      } else if tiny {
        titleFont = min(42, max(25, w * 0.084))
      } else {
        titleFont = min(80, max(48, w * 0.056))
      }
      titleKerning = tiny ? titleFont * 0.08 : titleFont * 0.14
      // 长语种(en/es/de)标题更宽:留出魏蜀吴的横向空间,否则会叠字
      titleMaxW = compact ? max(200, contentW - sealW - titleGap)
        : max(320, contentW - sealW - titleGap - 300)
      subFont = tiny ? 8 : 11
      subKerning = tiny ? 1.4 : 2.2
      subTop = short ? 6 : 13
      chip = tiny ? 38 : (compact ? 44 : 54)
      chipFont = tiny ? 18 : (compact ? 20 : 24)
      linkW = compact ? (tiny ? 20 : 26) : 26
      chipGap = tiny ? 10 : (compact ? 12 : 16)
      chipTop = tiny ? 24 : 20
      lessonFont = short ? 16 : 22
      lessonTop = short ? 12 : 30
      storyFont = short ? 12 : (tiny ? 13 : 16)
      storyLine = short ? 12 * 0.6 : storyFont * 0.9
      storyTop = short ? 8 : (tiny ? 26 : 12)
      pointsTop = 16
      buttonTop = short ? 14 : (tiny ? 24 : 34)
      buttonMinW = short ? 180 : 212
      buttonPadH = short ? 26 : 34
      buttonPadV = short ? (10, 9) : (13, 11)
      buttonFont = short ? 17 : 21
    }
  }

  var body: some View {
    GeometryReader { geo in
      let m = Metrics(w: geo.size.width, h: geo.size.height, longTitle: L("title.name").count > 9)
      ZStack {
        Theme.inkDeep
        RadialGradient(colors: [Color.white.opacity(0),
                                Color(hex: 0x0c100b).opacity(0.13),
                                Color(hex: 0x090c09).opacity(0.73)],
                       center: UnitPoint(x: 0.65, y: 0.40),
                       startRadius: 0,
                       endRadius: max(geo.size.width, geo.size.height) * 0.75)
        IntroLandscape()

        VStack(spacing: 0) {
          Spacer(minLength: 0)
          ScrollView(.vertical, showsIndicators: false) {
            column(m)
          }
          .frame(maxHeight: geo.size.height * 0.94)
          .scrollBounceBehavior(.basedOnSize)
          Spacer(minLength: 0)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
      }
      .overlay(alignment: .bottomTrailing) {
        if !m.hideFoot {
          verticalFoot()
            .padding(.trailing, geo.size.width <= 640 ? 12 : 34)
            .padding(.bottom, geo.size.width <= 640 ? 16 : 28)
        }
      }
    }
    .overlay(alignment: .topTrailing) {
      SfxToggleButton()
        .padding(.trailing, 16).padding(.top, 62)
    }
  }

  // MARK: - 主栏

  private func column(_ m: Metrics) -> some View {
    VStack(alignment: .leading, spacing: 0) {
      // .intro-era
      HStack(spacing: 12) {
        Text(PL("title.badge", "残卷"))
          .font(Theme.serif(m.eraFont)).kerning(m.eraFont * 0.25)
          .foregroundColor(Color(hex: 0xd9caa7))
          .padding(.horizontal, 8).padding(.vertical, 4)
          .overlay(Rectangle().strokeBorder(Color(hex: 0x88734b), lineWidth: 1))
        // 原版 onboarding render():introStep 被替换成「序 · XXX · n / 4」
        Text("\(kicker(step)) · \(step + 1) / 4")
          .font(Theme.serif(m.eraFont)).kerning(m.eraFont * 0.5)
          .foregroundColor(Color(hex: 0x9d967e))
          .lineLimit(1).minimumScaleFactor(0.55)
      }
      .padding(.bottom, m.eraBottom)

      // .intro-title-lock
      HStack(alignment: .center, spacing: m.titleGap) {
        Text(PL("title.seal", "汉"))
          .font(Theme.serif(m.sealFont)).foregroundColor(Color(hex: 0xe3c9a0))
          .frame(width: m.sealW, height: m.sealH)
          .background(Color(hex: 0x8d332b))
          .overlay(Rectangle().strokeBorder(Color(hex: 0xb95c48), lineWidth: 2))
          .overlay(Rectangle().strokeBorder(Color(hex: 0x6e2b25), lineWidth: 1).padding(6))
          .rotationEffect(.degrees(-2))
          .shadow(color: .black.opacity(0.33), radius: 15, x: 8, y: 10)
        VStack(alignment: .leading, spacing: 0) {
          Text(L("title.name"))
            .font(Theme.serif(m.titleFont)).kerning(m.titleKerning)
            .foregroundColor(Color(hex: 0xe5d8b7))
            .lineLimit(1).minimumScaleFactor(0.42)
            .frame(maxWidth: m.titleMaxW, alignment: .leading)
            .shadow(color: Color(hex: 0x171911), radius: 0, x: 0, y: 5)
            .shadow(color: .black.opacity(0.5), radius: 20, y: 12)
          Text("HEROES AT THE TABLE")
            .font(.custom("Georgia", size: m.subFont))
            .kerning(m.subKerning)
            .foregroundColor(Color(hex: 0x8c876f)).padding(.top, m.subTop)
            .lineLimit(1).minimumScaleFactor(0.5)
        }
      }

      // .intro-kingdoms —— >900 绝对定位栏右上;<=900 流式;<=560 高度隐藏
      if !m.hideKingdoms {
        if m.compact {
          kingdoms(m).padding(.top, m.chipTop)
        }
      }

      // #intro .intro-lesson
      Text(lessonTitle(step))
        .font(Theme.serif(m.lessonFont)).kerning(m.lessonFont * 0.1)
        .foregroundColor(Color(hex: 0xe0c58e))
        .lineSpacing(m.lessonFont * 0.6)
        .fixedSize(horizontal: false, vertical: true)
        .padding(.top, m.lessonTop)

      // #intro .story
      Text(lessonText(step))
        .font(Theme.serif(m.storyFont)).kerning(m.storyFont * 0.16)
        .lineSpacing(m.storyLine)
        .foregroundColor(Color(hex: 0xc3b99e))
        .frame(maxWidth: 760, alignment: .leading)
        .fixedSize(horizontal: false, vertical: true)
        .padding(.top, m.storyTop)

      // .intro-points
      if !m.hidePoints {
        FlowLayout(spacing: 18, lineSpacing: 8) {
          ForEach(Array(lessonPoints(step).enumerated()), id: \.offset) { _, point in
            Text(point)
              .font(Theme.serif(12)).kerning(1)
              .foregroundColor(Color(hex: 0x969178))
              .padding(.leading, 12)
              .overlay(alignment: .leading) {
                Rectangle().fill(Color(hex: 0x7c4a37)).frame(width: 2)
              }
          }
        }
        .frame(maxWidth: 760, alignment: .leading)
        .padding(.top, m.pointsTop)
      }

      // #startBtn + .intro-skip(两个 inline-block,宽度不足时换行)
      FlowLayout(spacing: 18, lineSpacing: 0) {
        Button { advance() } label: {
          VStack(spacing: 4) {
            Text(step < 3 ? PL("prologue.next", "继 续") : PL("prologue.open", "展 开 英 雄 记"))
              .font(Theme.serif(m.buttonFont)).kerning(2).lineLimit(1).minimumScaleFactor(0.8)
              .foregroundColor(Color(hex: 0xf0dfb8))
            Text(step < 3 ? PL("prologue.nextSub", "点击推进 · 可随时跳过") : PL("prologue.openSub", "进入残卷目录"))
              .font(Theme.serif(10)).kerning(2.8).lineLimit(1).minimumScaleFactor(0.7)
              .foregroundColor(Color(hex: 0xc9a887))
          }
          .frame(minWidth: m.buttonMinW)
          .padding(.horizontal, m.buttonPadH)
          .padding(.top, m.buttonPadV.0).padding(.bottom, m.buttonPadV.1)
          .background(Color(hex: 0x713129))
          .overlay(Rectangle().strokeBorder(Color(hex: 0xb16b4f), lineWidth: 1))
          .overlay(Rectangle().strokeBorder(Color(hex: 0x411d18).opacity(0.5), lineWidth: 3).padding(3))
          .shadow(color: .black.opacity(0.33), radius: 12, y: 8)
          .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityIdentifier("title.continue")
        .accessibilityLabel(step < 3 ? PL("prologue.next", "继续") : PL("prologue.open", "展开英雄记"))

        Button { game.enterGame() } label: {
          Text(PL("prologue.skip", "跳过背景，直接入卷"))
            .font(Theme.serif(11)).kerning(1)
            .foregroundColor(Color(hex: 0x85816c))
            .lineLimit(1)
            .padding(.horizontal, 12).padding(.vertical, 8)
            .overlay(Rectangle().strokeBorder(Color(hex: 0x504e3f), lineWidth: 1))
        }
        .buttonStyle(.plain)
        .accessibilityIdentifier("title.skip")
        .accessibilityLabel(PL("prologue.skip", "跳过背景，直接入卷"))
        .offset(y: 14)   // .intro-skip { margin-top: 14px }
      }
      .padding(.top, m.buttonTop)

      // #intro .hint
      if !m.hideHint {
        Text(PL("prologue.hint", "背景序章约三十秒；机制还会在第一次操作时分别提示"))
          .font(Theme.serif(11)).kerning(2)
          .foregroundColor(Color(hex: 0x777662))
          .padding(.top, 24)
      }
    }
    .frame(width: m.contentW, alignment: .leading)
    .padding(.leading, m.leadInset)
    .frame(width: m.innerW, alignment: .leading)
    .modifier(WipeUp(progress: wipe))
    .overlay(alignment: .topTrailing) {
      if !m.hideKingdoms && !m.compact {
        kingdoms(m)
          .padding(.top, 82)
          .padding(.trailing, m.innerW * 0.06)
      }
    }
  }

  private func kingdoms(_ m: Metrics) -> some View {
    HStack(alignment: .center, spacing: m.chipGap) {
      ForEach(Array(["魏", "蜀", "吴"].enumerated()), id: \.offset) { i, k in
        if i > 0 {
          Rectangle().fill(Color(hex: 0x655d46)).frame(width: m.linkW, height: 1)
        }
        Text(k).font(Theme.serif(m.chipFont)).foregroundColor(Color(hex: 0xb4a57e))
          .frame(width: m.chip, height: m.chip)
          .background(Circle().fill(Color(hex: 0x1d2118).opacity(0.67)))
          .overlay(Circle().strokeBorder(Color(hex: 0x736748), lineWidth: 1))
      }
    }
  }

  // .intro-foot —— writing-mode: vertical-rl
  private func verticalFoot() -> some View {
    VStack(spacing: 3) {
      ForEach(Array(Array("卷帙有尽 · 野史无生").enumerated()), id: \.offset) { _, ch in
        Text(String(ch)).font(Theme.serif(11)).foregroundColor(Color(hex: 0x625f50))
      }
    }
  }

  private func advance() {
    if step >= 3 { game.enterGame(); return }
    // 原版:160ms 向上擦除,再 620ms 自上而下落入
    withAnimation(.easeIn(duration: 0.16)) { wipe = 1 }
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.17) {
      step += 1
      wipe = 1
      withAnimation(.timingCurve(0.22, 0.75, 0.2, 1, duration: 0.62)) { wipe = 0 }
    }
  }
}
