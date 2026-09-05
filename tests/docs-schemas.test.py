#!/usr/bin/env python3
"""Regression coverage for the provider schema documentation generator."""

import subprocess
import tempfile
import json
import unittest
from pathlib import Path


PROVIDERS = (
    "app-studio",
    "agents",
    "edges",
    "infrastructure",
    "code",
    "kuery",
    "databricks",
)


SCHEMA = """\
spec:
  group: example.faros.sh
  scope: Namespaced
  names:
    kind: Example
    plural: examples
  versions:
    - name: v1alpha1
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                name:
                  type: string
                  description: Example name
"""


class SchemaGeneratorTest(unittest.TestCase):
    def test_generates_provider_reference_schema_pages(self):
        repo = Path(__file__).resolve().parents[1]
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            product = root / "product"
            product.mkdir()
            subprocess.run(["git", "init", "-q", str(product)], check=True)
            subprocess.run(["git", "-C", str(product), "config", "user.email", "test@example.com"], check=True)
            subprocess.run(["git", "-C", str(product), "config", "user.name", "Schema Test"], check=True)

            for provider in PROVIDERS:
                schema_path = product / "providers" / provider / "deploy" / "chart" / "files" / "schemas" / "example.yaml"
                schema_path.parent.mkdir(parents=True, exist_ok=True)
                schema_path.write_text(SCHEMA)

                reference = root / "content" / "en" / "docs" / "reference" / "providers" / provider / "_index.md"
                reference.parent.mkdir(parents=True, exist_ok=True)
                reference.write_text("---\ntitle: API\n---\n\n## Authoritative definitions\n")

            subprocess.run(["git", "-C", str(product), "add", "."], check=True)
            subprocess.run(["git", "-C", str(product), "commit", "-qm", "fixture"], check=True)

            script = root / "scripts" / "generate-docs-schemas.py"
            script.parent.mkdir()
            script.write_text((repo / "scripts" / "generate-docs-schemas.py").read_text())
            subprocess.run(["python3", str(script), str(product), "--revision", "HEAD"], cwd=root, check=True)

            revision = subprocess.check_output(["git", "-C", str(product), "rev-parse", "HEAD"], text=True).strip()
            for provider in PROVIDERS:
                schema = root / "content" / "en" / "docs" / "reference" / "providers" / provider / "schemas.md"
                reference = root / "content" / "en" / "docs" / "reference" / "providers" / provider / "_index.md"
                text = schema.read_text()
                self.assertIn(f'/blob/{revision}/', text)
                self.assertNotIn('/blob/main/', text)
                self.assertIn(f'product commit `{revision[:12]}`', text)
                bundle = json.loads((root / 'static' / 'schemas' / f'{provider}.json').read_text())
                self.assertEqual(bundle['revision'], revision)
                self.assertIn(f'provider: "{provider}"', text)
                self.assertIn(f"/docs/reference/providers/{provider}/", text)
                self.assertIn(f"/schemas/{provider}.json", text)
                self.assertIn(f"/docs/reference/providers/{provider}/schemas/", reference.read_text())
                self.assertFalse((root / "content" / "en" / "docs" / "use" / provider / "schemas.md").exists())


if __name__ == "__main__":
    unittest.main()
