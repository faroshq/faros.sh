---
title: "Add a teammate and manage roles"
description: "Grant access at the organization or workspace scope."
weight: 2
doc_type: "Guide"
---

## Prerequisites

Use an organization admin to manage organization membership, or a workspace admin to manage workspace membership. Confirm the person’s email or Faros user UUID and the scope you intend to grant. Faros adds an existing user identity; it does not create an invitation record.

## Add and verify access

1. Open **Settings → Organizations**, select the organization, and find **Organization members**. To grant access to one workspace only, open **Settings → Workspaces**, select the workspace, and find **Workspace members**.
2. Enter the person’s email or Faros user UUID in the member field. The person must already have a Faros user identity; this form does not send an invitation or provision an identity.
3. Choose `member` or `admin`, then select **Add**. Organization roles apply to the organization and its workspaces; a workspace membership grants access only to that workspace.
4. Have the person sign in with their own identity, select the intended workspace, and verify the expected access. Ask them to test one allowed operation and one operation outside the granted role.

Do not verify access only from your admin session. Review [the tenancy model](/docs/administration/workspaces/) before granting organization-wide access.

## Optional CLI diagnostics

Have the teammate authenticate using their own credential, then follow [workspace selection](/docs/reference/cli/resources/). For a workspace intended to expose App Studio:

```bash
kubectl faros use
kubectl auth can-i list projects.ai.faros.sh
kubectl get projects.ai.faros.sh
```

Expect the target workspace to be selectable and the intended read operation to succeed. Test an operation the role should not allow with `kubectl auth can-i VERB RESOURCE` using a real resource and verb from your access policy. A successful check from an administrator's kubeconfig is not a substitute. Do not use impersonation unless the deployment explicitly grants and supports it.

## Change or remove access

Review affected workspaces and application grants before changing a role or using **Remove**. Ask the person to verify the resulting access boundary. If the person still has access, check other organization memberships, workspace grants, and separate application grants. A failed add or role change should be retried only after confirming the acting identity is an admin and the target user identifier is valid.

Next: use [service accounts](/docs/administration/service-accounts/) for automation rather than sharing a personal credential.
