---
title: "Connect GitHub and create a repository"
description: "Verify your source-control connection in the selected workspace."
weight: 1
doc_type: "Tutorial"
---

## Prerequisites

Enable **Code** and select the workspace that will own the repository resource. You need a GitHub credential that can perform the intended action for the selected user or organization.

1. Open Code’s **Connections** view and configure a GitHub connection using the credential method your deployment exposes.
2. Check connection status before creating repository resources.
3. Open **Repositories**, create a repository using that connection, and select the intended owner and visibility.
4. Wait for reconciliation, then open the resulting repository on GitHub and verify owner and visibility there.

If GitHub rejects the request, inspect the connection and upstream organization policy. Faros workspace permissions do not override GitHub permissions.

Use a disposable repository for this tutorial. Before deleting it, inspect the provider’s deletion behavior and preserve any content you want to keep.

## Verify resources from the CLI

Select the [same workspace](/docs/reference/cli/resources/) and discover its provider API:

```bash
kubectl api-resources --api-group=code.faros.sh
kubectl get connections.code.faros.sh
kubectl get repositories.code.faros.sh
kubectl get repositories.code.faros.sh RESOURCE-NAME -o yaml
```

Replace `RESOURCE-NAME` with the object you created. Inspect its status, reported conditions, and resource references to trace setup failures. An empty list is different from a forbidden request or missing API. Keep credentials in the supported connection flow; do not copy connection secrets into example manifests or shared diagnostic output.


Next: [repository tasks](/docs/use/code/repositories/).
