#!/usr/bin/env python3
"""Check the rendered production homepage contract."""

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else "public")
PAGE = ROOT / "index.html"
REPO = Path(__file__).resolve().parents[1]


class Homepage(HTMLParser):
    def __init__(self):
        super().__init__()
        self.base = None
        self.canonical = None
        self.h1 = []
        self.hrefs = []
        self.assets = []
        self.responsive_art = []
        self.meta = []
        self.console_links = []
        self.classes = set()
        self.theme_choices = set()
        self.workflow_tabs = False
        self.workflow_section = False
        self._in_h1 = False
        self._h1_text = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.classes.update((attrs.get("class") or "").split())
        if attrs.get("data-theme-choice"):
            self.theme_choices.add(attrs["data-theme-choice"])
        if "cl-workflow-tabs" in (attrs.get("class") or "").split():
            self.workflow_tabs = True
        if "cl-workflows" in (attrs.get("class") or "").split():
            self.workflow_section = True
        if tag == "base":
            self.base = attrs.get("href")
        elif tag == "link":
            rel = (attrs.get("rel") or "").lower()
            href = attrs.get("href")
            if rel == "canonical":
                self.canonical = href
            if href:
                self.hrefs.append(href)
                if rel in {"stylesheet", "preload", "icon"}:
                    self.assets.append(href)
        elif tag == "meta":
            self.meta.append(attrs)
        elif tag in {"script", "img", "source"}:
            if attrs.get("src"):
                self.assets.append(attrs["src"])
            if attrs.get("srcset"):
                self.assets.extend(attrs["srcset"].split(","))
            if tag == "img" and "/images/grounded/" in attrs.get("src", ""):
                self.responsive_art.append(attrs)
        elif tag == "a":
            href = attrs.get("href")
            if href:
                self.hrefs.append(href)
                if href == self.console_url:
                    self.console_links.append(href)
        if tag == "h1":
            self._in_h1 = True
            self._h1_text = []

    def handle_endtag(self, tag):
        if tag == "h1" and self._in_h1:
            self.h1.append("".join(self._h1_text))
            self._in_h1 = False

    def handle_data(self, data):
        if self._in_h1:
            self._h1_text.append(data)


def normalize(value):
    return " ".join(value.split())


def configured_console_url():
    text = (REPO / "hugo.toml").read_text()
    match = re.search(r"^console_url\s*=\s*\"([^\"]+)\"", text, re.MULTILINE)
    if not match:
        raise AssertionError("hugo.toml does not define params.brand.console_url")
    return match.group(1)


if not PAGE.exists():
    raise SystemExit(f"missing rendered homepage: {PAGE}")

parser = Homepage()
parser.console_url = configured_console_url()
parser.feed(PAGE.read_text())
errors = []

if len(parser.h1) != 1:
    errors.append(f"expected one homepage h1, found {len(parser.h1)}")
elif normalize(parser.h1[0]) != "Give intelligence something to build on.":
    errors.append(f"unexpected homepage h1: {normalize(parser.h1[0])!r}")

if not parser.base:
    errors.append("homepage is missing a base URL")
if not parser.canonical:
    errors.append("homepage is missing a canonical URL")
elif parser.canonical != parser.base:
    errors.append(f"canonical {parser.canonical!r} does not match base {parser.base!r}")

robots = [m.get("content", "").lower() for m in parser.meta if m.get("name", "").lower() == "robots"]
if any("noindex" in value for value in robots):
    errors.append("production homepage must not contain robots noindex")

if not parser.console_links:
    errors.append(f"homepage is missing configured console link {parser.console_url!r}")

if "cl-theme-picker" not in parser.classes:
    errors.append("homepage is missing the theme picker")
if parser.theme_choices != {"light", "dark", "system"}:
    errors.append(f"homepage theme choices are {sorted(parser.theme_choices)!r}")
if not parser.workflow_section:
    errors.append("homepage is missing the workflow section")
if not parser.workflow_tabs:
    errors.append("homepage is missing workflow tabs")

if any("/explorations/" in href for href in parser.hrefs):
    errors.append("homepage contains an /explorations/ link")

if len(parser.responsive_art) != 6:
    errors.append("expected two hero images and four detail/base glow images")
for art in parser.responsive_art:
    candidates = [candidate.strip().split() for candidate in art.get("srcset", "").split(",")]
    if [c[-1] for c in candidates if c] != ["960w", "1536w", "2560w", "3840w", "6144w"]:
        errors.append(f"missing responsive image sizes: {art['src']}")
    if not art.get("sizes"):
        errors.append(f"missing responsive layout size: {art['src']}")

for raw in parser.assets:
    asset = raw.strip().split()[0]
    parsed = urlsplit(asset)
    if parsed.scheme or parsed.netloc:
        continue
    target = ROOT / parsed.path.lstrip("/")
    if not target.exists():
        errors.append(f"homepage references missing local asset {asset}")

if errors:
    raise SystemExit("\n".join(sorted(set(errors))))

print("PASS: rendered homepage contract")
