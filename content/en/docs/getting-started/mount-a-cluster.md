---
title: Mount a Cluster
date: 2024-06-02
description: >
  How to mount a remote cluster into your local workspace for easier management and access to resources.
categories: [cli, workspaces, docs]
tags: [cli, workspaces, docs]
weight: 2
---

{{% pageinfo %}}
Once you have installed the Faros CLI, you can create a workspace to group resources together under a virtual cluster-like environment. Each workspace contains its own resources, such as namespaces, service accounts, roles, roleBindings, secrets, and configMaps.
{{% /pageinfo %}}


### Prerequisites:
- Ensure you have installed the Faros CLI. If not, refer to the [official Faros documentation](/docs/getting-started/install-cli/).

### Step-by-Step Workspace Creation

#### Check Current Hierarchy Level Workspaces:

```yaml
kubectl get ws
```

#### View Full Hierarchy Tree:


```yaml
kubectl faros ws tree
```

#### Create the First Workspace Named **clusters**:

```yaml
kubectl faros ws create clusters
# Confirmation of creation and readiness
Workspace "clusters" (type root:faros) created. Waiting for it to be ready...
Workspace "clusters" (type root:faros) is ready to use.
```

#### Check the Newly Created Workspace:

```yaml
kubectl get ws
# Example output
NAME       TYPE    REGION   PHASE   URL                                                     AGE
clusters   faros            Ready   https://kcp.faros.sh:443/clusters/exampleorg:clusters   7s
```

### Creating Nested Workspaces & Navigating

Navigate Inside the Workspace:
```yaml
kubectl faros ws use clusters
kubectl faros ws create prod
```

Return to Root Workspace:
```yaml
kubectl faros ws use :
```

**Display Full Workspace Hierarchy:**
```yaml
kubectl faros ws tree
kubectl ws tree
# Example output
.
└── ixn3tjgtr9bb
    └── clusters
        └── prod
```

How each workspace is structured and managed is up to you. You can create as many workspaces as you need, and nest them as required.
