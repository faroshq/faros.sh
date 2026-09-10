#!/usr/bin/env bash
# Re-encode marketing recordings from ./videos (gitignored drop folder) into
# web-sized MP4s under static/videos, plus JPEG posters under static/images/workflows.
# Usage: scripts/encode-videos.sh
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p static/videos static/images/workflows
encode() {
  local src=$1 slug=$2
  ffmpeg -v error -y -i "$src" -an \
    -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart \
    "static/videos/$slug.mp4"
  ffmpeg -v error -y -ss 1 -i "$src" -frames:v 1 -vf scale=1280:-2 -q:v 4 \
    "static/images/workflows/$slug.jpg"
  echo "$slug: $(du -h "static/videos/$slug.mp4" | cut -f1) video, $(du -h "static/images/workflows/$slug.jpg" | cut -f1) poster"
}
encode videos/app-studio-marketing.mp4 build
encode videos/agents-marketing-v2.mp4 agent
encode videos/faros-mcp-marketing.mp4 launch
