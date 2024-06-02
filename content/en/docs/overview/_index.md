---
title: Overview
description: Faros - Platform as a Service for Kubernetes like experience.
categories: [Intro]
tags: [faros, intro, docs]
weight: 1
---

Overall Faros is built, so you can build your own platforms on top of it.
While we understand that it is not for everyone, we believe that it can be a
great tool for those who want to build their own platforms.

In addition we will be working for some core features "out of the box" that
can be used by everyone. And hope with time we will be able to provide more
features that can be used by everyone.

## What is it?

Faros is distributes control-plane for Kubernetes-like control planes.

## Why do I want it?

For now we are focusing on the following use-case:

1. I have remote k8s cluster and I want to access it from my local machine without
   exposing it to the internet.

* **What is it good for?**: You have k3s, k0s, k8s, or any other kubernetes cluster
  and you want to access it from your local machine without exposing it to the
  internet.


* **What is it *not yet* good for?**: We will enable more features in the future
  that will make it more useful for other use-cases. In example 0 trust access
to the cluster, or multi-tenancy where we can expose only certain namespaces to
certain users. This allows you to share your cluster with others without giving
them full access to the cluster.

## Where should I go next?

To get started, check out the following sections:

* [Getting Started](/docs/getting-started/): Get started with Faros.

