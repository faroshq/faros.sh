---
title: "Skills command"
description: "Install the Faros skill for Claude Code and Codex."
weight: 7
doc_type: "Reference"
---

`kubectl faros skills` fetches the `skills/` directory of the [faros repository](https://github.com/faroshq/faros) and installs it where AI coding assistants look for skills. No git checkout or GitHub token is needed: one request downloads the source tarball for the chosen ref and keeps only `skills/<name>/` directories that contain a `SKILL.md`.

## install

```bash
kubectl faros skills install [NAME...] [flags]
```

With no name, every skill is installed. With one or more names, only those skills are installed.

| Flag | Description |
|:-----|:------------|
| `--target claude\|codex` | Install for one client only. The default installs for both. |
| `--scope user\|project` | `user` (default) writes to `~/.claude/skills` and `~/.agents/skills`. `project` writes to `./.claude/skills` and `./.agents/skills`. |
| `--dir <path>` | Write to an arbitrary directory instead of the client defaults, for example `~/.cursor/skills`. |
| `--ref <ref>` | Tag, branch, or commit to fetch. Defaults to the repository's default branch. |
| `--repo <owner/name>` | Fetch from a fork or another repository with the same `skills/` layout. |
| `--force` | Replace directories that the command did not create. |

Each installed skill lands in a temporary sibling directory and is renamed into place, so a failed download never leaves a half-written skill. A `.faros-skill.json` marker inside the directory records the repository, ref, commit, CLI version, and file list.

Re-running `install` replaces directories that carry the marker. Directories without the marker are treated as your own and are refused unless you pass `--force`. Symlinks are always refused, so running the command inside a checkout of the faros repository does not clobber the committed `.agents/skills/faros` link.

## list

```bash
kubectl faros skills list [-o json|yaml|name]
```

Prints the skills the repository offers at the chosen `--ref`, with file counts and the resolved commit. `--repo` and `--ref` behave as for `install`.

## Errors

An unknown ref returns the GitHub 404 as a clear error. A refused directory names the path and suggests `--force`. A symlink at the destination is reported and skipped. The full repository tarball is about 13 MB, so the command needs network access to `codeload.github.com` and a few seconds to complete.

See [MCP for AI agents](/docs/use/ai-assistants/) for what to do once the skill is installed.
