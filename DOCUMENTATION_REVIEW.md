# Faros product documentation review and proposed structure

Review date: September 4, 2026 (America/Chicago).

**Recommendation:** organize documentation around what people need to accomplish: get started, use Faros, administer a workspace, operate a deployment, and extend the platform. Keep concepts and reference as shared destinations. Give every implemented provider a user-facing home, with a clear distinction between using a provider, self-hosting it, and developing one.

## Scope and confidence

Reviewed the local `faros.sh` checkout at `e2a65f1` (August 14, 2026) and sibling `faros` checkout at `0c79ff47` (September 4, 2026). Both remotes identify the `faroshq` GitHub organization. The comparison inventories public pages and product documentation, and checks selected claims against CLI registrations, API types, provider manifests, and chart configuration.

“Current” means this product checkout, not a verified released or hosted deployment. A remote HEAD check failed because shell DNS could not resolve GitHub. No deployment, end-to-end execution, or rendered-site usability testing was performed. Repository prose and design plans are supporting evidence, not proof of shipped behavior. Coverage below is qualitative; page counts are not a feature-completeness percentage.

## 1. Existing structure

The public site has **30 Markdown files**, including section landing pages, under `content/en/docs`:

| Section | Files | Assessment |
|---|---:|---|
| Documentation home | 1 | Product positioning, four primitives, edge use cases, entry links |
| Getting started | 3 | CLI installation and one edge-centric quickstart |
| Concepts | 1 | Useful introductory model, but too compressed for tenancy, identity, provider lifecycle, and data flow |
| CLI | 7 | Practical command guidance; a mixture of reference, procedures, and explanation |
| Deploy | 4 | Helm and ingress installation, with some upgrade/logging and troubleshooting guidance |
| Security | 4 | Authentication, tenancy, roles, and service-account overview |
| Providers | 10 | Substantial provider-author material; one catalog page also carries almost all end-user provider coverage |

The six sidebar groups are maintained separately from page front matter in [docs-sidebar.html](/Users/craigwilhite/github/faros.sh/layouts/partials/docs-sidebar.html). This is manageable at today's size, but every new page has a second registration step. A data-backed navigation manifest with validation would reduce drift; changing the site generator is unnecessary.

The strongest qualities are concrete commands, consistent page metadata, an approachable entry point, and detailed provider integration explanations. The Cloudflare guide also has verification and symptom-specific troubleshooting. Preserve these qualities.

The main structural problem is mixed audience and intent. A tenant looking for “create an application” must enter **Building providers** to find a catalog description. **Agent** in CLI means the edge daemon; **agents** in the catalog means hosted AI agents. **Deploy your own hub** does not explain the separate choice to self-host a provider against an existing hub.

The product repo contains **107 Markdown documents under `docs/`**, plus provider READMEs, chart READMEs, SDK documentation, source, and tests. These span user instructions, architecture, design-system contracts, investigations, and implementation plans. They contain valuable material, but do not form a coherent product manual.

## 2. Feature coverage comparison

“Overview only” means a feature is described in the public catalog but has no dedicated end-to-end user guide. “Partial” means usable guidance exists but important workflows or reference are missing. The rows describe documentation coverage, not operational certification.

| Capability | Public coverage | Product-repo evidence and additional coverage | Required clarification or addition |
|---|---|---|---|
| CLI, cluster/server registration, kubectl, SSH | Relatively strong introductory coverage | `pkg/cli/cmd/`, `providers/edges/README.md` | Preserve the path; add systematic diagnostics and consistent standalone/plugin installation instructions |
| Workspace selection, organizations, memberships, service accounts | Partial | `docs/organizations.md`, hub tenancy and service-account implementation | Add task pages for create, grant/revoke access, leave/delete, automation credentials, and explain effective permissions |
| Provider discovery and enablement | Fragmented across catalog, anatomy, and RBAC pages | `docs/byo-providers.md`, hub provider APIs | Tenant workflow: choose provider, understand dependencies/claims, enable, verify, disable and understand consequences |
| Org-owned/BYO providers | Brief deployment variant; no dedicated tenant workflow | `docs/byo-providers.md`, chart self-hosting recipes | Distinguish installing an existing provider from writing one; document placement and reachability prerequisites |
| Edge services, workloads, placement, marketplace | Overview only | `providers/edges/README.md`, `docs/edges-marketplace.md`, service/scheduler implementation | Connect a service, configure its credentials, expose its tools, deploy and remove a workload |
| Infrastructure templates and instances | Overview only, with outdated API model | `providers/infrastructure/apis/v1alpha1/types_instance.go`, `docs/infrastructure-flattened-instances.md`, provider docs | Provision/update/delete an `Instance`; separate template consumption from template authoring and runtime operation |
| Code and GitHub integration | Overview only | `providers/code/README.md`, `docs/code-provider-architecture.md` | Connect GitHub, create/import repositories, manage credentials/collaborators, inspect build status; label backend support |
| Hosted AI agents | Overview only | `providers/agents/README.md`, `docs/agents-provider-architecture.md`, channel/invocation documents | Create an agent, configure models/tools, use approvals, budgets, schedules, memory and channels; label optional infrastructure dependencies |
| App Studio | Overview only; resource list incomplete | `providers/app-studio/README.md`, Project/Session/Studio API types, publishing/runtime docs | Create a project, connect a repo, run a sandbox, preview, publish, manage sharing, skills and integrations |
| Kuery fleet search and impact | Overview only | `providers/kuery/README.md`, `docs/kuery-query-api.md` | Connect data sources, run a query, interpret impact results and freshness; distinguish implemented UI from planned visualization |
| Databricks | Overview only; omits query action/tool | `providers/databricks/README.md`, `manifest.yaml`, `actions/`, `mcpserver/tools.go` | Import a table, inspect schema, query it, grant an app access; document credential boundaries and result limits |
| MCP consumption and authoring | Useful coverage on both sides | CLI implementation, `docs/mcp-architecture.md` | Make MCP discoverable outside CLI; clarify credential principal, tool discovery, workspace scope, and failed/missing providers |
| Provider Actions and application SDK | No dedicated public coverage | `docs/provider-actions.md`, `provider-sdk/actions-node/README.md` | Explain versioned actions, exact resource grants, workload identity, consent, invocation, errors, and revocation; current shipped action is Databricks `query_table/v1` |
| Hub installation and production operations | Partial; mainly install-oriented | Embedded/external install docs, `hack/install/`, hub/provider chart values | Deployment decision guide, external kcp, replica constraints, provider installation, persistence, recovery, observability, upgrades and compatibility |
| Provider development | Best-developed architectural area | SDK, quickstart provider, connectivity/scoping/actions/publishing docs | Turn existing material into one tested build-enable-use tutorial plus precise contracts and advanced guides |
| REST, GraphQL, custom resources, chart values | Scattered fragments; no unified reference | `docs/graphql.md`, API types, CRDs, handlers, chart READMEs | A discoverable reference organized by supported interfaces, generated where possible |

The missing middle is **how to use the platform's capabilities**. The site currently offers a good initial edge experience and considerable extension architecture, but little guidance between those two levels.

## 3. Confirmed drift and conflicting claims

Fix these before expanding the catalog:

| Existing claim | Evidence in reviewed product checkout | Recommendation |
|---|---|---|
| Catalog and API author guide describe dynamic per-template infrastructure kinds | [Instance type](/Users/craigwilhite/github/faros/providers/infrastructure/apis/v1alpha1/types_instance.go:23) and [flattening document](/Users/craigwilhite/github/faros/docs/infrastructure-flattened-instances.md) define `Template` + `Instance`, with template-specific values in `spec.values` | Update catalog, concepts examples, API guide, and migration notes together |
| Connectivity guide says tunnel-terminating providers must run one replica; catalog repeats this | [Edges main](/Users/craigwilhite/github/faros/providers/edges/main.go:139) implements replica routing; [chart values](/Users/craigwilhite/github/faros/providers/edges/deploy/chart/values.yaml:15) explain Lease ownership and relay | Document supported routing configuration and fallback to single-replica mode; do not equate default replica count with a limit |
| Catalog lists `vibe-studio` as a provider and eventual App Studio successor | Eight provider modules exist; none is `vibe-studio` | Remove from the current inventory unless a maintained implementation and availability status can be established; preserve history separately if useful |
| App Studio catalog lists only `Project` | [Provider README](/Users/craigwilhite/github/faros/providers/app-studio/README.md) and API definitions include `Session` and `Studio`, plus skills and integrations | Refresh the feature overview and generate the resource inventory |
| Databricks catalog lists only `list_tables` and `describe_table` MCP tools | [Tool registration](/Users/craigwilhite/github/faros/providers/databricks/mcpserver/tools.go:250) includes `query_table`; manifest declares its versioned Provider Action | Document querying and application integration, including different authorization paths |
| Home says every action is a declarative object that can be audited and reverted | [Provider Actions](/Users/craigwilhite/github/faros/docs/provider-actions.md) describes synchronous request-scoped execution; SSH and data-plane operations are also not all durable resource writes | Explain desired-state resources, direct actions, and streams separately; avoid a blanket reversibility guarantee |
| Helm guide presents one StatefulSet model and logs a `kcp` container | [Current values](/Users/craigwilhite/github/faros/deploy/charts/faros-hub/values.yaml) distinguish in-process embedded kcp and external kcp; [workload template](/Users/craigwilhite/github/faros/deploy/charts/faros-hub/templates/workload.yaml) determines the actual pod layout | Rewrite around explicit embedded/external modes and verified workload/container names; cover portal GraphQL prerequisites |
| Product README points to GitHub Pages and uses `mcp url --name` | Public site uses `--mcpserver-name`, matching [CLI registration](/Users/craigwilhite/github/faros/pkg/cli/cmd/mcp.go:94) | Update product entry links and examples; the product README is not automatically more authoritative than the site |

The [public installation guide](/Users/craigwilhite/github/faros.sh/content/en/docs/getting-started/install.md) also installs a binary named `faros` and then implies `kubectl faros` will work automatically. Explain that kubectl plugin discovery requires a `kubectl-faros` executable or installation through krew, and verify each documented installation path.

Some conflicts remain questions for implementation verification, not confirmed bugs: security prose alternates between caller identity and MCPServer service-account credentials, and scope guarantees need to distinguish human sessions, automation identities, and provider controllers. Add an explicit identity/permission matrix instead of repeating broad isolation claims.

## 4. Comparison with established practice

| Practice | How Faros compares | Proposed application |
|---|---|---|
| Separate learning, task completion, facts, and explanation | CLI/provider pages mix these purposes | Assign each page a primary content type. Keep a tutorial's path narrow, put exhaustive flags in reference, and link to concepts for explanation. This follows [Diátaxis](https://diataxis.fr/start-here/). |
| Organize entry points around reader work | Current navigation emphasizes interfaces and implementation | Use task-oriented groups, with distinct use/administer/operate/extend paths. [GitLab's documentation](https://docs.gitlab.com/development/documentation/) provides a concrete example of these audience distinctions. |
| Procedures establish prerequisites, location, actions, and results | Edge and Cloudflare guides already do much of this; most provider features have descriptions only | Standardize on prerequisites, active workspace/identity, numbered steps, expected result, failure recovery, and cleanup where applicable. [Google's procedure guidance](https://developers.google.com/style/procedures) supports clear ordered actions and observable results. |
| One authoritative answer with a contribution workflow | Public docs, GitHub Pages content, provider READMEs, and design plans overlap | Give each topic one canonical source and one public URL; route feedback to its owner. GitLab explicitly treats its product docs as the [single source of truth](https://docs.gitlab.com/development/documentation/). |
| Reference reflects product structure | CLI flags, chart values, schemas and interfaces are scattered | Generate API/CLI/configuration inventories from versioned source, following [Diátaxis reference guidance](https://diataxis.fr/start-here/), and supply hand-authored examples and limitations. |

These principles do not require four literal top-level Diátaxis folders. For Faros, task-oriented navigation is more useful; tutorials, how-to guides, concepts, and reference are editorial types beneath it.

Additional Faros-specific maintenance recommendations: add validated navigation, real link/anchor checks, runnable quickstart examples, release applicability, and a feature-to-documentation checklist. The website's [package.json](/Users/craigwilhite/github/faros.sh/package.json) currently routes link checks to `IMPLEMENTATION PENDING`; `npm test` is therefore not evidence of checked links. The product repo already has installation scripts and associated e2e targets: reuse that mechanism rather than create another independently maintained installation recipe. Existing targets were inspected, not executed in this review.

Search is configured in `hugo.toml`; its discoverability and result quality need rendered testing before making usability claims. Similarly, add a meaningful version/compatibility policy before assuming the existing `version = "0.0"` setting provides one.

## 5. Proposed documentation navigation

This is the target structure, not a recommendation to publish empty sections immediately.

```text
Docs
├── Get started
│   ├── What Faros does / choose your path
│   ├── Hosted and self-hosted prerequisites
│   ├── Install the CLI
│   ├── Connect your first cluster or server
│   ├── Build and publish your first app
│   └── Create your first AI agent
├── Use Faros
│   ├── Console and workspace navigation
│   ├── Provider catalog and enablement
│   ├── Edges: clusters, servers, services, workloads
│   ├── Infrastructure: templates and instances
│   ├── Code: GitHub connections and repositories
│   ├── App Studio: projects, sandboxes, publishing, skills
│   ├── AI agents: chat, tools, approvals, budgets, schedules, channels
│   ├── Kuery: fleet search and impact
│   ├── Databricks: tables, queries, app integration
│   └── Connect external AI tools through MCP
├── Administer organizations and workspaces
│   ├── Organizations, workspaces, members and roles
│   ├── Service accounts and credential lifecycle
│   ├── Provider permissions, dependencies and lifecycle
│   └── Org-owned and self-hosted providers
├── Operate Faros
│   ├── Choose a deployment: embedded or external kcp
│   ├── Install hub and providers
│   ├── Networking, TLS, OIDC and secrets
│   ├── Scaling and availability by component
│   ├── Storage, backup and restore
│   └── Monitor, upgrade, migrate and uninstall
├── Extend Faros
│   ├── Build your first provider (quickstart scaffold)
│   ├── APIs, controllers, virtual workspaces and identity
│   ├── Portal integration and UI contracts
│   ├── MCP tools, Provider Actions and assistant skills
│   ├── Author infrastructure templates
│   └── Test, package and publish a provider
├── Concepts
│   └── Tenancy; provider lifecycle; identity; resources/actions;
│       control plane/runtime; edges; MCP; glossary
├── Reference
│   └── CLI; resource APIs; REST/GraphQL; provider contracts;
│       SDK; chart/configuration values; compatibility and limits
└── Troubleshooting and release notes
    └── Symptom index; known issues; breaking changes and migrations
```

Keep each provider's user documentation consistent: purpose and availability; prerequisites and dependencies; first successful task; common lifecycle tasks; permissions and data handling; limitations; troubleshooting; links to its reference and operator guide. The quickstart provider belongs primarily under **Extend Faros**, as a scaffold rather than a customer capability.

On the docs home, offer four concise entry links: **Use Faros**, **Manage your team**, **Run Faros**, **Build a provider**. Link to the appropriate quickstarts from those destinations. Keep the OS analogy as an optional explanation; lead with literal concepts and outcomes.

## 6. Canonical ownership and migration

Recommended near-term boundary:

| Content | Authoritative source | Public presentation |
|---|---|---|
| Tutorials, user/admin/operator guides, explanatory concepts | `faros.sh` content | `faros.sh/docs` |
| CLI commands, CRDs, chart values, SDK contracts | Versioned code/schema/chart source in `faros` | Generated or synchronized reference at the same docs site |
| Installation examples | Tested scripts in `faros`, pinned to a release/commit | Included or reproducibly extracted into the relevant guide |
| Engineering designs, research, ADRs, implementation plans | Explicit engineering areas in `faros/docs` | Linked only when helpful; status labeled and excluded from the primary user path |
| Repository and provider READMEs | Each repository/component | Short orientation, development details, canonical product-doc links |

Keep provider chart READMEs as the canonical values explanation where the console already embeds them. Publish the same content rather than maintaining a second manual table. A future move of all product-doc source into the product repo could improve atomic changes, but does not need to block the information architecture correction.

Map existing pages as follows:

| Current location | Destination |
|---|---|
| `getting-started/*` | Keep URLs where practical; add app and AI-agent routes |
| `cli/*` | Reference for commands; extract task guides into Use/Administer |
| `providers/catalog` | Use Faros → Provider catalog, linked to dedicated capability guides |
| Other `providers/*` | Extend Faros; extract operator onboarding and tenant enablement |
| `deploy/*` | Operate Faros, split by deployment mode and operation |
| `security/*` | Shared concepts, operator authentication setup, admin access tasks |
| `concepts` | Introductory overview plus focused explanations |
| Product GitHub Pages entry points | Canonical docs links and redirects where hosting allows |

Preserve old URLs and catalog anchors with aliases/redirects or compatibility landing pages. Update README links and in-product docs links at the same time. A taxonomy change need not force a URL change for every page.

Assign a named owner to each capability. Track page audience, type, source path, verified release/commit, and availability. Distinguish “implemented in main,” “released,” “enabled on this deployment,” and “preview”; none implies the others. Avoid introducing a version picker until there is a defined set of supported versions to maintain.

## 7. Prioritized delivery

1. **Restore accuracy and authority.** Correct Instance, scaling, catalog inventory, direct-action claims and install examples. Select canonical public URLs, update the product README, and identify the supported release/deployment baseline. Exit criterion: the catalog matches the selected release and every top-level entry points to current guidance.
2. **Fill the user-workflow gap.** Publish provider enablement, one App Studio tutorial, one hosted-agent tutorial, and one template-to-Instance guide. Add capability landing pages with explicit availability. Exit criterion: a reader can complete each documented outcome using only its prerequisites and linked docs.
3. **Make self-hosting operable.** Publish embedded/external deployment decisions, BYO provider instructions, component-specific replica/storage requirements, upgrade/migration guidance, diagnostics, and verified recovery procedures. Exit criterion: a tested installation path plus a documented recovery path for each persisted component in that path.
4. **Prevent repeat drift.** Generate reference, validate links/navigation, test the high-value examples, and require a documentation-impact decision in feature PRs. Exit criterion: public behavior changes identify affected guides and release notes before release.

Measure task completion and example failures first. Track catalog accuracy, broken links, time between a released change and its docs update, and failed searches once search telemetry is available. Avoid using page count as the success metric.
