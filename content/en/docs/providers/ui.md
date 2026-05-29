---
title: Building the UI
description: Micro-frontend custom element, dashboard tile, navigation, and styling.
weight: 2
---

A provider's UI ships as a Vite-built `main.js` that registers one or more custom elements. The portal loads it on demand and mounts the elements inline — no iframe, no Shadow DOM, no postMessage shuttle. CSS variables from the portal's `:root` cascade in, so your provider looks native by default.

This page covers:

- The custom-element contract the portal expects
- Per-element `kedgeContext` and navigation
- The optional dashboard tile element
- Where to put your code (in-tree vs out-of-tree layout)

## The contract

The portal expects one custom element registered with a predictable tag:

| Tag | Purpose |
|:-|:-|
| `kedge-provider-<name>` | The full-page experience the portal shows at `/providers/<name>/...` |
| `kedge-dashboard-tile-<name>` *(optional)* | A summary card on the dashboard |

When the user navigates to `/providers/my-provider/anything`, the portal's `ProviderFrame.vue`:

1. Loads `/ui/providers/my-provider/main.js` if not yet loaded (idempotent script tag).
2. Waits up to 5s for `customElements.whenDefined('kedge-provider-my-provider')`.
3. Creates the element, sets `kedgeContext`, appends it to the mount node.
4. Listens for `kedge-navigate` `CustomEvent`s to drive vue-router.

Your element receives the URL "sub-path" via `kedgeContext.basePath` plus `window.location.pathname` — your internal router lives entirely in memory history; the portal is the source of truth for the URL.

## A minimal page element

```ts
// src/element.ts
import { createApp, h, reactive, type App } from 'vue'
import { createPinia } from 'pinia'
import type { Router } from 'vue-router'

import MyProviderHost from './MyProviderHost.vue'
import { createInternalRouter } from './router'
import type { KedgeContext } from './auth-adapter'

const TAG = 'kedge-provider-my-provider'

class KedgeProviderMyProvider extends HTMLElement {
  private app: App | null = null
  private router: Router | null = null
  private state = reactive({ context: null as KedgeContext | null, subPath: '' })

  // The portal sets this as a property after appending the element.
  // It re-sets on theme/token rotation and on portal-side navigation.
  set kedgeContext(v: KedgeContext) {
    this.state.context = v
    const next = computeSubPath(v?.basePath)
    if (next === this.state.subPath) return
    this.state.subPath = next
    // Drive the internal memory-history router when the portal navigates
    // externally (side-nav, back/forward). afterEach below skips re-emit
    // when paths already match, so this stays a one-way push.
    const target = '/' + next.replace(/^\//, '')
    if (this.router && this.router.currentRoute.value.path !== target) {
      this.router.replace(target)
    }
  }
  get kedgeContext() { return this.state.context }

  connectedCallback() {
    if (this.app) return // double-mount guard for HMR
    this.router = createInternalRouter('/' + this.state.subPath.replace(/^\//, ''))

    // Bubble internal navigations up to the portal SPA router.
    this.router.afterEach((to) => {
      const path = to.path === '/' ? '' : to.path.replace(/^\//, '')
      if (path === this.state.subPath.replace(/^\//, '')) return
      this.state.subPath = path
      this.dispatchEvent(new CustomEvent('kedge-navigate', {
        detail: { path }, bubbles: true,
      }))
    })

    this.app = createApp({
      render: () => h(MyProviderHost, { context: this.state.context, subPath: this.state.subPath }),
    })
    this.app.use(createPinia())
    this.app.use(this.router)
    this.app.mount(this)
  }

  disconnectedCallback() {
    this.app?.unmount()
    this.app = null
    this.router = null
  }
}

function computeSubPath(basePath?: string): string {
  if (!basePath) return ''
  const p = window.location.pathname
  return p.startsWith(basePath) ? p.slice(basePath.length).replace(/^\//, '') : ''
}

if (!customElements.get(TAG)) customElements.define(TAG, KedgeProviderMyProvider)
```

A few subtleties worth knowing about:

- **Own Vue + Pinia + Router**: each element creates its own. The portal's stores are not reachable; that's deliberate (your bundle is self-contained and can be reloaded without restarting the SPA).
- **Light DOM, not Shadow DOM**: Vue's `defineCustomElement` defaults to Shadow DOM, which blocks the portal's CSS variables. We define the class manually instead.
- **Memory-history router**: the URL is owned by the portal SPA. Your internal router renders the right component based on `subPath`; navigations dispatch `kedge-navigate` for the URL bar.
- **HMR guard**: `if (this.app) return` makes hot reload safe.

### The `kedgeContext` shape

```ts
interface KedgeContext {
  token?: string | null              // OIDC bearer, forward this to your backend
  user?: { email?: string; sub?: string } | null
  tenant?: string | null             // kcp logical-cluster name, e.g. "root:kedge:user-..."
  theme?: 'light' | 'dark' | 'system'
  basePath?: string                  // "/ui/providers/<name>" — strip from window.location
}
```

The portal pushes a new context on theme change, token refresh, cluster switch, and **portal-side navigation** (so your element's setter can re-sync its router). Hydrate your local auth store from `props.context` in your root component:

```vue
<!-- src/MyProviderHost.vue -->
<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, type KedgeContext } from './auth-adapter'

const props = defineProps<{ context: KedgeContext | null; subPath: string }>()
const auth = useAuthStore()
const router = useRouter()

watch(() => props.context, (ctx) => auth.hydrate(ctx), { immediate: true })

watch(() => props.subPath, (sub) => {
  const want = '/' + (sub ?? '').replace(/^\//, '')
  if (router.currentRoute.value.path !== want) router.replace(want)
})
</script>

<template>
  <router-view />
</template>
```

### Navigation

Inside your bundle, treat the internal router as authoritative for *what page renders*, and `kedge-navigate` as the way to *tell the URL bar*. The element's `afterEach` hook above bridges both directions.

Internal links use the in-provider path:

```vue
<router-link :to="`/${edge.name}`">Open</router-link>          <!-- inside the provider -->
```

External links (back to the portal SPA) just use `window.location` or a plain `<a>`; vue-router inside the provider doesn't know about portal routes.

## The dashboard tile (optional)

The portal's `DashboardPage` mounts one tile per ready+hasUI provider. To opt in, register a second custom element from the same `main.js`:

```ts
// src/main.ts
import './element'
import './dashboard-tile'   // <-- adds the tile element
```

The tile element is a smaller, stateless mount:

```ts
// src/dashboard-tile.ts
import { createApp, h, reactive, type App } from 'vue'
import { createPinia } from 'pinia'
import DashboardTile from './DashboardTile.vue'
import type { KedgeContext } from './auth-adapter'

const TAG = 'kedge-dashboard-tile-my-provider'

class KedgeDashboardTileMyProvider extends HTMLElement {
  private app: App | null = null
  private state = reactive({ context: null as KedgeContext | null })

  set kedgeContext(v: KedgeContext) { this.state.context = v }
  get kedgeContext() { return this.state.context }

  connectedCallback() {
    if (this.app) return

    // Tiles dispatch kedge-navigate just like the page element so the
    // portal can push /providers/my-provider/{path} on click.
    const dispatch = (path: string) => {
      this.dispatchEvent(new CustomEvent('kedge-navigate', {
        detail: { path: path.replace(/^\//, '') }, bubbles: true,
      }))
    }

    this.app = createApp({ render: () => h(DashboardTile, { context: this.state.context }) })
    this.app.use(createPinia())
    this.app.provide('dispatchNavigate', dispatch)
    this.app.mount(this)
  }

  disconnectedCallback() { this.app?.unmount(); this.app = null }
}

if (!customElements.get(TAG)) customElements.define(TAG, KedgeDashboardTileMyProvider)
```

The tile's `DashboardTile.vue` is a normal Vue component. Inject `dispatchNavigate` to wire click handlers:

```vue
<script setup lang="ts">
import { inject } from 'vue'
const dispatchNavigate = inject<(path: string) => void>('dispatchNavigate', () => {})
</script>

<template>
  <div>
    <button @click="dispatchNavigate('reports')">Reports →</button>
  </div>
</template>
```

If you don't register a tile element, the portal falls back to a static card with the provider's icon, name, and an "Open" link.

### What goes in the tile

Tiles should answer "what does the user have, and is anything wrong?" in a single glance:

- **Counts**: total / ready / online — use a stat trio if the values have meaningfully different colors.
- **Status indicator**: a thin colored bar (green ≥80%, amber ≥50%, red) reads instantly.
- **Top 3 recent items** with click-through. More than 3 belongs on the provider page.
- **Empty state**: a "Connect your first X →" CTA that dispatches `dispatchNavigate('')` instead of just stating absence.

See `providers/kubernetesedges/portal/src/DashboardTile.vue` in the kedge repo for a worked example.

## Where to put the code

### In-tree (first-party)

Lives under `providers/<name>/portal/`:

```
providers/my-provider/portal/
├── package.json              # vite, vue, no actual deps (symlinks to portal/)
├── tsconfig.json
├── vite.config.ts            # aliases @ to ../../../portal/src
├── src/
│   ├── main.ts               # imports ./element and ./dashboard-tile
│   ├── element.ts            # custom element class
│   ├── dashboard-tile.ts     # optional tile element
│   ├── MyProviderHost.vue
│   ├── DashboardTile.vue     # optional
│   ├── router.ts             # internal memory-history router
│   ├── auth-adapter.ts       # local Pinia store hydrated from kedgeContext
│   └── ...pages
└── dist/                     # gitignored; built by `make build-my-provider-portal`
```

The Makefile target wires `npm ci` for `portal/`, symlinks `node_modules` from each provider portal into it (so you don't reinstall vue per provider), and runs `npx vite build` to produce `dist/main.js`. The Go side `//go:embed all:portal/dist` and exposes it as `LocalUIAssets`:

```go
// providers/my-provider/assets.go
package myprovider

import (
    "embed"
    "io/fs"
)

//go:embed all:portal/dist
var portalFS embed.FS

func localUIAssets() fs.FS {
    sub, _ := fs.Sub(portalFS, "portal/dist")
    return sub
}
```

### Out-of-tree (third-party)

Build your bundle however you like, serve `main.js`, `index.html`, and any assets from a small HTTP server, and point `spec.ui.url` in your `CatalogEntry` at it. The hub will reverse-proxy `/ui/providers/<name>/*` to that URL — your code never sees the `/ui/providers/<name>/` prefix.

The custom-element contract is identical. Your bundle just isn't bundled with the hub binary.

## Styling

The portal uses Tailwind. The hub serves Tailwind utility classes via `@source` directives in `portal/src/assets/main.css`, so any class you use in a provider component is compiled into the host portal's CSS — your provider bundle ships no CSS of its own.

Use the design tokens (CSS variables on `:root`) for surface, text, accent, danger, success colors. The dark/light theme switches automatically via the `theme` field in `kedgeContext`.

| Token group | Examples |
|:-|:-|
| Surface | `bg-surface-raised`, `bg-surface-overlay`, `border-border-subtle` |
| Text | `text-text-primary`, `text-text-secondary`, `text-text-muted` |
| Accent | `text-accent`, `text-accent-hover` |
| Status | `text-success`, `text-warning`, `text-danger` (plus `-subtle` variants) |

Stick to these. Hard-coded colors will look wrong when the theme changes.
