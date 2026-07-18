---
title: faros Documentation
description: One control plane for everything you run — clusters, servers, apps, and AI. Open source, Apache 2.0, free forever.
weight: 1
---

**faros** connects your distributed Kubernetes clusters and bare-metal servers through a single hub — no inbound firewall rules required. (You'll see the name `kedge` throughout the CLI, charts, and APIs — that's the engine faros is built on.) On top of that connectivity floor sits a multi-tenant **provider platform**: application templates, git repositories, hosted AI agents, fleet-wide query, and more, each enable-able per workspace and all exposed to AI tools through one MCP endpoint.

## No inbound rules. No VPNs. No port forwarding.

The hub is the **only** thing with a public endpoint. Everything else stays behind its firewall — and still becomes reachable.

```
   Your laptop                    Hub                           Edge
   ──────────                    ────                          ─────

   kubectl/kedge  ──────────►  ┌─────────────┐  ◄─── dial out ──  agent
                               │  kedge hub  │  (outbound only)  (k8s cluster)
                               │  (public)   │                   bare metal
                               └─────────────┘                   VM / Raspberry Pi
                                                                 behind NAT/firewall
```

**How it works:** Agents dial *out* to the hub. The hub keeps a reverse tunnel open. Every time you run `kubectl` or `kubectl kedge ssh`, your request goes to the hub, which forwards it through that existing tunnel. Nothing needs to reach *into* your network.

### Works where other tools fail

| Your setup | Why kedge fits |
|:-----------|:---------------|
| **Home lab** | No router config, no DynDNS — the agent calls home |
| **Raspberry Pi** | Outbound HTTPS works from behind any NAT |
| **Bare metal in a closet** | No public IP needed, no forwarded ports |
| **Kubernetes edge** | Same model — agent connects, you connect to agent |
| **Behind corporate firewall** | Outbound is already allowed; no rule changes |

## Two ways to use it

You can run kedge two ways. Both produce the same CLI experience.

- **[Hosted hub at console.faros.sh](https://console.faros.sh)** — Sign in, register an edge, get a kubeconfig. Useful for trying things out fast.
- **[Self-host your own hub](/docs/deploy/helm/)** — One Helm chart on any Kubernetes cluster, behind a VPS / Cloudflare Tunnel / nginx, whatever you have. No license keys, no telemetry, no usage limits.

## Quick look under the hood

```
   [ your laptop ]
        │  kubectl kedge / kubectl
        ▼
   ┌─────────────┐
   │  kedge hub  │  ◄── central control plane (Kubernetes + kcp + OIDC)
   └──────┬──────┘
          │  reverse tunnels (outbound from agents)
    ┌─────┴──────────────────┐
    │                        │
┌───▼────┐             ┌─────▼──────┐
│ agent  │             │   agent    │
│ (k8s)  │             │  (server)  │
│cluster │             │  bare metal│
└────────┘             └────────────┘
```

The hub is the only component that needs to be publicly reachable. Agents connect outward — NAT and firewalls are not a problem.

## What's in this documentation

Pick whichever path fits where you are.

- **[Get started](/docs/getting-started/install/)** — install the CLI, log in, connect your first edge.
- **[CLI reference](/docs/cli/)** — every command: auth, orgs and workspaces, edges, agents, SSH, MCP.
- **[Deploy your own hub](/docs/deploy/helm/)** — Helm, ingress options, Cloudflare Tunnel.
- **[Security & tenancy](/docs/security/)** — static tokens, OIDC, organizations, workspaces, service accounts.
- **[Building providers](/docs/providers/)** — extend kedge with your own APIs, controllers, UI, and MCP tools; plus the [catalog](/docs/providers/catalog/) of providers that ship in the box (edges, application templates, git repos, hosted AI agents, fleet query, and more).
