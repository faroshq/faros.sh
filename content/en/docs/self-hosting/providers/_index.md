---
title: "Self-host an existing provider"
description: "Run a capability on your infrastructure and connect it to a hub."
weight: 2
doc_type: "Overview"
---

## Prerequisites

You need permission to onboard a provider, a Kubernetes runtime you administer, and network access from that runtime to the hub and advertised virtual-workspace endpoints. Select the intended organization before generating credentials.

1. Open **Providers → Self-Hosting** in the console when your deployment offers it.
2. Select the provider recipe and review required chart values and dependencies.
3. Obtain the scoped provider kubeconfig and create the runtime-cluster Secret expected by the chart. Treat it as a credential. A Secret in the hub cluster is not automatically visible in the provider cluster; use the generated command or create it explicitly with the `kubeconfig` data key.
4. Run the generated installation instructions using a reviewed chart/image version.
5. Verify pod readiness, provider registration, and a fresh heartbeat.
6. [Enable the provider](/docs/use/workspaces/enable-provider/) in a test workspace and complete its quickstart.

If a remote runtime cannot reach a virtual workspace, inspect the advertised endpoints and shard routing; connectivity to the public console alone is insufficient.

The guides below identify provider-specific state and constraints. Read the chart values for the exact deployed version before installing.

### Runtime-cluster Secret

When onboarding mints `provider.kubeconfig`, create the Secret in the cluster where the provider chart runs. For example:

```bash
kubectl create namespace faros-provider-quickstart
kubectl --namespace faros-provider-quickstart create secret generic faros-provider-kubeconfig \
  --from-file=kubeconfig=./provider.kubeconfig
```

The filename can differ, but the Secret data key must be `kubeconfig` unless the chart's `providerKubeconfig.secretName` and key settings say otherwise. Prefer the generated command under **Providers → Self-Hosting**, which also supplies the chart version and provider-specific values.
