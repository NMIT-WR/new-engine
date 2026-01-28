# N1 App

## Critical Rules

- No barrel files or re-export-only `index.ts` files. Import from source files directly.
  - Why: Improves traceability, reduces circular dependency risk, and supports Nx module boundary enforcement.
  - Example: `import { formatDate } from '@/utils/date/format-date'`
- Always recheck everything before reporting done:
  - Lint: `pnpm exec biome check apps/n1`
  - Lint (workspace): `pnpm lint:nx`
  - Typecheck: `pnpm exec tsc -p apps/n1/tsconfig.json --noEmit`
  - Build: `pnpm -C apps/n1 build`
  - UI build: `pnpm -C libs/ui build`
  - UI storybook build: `pnpm -C libs/ui build:storybook`
