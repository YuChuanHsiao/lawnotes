---
description: 從 LLM Wiki 產出教學型 HTML 簡報的 Graph Workflow（含程式檢查與退回路線）
---

# Workflow: `/topic-slides`（Graph + 節點內小 Loop）

設計原則：**大圈很少轉，小圈轉得很快**——錯誤在離源頭最近的關卡攔截，退回時只修出錯的那一關，不整份重做。

## 節點與狀態流程

```text
[1. 檢索 wiki/]
   └─► 關卡 1：覆蓋率檢查（相關 WIKI 條目 < 3 篇 → 立即停下，不硬湊）
   ▼
[2. 整理大綱與對應表]（輸出：每頁主題 ↔ WIKI-XX 對應）
   └─► 關卡 2：人工確認大綱（缺子題 → 退回節點 1 補檢索）
   ▼
[3. 撰寫逐頁稿（節點內小 Loop，最多 2 輪）]
   ├─ 限制：只能引用對應 WIKI-XX 卡片內容，不得引入 Wiki 外未驗證法條
   └─► 關卡 3：忠實度與白話度檢查（術語太硬／觀念講反 → 只退回修那一頁）
   ▼
[4. 渲染 slides.html（節點內小 Loop，最多 3 輪）]
   ├─ 限制：只負責視覺排版與互動元件，不可私自改寫法律結論
   └─► 關卡 4：可執行腳本檢查 `node scripts/check_slides.js`（輸出 `report.md`）
       ├─ 頁數不在 8–15 頁 / 缺出處 / WIKI-XX 不存在 / 斷鏈 / 單頁字數過長
       └─ 不通過 → 依 `report.md` 指出的頁碼退回節點 3 或 4（最多改 3 輪）
   ▼
[5. 記錄 wiki/log.md 並交件]
```

## 執行指令
1. 確認 `raw/` 至少 5 篇且已完成 `wiki/` 編譯與一致性 Lint。
2. 依上述節點產出或更新 `slides.html`。
3. 執行驗證腳本並產生檢查報告：
   ```bash
   node scripts/check_slides.js
   ```
4. 檢視 `report.md`，確認所有檢查項目皆為 `PASS`，並將本次紀錄補寫進 `wiki/log.md`。
