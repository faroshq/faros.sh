---
title: "How to create Faros account"
date: 2024-05-01T00:01:00+01:00
image: /images/account.webp
description: "How to install faros cli plugins and create faros account"
authors:
- Mangirdas Judeikis
tags: [faros,install,cloud,kubernetes,kcp]
---

# Accessing Faros Cloud for Kubernetes Management

To effectively manage your Kubernetes clusters and workspaces, access to Faros cloud is essential. This guide will walk you through the steps to install Faros CLI plugins and set up a Faros account.

## Join the Faros Cloud

The Faros CLI can function as a standalone tool or as a plugin for kubectl. Follow these instructions to install Faros CLI plugins for kubectl:


### Prerequisites:
- Ensure `kubectl` is installed. If not, refer to the [official Kubernetes documentation](https://kubernetes.io/docs/tasks/tools/) for installation guidance.
- Install `krew`, the kubectl plugin manager, following the [official krew documentation](https://krew.sigs.k8s.io/docs/user-guide/setup/install/).


### Plugin Installation:
Execute the commands below to add the Faros plugin and install it:
```bash
kubectl krew index add faros https://github.com/faroshq/krew-index.git
kubectl krew install faros/faros
```

### Understanding Workspaces

Workspaces in Faros are akin to Kubernetes namespaces, but with enhanced functionality. They are designed to group resources together under a virtual cluster-like environment, without being actual clusters. Each workspace contains its own resources, such as namespaces, service accounts, roles, roleBindings, secrets, and configMaps.



### Setting Up and Managing Workspaces

```bash
kubectl faros login
```

Once logged in, create and manage new workspaces similarly to how you would manage a regular Kubernetes cluster.

Users can be invited via their email, associated with their GitHub accounts, using the following role binding template:

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

### Explore Kubernetes APIs

Check the supported APIs using the command:

```bash
kubectl api-resources
```

### View Logical Clusters:

To view your current logical cluster, use:

```bash
$ k get logicalcluster
NAME      PHASE   URL                                              AGE
cluster   Ready   https://kcp.faros.sh:443/clusters/ixn3tjgtr9bb   10d
```

### Next steps

Once you have your account, now you can start exploring [Faros workspaces](/docs/how-to-create-faros-workspace/)
