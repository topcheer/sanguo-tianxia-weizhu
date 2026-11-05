// L10n.swift —— 六语言运行时(zh 源 + ja/ko/en/es/de 覆盖),UI 词条与内容覆盖同源。
import Foundation
import Combine

public enum AppLanguage: String, CaseIterable, Identifiable {
  case zh, ja, ko, en, es, de
  public var id: String { rawValue }
  public var displayName: String {
    switch self {
    case .zh: return "中文"
    case .ja: return "日本語"
    case .ko: return "한국어"
    case .en: return "English"
    case .es: return "Español"
    case .de: return "Deutsch"
    }
  }
}

public final class L10n: ObservableObject {
  public static let shared = L10n()
  @Published public var language: AppLanguage = {
    if let raw = UserDefaults.standard.string(forKey: "app.language"), let lang = AppLanguage(rawValue: raw) {
      return lang
    }
    // 跟随系统语言
    let preferred = Locale.preferredLanguages.first ?? "zh"
    for code in [preferred] + Locale.preferredLanguages {
      if code.hasPrefix("zh") { return .zh }
      if code.hasPrefix("ja") { return .ja }
      if code.hasPrefix("ko") { return .ko }
      if code.hasPrefix("es") { return .es }
      if code.hasPrefix("de") { return .de }
      if code.hasPrefix("en") { return .en }
    }
    return .en
  }() {
    didSet {
      UserDefaults.standard.set(language.rawValue, forKey: "app.language")
      reload()
      GameData.shared.applyLocalization(self)
      objectWillChange.send()
    }
  }

  /// UI 词条表(当前语言 → zh 回退)
  public private(set) var uiPack: [String: String] = [:]
  /// 内容覆盖表(仅非 zh 语言有值;zh 为空表)
  public var contentPack: [String: String] { language == .zh ? [:] : uiPack }

  private init() {
    reload()
  }

  private func loadPack(_ lang: AppLanguage) -> [String: String] {
    guard let url = Bundle.main.url(forResource: lang.rawValue, withExtension: "json", subdirectory: "Localizations"),
          let data = try? Data(contentsOf: url),
          let obj = try? JSONSerialization.jsonObject(with: data) as? [String: String] else {
      return [:]
    }
    return obj
  }

  public func reload() {
    uiPack = loadPack(language)
  }

  /// UI 词条查询:当前语言 → zh → key 本身。
  public func t(_ key: String) -> String {
    if let s = uiPack[key] { return s }
    if language != .zh, let zh = loadPack(.zh)[key] { return zh }
    return key
  }
}

/// 全局速查函数。
public func L(_ key: String) -> String { L10n.shared.t(key) }
public func LF(_ key: String, _ args: CVarArg...) -> String {
  String(format: L(key), arguments: args)
}
