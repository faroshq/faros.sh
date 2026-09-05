---
title: "Use project skills"
description: "Enable reusable guidance for the project assistant."
weight: 5
doc_type: "Guide"
---

## Prerequisites

Open the intended project in its workspace and verify that you have permission to change its configuration.

## Enable and verify

Open the project’s **Skills** workbench to browse installed skills. Inspect a skill’s instructions and supporting resources before enabling it. Enable or disable it for the project, then confirm the enabled state in the catalog.

The workbench does not create, import, edit, export, or delete skills. Bundled and provider-distributed content is read-only. Project packages live under `.agents/skills`.

Skills provide guidance; they do not grant tools, models, permissions, or approval bypasses. Enabling a Databricks skill does not authorize access to a table. Set up [the project integration](/docs/use/app-studio/databricks/) separately.

If a package is absent, ask its owner to check distribution and package validation. Every package requires a `SKILL.md` with `name` and `description` front matter.

Expected result: the selected skill appears enabled for the project and its guidance is available to the assistant; no new tool, model, credential, or approval authority is created. If enabling changes no catalog state, treat distribution or package validation as the failure and do not assume the skill is active.

Next: [configure project tools and data access](/docs/use/app-studio/databricks/). Use [App Studio troubleshooting](/docs/use/app-studio/troubleshooting/) for project or provider failures.
