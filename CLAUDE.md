# CLAUDE.md

本專案的所有規則都寫在 **[AGENTS.md](./AGENTS.md)**，請先完整閱讀該檔案再進行任何修改。

快速重點：
- 純靜態網站（HTML + CSS + 原生 JS），不可引入框架或建置工具。
- 新增講義 = 複製 `templates/lesson-template.html` → 放到 `lessons/{subject}-{NNN}-{slug}.html` → 在 `data/lessons.js` 末尾登錄。
- 講義區塊順序固定：學習目標 → 條文 → 概念 → 要件 → (比較表) → 實例 → 考點提醒 → 常見錯誤 → 自我測驗。
- 繁體中文、相對路徑、不寫 inline style、不用 emoji。
