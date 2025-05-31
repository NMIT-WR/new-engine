# CLAUDE.md

This file provides guidance to Claude Code for the frontend-demo Next.js e-commerce app.

## Quick Start & Assumptions

**IMPORTANT: Always assume dev server is running on http://localhost:3000**
- Next.js 15 with App Router and static export
- Tailwind CSS v4 with custom design tokens
- Supabase for authentication

## Component Architecture - Atomic Design

**YOU MUST check libs/ui before creating new components!**

### Component Hierarchy:
1. **Atoms**: Button, Input, Badge, Icon
2. **Molecules**: SearchForm, ProductCard, Dialog, Combobox
3. **Organisms**: Header, ProductGrid, Footer
4. **Templates**: Page layouts
5. **Pages**: Specific instances with data

### Component Workflow:
```bash
# 1. Check what exists
bunx nx run ui:storybook

# 2. Search for component
grep -r "ComponentName" ../../libs/ui/src

# 3. Import from ui library
import { Button } from '@libs/ui/atoms/button'
import { Dialog } from '@libs/ui/molecules/dialog'
```

## Core Commands

```bash
# Development
pnpm dev                               # Start dev (port 3000)
pnpm build:static                      # Build for Netlify
bunx nx run ui:storybook               # View all UI components

# Testing
node scripts/test-login.js             # Test auth flow
node scripts/capture-ui-screenshots.js # Capture UI in all viewports

# Code Quality
bunx biome check --write .             # Format code (run from root)
```

## MCP-Enhanced Workflows

Use MCP servers for complex tasks:

### Visual Testing & Screenshots
```bash
"Use puppeteer to test the complete login flow"
"Capture screenshots of all pages in mobile/tablet/desktop"
"Test theme toggle persistence across page reloads"
```

### Database & Auth
```bash
"Use supabase MCP to check auth policies"
"Create user profiles table with RLS"
```

### Code Review
```bash
"Create PR for the theme implementation using github"
"Search for similar e-commerce implementations"
```

## Key Features

### Authentication (Supabase SSR)
- **Middleware**: `src/middleware.ts` - Protected routes handler
- **Client**: `src/lib/supabase.ts` - Supabase client setup
- **Protected routes**: `/account`, `/orders`, `/wishlist`
- **Auth routes**: `/auth/login`, `/auth/register`

### Theme System
- **Provider**: `next-themes` in `src/components/providers.tsx`
- **Hook**: `src/hooks/use-theme.ts` - Wrapper for theme access
- **Persistence**: localStorage with SSR safety
- **Classes**: Tailwind `dark:` prefix

### State Management
- **Cart**: `src/stores/cart-store.ts` - @tanstack/react-store
- **Auth**: `src/stores/auth-store.ts` - User state
- **Persistence**: localStorage with hydration safety

### Design System
```
src/tokens/
├── _semantic.css    # Color variables with light-dark()
├── _spacing.css     # Spacing scale
├── _typography.css  # Font system
└── components/      # Component-specific styles
    ├── atoms/
    ├── molecules/
    └── organisms/
```

## Common Tasks

### Adding New Features
1. Check ui library first: `bunx nx run ui:storybook`
2. Use existing components to build features
3. Test with puppeteer: `node scripts/test-*.js`
4. Run biome before committing

### Debugging Issues
- **Theme not working**: Check `next-themes` provider setup
- **Auth redirect loops**: Check middleware.ts config
- **Static export errors**: Ensure dynamic routes are handled

## Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## Do's and Don'ts

### DO:
✅ Use ui library components (DRY principle)
✅ Follow atomic design hierarchy
✅ Use design tokens for all styling
✅ Test with MCP puppeteer for complex flows
✅ Handle auth in middleware for SSR

### DON'T:
❌ Create duplicate components
❌ Hardcode colors or spacing
❌ Edit package.json manually (use pnpm add)
❌ Skip auth middleware for protected routes
❌ Forget mobile viewport testing

## Deployment

Static export for Netlify:
```bash
pnpm build:static  # Creates 'out' directory
```

**IMPORTANT**: All dynamic routes must work with static generation.

## Keeping This Updated

After each session, ask:
> "Based on our conversation and Claude Code best practices, is there anything that should be added to CLAUDE.md, or does anything make current instructions obsolete?"