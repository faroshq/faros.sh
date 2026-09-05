---
title: "Import and query a Databricks table"
description: "Connect a warehouse and expose an existing table in your workspace."
weight: 1
doc_type: "Tutorial"
---

## Prerequisites

Enable **Databricks** and select your workspace. You need a Databricks host, a supported credential stored through the provider’s connection flow, a SQL warehouse, and permission to query the existing table.

1. Create a **Connection** for the Databricks workspace and credential.
2. Create a **Warehouse** handle using that connection.
3. Create a **Table** handle for the table you intend to expose.
4. Wait for validation/readiness conditions and inspect the cached column schema.
5. Query the exact imported table using the provider’s available `query_table` tool or a granted application action. Start with a small row limit and only known column names.

Importing creates a Faros handle; it does not copy the table into the control plane. The query returns bounded rows and does not offer arbitrary SQL execution.

If validation fails, check the credential, warehouse handle, and upstream table permissions in that order. Avoid repeated imports of the same table to diagnose a credential error.

Remove test handles and credentials only after checking that no application grants depend on them. Removing a Faros handle does not imply deletion of the upstream Databricks table.

## Verify resources from the CLI

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
