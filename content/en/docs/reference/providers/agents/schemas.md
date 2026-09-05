---
title: "Resource schemas"
description: "Generated fields and validation rules for agents workspace resources."
weight: 91
doc_type: "Reference"
provider: "agents"
---

## Compatibility and access

Generated from [product commit `6f341b4e6d35`](https://github.com/faroshq/faros/commit/6f341b4e6d356dd28d1a90ec65e220b98a9bbb96). This is a source snapshot, not a guarantee that your deployment runs this version.

These resource schemas describe provider configuration. Check your deployed API discovery for the schema installed in your hub. Use the intended [workspace context](/docs/reference/cli/resources/) and an identity permitted to read or change the resource. Required fields below are required within their containing object; optional parent objects may be omitted.

[Download complete schemas](/schemas/agents.json), including nested validation rules and status definitions. This page covers Kubernetes-style resources; provider HTTP actions and runtime behavior are separate contracts. Return to [API reference](/docs/reference/providers/agents/) for those interfaces and related guides.

## Agent (v1alpha1)

API: `agents.faros.sh/v1alpha1` · Resource: `agents` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/6f341b4e6d356dd28d1a90ec65e220b98a9bbb96/providers/agents/deploy/chart/files/schemas/agents.agents.faros.sh.yaml)

```bash
kubectl explain agents.agents.faros.sh --api-version=agents.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | No | AgentSpec is the user-authored agent configuration. |
| `spec.autonomy` | string | No | Autonomy is the agent's default posture toward taking action: "suggest" drafts but never acts, "ask" acts after approval, "auto" acts freely within the tool policy. Per-trigger requireApproval lists refine it. default: "ask"; enum: &#91;"suggest", "ask", "auto"&#93; |
| `spec.budget` | object | No | Budget caps spend over a rolling window. On breach the provider suspends schedules and background runs and notifies the user; interactive chat stays available. |
| `spec.budget.tokenLimit` | integer | No | TokenLimit is the token ceiling for the window. Zero disables the token cap. minimum: 0 |
| `spec.budget.usdLimit` | string | No | USDLimit is the spend ceiling in US dollars for the window. Zero disables the cost cap. |
| `spec.budget.window` | string | No | Window is the rolling budget period: "day" or "month". default: "month"; enum: &#91;"day", "month"&#93; |
| `spec.channels` | array&#91;object&#93; | No | Channels binds named messaging channels to the agent. The channel marked Primary (or, failing that, the first entry) is the default notify target for output that does not name a channel — the notify/ask tools, approval requests, and schedules/triggers with no ChannelRef. Schedules and Triggers may deliver to any channel by referencing its Name. An agent also receives inbound messages on every channel's Connection, so a user can talk to it from more than one place (e.g. Telegram and Discord). |
| `spec.channels[].connectionRef` | string | Yes | ConnectionRef names the messaging Connection (telegram/slack/discord/smtp) that backs this channel. maxLength: 253 |
| `spec.channels[].name` | string | Yes | Name is the logical channel role referenced by schedules and triggers, e.g. "primary", "incidents", "news". Unique within the agent. minLength: 1; maxLength: 63 |
| `spec.channels[].primary` | boolean | No | Primary marks this channel as the agent's default notify target. Exactly one channel should be primary; when none is marked the first entry is treated as primary. |
| `spec.delegates` | array&#91;string&#93; | No | Delegates lists the names of other Agents this agent may spawn as sub-agents via the core "delegate" tool. Empty disables delegation. |
| `spec.description` | string | No | Description is a short summary of what this agent is for. maxLength: 2048 |
| `spec.displayName` | string | Yes | DisplayName is the human-readable agent name. minLength: 1; maxLength: 128 |
| `spec.limits` | object | No | Limits bounds a single run. |
| `spec.limits.maxConcurrentSpawns` | integer | No | MaxConcurrentSpawns caps how many spawned workers execute at the same time; the rest queue. Zero uses the provider default (4); the provider caps it at 8 regardless. minimum: 0 |
| `spec.limits.maxSpawnsPerRun` | integer | No | MaxSpawnsPerRun caps how many scoped workers one run may start with the "spawn" tool. Zero uses the provider default (10); the provider caps it at 20 regardless. minimum: 0 |
| `spec.limits.maxToolTurns` | integer | No | MaxToolTurns caps tool-call iterations in one run. Zero uses the provider default. minimum: 0 |
| `spec.limits.timeoutSeconds` | integer | No | TimeoutSeconds is the wall-clock budget for one run. Zero uses the provider default watchdog (3600s). minimum: 0 |
| `spec.memory` | object | No | Memory configures long-term memory behavior. |
| `spec.memory.enabled` | boolean | No | Enabled turns on long-term memory notes. Defaults to true. default: true |
| `spec.memory.maxNotes` | integer | No | MaxNotes bounds how many memory notes may be injected into a run's context. Zero uses the provider default. minimum: 0 |
| `spec.modelFallbacks` | array&#91;string&#93; | No | ModelFallbacks is an ordered list of additional model-credential names tried, in order, when the primary chat model (models&#91;"chat"&#93;) fails to respond — a provider outage, rate limit, timeout, or connection error. The first credential that responds is used. Streaming only falls back before the first token is emitted. Empty means no fallback. |
| `spec.models` | object | No | Models maps run purposes to named profiles in the tenant's model credentials Secret (faros-agents-llm). Recognized purposes: "chat" (interactive, strong), "background" (schedules/heartbeats, cheap), "compaction" (summarization). An empty map falls back to the "chat" profile for every purpose. |
| `spec.systemPrompt` | string | No | SystemPrompt is the agent's persona and standing instructions, injected at the head of every run. maxLength: 32768 |
| `spec.tools` | object | No | Tools grants tool families and connections to the agent, per trigger class. Unattended runs (schedule/heartbeat/wakeup) default to read-only. |
| `spec.tools.background` | object | No | Background applies to schedule, heartbeat, and wakeup runs. Defaults to read-only families plus notify when unset. |
| `spec.tools.background.connections` | array&#91;string&#93; | No | Connections names Connection resources whose tools are exposed. |
| `spec.tools.background.families` | array&#91;string&#93; | No | Families names built-in tool families to enable: "core", "web", "github", "mcp", "files", "edges", "spawn". "spawn" lets a run fan out to scoped workers (the same agent on sub-tasks, with a subset of this grant) and join their answers — the basis of a research pass. |
| `spec.tools.background.requireApproval` | array&#91;string&#93; | No | RequireApproval lists tool names (or "*" family wildcards like "github:*") that must be approved by the user before they run. |
| `spec.tools.background.toolsets` | array&#91;string&#93; | No | Toolsets names shared Toolset resources whose families, connections, and approval rules are merged into this grant. Lets many agents link one reusable bundle. |
| `spec.tools.interactive` | object | No | Interactive applies to chat and channel-triggered runs, where a human is present to approve risky actions. |
| `spec.tools.interactive.connections` | array&#91;string&#93; | No | Connections names Connection resources whose tools are exposed. |
| `spec.tools.interactive.families` | array&#91;string&#93; | No | Families names built-in tool families to enable: "core", "web", "github", "mcp", "files", "edges", "spawn". "spawn" lets a run fan out to scoped workers (the same agent on sub-tasks, with a subset of this grant) and join their answers — the basis of a research pass. |
| `spec.tools.interactive.requireApproval` | array&#91;string&#93; | No | RequireApproval lists tool names (or "*" family wildcards like "github:*") that must be approved by the user before they run. |
| `spec.tools.interactive.toolsets` | array&#91;string&#93; | No | Toolsets names shared Toolset resources whose families, connections, and approval rules are merged into this grant. Lets many agents link one reusable bundle. |
| `status` | object | No | AgentStatus is the observed agent state. |
| `status.lastRunAt` | string | No | LastRunAt is when the agent most recently executed. |
| `status.phase` | string | No | Phase is Ready or Suspended. |
| `status.suspendedReason` | string | No | SuspendedReason explains a Suspended phase (e.g. "budget exceeded"). |
| `status.updatedAt` | string | No | UpdatedAt reflects the latest configuration mutation. |
| `status.usage` | object | No | Usage reports the current rolling-window consumption. |
| `status.usage.tokens` | integer | No | Tokens consumed in the current window. |
| `status.usage.usd` | string | No | USD spent in the current window. |
| `status.usage.windowStart` | string | No | WindowStart is when the current budget window began. |

## Connection (v1alpha1)

API: `agents.faros.sh/v1alpha1` · Resource: `connections` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/6f341b4e6d356dd28d1a90ec65e220b98a9bbb96/providers/agents/deploy/chart/files/schemas/connections.agents.faros.sh.yaml)

```bash
kubectl explain connections.agents.faros.sh --api-version=agents.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | No | ConnectionSpec is the user-authored connection configuration. |
| `spec.auth` | string | No | Auth selects how credentials are obtained: "secret" (default) reads a static token from the referenced Secret; "oauth" runs the provider's authorize/callback flow and refreshes the token automatically. default: "secret"; enum: &#91;"secret", "oauth"&#93; |
| `spec.baseURL` | string | No | BaseURL is the endpoint for http, mcp, and self-hosted github/slack connections. Ignored by types that have a fixed endpoint. maxLength: 2048 |
| `spec.channel` | string | No | Channel identifies the destination for messaging connections: a Telegram chat ID, a Slack channel ID, or an email address for smtp. maxLength: 253 |
| `spec.config` | object | No | Config carries additional non-secret, type-specific settings. |
| `spec.displayName` | string | No | DisplayName is a human-readable label for the connection. maxLength: 128 |
| `spec.oauth` | object | No | OAuth configures the flow when Auth is "oauth". Ignored otherwise. |
| `spec.oauth.authorizeURL` | string | No | AuthorizeURL and TokenURL override the provider preset endpoints (for self-hosted GitHub Enterprise or Slack, or a custom provider). maxLength: 2048 |
| `spec.oauth.provider` | string | Yes | Provider names the OAuth provider preset: "github", "google", "slack". enum: &#91;"github", "google", "slack"&#93; |
| `spec.oauth.scopes` | array&#91;string&#93; | No | Scopes requested during authorization. |
| `spec.oauth.tokenURL` | string | No | maxLength: 2048 |
| `spec.secretRef` | string | No | SecretRef names the tenant-workspace Secret holding this connection's credentials. Defaults to faros-agents-conn-&lt;connection-name&gt; when empty. maxLength: 253 |
| `spec.type` | string | Yes | Type selects the integration: github, mcp, websearch, http, telegram, slack, smtp, or discord. enum: &#91;"github", "mcp", "websearch", "edges", "http", "telegram", "slack", "smtp", "discord"&#93; |
| `status` | object | No | ConnectionStatus is the observed connection state. |
| `status.message` | string | No | Message explains a non-Ready phase. |
| `status.oauthConnected` | boolean | No | OAuthConnected reports whether an oauth-auth connection has a valid, refreshable token. Always false for secret-auth connections. |
| `status.phase` | string | No | Phase is Ready when the referenced Secret exists and validates, or Error. |
| `status.tokenExpiresAt` | string | No | TokenExpiresAt is when the current OAuth access token expires. |
| `status.updatedAt` | string | No | UpdatedAt reflects the latest status observation. |
| `status.webhookPath` | string | No | WebhookPath is the hub-relative inbound webhook path for messaging connections that receive events (telegram, slack). Empty for outbound-only or non-messaging types. |

## Schedule (v1alpha1)

API: `agents.faros.sh/v1alpha1` · Resource: `schedules` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/6f341b4e6d356dd28d1a90ec65e220b98a9bbb96/providers/agents/deploy/chart/files/schemas/schedules.agents.faros.sh.yaml)

```bash
kubectl explain schedules.agents.faros.sh --api-version=agents.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | No | ScheduleSpec is the user-authored schedule configuration. |
| `spec.agentRef` | string | Yes | AgentRef names the Agent this schedule drives. minLength: 1; maxLength: 253 |
| `spec.channelRef` | string | No | ChannelRef names the agent channel this schedule's output is delivered to (a Name in the agent's spec.channels). Empty means the agent's primary channel. Lets, e.g., a "daily-news" cron post to a dedicated news channel. maxLength: 63 |
| `spec.checklist` | string | No | Checklist is the standing markdown the agent reviews on each heartbeat pulse. Only used for heartbeat schedules. maxLength: 32768 |
| `spec.retry` | object | No | Retry overrides the default retry policy for runs from this schedule. |
| `spec.retry.maxAttempts` | integer | No | MaxAttempts is the number of tries for a transient failure before the run is marked failed. Zero uses the provider default (3). minimum: 0 |
| `spec.runAt` | string | No | RunAt is the one-shot fire time for wakeup schedules (RFC3339). |
| `spec.schedule` | string | No | Schedule is a 5-field cron expression for cron and heartbeat types. For wakeup type it is empty and RunAt is used instead. maxLength: 253 |
| `spec.suspend` | boolean | No | Suspend halts firing without deleting the schedule. |
| `spec.task` | string | No | Task is the prompt run on each fire for cron and wakeup schedules. maxLength: 32768 |
| `spec.timeZone` | string | No | TimeZone is the IANA timezone the cron expression is evaluated in (e.g. "Europe/Vilnius"). Empty means UTC. maxLength: 64 |
| `spec.type` | string | Yes | Type is cron, wakeup, or heartbeat. enum: &#91;"cron", "wakeup", "heartbeat"&#93; |
| `status` | object | No | ScheduleStatus is the observed schedule state. |
| `status.consecutiveFailures` | integer | No | ConsecutiveFailures counts back-to-back failed runs; drives extended backoff and eventual disable. |
| `status.disabledReason` | string | No | DisabledReason is set when the scheduler disables the schedule on a permanent error (revoked credential, deleted agent). |
| `status.lastRun` | string | No | LastRun is the most recent fire time. |
| `status.lastRunID` | string | No | LastRunID references the Run produced by the most recent fire. maxLength: 128 |
| `status.nextRun` | string | No | NextRun is the next planned fire time. |
| `status.observedGeneration` | integer | No | ObservedGeneration is the spec generation the scheduler last reconciled. When it lags metadata.generation the schedule was edited, and the scheduler re-derives NextRun from the new spec instead of honoring the stale value computed from the previous cron/timezone/runAt. |

## Toolset (v1alpha1)

API: `agents.faros.sh/v1alpha1` · Resource: `toolsets` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/6f341b4e6d356dd28d1a90ec65e220b98a9bbb96/providers/agents/deploy/chart/files/schemas/toolsets.agents.faros.sh.yaml)

```bash
kubectl explain toolsets.agents.faros.sh --api-version=agents.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | No | ToolsetSpec is the user-authored bundle definition. |
| `spec.connections` | array&#91;string&#93; | No | Connections names Connection resources (e.g. mcp/github) whose tools this toolset exposes. |
| `spec.description` | string | No | Description explains what the toolset is for. maxLength: 1024 |
| `spec.displayName` | string | No | DisplayName is a human-friendly label. maxLength: 253 |
| `spec.families` | array&#91;string&#93; | No | Families names built-in tool families to include: "core", "web", "github", "mcp", "edges". |
| `spec.requireApproval` | array&#91;string&#93; | No | RequireApproval lists tool names (or wildcards like "github:*") that must be approved by the user before they run. |
| `status` | object | No | ToolsetStatus is the observed toolset state. |
| `status.usedBy` | integer | No | UsedBy counts the agents currently linking this toolset. Informational. |

## Trigger (v1alpha1)

API: `agents.faros.sh/v1alpha1` · Resource: `triggers` · Scope: `Cluster`

[Source schema](https://github.com/faroshq/faros/blob/6f341b4e6d356dd28d1a90ec65e220b98a9bbb96/providers/agents/deploy/chart/files/schemas/triggers.agents.faros.sh.yaml)

```bash
kubectl explain triggers.agents.faros.sh --api-version=agents.faros.sh/v1alpha1 --recursive
```

| Field | Type | Required in parent | Description and constraints |
| --- | --- | --- | --- |
| `spec` | object | No | TriggerSpec is the user-authored trigger configuration. |
| `spec.agentRef` | string | Yes | AgentRef names the Agent this trigger drives. minLength: 1; maxLength: 253 |
| `spec.channelRef` | string | No | ChannelRef names the agent channel this trigger's output is delivered to (a Name in the agent's spec.channels). Empty means the agent's primary channel. Lets, e.g., an "incidents" trigger post to a dedicated channel. maxLength: 63 |
| `spec.connectionRef` | string | No | ConnectionRef names the Connection backing non-webhook sources (channel, github, connection). Empty for webhook sources. maxLength: 253 |
| `spec.filter` | object | No | Filter narrows which events fire the trigger. Keys are source-specific: e.g. "eventType" and "labels" for github, "match" (regex) for channel, "path" or "header.&lt;name&gt;" for webhook. |
| `spec.source` | string | Yes | Source is where events come from: webhook or github. Both provision a hub-routed webhook endpoint and fire on inbound delivery. enum: &#91;"webhook", "github"&#93; |
| `spec.suspend` | boolean | No | Suspend halts firing without deleting the trigger. |
| `spec.task` | string | No | Task is the prompt run when the trigger fires. The event payload is made available to the run as additional input. maxLength: 32768 |
| `status` | object | No | TriggerStatus is the observed trigger state. |
| `status.consecutiveFailures` | integer | No | ConsecutiveFailures counts back-to-back failed runs from this trigger. |
| `status.disabledReason` | string | No | DisabledReason is set when the provider disables the trigger on a permanent error (deleted agent, revoked connection). |
| `status.lastFired` | string | No | LastFired is the most recent time an event fired a run. |
| `status.lastRunID` | string | No | LastRunID references the Run produced by the most recent event. maxLength: 128 |
| `status.webhookPath` | string | No | WebhookPath is the hub-relative inbound endpoint for webhook sources. |
