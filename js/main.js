/* Maidware Project - small, dependency-free site behaviour */
(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "maidware-theme";
  var VALID = [
    "maidware", "home", "lamplight", "mallow", "meadow",
    "paper", "harbor", "tokyo", "crt",
    "latte", "frappe", "macchiato", "mocha"
  ];

  /* theme */

  function applyTheme(theme) {
    if (VALID.indexOf(theme) === -1) return;
    root.setAttribute("data-theme", theme);
    var options = document.querySelectorAll(".theme-option");
    Array.prototype.forEach.call(options, function (btn) {
      btn.setAttribute("aria-checked", btn.getAttribute("data-theme") === theme ? "true" : "false");
    });
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* private mode */ }
  }

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* private mode */ }

  applyTheme(saved || root.getAttribute("data-theme") || "maidware");

  var themeBtn = document.getElementById("theme-btn");
  var themeMenu = document.getElementById("theme-menu");

  function closeThemeMenu() {
    if (!themeMenu || !themeBtn) return;
    themeMenu.hidden = true;
    themeBtn.setAttribute("aria-expanded", "false");
  }

  if (themeBtn && themeMenu) {
    themeBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      var open = themeMenu.hidden;
      themeMenu.hidden = !open;
      themeBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    themeMenu.addEventListener("click", function (event) {
      var option = event.target.closest ? event.target.closest(".theme-option") : null;
      if (!option) return;
      applyTheme(option.getAttribute("data-theme"));
      closeThemeMenu();
    });

    document.addEventListener("click", function (event) {
      if (!themeMenu.hidden && !themeMenu.contains(event.target) && event.target !== themeBtn) {
        closeThemeMenu();
      }
    });
  }

  /* mobile nav */

  var navToggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (themeMenu && !themeMenu.hidden) { closeThemeMenu(); themeBtn.focus(); }
    if (nav && nav.classList.contains("open")) {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.focus();
    }
  });

  /* copy buttons */

  var COPY_ICON = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  var CHECK_ICON = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

  function flashCopied(button) {
    button.classList.add("copied");
    button.innerHTML = CHECK_ICON;
    setTimeout(function () {
      button.classList.remove("copied");
      button.innerHTML = COPY_ICON;
    }, 1500);
  }

  function legacyCopy(text, button) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "absolute";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    try { document.execCommand("copy"); flashCopied(button); } catch (e) { /* ignore */ }
    document.body.removeChild(area);
  }

  function copyText(text, button) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { flashCopied(button); },
        function () { legacyCopy(text, button); }
      );
    } else {
      legacyCopy(text, button);
    }
  }

  Array.prototype.forEach.call(document.querySelectorAll(".copy-btn"), function (button) {
    button.addEventListener("click", function () {
      var holder = button.parentNode.querySelector(".code-text");
      if (!holder) return;
      copyText(holder.textContent.replace(/^\$\s*/, "").trim(), button);
    });
  });

  /* live star counts - the page works fine without this */

  var counters = document.querySelectorAll(".stars[data-repo]");

  if (counters.length && window.fetch) {
    Array.prototype.forEach.call(counters, function (el) {
      fetch("https://api.github.com/repos/Maidware-Project/" + el.getAttribute("data-repo"), {
        headers: { Accept: "application/vnd.github+json" }
      })
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (data) {
          if (data && typeof data.stargazers_count === "number") {
            el.querySelector(".star-count").textContent = data.stargazers_count;
          } else {
            el.style.display = "none";
          }
        })
        .catch(function () { el.style.display = "none"; });
    });
  }

  /* mark the current toc entry while scrolling the guides page */

  var tocLinks = document.querySelectorAll(".toc a[href^='#']");

  if (tocLinks.length && "IntersectionObserver" in window) {
    var linkFor = {};
    Array.prototype.forEach.call(tocLinks, function (link) {
      linkFor[link.getAttribute("href").slice(1)] = link;
    });

    var clearHere = function () {
      Array.prototype.forEach.call(tocLinks, function (l) { l.classList.remove("here"); });
    };

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = linkFor[entry.target.id];
          if (!link || !entry.isIntersecting) return;
          clearHere();
          link.classList.add("here");
        });
      },
      { rootMargin: "-90px 0px -65% 0px", threshold: 0 }
    );

    Object.keys(linkFor).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }
})();
