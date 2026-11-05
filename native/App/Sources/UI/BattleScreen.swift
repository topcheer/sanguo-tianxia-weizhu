// BattleScreen.swift —— 席位化牌桌:按原版 battle.js 百分比坐标复刻布局。
// SLOTS: community(50±11.5i, 45), pot(50,38), deck(10,42), muck(10,66)
// opponentSpot: 1→(50,27); 2→[31,69]/22; 3→[20,50,80]/22; n≥4→x=8+84t, y=13+21(1-sin(πt))
import SwiftUI
import Combine

// MARK: - 扑克牌

struct CardView: View {
  let id: Int
  var big = false
  var highlighted = false
  var body: some View {
    VStack(spacing: 1) {
      Text(RANKS[rankOf(id)]).font(Theme.serif(big ? 22 : 13, bold: true))
      Text(SUITS[suitOf(id)]).font(Theme.serif(big ? 22 : 13, bold: true))
    }
    .foregroundColor(SUIT_RED[suitOf(id)] ? Color(hex: 0xb84a3a) : Color(hex: 0x2c2c22))
    .frame(width: big ? 48 : 31, height: big ? 68 : 44)
    .background(RoundedRectangle(cornerRadius: big ? 7 : 4).fill(Color(hex: 0xeee3c7)))
    .overlay(RoundedRectangle(cornerRadius: big ? 7 : 4).strokeBorder(highlighted ? Theme.goldLight : Color.black.opacity(0.35), lineWidth: highlighted ? 2.5 : 1))
    .shadow(color: .black.opacity(0.45), radius: 3, y: 2)
  }
}

struct CardBackView: View {
  var big = false
  var body: some View {
    ZStack {
      RoundedRectangle(cornerRadius: big ? 7 : 4).fill(LinearGradient(colors: [Color(hex: 0x8d332b), Color(hex: 0x6e2b25)], startPoint: .top, endPoint: .bottom))
      Text("♠").font(Theme.serif(big ? 26 : 16)).foregroundColor(Color(hex: 0xd9bd8e))
    }
    .frame(width: big ? 48 : 31, height: big ? 68 : 44)
    .overlay(RoundedRectangle(cornerRadius: big ? 7 : 4).strokeBorder(Color.black.opacity(0.3), lineWidth: 1))
    .shadow(color: .black.opacity(0.45), radius: 3, y: 2)
  }
}

struct ChipStack: View {
  let count: Int
  var tone: String = "ivory"  // ivory | ebony | pot
  var body: some View {
    let n = min(max(0, count), 12)
    let base: Color = tone == "pot" ? Theme.gold : (tone == "ivory" ? Color(hex: 0xd8cbaa) : Color(hex: 0x4a4634))
    ZStack {
      ForEach(0..<n, id: \.self) { i in
        Circle().fill(base)
          .frame(width: 15, height: 15)
          .overlay(Circle().strokeBorder(Theme.goldLight.opacity(0.8), lineWidth: 1).frame(width: 11, height: 11))
          .overlay(Circle().strokeBorder(Color.black.opacity(0.35), lineWidth: 0.8))
          .offset(y: CGFloat(-i * 3))
      }
    }
    .frame(height: CGFloat(n * 3 + 16), alignment: .bottom)
  }
}

// MARK: - 席位牌

struct SeatPlate: View {
  @ObservedObject var seat: Seat
  let isBoss: Bool
  var body: some View {
    VStack(spacing: 3) {
      HStack(spacing: 7) {
        PortraitView(skin: seat.skin, size: 44)
        VStack(alignment: .leading, spacing: 2) {
          HStack(spacing: 5) {
            Text(seat.name).font(Theme.serif(13, bold: true)).foregroundColor(Theme.paperLight)
              .lineLimit(1).truncationMode(.tail).minimumScaleFactor(0.75)
              .frame(maxWidth: 132, alignment: .leading)
              .layoutPriority(1)
            if seat.stack <= 0 {
              Text(L("battle.eliminated")).font(Theme.serif(9)).foregroundColor(Theme.cinnabarLight)
            } else if seat.folded {
              Text(L("battle.folded")).font(Theme.serif(9)).foregroundColor(Theme.muted)
            }
          }
          Text("\(seat.stack)").font(Theme.serif(12, bold: true)).foregroundColor(Theme.goldLight)
          if engine.moraleBadges(for: seat) > 0 {
            HStack(spacing: 1) {
              ForEach(0..<engine.moraleBadges(for: seat), id: \.self) { _ in
                Text(engine.tiltOf(seat) >= 2 ? "!" : "·").font(.system(size: 9).weight(.bold)).foregroundColor(Theme.cinnabarLight)
              }
            }
          }
        }
      }
      .padding(.horizontal, 8).padding(.vertical, 5)
      .background(Theme.ink.opacity(0.82))
      .overlay(RoundedRectangle(cornerRadius: 2).strokeBorder(Theme.gold.opacity(0.55), lineWidth: 1))
      HStack(spacing: 3) {
        ForEach(engine.roles(for: seat), id: \.self) { role in
          Text(role).font(Theme.serif(9))
            .padding(.horizontal, 4).padding(.vertical, 1)
            .background(role == L("role.button") ? Theme.cinnabar : Theme.lacquer)
            .overlay(RoundedRectangle(cornerRadius: 1).strokeBorder(Theme.gold.opacity(0.4), lineWidth: 0.8))
            .foregroundColor(Theme.paperLight)
        }
      }
    }
    .opacity(seat.stack <= 0 ? 0.45 : (seat.folded ? 0.6 : 1))
  }
  @ObservedObject private var engine: BattleEngine
  init(seat: Seat, engine: BattleEngine, isBoss: Bool) {
    self.seat = seat
    self.engine = engine
    self.isBoss = isBoss
  }
}

// MARK: - 牌桌主屏

struct BattleScreen: View {
  @ObservedObject var game = GameViewModel.shared
  @ObservedObject var store = ProgressStore.shared
  @State private var banner: (String, String)? = nil
  @State private var verifyOpen = false
  @State private var codexEntries: [String] = []

  var body: some View {
    GeometryReader { geo in
      // 小屏(横屏手机)按桌面设计画布缩放整张牌桌,保证席位/底池/行动栏都在屏内
      let realW = geo.size.width, realH = geo.size.height
      let w = max(realW, 1180), h = max(realH, 780)
      let scale = min(1, min(realW / w, realH / h))
      ZStack {
        // 背景与桌面
        LinearGradient(colors: [Color(hex: 0x0d110d), Color(hex: 0x141a12), Color(hex: 0x0d110d)], startPoint: .top, endPoint: .bottom)
        // 桌面:椭圆木边 + 毛毡
        Ellipse()
          .fill(Theme.gold.opacity(0.35))
          .frame(width: w * 0.88, height: h * 0.66)
          .offset(y: -h * 0.02)
        Ellipse()
          .fill(LinearGradient(colors: [Color(hex: 0x3c5c46), Theme.felt, Color(hex: 0x2c463a)], startPoint: .top, endPoint: .bottom))
          .frame(width: w * 0.85, height: h * 0.63)
          .offset(y: -h * 0.02)
        // 桌布纹理暗纹
        Ellipse()
          .strokeBorder(Theme.gold.opacity(0.12), lineWidth: 10)
          .frame(width: w * 0.72, height: h * 0.5)
          .offset(y: -h * 0.02)

        if let engine = game.activeBattle {
          playField(engine: engine, w: w, h: h)
        }
      }
      .frame(width: w, height: h)
      .scaleEffect(scale)
      .frame(width: realW, height: realH)
    }
    .ignoresSafeArea(edges: .bottom)
    .sheet(isPresented: $verifyOpen) {
      if let engine = game.activeBattle { VerifySheet(engine: engine) }
    }
    #if os(macOS)
    .frame(minWidth: 1080, minHeight: 720)
    #endif
  }

  // MARK: 坐标(与 battle.js SLOTS/opponentSpot 一致)

  func opponentSpot(_ index: Int, _ count: Int) -> (x: Double, y: Double) {
    switch count {
    case 1: return (50, 27)
    case 2: return ([31.0, 69.0][index], 22)
    case 3: return ([20.0, 50.0, 80.0][index], 22)
    default:
      let t = Double(index) / Double(count - 1)
      return (8 + t * 84, 13 + 21 * (1 - sin(.pi * t)))
    }
  }

  @ViewBuilder
  private func playField(engine: BattleEngine, w: Double, h: Double) -> some View {
    let playH = h * 0.86 // 牌面区域(底部留给行动栏)
    let opps = engine.opponents
    ZStack(alignment: .topLeading) {
      // 对手席位
      ForEach(Array(opps.enumerated()), id: \.element.id) { index, seat in
        let spot = opponentSpot(index, opps.count)
        VStack(spacing: 4) {
          // 台词/破绽气泡(立绘上方)
          if let bubble = seat.bubble {
            Text(bubble).font(Theme.serif(11)).foregroundColor(Theme.paper)
              .padding(.horizontal, 8).padding(.vertical, 5)
              .background(Theme.lacquer.opacity(0.96))
              .overlay(RoundedRectangle(cornerRadius: 3).strokeBorder(Theme.gold.opacity(0.6), lineWidth: 1))
              .fixedSize(horizontal: true, vertical: true)
              .frame(maxWidth: 230)
          }
          // 手牌 + 摊牌印章
          HStack(spacing: 4) {
            ForEach(Array(seat.hole.enumerated()), id: \.offset) { _, cid in
              if seat.showdownName != nil {
                CardView(id: cid)
              } else {
                CardBackView()
              }
            }
            if let sd = seat.showdownName {
              VStack(spacing: 1) {
                Text(sd).font(Theme.serif(10, bold: true)).foregroundColor(seat.showdownVerdict == "win" ? Theme.goldLight : Theme.paperDim)
                if seat.showdownVerdict != nil {
                  Text(seat.showdownVerdict == "win" ? "胜" : "负").font(Theme.serif(9))
                    .foregroundColor(Theme.inkDeep)
                    .padding(.horizontal, 3)
                    .background(seat.showdownVerdict == "win" ? Theme.goldLight : Theme.muted)
                }
              }
            }
          }
          .frame(height: 46)
          SeatPlate(seat: seat, engine: engine, isBoss: engine.config.boss)
            .onTapGesture { engine.selectedSeat = seat.id }
            .overlay(
              RoundedRectangle(cornerRadius: 2)
                .strokeBorder(engine.selectedSeat == seat.id && opps.count > 1 ? Theme.goldLight : .clear, lineWidth: 1.5)
            )
        }
        .position(x: w * spot.x / 100, y: playH * spot.y / 100 - 46 + h * 0.03)
      }

      // 牌堆(左)与种子
      VStack(spacing: 3) {
        ZStack {
          ForEach(0..<5, id: \.self) { i in
            CardBackView().offset(x: CGFloat(i) * 1.5, y: CGFloat(-i) * 1.5)
          }
        }
        Text("#" + engine.config.seed).font(.system(size: 9, design: .monospaced)).foregroundColor(Theme.muted)
      }
      .position(x: w * 0.10, y: playH * 0.42 + h * 0.03)

      // 底池(公共牌上方)
      VStack(spacing: 3) {
        ChipStack(count: engine.H.map { potTotal($0.seats) } ?? 0, tone: "pot")
        Text("\(engine.H.map { potTotal($0.seats) } ?? 0)").font(Theme.serif(15, bold: true)).foregroundColor(Theme.goldLight)
      }
      .position(x: w * 0.5, y: playH * 0.40 + h * 0.03)

      // 公共牌(中央 45%)
      HStack(spacing: 10) {
        ForEach(Array(engine.board.enumerated()), id: \.offset) { _, cid in
          CardView(id: cid, big: true)
        }
        ForEach(engine.board.count..<5, id: \.self) { _ in
          RoundedRectangle(cornerRadius: 7).fill(Color.black.opacity(0.18))
            .overlay(RoundedRectangle(cornerRadius: 7).strokeBorder(Theme.gold.opacity(0.25), lineWidth: 1))
            .frame(width: 48, height: 68)
        }
      }
      .position(x: w * 0.5, y: playH * 0.50 + h * 0.03)

      // 各席位当街下注(置于各自席位与公共牌之间)
      ForEach(Array(engine.seats.enumerated()), id: \.element.id) { index, seat in
        if seat.bet > 0, let H = engine.H, H.seats.contains(where: { $0.id == seat.id }) {
          let isHero = seat.isHero
          let spot = isHero ? (x: 50.0, y: 66.0) : opponentSpot(max(0, opps.firstIndex { $0.id == seat.id } ?? 0), opps.count)
          VStack(spacing: 1) {
            ChipStack(count: seat.bet, tone: isHero ? "ivory" : "ebony")
            Text("\(seat.bet)").font(Theme.serif(11)).foregroundColor(Theme.paperDim)
          }
          .position(x: w * spot.x / 100, y: playH * (isHero ? 0.72 : spot.y + 4) / 100 + h * 0.03)
        }
      }

      // 玩家区(底部)
      heroArea(engine: engine)
        .position(x: w * 0.5, y: playH * 0.97)

      // 横幅
      if let b = banner {
        VStack(spacing: 5) {
          Text(b.0).font(Theme.serif(30, bold: true)).kerning(4).foregroundColor(Theme.goldLight)
            .shadow(color: .black.opacity(0.8), radius: 4, y: 2)
          if !b.1.isEmpty {
            Text(b.1).font(Theme.serif(14)).foregroundColor(Theme.paper).multilineTextAlignment(.center)
          }
        }
        .padding(.horizontal, 30).padding(.vertical, 18)
        .background(Theme.inkDeep.opacity(0.82))
        .overlay(RoundedRectangle(cornerRadius: 4).strokeBorder(Theme.gold.opacity(0.6), lineWidth: 1))
        .position(x: w * 0.5, y: playH * 0.62 + h * 0.03)
        .transition(.opacity)
      }

      // 破绽簿(右侧,桌面端)
      #if os(macOS)
      if !codexEntries.isEmpty {
        VStack(alignment: .leading, spacing: 6) {
          Text(L("tell.codexTitle")).font(Theme.serif(11)).kerning(3).foregroundColor(Theme.gold)
          ForEach(Array(codexEntries.prefix(5).enumerated()), id: \.offset) { _, e in
            Text(e).font(Theme.serif(10)).foregroundColor(Theme.paperDim).lineLimit(3).fixedSize(horizontal: false, vertical: true)
          }
        }
        .padding(10)
        .frame(width: 210, alignment: .leading)
        .background(Theme.ink.opacity(0.75))
        .overlay(RoundedRectangle(cornerRadius: 3).strokeBorder(Theme.gold.opacity(0.3), lineWidth: 1))
        .position(x: w - 118, y: h * 0.32)
      }
      #endif
    }
    // 顶部信息条
    .safeAreaInset(edge: .top) {
      topBar(engine: engine)
    }
    // 底部行动区
    .safeAreaInset(edge: .bottom) {
      VStack(spacing: 6) {
        infoLine(engine: engine)
        ActionBanner()
      }
      .padding(.horizontal, 14).padding(.bottom, 10)
      .background(Theme.inkDeep.opacity(0.9))
    }
    .onReceive(engine.eventBridge.bannerPub) { b in
      withAnimation { banner = b }
      Task {
        try? await Task.sleep(nanoseconds: 2_100_000_000)
        withAnimation { if banner?.0 == b.0 && banner?.1 == b.1 { banner = nil } }
      }
    }
    .onReceive(engine.eventBridge.codexPub) { entry in
      codexEntries.insert(entry, at: 0)
      if codexEntries.count > 8 { codexEntries.removeLast() }
    }
    .onAppear {
      engine.clock = { seconds in
        try? await Task.sleep(nanoseconds: UInt64(seconds * 1_000_000_000))
      }
    }
  }

  private func topBar(engine: BattleEngine) -> some View {
    HStack(spacing: 12) {
      if store.progress.settings.equityAssist {
        OddsPanel(result: engine.latestOdds)
      }
      Spacer()
      Button { _ = engine.taunt() } label: {
        InkButton(title: engine.config.zhiZi ? L("battle.zhiZi") : L("battle.gongxin"))
      }
      .buttonStyle(.plain)
      .disabled(engine.taunted || engine.H == nil)
      Button { verifyOpen = true } label: { InkButton(title: L("battle.verify")) }.buttonStyle(.plain)
    }
    .padding(.horizontal, 16).padding(.vertical, 6)
    .background(Theme.inkDeep.opacity(0.7))
  }

  private func infoLine(engine: BattleEngine) -> some View {
    HStack(spacing: 14) {
      Text("\(L("battle.handLabel")) \(engine.handNum) · \(L("battle.blinds")) \(engine.blinds[0])/\(engine.blinds[1])")
        .font(Theme.serif(12)).foregroundColor(Theme.paperDim)
      Text("\(L("odds.currentHand")) \(engine.H != nil ? madeName(engine.hero.hole, engine.board) : "—")")
        .font(Theme.serif(12)).foregroundColor(Theme.paper)
      Spacer()
      if engine.opponents.count > 1 {
        Text("\(engine.seats.count)\(L("practice.sizeN"))").font(Theme.serif(11)).foregroundColor(Theme.muted)
      }
    }
  }

  private func heroArea(engine: BattleEngine) -> some View {
    VStack(spacing: 6) {
      HStack(spacing: 12) {
        SeatPlate(seat: engine.hero, engine: engine, isBoss: false)
        HStack(spacing: 10) {
          ForEach(Array(engine.hero.hole.enumerated()), id: \.offset) { _, cid in
            CardView(id: cid, big: true, highlighted: engine.heroWinHighlight)
          }
        }
      }
      if engine.hero.folded {
        Text(L("battle.youFolded")).font(Theme.serif(11)).foregroundColor(Theme.muted)
      }
    }
  }
}

// MARK: 行动面板

struct ActionBanner: View {
  @ObservedObject var game = GameViewModel.shared

  var body: some View {
    HStack(spacing: 10) {
      if let prompt = game.actionPrompt {
        let view = prompt.view
        if view.toCall > 0 {
          actionButton(L("action.fold"), danger: true) { game.submitPlayerAction(.init(type: "fold")) }
          actionButton(view.toCall >= view.stack ? "\(L("action.allinCall")) \(view.stack)" : "\(L("action.call")) \(view.toCall)") { game.submitPlayerAction(.init(type: "call")) }
        } else {
          actionButton(L("action.check")) { game.submitPlayerAction(.init(type: "check")) }
        }
        ForEach(Array(prompt.presets.enumerated()), id: \.offset) { _, p in
          actionButton("\(p.label) \(p.amount)") { game.submitPlayerAction(.init(type: "raise", amount: p.amount)) }
        }
        if view.stack > 0 && view.canRaise {
          actionButton("\(L("action.allin")) \(view.stack)", prominent: true) { game.submitPlayerAction(.init(type: "allin")) }
        }
      } else {
        Text(game.activeBattle?.spectate == true ? L("battle.spectating") : " ")
          .font(Theme.serif(12)).foregroundColor(Theme.muted)
      }
    }
    .frame(minHeight: 44)
  }

  private func actionButton(_ label: String, prominent: Bool = false, danger: Bool = false, action: @escaping () -> Void) -> some View {
    Button(action: action) {
      InkButton(title: label, prominent: prominent, danger: danger)
    }.buttonStyle(.plain)
  }
}

/// 一次性续体包装:重复 resume 在 DEBUG 下断言,release 下静默忽略。
final class ResumeOnce<T> {
  private var consumed = false
  private var cont: CheckedContinuation<T, Never>?
  init(_ cont: CheckedContinuation<T, Never>) { self.cont = cont }
  func resume(_ value: T) {
    if consumed { return }
    consumed = true
    cont?.resume(returning: value)
    cont = nil
  }
}

// MARK: 局势分析面板

struct OddsPanel: View {
  let result: OddsResult?
  var body: some View {
    Group {
      if let r = result {
        HStack(spacing: 10) {
          stat(L("odds.equity"), String(format: "%.1f%%", r.equity.e * 100), Theme.goldLight)
          stat(L("odds.tie"), String(format: "%.1f%%", r.equity.tie * 100), Theme.paper)
          stat(L("odds.current"), r.currentName, Theme.paper)
          ForEach(Array(r.draws.prefix(2).enumerated()), id: \.offset) { _, d in
            stat(d.name, "\(d.outs.count) \(L("odds.outs"))", Theme.jade.opacity(0.95))
          }
        }
        .padding(.horizontal, 10).padding(.vertical, 6)
        .background(Theme.ink.opacity(0.85))
        .overlay(RoundedRectangle(cornerRadius: 3).strokeBorder(Theme.gold.opacity(0.35), lineWidth: 1))
      } else {
        Text(L("odds.pending")).font(Theme.serif(10)).foregroundColor(Theme.muted)
      }
    }
  }
  private func stat(_ label: String, _ value: String, _ color: Color) -> some View {
    VStack(spacing: 1) {
      Text(label).font(Theme.serif(9)).foregroundColor(Theme.muted)
      Text(value).font(Theme.serif(12, bold: true)).foregroundColor(color)
    }
  }
}

// MARK: 验牌

struct VerifySheet: View {
  let engine: BattleEngine
  var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      Text("\(L("verify.title")) #\(engine.config.seed) · \(L("battle.handLabel")) \(max(1, engine.handNum))")
        .font(Theme.serif(18, bold: true)).foregroundColor(Theme.goldLight)
      if engine.deckLog.isEmpty {
        Text(L("verify.empty")).font(Theme.serif(13)).foregroundColor(Theme.muted)
      } else {
        ScrollView {
          Text(engine.deckLog.map { cardName($0) }.joined(separator: "  "))
            .font(.system(size: 13, design: .monospaced))
            .foregroundColor(Theme.paper)
        }.frame(maxHeight: 280)
      }
      Text(L("verify.note")).font(Theme.serif(11)).foregroundColor(Theme.muted)
    }
    .padding(26)
    .frame(minWidth: 500, minHeight: 320)
    .background(Theme.ink.opacity(0.98))
  }
}
