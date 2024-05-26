---
title: "How to Mount a Remote Kubernetes Cluster"
date: 2024-05-03T00:03:00+01:00
image: /images/mount.webp
description: "How to mount a remote cluster to a Faros cluster for remote access and management."
authors:
- Mangirdas Judeikis
tags: [faros, install, cloud, kubernetes, kcp]
---

## Preparing to Mount a Remote Cluster

This article assumes you have CLI access to your Faros cloud and a workspace ready to mount a remote Kubernetes cluster.

### Mounting a Remote Cluster

**Access Your Workspace**:
Navigate to the `clusters` workspace created in the previous article:
```yaml
kubectl faros ws use clusters
```

**Create a New Workspace:**
For this example, we'll create a new workspace named mini to correspond with our remote cluster running `k3s`:
```yaml
kubectl faros ws create mini
```

**Mount the Remote Cluster Locally:**
If you have access to the remote cluster from your local machine:

```yaml
kubectl faros mount mini -w mini --remote-kubeconfig=kind.kubeconfig
```

After mounting, using `kubectl faros ws use mini` will give you access to the remote cluster.

**Mount the Remote Cluster from a Remote Machine:**
If the remote cluster is not accessible from your local machine:

```yaml
kubectl faros mount mini -w mini
```

You'll need to deploy resources manually to the remote cluster:

```yaml
# Get resources to deploy
kubectl get configmap mini-resources -o jsonpath='{.data.resources}' > mini-resources.yaml

# Deploy resources
kubectl apply -f mini-resources.yaml --kubeconfig <your-kubeconfig>

# Wait for the cluster to accept the mount
kubectl get KubeCluster -w
```

**Verify All Mounted Clusters:**
```yaml
kubectl faros ws tree -f
.
└── ixn3tjgtr9bb
    └── ixn3tjgtr9bb:clusters
        ├── ixn3tjgtr9bb:clusters:mini
        └── ixn3tjgtr9bb:clusters:prod
```

With these steps, you can mount any remote cluster to your Faros workspace, allowing for
streamlined management and access through a
single command like

 `kubectl faros ws use ixn3tjgtr9bb:clusters:mini`

 or by navigating the workspace hierarchy.
