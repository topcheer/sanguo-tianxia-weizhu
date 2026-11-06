// FX.swift —— 原生特效库:屏震/落叶/金光脉冲/底池弹跳/发牌飞入/按压反馈。
// 复刻原版 fx2d.js 的氛围(落叶、屏震),并加牌桌专属演出。

import SwiftUI

// MARK: - 屏震(复刻 fx2d.shake)

struct ShakeEffect: GeometryEffect {
  var travel: CGFloat
  var shakes: CGFloat = 3
  var animatableData: CGFloat
  func effectValue(size: CGSize) -> ProjectionTransform {
    let decay = max(0, 1 - animatableData.truncatingRemainder(dividingBy: 1))
    let x = travel * sin(animatableData * .pi * shakes * 2) * decay
    return ProjectionTransform(CGAffineTransform(translationX: x, y: 0))
  }
}

// MARK: - 落叶氛围(复刻 fx2d backdrop 落叶层)

struct LeafFallView: View {
  var leafCount = 14
  var body: some View {
    TimelineView(.animation(minimumInterval: 1.0 / 30.0)) { timeline in
      Canvas { ctx, size in
        let t = timeline.date.timeIntervalSinceReferenceDate
        for i in 0..<leafCount {
          let seed = Double(i)
          let speed = 0.018 + fract(seed * 0.137) * 0.028
          let y = fract(t * speed + seed * 0.61)
          let dir: Double = i % 2 == 0 ? 1 : -1
          let x = fract(seed * 0.37 + t * 0.006 * dir)
          let alpha = 0.08 + 0.12 * pow(sin(t * 1.8 + seed * 2.3), 2)
          let w = 5.5 + fract(seed * 0.71) * 3.5
          var leaf = Path()
          leaf.addEllipse(in: CGRect(x: x * size.width, y: y * size.height, width: w * 1.6, height: w * 0.55))
          ctx.opacity = alpha
          ctx.translateBy(x: x * size.width, y: y * size.height)
          ctx.rotate(by: .degrees(t * 24 + seed * 47))
          ctx.translateBy(x: -x * size.width, y: -y * size.height)
          ctx.fill(leaf, with: .color(Color(hex: 0xc2a363)))
        }
      }
    }
    .allowsHitTesting(false)
  }
  private func fract(_ v: Double) -> Double { v - v.rounded(.down) }
}

// MARK: - 赢家手牌金光脉冲

struct GoldenPulse: ViewModifier {
  @State private var on = false
  func body(content: Content) -> some View {
    content
      .shadow(color: Theme.goldLight.opacity(on ? 0.95 : 0.35), radius: on ? 13 : 5)
      .scaleEffect(on ? 1.045 : 1.0)
      .onAppear {
        withAnimation(.easeInOut(duration: 0.68).repeatForever(autoreverses: true)) { on = true }
      }
  }
}

extension View {
  func goldenPulse() -> some View { modifier(GoldenPulse()) }
}

// MARK: - 底池入账弹跳

struct PotPulse: ViewModifier {
  let value: Int
  @State private var bump = false
  func body(content: Content) -> some View {
    content
      .scaleEffect(bump ? 1.16 : 1)
      .shadow(color: Theme.goldLight.opacity(bump ? 0.8 : 0), radius: bump ? 12 : 0)
      .onChange(of: value) { _, _ in
        withAnimation(.spring(response: 0.26, dampingFraction: 0.5)) { bump = true }
        Task { @MainActor in
          try? await Task.sleep(nanoseconds: 260_000_000)
          withAnimation(.easeOut(duration: 0.3)) { bump = false }
        }
      }
  }
}

extension View {
  func potPulse(_ value: Int) -> some View { modifier(PotPulse(value: value)) }
}

// MARK: - 公共牌发牌(从牌堆飞入并翻开)

struct DealtCard: View {
  let card: Int
  var highlighted = false
  /// 相对牌堆的入场偏移(桌面坐标系)
  var fromX: Double = -420
  var fromY: Double = -110
  var delay: Double = 0
  @State private var landed = false
  var body: some View {
    CardView(id: card, big: true, highlighted: highlighted)
      .rotation3DEffect(.degrees(landed ? 0 : 96), axis: (0, 1, 0), perspective: 0.55)
      .offset(x: landed ? 0 : fromX, y: landed ? 0 : fromY)
      .scaleEffect(landed ? 1 : 0.72)
      .opacity(landed ? 1 : 0)
      .onAppear {
        withAnimation(.spring(response: 0.48, dampingFraction: 0.72).delay(delay)) { landed = true }
      }
  }
}

// MARK: - 按钮按压反馈

struct PressableStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label
      .scaleEffect(configuration.isPressed ? 0.93 : 1)
      .opacity(configuration.isPressed ? 0.92 : 1)
      .animation(.spring(response: 0.26, dampingFraction: 0.58), value: configuration.isPressed)
  }
}
