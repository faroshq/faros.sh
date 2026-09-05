# Documentation navigation validation

## Design and source baseline

The implemented navigation follows the approved five primary destinations and four secondary destinations. Each provider has a local sidebar; hosting instructions stay under Self-hosting. A lightweight [navigation prototype](navigation-prototype.html) was created and inspected before the full documentation shell was implemented. Open the HTML file locally to review the tree without the site styling.

Content was checked against the local Faros source at `0c79ff47`. Versioned source links distinguish implementation evidence from release or hosted-service availability. Product workflows were not exercised against a running hub. The release-notes destination explicitly records that limitation rather than inventing release history.

## Repeatable checks

Run `npm test` (Node, Python 3, and the repository's pinned Hugo extended installation required).

- Rendered internal documentation links and fragment targets resolve.
- All published documentation appears in the global search index.
- Primary and secondary destinations and all seven provider areas exist.
- Search metadata identifies provider and content type.
- Task-oriented search tests cover application creation, scheduling, teammates, provider hosting, provider development, and Databricks integration.
- Search filtering, empty/unmatched queries, and case-insensitive multiword matching are covered.

Browser checks cover desktop and 390-pixel mobile layouts, local sidebars, direct reference arrivals, global and provider-filtered search, independent navigation/TOC disclosure controls, keyboard activation and Escape focus return, same-page anchors, and horizontal overflow. These checks verify behavior; they do not substitute for a reader study.

The latest local build passed with 103 indexed entries and all 4,984 internal link, anchor, and asset references checked. All nine search tests passed. The mechanical style scan returned no findings in its regex fallback mode; parser dependencies were unavailable, so this is not a contrast or accessibility audit.

## Reader study — pending

Recruit five people unfamiliar with the navigation. Give them these tasks without naming the expected section. Start each task at the docs home, except the final direct-arrival task. Record the first path, destination reached, assistance, and confusing labels. Test the prototype first when evaluating alternative labels; repeat with the implemented site for interaction issues.

| Task | Intended destination | Unaided successes |
| --- | --- | --- |
| Find and start building an application | Use Faros / App Studio / Quickstart | Pending / 5 |
| Find how to schedule an AI agent | Use Faros / AI agents / Schedules and triggers | Pending / 5 |
| Add a teammate to a workspace | Administration / Add a teammate and manage roles | Pending / 5 |
| Self-host an existing provider | Self-hosting / Providers / selected provider | Pending / 5 |
| Build a new provider | Extend Faros / Build your first provider | Pending / 5 |
| Use Databricks from an application, starting from both providers | App Studio / Build an application using Databricks data | Pending / 5 |
| Open a provider reference URL and identify provider, prerequisites, and related guide | Provider reference with breadcrumb, local sidebar, and contextual links | Pending / 5 |

Accept each task only when at least four of five readers reach the intended destination without help. Record each starting point separately for the Databricks task. Revise labels or placement for failures and retest. No participant success rate is claimed by this implementation.

## Prioritized content improvements

Implemented against product source `0c79ff47`:

- Corrected context deletion versus credential removal/revocation; narrowed Tunnel security claims and token scope guidance.
- Expanded the App Studio release/sharing path and added model credential onboarding.
- Added a downloadable Databricks server example with the exact SDK npm alias, runtime requirements, bounded schema discovery, identity checks, and verification commands.
- Added symptom/check/fix troubleshooting for App Studio, AI agents, and Databricks.
- Expanded Code hosting and scaffold development into command-level walkthroughs.
- Generated field tables and downloadable schemas for all seven provider areas (27 resources). Generation is repeatable from a pinned commit.

Validation scope: local build/link/search checks, shell syntax, Code Helm rendering, and the Databricks handler using the real pinned SDK with a simulated gateway. A live hub, actual model provider, registry pull, and Databricks warehouse were not available for acceptance testing. Do not present these checks as successful live user journeys.

Before release, run the three flagship tutorials with a fresh workspace and a non-admin recipient; install Code into a disposable hosting cluster; run the scaffold development sequence; verify runtime cleanup and upstream retained resources. Record hub/image/chart/SDK versions, results, and a named reviewer for each walkthrough. Then complete the reader study above.
