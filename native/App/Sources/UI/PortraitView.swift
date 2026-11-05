// PortraitView.swift —— 《三国志9》本地头像。
import SwiftUI

#if os(macOS)
typealias PlatformImage = NSImage
#else
typealias PlatformImage = UIImage
#endif

enum PortraitCatalog {
  static var table: [String: String] = {
    guard let url = Bundle.main.url(forResource: "portraits", withExtension: "json", subdirectory: "GameData"),
          let data = try? Data(contentsOf: url),
          let obj = try? JSONSerialization.jsonObject(with: data) as? [String: [String: String]] else { return [:] }
    var t: [String: String] = [:]
    for (k, v) in obj { t[k] = v["file"] }
    return t
  }()
  static func file(for skin: String) -> String {
    table[skin] ?? table["default"] ?? "No_670.jpg"
  }
  static func image(for skin: String) -> PlatformImage? {
    let file = PortraitCatalog.file(for: skin)
    let name = (file as NSString).deletingPathExtension
    guard let url = Bundle.main.url(forResource: name, withExtension: "jpg", subdirectory: "Portraits") else { return nil }
    #if os(macOS)
    return NSImage(contentsOf: url)
    #else
    if let data = try? Data(contentsOf: url) { return UIImage(data: data) }
    return nil
    #endif
  }
}

struct PortraitView: View {
  let skin: String
  var size: CGFloat = 64
  var body: some View {
    Group {
      if let img = PortraitCatalog.image(for: skin) {
        #if os(macOS)
        Image(nsImage: img).resizable().scaledToFill()
        #else
        Image(uiImage: img).resizable().scaledToFill()
        #endif
      } else {
        ZStack {
          Rectangle().fill(Theme.lacquer)
          Text("武").font(Theme.serif(size / 2)).foregroundColor(Theme.paperDim)
        }
      }
    }
    .frame(width: size, height: size * 88 / 68)
    .overlay(Rectangle().strokeBorder(Theme.gold.opacity(0.55), lineWidth: 1))
    .clipped()
  }
}
