# QMK 網頁驅動本機版

這份 2026-11-25 的備份包含 GearHub V5、V4、舊版 Quantum Mechanical Kit，以及 Windows 與 macOS 的原廠 IoT 連線元件。從同一個首頁選取裝置，程式會依原廠相容清單開啟對應的驅動。來源為 [qmk.top](https://qmk.top/) 和[舊版 WebDriver](https://iotdriver.qmk.top/)。

## 在本機使用

1. Windows 使用者請解壓縮整個資料夾，再雙擊 `Start-Driver.cmd`。啟動器會使用已安裝的 Node.js、Python 3，或 Codex 隨附的 Node.js。其他平台可以在資料夾內執行 `node Start-Driver.cjs`。
2. 保持終端機視窗開啟，用桌面版 Chrome 或 Edge 前往[本機驅動首頁](http://127.0.0.1:8765/)。
3. 接上鍵盤、滑鼠或接收器，按首頁的「允許瀏覽器訪問」，選擇裝置並授權，再開啟型號卡片。型號及連線模式須在原廠支援範圍內。
4. 若切換到舊版驅動，依畫面提示安裝對應平台的 IoT 元件，啟動後重新整理。下載按鈕會讀取資料夾內的原廠安裝檔。

已有 Python 3 的電腦也可以在專案目錄執行 `python -m http.server 8765 --bind 127.0.0.1`。

## 備份內容

| 驅動 | 入口 | 原廠型號目錄筆數 | 連線方式 |
| --- | --- | ---: | --- |
| GearHub V5 | `/` | 98 | WebHID 或新版 IoT |
| GearHub V4 | `/v4/` | 1,246 | WebHID 或新版 IoT |
| 舊版 WebDriver | `/legacy/` | 1,881 | 舊版 IoT |

同一型號可能有多種連線模式，也可能出現在多份目錄中。三套前端的裝置模組、鍵盤配置、圖像、音效及裝置偵測檔都在本機。原站缺少的 13 張品牌圖沿用通用圖，兩個桌面版專用字型沿用系統字型。

為符合既有 GitHub Pages 站點的容量限制，專案將 1,149 個 V4 鍵盤 SVG 模組中的重複行各存一份，載入時還原。每個模組的匯出字串均已與原版逐字比對。完整下載 ZIP 保留這些模組的原始寫法。[GitHub Pages 容量說明](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

`iot_driver/win` 和 `iot_driver/mac` 各有兩代原廠安裝包。新版元件適用 V5/V4，`QMKIot` 適用舊版。兩代元件依各自畫面提示安裝。帳號、雲端設定分享、線上版本檢查及韌體下載仍使用原廠服務。

## 驗證

執行 `node tests/check-driver-files.cjs` 可檢查三代入口、裝置目錄和舊版引用的媒體檔。執行 `node tests/check-v4-module-identity.cjs` 可檢查 V4 模組引用與 React 入口是否一致。

在封鎖外網的瀏覽器中，已用模擬裝置驗證 AK029 V2、AK680MC、MageGee MK25020 和 AJ159 APEX 能進入設定頁，ROYALAXE D98 能轉入舊版首頁。實體裝置通訊及韌體更新需另以對應硬體驗證。
