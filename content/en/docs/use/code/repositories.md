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

## Diagnose errors

Check the connection first, then the repository owner, visibility, branch, and upstream permission. If a resource is pending, inspect its conditions before submitting another creation request.

App Studio users can follow [projects and repositories](/docs/use/app-studio/projects/) for the application workflow.
