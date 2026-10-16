# AGENTS.md - Maidware-Project.github.io (for AI assistants; humans see README.md)

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

## What you can't do here

- No build step, no CI and no staging. Pushing `main` publishes the site
  as it stands.
- Nothing is fetched at load: no api, no counters, no analytics.
- The pages read with javascript off. Something that needs js to show is
  broken for somebody.
- No browser test harness. Looking at a page means rendering it and
  reading the pixels.

## Layout

- `index.html` home, `guides.html` the per-tool guides,
  `performance.html` what the tools cost to run, `faq.html` short answers,
  `contributions.html` how to help, `conduct.html` how the project is run
- `css/style.css` the whole layout and every theme, as css variables
- `js/main.js` theme menu, mobile nav, copy buttons, toc
- `js/theme-boot.js` stored theme and settings, loaded in every page's head
- `js/i18n.js` english-only scaffolding for adding a translation
- `tests/check.py` tag/link checker

## Rules

- No personal data in repo.
- CODE_OF_CONDUCT.md applies to the pages, comments, and docs:
  technical scope, no politics, stay neutral.
- Commit style: short lowercase summaries with a prefix (`fix:`,
  `feat:`, `docs:`, `chore:`), one logical change each. Sign off every
  commit - the trailer is exactly `Signed-off-by: visa`, no email.
- No trackers, no analytics, no build step, no network calls at all.
- A nav or footer change touches every page at once; a new theme touches
  the menu on every page, `js/main.js`, and `js/theme-boot.js`, which
  every page loads in its head and which applies the stored theme.
  Never leave the pages disagreeing.

## Theme names live in five places

One theme name, five files. Change one and not the others and the menu
starts lying about what is selected:

- the palette block in `css/style.css`
- the `.theme-option` row in the menu, on all six pages
- the `VALID` list in `js/main.js`
- the `T` list in `js/theme-boot.js`
- the name lists in `README.md` and this file

`maidware` sits first in the menu and stays the default. Art added later
uses its palette: tile `#1a1b26`, edge `#454654`, glyph `#5cb9ae`.

## Never

- Never push. The maintainer pushes; commits stay local until asked.
- Never report a check or a render you did not run this session.
- Never add a dependency, a build step, a tracker, or a fetch at load.
- Never add an image asset. The site is text by choice.

## Boundaries (do not touch)

- The palette values in `css/style.css`. Body, muted and accent contrast
  is verified per theme; a changed hex needs the contrast worked out
  again (AA is 4.5).
- `tests/check.py`. It is the only gate this repo has.
- Pages, wording or layout you were not asked about.

## Verify

- `python3 tests/check.py` - tags balance, local assets and anchors resolve
- `node --check js/main.js`, `node --check js/i18n.js` and
  `node --check js/theme-boot.js`
- readable in every theme: body and secondary text keep contrast
- a visual change gets rendered and looked at. Render in headless
  librewolf with a fresh profile each time - the page writes its theme to
  localStorage, so one render bleeds into the next.

## Making a change

1. `git status -sb` first. A commit or a sync can land while you work,
   and amending something already pushed leaves duplicate commits.
2. Make the smallest diff that solves the stated problem.
3. Run `tests/check.py` and both `node --check`s.
4. If it shows on a page, render it and look at it.
5. Pass `docs/REVIEW.md`, then commit with a sign-off. Do not push.

## References

- `README.md` - what the site is, how it deploys, how to translate
- `docs/REVIEW.md` - the checklist to pass before a change ships
- `CONTRIBUTING.md` - how to take part
- `CODE_OF_CONDUCT.md` - scope, and what stays out of the repo
- `css/style.css` - every theme, as variables
