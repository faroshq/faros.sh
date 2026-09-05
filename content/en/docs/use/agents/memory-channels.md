---
title: "Memory and channels"
description: "Keep durable context and connect an external conversation surface."
weight: 4
doc_type: "Guide"
---

The provider stores conversation history and durable memory in its configured Postgres store. Infrastructure-backed file workspaces are optional and have their own runtime/storage requirements.

## Connect a channel

1. Select the agent’s workspace and create the relevant connection for the supported channel: Slack, Telegram, Discord, or SMTP.
2. Configure the channel’s upstream credential and routing using the connection form.
3. Associate the channel with the intended agent or trigger.
4. Send a benign test message and confirm that the correct agent receives it and replies to the correct destination.

A channel connection grants a new communication path. Verify recipients and routing before using scheduled notifications. If delivery fails, inspect both the agent run and the upstream connection rather than resending repeatedly.

Review retained memory and conversation context when changing the agent’s purpose. Remove test connections when no longer needed; consult the operator’s retention and backup policy for stored history.
