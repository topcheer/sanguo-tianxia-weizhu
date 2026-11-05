// Theme.swift —— 三国古风视觉主题(取自 style.css 调色板)。
import SwiftUI

enum Theme {
  static let ink = Color(hex: 0x151711)
  static let inkDeep = Color(hex: 0x10130f)
  static let lacquer = Color(hex: 0x252219)
  static let paper = Color(hex: 0xd8cbaa)
  static let paperLight = Color(hex: 0xeee3c7)
  static let paperDim = Color(hex: 0xb9ac8d)
  static let gold = Color(hex: 0xc8a868)
  static let goldLight = Color(hex: 0xecd39a)
  static let cinnabar = Color(hex: 0x9f382e)
  static let cinnabarLight = Color(hex: 0xd16a50)
  static let jade = Color(hex: 0x607b68)
  static let muted = Color(hex: 0x8f8b78)
  static let textMain = Color(hex: 0xe7ddc5)

  static let felt = Color(hex: 0x35523f)
  static let feltDark = Color(hex: 0x243b2e)

  /// 原版字体栈:STKaiti → Kaiti SC → Songti SC → 系统衬线。
  private static let kaiCandidates = ["STKaiti", "Kaiti SC", "KaiTi", "Songti SC", "STSong"]

  static func serif(_ size: CGFloat, bold: Bool = false) -> Font {
    #if canImport(AppKit)
    for name in kaiCandidates where NSFont(name: name, size: size) != nil {
      let font = Font.custom(name, size: size)
      return bold ? font.weight(.semibold) : font
    }
    #endif
    return .system(size: size, weight: bold ? .semibold : .regular, design: .serif)
  }
}

extension Color {
  init(hex: UInt32) {
    self.init(.sRGB,
              red: Double((hex >> 16) & 0xFF) / 255,
              green: Double((hex >> 8) & 0xFF) / 255,
              blue: Double(hex & 0xFF) / 255)
  }
}

/// 通用按钮(古风)。
struct InkButton: View {
  let title: String
  var subtitle: String? = nil
  var prominent = false
  var danger = false
  var body: some View {
    VStack(spacing: 3) {
      Text(title)
        .font(Theme.serif(17, bold: true))
      if let subtitle {
        Text(subtitle).font(Theme.serif(10)).opacity(0.75)
      }
    }
    .foregroundColor(danger ? Theme.cinnabarLight : (prominent ? Color(hex: 0xf0dfb8) : Theme.paperLight))
    .padding(.horizontal, 22).padding(.vertical, 10)
    .background(danger ? Color(hex: 0x2a1a16) : (prominent ? Theme.cinnabar : Color(hex: 0x29291f)))
    .overlay(RoundedRectangle(cornerRadius: 3).strokeBorder(danger ? Color(hex: 0x8a4a3e) : (prominent ? Color(hex: 0xb16b4f) : Color(hex: 0x897345)), lineWidth: 1))
    .contentShape(Rectangle())
    .accessibilityLabel(Text(title))
  }
}

/// 朱印/墨章。
struct SealStamp: View {
  let text: String
  var dim = false
  var body: some View {
    Text(text)
      .font(Theme.serif(30, bold: true))
      .foregroundColor(dim ? Color(hex: 0x8d8570) : Color(hex: 0xe3c9a0))
      .frame(width: 52, height: 74)
      .background(dim ? Color(hex: 0x3a352b) : Color(hex: 0x8d332b))
      .overlay(RoundedRectangle(cornerRadius: 2).strokeBorder(dim ? Color(hex: 0x5a5344) : Color(hex: 0xb95c48), lineWidth: 2))
      .rotationEffect(.degrees(-2))
      .shadow(color: .black.opacity(0.35), radius: 8, y: 6)
  }
}

/// 宣纸卡片。
struct PaperCard<Content: View>: View {
  var content: Content
  init(@ViewBuilder content: () -> Content) { self.content = content() }
  var body: some View {
    content
      .padding(18)
      .background(LinearGradient(colors: [Theme.paper.opacity(0.10), Theme.paper.opacity(0.05)], startPoint: .top, endPoint: .bottom))
      .overlay(RoundedRectangle(cornerRadius: 4).strokeBorder(Theme.gold.opacity(0.35), lineWidth: 1))
  }
}
