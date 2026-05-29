---
title: Anatomy of a Provider
description: The manifest contract, registration, and lifecycle — first-party and third-party.
weight: 1
---

A provider is the sum of its manifest, the surfaces it opts into, and (for third-party) the YAML CR that introduces it to the hub. This page is the minimum-viable-provider walkthrough; the surface-specific guides ([UI](/docs/providers/ui/), [API](/docs/providers/api/), [Virtual workspace](/docs/providers/virtual-workspace/)) drill into each capability.

## First-party: register from Go

First-party providers live in `providers/<name>/` in the kedge repo. The hub picks them up via a blank import in `cmd/kedge-hub/main.go`:

```go
import (
    _ "github.com/faroshq/faros-kedge/providers/mcp"
    _ "github.com/faroshq/faros-kedge/providers/kubernetesedges"
    _ "github.com/faroshq/faros-kedge/providers/serveredges"
    _ "github.com/faroshq/faros-kedge/providers/myprovider"   // your new one
)
```

The provider's package-level `init()` calls `providers.RegisterBuiltin`:

```go
// providers/myprovider/manifest.go
package myprovider

import (
    "github.com/faroshq/faros-kedge/pkg/hub/providers"
)

func init() {
    providers.RegisterBuiltin(providers.BuiltinSpec{
        Name:        "my-provider",
        DisplayName: "My Provider",
        Description: "A short blurb shown on the catalog card.",
        Category:    "Custom",
        // No VirtualWorkspaceMount / LocalUIAssets here — this provider
        // is metadata-only. Catalog entry shows up; clicking it lands
        // on a "no UI" stub. Add surfaces below as needed.
    })
}
```

A provider that registers nothing else still appears in the catalog. That's already useful for a metadata-only entry — links to docs, runbooks, dashboards elsewhere.

### Adding surfaces

The remaining fields on `BuiltinSpec` opt into the three surfaces:

```go
providers.RegisterBuiltin(providers.BuiltinSpec{
    Name:        "my-provider",
    DisplayName: "My Provider",
    Category:    "Custom",

    // Sub-nav under the provider in the side bar.
    Children: []providers.BuiltinChild{
        {DisplayName: "Reports", BuiltinRoute: "reports"},
    },

    // Hard depends-on. Hub refuses to start if these aren't in the
    // enabled set. Use sparingly — most providers should be standalone.
    Requires: []string{"kubernetes-edges"},

    // Virtual workspace HTTP surface (see Virtual Workspace guide).
    VirtualWorkspaceMount:   "/services/myprovider",
    VirtualWorkspaceHandler: virtual.Build,

    // Embedded UI bundle (see UI guide).
    LocalUIAssets: localUIAssets(),
})
```

### Selecting providers at runtime

The hub takes a `--providers` flag listing which builtins to enable. Empty (the default) enables all. Use it to disable optional providers in a deployment:

```
--providers=kubernetes-edges,mcp     # skip server-edges
--providers=mcp                       # MCP only; aggregator runs empty
```

`Requires` is enforced here: the hub refuses to start if you enable a provider whose dependencies are missing, with an actionable error.

### The lifecycle, in order

1. **`init()`**: every imported provider package calls `RegisterBuiltin`. The registry is built before `main()` runs.
2. **Flag parse**: hub reads `--providers`, calls `ResolveEnabledBuiltins`, fails fast on unknown names or unmet `Requires`.
3. **kcp bootstrap**: for each enabled builtin, the hub applies a `CatalogEntry` CR into `root:kedge:providers` (the workspace tenants browse to enable providers).
4. **Mount handlers**: for each enabled builtin with `VirtualWorkspaceHandler`, the hub mounts the handler at `VirtualWorkspaceMount` with `http.StripPrefix`. For each with `LocalUIAssets`, the UI proxy serves the embedded FS under `/ui/providers/{Name}/`.
5. **Serve**: hub listens; tenants discover providers via the catalog page, enable them, get an `APIBinding` (if the provider has CRDs).

## Third-party: register from YAML

A third-party provider runs as your own pod/service in the same cluster as the hub (or any cluster the hub can reach). You don't write Go in the hub repo — you write a `CatalogEntry` CR.

```yaml
apiVersion: providers.kedge.faros.sh/v1alpha1
kind: CatalogEntry
metadata:
  name: my-provider
spec:
  displayName: "My Provider"
  description: "A short blurb shown on the catalog card."
  category: "Custom"
  iconURL: "https://example.com/icon.svg"

  # Where your UI lives. The hub reverse-proxies /ui/providers/my-provider/*
  # to this URL. Leave empty if your provider has no UI.
  ui:
    url: "http://my-provider-portal.my-namespace.svc:8080"

  # Where your backend lives. The hub reverse-proxies
  # /services/providers/my-provider/* to this URL.
  backend:
    url: "http://my-provider-backend.my-namespace.svc:8080"

  # CRDs you surface to tenants. See the API guide.
  apiExport:
    name: "my-provider.providers.kedge.faros.sh"
    permissionClaims:
      - resource: configmaps
        verbs: [get, list, watch]
        tenantScoped: true
    schemas:
      - groupResource: "things.my-provider.providers.kedge.faros.sh"
        body: |
          apiVersion: apis.kcp.io/v1alpha1
          kind: APIResourceSchema
          # ... inline schema body ...
```

The hub's CatalogEntry reconciler does the rest: creates the `APIExport` in `root:kedge:providers:my-provider`, applies the inline schemas, sets up the bind grants, registers your provider in the in-memory registry, and starts proxying traffic.

The runtime contract is identical to first-party from the tenant's point of view — they see the same Enable button, the same provider page, the same dashboard tile.

## The `/api/providers` endpoint

Both flavors surface through one read endpoint:

```json
{
  "name": "my-provider",
  "displayName": "My Provider",
  "ready": true,
  "hasUI": true,
  "hasBackend": true,
  "iconURL": "...",
  "category": "Custom",
  "children": [],
  "apiExportPath": "root:kedge:providers:my-provider",
  "apiExportName": "my-provider.providers.kedge.faros.sh",
  "permissionClaims": [...],
  "builtin": false
}
```

The portal queries this on every dashboard / nav render. `Ready` is computed by the hub: builtins are always ready; third-party readiness is true once the `APIExport` exists and the UI/backend URLs (if declared) are reachable.

## What to read next

Pick the surfaces you're opting into:

- **[Building the UI](/docs/providers/ui/)** — the custom-element pattern shared by first and third party.
- **[Defining the API](/docs/providers/api/)** — `APIExport`, schemas, permission claims, the Enable flow.
- **[Virtual workspace handler](/docs/providers/virtual-workspace/)** — HTTP handler shape and the `builder.Deps` bundle.
