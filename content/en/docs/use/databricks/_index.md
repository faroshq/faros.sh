---
title: "Databricks"
description: "Connect tables and use their data."
weight: 16
doc_type: "Overview"
provider: "databricks"
cascade:
  provider: databricks
---

Databricks connects existing tables to Faros so applications and tools can work with their data. Create handles for the connection, warehouse, and table, then use the provider’s bounded query interface.

[Get started: import and query a table](/docs/use/databricks/quickstart/).

## When to use Databricks

Use this provider when an application needs data from an existing Databricks table. Importing a table creates a Faros handle and schema status; the source data stays in Databricks.

## How it fits together

App Studio can bind an application to an imported table with the required grants. The Databricks credential and upstream permissions determine which data the connection can access.

## Before you start

Databricks enabled; a workspace credential, SQL warehouse, and access to the table you want to import. Select the workspace where you intend to create or use resources. [Enable the provider](/docs/use/workspaces/enable-provider/) if needed.

## Availability and permissions

Check your hub’s catalog and deployed versions. Actions are subject to workspace access and provider-specific authorization; connected services also enforce their own permissions.

## Where your data lives

Table handles and schema status live in your Faros workspace. The data stays in Databricks; queries return bounded rows without persisting results in resource status.

## Start here

- [Build an application using Databricks data](/docs/use/app-studio/databricks/)
- [Quickstart](/docs/use/databricks/quickstart/)
- [Troubleshooting](/docs/use/databricks/troubleshooting/)
- [API reference](/docs/reference/providers/databricks/)
- [Self-host Databricks](/docs/self-hosting/providers/databricks/)

[Implementation reference](https://github.com/faroshq/faros/blob/main/providers/databricks/README.md).
