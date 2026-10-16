# contributing

small, reviewable changes only - one logical change per pull request.
read AGENTS.md first (it applies to humans and AI assistants alike).
maintained by Maidware Project.

## commits

- short lowercase summaries with a prefix: `fix:`, `feat:`, `docs:`,
  `chore:` - e.g. `fix: help page link in the footer`
- sign off every commit (`git commit -s` appends it):
  `Signed-off-by: Your Name <you@example.com>`
  (developer's certificate of origin - proves you may contribute it)

## before opening anything

- `python3 tests/check.py` green on your machine - paste the result in
  the PR (the template asks for it). it checks that tags balance, that
  every local asset exists, and that every `#anchor` lands somewhere.
- CI must be green before review - a green run on your machine is the
  start, not the finish
- the pages open fine from `python3 -m http.server 8000` - click through
  index, guides and help
- check both a light and a dark theme (the picker is in the header); a
  colour change that only works in one theme isn't done
- no personal data anywhere

## know your patch

understand every line you send, assistant-written parts included. if you
can't say what a line does, drop it. "the assistant wrote it" doesn't
answer the question.

it's plain html, css and vanilla js, no build step. if a change needs a
toolchain, that's a reason to skip the change, not to add one.

reviewers here are people, not bots: expect to answer questions about your
change, and don't open one you can't back up. unattended drive-by or bot
PRs get closed.

## issues

say which page, which theme, and what you expected. a screenshot or the
console output helps. "the site is broken" with nothing attached will be
closed with a pointer back here.
