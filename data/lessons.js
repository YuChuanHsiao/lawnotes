/* 講義索引 — 規則見 AGENTS.md 第 8 節。新增講義請加在 LESSONS 陣列末尾。 */

window.SUBJECTS = {
  constitution: { name: "憲法" },
  admin:        { name: "行政法" },
  civil:        { name: "民法" },
  criminal:     { name: "刑法" },
  civpro:       { name: "民事訴訟法" },
  crimpro:      { name: "刑事訴訟法" },
  company:      { name: "公司法" }
};

window.LESSONS = [
  {
    id: "constitution-001",
    subject: "constitution",
    title: "比例原則",
    articles: "憲法 §23、行政程序法 §7",
    level: 1,
    minutes: 10,
    file: "lessons/constitution-001-proportionality.html",
    summary: "目的正當、適合性、必要性、衡平性四階審查，基本權案例必備骨架。",
    tags: ["基本權限制", "違憲審查"],
    updated: "2026-11-16"
  },
  {
    id: "civil-001",
    subject: "civil",
    title: "意思表示錯誤",
    articles: "民法 §88–§91",
    level: 2,
    minutes: 12,
    file: "lessons/civil-001-mistake.html",
    summary: "內容錯誤、表示錯誤與動機錯誤的區分，以及撤銷權與信賴利益賠償。",
    tags: ["法律行為", "撤銷", "性質錯誤"],
    updated: "2026-11-16"
  },
  {
    id: "criminal-001",
    subject: "criminal",
    title: "正當防衛",
    articles: "刑法 §23",
    level: 2,
    minutes: 12,
    file: "lessons/criminal-001-self-defense.html",
    summary: "現在不法侵害、防衛必要性與防衛意思的三段審查，含過當與誤想防衛。",
    tags: ["阻卻違法", "防衛過當", "誤想防衛"],
    updated: "2026-11-16"
  },
  {
    id: "criminal-002",
    subject: "criminal",
    title: "緊急避難",
    articles: "刑法 §24",
    level: 2,
    minutes: 10,
    file: "lessons/criminal-002-necessity.html",
    summary: "緊急危難、不得已（補充性）與利益權衡的審查，含特別義務人限制與二分說。",
    tags: ["阻卻違法", "補充性", "二分說"],
    updated: "2026-11-16"
  }
];
