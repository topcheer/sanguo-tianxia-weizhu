// AudioFX.swift —— 程序化音频(移植 src/audio.js 的 WebAudio 合成,无素材)。
// 风声底噪/筹码/发牌/闷击/钟鸣/胜利和弦/全押心跳,参数与原版逐一对齐。

import AVFoundation
import Foundation

#if canImport(AppKit)
import AppKit
#endif

/// 单个正在发声的合成音(渲染回调里逐 sample 计算)。
private final class Voice {
  enum Kind { case chip(highpass: Bool, freq: Double, q: Double, dur: Double, gain: Double)
              case tone(wave: Int, from: Double, to: Double, dur: Double, gain: Double, slide: Bool)
              case wind }
  let kind: Kind
  var t: Double = 0            // 秒
  var rng: UInt64 = 0x9E3779B97F4A7C15
  var z1: Double = 0           // 一阶低通状态(风/带通用)

  init(_ k: Kind, seed: UInt64) {
    kind = k
    rng = seed | 1
  }

  /// 风声为常驻循环,不按超时回收
  var isLoop: Bool {
    if case .wind = kind { return true }
    return false
  }

  func next() -> Double {
    t += 1.0 / 44_100.0
    // xorshift64* 噪声源,与 Math.random() 同分布量级
    rng ^= rng >> 12; rng ^= rng << 25; rng ^= rng >> 27
    let noise = Double(Int64(bitPattern: rng &* 2685821657736338717 >> 22)) / 4194304.0
    switch kind {
    case let .chip(highpass, freq, q, dur, gain):
      guard t < dur else { return 0 }
      let env = gain * exp(-t / (dur * 0.32))
      // 一阶差分≈高通;共振峰用低通后的噪声在 freq 附近加权(简化带通)
      let hp = noise - z1 * 0.85
      z1 = z1 * 0.7 + noise * 0.3
      let band = highpass ? hp : (z1 * 2).clamped(to: -1...1)
      let emph = 0.5 + q * 0.3 * abs(sin(2 * .pi * freq * t))
      return band * env * emph
    case let .tone(wave, from, to, dur, gain, slide):
      guard t < dur else { return 0 }
      let f = slide ? from * pow(to / from, min(1, t / dur)) : from
      let phase = 2 * .pi * f * t
      let env = gain * min(1, t / 0.02) * exp(-t / (dur * 0.5))
      let s: Double
      switch wave {
      case 0: s = sin(phase)                      // sine
      case 1: s = 2 / .pi * atan(sin(phase) * 3)  // 近似 triangle
      default: s = sin(phase)
      }
      return s * env
    case .wind:
      // 循环低通噪声,gain 0.05,LFO 0.09Hz ±0.028
      z1 = z1 * 0.88 + noise * 0.12
      let lfo = 0.05 + 0.028 * sin(2 * .pi * 0.09 * t)
      return z1 * 5 * lfo * 0.22
    }
  }
}

private extension Double {
  func clamped(to range: ClosedRange<Double>) -> Double { Swift.min(range.upperBound, Swift.max(range.lowerBound, self)) }
}

/// 全局音效单例(对应 web 端 AudioFX 实例)。
final class AudioFX: @unchecked Sendable {
  static let shared = AudioFX()
  private let engine = AVAudioEngine()
  private var started = false
  private let lock = NSLock()
  private var voices: [Voice] = []
  private var heartTimer: Timer? = nil
  var muted = false

  /// 首次用户交互后调用(iOS 需激活 audio session)。
  func resume() {
    guard !started else { return }
    started = true
    #if canImport(UIKit)
    try? AVAudioSession.sharedInstance().setCategory(.ambient, options: [.mixWithOthers])
    try? AVAudioSession.sharedInstance().setActive(true)
    #endif
    guard let fmt = AVAudioFormat(standardFormatWithSampleRate: 44_100, channels: 1) else { return }
    let src = AVAudioSourceNode(format: fmt) { [weak self] _, _, frameCount, audioBufferList -> OSStatus in
      guard let self else { return noErr }
      let buf = UnsafeMutableAudioBufferListPointer(audioBufferList)[0]
      let ptr = buf.mData!.assumingMemoryBound(to: Float.self)
      self.lock.lock()
      var mix = [Double](repeating: 0, count: Int(frameCount))
      for v in self.voices { for i in 0..<Int(frameCount) { mix[i] += v.next() } }
      self.voices.removeAll { $0.t > 4.0 && !$0.isLoop }
      self.lock.unlock()
      for i in 0..<Int(frameCount) { ptr[i] = Float(min(1, max(-1, mix[i] * 0.55))) }
      return noErr
    }
    engine.attach(src)
    engine.connect(src, to: engine.mainMixerNode, format: src.outputFormat(forBus: 0))
    try? engine.start()
    startVoice(Voice.Kind.wind, seed: UInt64.random(in: 1...UInt64.max))  // 常驻风声
  }

  private func startVoice(_ k: Voice.Kind, seed: UInt64) {
    lock.lock(); voices.append(Voice(k, seed: seed)); lock.unlock()
  }

  private func fire() { if !muted { resume() } }

  // MARK: 音效(参数对齐 audio.js)

  func chip() {
    guard !muted else { return }
    fire()
    startVoice(.chip(highpass: true, freq: 5200, q: 1.2, dur: 0.05, gain: 0.16), seed: UInt64.random(in: 1...UInt64.max))
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.04 + .random(in: 0...0.06)) { [weak self] in
      self?.startVoice(.chip(highpass: true, freq: 4200, q: 1.2, dur: 0.04, gain: 0.10), seed: UInt64.random(in: 1...UInt64.max))
    }
  }

  func card() {
    guard !muted else { return }
    fire()
    startVoice(.chip(highpass: false, freq: 1400, q: 0.8, dur: 0.13, gain: 0.12), seed: UInt64.random(in: 1...UInt64.max))
  }

  func thud() {
    guard !muted else { return }
    fire()
    startVoice(.tone(wave: 0, from: 82, to: 38, dur: 0.28, gain: 0.5, slide: true), seed: 1)
    startVoice(.chip(highpass: false, freq: 300, q: 0.6, dur: 0.12, gain: 0.12), seed: 2)
  }

  func chime() {
    guard !muted else { return }
    fire()
    startVoice(.tone(wave: 0, from: 660, to: 660, dur: 1.4, gain: 0.16, slide: false), seed: 3)
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.12) { [weak self] in
      self?.startVoice(.tone(wave: 0, from: 990, to: 990, dur: 1.4, gain: 0.16, slide: false), seed: 4)
    }
  }

  func win() {
    guard !muted else { return }
    fire()
    for (i, f) in [523.0, 659.0, 784.0].enumerated() {
      DispatchQueue.main.asyncAfter(deadline: .now() + Double(i) * 0.09) { [weak self] in
        self?.startVoice(.tone(wave: 1, from: f, to: f, dur: 0.8, gain: 0.12, slide: false), seed: UInt64(10 + i))
      }
    }
  }

  func heartStart() {
    guard heartTimer == nil else { return }
    let beat = { AudioFX.shared.thud(); DispatchQueue.main.asyncAfter(deadline: .now() + 0.19) { AudioFX.shared.thud() } }
    beat()
    heartTimer = Timer.scheduledTimer(withTimeInterval: 0.95, repeats: true) { _ in beat() }
  }

  func heartStop() {
    heartTimer?.invalidate()
    heartTimer = nil
  }
}
