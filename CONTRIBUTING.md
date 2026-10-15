# contributing

small, reviewable changes only — one logical change per pull request.
read AGENTS.md first (it applies to humans and AI assistants alike).
maintained by Maidware Project.

## commits

- short lowercase summaries with a prefix: `fix:`, `feat:`, `docs:`,
  `chore:` — e.g. `fix: help page link in the footer`
- sign off every commit (`git commit -s` appends it):
  `Signed-off-by: Your Name <you@example.com>`
  (developer's certificate of origin — proves you may contribute it)
- AI-assisted work gets an `Assisted-by:` trailer naming the tool,
  e.g. `Assisted-by: opencode (muse-spark)`. the kernel requires this;
  so do we. never claim a check ran that didn't.

## before opening anything

- `python3 tests/check.py` green on your machine — paste the result in
  the PR (the template asks for it). it checks that tags balance, that
  every local asset exists, and that every `#anchor` lands somewhere.
- the pages open fine from `python3 -m http.server 8000` — click through
  index, guides and help
- check both a light and a dark theme (the picker is in the header); a
  colour change that only works in one theme isn't done
- no personal data anywhere

## know your patch

- understand every line you submit — including AI-written parts. if you
  can't explain what a line does, don't send it. "the AI wrote it" is
  never an explanation.
- it's plain html, css and vanilla js with no build step — if a change
  needs a toolchain, that's a reason to say no, not a reason to add one.

## issues

say which page, which theme, and what you expected. a screenshot or the
console output helps. "the site is broken" with nothing attached will be
closed with a pointer back here.
