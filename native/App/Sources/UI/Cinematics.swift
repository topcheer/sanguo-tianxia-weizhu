// Cinematics.swift —— 原版过场与纸面效果:擦除、展开、揭开、木轴、角落纹。
import SwiftUI

/// 新增布局文案:优先 L10n,缺失时回退内置中文(语言包后续可覆盖)。
func PL(_ key: String, _ zh: String) -> String {
  let s = L(key)
  return s == key ? zh : s
}

/// 自下而上的擦除 + 位移(对应 .prologue-transition:clip-path inset(0 0 100% 0))。
struct WipeUp: ViewModifier {
  var progress: Double // 0 = 完全显示,1 = 收起
  func body(content: Content) -> some View {
    content
      .opacity(1 - progress)
      .offset(y: progress > 0.5 ? -8 : 0)
      .mask(alignment: .top) {
        GeometryReader { g in
          Rectangle().frame(height: max(1, g.size.height * (1 - progress)), alignment: .top)
        }
      }
  }
}

/// 从中心向两侧展开(对应 briefingUnroll:clip-path inset(0 50%) → inset(0))。
struct UnrollMask: ViewModifier {
  var progress: Double
  func body(content: Content) -> some View {
    content.mask {
      GeometryReader { g in
        Rectangle()
          .frame(width: max(1, g.size.width * progress))
          .frame(maxWidth: .infinity, alignment: .center)
      }
    }
  }
}

/// 从左向右揭开(对应 artReveal:clip-path inset(0 100% 0 0) → inset(0))。
struct RevealLeading: ViewModifier {
  var progress: Double
  func body(content: Content) -> some View {
    content.mask(alignment: .leading) {
      GeometryReader { g in
        Rectangle().frame(width: max(1, g.size.width * progress), alignment: .leading)
      }
    }
  }
}

/// 纸面纹理(细密横纹 + 竖纹),叠加在纯色纸上。
struct PaperTexture: View {
  var opacity: Double = 0.12
  var body: some View {
    Canvas { ctx, size in
      var rows = Path()
      var y: CGFloat = 0
      while y < size.height {
        rows.move(to: CGPoint(x: 0, y: y))
        rows.addLine(to: CGPoint(x: size.width, y: y))
        y += 5
      }
      ctx.stroke(rows, with: .color(.black.opacity(0.45)), lineWidth: 1)
      var cols = Path()
      var x: CGFloat = 0
      while x < size.width {
        cols.move(to: CGPoint(x: x, y: 0))
        cols.addLine(to: CGPoint(x: x, y: size.height))
        x += 7
      }
      ctx.stroke(cols, with: .color(.white.opacity(0.30)), lineWidth: 1)
    }
    .opacity(opacity)
    .blendMode(.softLight)
    .allowsHitTesting(false)
  }
}

/// 卷轴木轴:地图水平上下、战书垂直左右。
struct RollerBar: View {
  var horizontal = true
  var body: some View {
    let colors = [Color(hex: 0x2b2117), Color(hex: 0x806841), Color(hex: 0x4b3823), Color(hex: 0x241b13)]
    let gradient = LinearGradient(colors: colors,
                                  startPoint: horizontal ? .top : .leading,
                                  endPoint: horizontal ? .bottom : .trailing)
    ZStack {
      RoundedRectangle(cornerRadius: horizontal ? 8 : 9)
        .fill(gradient)
        .overlay(RoundedRectangle(cornerRadius: horizontal ? 8 : 9)
          .strokeBorder(Color(hex: 0xa08450), lineWidth: 1))
    }
    .frame(width: horizontal ? nil : 25, height: horizontal ? 20 : nil)
    .shadow(color: .black.opacity(0.5), radius: 8, y: horizontal ? 5 : 2)
  }
}

/// 木轴两端的端帽。
struct RollerCaps: View {
  var horizontal = true
  var body: some View {
    GeometryReader { g in
      let w: CGFloat = horizontal ? 18 : 31
      let h: CGFloat = horizontal ? 26 : 15
      ZStack {
        ForEach(0..<2, id: \.self) { i in
          RoundedRectangle(cornerRadius: 5)
            .fill(Color(hex: 0x33271b))
            .overlay(RoundedRectangle(cornerRadius: 5).strokeBorder(Color(hex: 0x8a7148), lineWidth: 1))
            .frame(width: w, height: h)
            .position(x: horizontal ? (i == 0 ? -2 : g.size.width + 2) : g.size.width / 2,
                      y: horizontal ? g.size.height / 2 : (i == 0 ? -2 : g.size.height + 2))
        }
      }
    }
  }
}

/// 弹窗左上/右下的直角纹。
struct CornerTick: View {
  var body: some View {
    Path { p in
      p.move(to: CGPoint(x: 0, y: 30))
      p.addLine(to: CGPoint(x: 0, y: 0))
      p.addLine(to: CGPoint(x: 30, y: 0))
    }
    .stroke(Color(hex: 0xb4965e), lineWidth: 1)
    .frame(width: 30, height: 30)
  }
}

/// 菱形外环(行军图节点)。
struct Diamond: Shape {
  func path(in rect: CGRect) -> Path {
    Path { p in
      p.move(to: CGPoint(x: rect.midX, y: rect.minY))
      p.addLine(to: CGPoint(x: rect.maxX, y: rect.midY))
      p.addLine(to: CGPoint(x: rect.midX, y: rect.maxY))
      p.addLine(to: CGPoint(x: rect.minX, y: rect.midY))
      p.closeSubpath()
    }
  }
}

/// 行军图地形:经纬细线、区域名、长江、群山(原版 1000×420 坐标系)。
struct MarchTerrainCanvas: View {
  var body: some View {
    Canvas { ctx, _ in
      // 经纬
      var grain = Path()
      for y in [52.0, 187.0, 331.0] {
        grain.move(to: CGPoint(x: 0, y: y))
        grain.addLine(to: CGPoint(x: 1000, y: y))
      }
      for x in [120.0, 422.0, 760.0] {
        grain.move(to: CGPoint(x: x, y: 0))
        grain.addLine(to: CGPoint(x: x, y: 420))
      }
      ctx.stroke(grain, with: .color(Color(hex: 0x7c6b48).opacity(0.11)), lineWidth: 1)
      // 区域名
      ctx.draw(Text("中 原").font(Theme.serif(26)).kerning(9).foregroundColor(Color(hex: 0x5c5b45).opacity(0.25)),
               at: CGPoint(x: 112, y: 62))
      ctx.draw(Text("江 东").font(Theme.serif(26)).kerning(9).foregroundColor(Color(hex: 0x5c5b45).opacity(0.25)),
               at: CGPoint(x: 812, y: 386))
      // 长江
      var river = Path()
      river.move(to: CGPoint(x: -30, y: 292))
      river.addQuadCurve(to: CGPoint(x: 278, y: 292), control: CGPoint(x: 130, y: 219))
      river.addQuadCurve(to: CGPoint(x: 570, y: 276), control: CGPoint(x: 424, y: 340))
      river.addQuadCurve(to: CGPoint(x: 1030, y: 235), control: CGPoint(x: 800, y: 205))
      ctx.stroke(river, with: .color(Color(hex: 0x657f79).opacity(0.43)),
                 style: StrokeStyle(lineWidth: 18, lineCap: .round))
      ctx.stroke(river, with: .color(Color(hex: 0xd2d2b4).opacity(0.45)), lineWidth: 2)
      // 群山
      let mountains: [(CGFloat, CGFloat, CGFloat)] = [
        (80, 102, 0.8), (260, 82, 1.05), (495, 115, 0.75), (735, 78, 1.1), (925, 115, 0.8),
        (175, 350, 0.65), (620, 356, 0.7), (855, 345, 0.6),
      ]
      for (x, y, s) in mountains {
        var m = Path()
        m.move(to: CGPoint(x: -76, y: 35))
        m.addLine(to: CGPoint(x: -38, y: -13))
        m.addLine(to: CGPoint(x: -20, y: 4))
        m.addLine(to: CGPoint(x: 10, y: -48))
        m.addLine(to: CGPoint(x: 37, y: -12))
        m.addLine(to: CGPoint(x: 54, y: -25))
        m.addLine(to: CGPoint(x: 84, y: 35))
        m.closeSubpath()
        let t = CGAffineTransform(translationX: x, y: y).scaledBy(x: s, y: s)
        ctx.fill(m.applying(t), with: .color(Color(hex: 0x5c614b).opacity(0.43)))
        ctx.stroke(m.applying(t), with: .color(Color(hex: 0x424b3b).opacity(0.43)), lineWidth: 2)
      }
    }
  }
}
