# Deployment

## GitHub Pages
- Primary deployment target: https://maidware-project.github.io
- Push to `main` to publish (GitHub Pages serves repository content)

## Codeberg Pages (mirror)
- Mirror repo to Codeberg organization
- Enable Pages in repository settings
- Keep mirror updated for fallback availability

## Release/content hygiene
- Review rendered pages locally before pushing
- Run `python3 tests/check.py` when making structural/content-link changes
- Keep redirects for legacy URLs to avoid breaking existing links
