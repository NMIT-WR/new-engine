FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apt-get update && apt-get install -y curl --no-install-recommends && \
    rm -rf /var/lib/apt/lists/* && \
    npm i -g corepack@0.34.5 && \
    corepack enable && \
    corepack install -g pnpm@10.26.0

WORKDIR /var/www

# ============================================
# DEV TARGET - uses host volume mounts
# ============================================
FROM base AS dev
ENV NODE_ENV=development
ENV DATABASE_TYPE=postgres
CMD ["pnpm", "--filter", "medusa-be", "dev"]
#CMD ["tail", "-f", "/dev/null"]

# ============================================
# PROD BUILD STAGE - compiles everything
# ============================================
FROM base AS build

COPY . .

# Remove all apps/libs not needed by medusa-be, clean caches
RUN find apps -maxdepth 1 -mindepth 1 -type d ! -name 'medusa-be' -exec rm -rf {} + && \
    rm -rf libs && \
    rm -rf node_modules apps/medusa-be/node_modules apps/medusa-be/.medusa

RUN pnpm install --filter=medusa-be...

# Inline dummy secrets satisfy Medusa's build-time validation without embedding real secrets in image layers.
# Real secrets must be provided at runtime via env vars, or Medusa will crash (by design).
ARG FEATURE_PPL_ENABLED=0
RUN NODE_ENV=production \
    JWT_SECRET=build-placeholder \
    COOKIE_SECRET=build-placeholder \
    FEATURE_PPL_ENABLED=${FEATURE_PPL_ENABLED} \
    pnpm nx run medusa-be:build --skip-nx-cache 2>&1 | tee /tmp/build.log; \
    if [ ! -f apps/medusa-be/.medusa/server/medusa-config.js ]; then \
      echo ""; \
      echo "========== BUILD FAILED =========="; \
      echo "Expected output not found: .medusa/server/medusa-config.js"; \
      echo "=== Last 50 lines of build output ==="; \
      tail -50 /tmp/build.log; \
      exit 1; \
    fi

# Get production-only dependencies and clean up
RUN pnpm --filter=medusa-be --prod deploy medusa-be-prod && \
    rm -rf node_modules apps/medusa-be/node_modules

# ============================================
# PROD RUNTIME - minimal final image
# ============================================
FROM node:22-slim AS prod

# curl needed for healthcheck
RUN apt-get update && apt-get install -y curl --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV DATABASE_TYPE=postgres

WORKDIR /app

# Copy files with node user ownership (UID 1000, comes with node image)
COPY --from=build --chown=node:node /var/www/apps/medusa-be/.medusa/server ./
COPY --from=build --chown=node:node /var/www/medusa-be-prod/node_modules ./node_modules
COPY --from=build --chown=node:node /var/www/apps/medusa-be/src/scripts/seed-files ./src/scripts/seed-files

# Run as non-root user
USER node

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:9000/health || exit 1

CMD ["npm", "start"]
