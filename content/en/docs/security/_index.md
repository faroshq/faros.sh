---
title: Security
description: Authentication options — static tokens and OIDC.
weight: 40
---

The hub supports two authentication methods. Pick whichever fits.

| Method | Use case | Setup |
|:-------|:---------|:------|
| **[Static token](/docs/security/static-token/)** | Personal home lab, dev, CI | Generate a token; paste into Helm values; log in with `--token` |
| **[OIDC (Dex)](/docs/security/oidc/)** | Teams, audit logging, SSO | Deploy Dex + an identity backend (GitHub, Google, LDAP) |

The hosted hub at [console.faros.sh](https://console.faros.sh) uses OIDC with GitHub. If you self-host, pick whichever method suits the number of people who'll use the hub.

| Scenario | Recommendation |
|:---------|:---------------|
| Single user, home lab | Static token |
| Family / friends sharing | Static token (careful with the secret) or OIDC |
| Small team | OIDC with GitHub or Google |
| Enterprise | OIDC with LDAP / SAML |
| CI / CD automation | Static token, scoped to CI |

You can switch between methods later by re-deploying the Helm chart with different values — the hub state is unaffected.
