# CLAUDE.md - Frontend Demo App (Proposed Version)

<!-- ZMĚNA: Zkráceno z 481 řádků na ~250 řádků -->
<!-- ZMĚNA: Lepší struktura - nejdřív praktické věci, pak detaily -->

This file provides specific guidance for the frontend-demo application.

## Quick Start

<!-- ZMĚNA: Přidána nová sekce pro rychlý začátek -->

### Development Server
**ALWAYS assume the dev server is running on http://localhost:3000**
- Never ask to run `pnpm dev` or check server status
- Use MCP tools (puppeteer) for browser interactions

### Key Commands
```bash
cd apps/frontend-demo
pnpm dev                          # Start dev server
pnpm build                        # Build app
npx tsc --noEmit                 # Check TypeScript
node scripts/auto-screenshot.js   # Capture screenshots
```

### After Every Change
1. Run `npx tsc --noEmit` to check TypeScript errors
2. Run `node scripts/auto-screenshot.js` to document UI state
3. Check component props before using (read the source file)

## Project Structure

<!-- ZMĚNA: Zjednodušená struktura, přidána utils/ složka -->

```
src/
├── app/          # Next.js 15 app router
├── components/   # App-specific components (organisms)
├── data/         # Mock data and constants  
├── tokens/       # Design tokens (CSS custom properties)
├── types/        # TypeScript interfaces
└── utils/        # Helper functions (filters, formatters)

screenshots/
├── auto/         # Automated screenshots from scripts
└── *.png         # Manual screenshots
```

## Component Architecture

<!-- ZMĚNA: Sloučeno z několika sekcí, zkráceno -->

### Atomic Design Pattern
- **Atoms**: Basic elements from `@libs/ui` only
- **Molecules**: Composite components from `@libs/ui`
- **Organisms**: Page sections in `src/components/`
- **Pages**: Full pages in `src/app/`

### Import Rules
```typescript
// ✅ CORRECT - use UI library
import { Button } from '@libs/ui/atoms/button'
import { ProductCard } from '@libs/ui/molecules/product-card'

// ❌ WRONG - don't duplicate
import { Button } from '@/components/ui/button'
```

## Development Guidelines

<!-- ZMĚNA: Sloučeno Code Standards + Best Practices -->

### TypeScript & React
- Use React 19 - no unnecessary `useCallback`, `useMemo`, `useEffect`
- Functional components with hooks only
- Check component props interface before use
- Define interfaces for all props and data

### Styling Approach
- Tailwind CSS utilities as primary method
- Design tokens in `src/tokens/`
- Mobile-first responsive design
- Use semantic CSS variables, not direct Tailwind

## Component Development Pattern

<!-- ZMĚNA: Drasticky zkráceno ze 150 řádků na ~40 -->

### 1. Component Structure
```typescript
import { tv } from 'ui/src/utils'

const componentVariants = tv({
  slots: {
    root: 'bg-component-bg text-component-text',
    container: 'max-w-component-max-w px-component-padding',
  },
})

export function Component(props: ComponentProps) {
  const styles = componentVariants()
  return <div className={styles.root()}>...</div>
}
```

### 2. CSS Tokens
```css
@import "../../_semantic.css";

@theme static {
  /* === COLORS === */
  --color-component-bg: var(--color-base);
  --color-component-text: var(--color-fg-primary);
  
  /* === SPACING === */
  --spacing-component-padding: var(--spacing-md);
  --spacing-component-max-w: 80rem;
}
```

### 3. Token Naming
Pattern: `--[type]-[component]-[element]-[purpose]`
- Types: `color`, `spacing`, `text`, `font`, `border`, `radius`
- Use semantic spacing: `3xs`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`

<!-- ZMĚNA: Odstraněno 100+ řádků detailních pravidel -->

## Available Components

<!-- ZMĚNA: Zkrácený seznam, odstraněny duplicity -->

### From @libs/ui Library
**Atoms**: badge, button, input, rating, tabs, tooltip
**Molecules**: product-card, form-input, carousel, dialog, select, pagination, accordion

### Page Component Mapping
- **Products**: product-card, filters, pagination, search
- **Product Detail**: carousel, rating, numeric-input, tabs
- **Cart**: numeric-input, dialog, button
- **Auth**: form-input, form-checkbox, toast

## Backend Integration

<!-- ZMĚNA: Zkráceno, pouze klíčové informace -->

### Medusa Models
- Products, Variants, Collections, Categories
- Regions (EUR, USD), Customers, Cart/Orders
- Custom fields via `libs/data-layer`

### API Structure
- REST endpoints: `/api/store/*`
- Seed data: T-Shirt, Sweatshirt, Sweatpants, Shorts

## Deployment

<!-- ZMĚNA: Přesunuto z prostředku na konec -->

### Netlify Commands
```bash
netlify deploy       # Draft deploy
netlify deploy --prod # Production
```

### Post-Deploy Checklist
- Verify all pages load correctly
- Test dynamic routes (`/products/[handle]`)
- Check `output: 'export'` in next.config.js
- Ensure `trailingSlash: true` is set

## Common Tasks Checklist

<!-- ZMĚNA: Zkráceno a seskupeno -->

**Before coding:**
- [ ] Check if component exists in @libs/ui
- [ ] Read component's props interface

**During coding:**
- [ ] Use semantic CSS variables
- [ ] Extract data to constants
- [ ] Follow Atomic Design pattern

**After coding:**
- [ ] Run `npx tsc --noEmit`
- [ ] Run `node scripts/auto-screenshot.js`
- [ ] Remove unused imports
- [ ] Test responsive design

---

<!-- POZNÁMKY O ZMĚNÁCH:

ODSTRANĚNO:
- Duplicitní import examples (bylo 2x)
- 150+ řádků CSS token guidelines (příliš detailní)
- Redundantní zmínky o screenshotech
- MCP workflows (málo relevantní)
- Response Instructions for Claude (patří jinam)
- Development Principles (duplicita s guidelines)
- Příliš detailní Component Best Practices
- Zbytečné spacing reference tabulky

PŘIDÁNO:
- Quick Start sekce na začátku
- utils/ složka do struktury
- screenshots/auto/ složka
- Post-deploy checklist

PŘESUNUTO:
- Deployment na konec (logičtější flow)
- Common tasks na úplný konec
- TypeScript guidelines sloučeno s React

VYLEPŠENO:
- Konzistentní použití příkazů
- Jasnější struktura (od obecného ke konkrétnímu)
- Méně redundance
- Praktičtější organizace

-->