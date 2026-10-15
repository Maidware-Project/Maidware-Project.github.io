# AGENTS.md — maidware.github.io (for AI assistants; humans see README.md)

One maintainer plus friends helping out — keep every change small,
reviewable, and justified. No drive-by refactors, no new dependencies
without asking, and no build step, ever.

Honesty is non-negotiable: say what you actually did versus what you
were asked to do. Never claim a check ran, a page rendered, or a look
was verified unless it truly happened in this session. Report failures
and shortcuts plainly, mark uncertainty as uncertainty, and never hide
a skipped step behind vague wording.

People over AI, always: this project is human-built and human-reviewed.
AI assists, humans decide. Write code, messages, and docs a person can
follow with no assistant involved — clear names, plain language, no
cleverness. The goal is users who understand their system, not users
dependent on one.

Static site for the five Maid tools. Plain html, css and vanilla js —
the files in this repo are the site GitHub Pages serves. Lowercase terse
voice, in the pages and in the docs.

## Layout

- `index.html` home, `guides.html` the per-tool guides, `help.html` how
  to help
- `css/style.css` the whole layout and every theme, as css variables
- `js/main.js` theme menu, mobile nav, copy buttons, star counts, toc
- `js/i18n.js` english-only scaffolding for adding a translation
- `tests/check.py` tag/link checker

## Rules

- No personal data in repo.
- CODE_OF_CONDUCT.md applies to the pages, comments, and docs:
  technical scope, no politics, stay neutral.
- Commit style: short lowercase summaries with a prefix (`fix:`,
  `feat:`, `docs:`, `chore:`), one logical change each. Sign off every
  commit (`git commit -s`); AI-assisted work adds an `Assisted-by:`
  trailer naming the tool.
- No trackers, no analytics, no build step. The only network call is the
  GitHub star count, and the page must work when it fails.
- A nav or footer change touches every page at once; a new theme touches
  the menu on every page. Never leave the pages disagreeing.

## Verify

- `python3 tests/check.py` — tags balance, local assets and anchors resolve
- `node --check js/main.js` and `node --check js/i18n.js`
- `python3 -m http.server 8000` — click through index, guides and help
- Readable in every theme: body and secondary text keep contrast

Before finishing: pass docs/REVIEW.md.
