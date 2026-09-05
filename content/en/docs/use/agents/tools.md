---
title: "Tools, approvals, and budgets"
description: "Give an AI agent access to infrastructure deliberately."
weight: 2
doc_type: "Guide"
---

## Prerequisites

Create an agent and verify its model connection first. To use infrastructure tools, enable the relevant providers in the same workspace and configure the agent’s MCP connection/toolset. The connection’s credential determines the available authority.

## Configure and verify tools

1. Open the agent’s configuration and inspect its connections and tool policy.
2. Add the required connection or reusable toolset. Start with only the tools needed for the task.
3. Set the autonomy and approval policy, and configure the supported token or cost budgets.
4. Ask the agent to perform a read-only discovery task, such as listing available resources.
5. Inspect tool calls and results. For a task requiring approval, confirm that it reaches the approval inbox and wait for a deliberate decision.

Do not infer a tool’s permission from its name or from the skill text. Workspace authorization, provider authorization, upstream credentials, and the agent’s policy all matter.

## Failure and recovery

If a tool is missing, check that the connection is enabled, the provider is healthy, and the credential can discover its tools. If a run stops on a budget or approval, inspect that state before retrying. Repeating the prompt does not resolve an authorization failure.

Next: [schedules and triggers](/docs/use/agents/schedules/).
