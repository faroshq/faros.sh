# faros.sh site tasks. Day-to-day builds still go through npm scripts; this
# file exists for tasks that reach outside the repository.

# Local checkout of github.com/railgrid/railgrid. Its docs/cli directory is
# generated there with `make docs-cli`.
RAILGRID_REPO ?= ../railgrid

.PHONY: help sync-cli-docs build serve check

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-16s %s\n", $$1, $$2}'

sync-cli-docs: ## Copy $(RAILGRID_REPO)/docs/cli into content/en/docs/reference/cli/commands and regenerate its sidebar
	@test -d "$(RAILGRID_REPO)/docs/cli" || { echo "$(RAILGRID_REPO)/docs/cli not found; set RAILGRID_REPO=/path/to/railgrid"; exit 1; }
	python3 scripts/sync-cli-docs.py --source "$(RAILGRID_REPO)/docs/cli"

build: ## Production build with link and contract checks
	npm run build:production

serve: ## Hugo dev server
	npm run serve

check: build ## Alias for build (postbuild runs the checks)
