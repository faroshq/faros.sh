---
title: AI Agents
date: 2024-06-02
description: >
  Understanding AI agents in Faros and their capabilities.
categories: [ai-agents, docs]
tags: [ai-agents, docs]
weight: 2
---

{{% pageinfo %}}
AI Agents in Faros provide intelligent analysis, recommendations, and automation for your Kubernetes clusters. Powered by large language models, they help identify issues, optimize configurations, and provide actionable insights.
{{% /pageinfo %}}


## What is an AI Agent?

An **AI Agent** in Faros is a resource that connects a large language model (LLM) to your Kubernetes clusters for intelligent analysis. Each agent:

- Connects to an AI backend (e.g., OpenAI, Anthropic)
- Uses a specific model (e.g., GPT-4, Claude)
- Has secure API key management via Kubernetes secrets
- Can analyze cluster data and provide recommendations
- Integrates with Faros clusters via MCP servers


## Agent Components

### Intelligence Backend

The backend is the AI service provider:
- **OpenAI**: GPT-4, GPT-3.5-turbo, GPT-4-turbo
- Additional backends planned for future releases

### Model Selection

Different models offer different capabilities:
- **GPT-4**: Advanced reasoning, complex analysis
- **GPT-3.5-turbo**: Fast responses, cost-effective
- **GPT-4-turbo**: Balanced performance and cost


## Agent Lifecycle

AI Agents go through these phases:

1. **Pending**: Agent resource created, waiting for initialization
2. **Initializing**: Connecting to AI backend, validating credentials
3. **Ready**: Agent is operational and available for tasks
4. **Failed**: Agent encountered an error (invalid API key, network issues)
5. **Deleting**: Agent is being removed
6. **Deleted**: Agent has been successfully removed


## Authentication and Secrets

AI Agents require API keys to connect to backend services. Faros supports two approaches:

### Automatic Secret Creation

When you provide `--api-key`, the CLI creates a secret:

```bash
kubectl faros ai-agents init \
  --name my-agent \
  --backend openai \
  --model gpt-4 \
  --api-key sk-...
```

This creates a Kubernetes secret: `<agent-name>-api-key`

### Manual Secret Management

For better secret management, create secrets separately:

```bash
# Create secret
kubectl create secret generic ai-credentials \
  --from-literal=openai-key=sk-...

# Reference it in the agent
kubectl faros ai-agents init \
  --name my-agent \
  --backend openai \
  --model gpt-4 \
  --secret-name ai-credentials \
  --secret-key openai-key
```


## Cluster Integration

AI Agents connect to clusters through:

### MCP (Model Context Protocol) Servers

Clusters expose MCP servers that agents query for data:

```bash
# Get MCP server details
kubectl faros clusters mcp production-cluster
```

The agent uses these endpoints to:
- Fetch cluster metrics
- Query resource status
- Analyze configurations
- Generate recommendations

### Cluster Selector

Agents can target specific clusters:

```yaml
apiVersion: intelligence.faros.sh/v1alpha1
kind: Agent
metadata:
  name: prod-analyzer
spec:
  backend: openai
  model: gpt-4
  clusterSelector:
    matchLabels:
      environment: production
```


## Use Cases

Common scenarios for AI Agents:

### Cluster Health Analysis
Agents analyze resource usage, pod status, and configurations to identify:
- Resource bottlenecks
- Misconfigured services
- Security vulnerabilities
- Cost optimization opportunities

### Troubleshooting Assistant
When issues occur, agents help:
- Diagnose error patterns in logs
- Suggest remediation steps
- Identify root causes
- Provide runbook recommendations

### Configuration Optimization
Agents review configurations and suggest:
- Resource limit adjustments
- Scaling policies
- Network policy improvements
- Storage optimizations

### Compliance and Security
Agents audit clusters for:
- Security best practices
- Policy violations
- Exposed secrets
- Non-compliant configurations


## API Resource Definition

AI Agents are defined in the `intelligence.faros.sh/v1alpha1` API group:

```yaml
apiVersion: intelligence.faros.sh/v1alpha1
kind: Agent
metadata:
  name: production-analyzer
  namespace: default
spec:
  backend: openai
  model: gpt-4
  secretRef:
    name: openai-credentials
    key: api-key
  clusterSelector:
    matchLabels:
      environment: production
status:
  phase: Ready
  lastHeartbeat: "2024-06-02T10:30:00Z"
  conditions:
    - type: Ready
      status: "True"
      lastTransitionTime: "2024-06-02T10:25:00Z"
```


## Best Practices

### Secret Management
- Use separate secrets for different environments
- Rotate API keys regularly
- Use RBAC to restrict secret access
- Never commit secrets to version control

### Model Selection
- Use GPT-4 for complex analysis requiring deep reasoning
- Use GPT-3.5-turbo for quick checks and simple queries
- Consider cost vs. capability trade-offs

### Agent Naming
- Use descriptive names: `prod-cost-analyzer`, `staging-security-audit`
- Include environment in name for clarity
- Use consistent naming conventions

### Resource Organization
- Deploy agents in dedicated namespaces
- Use labels for grouping and filtering
- Apply resource quotas to prevent excessive API usage
