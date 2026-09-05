---
title: "Add a teammate and manage roles"
description: "Grant access at the organization or workspace scope."
weight: 2
doc_type: "Guide"
---

## Prerequisites

Use an identity allowed to manage membership in the selected organization or workspace. Confirm the person’s identity and the scope you intend to grant.

## Add and verify access

1. Select the organization and open its membership/settings controls, or open the intended workspace’s member controls.
2. Add the person using an existing user identifier or the supported email flow. If the console offers an invitation flow, verify that your deployment’s identity provider supports it; otherwise the person must sign in first.
3. Choose the appropriate scope and role. Organization membership and workspace membership are not interchangeable.
4. Have the person sign in with their own identity, select the intended workspace, and verify access.

Do not verify access only from your admin session. Review [the tenancy model](/docs/administration/workspaces/) before granting organization-wide access.

## Verify from the teammate's CLI

Have the teammate authenticate using their own credential, then follow [workspace selection](/docs/reference/cli/resources/). For a workspace intended to expose App Studio:

```bash
kubectl faros use
kubectl auth can-i list projects.ai.faros.sh
kubectl get projects.ai.faros.sh
```

Expect the target workspace to be selectable and the intended read operation to succeed. Test an operation the role should not allow with `kubectl auth can-i VERB RESOURCE` using a real resource and verb from your access policy. A successful check from an administrator's kubeconfig is not a substitute. Do not use impersonation unless the deployment explicitly grants and supports it.

## Change or remove access

Review affected workspaces and application grants, then change the membership or remove it. Ask the person to verify the resulting access boundary. If the person still has access, check other organization memberships, workspace grants, and separate application grants.

Next: use [service accounts](/docs/administration/service-accounts/) for automation rather than sharing a personal credential.
