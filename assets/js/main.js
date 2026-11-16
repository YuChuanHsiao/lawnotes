/* 法學考點講義 — 全站唯一腳本。資料來源：data/lessons.js（window.LESSONS / window.SUBJECTS） */
(function () {
  "use strict";

  var LESSONS = window.LESSONS || [];
  var SUBJECTS = window.SUBJECTS || {};

  function stars(n) { return "★★★".slice(0, n) + "☆☆☆".slice(0, 3 - n); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- 首頁：講義卡片 + 科目篩選 ---------- */
  function renderIndex() {
    var grid = document.querySelector("[data-lesson-grid]");
    if (!grid) return;
    var filters = document.querySelector("[data-filters]");

    function cards(subject) {
      grid.innerHTML = LESSONS.filter(function (l) {
        return subject === "all" || l.subject === subject;
      }).map(function (l) {
        var sub = SUBJECTS[l.subject] ? SUBJECTS[l.subject].name : l.subject;
        return '<a class="lesson-card" data-subject="' + esc(l.subject) + '" href="' + esc(l.file) + '">' +
          '<span class="badge">' + esc(sub) + "</span>" +
          "<h3>" + esc(l.title) + "</h3>" +
          '<div class="articles">' + esc(l.articles) + "</div>" +
          "<p>" + esc(l.summary) + "</p>" +
          '<div class="tags">' + (l.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" +
          '<div class="meta"><span class="stars" title="難度">' + stars(l.level) + "</span><span>約 " + l.minutes + " 分鐘</span></div>" +
          "</a>";
      }).join("");
    }

    if (filters) {
      var used = ["all"].concat(Object.keys(SUBJECTS).filter(function (k) {
        return LESSONS.some(function (l) { return l.subject === k; });
      }));
      filters.innerHTML = used.map(function (k, i) {
        var name = k === "all" ? "全部" : SUBJECTS[k].name;
        return '<button class="filter-btn' + (i === 0 ? " active" : "") + '" data-key="' + k + '">' + name + "</button>";
      }).join("");
      filters.addEventListener("click", function (e) {
        var btn = e.target.closest(".filter-btn");
        if (!btn) return;
        filters.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        cards(btn.dataset.key);
      });
    }

    var count = document.querySelector("[data-count-lessons]");
    var countSub = document.querySelector("[data-count-subjects]");
    if (count) count.textContent = LESSONS.length;
    if (countSub) countSub.textContent = new Set(LESSONS.map(function (l) { return l.subject; })).size;

    cards("all");
  }

  /* ---------- 講義頁：科目色、目錄、上下篇、進度條 ---------- */
  function renderLesson() {
    var id = document.body.dataset.lessonId;
    if (!id) return;
    var idx = LESSONS.findIndex(function (l) { return l.id === id; });
    var me = LESSONS[idx];
    if (me) document.body.dataset.subject = me.subject;

    // 目錄：抓 .lesson 內所有帶 id 的 section 的 h2
    var toc = document.querySelector("[data-toc]");
    var sections = Array.prototype.slice.call(document.querySelectorAll(".lesson section[id]"));
    if (toc) {
      toc.innerHTML = "<h4>本頁目錄</h4><ol>" + sections.map(function (s) {
        var h = s.querySelector("h2");
        return '<li><a href="#' + s.id + '">' + (h ? esc(h.textContent) : s.id) + "</a></li>";
      }).join("") + "</ol>";
      var links = toc.querySelectorAll("a");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id); });
          }
        });
      }, { rootMargin: "-30% 0px -60% 0px" });
      sections.forEach(function (s) { io.observe(s); });
    }

    // 上下篇（講義頁位於 lessons/，所以連結要去掉 "lessons/" 前綴）
    var pager = document.querySelector("[data-pager]");
    if (pager && idx >= 0) {
      var prev = LESSONS[idx - 1], next = LESSONS[idx + 1], html = "";
      function href(l) { return l.file.replace(/^lessons\//, ""); }
      if (prev) html += '<a class="prev" href="' + esc(href(prev)) + '"><small>← 上一篇</small>' + esc(prev.title) + "</a>";
      if (next) html += '<a class="next" href="' + esc(href(next)) + '"><small>下一篇 →</small>' + esc(next.title) + "</a>";
      pager.innerHTML = html;
    }

    // 閱讀進度條
    var bar = document.querySelector(".progress");
    if (bar) {
      window.addEventListener("scroll", function () {
        var h = document.documentElement;
        var p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
        bar.style.width = (p * 100).toFixed(1) + "%";
      }, { passive: true });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderIndex();
    renderLesson();
  });
})();
