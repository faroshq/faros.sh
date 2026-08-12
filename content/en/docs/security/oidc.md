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
    - id: faros
      name: Faros
      public: true          # faros is a PKCE public client — no client secret
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

Update your hub values — remove `staticAuthTokens` (or keep them; both methods can coexist), add the `idp` section:

```yaml
hub:
  hubExternalURL: "https://hub.example.com"

idp:
  issuerURL: "https://idp.example.com"
  clientID: "faros"
```

There is **no client secret** — the hub, CLI, and portal are PKCE public clients. That's why the Dex client above is marked `public: true`.

If your IdP serves a certificate signed by a private CA, put the PEM bundle in a Secret and reference it — the hub then verifies the issuer properly instead of you disabling TLS checks:

```yaml
idp:
  issuerURL: "https://idp.example.com"
  clientID: "faros"
  caSecretName: "idp-ca"      # Secret with the PEM bundle
  caSecretKey: "tls.crt"      # key inside the Secret
```

Roll out:

```bash
helm upgrade --install faros oci://ghcr.io/faroshq/charts/faros-hub \
  -f values.yaml \
  --namespace faros-system
```

## 3. Log in

```bash
kubectl faros login --hub-url https://hub.example.com
```

The browser opens to the hub's `/auth/authorize` endpoint, which redirects to Dex, which redirects to your identity backend (GitHub, Google, …). After you authorize, the CLI receives your kubeconfig over a one-time localhost callback. The kubeconfig uses an exec credential plugin (`faros get-token`) that refreshes tokens automatically — see [Login & Authentication](/docs/cli/login/).

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

**TLS errors on the issuer** — If Dex's certificate is signed by a private CA, set `idp.caSecretName` / `idp.caSecretKey` (see above). As a last resort for throwaway dev setups, `hub.devMode: true` skips issuer TLS verification — never in production.

**`unauthorized_client` / secret prompts** — The Dex client must be `public: true` with no `secret`. faros does PKCE; a confidential client configuration will fail.

**Dex logs**:

```bash
kubectl -n dex logs -l app.kubernetes.io/name=dex
```

**Discovery sanity check**:

```bash
curl -s https://idp.example.com/.well-known/openid-configuration | jq .
```
