---
title: Authentication
description: Authentication, organizations and workspaces, service accounts, platform admins.
weight: 40
---

Three pieces make up faros's security story:

- **Authentication** — how a person or machine proves who they are: a [static token](/docs/self-hosting/static-token/) or [OIDC via Dex](/docs/self-hosting/oidc/).
- **Tenancy** — where they can act: [organizations, workspaces, memberships, and service accounts](/docs/administration/workspaces/). Every identity gets a personal organization automatically, so single-user hubs never have to think about this.
- **Platform administration** — the `hub.adminUsers` allowlist unlocks the hub's admin surface (provider onboarding, root-level views). Nobody is a platform admin by default — not even static-token users.

## Picking an auth method

| Method | Use case | Setup |
|:-------|:---------|:------|
| **[Static token](/docs/self-hosting/static-token/)** | Personal home lab, dev, CI | Generate tokens; list them in Helm values; log in with `--token` |
| **[OIDC (Dex)](/docs/self-hosting/oidc/)** | Teams, audit logging, SSO | Deploy Dex + an identity backend (GitHub, Google, LDAP) |

Choose the authentication method for your deployment:

| Scenario | Recommendation |
|:---------|:---------------|
| Single user, home lab | Static token |
| Small team | OIDC with GitHub or Google |
| Enterprise | OIDC with LDAP / SAML |
| CI / CD automation | Static token, or a workspace [service account](/docs/administration/workspaces/#service-accounts) |

You can switch methods later by re-deploying the Helm chart with different values — hub state is unaffected, and both methods can be enabled at once.
