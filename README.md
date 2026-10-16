# maidware.github.io - the website for the maidware project

serving you small forkable linux tools that help. on-demand, cli helpers - shows what they do, can preview with `--check`.

the landing page and the guides for the five maid tools. plain html and
css, no build step - the files in this repo are the site github pages
serves.

category: docs

## quick start

nothing to compile. to look at it locally:

```sh
python3 -m http.server 8000     # from the repo root
# then open http://localhost:8000
```

edit a file, refresh the page. that's the whole workflow.

## layout

```
index.html      home: the rules, the five tools, the guide links
guides.html     per-tool setup, requirements per distro, troubleshooting
help.html       patches over donations - how to help, translations
conduct.html    how the project is run (mirrors CODE_OF_CONDUCT.md)
css/style.css   the layout and every theme, as css variables
js/main.js      theme menu, mobile nav, copy buttons, toc
js/i18n.js      english-only scaffolding for adding a translation
tests/check.py  tag, asset and anchor checker
assets/icons/   favicon
```

## themes

every theme is one block of variables in `css/style.css`. to add one,
copy a block, change the colours, and add a matching button to the theme
menu on each page - the two swatch dots are that theme's background and
accent. `maidware` is the default and the one actually run day to day.

## adding a guide

a guide is a plain section in `guides.html` with an `id`. add a link to it
in the toc list at the top and the scroll highlight in `js/main.js` picks
it up on its own. command samples use `<pre class="code-block">`, with
`<span class="p">` for the prompt and `<span class="c">` for a comment.

## translations

**help us do translations.** we at maidware project need help with
translations, and we want translators to help us. english is the only
language right now, on purpose - `js/i18n.js` holds the recipe: drop a
`js/lang/<code>.js` beside it and add the language to the list. the
switcher stays hidden until there is a second language. the repo would
rather ship none than machine-made strings, so what we want is a
hand-written set - write to maidwareproject@proton.me.

## deploying

push to `main`. github pages rebuilds and serves the repo - nothing to run
and no artifacts to store. the project site url is
https://maidware-project.github.io/maidware.github.io/

## works with the Maid suite

the site documents all five, one category each:

- [MaidShare](https://github.com/Maidware-Project/Maidshare) - files & sharing
- [Maid Runner](https://github.com/Maidware-Project/Maid-Runner) - launcher
- [Maid AU](https://github.com/Maidware-Project/Maid-AU) - system updates
- [Maid BT](https://github.com/Maidware-Project/Maid-BT) - audio
- [Maid Helper](https://github.com/Maidware-Project/Maid-Helper) - repair

## License

MIT - see LICENSE. a Maidware Project, Forkable open source tools served to help
