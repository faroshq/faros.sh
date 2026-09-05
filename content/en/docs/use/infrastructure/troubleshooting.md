---
title: "Troubleshoot Infrastructure"
description: "Identify the failing layer before retrying a task."
weight: 80
doc_type: "Guide"
---

## Check workspace and access

Confirm the selected organization/workspace and that the provider is enabled there. Try a read-only operation using the same identity as the failing action. A successful administrator action does not prove another identity has access.

## Diagnose the provider

Inspect Instance phase and conditions, especially input validation. Then check credential references and runtime readiness with the operator. A stuck finalizer requires cleanup investigation, not blind removal.

## Collect useful evidence

Record the resource name, failing step, time, status conditions, and request/run ID where available. Share these with your operator, excluding bearer tokens, credentials, and private application data.

If the provider itself is unavailable, use [Infrastructure self-hosting](/docs/self-hosting/providers/infrastructure/) for operator checks. Once resolved, repeat the verification step in the [quickstart](/docs/use/infrastructure/quickstart/).
