---
title: "Troubleshoot Databricks"
description: "Identify the failing layer before retrying a task."
weight: 80
doc_type: "Guide"
---

## Check workspace and access

Confirm the selected organization/workspace and that the provider is enabled there. Try a read-only operation using the same identity as the failing action. A successful administrator action does not prove another identity has access.

## Diagnose by symptom

| Symptom | Check | Resolution |
| --- | --- | --- |
| Imported table is not ready | Inspect the Connection, referenced Warehouse, and Table conditions in that order. | Repair credential/warehouse access and exact upstream table permissions before retrying validation. |
| grant_not_found / action_not_allowed / binding_revoked | Check the project integration alias, grant, and query_table/v1 action. | Repair or reauthorize the exact binding in App Studio; do not bypass it with upstream credentials. |
| schema_projection_invalid | Compare requested columns with the exact bound Table schema. | Rediscover that schema and correct the projection. Do not retry unchanged or substitute a different table. |
| unauthenticated / tenant_required | Check the server action environment and refreshed token-file mount. | Restore runtime context and token refresh. Never send provider credentials from the browser. |
| resource_not_ready / backend_failure | Inspect the table conditions and provider diagnostics using the request ID. | Repair the upstream dependency, then repeat one bounded query. |
| Query succeeds with no rows | Verify the granted table identity and upstream data with an authorized user. | Render an empty state; do not treat an empty result as a failed import. |

## Collect useful evidence

Record the resource name, failing step, time, status conditions, and request/run ID where available. Share these with your operator, excluding bearer tokens, credentials, and private application data.

If the provider itself is unavailable, use [Databricks self-hosting](/docs/self-hosting/providers/databricks/) for operator checks. Once resolved, repeat the verification step in the [quickstart](/docs/use/databricks/quickstart/).
