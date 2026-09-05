---
title: "MCP command"
description: "Find the aggregate or per-edge MCP endpoint."
weight: 6
doc_type: "Reference"
---

Use `kubectl faros mcp url --mcpserver-name default` for the workspace aggregate, or `kubectl faros mcp url --edge EDGE-NAME` for one Kubernetes edge. The `--edge` form does not support server/Linux edges; use the aggregate endpoint for Linux/SSH tools. Exactly one flag is required.

See [connect external AI assistants through MCP](/docs/use/ai-assistants/) for setup, authentication, and verification.
