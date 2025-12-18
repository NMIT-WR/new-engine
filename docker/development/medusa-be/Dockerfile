FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apt-get update && apt-get install -y curl --no-install-recommends && \
    rm -rf /var/lib/apt/lists/* && \
    npm i -g corepack@latest && \
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

# Build args - medusa build validates these at build time
ARG JWT_SECRET
ARG COOKIE_SECRET
ARG FEATURE_PPL_ENABLED=0
RUN NODE_ENV=production JWT_SECRET=${JWT_SECRET} COOKIE_SECRET=${COOKIE_SECRET} FEATURE_PPL_ENABLED=${FEATURE_PPL_ENABLED} pnpm nx run medusa-be:build --skip-nx-cache

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

# Copy only server (not client/types) and prod dependencies
COPY --from=build /var/www/apps/medusa-be/.medusa/server ./
COPY --from=build /var/www/medusa-be-prod/node_modules ./node_modules

# Copy seed data files (for seeding scripts)
COPY --from=build /var/www/apps/medusa-be/src/scripts/seed-files ./src/scripts/seed-files

CMD ["npm", "start"]
