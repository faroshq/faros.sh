---
title: "Troubleshoot Kuery"
description: "Identify the failing layer before retrying a task."
weight: 80
doc_type: "Guide"
---

## Check workspace and access

Confirm the selected organization/workspace and that the provider is enabled there. Try a read-only operation using the same identity as the failing action. A successful administrator action does not prove another identity has access.

## Diagnose the provider

Check edge connectivity, synchronization status, sync whitelist, filters, and workspace. The query store can lag the source cluster. Compare a known object to the live edge before interpreting an empty result as absence.

## Collect useful evidence

Record the resource name, failing step, time, status conditions, and request/run ID where available. Share these with your operator, excluding bearer tokens, credentials, and private application data.

If the provider itself is unavailable, use [Kuery self-hosting](/docs/self-hosting/providers/kuery/) for operator checks. Once resolved, repeat the verification step in the [quickstart](/docs/use/kuery/quickstart/).
