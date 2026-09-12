# faros.sh site tasks. Day-to-day builds still go through npm scripts; this
# file exists for tasks that reach outside the repository.

# Local checkout of github.com/faroshq/faros. Its docs/cli directory is
# generated there with `make docs-cli`.
FAROS_REPO ?= ../faros

.PHONY: help sync-cli-docs build serve check

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-16s %s\n", $$1, $$2}'

sync-cli-docs: ## Copy $(FAROS_REPO)/docs/cli into content/en/docs/reference/cli/commands and regenerate its sidebar
	@test -d "$(FAROS_REPO)/docs/cli" || { echo "$(FAROS_REPO)/docs/cli not found; set FAROS_REPO=/path/to/faros"; exit 1; }
	python3 scripts/sync-cli-docs.py --source "$(FAROS_REPO)/docs/cli"

build: ## Production build with link and contract checks
	npm run build:production

serve: ## Hugo dev server
	npm run serve

check: build ## Alias for build (postbuild runs the checks)
