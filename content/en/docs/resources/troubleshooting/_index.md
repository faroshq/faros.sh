---
title: "Troubleshooting"
description: "Find the failing layer and the relevant provider guide."
weight: 8
doc_type: "Overview"
---

## Start with these checks

| Symptom | Check first |
|---|---|
| Resources disappeared after switching context | Selected organization and workspace |
| Provider missing or disabled | [Enablement and dependencies](/docs/use/workspaces/enable-provider/) |
| Access denied | [Memberships](/docs/administration/members/) and the actual credential used |
| Provider unavailable | [Readiness and operator diagnostics](/docs/self-hosting/hub/operations/) |
| Edge disconnected | [Edges troubleshooting](/docs/use/edges/troubleshooting/) |
| Assistant cannot use a tool | [Tools, connections, and approvals](/docs/use/agents/tools/) |

## Provider troubleshooting

- [App Studio](/docs/use/app-studio/troubleshooting/)
- [AI agents](/docs/use/agents/troubleshooting/)
- [Edges](/docs/use/edges/troubleshooting/)
- [Infrastructure](/docs/use/infrastructure/instances/#troubleshooting)
- [Code](/docs/use/code/repositories/#troubleshooting)
- [Kuery](/docs/use/kuery/quickstart/#troubleshooting)
- [Databricks](/docs/use/databricks/troubleshooting/)

Record the resource, step, time, and request ID when asking for help. Exclude tokens and secrets. [Report a reproducible issue](https://github.com/faroshq/faros/issues).
