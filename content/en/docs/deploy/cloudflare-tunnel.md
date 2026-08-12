---
title: Cloudflare Tunnel
description: Expose your hub via Cloudflare Tunnel — no public IP, free TLS, free DDoS protection.
weight: 3
---

[Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) opens an outbound connection from your cluster to Cloudflare's edge. Cloudflare then routes inbound traffic to your hub through that tunnel — no inbound firewall rules, no public IP, no port forwards. It's the smoothest way to put a home-lab hub on the internet.

## Why Cloudflare Tunnel

| Challenge | Cloudflare Tunnel solves it because |
|:----------|:------------------------------------|
| No public IP | Tunnel connects outbound — no inbound ports needed |
| Dynamic IP | DNS managed by Cloudflare automatically |
| NAT / CGNAT | Works through any NAT |
| TLS certs | Free certs via Let's Encrypt + DNS validation |
| DDoS | Built into Cloudflare's edge |
| Security | No exposed ports on your network |

```
Remote Agent → Cloudflare Edge ← Tunnel Pod (your cluster)
                                       ↓
                                Your Hub Service
```

## Prerequisites

| Requirement | Notes |
|:------------|:------|
| Cloudflare account | [Free tier](https://dash.cloudflare.com/sign-up) is fine |
| Domain on Cloudflare | DNS for the domain must be managed by Cloudflare |
| API token | With `Cloudflare Tunnel: Edit` and `DNS: Edit` |
| Account ID | Found in the dashboard sidebar |

### Create a Cloudflare API token

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **My Profile** → **API Tokens** → **Create Token** → **Custom Token**.
2. Permissions:
   - `Account` → `Cloudflare Tunnel` → `Edit`
   - `Zone` → `DNS` → `Edit`
3. Restrict the zone to your domain (or "All zones" if you don't care).
4. **Continue to summary** → **Create Token**. Copy the token; you can't see it again.

### Find your account ID

Any domain page in the dashboard → right sidebar → **API** → **Account ID**.

## Step 1 — Install cert-manager

cert-manager issues TLS certificates for the hub. We use DNS-01 validation via Cloudflare so cert issuance works even before the hub is publicly reachable.

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.18.0/cert-manager.yaml
kubectl -n cert-manager wait --for=condition=ready pod \
  -l app.kubernetes.io/instance=cert-manager --timeout=120s
```

## Step 2 — Configure DNS-01 validation

Store the API token as a secret in the `cert-manager` namespace:

```bash
kubectl create secret generic cloudflare-api-token \
  --namespace cert-manager \
  --from-literal=api-token="YOUR_CLOUDFLARE_API_TOKEN"
```

Create a `ClusterIssuer` that uses it:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod-account-key
    solvers:
      - dns01:
          cloudflare:
            apiTokenSecretRef:
              name: cloudflare-api-token
              key: api-token
```

Verify:

```bash
kubectl get clusterissuer letsencrypt-prod
# letsencrypt-prod   True    30s
```

## Step 3 — Install the Cloudflare Tunnel ingress controller

```bash
helm repo add strrl.dev https://helm.strrl.dev
helm repo update

helm upgrade --install --wait \
  -n cloudflare-tunnel-ingress-controller --create-namespace \
  cloudflare-tunnel-ingress-controller \
  strrl.dev/cloudflare-tunnel-ingress-controller \
  --set=cloudflare.apiToken="YOUR_CLOUDFLARE_API_TOKEN" \
  --set=cloudflare.accountId="YOUR_CLOUDFLARE_ACCOUNT_ID" \
  --set=cloudflare.tunnelName="faros-tunnel"
```

In the [Cloudflare Zero Trust dashboard](https://one.dash.cloudflare.com) → **Networks → Tunnels** you should see `faros-tunnel` as **Healthy**.

## Step 4 — Deploy the hub

```yaml
# values-cloudflare.yaml
hub:
  hubExternalURL: "https://hub.yourdomain.com"
  devMode: false

  # Static tokens (list; each is its own tenant user) — or omit for OIDC
  staticAuthTokens:
    - "<openssl rand -hex 32>"

  tls:
    selfSigned:
      enabled: false
    certManager:
      enabled: true
      issuerRef:
        name: letsencrypt-prod
        kind: ClusterIssuer
      dnsNames:
        - "hub.yourdomain.com"

ingress:
  enabled: true
  className: "cloudflare-tunnel"
  hosts:
    - host: hub.yourdomain.com
      paths:
        - path: /
          pathType: ImplementationSpecific
```

```bash
helm upgrade --install faros oci://ghcr.io/faroshq/charts/faros-hub \
  -f values-cloudflare.yaml \
  --namespace faros-system \
  --create-namespace
```

## Step 5 — Verify

```bash
# TLS cert ready?
kubectl -n faros-system get certificate
# faros-faros-hub-tls   True   ...

# Ingress address (will be xxxx.cfargotunnel.com)
kubectl get ingress -n faros-system

# End-to-end
curl -s https://hub.yourdomain.com/healthz
# ok

# Log in
kubectl faros login --hub-url https://hub.yourdomain.com
```

## Exposing additional services through the same tunnel

The tunnel can carry multiple hostnames. If you're running Dex for OIDC, give it the same `ingressClassName`:

```yaml
ingress:
  enabled: true
  className: "cloudflare-tunnel"
  hosts:
    - host: idp.yourdomain.com
      paths:
        - path: /
          pathType: ImplementationSpecific
```

The controller creates the CNAME automatically.

## Troubleshooting

### Tunnel not connecting

```bash
kubectl -n cloudflare-tunnel-ingress-controller logs \
  -l app.kubernetes.io/name=cloudflare-tunnel-ingress-controller
```

Common causes:

- **Invalid API token** — Re-create with `Cloudflare Tunnel: Edit` + `DNS: Edit`
- **Wrong account ID** — Double-check in the dashboard
- **Tunnel name conflict** — Delete stale tunnels from the Cloudflare dashboard

### Certificate not issuing

```bash
kubectl -n cert-manager logs -l app=cert-manager
kubectl -n faros-system describe certificate
kubectl -n faros-system get certificaterequest,order,challenge
```

Most failures here are missing `DNS:Edit` on the API token, or the token doesn't cover the zone.

### DNS not resolving

The ingress controller creates a CNAME pointing at `xxxx.cfargotunnel.com`. Check it propagated:

```bash
dig hub.yourdomain.com CNAME
```

### kind on macOS — slow DNS-01 challenges

If `cert-manager` keeps re-trying the DNS-01 challenge on a kind cluster, force it to use public resolvers:

```bash
kubectl -n cert-manager patch deployment cert-manager --type=json -p='[
  {"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--dns01-recursive-nameservers=1.1.1.1:53,8.8.8.8:53"},
  {"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--dns01-recursive-nameservers-only"}
]'
```

## References

- [Cloudflare Tunnel docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
- [Cloudflare Zero Trust dashboard](https://one.dash.cloudflare.com)
- [Tunnel ingress controller](https://github.com/STRRL/cloudflare-tunnel-ingress-controller)
- [Security](/docs/security/) — pick an auth method for the hub
