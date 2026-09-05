---
title: "Use project skills"
description: "Enable reusable guidance for the project assistant."
weight: 5
doc_type: "Guide"
---

Open the project’s **Skills** workbench to browse installed skills. Inspect a skill’s instructions and supporting resources before enabling it. Enable or disable it for the project, then confirm the enabled state in the catalog.

The workbench does not create, import, edit, export, or delete skills. Bundled and provider-distributed content is read-only. Project packages live under `.agents/skills`.

Skills provide guidance; they do not grant tools, models, permissions, or approval bypasses. Enabling a Databricks skill does not authorize access to a table. Set up [the project integration](/docs/use/app-studio/databricks/) separately.

If a package is absent, ask its owner to check distribution and package validation. Every package requires a `SKILL.md` with `name` and `description` front matter.
