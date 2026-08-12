# faros.sh

Marketing site and documentation for [faros](https://faros.sh) — the open-source **operating system for AI-native platforms**.

## What faros is

faros is a multi-tenant control plane you build your platform *on*. Four primitives carry the system:

- **Workspaces** — the isolation boundary; every team or environment is a [kcp](https://kcp.io) logical cluster with its own API surface, RBAC, and quota.
- **Providers** — the drivers; each capability (application templates, git, edges, hosted AI agents, fleet query) is a separate pod with its own API, controllers, portal UI, and MCP tools, enabled per workspace.
- **MCP** — the syscall layer; one endpoint per tenant federates every enabled provider's tools, each inheriting that workspace's permissions.
- **Edges** — the I/O layer; clusters and servers dial *out* over a reverse tunnel, so only the hub needs a public address.

The product lives at [github.com/faroshq/faros](https://github.com/faroshq/faros); this repo is only the website.

## Repo layout

| Path | What's in it |
|:-----|:-------------|
| `layouts/partials/hero-home.html` | The whole landing page — markup, scoped styles, and motion layer |
| `layouts/partials/{header,footer_custom,docs-sidebar}.html` | Site chrome; the docs menu is a declarative list at the top of the sidebar partial |
| `layouts/docs/` | Docs shell (single + list) |
| `layouts/_default/_markup/` | Markdown render hooks (links, headings, blockquotes, lists) |
| `content/en/docs/` | All documentation |
| `assets/css/style.scss` | Global styles, design tokens, docs theme |

## Design system

The site runs on **Violet Circuit**, the same system as the faros console (canonical reference: `docs/design-book.md` in the product repo).

- **Dark is the base.** `html.dark` is forced in `head_custom.html`; the `:root` values in `style.scss` are the light fallback.
- **Tokens, not hexes.** Use `var(--fx-*)` — surfaces, borders, `--fx-accent` (`#8b6bff` dark / `#6b48e8` light), text ramp, success/danger. Never hardcode a brand colour. The old `#7c5bf5` / `#6d4fe0` / `#9b85f7` values are dead; if they reappear in a diff, it's a regression.
- **Radius law:** cards/panels 6px, controls 4px, tags 3px. Tags are **square mono**, never pills.
- **Glow means alive.** Only the primary button, the live dot, the hub block, and focus rings glow. Plain surfaces are flat — no glass, no backdrop blur on cards.
- **Faces:** Archivo (display, `font-stretch: 125%`), Instrument Sans (body), IBM Plex Mono (code and tags).

## Adding a docs page

1. Create the markdown under `content/en/docs/<section>/<page>.md` with `title`, `description`, and `weight` front matter.
2. Add one line to the `$sections` list at the top of `layouts/partials/docs-sidebar.html`.

## Local development

Requires Hugo **extended** ≥ v0.110.0, Node.js (PostCSS + Tailwind), and Go (Hugo modules).

```bash
npm install
hugo server          # http://localhost:1313
```

Build a production bundle:

```bash
hugo                 # output in public/
```

Docker:

```bash
docker-compose up --build     # http://localhost:1313
```

### Working against a local Docsy checkout

```bash
git clone --branch v0.7.2 https://github.com/google/docsy.git ../docsy
HUGO_MODULE_WORKSPACE=docsy.work hugo server --ignoreVendorPaths "**"
```

## Troubleshooting

| Symptom | Fix |
|:--------|:----|
| `TOCSS: failed to transform ...` | Use Hugo **extended**, not the standard build |
| `binary with name "go" not found` | Install Go — Hugo modules need it to fetch the theme |
| Tailwind classes missing | `npm install` (PostCSS runs during the Hugo build) |
| Unstyled page when serving `public/` directly | `head_custom.html` emits `<base href>` from `baseURL`; rebuild with `hugo --baseURL http://localhost:PORT/` |

## Contributing

Fork, branch, change, verify with `hugo server`, open a PR.

## Resources

- **Site**: [faros.sh](https://faros.sh) · **Docs**: [faros.sh/docs](https://faros.sh/docs)
- **Product repo**: [github.com/faroshq/faros](https://github.com/faroshq/faros)
- **Docsy**: [docsy.dev](https://www.docsy.dev) · **Hugo**: [gohugo.io](https://gohugo.io/documentation)
