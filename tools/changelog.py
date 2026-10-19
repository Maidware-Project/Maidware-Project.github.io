#!/usr/bin/env python3
"""generate changelog entries from the five tool repos, write changelog.html.
reads ../<repo>/CHANGELOG.md; if missing, falls back to recent git log.
dates come from git blame on changelog headings, or commit author date.
writes only the region between <!-- changelog:start --> and <!-- changelog:end -->.
"""
import os
import re
import sys
import subprocess
from html import escape

REPOS = [
    ("Maidshare", "Maidshare"),
    ("Maid Runner", "Maid-Runner"),
    ("Maid AU", "Maid-AU"),
    ("Maid BT", "Maid-BT"),
    ("MHE/Maid-Helper", "Maid-Helper"),
]
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BASE = os.path.abspath(os.path.join(ROOT, ".."))
PAGE = os.path.join(ROOT, "changelog", "index.html")

def run_git(cwd, *args):
    try:
        p = subprocess.run(["git"] + list(args), cwd=cwd, capture_output=True, text=True, check=False)
        return p.stdout.rstrip("\n")
    except Exception:
        return ""

def heading_date(repo, heading):
    # try to find the line in CHANGELOG.md and blame
    cl = os.path.join(BASE, repo, "CHANGELOG.md")
    if not os.path.exists(cl):
        return None
    with open(cl, encoding="utf-8", errors="replace") as f:
        lines = f.readlines()
    for i, l in enumerate(lines, start=1):
        if l.strip().startswith("##") and heading in l:
            out = run_git(os.path.join(BASE, repo), "blame", "-L", f"{i},{i}", "--date=short", "--porcelain", "CHANGELOG.md")
            m = re.search(r"committer-time\s+(\d+)", out)
            if m:
                import datetime
                d = datetime.datetime.fromtimestamp(int(m.group(1)))
                return d.strftime("%Y-%m-%d")
            m2 = re.search(r"author-time\s+(\d+)", out)
            if m2:
                import datetime
                d = datetime.datetime.fromtimestamp(int(m2.group(1)))
                return d.strftime("%Y-%m-%d")
            break
    # fallback: first commit touching file
    out = run_git(os.path.join(BASE, repo), "log", "--format=%as", "--reverse", "--", "CHANGELOG.md")
    if out:
        return out.splitlines()[0]
    return run_git(os.path.join(BASE, repo), "log", "--format=%as", "-1", "--", "CHANGELOG.md")

def read_cl(repo):
    cl = os.path.join(BASE, repo, "CHANGELOG.md")
    if not os.path.exists(cl):
        return None
    with open(cl, encoding="utf-8", errors="replace") as f:
        text = f.read()
    return text

def entries_for_repo(repo):
    html = []
    name, slug = [(r, s) for r, s in REPOS if r == repo][0] if any(r == repo for r,s in REPOS) else (repo, repo)
    text = read_cl(repo)
    if text:
        # split into ## headings
        blocks = re.split(r"\n##\s+", "\n" + text)
        for b in blocks[1:]:
            head = b.splitlines()[0].strip().replace("##", "").strip()
            date = heading_date(repo, head) or ""
            body = "\n".join(b.splitlines()[1:]).strip()
            html.append("<div class=\"rule\"><h3>%s <small style=\"font-weight:normal;\">%s</small></h3>" % (escape(head), escape(date)))
            if body:
                html.append("<p>%s</p>" % escape(body).replace("\n", "<br>"))
            html.append("</div>")
    else:
        out = run_git(os.path.join(BASE, repo), "log", "--format=%as: %s", "-10")
        if out:
            html.append("<div class=\"rule\"><h3>recent commits</h3><ul>")
            for line in out.splitlines():
                html.append("<li>%s</li>" % escape(line))
            html.append("</ul></div>")
    if not html:
        html.append("<div class=\"rule\"><h3>no entries</h3></div>")
    return f"<h2><a href=\"https://github.com/Maidware-Project/{slug}\">{escape(repo)}</a></h2>\n" + "\n".join(html)

def render():
    parts = []
    for repo, slug in REPOS:
        parts.append(entries_for_repo(repo))
    return "\n".join(parts)

def main():
    os.makedirs(os.path.dirname(PAGE), exist_ok=True)
    entries = render()
    with open(PAGE, encoding="utf-8") as f:
        page = f.read()
    start = "<!-- changelog:start -->"
    end = "<!-- changelog:end -->"
    i = page.find(start)
    j = page.find(end)
    if i == -1 or j == -1 or j <= i:
        print("markers not found")
        return 1
    new = page[:i + len(start)] + "\n" + entries + "\n    " + page[j:]
    with open(PAGE, "w", encoding="utf-8") as f:
        f.write(new)
    print("ok")
    return 0

if __name__ == "__main__":
    sys.exit(main())
