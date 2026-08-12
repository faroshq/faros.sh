---
title: Connectivity & Proxies
description: The UI and backend proxies, identity headers, the revdial reverse tunnel, and data-plane subresources.
weight: 4
---

All traffic between users and your provider flows through the hub. Two reverse proxies front every provider, and for edge connectivity there's a third mechanism — the revdial reverse tunnel. This page covers all three.

## The UI proxy — `/ui/providers/<name>/*`

Serves your static frontend assets (from `spec.ui.url`). No token is forwarded — it's assets only. Two behaviors to know:

- Only paths whose last segment looks like a file (contains a `.` — `main.js`, `icon.svg`, `assets/x-abc123.js`) are proxied. Bare SPA routes fall through to the portal shell, so a hard refresh on `/providers/you/some/route` keeps the portal chrome and remounts your element.
- The proxy injects `X-Faros-Base-Path` so your server can render relative asset paths if it needs to.

## The backend proxy — `/services/providers/<name>/*`

Everything dynamic: REST, GraphQL, WebSocket, MCP. For each request the hub:

1. Authenticates the caller (OIDC, static token, or service account) and resolves their active workspace.
2. **Strips any inbound `X-Faros-*` headers** — a client can never forge identity.
3. Injects verified `X-Faros-User`, `X-Faros-Tenant` (workspace path), and `X-Faros-Cluster` (logical cluster ID).
4. Forwards the caller's `Authorization` header untouched.
5. Streams without buffering (`FlushInterval: -1`), so SSE, WebSockets, and long-lived tunnels work.

Your handler's contract: trust the `X-Faros-*` headers (they're hub-asserted), act as the caller using the bearer token ([pattern B](/docs/providers/virtual-workspace/#the-two-identity-patterns)), and never accept those headers from any other path into your process.

A minimal backend endpoint (quickstart's `/api/hello`) just echoes `X-Faros-User` back — that's the whole integration test for the proxy contract.

## The revdial reverse tunnel

Providers that talk to agents behind NAT (the `edges` provider) use the SDK's **revdial** package. The flow:

1. The agent dials **out** to the hub with an HTTP upgrade; the connection is hijacked and becomes a long-lived control channel, registered in the provider process under a unique ID.
2. When something needs to reach the agent, the provider sends `conn-ready` over the control channel; the agent opens a **fresh WebSocket back** to a pickup path; the provider matches it to the waiting dial. Each logical connection is its own WebSocket.
3. Keep-alives every 18 seconds with 60-second read deadlines on both sides detect silently dropped tunnels (Cloudflare and friends).

> **Single-replica rule.** The dialer registry is process-global: the control connection and every later pickup must land on the *same process*. Any provider that terminates revdial tunnels must run one replica. Stateless providers (quickstart and most others) scale freely — the default chart ships `replicaCount: 2`.

## Data-plane subresources

CRUD on resources goes through kcp; everything else — streams, exec, proxying into an edge — is served as **HTTP subresource paths** on your backend, styled after the Kubernetes API so they read naturally. The edges provider is the reference:

```
/services/providers/edges/agent/{cluster}/apis/edges.faros.sh/v1alpha1/{resource}/{name}/proxy
    ← agent control-tunnel ingress (the agent dials this)

/services/providers/edges/edgeproxy/clusters/{cluster}/.../{name}/k8s
/services/providers/edges/edgeproxy/clusters/{cluster}/.../{name}/ssh
    ← consumer egress: kubectl and SSH sessions ride these
```

The provider stamps the public subresource URL into each edge's `status.URL`, so clients (the CLI, other providers) discover it from the resource itself rather than hardcoding paths.

If your provider needs verbs that aren't CRUD — logs, file sync, terminal streams — this is the pattern: subresource paths behind the backend proxy, authorized per request as the caller. The infrastructure provider's Template data plane (logs/sync/restart/preview for development sandboxes) works the same way.

## Reaching other providers

Never call another provider's backend URL directly, and never hold its credentials. If you need what another provider manages, go through its **published API**: create/read its CRs in the tenant workspace (via your claims or the caller's token) and let *its* controllers and subresources do the work. This keeps every hop authorized by binding and caller identity. App Studio consuming the infrastructure provider's Templates is the canonical example.

One sanctioned extension: a provider whose CatalogEntry sets `edgeProxyAccess: true` is granted the `proxy` verb on the edges API at Enable time, letting it open background connections to the tenant's edge clusters through the edges provider's egress path — this is how kuery keeps fleet-wide informers running.
