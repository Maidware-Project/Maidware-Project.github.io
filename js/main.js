/* Maidware Project - small, dependency-free site behaviour */
(function () {
  "use strict";

  var root = document.documentElement;

  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  function save(key, value) {
    try {
      if (value) localStorage.setItem(key, value);
      else localStorage.removeItem(key);
    } catch (e) { /* private mode */ }
  }

  /* a screen reader can't see a tick move. say what changed, in the page's
     own words - the menu headings and row labels on screen are the words. */
  var status = document.getElementById("sr-status");
  function say(message) {
    if (!status) return;
    status.textContent = "";
    setTimeout(function () { status.textContent = message; }, 60);
  }

  /* ------------------------------------------------------------------ menus
     one controller for the theme and accessibility menus. the language menu
     belongs to i18n.js and is left alone on purpose. */

  var menus = [];

  /* role="menu" may only own items and groups, so each heading <p> gets the
     rows under it wrapped in a labelled group. done here so no page's markup
     has to change. */
  function labelGroups(menu) {
    var group = null;
    var n = 0;
    each(Array.prototype.slice.call(menu.children), function (el) {
      if (el.tagName === "P") {
        n += 1;
        if (!el.id) el.id = menu.id + "-heading-" + n;
        el.setAttribute("role", "presentation");
        group = document.createElement("div");
        group.setAttribute("role", "group");
        group.setAttribute("aria-labelledby", el.id);
        menu.insertBefore(group, el.nextSibling);
      } else if (group) {
        group.appendChild(el);
      }
    });
  }

  function rowsOf(m) {
    return Array.prototype.slice.call(m.menu.querySelectorAll(".theme-option"));
  }

  function closeMenu(m, refocus) {
    if (m.menu.hidden) return;
    m.menu.hidden = true;
    m.btn.setAttribute("aria-expanded", "false");
    if (refocus) m.btn.focus();
  }

  function closeAll(except) {
    menus.forEach(function (m) { if (m !== except) closeMenu(m); });
  }

  function openMenu(m, focusRow) {
    closeAll(m);
    m.menu.hidden = false;
    m.btn.setAttribute("aria-expanded", "true");
    if (focusRow) {
      var start = m.menu.querySelector('.theme-option[aria-checked="true"]') || rowsOf(m)[0];
      if (start) start.focus();
    }
  }

  function addMenu(btnId, menuId) {
    var btn = document.getElementById(btnId);
    var menu = document.getElementById(menuId);
    if (!btn || !menu) return null;
    var m = { btn: btn, menu: menu, wrap: btn.parentNode };
    labelGroups(menu);
    menus.push(m);

    /* a keyboard click (detail 0) lands on a row; a mouse click doesn't, so
       no focus ring flashes up for pointer users. */
    btn.addEventListener("click", function (event) {
      if (m.menu.hidden) openMenu(m, event.detail === 0);
      else closeMenu(m);
    });

    /* arrows walk the rows, home and end jump to the ends. escape is handled
       once for the whole page below; tab closes the menu (focusout). */
    m.wrap.addEventListener("keydown", function (event) {
      var key = event.key;
      if (m.menu.hidden) {
        if (key === "ArrowDown" && event.target === m.btn) {
          event.preventDefault();
          openMenu(m, true);
        }
        return;
      }
      var rows = rowsOf(m);
      if (!rows.length) return;
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

    /* tabbing out of an open menu closes it instead of leaving it hanging */
    m.wrap.addEventListener("focusout", function (event) {
      var next = event.relatedTarget;
      if (next && !m.wrap.contains(next)) closeMenu(m);
    });

    return m;
  }

  /* outside click: no stopPropagation anywhere, so other menus (the language
     one in i18n.js) still see the click and can close themselves. */
  document.addEventListener("click", function (event) {
    menus.forEach(function (m) {
      if (!m.menu.hidden && !m.wrap.contains(event.target)) closeMenu(m);
    });
  });

  /* ------------------------------------------------------------------ theme */

  var THEME_KEY = "maidware-theme";
  var themeM = addMenu("theme-btn", "theme-menu");

  /* the menu is the list of themes, so there is no second list to keep in
     sync here. (theme-boot.js still needs its own: it runs before the DOM.) */
  var THEMES = themeM ? rowsOf(themeM).map(function (row) {
    return row.getAttribute("data-theme");
  }) : [];

  function applyTheme(theme, persist) {
    if (THEMES.indexOf(theme) === -1) return;
    root.setAttribute("data-theme", theme);
    if (themeM) {
      rowsOf(themeM).forEach(function (row) {
        row.setAttribute("aria-checked", row.getAttribute("data-theme") === theme ? "true" : "false");
      });
    }
    /* only a real choice is stored, so a first visit doesn't pin the default
       and a later change of default still reaches people who never picked. */
    if (persist) save(THEME_KEY, theme);
  }

  var savedTheme = null;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (e) { /* private mode */ }
  /* a name we no longer ship is not a choice - fall back to the page's own */
  if (savedTheme && THEMES.indexOf(savedTheme) === -1) savedTheme = null;
  applyTheme(savedTheme || root.getAttribute("data-theme") || "maidware", false);

  if (themeM) {
    themeM.menu.addEventListener("click", function (event) {
      var option = event.target.closest ? event.target.closest(".theme-option") : null;
      if (!option) return;
      applyTheme(option.getAttribute("data-theme"), true);
      say(themeM.btn.textContent.trim() + ": " + option.textContent.trim());
      closeMenu(themeM, true);
    });
  }

  /* ---------------------------------------------------------- accessibility
     four settings, one table. theme-boot.js reads the same storage keys
     before first paint, so keep the keys and attributes in step with it. */

  var ACCESS = {
    text:  { attr: "data-a11y-text",  key: "maidware-text",  radio: true },
    font:  { attr: "data-a11y-font",  key: "maidware-font" },
    space: { attr: "data-a11y-space", key: "maidware-space" },
    links: { attr: "data-a11y-links", key: "maidware-links" }
  };

  function accessValue(type) {
    return root.getAttribute(ACCESS[type].attr) || (ACCESS[type].radio ? "normal" : "");
  }

  /* the head script applied the saved settings to <html> before first paint;
     copy them onto the rows so the ticks are true the first time the menu
     opens, not only after it has been used. */
  function syncAccess(m) {
    each(m.menu.querySelectorAll(".access-option"), function (row) {
      var type = row.getAttribute("data-access");
      if (!ACCESS[type]) return;
      row.setAttribute("aria-checked", row.getAttribute("data-value") === accessValue(type) ? "true" : "false");
    });
  }

  var accessM = addMenu("access-btn", "access-menu");

  if (accessM) {
    syncAccess(accessM);

    accessM.menu.addEventListener("click", function (event) {
      var option = event.target.closest ? event.target.closest(".access-option") : null;
      if (!option) return;
      var def = ACCESS[option.getAttribute("data-access")];
      if (!def) return;

      var value = option.getAttribute("data-value");
      var next;
      if (def.radio) next = value === "normal" ? "" : value;
      else next = root.getAttribute(def.attr) === value ? "" : value;

      if (next) root.setAttribute(def.attr, next);
      else root.removeAttribute(def.attr);
      save(def.key, next);
      syncAccess(accessM);

      var group = option.closest('[role="group"]');
      var heading = group ? document.getElementById(group.getAttribute("aria-labelledby")) : null;
      var prefix = heading ? heading.textContent.trim() + ": " : "";
      var label = option.textContent.trim();
      say(def.radio
        ? prefix + label
        : label + ": " + (option.getAttribute("aria-checked") === "true" ? "on" : "off"));

      closeMenu(accessM, true);
    });
  }

  /* ------------------------------------------------------------- mobile nav */

  var navToggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");

  function navOpen() { return !!(nav && nav.classList.contains("open")); }

  function closeNav(refocus) {
    if (!nav || !navToggle) return;
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    if (refocus) navToggle.focus();
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      closeAll();
      var open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") closeNav(false);
    });
  }

  /* tuck the header away while the reader scrolls down, bring it back on
     the way up, near the top, when focus lands inside it, or while one of
     its menus is open. */
  var header = document.querySelector(".site-header");

  if (header) {
    var lastY = window.scrollY;
    var revealHeader = function () { header.classList.remove("tucked"); };
    header.addEventListener("focusin", revealHeader);
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      var menuOpen = navOpen() || menus.some(function (m) { return !m.menu.hidden; });
      if (y < lastY || y < 90 || menuOpen) revealHeader();
      else if (y > lastY && y > 140) header.classList.add("tucked");
      lastY = y;
    }, { passive: true });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    menus.forEach(function (m) { closeMenu(m, true); });
    if (navOpen()) closeNav(true);
  });

  /* ------------------------------------------------------------ copy buttons
     the homepage has its own .code boxes with a button already in the markup.
     every plain code block (all of the install commands on the guides page)
     gets the same button here, so no page has to carry it by hand. */

  var COPY_ICON = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  var CHECK_ICON = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

  function addCopyButtons() {
    each(document.querySelectorAll("pre.code-block"), function (pre) {
      if (pre.parentNode.classList.contains("code-wrap")) return;
      var wrap = document.createElement("div");
      wrap.className = "code-wrap";
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      var button = document.createElement("button");
      button.type = "button";
      button.className = "copy-btn";
      button.setAttribute("aria-label", "copy");
      button.innerHTML = COPY_ICON;
      wrap.appendChild(button);
    });
  }

  function flashCopied(button) {
    button.classList.add("copied");
    button.innerHTML = CHECK_ICON;
    say("copied");
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

  addCopyButtons();

  each(document.querySelectorAll(".copy-btn"), function (button) {
    button.addEventListener("click", function () {
      var scope = button.parentNode;
      var source = scope.querySelector(".code-text") || scope.querySelector("pre");
      if (!source) return;
      copyText(source.textContent.replace(/^\$\s*/, "").trim(), button);
    });
  });

  /* ------------------------------------------------------------------- toc
     mark the current entry while scrolling the guides page */

  var tocLinks = document.querySelectorAll(".toc a[href^='#']");

  if (tocLinks.length && "IntersectionObserver" in window) {
    var linkFor = {};
    each(tocLinks, function (link) {
      linkFor[link.getAttribute("href").slice(1)] = link;
    });

    var clearHere = function () {
      each(tocLinks, function (l) { l.classList.remove("here"); });
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
