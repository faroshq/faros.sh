---
title: "Memory and channels"
description: "Keep durable context and connect an external conversation surface."
weight: 4
doc_type: "Guide"
---

Connect an agent to a messaging destination and verify that its output reaches the intended conversation.

## Prerequisites

Sign in to Faros SaaS, select the agent’s workspace, and [verify an interactive agent run](/docs/use/agents/quickstart/) first. You need permission to configure its connections and credentials for the external channel. Confirm the destination belongs to the intended audience.

The provider stores conversation history and durable memory in its configured Postgres store. Infrastructure-backed file workspaces are optional and have their own runtime/storage requirements.

## Connect a channel

1. Select the agent’s workspace and open **Connections**. Create a connection for Slack, Telegram, Discord, or SMTP, choosing the authentication method supported by that deployment: a Secret for a static credential, or OAuth where the connection form offers it.
2. Configure the channel’s upstream credential and destination. Slack and Telegram need the bot/token credential plus a channel or chat ID; Discord needs a bot token and channel ID or an incoming-webhook URL; SMTP needs its mail configuration, sender, and recipient. Keep all secret values in the connection form.
3. Open the agent configuration and add an agent channel that references this connection. Give it a clear role name, such as `primary` or `incidents`, and mark exactly one channel as primary when the agent has more than one.
4. Associate a schedule or trigger with the named channel when its output should go somewhere other than the primary channel. An empty `channelRef` uses the agent’s primary channel.
5. For an inbound channel, send a benign test message and confirm that the correct agent receives it and replies to the correct destination. For an outbound-only channel, run a test task that sends to it and confirm delivery at the recipient.

## Expected result and recovery

The test output arrives at the intended destination and is associated with the intended agent.

A channel connection grants a new communication path. Inbound conversations require a channel type and connection that support inbound delivery; an outbound-only SMTP connection does not create a chat surface. Verify recipients and routing before using scheduled notifications. If delivery fails, inspect both the agent run and the upstream connection rather than resending repeatedly.

Review retained memory and conversation context when changing the agent’s purpose. Remove test connections when no longer needed; consult the operator’s retention and backup policy for stored history.

Next: [schedule background work](/docs/use/agents/schedules/) after verifying delivery.
