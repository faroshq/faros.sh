---
title: Manage AI Agents
date: 2024-06-02
description: >
  How to create and manage AI agents for cluster intelligence and automation.
categories: [cli, ai-agents, docs]
tags: [cli, ai-agents, docs]
weight: 3
---

{{% pageinfo %}}
Faros integrates AI agents powered by LLMs to provide intelligent cluster analysis, recommendations, and automation capabilities. AI agents can be deployed to analyze your clusters and provide actionable insights.
{{% /pageinfo %}}


## Prerequisites

- Ensure you have installed the Faros CLI. If not, refer to the [CLI installation guide](/docs/getting-started/cli/).
- Authenticate with Faros: `kubectl faros login`
- An API key for your chosen AI backend (e.g., OpenAI)


## Listing AI Agents

View all AI agents in your namespace:

```bash
kubectl faros ai-agents list
# or simply
kubectl faros ai-agents
```

This displays:
- **NAME**: Agent name
- **BACKEND**: AI backend (e.g., openai)
- **MODEL**: Model being used (e.g., gpt-4)
- **PHASE**: Current status (Pending, Initializing, Ready, Failed)
- **AGE**: Time since agent creation


## Creating a New AI Agent

Initialize a new AI agent with specific configuration:

```bash
kubectl faros ai-agents init \
  --name <agent-name> \
  --backend openai \
  --model gpt-4 \
  --api-key <your-api-key>
```

### Configuration Options

- `--name`: Name of the AI agent
- `--backend`: AI backend provider (default: openai)
- `--model`: Model to use (e.g., gpt-4, gpt-3.5-turbo)
- `--api-key`: API key for the backend (creates a Kubernetes secret)
- `--secret-name`: Use an existing Kubernetes secret instead of creating one
- `--secret-key`: Key within the secret containing the API key
- `--namespace` or `-n`: Kubernetes namespace for the agent (default: current namespace)

### Using Existing Secrets

If you prefer to manage secrets separately:

```bash
# First, create a secret with your API key
kubectl create secret generic openai-credentials \
  --from-literal=api-key=<your-api-key>

# Then reference it when creating the agent
kubectl faros ai-agents init \
  --name my-agent \
  --backend openai \
  --model gpt-4 \
  --secret-name openai-credentials \
  --secret-key api-key
```


## Agent Lifecycle

When you create an agent, the CLI:
1. Creates an Agent resource in the `intelligence.faros.sh/v1alpha1` API group
2. Creates or references a Kubernetes secret for authentication
3. Waits for the agent to transition to Ready phase
4. Displays status and next steps


## Example Workflow

```bash
# List existing agents
kubectl faros ai-agents list

# Create a new agent for production cluster analysis
kubectl faros ai-agents init \
  --name prod-analyzer \
  --backend openai \
  --model gpt-4 \
  --api-key sk-...

# Wait for agent to be ready
# Output: Agent "prod-analyzer" created and is now Ready

# List agents to verify
kubectl faros ai-agents list
```


## Backend Support

Currently supported AI backends:
- **OpenAI**: GPT-4, GPT-3.5-turbo, and other OpenAI models

Additional backends may be supported in future releases.
