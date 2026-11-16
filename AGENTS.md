# AGENTS.md — 法學考點講義（Law Notes）

> 這份文件是給 AI 代理（Antigravity / Claude / Codex / Cursor…）與協作者閱讀的**專案規則書**。
> 任何新增、修改講義的動作，都必須先讀完本文件並遵守。若規則與使用者當下指令衝突，以使用者指令為準，但需提醒衝突之處。

---

## 1. 專案目的

- 這是一個**給法律系學生準備國家考試（律師、司法官、法研所）**的「考點講義」網站。
- 每一篇講義只處理**一個考點**（例如「正當防衛」、「意思表示錯誤」），讓讀者 10–15 分鐘內讀完並能作答。
- 目標讀者：已修過基礎法學課程的大學生，需要「條文 → 要件 → 實例 → 考點提醒 → 自我測驗」的快速複習路徑。
- 成果以 **GitHub Pages** 發布，純靜態網站，**不需要任何建置工具**（no npm、no framework）。

## 2. 技術限制（必須遵守）

| 項目 | 規則 |
|---|---|
| 技術 | 純 HTML + CSS + 原生 JavaScript。**禁止**引入 React/Vue/Tailwind/jQuery 或任何需要 build 的工具。 |
| 外部資源 | 只允許 Google Fonts（Noto Serif TC、Noto Sans TC）。不得引入其他 CDN。 |
| 路徑 | 一律使用**相對路徑**（GitHub Pages 會部署在 `/<repo-name>/` 子路徑下，絕對路徑 `/assets/...` 會壞掉）。 |
| 本機預覽 | 直接雙擊 `index.html` 即可預覽，因此**不可使用 `fetch()` 讀取 JSON**（file:// 會被擋）。講義清單放在 `data/lessons.js`。 |
| 語言 | 內容一律使用**繁體中文（台灣用語）**；程式碼、檔名、class 名稱使用英文。 |

## 3. 資料夾結構

```
law-notes/
├── AGENTS.md                 ← 本文件（AI 規則書，唯一真實來源）
├── CLAUDE.md                 ← 指向 AGENTS.md（給 Claude Code 讀）
├── README.md                 ← 給人看的專案介紹
├── index.html                ← 首頁：講義列表（由 data/lessons.js 自動產生卡片）
├── .nojekyll                 ← 讓 GitHub Pages 不經 Jekyll 處理
├── assets/
│   ├── css/style.css         ← 全站唯一樣式表
│   └── js/main.js            ← 全站唯一腳本（列表渲染、目錄、上下篇、進度條）
├── data/
│   └── lessons.js            ← 講義索引（新增講義時「必改」）
├── lessons/
│   └── {subject}-{NNN}-{slug}.html   ← 每一篇講義
└── templates/
    └── lesson-template.html  ← 新增講義時「必須複製」的範本
```

## 4. 檔案命名規則

講義檔名格式：`lessons/{subject}-{NNN}-{slug}.html`

- `{subject}`：科目代碼，只能使用下表之一（新增科目需同步更新 `data/lessons.js` 的 `SUBJECTS` 與 `style.css` 的顏色變數）。
- `{NNN}`：該科目內的三位數流水號，從 `001` 開始，**不可重複、不可跳號後回填**。
- `{slug}`：英文小寫、以 `-` 連接的考點關鍵字，2–4 個單字。

| 代碼 | 科目 | 主色 CSS 變數 | 色系 |
|---|---|---|---|
| `constitution` | 憲法 | `--c-constitution` | 綠 |
| `admin` | 行政法 | `--c-admin` | 青 |
| `civil` | 民法 | `--c-civil` | 藍 |
| `criminal` | 刑法 | `--c-criminal` | 紅 |
| `civpro` | 民事訴訟法 | `--c-civpro` | 紫 |
| `crimpro` | 刑事訴訟法 | `--c-crimpro` | 橘 |
| `company` | 公司法 | `--c-company` | 棕 |

範例：`lessons/criminal-001-self-defense.html`、`lessons/civil-002-agency.html`

講義 `id` = `{subject}-{NNN}`（例如 `criminal-001`），必須與檔名前綴一致。

## 5. 網頁整體風格

- **意象**：「印在米白紙上的補習班講義」——乾淨、可列印、重點一眼可見。
- **字體**：標題用 `Noto Serif TC`（襯線、有法典感），內文用 `Noto Sans TC`。
- **配色**：背景米白 `--paper`，內文深墨色 `--ink`；每個科目有一個主色，只用於標籤、左邊框、標題底線。
- **版面**：內文最大寬度 760px；桌機版右側固定「本頁目錄」，手機版目錄隱藏。
- **語氣**：像學長姐寫的筆記——精準、條列、少廢話；**不得使用表情符號**（emoji）於講義正文。
- 所有顏色、間距都必須使用 `style.css` 中的 CSS 變數，**禁止在 HTML 中寫 inline style**。

## 6. 講義頁面結構（固定順序）

每一篇講義必須依序包含以下區塊。區塊用 `<section class="...">` 包住，並帶 `id` 讓目錄連結。
標註「必要」者不可省略；「選用」者可依考點性質省略。

| 順序 | 區塊 | class / id | 必要性 | 內容規則 |
|---|---|---|---|---|
| 0 | 頁首資訊 | `.lesson-header` | 必要 | 科目標籤、標題、相關條文、難度（1–3 顆星）、預估閱讀時間、更新日期 |
| 1 | 學習目標 | `#goals` `.goals` | 必要 | 3–4 條，以「能夠…」開頭 |
| 2 | 條文原文 | `#statute` `.statute` | 必要 | 逐字引用現行條文，用 `<blockquote class="statute">`，`<cite>` 標條號 |
| 3 | 概念解說 | `#concept` | 必要 | 白話說明立法目的與核心概念，300 字以內 |
| 4 | 要件拆解 | `#elements` `.elements` | 必要 | 用 `<ol class="elements">`，每個要件 = `<strong>要件名</strong>` + 說明 |
| 5 | 比較表 | `#compare` `.compare-table` | 選用 | 容易混淆的概念對照 |
| 6 | 實例演練 | `#case` `.case` | 必要 | 至少 1 題；題目在 `.case-question`，解答放在 `<details>` 裡，解答須依「爭點 → 要件涵攝 → 結論」三段 |
| 7 | 考點提醒 | `#tips` `.callout.tip` | 必要 | 國考常考角度、答題架構 |
| 8 | 常見錯誤 | `#pitfalls` `.callout.pitfall` | 必要 | 至少 2 點 |
| 9 | 自我測驗 | `#quiz` `.quiz` | 必要 | 3 題選擇或是非，每題用 `<details>` 收合答案與解析 |
| 10 | 相關講義 | `#related` | 選用 | 連到站內其他講義（相對路徑） |
| — | 上下篇導覽 | `<nav class="pager" data-pager>` | 必要 | **留空**，由 `main.js` 依 `lessons.js` 順序自動產生 |

`<body>` 必須帶 `data-lesson-id="{subject}-{NNN}"`，main.js 依此產生上下篇與科目色。

## 7. 新增一篇講義的標準流程（AI 必須照做）

1. **確認考點**：一篇只處理一個考點；若使用者給的主題過大（例如「債編總論」），先拆成多篇並向使用者確認。
2. **決定檔名**：查看 `data/lessons.js` 中該科目最大流水號，`+1` 取得 `{NNN}`。
3. **複製範本**：將 `templates/lesson-template.html` 複製到 `lessons/{subject}-{NNN}-{slug}.html`。
4. **填寫內容**：依第 6 節順序填寫，替換所有 `{{...}}` 佔位符，**不可殘留任何 `{{`**。
5. **登錄索引**：在 `data/lessons.js` 的 `LESSONS` 陣列**末尾**新增一筆（格式見第 8 節）。
6. **自我檢查**：跑完第 10 節檢查清單。
7. **回報**：告訴使用者新增了哪個檔案、改了哪些檔案。

## 8. `data/lessons.js` 資料格式

```js
{
  id: "criminal-001",                 // = 檔名前綴
  subject: "criminal",                // 科目代碼（第 4 節）
  title: "正當防衛",                   // 講義標題，10 字以內
  articles: "刑法 §23",               // 相關條文
  level: 2,                           // 難度 1=基礎 2=常考 3=進階
  minutes: 12,                        // 預估閱讀分鐘
  file: "lessons/criminal-001-self-defense.html",
  summary: "現在不法侵害、防衛必要性與防衛意思的三段審查。", // 40 字以內
  tags: ["阻卻違法", "誤想防衛"],      // 2–4 個
  updated: "2026-11-16"               // YYYY-MM-DD
}
```

- 首頁卡片、篩選按鈕、上下篇導覽**全部由這個陣列自動產生**，HTML 不需手動改首頁。
- 陣列順序即為上下篇順序；新講義加在末尾。

## 9. 內容正確性規則（法律內容特別注意）

- **條文必須是現行條文的逐字引用**；不確定是否修法時，要在回報中明確告訴使用者「請核對全國法規資料庫」。
- 引用大法官解釋 / 憲法法庭判決 / 最高法院判決時，必須確定字號正確；**不確定就不要寫字號**，改寫「實務見解認為…」。
- 學說有爭議時，須並列「通說 / 少數說 / 實務」，不可只寫一說當成定論。
- 實例題人物一律用「甲、乙、丙」，不使用真實人名。
- 不得提供個案法律意見；頁尾固定保留「本講義僅供學習參考」免責聲明。

## 10. 完成前檢查清單

- [ ] 檔名符合 `{subject}-{NNN}-{slug}.html`，`id` 一致
- [ ] `<body data-lesson-id>` 已設定
- [ ] 第 6 節所有「必要」區塊皆存在且順序正確
- [ ] 沒有殘留 `{{` 佔位符、沒有 inline style、沒有 emoji
- [ ] 所有連結、CSS、JS 路徑皆為相對路徑（講義頁使用 `../assets/...`）
- [ ] `data/lessons.js` 已新增對應項目，JS 語法正確（逗號、引號）
- [ ] 雙擊 `index.html` 可看到新卡片，點進去目錄、上下篇正常

## 11. 不可以做的事

- 不可改動 `assets/css/style.css` 的既有變數名稱或刪除既有 class（其他講義依賴它們）。
- 不可為單一講義新增專屬 CSS / JS 檔案；需要新元件時，加到 `style.css` 並在本文件第 6 節補上說明。
- 不可刪除或重新編號既有講義（外部可能已有連結）。
- 不可在首頁 `index.html` 手寫講義卡片。

## 12. 部署

- 推送到 GitHub `main` 分支後，GitHub Pages 設定為 **Deploy from a branch → main → / (root)**。
- 網址格式：`https://<GitHub 帳號>.github.io/law-notes/`

## 13. 後續擴充計畫

以下科目已預先完成代碼與主色設定，後續將依本文件第 7 節流程陸續新增講義：

- **行政法（`admin`）**：例：信賴保護原則、行政處分之撤銷與廢止
- **民事訴訟法（`civpro`）**：例：舉證責任分配、既判力客觀範圍
- **刑事訴訟法（`crimpro`）**：例：違法取得證據之排除、傳聞法則
- **公司法（`company`）**：例：股東會決議瑕疵、董事忠實義務與注意義務
