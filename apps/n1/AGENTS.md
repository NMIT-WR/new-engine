# N1 App

## Critical Rules

- No barrel files or re-export-only `index.ts` files. Import from source files directly.
  - Why: Improves traceability, reduces circular dependency risk, and supports Nx module boundary enforcement.
  - Example: `import { formatDate } from '@/utils/date/format-date'`
