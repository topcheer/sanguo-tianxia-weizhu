// App.swift —— 入口。
import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

@main
struct SanguoApp: App {
  init() {
    #if DEBUG && os(iOS)
    // 演示录制:模拟器无重力感应,用参数请求指定朝向几何
    // (-ggcodeLandscape=1 / -ggcodePortrait=1;App Review 演示视频用)
    let args = ProcessInfo.processInfo.arguments
    let target: UIInterfaceOrientation? =
      args.contains { $0.hasPrefix("-ggcodeLandscape") } ? .landscapeRight
      : args.contains { $0.hasPrefix("-ggcodePortrait") } ? .portrait
      : nil
    if let target {
      // 场景激活时序有竞态,多次重试直到几何生效
      Task { @MainActor in
        for _ in 0..<8 {
          UIDevice.current.setValue(target.rawValue, forKey: "orientation")
          let mask: UIInterfaceOrientationMask = target == .landscapeRight ? .landscapeRight : .portrait
          for scene in UIApplication.shared.connectedScenes where scene.activationState == .foregroundActive {
            (scene as? UIWindowScene)?.requestGeometryUpdate(.iOS(interfaceOrientations: mask))
          }
          UIViewController.attemptRotationToDeviceOrientation()
          try? await Task.sleep(nanoseconds: 700_000_000)
        }
      }
    }
    #endif
  }
  var body: some Scene {
    WindowGroup {
      RootView()
        .preferredColorScheme(.dark)
    }
  }
}
