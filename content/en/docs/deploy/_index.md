---
title: Deploy your own hub
description: Run kedge on infrastructure you control.
weight: 30
---

The hosted hub at [console.faros.sh](https://console.faros.sh) is convenient, but everything kedge does is open source — you can run the hub yourself and never touch the SaaS.

Self-hosting takes three decisions:

1. **Where the hub Pod runs** — any Kubernetes cluster will do. Even a single-node k3s on a VPS or NUC is fine. See [Helm Deployment](/docs/deploy/helm/).
2. **How agents reach it from the internet** — you need a stable hostname with TLS. The hub itself is one Pod; the question is what's in front of it (nginx, traefik, a Cloudflare Tunnel, a cloud load balancer…). See [Ingress](/docs/deploy/ingress/).
3. **How users authenticate** — static token for personal use, OIDC via Dex / Auth0 / Okta for teams. See [Security](/docs/security/).

There are no usage limits. Connect as many edges as you want; the hub is just a stateless API server plus the kcp data store (a PVC).
