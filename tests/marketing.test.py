#!/usr/bin/env python3
"""Check the rendered marketing-page and docs-shell contracts."""

import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else "public")
MARKETING = ("platform", "developers", "solutions", "open-source", "company", "pricing", "contact")


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.base = None
        self.canonical = None
        self.body_classes = set()
        self.classes = set()
        self.hrefs = []
        self.assets = []
        self.scripts = []
        self.meta = []
        self.headings = []
        self.ids = set()
        self.details = 0
        self.forms = []
        self.controls = []
        self.recaptcha = None
        self._heading = None
        self._heading_text = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        classes = set((attrs.get("class") or "").split())
        self.classes.update(classes)
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        if attrs.get("id") == "contact-recaptcha":
            self.recaptcha = attrs
        if tag == "body":
            self.body_classes.update(classes)
        if tag == "base":
            self.base = attrs.get("href")
        elif tag == "meta":
            self.meta.append(attrs)
        elif tag == "link":
            href = attrs.get("href")
            if href:
                self.hrefs.append(href)
                if (attrs.get("rel") or "").lower() in {"stylesheet", "icon", "preload"}:
                    self.assets.append(href)
                if (attrs.get("rel") or "").lower() == "canonical":
                    self.canonical = href
        elif tag == "script":
            src = attrs.get("src")
            if src:
                self.scripts.append(src)
                self.assets.append(src)
        elif tag in {"img", "source"}:
            src = attrs.get("src") or attrs.get("srcset")
            if src:
                self.assets.extend(src.split(",") if tag == "source" else [src])
        elif tag == "a":
            href = attrs.get("href")
            if href:
                self.hrefs.append(href)
        elif tag == "h1":
            self._heading = "h1"
            self._heading_text = []
        elif tag == "details":
            self.details += 1
        elif tag == "form":
            self.forms.append(attrs)
        elif tag in {"input", "textarea", "button", "select"}:
            self.controls.append((tag, attrs))

    def handle_endtag(self, tag):
        if tag == self._heading:
            self.headings.append((tag, " ".join("".join(self._heading_text).split())))
            self._heading = None

    def handle_data(self, data):
        if self._heading:
            self._heading_text.append(data)


def parse(path):
    page = Page()
    page.feed(path.read_text())
    return page


def local_assets_exist(page, path, errors):
    for raw in page.assets:
        asset = raw.strip().split()[0]
        parsed = urlsplit(asset)
        if parsed.scheme or parsed.netloc:
            continue
        target = ROOT / parsed.path.lstrip("/")
        if not target.exists():
            errors.append(f"{path}: missing local asset {asset}")


errors = []
for route in MARKETING:
    path = f"/{route}/"
    file = ROOT / route / "index.html"
    if not file.exists():
        errors.append(f"missing rendered route {path}")
        continue
    page = parse(file)
    if len(page.headings) != 1:
        errors.append(f"{path}: expected one h1, found {len(page.headings)}")
    if "gs-connected" not in page.body_classes or "gs-header" not in page.classes:
        errors.append(f"{path}: missing shared Connected Layers shell")
    if "cl-theme-picker" not in page.classes or "/platform/" not in page.hrefs or "/developers/" not in page.hrefs or "/docs/" not in page.hrefs:
        errors.append(f"{path}: missing shared theme or navigation contract")
    if not page.canonical or not page.canonical.endswith(path):
        errors.append(f"{path}: canonical must resolve to {path}")
    robots = [m.get("content", "").lower() for m in page.meta if m.get("name", "").lower() == "robots"]
    if any("noindex" in value for value in robots):
        errors.append(f"{path}: production marketing route must not be noindex")
    if not any(src.endswith("connected-theme.js") for src in page.scripts):
        errors.append(f"{path}: missing connected theme script")
    local_assets_exist(page, path, errors)

docs = parse(ROOT / "docs" / "index.html")
if "docs-header" not in docs.classes or "faros-docs-main" not in docs.classes:
    errors.append("/docs/: docs shell is missing")
if not any("docs-theme" in value for value in docs.body_classes | docs.classes):
    errors.append("/docs/: docs theme marker is missing")
if any(src.endswith("connected-theme.js") for src in docs.scripts):
    errors.append("/docs/: must not load connected theme script")

contact = parse(ROOT / "contact" / "index.html")
form = next((attrs for attrs in contact.forms if attrs.get("id") == "contact-form"), None)
if not form:
    errors.append("/contact/: contact form is missing")
required_ids = {"nameInput", "emailInput", "messageInput", "contact-recaptcha", "contact-submit-button"}
if not required_ids.issubset(contact.ids):
    errors.append(f"/contact/: missing required form IDs {sorted(required_ids - contact.ids)}")
controls = {attrs.get("id"): attrs for _, attrs in contact.controls}
for control_id in ("nameInput", "emailInput", "messageInput"):
    if "required" not in controls.get(control_id, {}):
        errors.append(f"/contact/: {control_id} must remain required")
if "disabled" not in controls.get("contact-submit-button", {}):
    errors.append("/contact/: submit button must remain disabled initially")
if not contact.recaptcha or not all(contact.recaptcha.get(key) == value for key, value in {
    "data-callback": "contact_callback",
    "data-expired-callback": "contact_expired",
    "data-error-callback": "contact_captcha_error",
}.items()):
    errors.append("/contact/: reCAPTCHA callback contract is missing")

pricing = parse(ROOT / "pricing" / "index.html")
if pricing.details < 3:
    errors.append(f"/pricing/: expected native details accordions, found {pricing.details}")

if errors:
    raise SystemExit("\n".join(sorted(set(errors))))

print(f"PASS: {len(MARKETING)} marketing routes and docs shell contract")
