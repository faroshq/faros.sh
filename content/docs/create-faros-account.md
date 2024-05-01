---
title: "How to create Faros account"
date: 2024-05-01T00:01:00+01:00
image: /images/front.webp
description: "How to install faros cli plugins and create faros account"
authors:
- Mangirdas Judeikis
tags: [faros,install,cloud,kubernetes,kcp]
---

Faros cloud access is required to manage your Kubernetes clusters and workspaces. In this guide, we will show you how to install Faros CLI plugins and create a Faros account.

### Join the Faros cloud

Faros CLI can be used as standalone tool or as a plugin for kubectl. In this guide, we will show you how to install Faros CLI plugins for kubectl.

To install Faros CLI plugins, you need to have kubectl installed. If you don't have kubectl installed, you can follow the [official Kubernetes documentation](https://kubernetes.io/docs/tasks/tools/) to install it. In addition, you need to have krew installed. If you don't have krew installed, you can follow the [official krew documentation](https://krew.sigs.k8s.io/docs/user-guide/setup/install/).

To install Faros CLI plugins, run the following command:

```bash
kubectl krew index add faros https://github.com/faroshq/krew-index.git
kubectl krew install faros/faros
```

**Workspaces** in Faros are like namespaces in Kubernetes with steroids. They act and feel like standalone virtual clusters, but they are not. They are just a way to group resources together and provide a way to manage them in a more structured way. Each workspace has its own set of resources, such as namespaces, service-accounts, roles and roleBindings, secrets and configMaps.

Login into Faros cloud with the following command and use your GitHub to login.

```bash
kubectl faros login
```

Once you are logged in, you can create a new workspace, explore kubernetes apis:

Check supported APIs:
```bash
kubectl api-resources
```

Now you are cluster/workspace admin for your cluster/workspace. You can create new workspaces, invite users, and manage resources
as you would do in a regular Kubernetes cluster.

All sso users are identified by their emails, associated with their GitHub accounts. You can invite users to your workspace by their email
with prefix `faros-sso-{email}` by creating a new role binding:

Example:

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
  name: faros-sso-mangirdas@judeikis.lt
```

You now can share your workspace with your team members and start managing your
Kubernetes resources in a more structured way.

To see your current "logical cluster", run the following command:

```bash
$ k get logicalcluster
NAME      PHASE   URL                                              AGE
cluster   Ready   https://kcp.faros.sh:443/clusters/ixn3tjgtr9bb   10d
```

### Next steps

Once you have your account, now you can start exploring [Faros workspaces](/docs/how-to-create-faros-workspace/)
