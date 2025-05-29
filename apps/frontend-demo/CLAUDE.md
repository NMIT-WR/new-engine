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
# Start development server
bunx nx run frontend-demo:dev

# Build the application
bunx nx run frontend-demo:build

# Run type checking
bunx nx run frontend-demo:typecheck
```

### Code Standards
- Use TypeScript for all new files
- Follow functional component patterns with hooks
- Implement proper error boundaries
- Ensure all interactive elements are keyboard accessible

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

### Common Tasks Checklist
- [ ] Component implementation uses UI library
- [ ] Check for existing similar components before creating new ones
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] Accessibility checked (ARIA labels, keyboard nav)
- [ ] TypeScript types properly defined
- [ ] Design tokens used for styling
- [ ] Performance optimizations applied
- [ ] Unused imports and code removed
- [ ] File structure follows modular pattern