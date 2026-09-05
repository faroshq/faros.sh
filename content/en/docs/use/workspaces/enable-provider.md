---
title: "Enable a provider"
description: "Make a capability available in the selected workspace."
weight: 1
doc_type: "Guide"
---

Enable a capability in your workspace and confirm you can open it in the console.

## Prerequisites

Sign in to the Faros SaaS hub and select your organization and workspace. If your organization self-hosts Faros, sign in to that hub instead. Use an identity permitted to enable providers; ask a workspace administrator if the action is unavailable.

## Enable and verify

1. Open **Providers** in the console and choose the provider.
2. Check its dependencies. Enable required providers in the same workspace first.
3. Review the requested permission claims and confirm that the provider should receive that access.
4. Choose **Enable** and accept the required claims.
5. Open the provider and verify that its resource views load.

Enablement binds the provider’s API into your workspace. It does not install the provider service: a platform or organization operator must have registered and started it already.

## When enablement fails

A dependency conflict means a required provider is not enabled. A forbidden response means the current identity cannot perform the action or accept the claims. An unavailable provider may be unhealthy; check with the operator.

## Optional CLI diagnostics {#verify-enablement-from-the-cli}

The console checks above are sufficient for normal use. If a resource view fails to load, you or your administrator can investigate from the same [workspace in the CLI](/docs/reference/cli/resources/). For example, after enabling Infrastructure:

```bash
kubectl api-resources --api-group=infrastructure.faros.sh
kubectl auth can-i list instances.infrastructure.faros.sh
kubectl get instances.infrastructure.faros.sh
```

Expect discovery to list the provider's resources. An empty Instance list can be a successful result in a new workspace. An unavailable API, a forbidden operation, and a provider error need different fixes.

Administrators with APIBinding read access can also inspect binding conditions and accepted permission claims:

```bash
kubectl get apibindings.apis.kcp.io
kubectl get apibindings.apis.kcp.io BINDING-NAME -o yaml
```

Use the discovered binding name; it need not equal the provider display name. Review `spec.permissionClaims` and `status.conditions`. Do not create or patch bindings from an example to bypass the console's dependency and claim review.

## Disable safely

Before disabling, inventory resources and consumers that depend on the provider. Disabling removes the API binding and can remove access to bound resources. It is not a reversible pause or a substitute for a provider’s documented cleanup process.

Next: follow the [quickstart for your capability](/docs/use/). For administrative controls, see [provider access](/docs/administration/providers/) and [self-hosting a provider](/docs/self-hosting/providers/).
