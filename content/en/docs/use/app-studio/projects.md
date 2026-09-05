---
title: "Projects, sessions, and repositories"
description: "Keep conversations and source code attached to the right project."
weight: 2
doc_type: "Guide"
---

## Prerequisites

Select the intended workspace and verify that App Studio and Code are enabled. Use a GitHub connection with access to the repository and branch the project should use.

## Work in a project

Select the workspace and open an existing Project. Projects hold the application’s intent and bindings; Sessions identify conversations. Start a new conversation when the task changes, while keeping work in the same project.

## Connect a repository

Configure a [Code connection](/docs/use/code/quickstart/) in the same workspace before requesting repository-backed work. Check the repository and branch associated with the project before making changes. A GitHub credential must have the necessary upstream access; workspace membership alone does not grant it.

After the assistant changes files, review the resulting diff and commit/build status. Confirm that the changes reached the intended repository rather than relying only on the chat’s description.

## Recover from a failed action

Inspect the project’s status and the failed step. If a repository action fails, check the Code connection and upstream permissions. Avoid creating a second project to retry a transient repository error.

Expected result: the project remains attached to the intended repository and branch, and the assistant’s file changes are visible in the reviewed diff and commit/build status. If the chat reports success but the diff or upstream repository is unchanged, treat the repository action as failed and repair the connection before retrying.

Next: [development environments](/docs/use/app-studio/development/).
