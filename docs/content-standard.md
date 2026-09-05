# Product documentation standard

Write for the person performing the task. Start ordinary product workflows in Faros SaaS; mention an organization's self-hosted hub as an alternative when it changes sign-in or prerequisites. Do not make a SaaS user install provider services, configure server runtimes, or inspect control-plane objects to complete a console task.

## Task guides and tutorials

Every task guide should answer these six questions, in order where practical. Use descriptive headings; the literal labels are not mandatory.

| Part | Required information |
| --- | --- |
| Outcome | What will the user accomplish, and why would they do it? State it in the introduction. |
| Prerequisites | Selected workspace, enabled capability, required permission and existing input. Link to setup rather than repeating installation. Distinguish requirements from optional tools. |
| Exact steps | Use numbered steps and actual UI labels. Explain important choices and where each input comes from. Give realistic, copyable examples. |
| Expected result | State the visible status, response, or artifact that confirms success, including successful empty results. Creation or discovery alone may not prove readiness. |
| Recovery | Connect likely symptoms to specific checks and remedies. Explain cleanup and revocation for persistent resources or access. |
| Next step | Link to the next useful task, not a generic directory when a concrete destination is available. |

Keep optional CLI or administrator diagnostics in a clearly labeled section after the ordinary workflow and its expected result. A user should be able to finish a console workflow without installing the CLI. Preserve existing anchors when renaming diagnostic headings.

## Reference and overview pages

References are organized for lookup, not forced into six sequential headings. Include authenticated context, exact resource or endpoint, inputs and constraints, a copyable request, expected output, and relevant error handling. Explain how to obtain every variable used in a command. Never present placeholders as working credentials, assume optional providers exist, or invent release asset names.

Directory overviews need a short purpose and well-grouped links. Do not add filler to satisfy a word count. Troubleshooting pages should map symptoms to checks and recovery, with links to the owning guide.

## Verify technical claims

Check UI steps against the relevant portal component and technical claims against API types, handlers, CLI registrations, charts, or tests. Source behavior is not proof that an exact version is deployed to SaaS. If availability is uncertain, state the actual prerequisite and a way to verify it; avoid vague instructions such as “configure the runtime” or “use the supported flow.”

Distinguish a declared configuration from a reconciled result; an authentication success from authorization; and deletion of a Faros resource from removal of external data. Do not expose tokens in sample output.

For generated schemas, pass an explicit product revision:

```sh
python3 scripts/generate-docs-schemas.py /path/to/faros --revision COMMIT
```

The generator records the resolved commit in the page and JSON bundle and pins source links to it. Review changes before committing. Missing source descriptions must be identified honestly; explain important usage constraints in the API overview rather than inventing schema semantics.

## Validate a change

Review the rendered guide, its copyable examples, related links, Markdown export, and navigation ownership. Have a reviewer independently check meaningful technical changes. Do not claim live execution if only source verification was possible.

When a local Hugo server is running, build into an isolated directory so cleaning generated files does not break its assets:

```sh
npm run _hugo-dev -- --destination /tmp/faros-docs-review
python3 scripts/check-docs.py /tmp/faros-docs-review
DOCS_BUILD=/tmp/faros-docs-review node --test tests/docs-search.test.mjs tests/docs-navigation.test.mjs
python3 tests/docs-schemas.test.py
```
