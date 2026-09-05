---
title: "Code API reference"
description: "Resource and interface map, with versioned source definitions."
weight: 90
doc_type: "Reference"
---

## Prerequisites and scope

Use the workspace where Code is enabled. Authenticate with a credential authorized for the requested resource and operation. Inspect your deployed API discovery for the exact schema in your hub.

## Interfaces

The `code.faros.sh` API includes Connection, Repository, RepositoryCommit, RepositoryCheckout, DeployKey, Collaborator, Package, and RepositoryBuildStatus. Upstream GitHub authorization still applies.

## MCP tools

After [connecting an MCP client](/docs/use/mcp/), the aggregate endpoint exposes these names with a `code__` prefix. Discovery and execution depend on provider enablement, workspace permissions, and the connected GitHub account's access.

| Tool | Use it to |
|---|---|
| `list_connections` | Discover configured GitHub connections and their validation status. |
| `create_connection` | Create a connection referencing an existing credential Secret; the tool does not accept the token itself. |
| `list_repositories` | List managed repositories, URLs, and readiness. |
| `create_repository` | Request a repository on the connected GitHub account. |
| `delete_repository` | Delete the managed repository; the provider also removes it from GitHub. |
| `checkout_repository` | Read a repository's text files at a ref; binary and oversized files are reported as skipped. |
| `commit_files` | Write or delete files through a `RepositoryCommit` request. |
| `add_deploy_key` | Install a deploy key; generated private keys are stored in a workspace Secret. |
| `add_collaborator` | Grant repository access, potentially creating an invitation the recipient must accept. |
| `remove_collaborator` | Revoke access and cancel a pending invitation. |
| `build_status` | Inspect the latest build workflow run, jobs, and failure log tails. |
| `rebuild` | Dispatch the repository's build workflow again. |

Check resource status after write operations and verify the result in GitHub. Build tools require a configured build workflow. For exact input schemas and behavior, see the [versioned MCP implementation](https://github.com/faroshq/faros/tree/main/providers/code/mcpserver).

## Resource schemas

[Resource fields and validation rules](/docs/use/code/schemas/) are generated from the checked-in schemas, with a downloadable JSON bundle.

## Authoritative definitions

[API definitions](https://github.com/faroshq/faros/blob/main/providers/code/apis) contain fields and contracts. For Kubernetes-style resources, use `kubectl api-resources` and `kubectl explain RESOURCE` against the intended workspace to inspect the installed schema.

## Related guide

[Repository tasks](/docs/use/code/repositories/). Return to [Code](/docs/use/code/) for prerequisites and the provider’s quickstart.
