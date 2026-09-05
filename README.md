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
| `layouts/partials/{header,footer_custom,docs-sidebar}.html` | Site chrome; documentation uses its own header and contextual sidebar |
| `layouts/docs/` | Docs shell (single + list) |
| `layouts/_default/_markup/` | Markdown render hooks (links, headings, blockquotes, lists) |
| `content/en/docs/` | All documentation |
| `assets/css/style.scss` | Global styles, design tokens, docs theme |

## Design system

The site runs on **Violet Circuit**, the same system as the faros console (canonical reference: `docs/design-book.md` in the product repo).

- **Docs support Light, Dark, and System.** The docs header stores its selection under `faros-docs-theme`, with System as the default. Theme initialization runs in the document head. Marketing pages retain their dark appearance. Shared tokens live in `style.scss`; docs-specific contrast adjustments live in `docs.scss`.
- **Tokens, not hexes.** Use `var(--fx-*)` — surfaces, borders, `--fx-accent` (`#8b6bff` dark / `#6b48e8` light), text ramp, success/danger. Never hardcode a brand colour. The old `#7c5bf5` / `#6d4fe0` / `#9b85f7` values are dead; if they reappear in a diff, it's a regression.
- **Radius law:** cards/panels 6px, controls 4px, tags 3px. Tags are **square mono**, never pills.
- **Glow means alive.** Only the primary button, the live dot, the hub block, and focus rings glow. Plain surfaces are flat — no glass, no backdrop blur on cards.
- **Faces:** Archivo (display, `font-stretch: 125%`), Instrument Sans (body), IBM Plex Mono (code and tags).

## Adding a docs page

1. Create the markdown under `content/en/docs/<section>/<page>.md` with `title`, `description`, and `weight` front matter.
2. Set `doc_type` to Tutorial, Guide, Reference, Overview, or Troubleshooting. Sidebar entries are generated from populated pages in weight order.
3. Provider pages belong under `use/<provider>/`; the provider overview cascades its `provider` slug to children. Shared concepts, administration, and hosting instructions have their own canonical sections.
4. Add a provider or top-level destination in `data/docs.json` only when its landing page is populated. The directory stays visible regardless of deployment enablement.
5. Run `npm test` to build, check internal links and anchors, validate navigation/search coverage, and test task discovery. Search is generated at `/docs/index.json`; no external search service is required.

See [navigation validation](docs/navigation-validation.md) for the prototype, task study, and remaining human validation.

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

### Provider schema reference and runnable examples

Regenerate the provider field tables and downloadable schema bundles from the pinned product source (Python 3 and Ruby's standard YAML/JSON libraries required):

```sh
python3 scripts/generate-docs-schemas.py ../faros --revision PRODUCT_COMMIT
```

Replace `PRODUCT_COMMIT` with the reviewed product commit to publish. Generated pages and bundles record its resolved SHA, and source links are pinned to that commit.

The generator reads committed files with `git show`, so unrelated working-tree changes in the product repo are not included. Review changed contracts before advancing the revision; update guide examples and the documentation baseline together. Generated tables cover resource schemas, not every provider HTTP API.

Validate the Databricks server example against that revision's real SDK with a simulated action gateway:

```sh
FAROS_PRODUCT_REPO=../faros node --test tests/docs-databricks-example.test.mjs
```

This test needs permission to bind temporary local HTTP ports. It covers success, revoked grants, and incorrect table identity without contacting Databricks. Live hub acceptance and reader testing are tracked in `docs/navigation-validation.md`.
