FROM node:25-bookworm

ARG PLAYWRIGHT_VERSION=1.58.1

WORKDIR /app

RUN npm init -y \
  && npm i -D @playwright/test@${PLAYWRIGHT_VERSION} http-server \
  && npx -y playwright@${PLAYWRIGHT_VERSION} install --with-deps chromium webkit

ENTRYPOINT ["npx", "playwright"]
