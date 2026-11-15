# Maidware Project Website

Source for the [Maidware Project](https://maidware-project.github.io/) website (GitHub Pages). This repository contains the landing page, guides, FAQ, performance/contribution/conduct pages, and shared assets for Maidware tools.

- **No build step:** plain HTML/CSS/JS served as-is
- **Static site:** edit files, refresh locally, push to deploy
- **Fallback mirror:** https://codeberg.org/Maidware_Project/Maidware-Project.github.io

## Local preview
```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Repository structure
```text
index.html                Home page
guides/                   Per-tool guides and troubleshooting
faq/                      Frequently asked questions
performance/              Resource/performance notes
contributions/            Contribution info/stats
conduct/                  Code of conduct page
changelog/                Changelog page
css/style.css             Layout and theme variables
js/                       Theme boot, UI behavior, i18n scaffolding
docs/                     Repo/site documentation notes (including wiki pages)
tests/check.py            Basic tag/asset/anchor checks
```

Legacy single-file URLs (e.g. `guides.html`, `faq.html`) are kept as redirects for compatibility.

## Content editing

### Guides
- Main guide content lives in `guides/index.html`
- Each section uses an `id` and is linked from the table of contents
- Code samples use `<pre class="code-block">` with prompt/comment styling conventions used by the site

### Themes
- Themes are defined as CSS variable blocks in `css/style.css`
- Theme names/options are also referenced in `js/main.js` and `js/theme-boot.js`
- Default theme: `maidware`

### Translations
- English-only today by design
- `js/i18n.js` contains scaffolding for adding hand-written translations (`js/lang/<code>.js`)
- Translation contributions should be human-written (see site messaging)

## Deployment
- Push to `main` to deploy via GitHub Pages: https://maidware-project.github.io
- Codeberg Pages can be used as a mirror/backup (enable Pages in Codeberg repo settings)

## Documentation
- Maintainer/site docs (in-repo wiki): [`docs/wiki/`](docs/wiki/Home.md)
- Existing review/design notes: [`DESIGN.md`](DESIGN.md), [`docs/REVIEW.md`](docs/REVIEW.md)

## Related Maidware projects
- [Maid BT](https://github.com/Maidware-Project/Maid-BT)
- [Maid Runner](https://github.com/Maidware-Project/Maid-Runner)
- [Maidshare](https://github.com/Maidware-Project/Maidshare)
- [Maid Suite](https://github.com/Maidware-Project/Maid-Suite)

## Contributing
See [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## License
GPL-3.0-or-later. See [`LICENSE`](LICENSE) and [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md).
