# Pin to the Hugo version this site is built against (see hugo-extended in package.json)
FROM floryn90/hugo:0.140.0-ext-alpine

USER root
RUN git config --system --add safe.directory /src
USER hugo

# The base image puts a relative "." on NODE_PATH, which breaks Hugo's Node
# resolver hook in newer versions; keep only the absolute entries.
ENV NODE_PATH=/usr/local/lib/node_modules:/usr/local/node/lib/node_modules
