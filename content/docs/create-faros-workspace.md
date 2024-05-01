---
title: "How to create Faros workspace"
date: 2024-05-01T00:02:00+01:00
image: /images/front.webp
description: "First steps to create a Faros workspace and nest them to create hierarchy"
authors:
- Mangirdas Judeikis
tags: [faros,install,cloud,kubernetes,kcp]
---

**Workspaces** in Faros are like namespaces in Kubernetes with steroids. They act and feel like standalone virtual clusters, but they are not. They are just a way to group resources together and provide a way to manage them in a more structured way. Each workspace has its own set of resources, such as namespaces, service-accounts, roles and roleBindings, secrets and configMaps.

### Create a new workspace

```bash
# get current hierarchy level workspaces
kubectl get ws
# see full hierarchy tree
kubectl faros ws tree
```

Create first workspace named `clusters`:

```bash
kubectl faros ws create clusters
# create first workspace named `clusters`
kubectl faros ws create clusters
Workspace "clusters" (type root:faros) created. Waiting for it to be ready...
Workspace "clusters" (type root:faros) is ready to use.
# get current hierarchy level workspaces
kubectl get ws
NAME       TYPE    REGION   PHASE   URL                                                     AGE
clusters   faros            Ready   https://kcp.faros.sh:443/clusters/exampleorg:clusters   7s
```

Get inside the workspace and create workspace `prod`:

```bash
kubectl faros ws use clusters
kubectl faros ws create prod
```

Now get back to "root" workspace and show full workspace hierarchy:

```bash
kubectl faros ws use :
# show full hierarchy tree
kubectl faros ws tree

kubectl ws tree
.
└── ixn3tjgtr9bb
    └── clusters
        └── prod
```

### Next steps

Once you have workspace created, now you can mount remote cluster to it. Check [how to mount remote cluster to Faros](/docs/mount-remote-cluster-to-faros) for more details.
```
