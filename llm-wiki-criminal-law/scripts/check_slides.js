#!/usr/bin/env node
/**
 * check_slides.js — 可執行的 LLM Wiki & 教學 HTML 簡報自動化檢查腳本
 * 「做完了」不是 AI 說了算，是腳本說了算。
 *
 * 檢查項目：
 * 1. raw/ 來源數量 >= 5
 * 2. wiki/ 條目皆具備 WIKI-XX ID 與有效的 SRC-XX 來源追溯
 * 3. slides.html 頁數介於 8–15 頁
 * 4. 每一頁簡報皆有 WIKI-XX 出處標註，且引用的 WIKI-XX 皆存在於 wiki/
 * 5. Wiki 知識覆蓋率：所有 WIKI 條目皆被簡報引用（不遺漏核心條目）
 * 6. 連結檢查：slides.html 內的回跳錨點 (#WIKI-XX) 與 index.html 存在
 * 7. 單頁文字量檢查：每頁純文字 <= 750 字元（避免簡報字太多溢出）
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RAW_DIR = path.join(ROOT, 'raw');
const WIKI_DIR = path.join(ROOT, 'wiki');
const SLIDES_FILE = path.join(ROOT, 'slides.html');
const INDEX_FILE = path.join(ROOT, 'index.html');
const REPORT_FILE = path.join(ROOT, 'report.md');

const results = [];
let failed = 0;

function record(name, pass, detail) {
  results.push({ name, pass, detail });
  if (!pass) failed++;
}

// 1. Check raw/ sources
const rawFiles = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.md')).sort();
const validSrcIds = new Set();
for (const f of rawFiles) {
  const txt = fs.readFileSync(path.join(RAW_DIR, f), 'utf8');
  const m = txt.match(/SRC-\d+/);
  if (m) validSrcIds.add(m[0]);
}
record(
  '1. 原始資料數量 (raw/ >= 5 篇)',
  rawFiles.length >= 5,
  `共 ${rawFiles.length} 篇（${[...validSrcIds].sort().join(', ')}）`
);

// 2. Collect all wiki entries (WIKI-XX) and verify SRC-XX traceability
function walkMd(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walkMd(full));
    else if (entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

const wikiFiles = walkMd(WIKI_DIR).filter(f => {
  const base = path.basename(f);
  return base !== 'index.md' && base !== 'log.md';
});

const validWikiIds = new Set();
const wikiTraceIssues = [];
for (const wf of wikiFiles) {
  const txt = fs.readFileSync(wf, 'utf8');
  const rel = path.relative(ROOT, wf).replace(/\\/g, '/');
  const wid = txt.match(/WIKI-\d+/);
  const srcs = [...new Set(txt.match(/SRC-\d+/g) || [])];
  if (!wid) {
    wikiTraceIssues.push(`${rel} 缺少 WIKI-XX 編號`);
  } else {
    validWikiIds.add(wid[0]);
  }
  if (srcs.length === 0) {
    wikiTraceIssues.push(`${rel} 缺少 SRC-XX 來源追溯`);
  } else {
    for (const s of srcs) {
      if (!validSrcIds.has(s)) wikiTraceIssues.push(`${rel} 引用不存在的 ${s}`);
    }
  }
}
record(
  '2. Wiki 條目編號與 SRC 來源追溯',
  validWikiIds.size >= 3 && wikiTraceIssues.length === 0,
  wikiTraceIssues.length === 0
    ? `共 ${validWikiIds.size} 篇條目（${[...validWikiIds].sort().join(', ')}），全數可追溯至 raw/`
    : wikiTraceIssues.join('；')
);

// 3. Parse slides.html
const slidesHtml = fs.readFileSync(SLIDES_FILE, 'utf8');
const slideMatches = slidesHtml.match(/<section\b[^>]*class="slide[^"]*"[^>]*>[\s\S]*?<\/section>/g) || [];
const pageCount = slideMatches.length;
record(
  '3. 簡報頁數規格 (8–15 頁)',
  pageCount >= 8 && pageCount <= 15,
  `實際共 ${pageCount} 頁`
);

// 4 & 5 & 7. Per-slide citations, coverage, and text density
const citedWikiAll = new Set();
const missingCitationPages = [];
const invalidWikiRefs = [];
const densePages = [];
const perPageSummary = [];

slideMatches.forEach((sec, idx) => {
  const pageNum = idx + 1;
  const titleMatch = sec.match(/data-title="([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : `第 ${pageNum} 頁`;
  const wikis = [...new Set(sec.match(/WIKI-\d+/g) || [])];
  if (wikis.length === 0) {
    missingCitationPages.push(`第 ${pageNum} 頁（${title}）`);
  }
  for (const w of wikis) {
    citedWikiAll.add(w);
    if (!validWikiIds.has(w)) {
      invalidWikiRefs.push(`第 ${pageNum} 頁引用不存在的 ${w}`);
    }
  }
  const plainText = sec.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const len = plainText.length;
  if (len > 750) {
    densePages.push(`第 ${pageNum} 頁（${len} 字元）`);
  }
  perPageSummary.push({ pageNum, title, wikis, len });
});

record(
  '4. 每頁出處標註與 WIKI-XX 有效性',
  missingCitationPages.length === 0 && invalidWikiRefs.length === 0,
  missingCitationPages.length === 0 && invalidWikiRefs.length === 0
    ? `全部 ${pageCount} 頁皆有有效 WIKI-XX 出處`
    : [...missingCitationPages.map(p => `缺出處: ${p}`), ...invalidWikiRefs].join('；')
);

const uncoveredWikis = [...validWikiIds].filter(w => !citedWikiAll.has(w));
record(
  '5. Wiki 知識覆蓋率 (100% 條目被引用)',
  uncoveredWikis.length === 0,
  uncoveredWikis.length === 0
    ? `${citedWikiAll.size}/${validWikiIds.size} 篇 Wiki 條目皆已涵蓋於簡報`
    : `未涵蓋條目：${uncoveredWikis.join(', ')}`
);

// 6. Link check
const indexExists = fs.existsSync(INDEX_FILE);
const brokenLinks = [];
if (!indexExists) brokenLinks.push('找不到 index.html');
const hrefMatches = [...slidesHtml.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
for (const href of hrefMatches) {
  if (href.startsWith('http') || href.startsWith('#')) continue;
  const [filePart, hashPart] = href.split('#');
  const targetPath = path.join(ROOT, filePart);
  if (!fs.existsSync(targetPath)) {
    brokenLinks.push(`斷鏈檔案：${href}`);
  }
  if (hashPart && /^WIKI-\d+$/.test(hashPart) && !validWikiIds.has(hashPart)) {
    brokenLinks.push(`無效錨點：${href}`);
  }
}
record(
  '6. 簡報與 Wiki 連結完整性',
  brokenLinks.length === 0,
  brokenLinks.length === 0
    ? `已驗證 ${hrefMatches.length} 個超連結與回跳錨點，0 處斷鏈`
    : brokenLinks.join('；')
);

record(
  '7. 單頁文字密度檢查 (防版面溢出 <= 750 字元)',
  densePages.length === 0,
  densePages.length === 0
    ? `全部 ${pageCount} 頁文字密度皆在安全範圍內（最長 ${Math.max(...perPageSummary.map(p => p.len))} 字元）`
    : `字數偏多需精簡：${densePages.join('、')}`
);

// Generate report.md
const now = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
const statusBadge = failed === 0 ? '✅ ALL PASS' : `❌ FAILED (${failed} 項未通過)`;

const lines = [
  `# 自動化檢查報告（report.md）`,
  ``,
  `- **檢查腳本**：\`scripts/check_slides.js\``,
  `- **執行時間**：${now}`,
  `- **總結狀態**：**${statusBadge}**（通過 ${results.length - failed}/${results.length} 項）`,
  ``,
  `## 檢查項目明細`,
  ``,
  `| 檢查項目 | 結果 | 說明 |`,
  `| --- | :---: | --- |`,
  ...results.map(r => `| ${r.name} | ${r.pass ? '✅ PASS' : '❌ FAIL'} | ${r.detail} |`),
  ``,
  `## 逐頁對應與字數檢核表`,
  ``,
  `| 頁碼 | 投影片標題 | 對應 Wiki 條目 | 純文字長度 |`,
  `| :---: | --- | --- | :---: |`,
  ...perPageSummary.map(p => `| ${p.pageNum} | ${p.title} | ${p.wikis.map(w => `\`${w}\``).join(', ')} | ${p.len} |`),
  ``
];

fs.writeFileSync(REPORT_FILE, lines.join('\n'), 'utf8');
console.log(`Check complete: ${statusBadge}`);
results.forEach(r => console.log(`${r.pass ? '[PASS]' : '[FAIL]'} ${r.name} — ${r.detail}`));
process.exit(failed === 0 ? 0 : 1);
