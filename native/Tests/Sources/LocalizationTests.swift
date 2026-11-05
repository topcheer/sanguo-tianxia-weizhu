// LocalizationTests.swift —— 语言切换回归:切回中文必须还原原始文本(不能在旧译文上叠加)。
import XCTest
@testable import SanguoWeizhu

final class LocalizationTests: XCTestCase {
  func testSwitchLanguagesRestoresSourceText() throws {
    let l10n = L10n.shared
    let original = l10n.language
    defer { l10n.language = original }

    l10n.language = .zh
    let zhName = try XCTUnwrap(GameData.shared.chapter("taoyuan")?["name"].string)
    XCTAssertEqual(zhName, "桃园")

    l10n.language = .ja
    let jaName = try XCTUnwrap(GameData.shared.chapter("taoyuan")?["name"].string)
    XCTAssertNotEqual(jaName, zhName, "日本語化后章节名应改变")

    l10n.language = .zh
    let back = try XCTUnwrap(GameData.shared.chapter("taoyuan")?["name"].string)
    XCTAssertEqual(back, zhName, "切回中文应还原为原始中文,而不是残留日文")
  }

  func testEveryLanguageCoversChineseKeys() throws {
    let l10n = L10n.shared
    let original = l10n.language
    defer { l10n.language = original }

    let zh = try XCTUnwrap(l10n.loadPackForTesting(.zh), "zh 语言包缺失")
    for lang in [AppLanguage.ja, .ko, .en, .es, .de] {
      let pack = try XCTUnwrap(l10n.loadPackForTesting(lang), "\(lang.rawValue) 语言包缺失")
      let missing = zh.keys.filter { pack[$0] == nil }
      XCTAssertTrue(missing.isEmpty, "\(lang.rawValue) 缺 \(missing.count) 个键,前几个: \(missing.prefix(5))")
    }
  }
}
