---
title: "Repositories, collaborators, and builds"
description: "Manage source-control resources without losing upstream context."
weight: 2
doc_type: "Guide"
---

Use the workspace that owns the Code connection and repository resources.

## Commits and checkouts

A RepositoryCommit writes a provider-stored file bundle to a repository; a RepositoryCheckout reads a tree into a bundle. Inspect branch and commit identifiers before passing a bundle to another workflow. File contents are not stored directly in the resource specification.

## Access and artifacts

Create deploy keys and collaborators only for the intended repository. Verify access on GitHub after reconciliation. Remove temporary access when the task finishes.

Packages and repository build status expose upstream artifacts and build results. A requested rebuild is not proof of a successful artifact: inspect the resulting status and the upstream build.

App Studio users can follow [projects and repositories](/docs/use/app-studio/projects/) for the application workflow.

## Troubleshooting

### Check workspace and access

Confirm the selected organization/workspace and that the provider is enabled there. Try a read-only operation using the same identity as the failing action. A successful administrator action does not prove another identity has access.

### Diagnose the provider

Check the GitHub connection, owner, repository permissions, branch, and upstream policy. Read resource conditions and build status before submitting another creation request. Do not create duplicate repositories to work around an authentication failure.

### Collect useful evidence

Record the resource name, failing step, time, status conditions, and request/run ID where available. Share these with your operator, excluding bearer tokens, credentials, and private application data.

If the provider itself is unavailable, use [Code self-hosting](/docs/self-hosting/providers/code/) for operator checks. Once resolved, repeat the verification step in the [quickstart](/docs/use/code/quickstart/).
