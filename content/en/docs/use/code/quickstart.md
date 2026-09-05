---
title: "Connect GitHub and create a repository"
description: "Verify your source-control connection in the selected workspace."
weight: 1
doc_type: "Tutorial"
---

Connect your GitHub account to Faros and create a test repository whose owner and visibility you can verify in GitHub.

## Prerequisites

Sign in to Faros SaaS, enable **Code** and select the workspace that will own the repository resource. You need a GitHub credential that can perform the intended action for the selected user or organization.

## Connect and create

1. Open Code’s **Connections** view and choose **Connect with GitHub** when OAuth is available. Complete the GitHub authorization for the account or organization that should own the repository. If OAuth is not available, choose **Add token manually** and provide a GitHub personal access token through the form; do not paste it into a manifest or chat.
2. Check that the connection is ready, and confirm that the GitHub identity can access the intended owner. A connection can be healthy while still lacking permission for a particular organization or repository operation.
3. Open **Repositories**, choose **Create repository**, select the connection and owner, enter the repository name, and choose the intended visibility. Use a disposable repository for this tutorial.
4. Wait for reconciliation, then open the resulting repository on GitHub and verify its owner, visibility, and default branch there.

## Expected result and recovery

The repository appears in Faros and in the intended GitHub account with the chosen visibility.

If GitHub rejects the request, inspect the connection and upstream organization policy. Faros workspace permissions do not override GitHub permissions.

Deleting a managed repository also removes it from GitHub. Preserve any content you want to keep before removing the test repository.

## Optional CLI diagnostics

Select the [same workspace](/docs/reference/cli/resources/) and discover its provider API:

```bash
kubectl api-resources --api-group=code.faros.sh
kubectl get connections.code.faros.sh
kubectl get repositories.code.faros.sh
kubectl get repositories.code.faros.sh RESOURCE-NAME -o yaml
```

Replace `RESOURCE-NAME` with the object you created. Inspect its status, reported conditions, and resource references to trace setup failures. An empty list is different from a forbidden request or missing API. Keep credentials in the supported connection flow; do not copy connection secrets into example manifests or shared diagnostic output.


Next: [repository tasks](/docs/use/code/repositories/).
