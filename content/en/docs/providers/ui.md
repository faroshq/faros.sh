---
title: Building the UI
description: The custom-element contract, kedgeContext, navigation, and asset serving.
weight: 6
---

A provider's frontend is a **Web Component**: a Vite-built `main.js` that registers a custom element as a side effect. The portal loads it once and mounts the element inline — no iframe, no postMessage, no Shadow DOM. The element runs in **light DOM**, so the portal's `:root` CSS variables cascade in and your provider looks native by default.

Any framework works behind the element — quickstart is vanilla TS, most shipped providers wrap a Vue app, React or Lit fit the same seam. The contract with the portal is always: one entry script, one custom element.

## The contract

When a user navigates to `/providers/<name>`, the portal:

1. Injects a one-shot `<script src="/ui/providers/<name>/main.js">` (cache-busted with `?v=`).
2. Waits for `customElements.whenDefined('kedge-provider-<name>')`.
3. Appends the element and sets **`element.kedgeContext` as a JS property** — the setter is your render trigger.
4. Re-sets `kedgeContext` on theme toggle, token refresh, and workspace switch — handle partial updates.
5. Listens for `kedge-navigate` CustomEvents bubbling up to drive the portal's router/history.

The context shape:

```ts
export interface KedgeContext {
  token?: string | null                        // caller's bearer token
  user?: { email?: string; sub?: string } | null
  tenant?: string | null                       // active workspace (logical cluster)
  theme?: 'light' | 'dark' | 'system'
  basePath?: string                            // e.g. /ui/providers/quickstart
  subPath?: string                             // active sub-route / nav child
}
```

## A minimal element

Straight from the quickstart provider (`portal/src/main.ts` + `element.ts`):

```ts
// main.ts — the entry script; side effects register everything
import { QuickstartElement } from './element'
import styles from './style.css?raw'

const TAG = 'kedge-provider-quickstart'

if (!customElements.get(TAG)) {          // re-execution must be a no-op
  const s = document.createElement('style')
  s.textContent = styles                  // light DOM: namespace all rules under TAG
  document.head.appendChild(s)
  customElements.define(TAG, QuickstartElement)
}
```

```ts
// element.ts — property setter drives rendering
export class QuickstartElement extends HTMLElement {
  private _ctx: KedgeContext | null = null

  set kedgeContext(v: KedgeContext | null) {
    this._ctx = v
    this._render()
  }
  get kedgeContext() { return this._ctx }

  connectedCallback() { this._render() }
  // ...
}
```

### Calling your backend

Derive the backend URL from `basePath` — never hardcode it:

```ts
const base = (ctx.basePath || '').replace(/^\/ui\/providers\//, '/services/providers/')
fetch(base + '/api/hello', {
  headers: { Authorization: `Bearer ${ctx.token}` },
})
```

The hub's backend proxy authenticates the request and injects the identity headers your server trusts — see [Connectivity & proxies](/docs/providers/connectivity/).

## The Vite build

The portal hardcodes `/ui/providers/<name>/main.js`, so the build must emit exactly that:

```ts
// vite.config.ts
export default defineConfig({
  base: '/ui/providers/quickstart/',
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/main.ts',
      formats: ['iife'],                 // side effects run without a module loader
      name: 'KedgeProviderQuickstart',
      fileName: () => 'main.js',         // no hash — the portal URL is stable
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',   // lazy chunks under /assets/
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
```

Why these choices: IIFE registers the element the moment the script runs; the un-hashed `main.js` keeps the portal's URL stable across rebuilds; hashed chunks under `assets/` route correctly because the hub's UI proxy treats any path with a `.` in its last segment as an asset.

## Navigation and sub-pages

Declare sub-nav in your CatalogEntry (`ui.children: [{displayName: "Repositories", builtinRoute: "repositories"}]`); the portal renders the items in the sidebar and passes the active child to your element via `kedgeContext.subPath`. Internal navigation flows the other way: dispatch a bubbling `kedge-navigate` CustomEvent with `{detail: {path}}` and the portal updates the browser URL. Keep your internal router (if any) on memory history — the portal owns the address bar.

## Styling

- Light DOM: your CSS shares the page. Namespace every selector under your element tag (`kedge-provider-quickstart .panel {...}`).
- Use the portal's CSS variables for colors and spacing so theme switches (light/dark) just work; re-render on `kedgeContext.theme` changes for anything computed.

## Serving the assets

Your Go binary embeds and serves the built assets — the standard pattern:

```go
//go:embed all:portal/dist
var portalDist embed.FS
```

Serve `/main.js`, `/assets/*`, `/icon.svg`, and `/` (a standalone `index.html` fallback for direct visits) from your HTTP server; the hub's UI proxy at `/ui/providers/<name>/*` forwards asset requests to you. Remember the build order: the frontend must be built before `go build` embeds `portal/dist` (the repo's make targets chain `npm run build` first).
