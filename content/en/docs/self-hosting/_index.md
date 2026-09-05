---
title: "Self-hosting"
description: "Install, configure, operate, and upgrade the hub and providers."
weight: 4
doc_type: "Overview"
---

Use the Faros SaaS hub to get started without operating the control plane. If you want to run Faros on your own infrastructure, choose the software you need to run:

- [Install a hub](/docs/self-hosting/hub/helm/): embedded kcp for a single-replica installation, or external kcp for a separately operated control plane.
- [Self-host an existing provider](/docs/self-hosting/providers/): connect your runtime to an existing hub.

Managing users on a running hub belongs in [Administration](/docs/administration/). Building a new provider belongs in [Extend Faros](/docs/extend/).

Before production use, establish a [storage and recovery procedure](/docs/self-hosting/hub/operations/) and inspect the deployed component versions. Source examples are not a certification of a production deployment.
