#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE_NAME="${PLAYWRIGHT_DOCKER_IMAGE:-new-engine-ui-playwright}"
PLATFORM="${DOCKER_PLATFORM:-linux/amd64}"
BASE_URL="${TEST_BASE_URL:-http://host.docker.internal:6006}"

if [[ ! -f "${ROOT_DIR}/storybook-static/iframe.html" ]]; then
  echo "storybook-static not found, building Storybook..."
  pnpm -C "${ROOT_DIR}" build:storybook
fi

if ! docker image inspect "${IMAGE_NAME}" >/dev/null 2>&1; then
  docker build -t "${IMAGE_NAME}" -f "${ROOT_DIR}/Dockerfile.playwright" "${ROOT_DIR}"
fi

docker run --rm -it \
  --platform="${PLATFORM}" \
  --add-host=host.docker.internal:host-gateway \
  -e TEST_BASE_URL="${BASE_URL}" \
  -e CI=true \
  -v "${ROOT_DIR}/storybook-static:/app/storybook-static" \
  -v "${ROOT_DIR}/tests:/app/tests" \
  -v "${ROOT_DIR}/playwright.config.ts:/app/playwright.config.ts" \
  "${IMAGE_NAME}" test "$@"
