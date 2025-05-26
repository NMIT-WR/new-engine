# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Nx monorepo for an e-commerce platform built with Medusa.js. The project uses pnpm for package management and Nx for orchestrating builds and development workflows.

## Architecture

### Monorepo Structure
- **apps/**: Application projects
  - `medusa-be`: Medusa.js v2 backend
  - `medusa-demo`: Next.js demo frontend (reference implementation)
  - `medusa-fe`: Next.js frontend (reference implementation)
- **libs/**: Shared libraries
  - `ui`: Component library built with Zag.js and Tailwind CSS

### Key Technologies
- **Monorepo**: Nx
- **Frontend**: Modern.js, React 19, Tailwind CSS (we prefer Modern.js from Bytedance, but sometimes Next.js 15+ can be used)
- **Backend**: Medusa.js v2
- **Component Library**: Zag.js for React UI components using Tailwind
- **Build Tools**: RSLib for library builds
- **Testing**: Vitest
- **Code Quality**: Biome for linting and formatting

## Development Commands

### Package Management
Always use CLI commands to install packages, never edit package.json directly:
```bash
pnpm add <package>           # Add dependency
pnpm add -D <package>        # Add dev dependency
pnpm add -w <package>        # Add to workspace root
```

### Running Development Servers
```bash
bunx nx run medusa-be:dev      # Start backend dev server
bunx nx run medusa-fe:dev      # Start frontend dev server
bunx nx run ui:storybook       # Start Storybook for UI library
```

### Building Projects
```bash
bunx nx run medusa-be:build    # Build backend
bunx nx run medusa-fe:build    # Build frontend
bunx nx run ui:build          # Build UI library
```

### Testing
We don't have tests much (yet), but it is planned.
```bash
bunx nx run medusa-be:test     # Run backend tests with Vitest
bunx nx run ui:test           # Run UI library tests with Vitest
```

### Code Quality
Always run Biome globally over the entire repository:
```bash
bunx biome check --write .     # Lint and format entire repository
```

### Nx Utilities
```bash
bunx nx graph                  # View project dependency graph
bunx nx affected:build         # Build only affected projects
bunx nx affected:test          # Test only affected projects
```

## UI Library (`libs/ui`)

The UI library uses Zag.js for React components with custom styling with Tailwind:
- **Atoms**: Basic components (button, input, badge, etc.)
- **Molecules**: Composite components (accordion, dialog, form components, etc.)
- **Tokens**: Design system tokens for colors, spacing, typography
- **Storybook**: Run `bunx nx run ui:storybook` to view components

Import pattern:
```typescript
import { Button } from '@libs/ui/atoms/button'
import { Dialog } from '@libs/ui/molecules/dialog'
```

## Medusa Backend Structure

Key directories in `apps/medusa-be/src/`:
- `api/`: Custom API endpoints
- `modules/`: Custom Medusa modules
- `workflows/`: Business logic workflows
- `admin/`: Admin panel customizations
- `subscribers/`: Event subscribers
- `jobs/`: Background jobs

## Configuration Files

- **nx.json**: Nx workspace configuration
- **biome.json**: Linter and formatter settings (extends ultracite)
- **tsconfig.base.json**: Shared TypeScript configuration
- **pnpm-workspace.yaml**: Workspace package definitions
