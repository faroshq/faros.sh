#!/usr/bin/env python3
"""Generate provider schema tables from a pinned product checkout. Requires Ruby stdlib YAML."""
import argparse
import json
from pathlib import Path
import subprocess

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('product_repo', type=Path)
parser.add_argument('--revision', required=True, help='Product commit or ref to document; resolved to an immutable commit in generated output.')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
def git(*arguments):
    return subprocess.check_output(['git', '-C', str(args.product_repo), *arguments], text=True)
revision = git('rev-parse', '--verify', args.revision+'^{commit}').strip()
paths = git('ls-tree', '-r', '--name-only', revision, 'providers').splitlines()
providers = ['app-studio', 'agents', 'edges', 'infrastructure', 'code', 'kuery', 'databricks']
def cell(value):
    text = ' '.join(str(value).split())
    for char, escaped in [('&', '&amp;'), ('<', '&lt;'), ('>', '&gt;'), ('\\', '&#92;'), ('|', '&#124;'), ('[', '&#91;'), (']', '&#93;')]:
        text = text.replace(char, escaped)
    return text

def fields(schema, prefix=''):
    for name, field in schema.get('properties', {}).items():
        path = prefix+name
        constraints = []
        for key in ['default', 'enum', 'minimum', 'maximum', 'minLength', 'maxLength', 'minItems', 'maxItems', 'pattern']:
            if key in field:
                constraints.append(f'{key}: {json.dumps(field[key], ensure_ascii=False)}')
        kind = field.get('type', 'unspecified')
        if kind == 'array':
            kind += '[' + field.get('items', {}).get('type', 'object') + ']'
        required = 'Yes' if name in schema.get('required', []) else 'No'
        description = field.get('description', '')
        detail = ' '.join([description, '; '.join(constraints)]).strip() or 'No description supplied by the source schema.'
        yield f'| `{path}` | {cell(kind)} | {required} | {cell(detail)} |'
        yield from fields(field, path+'.')
        if 'items' in field:
            yield from fields(field['items'], path+'[].')
for provider in providers:
    bundle = []
    for path in paths:
        if not (path.startswith(f'providers/{provider}/deploy/chart/files/schemas/') or (provider == 'infrastructure' and path.startswith('providers/infrastructure/install/crds/'))) or not path.endswith('.yaml'):
            continue
        raw = git('show', f'{revision}:{path}')
        schema = json.loads(subprocess.check_output(['ruby', '-ryaml', '-rjson', '-e', 'puts JSON.generate(YAML.safe_load(STDIN.read, aliases: true))'], input=raw, text=True))
        bundle.append({'source': path, 'schema': schema})
    if not bundle:
        continue
    target = root/'static/schemas'/f'{provider}.json'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps({'revision': revision, 'resources': bundle}, indent=2)+'\n')
    lines = ['---', 'title: "Resource schemas"', f'description: "Generated fields and validation rules for {provider} workspace resources."', 'weight: 91', 'doc_type: "Reference"', f'provider: "{provider}"', '---', '',
      '## Compatibility and access', '',
      f'Generated from [product commit `{revision[:12]}`](https://github.com/faroshq/faros/commit/{revision}). This is a source snapshot, not a guarantee that your deployment runs this version.', '',
      f'These resource schemas describe provider configuration. Check your deployed API discovery for the schema installed in your hub. Use the intended [workspace context](/docs/reference/cli/resources/) and an identity permitted to read or change the resource. Required fields below are required within their containing object; optional parent objects may be omitted.', '',
      f'[Download complete schemas](/schemas/{provider}.json), including nested validation rules and status definitions. This page covers Kubernetes-style resources; provider HTTP actions and runtime behavior are separate contracts. Return to [API reference](/docs/reference/providers/{provider}/) for those interfaces and related guides.', '']
    for entry in bundle:
        spec = entry['schema']['spec']
        for version in spec['versions']:
            lines += [f"## {spec['names']['kind']} ({version['name']})", '',
              f"API: `{spec['group']}/{version['name']}` · Resource: `{spec['names']['plural']}` · Scope: `{spec['scope']}`", '',
              f"[Source schema](https://github.com/faroshq/faros/blob/{revision}/{entry['source']})", '',
              '```bash', f"kubectl explain {spec['names']['plural']}.{spec['group']} --api-version={spec['group']}/{version['name']} --recursive", '```', '',
              '| Field | Type | Required in parent | Description and constraints |', '| --- | --- | --- | --- |']
            schema = version['schema'].get('openAPIV3Schema', version['schema'])
            filtered = {**schema, 'properties': {key:value for key,value in schema.get('properties',{}).items() if key not in ['apiVersion','kind','metadata']}}
            lines += list(fields(filtered)) + ['']
    (root/'content/en/docs/reference/providers'/provider/'schemas.md').write_text('\n'.join(lines).rstrip()+'\n')
    ref = root/'content/en/docs/reference/providers'/provider/'_index.md'
    text = ref.read_text()
    link = f'[Resource fields and validation rules](/docs/reference/providers/{provider}/schemas/)'
    if link not in text:
        text = text.replace('## Authoritative definitions', f'## Resource schemas\n\n{link} are generated from the checked-in schemas, with a downloadable JSON bundle.\n\n## Authoritative definitions')
        ref.write_text(text)
    print(f'{provider}: {len(bundle)} schemas')
