---
title: "Release notes"
description: "Check deployed versions before following an upgrade or migration."
weight: 1
aliases:
  - /docs/releases/
doc_type: "Reference"
---

Use the [Faros release history](https://github.com/faroshq/faros/releases) for published tags and release notes. Record the hub, provider images, charts, and API versions used by your deployment; independently packaged providers need not share one version.

## Check your deployment

Available features depend on your installed hub and provider versions. Check your deployment’s catalog and release notes before following an upgrade guide.

## Upgrade considerations

These are compatibility topics to check against the release you are installing, not a dated changelog or a supported-version matrix. For SaaS, consult the published release notes; the deployment checks below are for self-hosting operators.

- Infrastructure exposes Template and Instance rather than dynamic tenant-facing per-template kinds. Review the [Instance model](https://github.com/faroshq/faros/blob/main/docs/infrastructure-flattened-instances.md) before upgrading older workspaces.
- Edge replica routing requires its supporting chart and internal relay configuration; a replica count alone is not a complete migration.
- Provider permission-claim changes may require existing bindings to accept new claims. Check dependencies before rollout.

Follow [upgrade and recovery guidance](/docs/self-hosting/hub/operations/) and test the exact versions you intend to deploy.
