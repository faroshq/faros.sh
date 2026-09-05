---
title: "Provider access and lifecycle"
description: "Review dependencies, claims, organization ownership, and removal."
weight: 4
doc_type: "Guide"
---

## Enable a capability

Follow [Enable a provider](/docs/use/enable-provider/) in the target workspace. Review requested permission claims and dependencies before granting access. A provider running on the hub is not automatically enabled in every workspace.

## Organization-owned providers

An organization can register a provider it operates. Use the console’s **Providers → Self-Hosting** flow where available to obtain the provider workspace credential and generated installation instructions. An administrator must permit the organization operation; the runtime must be able to reach the advertised API endpoints.

Installing an existing provider belongs in [Self-hosting](/docs/self-hosting/providers/). Writing one belongs in [Extend Faros](/docs/extend/).

## Disable and remove

Identify resource owners and dependent applications first. Follow each provider’s cleanup instructions, then disable the workspace binding when its data and consumers no longer depend on it.

Deleting the platform Provider object tears down its provider workspace and can strand tenant bindings. Do not use this as a temporary disable operation. Coordinate removal with the operator and all affected workspaces.

## Verify and diagnose

After enabling a provider, use [API discovery and binding checks](/docs/use/enable-provider/#verify-enablement-from-the-cli) from its tenant workspace. For a registered provider whose service is unavailable, use the operator's separate [hosting-cluster diagnostics](/docs/self-hosting/operations/#inspect-the-hosting-cluster-from-the-cli). A running pod and a usable tenant API are distinct checks.
