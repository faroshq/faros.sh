---
title: MCP Integration
description: Exposing provider tools to AI agents through the hub's aggregate MCP endpoint.
weight: 7
---

faros presents one aggregate [Model Context Protocol](https://modelcontextprotocol.io) endpoint per workspace:

```
https://<hub>/services/mcpserver/{cluster}/apis/faros.sh/v1alpha1/mcpservers/{name}/mcp
```

An AI agent connecting there sees tools from **every Ready provider in the workspace**, federated by the hub: the edges provider contributes Kubernetes and SSH tools, and each enabled provider with an MCP surface contributes its own, namespaced as `<provider>__<tool>` — `code__create_repository`, `infrastructure__provision`, `kuery__kuery_query`, and so on. A provider that fails `tools/list` is skipped, not fatal.

## Exposing tools from your provider

Three requirements:

1. **Serve a streamable-HTTP MCP handler at `/mcp` on your backend** (the shipped providers use the official MCP Go SDK; `providers/infrastructure/mcpserver/` is the reference — most also serve `/mcp/sse` for older clients).
2. **Be Ready** — registered CatalogEntry with a reachable `backend.url`, fresh heartbeats. Not-Ready providers are dropped from federation.
3. **Honour forwarded identity.** Every MCP request arrives through the backend proxy with `X-Faros-Tenant`, `X-Faros-Cluster`, and the caller's `Authorization` bearer. Do all tenant work *as that token, scoped to that workspace* — never your provider SA. This is [pattern B](/docs/providers/virtual-workspace/#the-two-identity-patterns); an MCP tool must never see more than its caller could with kubectl.

A typical tool implementation resolves the tenant client once per request from the headers, then reads/writes the provider's own CRs — meaning MCP is usually a thin verb layer over the same API your UI and controllers use.

## Design guidance for tools

- Keep tool names short and verb-first (`list_templates`, `provision`, `commit_files`); the federation prefix supplies your provider name.
- Return structured, compact results — AI agents pay per token.
- Tools that mutate should map 1:1 onto resource writes, so everything an agent does is visible as ordinary objects (`kubectl get`) and auditable via status/conditions.
- Long-lived MCP connections authenticate with a per-`MCPServer` service-account token (referenced from `status.tokenSecretRef`) rather than a user's short-lived OIDC token — your handler doesn't need to care, but don't build in assumptions that the bearer is a human session.

## Consuming MCP instead

Not every provider *serves* MCP — some consume it. The agents and app-studio providers are MCP **clients**: their AI loops call the hub aggregate endpoint on the tenant's behalf, picking up your tools automatically. This is the payoff of federation — implement `/mcp` once and every AI surface in the platform (Claude Code via the CLI, hosted agents, App Studio chat) can use your provider.
