# CLAUDE.md - Frontend Demo App

This file provides specific guidance for the frontend-demo application within the monorepo.

## App Overview

This is a Next.js 15+ demo application showcasing the UI component library from `libs/ui`. It serves as a reference implementation and component showcase.

## Development Guidelines

### Component Usage
- Always import components from `@libs/ui` package
- Follow the atomic design pattern: atoms → molecules → organisms
- Use the existing token system for styling consistency

### File Structure
```
src/
├── app/              # Next.js app router pages
├── components/       # App-specific components
├── data/            # Mock data and constants
└── tokens/          # Design tokens (CSS custom properties)
```

### Styling Approach
- Use Tailwind CSS utility classes as primary styling method
- Design tokens are defined in `src/tokens/` directory
- Component-specific styles use CSS modules when needed
- Follow mobile-first responsive design

### Development Commands
```bash
# Run commands from the frontend-demo directory
cd apps/frontend-demo

# Start development server
pnpm dev

# Build the application  
pnpm build

# Run type checking
npx tsc --noEmit

# Capture screenshots of all pages
node scripts/auto-screenshot.js

# Watch for changes and auto-capture screenshots
./scripts/watch-and-screenshot.sh
```

### Important Development Notes

**NEVER ask to run `pnpm dev` or check if the dev server is running!**
- Always assume the development server is already running on http://localhost:3000
- This saves time and avoids unnecessary back-and-forth communication
- If you need to interact with the running application, use MCP tools

**Use MCP Tools for Browser Interactions:**
- For testing UI interactions, taking screenshots, or analyzing the running app, use the **puppeteer-mcp** server
- This is much more efficient than asking the user to manually test things
- Example: Testing filters, capturing UI states, verifying component behavior

### Netlify Deployment

```bash
# Deploy to Netlify (production)
netlify deploy --prod

# Deploy draft for testing
netlify deploy
```

**Important Deployment Notes:**
- Build must complete successfully without errors
- After deployment, **always verify** the site works correctly
- Common issues to check:
  - "Page not found" errors - usually means incorrect build configuration
  - Missing assets - check that `output: 'export'` is set in `next.config.js`
  - Routing issues - ensure `trailingSlash: true` is configured
- Test all pages including dynamic routes (e.g., `/products/[handle]`)
- Verify both draft and production deployments

### Code Standards
- Use TypeScript for all new files
- Follow functional component patterns with hooks
- **React 19**: We use React 19 - avoid unnecessary useCallback, useMemo, and useEffect as React 19 handles optimizations automatically
- Implement proper error boundaries
- Ensure all interactive elements are keyboard accessible
- **After every file modification, check TypeScript errors** - run `npx tsc --noEmit` and fix any issues
- **Before using any component, check its props interface** - read the component file to understand required/optional props and their types
- **After implementing UI changes, capture screenshots** - run `node scripts/auto-screenshot.js` to document current visual state

### Testing Guidelines
- Write integration tests for user flows
- Use React Testing Library for component tests
- Test responsive behavior at key breakpoints
- Verify accessibility with automated tools

### Performance Considerations
- Implement lazy loading for route components
- Optimize images using Next.js Image component
- Use dynamic imports for heavy dependencies
- Monitor bundle size with webpack-bundle-analyzer

### Import Examples
```typescript
// Correct - using the UI library
import { Button } from '@libs/ui/atoms/button'
import { Dialog } from '@libs/ui/molecules/dialog'
import { ProductCard } from '@libs/ui/molecules/product-card'

// Incorrect - don't create duplicate components
import { Button } from '@/components/ui/button' // ❌
```

## Available UI Components

### Atoms (Basic Elements)
- **badge**: Labels with variants (success, warning, danger)
- **button**: Multiple variants, themes, sizes, icon support
- **error-text**: Error messages with optional icon
- **input**: Form input with validation states
- **label**: Form labels with required indicators
- **link/link-button**: Navigation components
- **rating**: Interactive star rating
- **tabs**: Tab navigation
- **textarea**: Multi-line text input
- **tooltip**: Hover tooltips

### Molecules (Composite Components)
- **product-card**: E-commerce card (image, price, badges, add-to-cart)
- **form-input**: Complete input with label, validation, helper text
- **form-checkbox**: Checkbox with label and validation
- **search-form**: Search input with button
- **carousel**: Image/content carousel with controls
- **dialog**: Modal dialogs
- **pagination**: Page navigation
- **select**: Dropdown selection
- **range-slider**: Value range selection
- **numeric-input**: Number input with +/- controls
- **accordion**: Expandable content sections
- **breadcrumb**: Navigation trail
- **combobox**: Autocomplete dropdown
- **menu**: Dropdown menu
- **steps**: Multi-step indicator
- **switch**: Toggle switch
- **toast**: Notification messages
- **tree-view**: Hierarchical display

## Backend Data Structure (Medusa)

### Core Models
- **Products**: title, description, handle, status, images, variants
- **Product Variants**: SKU, title, options (size/color), prices
- **Collections**: title, handle, product associations
- **Categories**: name, is_active, hierarchy
- **Regions**: name, currency_code (EUR, USD), countries
- **Customers**: JWT authentication built-in
- **Cart/Orders**: Built-in Medusa modules

### Custom Models (libs/data-layer)
- Extended product/category/collection models
- Custom fields: slug, imageUrl

### API Structure
- REST endpoints: `/api/store/*`
- File-based routing in `apps/medusa-be/src/api/`

### Seed Data Available
- Products: T-Shirt, Sweatshirt, Sweatpants, Shorts
- Categories: Shirts, Sweatshirts, Pants, Merch
- Regions: Europe (EUR), US (USD)

### Response Instructions for Claude
- When asked about UI components, always check `libs/ui` first
- Prefer composition over creating new components
- Follow existing patterns in the codebase
- Always use English for code and comments
- Respond to user in Czech when they write in Czech
- Be concise but thorough in explanations
- Always verify imports are from the correct package
- Prioritize modularization over monolithic files
- Never duplicate existing components
- Clean up unused code and components
- Analyze for reusability opportunities
- Maintain consistent design patterns
- **When implementing UI changes, always capture screenshots** using `node scripts/auto-screenshot.js`
- **Screenshots are automatically saved** to `screenshots/auto/` directory for visual documentation

### Project Requirements
- This is a proof of concept demo for client presentations
- Focus on modern UX/UI with good performance and accessibility
- Maintain excellent developer experience
- Required pages: Product listing, Product detail, Search, Cart, Login, Register

### Development Principles
1. **Reusability First**: Always check if component exists in @libs/ui
2. **Modular Architecture**: Split large files into smaller, focused modules
3. **DRY Principle**: Never duplicate code or components
4. **Clean Codebase**: Remove unused components and dead code
5. **Consistent Design**: Maintain unified design language across all pages
6. **Conventional Commits**: Use conventional commit format for all commits

### Atomic Design Architecture
This project follows the **Atomic Design** methodology for organizing UI components:

- **Atoms**: Basic building blocks (buttons, inputs, labels, badges)
- **Molecules**: Simple combinations of atoms (form fields, search bars, cards)
- **Organisms**: Complex UI sections (headers, footers, product grids)
- **Templates**: Page layouts without real content
- **Pages**: Templates with real content

Learn more: https://atomicdesign.bradfrost.com/chapter-2/

### Component Development Pattern
When creating reusable components in frontend-demo:

1. **Component Structure (.tsx)**:
   ```typescript
   import { tv } from 'ui/src/utils'
   
   // Define variants using only slots (no variants unless absolutely necessary)
   const componentVariants = tv({
     slots: {
       root: 'bg-component-bg text-component-text',
       container: 'max-w-component-max-w px-component-container-x',
       // Use semantic CSS variables, not Tailwind utilities directly
     },
   })
   
   // Extract data to constants
   const componentData = [...]
   
   // Use TypeScript interfaces
   interface ComponentProps {...}
   
   export function Component(props: ComponentProps) {
     const styles = componentVariants()
     return (
       <div className={styles.root()}>
         {/* Use styles.slotName() for all elements */}
       </div>
     )
   }
   ```

2. **CSS Token File (_component.css)**:
   ```css
   @import "../../_semantic.css";
   
   @theme static {
     /* Group by type: COLORS, SPACING, TYPOGRAPHY, LAYOUT, EFFECTS */
     
     /* === COMPONENT COLORS === */
     --color-component-bg: var(--color-base);
     --color-component-text: var(--color-fg-primary);
     
     /* === COMPONENT SPACING === */
     /* Use semantic spacing: 3xs, 2xs, xs, sm, md, lg, xl, 2xl, 3xl */
     --spacing-component-container-x: var(--spacing-sm);
     --spacing-component-gap: var(--spacing-2xs);
     
     /* === COMPONENT TYPOGRAPHY === */
     /* Text size variables must use correct Tailwind prefixes:
        font-, text-, leading-, tracking-, etc.
        Always end text sizes with -size, -sm, -md, -lg, etc. */
     --text-component-title-size: var(--text-3xl);
     --font-component-title-weight: var(--font-bold);
     
     /* === COMPONENT LAYOUT === */
     /* Use --spacing- prefix for max-width too */
     --spacing-component-max-w: 80rem;
   }
   ```

3. **CSS Token Guidelines**:
   **ALLOWED token prefixes:**
   - `--color-`: All color values
   - `--text-`: Font sizes (must map to Tailwind text sizes)
   - `--font-weight-`: Font weights (100-900 or semantic)
   - `--border-`: Border width, style, color
   - `--opacity-`: Transparency values (0-100%)
   - `--spacing-`: Padding, margin, gap, AND width/height values that need max/min variants
   - `--width-`: Width values (only when you don't need max/min variants)
   - `--height-`: Height values (only when you don't need max/min variants)
   - `--gap-`: Flex/grid gaps
   - `--padding-`: Padding values
   - `--margin-`: Margin values
   - `--radius-`: Border radius
   - `--shadow-`: Box shadows

   **IMPORTANT**: Use `--spacing-` prefix for any width/height values that need max-w/min-w/max-h/min-h utilities!

   **FORBIDDEN patterns:**
   - ❌ `--grid-cols-product-grid-base` (too specific)
   - ❌ `--layout-*` (use specific properties)
   - ❌ `--component-specific-anything` (be generic)

4. **File Organization**:
   - **atoms/**: Basic UI elements from @libs/ui only
   - **molecules/**: Composite components (navigation, etc.)
   - **organisms/**: Large sections (header, footer)
   - Always add CSS import to `components.css`

5. **CSS Token Naming Convention**:
   
   **Pattern**: `--[type]-[component]-[element]-[modifier]-[purpose]-[state]`
   **Slots**:  `Descriptive names (root, container, list, item, etc.)`
   
   **Rules**:
   - **Type** (required): `color`, `spacing`, `text`, `font`, `border`, `radius`, `shadow`, `opacity`
   - **Component** (optional): Use abbreviations if readable (e.g., `btn`, `pc`, `nav`)
   - **Element** (optional): Specific part like `title`, `container`, `button`
   - **Modifier** (optional): Size (`sm`, `md`, `lg`) or variant (`primary`, `secondary`)
   - **Purpose** (for colors): `fg` (text/icons), `bg` (background), `border`, `ring`, `shadow`
   - **State** (optional): `hover`, `active`, `disabled`, `focus`
   
   **Size naming**:
   - Single size: use `-size` suffix (e.g., `--text-hero-title-size`)
   - Multiple sizes: use size directly (e.g., `--text-hero-title-sm`, NOT `--text-hero-title-size-sm`)
   
   **Common abbreviations** (use if readable):
   - `btn` = button
   - `pc` = product-card
   - `nav` = navigation
   - `acc` = accordion
   - `cb` = checkbox
   
   **Examples**:
   ```css
   /* Colors with purpose */
   --color-btn-primary          /* default = background */
   --color-btn-primary-fg       /* foreground (text/icons) */
   --color-btn-primary-hover    /* hover state background */
   --color-pc-stock-fg         /* product card stock text */
   
   /* Spacing */
   --spacing-pc-padding
   --spacing-btn-sm
   
   /* Typography */
   --text-hero-title-size      /* single size */
   --text-pc-name-sm          /* multiple sizes */
   
   /* Responsive */
   --text-hero-title-md       /* medium breakpoint */
   --spacing-container-x-lg   /* large breakpoint */
   ```

6. **Example Implementation** (Footer):
   ```typescript
   // footer.tsx
   const footerVariants = tv({
     slots: {
       root: 'bg-footer-bg text-footer-text',
       container: 'mx-auto max-w-footer-max-w px-footer-container-x',
       // ... more semantic slots
     },
   })
   ```
   ```css
   /* _footer.css */
   --color-footer-bg: var(--color-base-reverse);
   --spacing-footer-max-w: 80rem;
   --spacing-footer-container-x: var(--spacing-md);
   ```

### Page-Specific Component Mapping

**Product Listing Page**:
- `product-card` - Product grid display
- `pagination` - Navigate pages
- `select` - Sort options
- `range-slider` - Price filtering
- `checkbox` - Filter options
- `search-form` - Product search

**Product Detail Page**:
- `carousel` - Product images
- `rating` - Product ratings
- `button` - Add to cart
- `tabs` - Product info sections
- `accordion` - Additional details
- `badge` - Stock/sale status
- `numeric-input` - Quantity selector

**Search Page**:
- `search-form` - Main search
- `checkbox` - Filters
- `select` - Sort results
- `pagination` - Results navigation
- `product-card` - Results display

**Cart Page**:
- `numeric-input` - Quantity
- `button` - Update/remove
- `badge` - Item count
- `dialog` - Confirmations

**Login/Register Pages**:
- `form-input` - Email/password
- `form-checkbox` - Remember/terms
- `button` - Submit
- `link` - Page switching
- `error-text` - Validation
- `toast` - Success/error messages

### TypeScript & Component Usage Guidelines

1. **Before Using Any Component**:
   ```typescript
   // 1. First, read the component file to check its interface
   // 2. Look for required vs optional props
   // 3. Check prop types (string, number, array, etc.)
   // 4. Check for specific prop formats (e.g., Select expects 'options' not 'items')
   ```

2. **After Every Code Change**:
   ```bash
   # Run TypeScript check
   npx tsc --noEmit
   ```

3. **Common Component Props Patterns**:
   - **Select**: uses `options` prop with `{value: string, label: string}[]`
   - **ProductCard**: requires `name` (not `title`), `imageUrl`, `price`, `stockStatus`
   - **Carousel**: uses `items` prop with `{src: string, alt: string}[]`
   - **Accordion**: items need `value`, `trigger`, and `content` properties
   - **Rating**: uses `readOnly` (not `readonly`)
   - **NumericInput**: uses `onChange` (not `onValueChange`)

### Component Best Practices

1. **DO's**:
   - ✅ Use semantic CSS variables from tokens
   - ✅ Extract hardcoded values to CSS variables
   - ✅ Use tv() with slots only (avoid variants)
   - ✅ Group CSS variables by type (COLORS, SPACING, etc.)
   - ✅ Use spacing tokens for ALL spacing (including max-width)
   - ✅ Extract data arrays and interfaces
   - ✅ Use `base-reverse` for dark sections
   - ✅ Follow Tailwind 4 theme documentation: https://tailwindcss.com/docs/theme
   - ✅ Ensure sufficient contrast for both light and dark modes (WCAG AA minimum)
   - ✅ Always use white text on images/photos for consistency and readability

2. **DON'Ts**:
   - ❌ Don't use Tailwind utilities directly (e.g., `text-gray-500`)
   - ❌ Don't create variants unless absolutely necessary
   - ❌ Don't use numeric spacing (e.g., `spacing-4`), use semantic (e.g., `spacing-sm`)
   - ❌ Don't mix @libs/ui components with custom UI components
   - ❌ Don't forget to import CSS in components.css

3. **Spacing Reference**:
   ```
   3xs: 0.25rem (4px)
   2xs: 0.5rem (8px)
   xs: 0.75rem (12px)
   sm: 1rem (16px)
   md: 1.5rem (24px)
   lg: 2rem (32px)
   xl: 3rem (48px)
   2xl: 4rem (64px)
   3xl: 6rem (96px)
   ```

### Common Tasks Checklist
- [ ] Component implementation uses UI library
- [ ] Check for existing similar components before creating new ones
- [ ] **Read component's props interface before using it**
- [ ] CSS token file created with semantic variables
- [ ] All spacing uses semantic tokens (3xs-3xl)
- [ ] CSS file imported in components.css
- [ ] TypeScript interfaces defined for props and data
- [ ] Data extracted to constants
- [ ] tv() used with slots only
- [ ] **TypeScript errors checked and fixed after modifications**
- [ ] **Screenshots captured after UI implementation** - `node scripts/auto-screenshot.js`
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] Accessibility checked (ARIA labels, keyboard nav)
- [ ] Unused imports and code removed