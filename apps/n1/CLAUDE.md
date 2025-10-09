# CLAUDE.md - N1 E-commerce Application

## Project Overview

N1 is a Next.js 15 e-commerce frontend for Medusa.js v2 backend. Built with React 19, Tailwind v4, and React Query for intelligent caching and prefetching.

**Tech Stack:**
- Next.js 15 with Turbopack
- React 19 (no forwardRef needed)
- Tailwind v4 (token-based styling)
- @medusajs/js-sdk for backend communication
- @tanstack/react-query v5 for caching
- Component library from @libs/ui

**Key Files:**
- Services: `src/services/product-service.ts`
- Hooks: `src/hooks/use-*.ts`
- Prefetch: `src/components/prefetch-manager.tsx`
- Cache config: `src/lib/cache-config.ts`
- Query keys: `src/lib/query-keys.ts`

## Bash Commands

### Development
```bash
pnpm dev                    # Start dev server (assume already running on :3000)
pnpm build                  # Build for production
bunx tsc --noEmit          # TypeScript check
bunx biome check --write .  # Lint and format
```

### Package Management
```bash
pnpm add <package>          # Add dependency (never edit package.json)
pnpm add -D <package>       # Add dev dependency
```

### MCP Servers
```bash
# CSS-First (required for CSS solutions)
npx @depthark/css-first --port 3001

# Available tools:
# - suggest_css_solution
# - check_css_browser_support
# - get_css_property_details
```

## Code Style

### Imports
```typescript
// UI Library (Atomic Design)
import { Button } from '@libs/ui/atoms/button'
import { Dialog } from '@libs/ui/molecules/dialog'
import { ProductGrid } from '@libs/ui/organisms/product-grid'

// Hooks
import { useProducts } from '@/hooks/use-products'
import { useRegion } from '@/hooks/use-region'
import { usePrefetchProducts } from '@/hooks/use-prefetch-products'

// Services
import { getProducts, getProductByHandle } from '@/services/product-service'
```

### React 19 Patterns
```typescript
// ✅ CORRECT - Ref as prop (no forwardRef)
interface Props {
  ref?: RefObject<HTMLDivElement>
  onClick?: () => void  // No useCallback needed
}

function Component({ ref, onClick }: Props) {
  return <div ref={ref} onClick={onClick}>Content</div>
}

// ❌ WRONG - Outdated patterns
forwardRef<HTMLDivElement, Props>((props, ref) => ...)  // Don't use
useCallback(() => {}, [])  // Don't use
```

### Styling Conventions
```typescript
// ✅ CORRECT - Token-based classes
className="bg-button-bg-primary text-button-fg-primary p-button-padding"
className="bg-surface text-fg-primary gap-md"

// ❌ WRONG - Arbitrary values or hardcoded utilities
className="bg-[#ff0000] p-4 text-blue-500"  // Never use
className="bg-gray-100 border-red-400"      // Never use
```

### Naming Conventions
- Files: kebab-case (`product-grid.tsx`)
- Components: PascalCase (`ProductGrid`)
- Hooks: camelCase with `use` prefix (`useProducts`)
- Types: PascalCase (`UseProductsReturn`)

## Workflow

### Development Assumptions
**CRITICAL:** Always assume dev server is running on http://localhost:3000. Never ask to run it or check if it's running.

### Component Development
1. Use components from @libs/ui (see `../../libs/ui/CLAUDE.md`)
2. Follow atomic design: atoms → molecules → organisms
3. Token-based styling only (no arbitrary values)
4. React 19 patterns (ref as prop, no useCallback)

### Adding Features
1. Check if component exists in @libs/ui
2. If not, add to @libs/ui first (see UI library docs)
3. Import and use in n1 pages/components
4. Use cache/prefetch hooks for data fetching

### Before Committing
```bash
bunx tsc --noEmit          # Type check
bunx biome check --write . # Format and lint
pnpm build                 # Test build
```

## Cache & Prefetch System (CRITICAL)

### Core Concepts
**Two cache strategies:**
- `semiStatic`: 1h fresh, 24h persist (products, categories)
- `realtime`: 30s fresh, 5min persist (cart, user data)

**Prefetch behavior:**
- PrefetchManager prefetches 8 root categories on app load
- Context-aware delays: 200ms (homepage), 1500ms (category pages)
- Only prefetches once per region/session

### Query Keys Pattern
```typescript
// Always use this pattern for cache stability
queryKeys.products.list({
  category_id: ['cat_123'],
  region_id: 'reg_456',
  offset: 0,      // ✅ Use offset-based pagination
  limit: 12
})

// ❌ WRONG - Don't use page-based keys
{ page: 1 }  // Breaks cache continuity
```

### Hook Usage

#### useProducts - Fetch Products
```typescript
const {
  products,
  isLoading,
  hasNextPage,
  totalCount
} = useProducts({
  category_id: ['category_123'],
  page: 1,
  limit: 12
})
```

#### usePrefetchProducts - Prefetch Data
```typescript
const {
  prefetchCategoryProducts,  // Immediate prefetch
  delayedPrefetch,          // Scheduled prefetch
  cancelPrefetch            // Cancel scheduled
} = usePrefetchProducts()

// Immediate
prefetchCategoryProducts(['cat_123'])

// Delayed with ID for cancellation
const prefetchId = delayedPrefetch(['cat_456'], 800)
cancelPrefetch(prefetchId)
```

#### useRegion - Region Context
```typescript
const { regionId, countryCode } = useRegion()

// ⚠️ ALWAYS wait for regionId before querying
if (!regionId) return null
```

### Pagination Rules
```typescript
// ✅ CORRECT - Offset-based for cache stability
const queryParams = {
  offset: (page - 1) * limit,  // Convert page to offset
  limit: 12,
  category_id: ['cat_123']
}

// ❌ WRONG - Page-based breaks cache
{ page: 1, limit: 12 }  // Don't use directly in query
```

## Medusa Backend Integration

### SDK Configuration
```typescript
import { sdk } from '@/lib/medusa-client'

// Product list
const response = await sdk.store.product.list({
  region_id: 'reg_01',
  country_code: 'cz',
  category_id: ['cat_123'],
  offset: 0,
  limit: 12,
  fields: '*variants,*images'
})

// Single product by handle
const product = await sdk.store.product.list({
  handle: 'product-slug',
  region_id: 'reg_01',
  limit: 1,
  fields: '*variants,*images,*options,*categories'
})
```

### Region Awareness
All product queries MUST include:
- `region_id`: For pricing and availability
- `country_code`: For region-specific data

```typescript
// ✅ CORRECT
const { regionId, countryCode } = useRegion()
if (!regionId) return null  // Wait for region

const products = await getProducts({
  region_id: regionId,
  country_code: countryCode,
  category_id: ['cat_123']
})

// ❌ WRONG
const products = await getProducts({})  // Missing region context
```

## UI Library Integration

### Component Import Pattern
```typescript
// Atoms (basic elements)
import { Button } from '@libs/ui/atoms/button'
import { Input } from '@libs/ui/atoms/input'
import { Badge } from '@libs/ui/atoms/badge'

// Molecules (composite)
import { Dialog } from '@libs/ui/molecules/dialog'
import { Accordion } from '@libs/ui/molecules/accordion'
import { Combobox } from '@libs/ui/molecules/combobox'

// Organisms (complex sections)
import { ProductGrid } from '@libs/ui/organisms/product-grid'
```

### Token-Based Styling
```typescript
// Component styling with tv() from tailwind-variants
import { tv } from '@libs/ui/utils'

const styles = tv({
  base: 'bg-surface text-fg-primary',
  variants: {
    variant: {
      primary: 'bg-button-bg-primary text-button-fg-primary',
      secondary: 'bg-button-bg-secondary text-button-fg-secondary'
    }
  }
})
```

### Design Token Reference
- Token files: `@libs/ui/src/tokens/`
- Semantic tokens: `@libs/ui/src/tokens/_semantic.css`
- Component tokens: `@libs/ui/src/tokens/components/`
- Never use arbitrary values or hardcoded colors
- All styling must reference design tokens

### UI Library Documentation
- **Quick Reference**: `../../libs/ui/local/docs/llms-short.txt`
  - All 41 components with props & API
  - React 19 & Tailwind v4 patterns
  - Common pitfalls & violations
  - Token system overview

- **Detailed Docs**: `../../libs/ui/CLAUDE.md`
  - Complete development guide
  - Component creation workflow
  - Token contribution guidelines

## Project-Specific Rules

### DO
- ✅ Use offset-based pagination for cache stability
- ✅ Always check regionId before queries
- ✅ Import components from @libs/ui
- ✅ Use token-based classes for all styling
- ✅ Leverage React Query cache for performance
- ✅ Use tv() from tailwind-variants for component styling
- ✅ Follow React 19 patterns (ref as prop)

### DON'T
- ❌ Edit package.json manually (use pnpm add)
- ❌ Use page-based query keys (breaks cache)
- ❌ Query products without regionId
- ❌ Use arbitrary values in className
- ❌ Use Tailwind utility colors (bg-gray-100, text-blue-500)
- ❌ Create local components that exist in @libs/ui
- ❌ Use forwardRef or useCallback (React 19)
- ❌ Mention or create tailwind.config.js (Tailwind v4)

## MCP Tools Integration

### CSS-First MCP
Requires HTTP server: `npx @depthark/css-first --port 3001`

**Use for:**
- Modern CSS solutions (2021-2025 features)
- Browser compatibility checks
- CSS property details and examples

```typescript
// Example: Check browser support
suggest_css_solution({
  task_description: "Sticky header with dark mode support",
  preferred_approach: "modern"
})

check_css_browser_support({
  css_property: "light-dark()"
})
```

### Puppeteer MCP
**Use for:**
- Browser automation
- Visual regression testing
- Automated screenshots

```typescript
// Example: Screenshot product page
puppeteer_navigate({ url: "http://localhost:3000/produkt/example" })
puppeteer_screenshot({ name: "product-page" })
```

## File Structure

```
apps/n1/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── (dynamic)/    # Dynamic routes (products, categories)
│   │   └── (static)/     # Static routes (about, contact)
│   ├── components/       # App-specific components
│   ├── hooks/           # React Query hooks
│   ├── services/        # API services (Medusa SDK)
│   ├── lib/             # Utilities, config
│   └── tokens/          # App-specific design tokens
├── local/
│   └── docs/           # Documentation
└── CLAUDE.md           # This file
```

## Related Documentation

- **Root monorepo**: `../../CLAUDE.md` - Nx monorepo structure
- **UI Library**: `../../libs/ui/CLAUDE.md` - Component library docs
- **Cache System**: `local/docs/CACHE_PREFETCH_API.md` - Detailed cache docs

---

**Last Updated:** 2025-10-09
**Optimized for:** Claude Code CLI with Anthropic best practices
**Max Lines:** 300 (current: ~297)
