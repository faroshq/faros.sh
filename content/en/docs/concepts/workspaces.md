---
title: Clusters
date: 2024-06-02
description: >
  Understanding cluster management in Faros.
categories: [clusters, docs]
tags: [clusters, docs]
weight: 1
---

{{% pageinfo %}}
Faros provides a centralized platform for managing multiple Kubernetes clusters through a unified interface. Clusters are registered with Faros via lightweight agents that provide secure, read-only access for monitoring and analysis.
{{% /pageinfo %}}


## What is a Cluster in Faros?

A **Cluster** in Faros represents a registered Kubernetes cluster that is connected to the Faros platform. Each cluster:

- Has a unique name within your organization
- Runs a lightweight Faros agent for connectivity
- Maintains its own lifecycle and status
- Can be accessed remotely via SSH or API
- Exposes metrics and data for AI-powered analysis


## Cluster Lifecycle

Clusters in Faros go through the following phases:

1. **Pending**: Cluster resource has been created but initialization hasn't started
2. **Initializing**: Cluster is being set up, agent is being configured
3. **Ready**: Cluster is fully connected and operational
4. **Failed**: Cluster encountered an error during setup or operation
5. **Deleting**: Cluster is being removed from Faros
6. **Deleted**: Cluster has been successfully removed


## Agent Architecture

When you initialize a cluster in Faros, an **Agent** resource is created. The agent:

- Runs as a deployment in your Kubernetes cluster
- Establishes a secure WebSocket tunnel to Faros
- Uses JWT authentication for secure communication
- Provides read-only access to cluster resources
- Exposes MCP (Model Context Protocol) servers for AI integration
- Sends periodic heartbeats to maintain connection status

### Agent Deployment

The agent is deployed to your cluster using standard Kubernetes manifests:

```yaml
apiVersion: core.faros.sh/v1alpha1
kind: Agent
metadata:
  name: <cluster-name>
spec:
  clusterName: <cluster-name>
  token: <jwt-token>
```


## Remote Access

Faros provides secure remote access to your clusters without exposing them to the internet:

### SSH Access

```bash
kubectl faros clusters ssh <cluster-name>
```

This opens an interactive terminal session that:
- Uses WebSocket-based SSH tunneling
- Supports full terminal features (colors, resize, signals)
- Authenticates using your Faros credentials
- Provides secure access without VPN or direct network exposure

### MCP Server Access

For AI and LLM integration, clusters expose MCP servers:

```bash
kubectl faros clusters mcp <cluster-name>
```

This provides connection details for AI agents to query cluster data and metrics.


## Multi-Cluster Management

Faros is designed for organizations managing multiple clusters:

- **Unified View**: List and manage all clusters from one interface
- **Consistent Tooling**: Same CLI commands work across all clusters
- **Centralized Authentication**: Single sign-on via OAuth for all clusters
- **RBAC Integration**: Kubernetes-native access control using ClusterRoleBindings


## Security Model

Faros clusters follow these security principles:

- **Read-Only by Default**: Agents provide read-only access to cluster data
- **No Inbound Connections**: Clusters initiate outbound connections only
- **Token-Based Authentication**: JWT tokens authenticate agents
- **Kubernetes-Native RBAC**: Standard Kubernetes roles control access
- **TLS Encryption**: All communication is encrypted in transit


## Use Cases

Common scenarios for Faros cluster management:

1. **Multi-Cluster Monitoring**: Track status of production, staging, and development clusters
2. **AI-Powered Analysis**: Connect AI agents to analyze cluster health and performance
3. **Remote Troubleshooting**: SSH into clusters without direct network access
4. **Team Collaboration**: Share cluster access with team members via RBAC
5. **Compliance Auditing**: Centralized access logs and audit trails
