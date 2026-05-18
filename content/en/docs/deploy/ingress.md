---
title: Ingress
description: Make your hub reachable from the internet — Cloudflare Tunnel, port forwarding, mesh VPN, or cloud LB.
weight: 2
---

For agents and users to reach your hub, it needs a public URL with TLS. The hub itself is one Pod listening on `:9443` — what gets you from "Pod in a cluster" to "`https://hub.example.com`" depends on your environment.

## The challenge

For kedge to work with remote agents, the hub must be reachable from:

- **Agents** — running on edges that establish reverse tunnels
- **Users** — running the CLI from anywhere
- **OIDC callbacks** — your browser → hub → identity provider → hub

In a home lab you usually face one or more of:

| Challenge | Why it bites |
|:----------|:-------------|
| No public IP | Most ISPs use CGNAT or dynamic IPs |
| NAT / firewall | Router blocks inbound connections |
| TLS certs | Need a valid cert for HTTPS |
| DNS | Need a stable hostname |

## Pick the option that fits

| Option | Best for | Complexity | Needs public IP? |
|:-------|:---------|:-----------|:-----------------|
| [Cloudflare Tunnel](/docs/deploy/cloudflare-tunnel/) | Home labs, no public IP | Medium | No |
| Port forwarding | Static IP, simple | Low | Yes |
| Tailscale / ZeroTier | Private mesh | Low | No |
| Cloud Load Balancer | EKS / GKE / AKS | Low | Yes (provided) |

> **Recommended for home labs:** [Cloudflare Tunnel](/docs/deploy/cloudflare-tunnel/) — no public IP needed, free TLS, free DDoS protection.

## Port forwarding (static IP)

If your ISP gives you a static public IP and you can forward ports:

1. **Forward port 443** on your router → your cluster's ingress controller
2. **Install an ingress controller** (nginx, traefik, etc.)
3. **Point DNS** at your public IP
4. **TLS** via cert-manager with HTTP01 challenge

Example values:

```yaml
hub:
  hubExternalURL: "https://hub.yourdomain.com"
  tls:
    certManager:
      enabled: true
      issuerRef:
        name: letsencrypt-prod
        kind: ClusterIssuer

ingress:
  enabled: true
  className: "nginx"
  hosts:
    - host: hub.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
```

> kedge uses HTTP/1.1 + WebSockets for all communication — works with any reverse proxy. No gRPC passthrough, no HTTP/2 termination, no ALPN gymnastics required.

## Tailscale / ZeroTier (private mesh)

If you don't want a public-facing hub, run a mesh VPN.

1. Install Tailscale or ZeroTier on the hub's node
2. Install it on every machine that needs to reach the hub (CLI users, edge agents)
3. Use the mesh IP / MagicDNS hostname as `hub.hubExternalURL`

This works well when everyone is on the same mesh; less convenient if you need to onboard people outside it.

## Cloud Load Balancer

On EKS / GKE / AKS, use a `LoadBalancer` service:

```yaml
hub:
  hubExternalURL: "https://hub.yourdomain.com"

service:
  type: LoadBalancer
  annotations:
    cloud.google.com/load-balancer-type: "External"   # GKE example

ingress:
  enabled: false   # LB serves the Service directly
```

The cloud provider assigns a public IP — point your DNS at it and you're done.

## Next

- [Cloudflare Tunnel walkthrough](/docs/deploy/cloudflare-tunnel/)
- [Security](/docs/security/) — pick an auth method after you've decided how to expose the hub
