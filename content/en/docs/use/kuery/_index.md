---
title: "Kuery"
description: "Search your fleet and inspect resource relationships."
weight: 15
doc_type: "Overview"
provider: "kuery"
cascade:
  provider: kuery
---

Kuery helps you inspect Kubernetes resources across a connected fleet. Query resources and explore their relationships from your Faros workspace rather than opening each cluster separately for every question.

[Get started: run your first fleet query](/docs/use/kuery/quickstart/).

## When to use Kuery

Use Kuery to locate resources across clusters or investigate how related resources fit together. Its usefulness depends on the clusters you connect and the resources your identity can access.

## How it fits together

Edges provides the cluster connections. Kuery uses those connections to support fleet queries and relationship inspection; it does not replace the underlying clusters.

## Before you start

Kuery and Edges enabled, with at least one connected Kubernetes cluster. Select the workspace where you intend to create or use resources. [Enable the provider](/docs/use/enable-provider/) if needed.

## Availability and permissions

Check your hub’s catalog and deployed versions. Actions are subject to workspace access and provider-specific authorization; connected services also enforce their own permissions.

## Where your data lives

The provider synchronizes selected cluster resources into its SQLite or Postgres query store and scopes queries to the caller’s workspace.

## Start here

- [Quickstart](/docs/use/kuery/quickstart/)
- [Troubleshooting](/docs/use/kuery/troubleshooting/)
- [API reference](/docs/use/kuery/reference/)
- [Self-host Kuery](/docs/self-hosting/providers/kuery/)

[Implementation reference](https://github.com/faroshq/faros/blob/main/providers/kuery/README.md).
