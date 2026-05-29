---
title: Building Providers
description: How to extend kedge with your own provider — UI, API, and virtual workspace.
weight: 50
---

A **provider** is how you teach the kedge hub a new capability without forking it. Edges, MCP, and a future "cost", "secrets", or "policy" surface are all the same shape: a Go package that registers itself, optional CRDs surfaced through kcp, an optional HTTP handler mounted under `/services/`, and an optional UI bundle mounted under `/ui/`.

The three first-party providers shipping today — `kubernetes-edges`, `server-edges`, and `mcp` — are written against the same interface a third-party provider uses. The difference is *where the code lives*, not what it can do.

## When to write a provider

You want a provider when you have a vertical slice that needs to be:

- **Discoverable**: appear in the side nav and the catalog page, separately enable-able per tenant.
- **Tenant-scoped**: backed by CRDs that each tenant manages in their own workspace.
- **Self-describing**: ships its own UI, its own backend, its own data model.

If you only need to add a button or a column to an existing surface, you probably don't need a provider — patch the relevant page in the portal directly. Providers exist to draw boundaries between concerns that *would* otherwise grow into a monolith.

## First-party vs third-party

The two paths share a manifest contract; what differs is who runs the code.

| | **First-party (in-tree)** | **Third-party (out-of-tree)** |
|:-|:-|:-|
| Where it lives | `providers/<name>/` in the kedge repo | Your own repo, deployed as a pod |
| How it's registered | Go `init()` calls `RegisterBuiltin` | YAML `CatalogEntry` CR applied to the hub |
| How the UI ships | `//go:embed` into the hub binary | Hub reverse-proxies to your `spec.ui.url` |
| How the backend ships | Mounted handler in the hub process | Hub reverse-proxies to your `spec.backend.url` |
| CRDs | Apply directly to the hub's kcp workspace | Declared as inline `APIResourceSchema` in the `CatalogEntry`, surfaced via `APIExport` |
| Best for | Capabilities you want bundled with the hub release | Anything you ship independently of the hub's release cycle |

You can start as third-party, prove the shape, and move in-tree later (or never — the in-tree path is just a deployment convenience).

## The three surfaces

A provider can opt into any subset:

- **[UI](/docs/providers/ui/)** — a Vite-built micro-frontend that registers a custom element. The portal mounts it inside the SPA; no iframes, shared theme, internal routing through a memory-history router. Optionally a dashboard tile too.
- **[API](/docs/providers/api/)** — CRDs surfaced through a kcp `APIExport`. Tenants `APIBinding` to your export to get the resources in their own workspace; the portal handles the bind flow when the user clicks "Enable".
- **[Virtual workspace](/docs/providers/virtual-workspace/)** — an HTTP handler mounted at `/services/<your-mount>/` that gets per-request access to kcp, the edge tunnel pool, and SSH session opening. This is where you put long-running logic that doesn't fit cleanly as a CRD reconciler.

There's also an **MCP integration** (`providers/mcp/aggregate`) where any provider can contribute a `ToolFamily` to the aggregate MCP endpoint. Covered briefly in the UI guide; deeper write-up coming.

## The contract at a glance

For first-party providers, this is the entire interface the hub knows about:

```go
type BuiltinSpec struct {
    Name        string                  // catalog name, kebab-case
    DisplayName string                  // side-nav label
    Description string                  // catalog card blurb
    Category    string                  // grouping in side nav
    IconURL     string                  // portal-relative icon path
    BuiltinRoute string                 // legacy Vue route (most providers leave empty)
    Children    []BuiltinChild          // sub-nav items
    Requires    []string                // depends-on other provider names

    VirtualWorkspaceMount   string                         // e.g. /services/myprovider
    VirtualWorkspaceHandler func(*builder.Deps) http.Handler

    LocalUIAssets fs.FS                 // embed.FS with main.js, index.html
}
```

That's it. A minimal provider is ~30 lines of Go plus optional CRDs and UI.

## Next steps

The pages below walk through each surface, end-to-end, with code from the in-tree providers as reference.

- **[Anatomy of a provider](/docs/providers/anatomy/)** — registration, lifecycle, the bare minimum
- **[Building the UI](/docs/providers/ui/)** — custom element, dashboard tile, kedgeContext, navigation
- **[Defining the API](/docs/providers/api/)** — CRDs, APIExport, permission claims, the enable flow
- **[Virtual workspace handler](/docs/providers/virtual-workspace/)** — HTTP handler, builder.Deps, request shape
