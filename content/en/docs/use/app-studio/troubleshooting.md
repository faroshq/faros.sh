---
title: "Troubleshoot App Studio"
description: "Identify the failing layer before retrying a task."
weight: 80
doc_type: "Guide"
---

## Check workspace and access

Confirm the selected organization/workspace and that the provider is enabled there. Try a read-only operation using the same identity as the failing action. A successful administrator action does not prove another identity has access.

## Diagnose by symptom

| Symptom | Check | Resolution |
| --- | --- | --- |
| Project preparation cannot finish | Read the missing model, repository, or template message. | Fix that workspace prerequisite; return to Prepare before creating another project. |
| Preview does not open | Check the bound development Instance conditions and whether the viewer is a workspace member. | Resolve runtime readiness first; then correct preview access separately from production invitations. |
| No Verified release / Deploy control disabled | Compare the intended commit with the Publishing pipeline and open View build if present. | Fix the failed component build or missing image. Use Check again after new build evidence is available. |
| Production is running but a recipient is denied | Check Manage access using the recipient identity, not an administrator session. | Correct the invitation or intended visibility; do not make the app public to diagnose a private invitation. |
| A removed invite still opens the app | Check workspace membership and whether a production access session already exists. | Workspace members retain broad access; an existing gate session can last up to 15 minutes after grant revocation. |

## Gather evidence from the CLI

Use the failing user's [workspace context](/docs/reference/cli/resources/):

```bash
kubectl api-resources --api-group=ai.faros.sh
kubectl auth can-i get projects.ai.faros.sh
kubectl get projects.ai.faros.sh PROJECT-NAME -o yaml
kubectl api-resources --api-group=infrastructure.faros.sh
```

A missing API points to enablement/discovery; a denied operation points to authorization. If the Project is readable but its environment is stuck, [trace its Infrastructure binding](/docs/use/app-studio/development/#trace-the-environment-from-the-cli) and inspect the referenced Instance's conditions. Redact credentials, private URLs, and application data from collected output.

## Collect useful evidence

Record the resource name, failing step, time, status conditions, and request/run ID where available. Share these with your operator, excluding bearer tokens, credentials, and private application data.

If the provider itself is unavailable, use [App Studio self-hosting](/docs/self-hosting/providers/app-studio/) for operator checks. Once resolved, repeat the verification step in the [quickstart](/docs/use/app-studio/quickstart/).
