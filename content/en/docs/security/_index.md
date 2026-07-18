---
title: Security & Tenancy
description: Authentication, organizations and workspaces, service accounts, platform admins.
weight: 40
---

Three pieces make up kedge's security story:

- **Authentication** — how a person or machine proves who they are: a [static token](/docs/security/static-token/) or [OIDC via Dex](/docs/security/oidc/).
- **Tenancy** — where they can act: [organizations, workspaces, memberships, and service accounts](/docs/security/tenancy/). Every identity gets a personal organization automatically, so single-user hubs never have to think about this.
- **Platform administration** — the `hub.adminUsers` allowlist unlocks the hub's admin surface (provider onboarding, root-level views). Nobody is a platform admin by default — not even static-token users.

## Picking an auth method

| Method | Use case | Setup |
|:-------|:---------|:------|
| **[Static token](/docs/security/static-token/)** | Personal home lab, dev, CI | Generate tokens; list them in Helm values; log in with `--token` |
| **[OIDC (Dex)](/docs/security/oidc/)** | Teams, audit logging, SSO | Deploy Dex + an identity backend (GitHub, Google, LDAP) |

The hosted hub at [console.faros.sh](https://console.faros.sh) uses OIDC. If you self-host:

| Scenario | Recommendation |
|:---------|:---------------|
| Single user, home lab | Static token |
| Small team | OIDC with GitHub or Google |
| Enterprise | OIDC with LDAP / SAML |
| CI / CD automation | Static token, or a workspace [service account](/docs/security/tenancy/#service-accounts) |

You can switch methods later by re-deploying the Helm chart with different values — hub state is unaffected, and both methods can be enabled at once.
