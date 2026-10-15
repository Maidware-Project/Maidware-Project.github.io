#!/usr/bin/env python3
"""check the site: tag balance, local assets, and anchors.

no dependencies. run from the repo root:

    python3 tests/check.py

exits 0 when everything resolves, 1 with a list of problems otherwise.
"""
import os
import sys
from html.parser import HTMLParser

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input",
        "link", "meta", "param", "source", "track", "wbr"}

SKIP = ("http://", "https://", "//", "mailto:", "data:", "javascript:")


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.ids = set()
        self.refs = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if d.get("id"):
            self.ids.add(d["id"])
        for a in ("href", "src"):
            if d.get(a):
                self.refs.append(d[a])
        if tag not in VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()
        elif tag in self.stack:
            self.errors.append("</%s> closes while <%s> is open" % (tag, self.stack[-1]))
            while self.stack and self.stack[-1] != tag:
                self.stack.pop()
            if self.stack:
                self.stack.pop()
        else:
            self.errors.append("stray </%s>" % tag)


def main():
    pages = sorted(f for f in os.listdir(".") if f.endswith(".html"))
    if not pages:
        print("no html files here — run from the repo root")
        return 1

    parsed = {}
    problems = []
    for name in pages:
        page = Page()
        page.feed(open(name, encoding="utf-8").read())
        page.close()
        if page.stack:
            page.errors.append("unclosed: " + ", ".join(page.stack))
        problems.extend("%s: %s" % (name, e) for e in page.errors)
        parsed[name] = page

    for name, page in parsed.items():
        for ref in page.refs:
            if ref.startswith(SKIP):
                continue
            path, _, frag = ref.partition("#")
            target = path or name
            if path and not os.path.exists(path):
                problems.append("%s: missing file %s" % (name, ref))
                continue
            if frag and target in parsed and frag not in parsed[target].ids:
                problems.append("%s: dead anchor %s" % (name, ref))

    if problems:
        print("problems:")
        for p in problems:
            print("  " + p)
        return 1

    print("ok — %d page(s): tags balance, every local asset and anchor resolves"
          % len(pages))
    return 0


if __name__ == "__main__":
    sys.exit(main())
