---
title: "Troubleshoot Edges"
description: "Identify the failing layer before retrying a task."
weight: 80
doc_type: "Guide"
---

## Check workspace and access

Confirm the selected organization/workspace and that the provider is enabled there. Try a read-only operation using the same identity as the failing action. A successful administrator action does not prove another identity has access.

## Diagnose the provider

Check target outbound connectivity, hub TLS, agent logs, and registration status. Use the printed join instructions for the correct edge. Do not reuse another edge’s credential. Verify workload selectors when no Placements appear.

## Collect useful evidence

Record the resource name, failing step, time, status conditions, and request/run ID where available. Share these with your operator, excluding bearer tokens, credentials, and private application data.

If the provider itself is unavailable, use [Edges self-hosting](/docs/self-hosting/providers/edges/) for operator checks. Once resolved, repeat the verification step in the [quickstart](/docs/use/edges/quickstart/).
