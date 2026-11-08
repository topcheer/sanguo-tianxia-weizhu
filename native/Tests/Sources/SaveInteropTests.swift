// SaveInteropTests.swift —— 存档导入三形态与拒收路径(桌面端导入修复回归)
import XCTest
@testable import SanguoWeizhu

final class SaveInteropTests: XCTestCase {
  let store = ProgressStore.shared

  func testRoundTripNativeExport() throws {
    // ① 本作导出的包装格式必须能原样导入(iso8601 exportedAt 曾致 decode 整体失败)
    store.markPage("ch.taoyuan", "yeshi")
    let exported = store.exportWebSave()
    let parsed = try ProgressStore.readWebSave(exported)
    XCTAssertEqual(parsed.progress.pages["ch.taoyuan"], "yeshi")
    XCTAssertNotNil(parsed.exportedAt)
  }

  func testWrappedDataOnly() throws {
    // ② {data: ...} 裸包裹
    let json = #"{"data":{"pages":{"ch.sishui":"history"},"endings":["end-x"]}}"#
    let parsed = try ProgressStore.readWebSave(Data(json.utf8))
    XCTAssertEqual(parsed.progress.pages["ch.sishui"], "history")
    XCTAssertNil(parsed.exportedAt)
  }

  func testBareProgress() throws {
    // ③ 顶层即 Progress(web 版接受的形态)
    let json = #"{"pages":{"ch.hulao":"yeshiB"},"annals":{"guanyu":{"seen":2,"won":1}},"apocWins":3}"#
    let parsed = try ProgressStore.readWebSave(Data(json.utf8))
    XCTAssertEqual(parsed.progress.pages["ch.hulao"], "yeshiB")
    XCTAssertEqual(parsed.progress.annals["guanyu"]?.won, 1)
    XCTAssertEqual(parsed.progress.apocWins, 3)
  }

  func testRejectsUnknownJSON() {
    // 任意 JSON(无已知键)必须被拒,不得吞成空白进度
    XCTAssertThrowsError(try ProgressStore.readWebSave(Data(#"{"foo":1}"#.utf8)))
    XCTAssertThrowsError(try ProgressStore.readWebSave(Data("[1,2,3]".utf8)))
  }

  func testRejectsWrongFormatTag() {
    let json = #"{"format":"other-game","formatVersion":9,"data":{"pages":{}}}"#
    XCTAssertThrowsError(try ProgressStore.readWebSave(Data(json.utf8)))
  }
}
