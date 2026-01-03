---
title: Install CLI
date: 2024-06-02
description: >
  How to install and use faros CLI.
categories: [cli, docs]
tags: [cli, docs]
weight: 1
---

{{% pageinfo %}}
Faros CLI is a kubectl plugin that provides a modern, user-friendly interface for managing Kubernetes clusters and AI agents through the Faros platform.
{{% /pageinfo %}}


## Prerequisites

- Ensure `kubectl` is installed. If not, refer to the [official Kubernetes documentation](https://kubernetes.io/docs/tasks/tools/) for installation guidance.
- Install `krew`, the kubectl plugin manager, following the [official krew documentation](https://krew.sigs.k8s.io/docs/user-guide/setup/install/).


## Plugin Installation

Execute the commands below to add the Faros plugin and install it:

```bash
kubectl krew index add faros https://github.com/faroshq/krew-index.git
kubectl krew install faros/faros
```

To update the plugin, run:

```bash
kubectl krew upgrade
```


## Authentication

Before using any Faros commands, authenticate with the Faros platform:

```bash
kubectl faros login
```

This command will:
1. Start a local authentication server
2. Open your browser to complete OAuth authentication
3. Save your credentials to `~/.kube/config-faros`
4. Display next steps for getting started


## Available Commands

The Faros CLI provides the following command groups:

### Cluster Management

Manage your Kubernetes clusters through Faros:

```bash
# List all clusters
kubectl faros clusters
kubectl faros clusters list

# Create a new cluster
kubectl faros clusters init <cluster-name>

# Delete a cluster
kubectl faros clusters delete <cluster-name>

# Get MCP server details for a cluster
kubectl faros clusters mcp <cluster-name>

# Open SSH session to a cluster
kubectl faros clusters ssh <cluster-name>
```

### AI Agent Management

Manage AI agents for cluster analysis and automation:

```bash
# List all AI agents
kubectl faros ai-agents
kubectl faros ai-agents list

# Create a new AI agent
kubectl faros ai-agents init \
  --name <agent-name> \
  --backend openai \
  --model gpt-4 \
  --api-key <your-api-key>
```


## User Management

Users can be invited and granted access via Kubernetes RBAC. Use the following role binding template with GitHub-authenticated emails:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: workspace-admin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: faros-sso-{email}
```


## Explore Kubernetes APIs

The Faros platform extends Kubernetes with custom APIs. Check the supported APIs using:

```bash
kubectl api-resources
```

