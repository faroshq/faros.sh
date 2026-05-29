---
title: Virtual Workspace Handler
description: Mounting an HTTP handler under /services/, using builder.Deps, and request shape.
weight: 4
---

A **virtual workspace** in kedge is the umbrella term for an HTTP handler your provider registers under `/services/`. It's how you expose anything that doesn't fit cleanly as a CRD: long-running streams, RPCs that span tenants, AI agent endpoints, file uploads, etc.

The MCP aggregator (`/services/mcpserver/`) is the canonical example. So is the edges proxy (`/services/edges-proxy/`).

This page covers:

- Mounting the handler from a first-party provider
- The `builder.Deps` bundle the framework hands you
- Request shape and authentication
- The third-party variant

## Mounting from a first-party provider

Two fields on `BuiltinSpec` wire this up:

```go
providers.RegisterBuiltin(providers.BuiltinSpec{
    Name:        "my-provider",
    // ...
    VirtualWorkspaceMount:   "/services/my-provider",
    VirtualWorkspaceHandler: virtual.Build,
})
```

The hub mounts the handler with `http.StripPrefix(VirtualWorkspaceMount, ...)`, so your handler sees paths *relative to the mount*. A request to `/services/my-provider/tenant-foo/things/bar` arrives at your handler as `/tenant-foo/things/bar`.

`virtual.Build` lives in your provider's `virtual/` subpackage. It receives the dependency bundle once at startup and returns the actual `http.Handler`:

```go
// providers/my-provider/virtual/builder.go
package virtual

import (
    "net/http"
    "github.com/faroshq/faros-kedge/pkg/virtual/builder"
)

func Build(deps *builder.Deps) http.Handler {
    // Anything you compute once (e.g. parsed templates, cached clients)
    // belongs here. Captured in the closure.
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Per-request work goes here.
        handleRequest(deps, w, r)
    })
}
```

The closure keeps `deps` available for every request. The hub calls `Build` exactly once after kcp is initialized.

## `builder.Deps`

The framework hands every handler the same bundle of dependencies:

| Field | Type | Use it for |
|:-|:-|:-|
| `KCPConfig` | `*rest.Config` | Building a `dynamic.Interface` scoped to a specific kcp logical cluster |
| `KCPK8sClient` | `kubernetes.Interface` | Typed Kubernetes client against kcp (rarely needed directly) |
| `KedgeClient` | `*kedgeclient.Client` | Kedge-typed client for `Edge`, `VirtualWorkload`, etc. |
| `EdgeConnManager` | `*ConnManager` | Look up live tunnels by `(cluster, edge-name)` to dial agents |
| `HubExternalURL` | `string` | Build callback URLs the *outside world* will hit |
| `HubInternalURL` | `string` | Build callback URLs other in-cluster components will hit |
| `Logger` | `klog.Logger` | Use `klog.FromContext(r.Context())` instead when serving requests |

The bundle also has helper methods. The most commonly used:

- `deps.HubBaseURL()` — returns the internal URL if set, falling back to external. Use when building URLs for in-cluster callers.
- `deps.OpenSSHSession(ctx, cluster, edgeName, ...)` — opens an SSH session to a connected edge via its reverse tunnel. Reusable from any handler that needs to run commands on the edge side.

### Per-tenant kcp clients

You almost always want a `dynamic.Interface` scoped to a specific logical cluster (a tenant's workspace). The builder package has a helper for this:

```go
import "github.com/faroshq/faros-kedge/pkg/virtual/builder"

dynClient, err := builder.ClusterScopedDynamicClient(deps.KCPConfig, cluster)
if err != nil { /* ... */ }

obj, err := dynClient.Resource(myGVR).Get(ctx, name, metav1.GetOptions{})
```

`cluster` is the kcp logical-cluster name you parsed from the request URL.

## Request shape and authentication

The hub doesn't enforce a path shape on you — that's your handler's job. The conventional pattern, used by every first-party virtual workspace, is:

```
/{cluster}/apis/<group>/<version>/<resource>/<name>/<verb>
```

Where:

- `{cluster}` is the kcp logical cluster (e.g. `root:kedge:user-alice`)
- The rest mirrors a Kubernetes API path so it reads naturally to a Kubernetes-literate audience

A typical parse:

```go
func handleRequest(deps *builder.Deps, w http.ResponseWriter, r *http.Request) {
    logger := klog.FromContext(r.Context()).WithName("my-provider-handler")

    cluster, name, ok := parseMyPath(r.URL.Path)
    if !ok {
        http.Error(w, "invalid path", http.StatusBadRequest)
        return
    }

    token := builder.ExtractBearerToken(r)
    if token == "" {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    // ... use token + cluster + name ...
}
```

### Authentication

The hub does **not** validate the bearer token for `/services/` traffic by default — providers do it themselves, typically by forwarding to kcp and letting kcp validate. `builder.ExtractBearerToken(r)` reads the `Authorization` header (or falls back to the configured cookie name). What you do with the token is up to your provider; the common patterns are:

1. **Forward it to kcp** when listing tenant resources (most common): build a `dynamic.Interface` whose `BearerToken` is the user's, so kcp's RBAC applies.
2. **Use it for OIDC resolution**: `builder.ResolveCallerIdentity(ctx, deps.KCPConfig, token, deps.Logger)` returns the resolved identity for SSH user-mapping flows.
3. **Pass it through** to an edge-side service: forward via the edge tunnel.

### Edge tunnel access

When you need to talk to an edge agent:

```go
key := builder.EdgeConnKey(cluster, edgeName)
conn, ok := deps.EdgeConnManager.Load(key)
if !ok {
    http.Error(w, "edge offline", http.StatusBadGateway)
    return
}
// conn implements net.Conn — dial through the reverse tunnel.
```

For SSH specifically, prefer `deps.OpenSSHSession(...)` — it handles credential fetch and session setup. The Linux MCP toolsets in `providers/serveredges/linuxmcp/sshexec/` are a worked example.

## A worked example

Here's the MCP aggregator's handler, trimmed for clarity. It demonstrates the conventional shape: path parse → auth extract → per-tenant dynamic client → resource fetch → response assembly.

```go
func Build(deps *builder.Deps) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        logger := klog.FromContext(r.Context()).WithName("mcpserver-handler")

        cluster, name, ok := parseMCPServerPath(r.URL.Path)
        if !ok { http.Error(w, "invalid path", http.StatusBadRequest); return }

        token := builder.ExtractBearerToken(r)
        if token == "" { http.Error(w, "Unauthorized", http.StatusUnauthorized); return }

        dynClient, err := builder.ClusterScopedDynamicClient(deps.KCPConfig, cluster)
        if err != nil { /* ... */ }

        obj, err := dynClient.Resource(mcpServerGVR).Get(r.Context(), name, metav1.GetOptions{})
        if err != nil { /* ... */ }

        // ... build per-request MCP server from the CR + edge inventory ...
        handler.ServeHTTP(w, r)
    })
}
```

The full file is `providers/mcp/virtual/builder.go` in the kedge repo.

## Third-party variant

A third-party provider doesn't get a `BuiltinSpec`; instead its `CatalogEntry` declares a backend URL:

```yaml
spec:
  backend:
    url: "http://my-provider-backend.my-namespace.svc:8080"
```

The hub mounts a **reverse proxy** at `/services/providers/my-provider/` that forwards to `spec.backend.url`. Your service receives the request with the `/services/providers/my-provider/` prefix stripped — same convention as first-party.

Your service runs in a pod with its own kubeconfig (typically a `ServiceAccount` token mounted in the pod that gives access to the tenant resources via the `APIExport`'s virtual workspace endpoint). The mechanics of *talking to kcp* differ — you connect directly rather than getting a `Deps` bundle — but the request shape and auth model on the wire are identical.

## When NOT to use a virtual workspace

If your provider's surface fits cleanly as CRDs that controllers reconcile, you don't need a virtual workspace handler. CRDs + a `kubectl apply` flow is simpler, declarative, idempotent.

Reach for a virtual workspace when:

- You need to **stream** (SSE, WebSockets, long-poll).
- You're proxying or fanning out to **multiple edges** in one request (the `list_targets` pattern).
- You're exposing a protocol that isn't HTTP-CRUD-ish (MCP, terminal sessions).
- You need to do something that requires **per-request access to the edge tunnel pool**.

For pure resource management, stick with CRDs.
