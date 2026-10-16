# security

the site is plain html, css and vanilla javascript, served by github
pages. no server, no database, no build step, no accounts, no forms.

## what it does not do

- nothing is fetched at load: no analytics, no fonts or scripts from
  other hosts, no requests at all. the content security policy meta tag
  in every page enforces it - `default-src 'none'` with only self-hosted
  script, style, font and image sources.
- preferences (theme, language, text size, spacing) live in your
  browser's localstorage. nothing is sent anywhere.
- no personal data in this repo, and forked pages are expected to keep
  it that way.

## limits

- github pages cannot send response headers, so hsts,
  x-content-type-options or frame-ancestors cannot be set here. the csp
  meta covers resource loading, not headers.

## reporting

write to maidwareproject@proton.me. if the problem is exploitable,
please do not open a public issue first. it is a small static site, so
reply times vary, but reports get looked at.

## for forks

- keep it static and self-hosted and the policy keeps working as-is.
- adding a cdn, web fonts or an embed? update the content security
  policy in every page's head or browsers will block the load.
- never paste secrets, tokens or personal paths into pages. pages are
  public forever, and forks inherit that.
