---
title: Packaging & Deployment
description: The Helm chart shape, environment variables, Docker image, and publishing.
weight: 8
---

A provider ships as a container image plus a Helm chart. The quickstart provider's chart (`providers/quickstart/deploy/chart/`) is the canonical copy-me template.

## Chart shape

```
deploy/chart/
├── Chart.yaml
├── values.yaml
└── templates/
    ├── deployment.yaml       # initContainer (init) + serve container
    ├── service.yaml          # ClusterIP the hub proxies to
    ├── serviceaccount.yaml
    └── catalogentry.yaml     # renders manifest.yaml into a ConfigMap
```

The key wiring in `deployment.yaml`:

- **initContainer** runs your binary with `args: ["init"]`. It mounts the hub-minted kubeconfig Secret (`providerKubeconfig.secretName`, default `faros-provider-kubeconfig`, key `kubeconfig`) at `/var/run/secrets/faros/` and the CatalogEntry ConfigMap at `/etc/faros/catalogentry/`. The Secret mount is **not optional** — the pod naturally blocks until the hub's provider reconciler has delivered it, which sequences bootstrap without any operator logic.
- **serve container** runs the long-lived process: portal assets, backend API, controllers, MCP, heartbeat.
- The **CatalogEntry goes into a ConfigMap, not the host cluster** — it's a kcp resource; `init` applies it into your provider workspace using the minted kubeconfig. In-cluster the chart points `ui.url`/`backend.url` at the Service DNS (`http://<release>.<namespace>.svc.cluster.local:<port>`).

`values.yaml` highlights: `image.*`, `replicaCount` (2 by default — drop to 1 only if you terminate [revdial tunnels](/docs/extend/connectivity/#the-revdial-reverse-tunnel)), `service.port`, `hub.url`, `hub.tokenSecretRef`, `providerKubeconfig.secretName`, `catalogEntry.enabled`.

## Environment variables

The conventional contract your binary reads:

| Variable | Read by | Meaning |
|:---------|:--------|:--------|
| `FAROS_PROVIDER_KUBECONFIG` | init + serve | Path to the workspace kubeconfig |
| `FAROS_SCHEMAS_DIR` | init | APIResourceSchema directory (default `/etc/faros/schemas`) |
| `FAROS_CATALOGENTRY_FILE` | init | CatalogEntry YAML to self-register (empty → skip) |
| `PORT` | serve | HTTP listen port |
| `FAROS_HUB_URL` | serve | Hub URL for heartbeats |
| `FAROS_PROVIDER_NAME` | serve | CatalogEntry name used in the heartbeat path |
| `FAROS_HUB_TOKEN` / `FAROS_HUB_INSECURE` | serve | Heartbeat auth / TLS toggle (dev) |

Providers with extra needs add their own namespaced vars (`AGENTS_DATABASE_URL`, `GITHUB_OAUTH_*`, ...).

## The Docker image

Three stages, mirroring the quickstart Dockerfile:

1. **Frontend** — `npm ci && npm run build` produces `portal/dist`.
2. **Go build** — the binary embeds `portal/dist` via `go:embed` (frontend must build first).
3. **Runtime** — distroless static, non-root, schemas baked at `/etc/faros/schemas`, entrypoint the binary.

## Health, readiness, heartbeat

Serve `/healthz` → 200; the chart wires it into liveness and readiness probes, and the hub health-checks your `backend.healthPath`. Separately, heartbeat the hub every 30s — losing heartbeats (90s TTL) flips you Not-Ready: UI proxy 503s and your MCP tools drop out of federation.

## Onboarding a provider to a hub

The admin-side steps, in order:

1. `kubectl apply -f provider.yaml` (the `Provider` object) against the hub — provisions workspace, SA, kubeconfig Secret.
2. Copy the minted Secret (`<name>-kubeconfig` in `root:faros:system:providers`) into the runtime cluster's namespace where the chart expects it — or let your deployment tooling do it.
3. `helm install` the chart. Init bootstraps the API; serve starts heartbeating; the provider appears in the catalog.
4. If your export claims `*.faros.sh` groups, supply the required `identityHash` values from the hub admin view.

There's also a fully **self-supplied** variant — you provide a workspace-admin kubeconfig yourself instead of the hub-minted one — useful for development or running a provider entirely outside the hub's cluster. Everything downstream of the kubeconfig mount is identical.

## Publishing

In the faros monorepo each `providers/<name>` directory is split-mirrored (history preserved) to a standalone read-only repo `faroshq/provider-<name>`, and the provider's `go.mod` module path is the mirror URL — so third parties can `go get` the code, while images and charts build from the monorepo CI. If you build out-of-tree, none of this applies to you: any repo that produces an image + chart with the contract above is a valid provider.
