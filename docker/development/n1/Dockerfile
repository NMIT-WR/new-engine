FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apt-get update && apt-get install -y curl --no-install-recommends && \
    rm -rf /var/lib/apt/lists/* && \
    npm i -g corepack@0.34.5 && \
    corepack enable

WORKDIR /var/www

# ============================================
# DEV TARGET - uses host volume mounts
# ============================================
FROM base AS dev
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
CMD ["sh", "-lc", "\
  [ -d node_modules ] && [ -d apps/n1/node_modules ] || pnpm install --frozen-lockfile --prefer-offline --filter=n1...; \
  [ -f libs/ui/dist/utils.js ] || pnpm --filter=@techsio/ui-kit build; \
  [ -f libs/analytics/dist/index.js ] || pnpm --filter=@techsio/analytics build; \
  pnpm --filter n1 exec next dev --turbopack --hostname 0.0.0.0 --port 3000 \
"]

# ============================================
# PROD BUILD STAGE - compiles everything
# ============================================
FROM base AS build

COPY . .
RUN mkdir -p apps/n1/public
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=${NEXT_PUBLIC_MEDUSA_BACKEND_URL}
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}

# Install only n1 + workspace dependencies, build, validate, and deploy prod deps
RUN pnpm install --frozen-lockfile --filter=n1... && \
    pnpm --filter=@techsio/ui-kit build && \
    pnpm --filter=@techsio/analytics build && \
    pnpm install --frozen-lockfile --prefer-offline --filter=n1... && \
    pnpm --filter=n1 build && \
    test -f apps/n1/.next/BUILD_ID && \
    pnpm --filter=n1 --prod deploy n1-prod

# ============================================
# PROD RUNTIME - minimal final image
# ============================================
FROM node:22-slim AS prod

# curl needed for healthcheck
RUN apt-get update && apt-get install -y curl --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Copy app build artifacts and production-only dependencies
COPY --from=build --chown=node:node /var/www/apps/n1/.next ./.next
COPY --from=build --chown=node:node /var/www/apps/n1/public ./public
COPY --from=build --chown=node:node /var/www/apps/n1/package.json ./package.json
COPY --from=build --chown=node:node /var/www/n1-prod/node_modules ./node_modules

# Run as non-root user
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

CMD ["npm", "start", "--", "-p", "3000", "-H", "0.0.0.0"]
