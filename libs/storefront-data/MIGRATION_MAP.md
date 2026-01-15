# Storefront-data migration map (core only)

This map documents the planned file moves for the shared core. No files are
moved yet; this is a target map for the first extraction pass.

## Core extraction targets
- apps/n1/src/lib/cache-config.ts -> libs/storefront-data/src/shared/cache-config.ts
- apps/frontend-demo/src/lib/cache-config.ts -> libs/storefront-data/src/shared/cache-config.ts
- apps/n1/src/lib/query-keys.ts -> libs/storefront-data/src/shared/query-keys.ts
- apps/frontend-demo/src/lib/query-keys.ts -> libs/storefront-data/src/shared/query-keys.ts
- apps/n1/src/lib/medusa-client.ts -> libs/storefront-data/src/shared/medusa-client.ts
- apps/frontend-demo/src/lib/medusa-client.ts -> libs/storefront-data/src/shared/medusa-client.ts
- apps/frontend-demo/src/lib/query-client.ts -> libs/storefront-data/src/shared/query-client.ts
- apps/n1/src/components/provider.tsx -> libs/storefront-data/src/client/provider.tsx
- apps/frontend-demo/src/components/providers.tsx -> libs/storefront-data/src/client/provider.tsx

## Merge notes
- Query keys: keep namespace configurable (n1 uses "n1", frontend-demo uses "medusa").
- Cache config: start with 3 core strategies and allow per-app overrides.
- Medusa client: allow custom storage; disable auth on server by default.
- Query client/provider: server gets a fresh client per request; browser uses a singleton.

## Later (not in scope for core)
- apps/n1/src/hooks/use-products.ts -> libs/storefront-data/src/hooks/use-products.ts
- apps/n1/src/hooks/use-product.ts -> libs/storefront-data/src/hooks/use-product.ts
- apps/n1/src/hooks/use-prefetch-*.ts -> libs/storefront-data/src/hooks/prefetch/*
- apps/frontend-demo/src/hooks/use-products.ts -> libs/storefront-data/src/hooks/use-products.ts
- apps/frontend-demo/src/hooks/use-prefetch-*.ts -> libs/storefront-data/src/hooks/prefetch/*
