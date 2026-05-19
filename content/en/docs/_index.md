---
title: kedge Documentation
description: One control plane for Kubernetes clusters and bare-metal servers anywhere. Open source, Apache 2.0, free forever.
weight: 1
---

**kedge** connects your distributed Kubernetes clusters and bare-metal servers through a single hub — no inbound firewall rules required.

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
