---
title: faros Documentation
description: The open-source operating system for AI-native platforms — multi-tenant control plane, pluggable providers, tenancy-scoped MCP tools. Apache 2.0, free forever.
weight: 1
---

**faros** is an operating system for platforms. Not a portal that describes your infrastructure — a control plane that runs it, with the same primitives available to humans, controllers, and AI agents.

It gives you four things, and everything else is written against them:

| Primitive | What it is |
|:----------|:-----------|
| **Workspaces** | The isolation boundary. Every team, project, or environment is a [kcp](https://kcp.io) logical cluster with its own API surface, RBAC, and quota. |
| **Providers** | The drivers. Each capability — templates, git, edges, agents — is a separate pod with its own API, controllers, UI, and MCP tools, enabled per workspace. |
| **MCP** | The syscall layer. One endpoint per tenant federates every enabled provider's tools, and each tool inherits that workspace's permissions. |
| **Edges** | The I/O layer. Clusters and servers dial *out* to the hub over a reverse tunnel, so nothing you run needs a public address. |

New here? Read **[Concepts](/docs/concepts/)** for how those four fit together, or jump straight to the [Quickstart](/docs/getting-started/quickstart/).

## Agents get a platform. Not root.

An AI agent operating real infrastructure usually gets one of two things: no access at all, or a god-mode kubeconfig. faros gives it the third option that operating systems settled on decades ago — **userspace**.

- An agent is issued credentials for **one workspace**. It cannot address anything outside it; the request never reaches a place where the answer exists.
- Every action is a **declarative API object** you can list, diff, audit, and revert — not an imperative side door.
- MCP tools are **derived from the same RBAC** that governs the API, so "what can this agent do?" has exactly one answer, changed in one place.

## No inbound rules. No VPNs. No port forwarding.

The hub is the **only** thing with a public endpoint. Everything else stays behind its firewall — and still becomes reachable.

```
   Your laptop                    Hub                           Edge
   ──────────                    ────                          ─────

   kubectl/faros  ──────────►  ┌─────────────┐  ◄─── dial out ──  agent
                               │  faros hub  │  (outbound only)  (k8s cluster)
                               │  (public)   │                   bare metal
                               └─────────────┘                   VM / Raspberry Pi
                                                                 behind NAT/firewall
```

**How it works:** Agents dial *out* to the hub. The hub keeps a reverse tunnel open. Every time you run `kubectl` or `kubectl faros ssh`, your request goes to the hub, which forwards it through that existing tunnel. Nothing needs to reach *into* your network.

### Works where other tools fail

| Your setup | Why faros fits |
|:-----------|:---------------|
| **Home lab** | No router config, no DynDNS — the agent calls home |
| **Raspberry Pi** | Outbound HTTPS works from behind any NAT |
| **Bare metal in a closet** | No public IP needed, no forwarded ports |
| **Kubernetes edge** | Same model — agent connects, you connect to agent |
| **Behind corporate firewall** | Outbound is already allowed; no rule changes |

## Two ways to run it

Both produce the same CLI experience.

- **[Hosted hub at console.faros.sh](https://console.faros.sh)** — sign in, register an edge, get a kubeconfig. Fastest way to try it.
- **[Self-host your own hub](/docs/deploy/helm/)** — one Helm chart on any Kubernetes cluster, behind a VPS / Cloudflare Tunnel / nginx. No license keys, no telemetry, no usage limits.

## What's in this documentation

Pick whichever path fits where you are.

- **[Concepts](/docs/concepts/)** — the OS model: workspaces, providers, MCP, and edges, and how a request flows through them.
- **[Get started](/docs/getting-started/install/)** — install the CLI, log in, connect your first edge.
- **[CLI reference](/docs/cli/)** — every command: auth, orgs and workspaces, edges, agents, SSH, MCP.
- **[Deploy your own hub](/docs/deploy/helm/)** — Helm, ingress options, Cloudflare Tunnel.
- **[Security & tenancy](/docs/security/)** — static tokens, OIDC, organizations, workspaces, service accounts.
- **[Building providers](/docs/providers/)** — write your own driver: APIs, controllers, UI, and MCP tools; plus the [catalog](/docs/providers/catalog/) of providers that ship in the box.
