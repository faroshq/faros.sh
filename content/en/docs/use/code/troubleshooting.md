---
title: "Troubleshoot Code"
description: "Identify the failing layer before retrying a task."
weight: 80
doc_type: "Guide"
---

## Check workspace and access

Confirm the selected organization/workspace and that the provider is enabled there. Try a read-only operation using the same identity as the failing action. A successful administrator action does not prove another identity has access.

## Diagnose the provider

Check the GitHub connection, owner, repository permissions, branch, and upstream policy. Read resource conditions and build status. Do not create duplicate repositories to work around an authentication failure.

## Collect useful evidence

Record the resource name, failing step, time, status conditions, and request/run ID where available. Share these with your operator, excluding bearer tokens, credentials, and private application data.

If the provider itself is unavailable, use [Code self-hosting](/docs/self-hosting/providers/code/) for operator checks. Once resolved, repeat the verification step in the [quickstart](/docs/use/code/quickstart/).
