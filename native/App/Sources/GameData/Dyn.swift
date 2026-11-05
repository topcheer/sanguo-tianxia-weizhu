// Dyn.swift —— 动态 JSON 访问器:数据保真 + 语言覆盖就地替换。
import Foundation

/// 包装 JSONSerialization 产物的动态访问器(可变,供本地化覆盖)。
public final class Dyn {
  public var value: Any
  public init(_ any: Any) { value = any }
  public convenience init?(data: Data) {
    guard let obj = try? JSONSerialization.jsonObject(with: data) else { return nil }
    self.init(obj)
  }
  public var isNull: Bool { value is NSNull || value == nil }

  public var dict: [String: Any] {
    get { (value as? [String: Any]) ?? [:] }
    set { value = newValue }
  }
  public var array: [Any] { (value as? [Any]) ?? [] }
  public var string: String? { value as? String }
  public var double: Double? {
    if let d = value as? Double { return d }
    if let i = value as? Int { return Double(i) }
    if let n = value as? NSNumber { return n.doubleValue }
    return nil
  }
  public var int: Int? { double.map(Int.init) }
  public var bool: Bool? {
    if let b = value as? Bool { return b }
    if let n = value as? NSNumber { return n.boolValue }
    return nil
  }
  public var stringArray: [String] { array.compactMap { $0 as? String } }

  public subscript(key: String) -> Dyn { Dyn(dict[key] ?? NSNull()) }
  public subscript(index: Int) -> Dyn { index >= 0 && index < array.count ? Dyn(array[index]) : Dyn(NSNull()) }

  public func has(_ key: String) -> Bool { dict[key] != nil }
  public func set(_ key: String, _ any: Any) { var d = dict; d[key] = any; value = d }
  public func setIndex(_ i: Int, _ any: Any) {
    var a = array
    if i < a.count { a[i] = any; value = a }
  }

  public var intArray: [Int] { array.compactMap { ($0 as? NSNumber)?.intValue } }
  public var dictKeys: [String] { Array(dict.keys) }
}

/// 深拷贝(JSON 往返)。
func deepCopy(_ any: Any) -> Any {
  guard JSONSerialization.isValidJSONObject(any),
        let data = try? JSONSerialization.data(withJSONObject: any),
        let obj = try? JSONSerialization.jsonObject(with: data) else { return any }
  return obj
}
