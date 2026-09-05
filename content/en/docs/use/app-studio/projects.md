---
title: "Projects, sessions, and repositories"
description: "Keep conversations and source code attached to the right project."
weight: 2
doc_type: "Guide"
---

## Work in a project

Select the workspace and open an existing Project. Projects hold the application’s intent and bindings; Sessions identify conversations. Start a new conversation when the task changes, while keeping work in the same project.

## Connect a repository

Configure a [Code connection](/docs/use/code/quickstart/) in the same workspace before requesting repository-backed work. Check the repository and branch associated with the project before making changes. A GitHub credential must have the necessary upstream access; workspace membership alone does not grant it.

After the assistant changes files, review the resulting diff and commit/build status. Confirm that the changes reached the intended repository rather than relying only on the chat’s description.

## Recover from a failed action

Inspect the project’s status and the failed step. If a repository action fails, check the Code connection and upstream permissions. Avoid creating a second project to retry a transient repository error.

Next: [development environments](/docs/use/app-studio/development/).
