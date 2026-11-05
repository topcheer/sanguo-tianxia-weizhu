// PreflopTable.swift —— 169 类起手牌胜率表(由 preflop.json 提供)。
import Foundation

public final class PreflopTable {
  public static let shared: PreflopTable = {
    guard let url = Bundle.main.url(forResource: "preflop", withExtension: "json", subdirectory: "GameData")
      ?? Bundle(for: PreflopTable.self).url(forResource: "preflop", withExtension: "json", subdirectory: "GameData")
    else {
      assertionFailure("preflop.json missing from bundle")
      return PreflopTable(equity: [:])
    }
    guard let data = try? Data(contentsOf: url),
          let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Double] else {
      assertionFailure("preflop.json parse failed")
      return PreflopTable(equity: [:])
    }
    return PreflopTable(equity: obj)
  }()
  public let equity: [String: Double]
  init(equity: [String: Double]) { self.equity = equity }
}
