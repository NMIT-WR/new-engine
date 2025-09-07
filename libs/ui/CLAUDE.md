# CLAUDE.md - UI Library (`@libs/ui`)

## Project Context

This is a React 19 + Tailwind v4 UI library using atomic design principles. We exclusively use:
- **React 19** (no forwardRef - ref is passed as prop, no useCallback needed)
- **Tailwind v4** (no tailwind.config - uses @theme blocks)
- **tailwind-variants** for component styling
- **Zag.js** for complex interactive components

**CRITICAL**: Never mention or use `tailwind.config`, `forwardRef`, or `useCallback`.

## Architecture Overview

```
libs/ui/src/
├── atoms/          # Basic components (Button, Input, Icon)
├── molecules/      # Composite components (Dialog, Combobox, Toast)
├── organisms/      # Complex sections (rarely used in this library)
├── tokens/         # Design tokens
│   ├── components/
│   │   ├── atoms/  # Atomic component tokens
│   │   └── molecules/ # Molecular component tokens
│   └── _semantic.css # Base semantic tokens
└── utils/          # Shared utilities (tv setup)
```

## Component Development Workflow

### Creating New Component (Required Process)

1. **Research Phase**:
   - **Context7**: Study Zag.js component documentation for interactive components
   - **MCP Quillopy**: Research tailwind-variants patterns and Tailwind v4 features

2. **File Creation**:
   - Component: `libs/ui/src/[atoms|molecules]/component-name.tsx`
   - Tokens: `libs/ui/src/tokens/components/[atoms|molecules]/_component-name.css`
   - Story: `libs/ui/stories/component-name.stories.tsx`

3. **Token Definition** (follow rules below)

4. **Component Implementation** using tv() pattern

5. **Story Creation** covering all variants and states

## Token System Rules

See comprehensive token documentation in [`token-contribution.md`](./token-contribution.md)

### Key Points:
- **Two-layer token strategy**: Reference layer → Derived tokens
- **Strict naming conventions**: `--[prefix]-[component]-[part?]-[property]-[state?]`
- **Required suffixes**: All colors must have `-bg`, `-fg`, or `-border`
- **No abbreviations**: Use full names (`button` not `btn`)
- **Validation tools**: Run `pnpm validate:tokens` to check compliance

### Quick Token Usage in Components:

```typescript
// ✅ CORRECT - Use Tailwind classes that reference your tokens
'bg-button-bg-primary'     // Uses --color-button-bg-primary
'text-button-fg-primary'   // Uses --color-button-fg-primary
'p-button-padding'         // Uses --spacing-button-padding

// ❌ WRONG - Never use arbitrary values
'bg-[var(--color-button-bg-primary)]'  // Don't use arbitrary values
'p-[1rem]'                             // Use token classes instead
```

## Component Implementation Patterns

### Basic Component Structure

```typescript
import { tv } from '../utils'

const componentVariants = tv({
  slots: {
    root: ['flex', 'bg-component-bg', 'data-[state=open]:bg-component-bg-open'],
    content: ['text-component-fg', 'p-component-padding']
  },
  variants: {
    variant: {
      primary: { 
        root: 'bg-component-bg-primary', 
        content: 'text-component-fg-primary' 
      },
      secondary: { 
        root: 'bg-component-bg-secondary', 
        content: 'text-component-fg-secondary' 
      }
    },
    size: {
      sm: { root: 'p-component-sm', content: 'text-component-sm' },
      md: { root: 'p-component-md', content: 'text-component-md' }
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md'
  }
})

export function Component({ variant, size, ref, ...props }) {
  const { root, content } = componentVariants({ variant, size })
  return (
    <div ref={ref} className={root()} {...props}>
      <div className={content()}>Content</div>
    </div>
  )
}
```

### Zag.js Interactive Components

**REQUIRED**: Use Context7 to study specific Zag.js component documentation.

```typescript
import * as component from '@zag-js/component-name'
import { normalizeProps, useMachine } from '@zag-js/react'
import { useId } from 'react'

export function Component(props: ComponentProps) {
  const service = useMachine(component.machine({
    id: useId(),
    ...props
  }))
  
  const api = component.connect(service, normalizeProps)
  
  // Use data attributes for state-based styling
  return (
    <div {...api.getRootProps()} data-state={api.state}>
      {/* Component implementation */}
    </div>
  )
}
```

### State-Based Styling

Use data attributes for dynamic styling:

```typescript
// State attributes from Zag.js or custom
'data-[state=open]:rotate-180'
'data-[highlighted]:bg-component-bg-hover'
'data-[disabled]:opacity-disabled'
'data-[validation=error]:border-component-border-danger'
```

## Required Tools Integration

**YOU MUST use these tools**:
- **Context7**: For researching Zag.js patterns and component implementations
- **MCP Quillopy**: For studying Tailwind v4, tailwind-variants, and React 19 documentation

**When to use each**:
- Creating interactive components → Context7 first
- Styling questions → MCP Quillopy
- Complex state management → Context7 for Zag.js patterns

## Development Commands

```bash
# Component development
bunx nx run ui:storybook    # Start Storybook for component preview
bunx nx run ui:build        # Build UI library

# Token validation
pnpm validate:tokens        # Validate token naming and structure
pnpm check:unused-tokens    # Find unused token definitions
```

## Quality Standards

### Component Validation Checklist

Before considering a component complete:

- [ ] **Token file structure**: Follows mandatory section order
- [ ] **Token naming**: All colors have explicit suffixes (-bg, -fg)
- [ ] **Reference layer**: Implemented for all themeable properties
- [ ] **Component implementation**: Uses tv() with token-based classes
- [ ] **No arbitrary values**: All styling uses semantic tokens
- [ ] **Story coverage**: All variants and states documented
- [ ] **Tool usage**: Used Context7/MCP Quillopy for research
- [ ] **React 19 patterns**: No forwardRef, ref as prop
- [ ] **State styling**: Data attributes for dynamic states
- [ ] **No forbidden patterns**: No tailwind.config mentions

### Common Pitfalls to Avoid

1. **Token Naming Errors**:
   - ❌ `--color-button` (missing -bg suffix)
   - ❌ `--color-btn-primary` (use 'button' not 'btn')
   - ❌ `--color-button-text` (use -fg not -text)
   - ✅ `--color-button-bg-primary`

2. **React 19 Violations**:
   - ❌ `forwardRef<HTMLDivElement, Props>((props, ref) => ...)`
   - ❌ `useCallback(() => {}, [])`
   - ✅ `function Component({ ref, ...props }: Props & { ref?: Ref<HTMLDivElement> })`

3. **Tailwind v4 Violations**:
   - ❌ Mentioning `tailwind.config.js`
   - ❌ Using arbitrary values `bg-[#ff0000]`
   - ✅ Using `@theme static` blocks and token classes

4. **Architecture Violations**:
   - ❌ Direct semantic token usage: `bg-primary`
   - ❌ Missing reference layer
   - ✅ Component-specific tokens: `bg-button-bg-primary`

## Storybook Integration

```typescript
// component-name.stories.tsx
export default {
  title: 'Atoms/ComponentName',
  component: Component,
  parameters: {
    docs: { description: { component: 'Component description...' } }
  }
}

// Cover ALL variants and states
export const AllVariants: Story = {
  render: () => (
    <div className="grid gap-4">
      <Component variant="primary" size="sm" />
      <Component variant="secondary" size="md" />
      <Component variant="primary" size="lg" disabled />
    </div>
  )
}
```

## File Organization Rules

### Component Files
- **Atoms**: `src/atoms/component-name.tsx`
- **Molecules**: `src/molecules/component-name.tsx`
- **Stories**: `stories/component-name.stories.tsx`

### Token Files
- **Atoms**: `src/tokens/components/atoms/_component-name.css`
- **Molecules**: `src/tokens/components/molecules/_component-name.css`

### Naming Conventions
- **Files**: kebab-case (`component-name.tsx`)
- **Components**: PascalCase (`ComponentName`)
- **Tokens**: kebab-case (`--color-component-name-bg`)

## Do Not Section

**NEVER**:
- Mention `tailwind.config.js` or `tailwind.config.ts`
- Use `forwardRef` or `useCallback` (React 19 doesn't need them)
- Use arbitrary values in styling (`bg-[#ff0000]`)
- Create tokens without proper prefixes
- Skip the reference layer in token architecture
- Use abbreviations in component names (`btn`, `pc`, etc.)
- Create components without comprehensive stories
- Implement interactive components without studying Zag.js docs via Context7

**ALWAYS**:
- Use `@theme static` blocks for token definitions
- Implement two-layer token strategy (reference + derived)
- Use data attributes for state-based styling
- Research with Context7 for Zag.js components
- Research with MCP Quillopy for Tailwind v4 features
- Follow the mandatory token file structure
- Create comprehensive Storybook stories