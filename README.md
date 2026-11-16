# 法學考點講義（Law Notes）

給法律系學生準備國考（律師、司法官、法研所）的「一篇一考點」講義網站。
每篇講義固定依「學習目標 → 條文 → 概念 → 要件拆解 → 比較表 → 實例演練 → 考點提醒 → 常見錯誤 → 自我測驗」編排。

- 線上瀏覽：https://yuchuanhsiao.github.io/lawnotes/
- AI 協作規則：見 [AGENTS.md](./AGENTS.md)（Claude Code 請見 [CLAUDE.md](./CLAUDE.md)）

## 目前講義

| 科目 | 講義 |
|---|---|
| 憲法 | [比例原則](lessons/constitution-001-proportionality.html) |
| 民法 | [意思表示錯誤](lessons/civil-001-mistake.html) |
| 刑法 | [正當防衛](lessons/criminal-001-self-defense.html) |
| 刑法 | [緊急避難](lessons/criminal-002-necessity.html) |

## 如何新增講義（給 AI 的一句話指令）

> 「請依照 AGENTS.md，新增一篇刑法講義：緊急避難。」

AI 會：複製 `templates/lesson-template.html` → 建立 `lessons/criminal-002-necessity.html` → 依固定區塊填寫 → 在 `data/lessons.js` 末尾登錄。首頁卡片、科目篩選、上下篇導覽會自動更新。

## 技術

純 HTML / CSS / 原生 JavaScript，無建置步驟。雙擊 `index.html` 即可本機預覽。
