---
title: "Code"
description: "Connect GitHub and manage repositories."
weight: 14
doc_type: "Overview"
provider: "code"
cascade:
  provider: code
---

Code connects GitHub repositories to your Faros workspace. It provides repository resources and connection workflows that other capabilities can use when they need source code.

[Get started: connect a repository](/docs/use/code/quickstart/).

## When to use Code

Use Code to connect the GitHub identity and repositories needed by your work. Inspect the repository connection before starting a workflow that depends on reading or updating source.

## How it fits together

App Studio uses Code for project repositories. GitHub remains the source hosting system and enforces the permissions of the connected credential.

## Before you start

Code enabled and a GitHub credential with access to the intended repositories. Select the workspace where you intend to create or use resources. [Enable the provider](/docs/use/workspaces/enable-provider/) if needed.

## Availability and permissions

Check your hub’s catalog and deployed versions. Actions are subject to workspace access and provider-specific authorization; connected services also enforce their own permissions.

## Where your data lives

Resource handles belong to your workspace. Git content lives at GitHub; commit and checkout bundles are handled by the provider.

## Start here

- [Quickstart](/docs/use/code/quickstart/)
- [Troubleshooting](/docs/use/code/repositories/#troubleshooting)
- [API reference](/docs/reference/providers/code/)
- [Self-host Code](/docs/self-hosting/providers/code/)

[Implementation reference](https://github.com/faroshq/faros/blob/main/providers/code/README.md).
