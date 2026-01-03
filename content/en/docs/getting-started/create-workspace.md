---
title: Manage Clusters
date: 2024-06-02
description: >
  How to create and manage Kubernetes clusters in Faros.
categories: [cli, clusters, docs]
tags: [cli, clusters, docs]
weight: 2
---

{{% pageinfo %}}
Faros allows you to register and manage Kubernetes clusters through a simple CLI interface. Once registered, clusters can be accessed remotely via SSH, monitored by AI agents, and integrated with the Faros platform.
{{% /pageinfo %}}


## Prerequisites

- Ensure you have installed the Faros CLI. If not, refer to the [CLI installation guide](/docs/getting-started/cli/).
- Authenticate with Faros: `kubectl faros login`


## Listing Clusters

View all clusters registered with Faros:

```bash
kubectl faros clusters list
# or simply
kubectl faros clusters
```

This displays:
- **NAME**: Cluster name
- **PHASE**: Current status (Pending, Initializing, Ready, Failed)
- **AGE**: Time since cluster creation


## Creating a New Cluster

Initialize a new cluster in the Faros platform:

```bash
kubectl faros clusters init <cluster-name>
```

The initialization process:
1. Creates a Cluster resource in Faros
2. Waits for the cluster to be initialized
3. Creates an Agent resource for the cluster
4. Generates a JWT token for agent authentication
5. Provides a kubectl command to run on your target cluster
6. Waits for the agent to become ready and establish connection

**Example workflow:**

```bash
kubectl faros clusters init production-us-east

# Output will include a command like:
# kubectl apply -f - <<EOF
# [Agent deployment manifests with JWT token]
# EOF
#
# Run this command on your target cluster to connect it to Faros
```


## Accessing Clusters via SSH

Once a cluster is connected, you can open an interactive SSH session:

```bash
kubectl faros clusters ssh <cluster-name>
```

Features:
- WebSocket-based SSH connection
- Full terminal support with resize handling
- Secure authentication via Kubernetes credentials
- Signal handling for graceful shutdown


## MCP Server Integration

Retrieve Model Context Protocol (MCP) server details for AI/LLM integration:

```bash
kubectl faros clusters mcp <cluster-name>
```

This displays:
- Server name and type
- Connection URL
- Required authentication headers


## Deleting a Cluster

Remove a cluster from Faros:

```bash
kubectl faros clusters delete <cluster-name>
```

This removes the cluster registration from Faros but does not affect the actual Kubernetes cluster.
