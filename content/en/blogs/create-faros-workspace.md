---
title: "How to Create a Faros Workspace"
date: 2024-05-02T00:02:00+01:00
image: /images/workspace.webp
description: "First steps to create a Faros workspace and nest them to create a hierarchy."
authors:
- Mangirdas Judeikis
tags: [faros, install, cloud, kubernetes, kcp]
---

## Understanding Workspaces in Faros

Workspaces in Faros function like enhanced Kubernetes namespaces. They simulate standalone virtual clusters, providing a structured way to group resources. Each workspace includes its own set of resources such as namespaces, service accounts, roles, roleBindings, secrets, and configMaps.

## Creating a New Workspace

### Step-by-Step Workspace Creation

**Check Current Hierarchy Level Workspaces**:

```yaml
kubectl get ws
```

**View Full Hierarchy Tree:**

```yaml
kubectl faros ws tree
```

**Create the First Workspace Named clusters**:

```yaml
kubectl faros ws create clusters
# Confirmation of creation and readiness
Workspace "clusters" (type root:faros) created. Waiting for it to be ready...
Workspace "clusters" (type root:faros) is ready to use.
```

**Check the Newly Created Workspace:**:

```yaml
kubectl get ws
# Example output
NAME       TYPE    REGION   PHASE   URL                                                     AGE
clusters   faros            Ready   https://kcp.faros.sh:443/clusters/exampleorg:clusters   7s
```

### Creating Nested Workspaces

**Navigate Inside the Workspace:**
```yaml
kubectl faros ws use clusters
kubectl faros ws create prod
```

**Return to Root Workspace:**:
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

### Next steps

After creating your workspace, you can proceed to integrate remote clusters. For more details on how to mount remote clusters to Faros, visit [how to mount remote cluster to Faros](/docs/how-to-mount-a-remote-kubernetes-cluster/) for more details.
