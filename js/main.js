/* Maidware Project - small, dependency-free site behaviour */
(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "maidware-theme";
  var VALID = [
    "maidware",
    "nightshift", "lampblack", "rinse", "scrub",
    "lavender", "starch", "mop",
    "spotless", "apron", "lace", "suds", "linen", "pail", "sachet"
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
  /* a name we no longer ship is not a choice - drop it and fall back to
     the page's own default, so a row is still ticked in the menu. */
  if (saved && VALID.indexOf(saved) === -1) saved = null;

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
      themeBtn.focus();
    });

    document.addEventListener("click", function (event) {
      if (!themeMenu.hidden && !themeMenu.contains(event.target) && event.target !== themeBtn) {
        closeThemeMenu();
      }
    });
  }

  /* mobile nav */

  var accessBtn = document.getElementById("access-btn");
  var accessMenu = document.getElementById("access-menu");

  function closeAccessMenu() {
    if (!accessMenu || !accessBtn) return;
    accessMenu.hidden = true;
    accessBtn.setAttribute("aria-expanded", "false");
  }

  if (accessBtn && accessMenu) {
    accessBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      if (themeMenu) { themeMenu.hidden = true; if (themeBtn) themeBtn.setAttribute("aria-expanded", "false"); }
      var open = accessMenu.hidden;
      accessMenu.hidden = !open;
      accessBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    accessMenu.addEventListener("click", function (event) {
      var option = event.target.closest ? event.target.closest(".access-option") : null;
      if (!option) return;
      var type = option.getAttribute("data-access");
      var value = option.getAttribute("data-value");
      if (type === "text") {
        document.documentElement.setAttribute("data-a11y-text", value === "normal" ? "" : value);
        try { localStorage.setItem("maidware-text", value === "normal" ? "" : value); } catch (e) {}
        Array.prototype.forEach.call(accessMenu.querySelectorAll('.access-option[data-access="text"]'), function (btn) {
          btn.setAttribute("aria-checked", btn.getAttribute("data-value") === value ? "true" : "false");
        });
      } else if (type === "font") {
        var on = document.documentElement.getAttribute("data-a11y-font") === "plain";
        if (on) {
          document.documentElement.removeAttribute("data-a11y-font");
          try { localStorage.setItem("maidware-font", ""); } catch (e) {}
          option.setAttribute("aria-checked", "false");
        } else {
          document.documentElement.setAttribute("data-a11y-font", "plain");
          try { localStorage.setItem("maidware-font", "plain"); } catch (e) {}
          option.setAttribute("aria-checked", "true");
        }
      } else if (type === "space") {
        var son = document.documentElement.getAttribute("data-a11y-space") === "more";
        if (son) {
          document.documentElement.removeAttribute("data-a11y-space");
          try { localStorage.setItem("maidware-space", ""); } catch (e) {}
          option.setAttribute("aria-checked", "false");
        } else {
          document.documentElement.setAttribute("data-a11y-space", "more");
          try { localStorage.setItem("maidware-space", "more"); } catch (e) {}
          option.setAttribute("aria-checked", "true");
        }
      } else if (type === "links") {
        var lon = document.documentElement.getAttribute("data-a11y-links") === "underline";
        if (lon) {
          document.documentElement.removeAttribute("data-a11y-links");
          try { localStorage.setItem("maidware-links", ""); } catch (e) {}
          option.setAttribute("aria-checked", "false");
        } else {
          document.documentElement.setAttribute("data-a11y-links", "underline");
          try { localStorage.setItem("maidware-links", "underline"); } catch (e) {}
          option.setAttribute("aria-checked", "true");
        }
      }
      closeAccessMenu();
      accessBtn.focus();
    });
    document.addEventListener("click", function (event) {
      if (!accessMenu.hidden && !accessMenu.contains(event.target) && event.target !== accessBtn) {
        closeAccessMenu();
      }
    });
  }

  /* the head script applied the saved settings to <html> before the first
     paint. copy them onto the rows once, here, so the ticks tell the truth
     the first time the menu is opened and not only after it has been used. */
  if (accessMenu) {
    ["text", "font", "space", "links"].forEach(function (kind) {
      var on = document.documentElement.getAttribute("data-a11y-" + kind);
      if (kind === "text" && !on) on = "normal";
      Array.prototype.forEach.call(
        accessMenu.querySelectorAll('.access-option[data-access="' + kind + '"]'),
        function (row) {
          row.setAttribute("aria-checked", row.getAttribute("data-value") === on ? "true" : "false");
        }
      );
    });
  }

  /* keyboard in the menus: arrows walk the rows, home and end jump to the
     ends, enter or space press the row that has focus. tab and escape are
     left alone - they already do the right thing. */

  function wireMenuKeys(menu) {
    var scope = menu && menu.parentNode;
    if (!scope) return;
    scope.addEventListener("keydown", function (event) {
      if (menu.hidden) return;
      var rows = Array.prototype.slice.call(menu.querySelectorAll(".theme-option"));
      if (!rows.length) return;
      var key = event.key;
      var here = rows.indexOf(document.activeElement);
      var to;
      if (key === "ArrowDown") to = here + 1;
      else if (key === "ArrowUp") to = here < 0 ? rows.length - 1 : here - 1;
      else if (key === "Home") to = 0;
      else if (key === "End") to = rows.length - 1;
      else return;
      event.preventDefault();
      if (to >= rows.length) to = 0;
      if (to < 0) to = rows.length - 1;
      rows[to].focus();
    });
  }

  wireMenuKeys(themeMenu);
  wireMenuKeys(accessMenu);

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
    if (accessMenu && !accessMenu.hidden) { closeAccessMenu(); if (accessBtn) accessBtn.focus(); }
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
