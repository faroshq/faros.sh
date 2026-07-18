---
title: Agent Commands
description: Run, install, and upgrade the kedge agent on edges.
weight: 4
---

The agent is the process that runs on your edge (in a pod on a Kubernetes cluster, or as a systemd service on a Linux host) and dials out to the hub. The `kedge agent` command group manages its lifecycle; the `kedge edge create` / `join-command` output prints ready-to-paste variants of these commands with your join token filled in.

## agent run

```bash
kubectl kedge agent run --hub-url https://hub.example.com --edge-name home-lab --token <join-token>
```

Runs the agent as a **foreground** process. This is what container images, dev loops, and e2e tests use — for production installs prefer `agent join`, which sets up a persistent service. After the first successful join the agent persists its issued kubeconfig (as an in-cluster Secret on Kubernetes, or on disk for servers) and reconnects on restart without needing the bootstrap token again.

Shared flags on `run` and `join`:

| Flag | Description |
|:-----|:------------|
| `--hub-url` | Hub URL to dial. |
| `--token` | One-time join token from `edge create`. |
| `--hub-kubeconfig` | Alternative to `--token`: a kubeconfig with access to the hub. |
| `--edge-name` | Name of the edge this agent serves. |
| `--type` | `kubernetes` (default) or `server`. |
| `--labels key=value` | Labels to report. |
| `--kubeconfig`, `--context` | Local cluster access (kubernetes type). |
| `--ssh-proxy-port` | Local SSH port to proxy for server edges (default 22). |
| `--ssh-user`, `--ssh-password`, `--ssh-private-key` | SSH credentials for server edges. |
| `--hub-insecure-skip-tls-verify` | Skip hub TLS verification (dev). |
| `--debug-addr` | Bind address for pprof/healthz. |

## agent join

```bash
sudo kubectl kedge agent join --hub-url https://hub.example.com --edge-name my-vps --token <join-token> --type server
```

Installs the agent **persistently**. Requires `--edge-name` and one of `--token` / `--hub-kubeconfig`.

- **`--type server`** — writes a systemd unit `kedge-agent-<edge>.service` that runs `kedge agent run`, then enables and starts it. Needs root.
- **`--type kubernetes`** — applies Kubernetes manifests to the target cluster: namespace `kedge-agent`, a per-edge ServiceAccount, the `kedge-edge-agent` ClusterRole/Binding, and a Deployment `kedge-agent-<edge>`. The agent image defaults to `ghcr.io/faroshq/kedge-agent` at the CLI's version (override with `KEDGE_AGENT_IMAGE` / `KEDGE_AGENT_TAG` / `KEDGE_AGENT_PULL_POLICY`).

## agent install / agent uninstall

`agent install` writes a systemd unit for a host-mode agent from a hub kubeconfig (`--hub-kubeconfig` and `--edge-name` required; `--unit-name` defaults to `kedge-agent-<edge>`). `agent uninstall` stops and disables the service and removes the unit file. Both need root.

## agent upgrade

```bash
kubectl kedge agent upgrade home-lab            # kubernetes edge: patch the Deployment image
kubectl kedge agent upgrade my-vps              # server edge: prints binary-replace steps
```

For Kubernetes edges, patches the `kedge-agent-<edge>` Deployment to the new image tag and (with `--wait`, the default) waits for the rollout and for the edge to report the new agent version. Flags: `--tag` (defaults to the CLI's own version), `--wait`.

## kedge install

A separate top-level one-shot installer, useful for provisioning scripts:

```bash
kubectl kedge install --type server --hub-url https://hub.example.com --edge-name my-vps --token <join-token>
```

| Flag | Description |
|:-----|:------------|
| `--type` | `kubernetes` (default) or `server`. |
| `--hub-url`, `--edge-name`, `--token` | Required. |
| `--kubeconfig` | Target cluster (kubernetes type). |
| `--dry-run` | Print what would be applied instead of applying it. |

For `server` it writes `/etc/kedge/agent.yaml` plus a `kedge-agent.service` systemd unit; for `kubernetes` it renders hardened manifests (namespace, ServiceAccount, RBAC, Deployment with resource limits) and applies them with kubectl — or prints them with `--dry-run`.
