// Persona.swift —— 六维三国属性 → AI 战术参数。移植自 src/persona.js。
import Foundation

public let TRAITS = ["武勇", "智谋", "诈术", "胆识", "耐性", "心性"]

func tValue(_ traits: [String: Int], _ k: String) -> Double {
  max(0, min(100, Double(traits[k] ?? 50)))
}
func c01(_ v: Double) -> Double { max(0, min(1, v)) }

public struct PersonaTraits {
  public var 武勇: Double, 智谋: Double, 诈术: Double, 胆识: Double, 耐性: Double, 心性: Double
}

public struct Persona {
  public var traits: PersonaTraits
  public var ai: AIPersonality
  public var tauntMult: Double
  public var lieChance: Double
  public var difficulty: Int
}

public func estimateDifficulty(_ traits: [String: Int]) -> Int {
  Int((tValue(traits, "武勇") * 0.20 + tValue(traits, "智谋") * 0.30 + tValue(traits, "诈术") * 0.15
    + tValue(traits, "胆识") * 0.10 + tValue(traits, "耐性") * 0.15 + tValue(traits, "心性") * 0.10).rounded())
}

public func makePersona(_ traits: [String: Int] = [:]) -> Persona {
  let wu = tValue(traits, "武勇"), zhi = tValue(traits, "智谋"), zha = tValue(traits, "诈术")
  let dan = tValue(traits, "胆识"), nai = tValue(traits, "耐性"), xin = tValue(traits, "心性")
  var ai = AIPersonality()
  ai.aggr = 0.35 + wu * 0.009
  ai.bluff = 0.02 + zha * 0.003
  ai.semi = c01(zha * 0.006 + zhi * 0.004)
  ai.trap = max(0, (nai - 40) * 0.012) + zhi * 0.001
  ai.read = zhi / 100
  ai.callBias = 0.005 + nai * 0.0007
  ai.courage = 0.15 + dan * 0.008
  ai.plan = (zhi / 100) * 0.85 * (0.5 + zha * 0.005)
  ai.scare = max(0, (zhi - 30) * 0.008) + zha * 0.002
  ai.valueMin = 0.86 - wu * 0.0006 - zha * 0.0002
  ai.moraleSens = 1 - xin / 100
  ai.moraleStyle = xin >= 65 ? "steady" : (wu >= zhi ? "rage" : "sulk")
  return Persona(
    traits: PersonaTraits(武勇: wu, 智谋: zhi, 诈术: zha, 胆识: dan, 耐性: nai, 心性: xin),
    ai: ai,
    tauntMult: xin >= 80 ? 0 : (xin <= 25 ? 2 : 1),
    lieChance: 0.05 + zha * 0.002,
    difficulty: estimateDifficulty(traits)
  )
}

let BANDS: [String: [(Double, String)]] = [
  "武勇": [(80, "万夫不当"), (60, "骁勇"), (40, "稳健"), (0, "保守")],
  "智谋": [(80, "神机妙算"), (60, "多谋"), (40, "有识"), (0, "少谋")],
  "诈术": [(80, "诡道百出"), (60, "善诈"), (40, "有诈"), (0, "光明磊落")],
  "胆识": [(80, "胆大包天"), (60, "果敢"), (40, "持重"), (0, "怯懦")],
  "耐性": [(80, "坚如磐石"), (60, "能忍"), (40, "常人"), (0, "急躁")],
  "心性": [(80, "不动如山"), (60, "沉稳"), (40, "常人"), (0, "易燃易爆")],
]

public struct TraitLabel { public var trait: String; public var value: Double; public var label: String; public var band: Int = 0 }

public func describeTraits(_ traits: [String: Int]) -> [TraitLabel] {
  TRAITS.map { t in
    let v = tValue(traits, t)
    let bands = BANDS[t]!
    let bi = bands.firstIndex { v >= $0.0 } ?? bands.count - 1
    return TraitLabel(trait: t, value: v, label: bands[bi].1, band: bi)
  }
}
