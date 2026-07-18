---
title: Helm Deployment
description: Deploy the kedge hub with Helm — local kind, single-node k3s, or full production.
weight: 1
---

The `kedge-hub` Helm chart deploys **kcp + kedge-hub** as a single StatefulSet. The same chart works for local kind, a single-node k3s on a VPS, or a full production setup behind cert-manager and a real ingress controller.

## Prerequisites

| Tool | Description |
|:-----|:------------|
| `kubectl` | Kubernetes CLI |
| `helm` v3+ | Package manager |
| A target cluster | kind / k3s / EKS / GKE / AKS — any will do |

For production you'll also want **cert-manager** for TLS and an **ingress controller** (nginx, traefik, Cloudflare Tunnel — see [Ingress](/docs/deploy/ingress/)).

## Quick install (local kind)

Try the hub locally first; it's the fastest feedback loop.

```bash
# 1. Cluster
kind create cluster --name kedge

# 2. Values file
cat > values-kind.yaml <<EOF
hub:
  hubExternalURL: "https://localhost:9443"
  devMode: true
  staticAuthTokens:
    - "$(openssl rand -hex 32)"
EOF

# 3. Install
helm upgrade --install kedge \
  oci://ghcr.io/faroshq/charts/kedge-hub \
  -f values-kind.yaml \
  --namespace kedge-system \
  --create-namespace

# 4. Wait
kubectl -n kedge-system wait --for=condition=ready pod \
  -l app.kubernetes.io/name=kedge-hub --timeout=120s

# 5. Port-forward
kubectl -n kedge-system port-forward svc/kedge-kedge-hub 9443:9443
```

In another terminal:

```bash
kubectl kedge login \
  --hub-url https://localhost:9443 \
  --token $(grep -A1 staticAuthTokens values-kind.yaml | tail -1 | tr -d ' -"') \
  --insecure-skip-tls-verify
```

You're in. Try `kubectl kedge edge list`.

## Production deployment

For a public hub you need:

1. A public ingress with a real DNS name (see [Ingress](/docs/deploy/ingress/))
2. TLS — usually via cert-manager + Let's Encrypt
3. Auth — static token for personal use, OIDC for teams (see [Security](/docs/security/))

Example production values:

```yaml
hub:
  hubExternalURL: "https://hub.example.com"
  devMode: false

  # Static tokens (each one becomes its own tenant user). Omit for OIDC-only.
  staticAuthTokens:
    - "<generated-with-openssl-rand-hex-32>"

  # Identities allowed to use the hub admin surface (provider onboarding).
  # Empty = admin surface disabled.
  adminUsers:
    - "you@example.com"

  tls:
    selfSigned:
      enabled: false
    certManager:
      enabled: true
      issuerRef:
        name: letsencrypt-prod
        kind: ClusterIssuer
      dnsNames:
        - "hub.example.com"

# Only for OIDC — can coexist with static tokens. No client secret:
# kedge is a PKCE public client (configure your IdP client as public).
idp:
  issuerURL: "https://idp.example.com"
  clientID: "kedge"

ingress:
  enabled: true
  className: "nginx"   # or traefik, cloudflare-tunnel, etc.
  hosts:
    - host: hub.example.com
      paths:
        - path: /
          pathType: ImplementationSpecific
```

Install or upgrade:

```bash
helm upgrade --install kedge \
  oci://ghcr.io/faroshq/charts/kedge-hub \
  -f values-prod.yaml \
  --namespace kedge-system \
  --create-namespace
```

## Operations

### Logs

```bash
# kcp (the multi-tenant API server)
kubectl -n kedge-system logs kedge-kedge-hub-0 -c kcp

# kedge-hub (the API + tunnel endpoints)
kubectl -n kedge-system logs kedge-kedge-hub-0 -c hub
```

### Upgrading

```bash
helm upgrade kedge oci://ghcr.io/faroshq/charts/kedge-hub \
  -f values.yaml --namespace kedge-system
```

TLS secrets are annotated `helm.sh/resource-policy: keep` so they survive `helm uninstall`. The kcp PVC is also retained.

### Uninstall

```bash
helm uninstall kedge --namespace kedge-system
```

To fully wipe:

```bash
kubectl -n kedge-system delete pvc --all
kubectl -n kedge-system delete secret kedge-kedge-hub-tls
kubectl delete namespace kedge-system
```

## Values reference

### Hub

| Key | Description | Default |
|:----|:------------|:--------|
| `hub.hubExternalURL` | **Required.** External URL agents and users hit. Embedded in kubeconfigs and OIDC callbacks. | `""` |
| `hub.listenAddr` | Pod listen address. | `:9443` |
| `hub.devMode` | Skip OIDC issuer TLS verification. **Dev only.** | `false` |
| `hub.staticAuthTokens` | List of static bearer tokens. Each maps to its own tenant user. | `[]` |
| `hub.adminUsers` | Identities (name/email) allowed to use the hub admin surface. | `[]` |

### Identity provider (OIDC)

| Key | Description | Default |
|:----|:------------|:--------|
| `idp.issuerURL` | OIDC issuer URL. | `""` |
| `idp.clientID` | OIDC client ID (public/PKCE client — no secret). | `kedge` |
| `idp.caSecretName` | Secret holding a PEM CA bundle for a privately-signed IdP. | `""` |
| `idp.caSecretKey` | Key inside that Secret. | `tls.crt` |

### TLS

| Key | Description | Default |
|:----|:------------|:--------|
| `hub.tls.existingSecret` | Use an existing TLS Secret. | `""` |
| `hub.tls.selfSigned.enabled` | Generate a self-signed cert. | `true` |
| `hub.tls.selfSigned.dnsNames` | Extra DNS SANs. | `[]` |
| `hub.tls.selfSigned.ipAddresses` | IP SANs. | `["127.0.0.1"]` |
| `hub.tls.certManager.enabled` | Issue via cert-manager. | `false` |
| `hub.tls.certManager.issuerRef.name` | Issuer name. | `""` |
| `hub.tls.certManager.issuerRef.kind` | Issuer kind. | `ClusterIssuer` |
| `hub.tls.certManager.dnsNames` | Additional DNS SANs. | `[]` |

### Storage & kcp

| Key | Description | Default |
|:----|:------------|:--------|
| `persistence.size` | kcp data PVC size. | `10Gi` |
| `persistence.storageClass` | Storage class. | `""` (cluster default) |
| `kcp.featureGates` | kcp feature gates. | `WorkspaceMounts=true` |
| `kcp.extraArgs` | Extra kcp CLI arguments. | `[]` |

### Networking

| Key | Description | Default |
|:----|:------------|:--------|
| `service.type` | Service type. | `ClusterIP` |
| `ingress.enabled` | Enable Ingress. | `false` |
| `ingress.className` | Ingress class name. | `""` |
