---
title: "Import and query a Databricks table"
description: "Connect a warehouse and expose an existing table in your workspace."
weight: 1
doc_type: "Tutorial"
---

Import an existing Databricks table into Faros so an assistant or application can read bounded results from it.

## Prerequisites

Sign in to Faros SaaS, enable **Databricks** and select your workspace. You need a Databricks host, a Databricks personal access token, a SQL warehouse, and permission to query the existing table.

## Import the table

1. Open **Connections** and choose **Create connection**. Enter the Databricks host and a personal access token. In Databricks, obtain the token from **avatar → Settings → Developer → Access tokens**; your Databricks administrator may need to permit token creation. Enter it only in the connection form. Save it, then wait for the connection to report ready.
2. Open **Warehouses**, choose **Create warehouse**, select the connection, and enter the Databricks SQL warehouse ID. Save it and wait for validation.
3. Open **Tables**, choose **Import table**, select the same connection and one of its warehouses, then browse the Databricks hierarchy **Catalog → Schema → Table**. Select the table, choose a distinct Faros name, and submit the import.
4. Wait for the Table to report ready and inspect its cached column schema. The selected warehouse must belong to the selected connection.
5. To use the table in a SaaS application, follow [Connect the table in App Studio](/docs/use/app-studio/databricks/#connect-the-table), then use that guide’s copyable dashboard prompt. If you already have an [MCP assistant connected](/docs/use/ai-assistants/), ask it to query the exact Faros table name with a limit of five rows. The [API reference](/docs/reference/providers/databricks/) shows the tool payload.

## Expected result and recovery

Expect a ready Table with the intended columns and query results from the selected upstream table.

Importing creates a Faros handle; it does not copy the table into the control plane. The query returns bounded rows and does not offer arbitrary SQL execution.

If validation fails, check the credential, warehouse handle, and upstream table permissions in that order. Avoid repeated imports of the same table to diagnose a credential error.

Remove test handles and credentials only after checking that no application grants depend on them. Removing a Faros handle does not imply deletion of the upstream Databricks table.

## Optional CLI diagnostics

Select the [same workspace](/docs/reference/cli/resources/) and discover its provider API:

```bash
kubectl api-resources --api-group=databricks.faros.sh
kubectl get connections.databricks.faros.sh
kubectl get warehouses.databricks.faros.sh
kubectl get tables.databricks.faros.sh
kubectl get tables.databricks.faros.sh RESOURCE-NAME -o yaml
```

Replace `RESOURCE-NAME` with the object you created. Inspect its status, reported conditions, and resource references to trace setup failures. An empty list is different from a forbidden request or missing API. Keep credentials in the supported connection flow; do not copy connection secrets into example manifests or shared diagnostic output.


Next: [build an application using the table](/docs/use/app-studio/databricks/).
