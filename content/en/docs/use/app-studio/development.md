---
title: "Development environments"
description: "Inspect preview, logs, and runtime readiness."
weight: 3
doc_type: "Guide"
---

## Prerequisites

Your project must have a development-capable Infrastructure template and a valid environment binding. Select the project’s workspace before opening its development tools.

1. Open the project’s development environment and inspect its status.
2. Wait for the template instance and relevant components to become ready.
3. Open preview and check the application. Use logs to diagnose startup, dependency, or routing failures.
4. After changing files, confirm sync and runtime behavior. Restart only when needed, then recheck status and preview.

Development environments run through Infrastructure. App Studio does not need direct credentials to another provider’s runtime cluster. A preview permission failure and an application startup failure require different fixes: check access for the first and component logs for the second.

Do not treat development preview as a public hosting URL. Next: [publish your application](/docs/use/app-studio/publishing/).

## Trace the environment from the CLI

Select the [project's workspace](/docs/reference/cli/resources/) and inspect the project:

```bash
kubectl get projects.ai.faros.sh
kubectl get projects.ai.faros.sh PROJECT-NAME -o yaml
```

In `spec.environments`, find the intended development environment and its Infrastructure binding. Its `resourceRef` identifies the resource kind and, when explicit, the name. For an owned Instance, name resolution uses `resourceRef.name`, then the resolved binding values' `name`, then `<project-name>-<binding-name>`. Confirm the matching Instance's `metadata.ownerReferences` points to this Project before treating it as the development runtime. Compare that binding with `status.environments` for phase, URL, and preview URL information.

```bash
kubectl get instances.infrastructure.faros.sh INSTANCE-NAME -o yaml
kubectl get instances.infrastructure.faros.sh INSTANCE-NAME --watch
```

Inspect phase, message, and conditions. Stop the watch with Ctrl-C. If no matching Instance exists, inspect the binding configuration and project/template setup before looking for runtime pods. Do not delete an App Studio-owned instance as a restart mechanism.

These commands query Faros resources. Runtime pod logs require the operator's hosting/runtime context; a Faros workspace credential does not automatically grant that access.
