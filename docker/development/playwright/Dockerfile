FROM node:24-bookworm

ARG PLAYWRIGHT_VERSION=1.58.2

ENV PLAYWRIGHT_BROWSERS_PATH=0

WORKDIR /app

COPY --from=oven/bun:1.3.9 /usr/local/bin/bun /usr/local/bin/bun

RUN printf '{\n  "private": true\n}\n' > package.json \
  && bun add -d @playwright/test@${PLAYWRIGHT_VERSION} \
  && bun x playwright install --with-deps chromium webkit \
  && chown -R node:node /app

HEALTHCHECK NONE
USER node

ENTRYPOINT ["bun", "x", "playwright"]
