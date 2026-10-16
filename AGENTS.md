# AGENTS.md - maidware.github.io (for AI assistants; humans see README.md)

One maintainer plus a few friends helping out. Keep changes small enough
to review, skip refactors nobody asked for, and ask before adding a
dependency. There is no build step and there won't be one.

Say what you actually did, not what you were asked to do. If a check
didn't run this session, don't write that it passed. Failures and
shortcuts are worth writing down as they are.

The assistant helps, a person decides. Write so somebody can follow it
with no assistant around: plain names, plain words, nothing clever.

Static site for the five Maid tools. Plain html, css and vanilla js - the
files here are what GitHub Pages serves. Lowercase terse voice, in the
pages and in the docs.

## Layout

- `index.html` home, `guides.html` the per-tool guides, `help.html` how
  to help, `conduct.html` how the project is run
- `css/style.css` the whole layout and every theme, as css variables
- `js/main.js` theme menu, mobile nav, copy buttons, toc
- `js/i18n.js` english-only scaffolding for adding a translation
- `tests/check.py` tag/link checker

## Rules

- No personal data in repo.
- CODE_OF_CONDUCT.md applies to the pages, comments, and docs:
  technical scope, no politics, stay neutral.
- Commit style: short lowercase summaries with a prefix (`fix:`,
  `feat:`, `docs:`, `chore:`), one logical change each. Sign off every
  commit (`git commit -s`).
- No trackers, no analytics, no build step, no network calls at all.
- A nav or footer change touches every page at once; a new theme touches
  the menu on every page. Never leave the pages disagreeing.

## Verify

- `python3 tests/check.py` - tags balance, local assets and anchors resolve
- `node --check js/main.js` and `node --check js/i18n.js`
- `python3 -m http.server 8000` - click through index, guides and help
- Readable in every theme: body and secondary text keep contrast

Before finishing: pass docs/REVIEW.md.
