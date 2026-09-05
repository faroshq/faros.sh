---
title: "Create an AI agent"
description: "Choose a model, give the agent instructions, and verify its first response."
weight: 1
doc_type: "Tutorial"
---

## Prerequisites

Use an existing hub with **AI agents** enabled. Select the workspace where the agent should live. You need a [tested model credential](/docs/use/agents/models/) in that workspace and permission to create an agent. Infrastructure and external channels are optional for this first conversation.

## Create and verify

1. Open **AI agents** and choose **Create agent**.
2. Enter a name and select a model credential. If none exists, [connect and test a model](/docs/use/agents/models/) first, then return here.
3. Add concise instructions, such as “Summarize the information I provide and ask before using external tools.”
4. Leave optional channels and extra capabilities unconfigured for the first conversation.
5. Create the agent, open its chat, and ask it to summarize a short paragraph.
6. Verify that the response appears and inspect any reported model or credential error.

A successful text response verifies the model connection. It does not verify access to GitHub, MCP, or other tools.

## Next steps and cleanup

[Configure tools and approvals](/docs/use/agents/tools/) before granting operational capabilities. Then [add a schedule](/docs/use/agents/schedules/) if the agent should run without an active chat.

Before deleting a test agent, disable its schedules and triggers and remove any channel connections you created only for the test.
