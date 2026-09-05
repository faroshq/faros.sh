---
title: "Service accounts and credentials"
description: "Use a workspace identity for automation."
weight: 3
doc_type: "Guide"
---

## Create and verify

1. Select the intended workspace and open its service-account settings using an authorized administrator identity.
2. Create an account dedicated to the automation task.
3. Store the returned token securely when it is shown. Do not put it in source control or chat.
4. Configure the automation with the workspace endpoint and token.
5. Test one intended operation and one operation that should be denied.

Service-account credentials are distinct from human OIDC sessions, provider-controller credentials, and per-MCPServer credentials. Document which principal an integration actually uses.

## Verify the automation identity from a terminal

Configure a separate kubeconfig using the issued workspace endpoint and service-account credential. Keep it outside source control and restrict file access. Use that file explicitly for every check so your personal session cannot mask a permissions problem.

For an account intended to read Infrastructure instances:

```bash
kubectl --kubeconfig ./automation.kubeconfig auth can-i list instances.infrastructure.faros.sh
kubectl --kubeconfig ./automation.kubeconfig get instances.infrastructure.faros.sh
```

Choose a resource and operation that your policy denies and check it with `auth can-i` as well. The expected results depend on the role you granted; do not grant extra access merely to make the example pass. Repeat both checks after rotating credentials. The Faros CLI has no dedicated service-account creation command in the documented source baseline; retain the supported console creation flow.

## Rotate or remove

Create a replacement credential using the supported lifecycle, update the consumer, verify its operation, then revoke the old credential. Remove test accounts after use. For API details, consult the deployed hub and the [tenancy reference](/docs/reference/).

For external AI assistants, see [MCP authentication](/docs/use/mcp/).
