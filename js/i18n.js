/* Maidware Project - translations.

   english is the page itself. the text in the html is the source of truth,
   and the data-i18n keys on elements are just handles so a translation can
   replace them later. one copy of the english, not two.

   to add a language:
     1. write js/lang/<code>.js that sets
          window.MAIDWARE_I18N.<code> = { "hero.title": "…", "nav.home": "…" }
        use only the keys you have - anything missing falls back to the html.
     2. add it to LANGS below with its native name, and dir: "rtl" for
        hebrew or arabic, otherwise "ltr".

   nothing else needs changing. the switcher hides itself while there's only
   one language, and reappears on its own the moment LANGS has a second entry.

   there are no translations in the repo right now. we'd rather ship none than
   ship machine-made ones that read badly to the people they're for. if you
   speak one of these languages, a hand-written set of strings is welcome. */

(function () {
  "use strict";

  var LANGS = [
    { code: "en", name: "english", dir: "ltr" }
  ];

  window.MAIDWARE_I18N = window.MAIDWARE_I18N || {};
  window.MAIDWARE_LANGS = LANGS;

  /* accessibility defaults */
  try {
    var aT = localStorage.getItem("maidware-text");
    if (aT) document.documentElement.setAttribute("data-a11y-text", aT);
    if (localStorage.getItem("maidware-font") === "plain") document.documentElement.setAttribute("data-a11y-font", "plain");
    if (localStorage.getItem("maidware-space") === "more") document.documentElement.setAttribute("data-a11y-space", "more");
    if (localStorage.getItem("maidware-links") === "underline") document.documentElement.setAttribute("data-a11y-links", "underline");
  } catch (e) {}

  /* the english currently in the html, captured once so we can get back to it */

  var textEls = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  var textBase = textEls.map(function (el) { return el.innerHTML; });

  var attrEls = [];
  var attrBase = [];
  Array.prototype.forEach.call(document.querySelectorAll("[data-i18n-attr]"), function (el) {
    el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
      var bits = pair.split(":");
      var attr = bits[0].trim();
      attrEls.push({ el: el, attr: attr, key: (bits[1] || "").trim() });
      attrBase.push(el.getAttribute(attr));
    });
  });

  function dict(code) {
    return window.MAIDWARE_I18N[code] || {};
  }

  function apply(code) {
    var strings = dict(code);
    var meta = LANGS.filter(function (l) { return l.code === code; })[0] || LANGS[0];

    textEls.forEach(function (el, i) {
      var value = strings[el.getAttribute("data-i18n")];
      el.innerHTML = typeof value === "string" ? value : textBase[i];
    });

    attrEls.forEach(function (item, i) {
      var value = strings[item.key];
      item.el.setAttribute(item.attr, typeof value === "string" ? value : (attrBase[i] || ""));
    });

    document.documentElement.lang = code;
    document.documentElement.dir = meta.dir;
    if (langLabel) langLabel.textContent = meta.name;

    Array.prototype.forEach.call(document.querySelectorAll(".lang-option"), function (btn) {
      btn.setAttribute("aria-checked", btn.getAttribute("data-lang") === code ? "true" : "false");
    });

    try { localStorage.setItem(STORAGE, code); } catch (e) { /* private mode */ }
  }

  function load(code, done) {
    if (code === "en" || window.MAIDWARE_I18N[code]) { done(); return; }
    var script = document.createElement("script");
    script.src = "js/lang/" + code + ".js";
    script.onload = done;
    script.onerror = done;
    document.head.appendChild(script);
  }

  var langBtn = document.getElementById("lang-btn");
  var langMenu = document.getElementById("lang-menu");
  var langLabel = document.getElementById("lang-label");
  var STORAGE = "maidware-lang";

  /* one language means no switcher to show. leave the html in english. */

  if (!langBtn || !langMenu || LANGS.length < 2) {
    if (langBtn && langBtn.parentNode) langBtn.parentNode.hidden = true;
    return;
  }

  langBtn.parentNode.hidden = false;

  var label = document.createElement("p");
  label.className = "menu-label";
  label.textContent = "language";
  langMenu.appendChild(label);

  LANGS.forEach(function (l) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-option lang-option";
    btn.setAttribute("role", "menuitemradio");
    btn.setAttribute("data-lang", l.code);
    btn.setAttribute("aria-checked", "false");
    btn.textContent = l.name;
    btn.addEventListener("click", function () {
      load(l.code, function () { apply(l.code); closeMenus(); });
    });
    langMenu.appendChild(btn);
  });

  function closeMenus() {
    langMenu.hidden = true;
    langBtn.setAttribute("aria-expanded", "false");
    var themeMenu = document.getElementById("theme-menu");
    var themeBtn = document.getElementById("theme-btn");
    if (themeMenu) themeMenu.hidden = true;
    if (themeBtn) themeBtn.setAttribute("aria-expanded", "false");
  }

  langBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    var themeMenu = document.getElementById("theme-menu");
    if (themeMenu) themeMenu.hidden = true;
    var open = langMenu.hidden;
    langMenu.hidden = !open;
    langBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  document.addEventListener("click", function (event) {
    if (langMenu.hidden) return;
    if (!langMenu.contains(event.target) && event.target !== langBtn) {
      langMenu.hidden = true;
      langBtn.setAttribute("aria-expanded", "false");
    }
  });

  var saved = null;
  try { saved = localStorage.getItem(STORAGE); } catch (e) { /* private mode */ }

  var initial = saved;
  if (!initial) {
    var want = (navigator.language || "en").slice(0, 2).toLowerCase();
    var match = LANGS.filter(function (l) { return l.code === want; })[0];
    initial = match ? match.code : "en";
  }

  window.MAIDWARE_SET_LANG = function (code) { load(code, function () { apply(code); }); };

  load(initial, function () { apply(initial); });
})();
