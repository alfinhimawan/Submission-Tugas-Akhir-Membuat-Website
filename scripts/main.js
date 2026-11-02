/**
 * TapakKarir.id Main JavaScript
 *
 * Modul:
 * 1. Mobile Navigation Toggle
 * 2. Reading Progress Bar
 * 3. Table of Contents Active State (scroll spy)
 * 4. Smooth Scroll (fallback untuk browser lama)
 */

(function () {
  "use strict";

  /* 1. Mobile Navigation Toggle */
  function initMobileNav() {
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("siteNav");

    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";

      toggle.setAttribute("aria-expanded", String(!isExpanded));
      nav.classList.toggle("nav-open", !isExpanded);

      // Update aria-label sesuai state
      toggle.setAttribute(
        "aria-label",
        isExpanded ? "Buka menu navigasi" : "Tutup menu navigasi",
      );
    });

    // Tutup nav saat klik di luar
    document.addEventListener("click", function (event) {
      const isClickInside =
        nav.contains(event.target) || toggle.contains(event.target);

      if (!isClickInside && nav.classList.contains("nav-open")) {
        nav.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Buka menu navigasi");
      }
    });

    // Tutup nav saat link di dalamnya diklik
    nav.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Buka menu navigasi");
      });
    });

    // Tutup nav saat window di-resize ke ukuran desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 767 && nav.classList.contains("nav-open")) {
        nav.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Buka menu navigasi");
      }
    });
  }

  /* 2. Reading Progress Bar */
  function initReadingProgress() {
    const progressBar = document.getElementById("readingProgress");
    const article = document.querySelector(".site-main");

    if (!progressBar || !article) return;

    // Hanya tampilkan jika user tidak memilih reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    function updateProgress() {
      const articleRect = article.getBoundingClientRect();
      const articleTop = articleRect.top + window.scrollY;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrolled = window.scrollY;

      const start = articleTop - windowHeight * 0.2;
      const end = articleTop + articleHeight - windowHeight * 0.8;
      const range = end - start;

      if (range <= 0) return;

      const progress = Math.min(Math.max((scrolled - start) / range, 0), 1);
      progressBar.style.width = (progress * 100).toFixed(1) + "%";
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  /* 3. Table of Contents Scroll Spy */
  function initTocScrollSpy() {
    const tocLinks = document.querySelectorAll(".toc-item[data-section]");

    if (!tocLinks.length) return;

    // Kumpulkan semua section target
    const sections = [];
    tocLinks.forEach(function (link) {
      const sectionId = link.getAttribute("data-section");
      const headingId = sectionId + "-heading";

      // Cari heading dengan id yang sesuai, fallback ke section id
      const target =
        document.getElementById(headingId) ||
        document.getElementById(sectionId);

      if (target) {
        sections.push({ link, target });
      }
    });

    if (!sections.length) return;

    function getActiveSection() {
      const scrollY = window.scrollY;
      const offset = 120; // tinggi header sticky + sedikit buffer

      let active = null;

      sections.forEach(function (section) {
        const top =
          section.target.getBoundingClientRect().top + scrollY - offset;
        if (scrollY >= top) {
          active = section;
        }
      });

      return active;
    }

    function updateToc() {
      const active = getActiveSection();

      tocLinks.forEach(function (link) {
        link.classList.remove("toc-item--active");
      });

      if (active) {
        active.link.classList.add("toc-item--active");
      }
    }

    window.addEventListener("scroll", updateToc, { passive: true });
    updateToc();
  }

  /* 4. Nav Link Active State berdasarkan Scroll */
  function initNavActiveState() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    if (!navLinks.length) return;

    const sections = [];
    navLinks.forEach(function (link) {
      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (target) {
        sections.push({ link, target });
      }
    });

    function updateNavActive() {
      const scrollY = window.scrollY;
      const offset = 80;

      let active = null;

      sections.forEach(function (section) {
        const top =
          section.target.getBoundingClientRect().top + scrollY - offset;
        if (scrollY >= top) {
          active = section;
        }
      });

      navLinks.forEach(function (link) {
        link.classList.remove("nav-link--active");
        link.removeAttribute("aria-current");
      });

      if (active) {
        active.link.classList.add("nav-link--active");
        active.link.setAttribute("aria-current", "page");
      }
    }

    window.addEventListener("scroll", updateNavActive, { passive: true });
    updateNavActive();
  }

  /* Init Jalankan semua modul saat DOM siap */
  function init() {
    initMobileNav();
    initReadingProgress();
    initTocScrollSpy();
    initNavActiveState();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
