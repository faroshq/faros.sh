---
title: "Troubleshoot AI agents"
description: "Identify the failing layer before retrying a task."
weight: 80
doc_type: "Guide"
---

## Check workspace and access

Confirm the selected organization/workspace and that the provider is enabled there. Try a read-only operation using the same identity as the failing action. A successful administrator action does not prove another identity has access.

## Diagnose by symptom

| Symptom | Check | Resolution |
| --- | --- | --- |
| No model available when creating an agent | Open Models in the same workspace and check for a credential. | Connect a model, Test it, then select it when creating the agent. |
| Model credential shows failed | Check its Base URL, model identifier, API key validity, and provider egress. | Use Rotate / model to repair the credential, save, Test, and repeat one short conversation. |
| Conversation stalls on a tool | Inspect the run approval state and requested tool. | Review and approve only the intended action; repair tool configuration if the request failed instead of awaiting approval. |
| Schedule does not run | Inspect suspend, nextRun, timezone, agentRef, and the associated run error. | Correct scheduling inputs or model errors; resume only after a manual conversation succeeds. |
| Deleting a credential breaks another agent | Inspect primary/fallback assignments on Models. | Reassign affected agents to a tested credential before removing the shared credential. |

## Collect useful evidence

Record the resource name, failing step, time, status conditions, and request/run ID where available. Share these with your operator, excluding bearer tokens, credentials, and private application data.

If the provider itself is unavailable, use [AI agents self-hosting](/docs/self-hosting/providers/agents/) for operator checks. Once resolved, repeat the verification step in the [quickstart](/docs/use/agents/quickstart/).
