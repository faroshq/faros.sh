---
title: kedge Documentation
description: One control plane for Kubernetes clusters and bare-metal servers anywhere. Open source, Apache 2.0, free forever.
weight: 1
---

**kedge** connects your distributed Kubernetes clusters and bare-metal servers through a single hub. Agents running on each edge establish outbound reverse tunnels, so clusters behind NAT, home-lab Raspberry Pis, and bare-metal machines in remote sites all become reachable through one authenticated endpoint.

No VPNs. No open firewall ports. No kubeconfig juggling.

## Two ways to use it

You can run kedge two ways. Both produce the same CLI experience.

- **[Hosted hub at console.faros.sh](https://console.faros.sh)** — Sign in, register an edge, get a kubeconfig. Useful for trying things out fast.
- **[Self-host your own hub](/docs/deploy/helm/)** — One Helm chart on any Kubernetes cluster, behind a VPS / Cloudflare Tunnel / nginx, whatever you have. No license keys, no telemetry, no usage limits.

## How it works

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
