---
title: OIDC (Dex)
description: Sign in to the hub with GitHub, Google, LDAP, or any OIDC provider via Dex.
weight: 2
---

For teams or anywhere you want real per-user identities, use OIDC. The hub itself doesn't care which OIDC provider you use, but the easiest path is [Dex](https://dexidp.io/) — it sits in front of GitHub / Google / LDAP / SAML / OIDC backends and presents one OIDC endpoint to the hub.

```
Browser ──▶ Hub ──▶ Dex ──▶ Identity backend (GitHub, Google, LDAP, …)
   │                                              │
   └────────── OIDC redirect ────────────────────┘
```

## Prerequisites

- A publicly reachable URL for Dex (or in-cluster access if you don't expose it)
- An identity backend (GitHub OAuth app, Google credentials, LDAP server, etc.)
- The hub already deployed somewhere — we'll switch it from static-token to OIDC

## 1. Deploy Dex

```bash
helm repo add dex https://charts.dexidp.io
helm repo update
kubectl create namespace dex
```

A small PVC for the SQLite database:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: dex-data
  namespace: dex
spec:
  accessModes: [ReadWriteOnce]
  resources:
    requests:
      storage: 1Gi
```

Dex values (`dex-values.yaml`):

```yaml
config:
  issuer: https://idp.example.com

  storage:
    type: sqlite3
    config:
      file: /var/dex/dex.db

  web:
    http: 0.0.0.0:5556

  staticClients:
    - id: kedge
      name: Kedge
      secret: "<generate-a-secret>"
      redirectURIs:
        - https://hub.example.com/auth/callback

  connectors:
    - type: github
      id: github
      name: GitHub
      config:
        clientID: <github-client-id>
        clientSecret: <github-client-secret>
        redirectURI: https://idp.example.com/callback
        # Optional — restrict to an org
        # org: your-org

volumes:
  - name: dex-data
    persistentVolumeClaim:
      claimName: dex-data

volumeMounts:
  - name: dex-data
    mountPath: /var/dex

service:
  type: ClusterIP

ingress:
  enabled: true
  className: "nginx"     # or cloudflare-tunnel, etc.
  hosts:
    - host: idp.example.com
      paths:
        - path: /
          pathType: Prefix
```

Install Dex:

```bash
helm upgrade --install dex dex/dex \
  --namespace dex \
  -f dex-values.yaml
```

Verify:

```bash
curl -s https://idp.example.com/.well-known/openid-configuration | head -5
```

## 2. Configure the hub for OIDC

Update your hub values — remove `staticAuthToken`, add the `idp` section:

```yaml
hub:
  hubExternalURL: "https://hub.example.com"
  devMode: false           # Real OIDC needs real TLS verification

idp:
  issuerURL: "https://idp.example.com"
  clientID: "kedge"
  clientSecret: "<same-secret-as-in-dex-staticClients>"
```

Roll out:

```bash
helm upgrade --install kedge oci://ghcr.io/faroshq/charts/kedge-hub \
  -f values.yaml \
  --namespace kedge-system
```

## 3. Log in

```bash
kubectl kedge login --hub-url https://hub.example.com
```

The browser opens to the hub's `/auth` endpoint, which redirects to Dex, which redirects to your identity backend (GitHub, Google, …). After you authorize, the CLI receives the resulting OIDC token and writes it to your kubeconfig.

## Identity connectors

Dex supports many backends. The most common configurations:

### GitHub

1. **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.**
2. **Authorization callback URL**: `https://idp.example.com/callback`
3. Add to Dex `connectors`:

```yaml
- type: github
  id: github
  name: GitHub
  config:
    clientID: <github-client-id>
    clientSecret: <github-client-secret>
    redirectURI: https://idp.example.com/callback
    # Optional — restrict to organization members
    org: your-org
```

### Google

1. Create OAuth credentials in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Add to Dex `connectors`:

```yaml
- type: google
  id: google
  name: Google
  config:
    clientID: <google-client-id>
    clientSecret: <google-client-secret>
    redirectURI: https://idp.example.com/callback
    # Optional — restrict to a Workspace domain
    hostedDomains:
      - example.com
```

### LDAP

```yaml
- type: ldap
  id: ldap
  name: LDAP
  config:
    host: ldap.example.com:636
    insecureNoSSL: false
    bindDN: cn=admin,dc=example,dc=com
    bindPW: admin-password
    userSearch:
      baseDN: ou=users,dc=example,dc=com
      filter: "(objectClass=person)"
      username: uid
      idAttr: uid
      emailAttr: mail
      nameAttr: cn
```

## Troubleshooting

**`invalid issuer` from the hub** — `config.issuer` in Dex must match `idp.issuerURL` in the hub *byte-for-byte*. Same scheme, no trailing slash.

**Callback URL mismatch** — `redirectURIs` in Dex's `staticClients` must be exactly `<hubExternalURL>/auth/callback`. Mismatched scheme or path is the usual culprit.

**TLS errors on the issuer** — If Dex is using a self-signed cert (don't, in prod), set `hub.devMode: true` to skip TLS verification of the OIDC issuer. Don't ship that to production.

**Dex logs**:

```bash
kubectl -n dex logs -l app.kubernetes.io/name=dex
```

**Discovery sanity check**:

```bash
curl -s https://idp.example.com/.well-known/openid-configuration | jq .
```
