# CLAUDE.md - UI Library (`@libs/ui`)

## Project Context

This is a React 19 + Tailwind v4 UI library using atomic design principles. We exclusively use:
- **React 19** (no forwardRef - ref is passed as prop, no useCallback needed)
- **Tailwind v4** (no tailwind.config - uses @theme blocks)
- **tailwind-variants** for component styling
- **Zag.js** for complex interactive components

**IMPORTANT**: Never mention or use `tailwind.config`, `forwardRef`, or `useCallback`.

## Required Tools

**YOU MUST** use these tools when implementing components:
- **MCP Quillopy**: For studying Tailwind v4, tailwind-variants, and React 19 documentation
- **Context7**: For researching Zag.js patterns and component implementations

## File Structure

```
libs/ui/src/
├── atoms/          # Basic components (Button, Input, Icon)
├── molecules/      # Composite components (Dialog, Combobox, Toast)
├── organisms/      # Complex sections (rarely used in this library)
├── tokens/         # Design tokens
│   └── components/ # Component-specific tokens (_button.css, _combobox.css)
└── utils/          # Shared utilities (tv setup)
```

## CSS Token System

### Token Definition Rules

**IMPORTANT**: All component tokens must be defined in `@theme static` blocks:

```css
/* libs/ui/src/tokens/components/_component-name.css */
@theme static {
  /* Category-Component-Property-State pattern */
  --color-button-bg: var(--color-primary);
  --color-button-bg-hover: oklch(from var(--color-button-bg) calc(l + var(--state-hover)) c h);
  --spacing-button-sm: var(--spacing-xs);
}
```

### Allowed Token Prefixes

**YOU MUST** use these prefixes for design tokens:

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

**IMPORTANT**: Use `--spacing-` prefix for any width/height values that need `max-w`/`min-w`/`max-h`/`min-h` utilities!

### Forbidden Patterns

- ❌ `--grid-cols-product-grid-base` (too specific)
- ❌ `--layout-*` (use specific properties like `--spacing-` or `--width-`)
- ❌ `--component-specific-anything` (aim for generic, reusable token names)

### Token Usage in Components

```typescript
// ✅ CORRECT - Use Tailwind classes that reference your tokens
'bg-button-bg'         // Uses --color-button-bg
'text-button-fg'       // Uses --color-button-fg
'p-button-sm'          // Uses --spacing-button-sm

// ❌ WRONG - Never use arbitrary values
'bg-[var(--color-button-bg)]'
'p-[var(--spacing-button-sm)]'
```

## Component Development Workflow

### 1. Creating New Component

1. **Research with MCP Quillopy/Context7**:
   - For Zag.js components: Study the specific component documentation
   - For styling: Research tailwind-variants patterns

2. **Create Files**:
   - Component: `libs/ui/src/[atoms|molecules]/component-name.tsx`
   - Tokens: `libs/ui/src/tokens/components/_component-name.css`
   - Story: `libs/ui/stories/component-name.stories.tsx`

3. **Define Tokens** (follow prefix rules above)

4. **Implement Component**:
   ```typescript
   import { tv } from '../utils'
   
   const componentVariants = tv({
     slots: {
       root: ['flex', 'bg-component-bg', 'data-[state=open]:bg-component-bg-open'],
       content: ['text-component-fg', 'p-component']
     },
     variants: {
       size: {
         sm: { root: 'p-component-sm', content: 'text-component-sm' },
         md: { root: 'p-component-md', content: 'text-component-md' }
       }
     }
   })
   
   export function Component({ size = 'md', ref, ...props }) {
     const { root, content } = componentVariants({ size })
     return (
       <div ref={ref} className={root()} {...props}>
         <div className={content()}>Content</div>
       </div>
     )
   }
   ```

5. **Create Comprehensive Stories** covering all variants and states

## Zag.js Integration Pattern

**IMPORTANT**: Always use MCP Quillopy/Context7 to study Zag.js documentation for the specific component.

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

## State-Based Styling

Use data attributes for dynamic styling:

```typescript
// State attributes from Zag.js or custom
'data-[state=open]:rotate-180'
'data-[highlighted]:bg-item-hover'
'data-[disabled]:opacity-disabled'
'data-[validation=error]:border-danger'
```

## Common Pitfalls to Avoid

1. **Token Usage**:
   - ❌ Using arbitrary values: `bg-[#ff0000]`
   - ✅ Using token-based classes: `bg-button-danger`

2. **React 19 Patterns**:
   - ❌ `forwardRef<HTMLDivElement, Props>((props, ref) => ...)`
   - ✅ `function Component({ ref, ...props }: Props & { ref?: Ref<HTMLDivElement> })`

3. **Tailwind v4**:
   - ❌ Mentioning `tailwind.config.js`
   - ✅ Using `@theme static` blocks

## Validation Checklist

Before considering a component complete:

- [ ] Token file follows all prefix rules
- [ ] Component uses `tv()` with token-based classes
- [ ] No arbitrary values in styling
- [ ] Story file covers all variants and states
- [ ] Used MCP Quillopy/Context7 for documentation research
- [ ] No React 18 patterns (forwardRef, useCallback)
- [ ] Data attributes used for state-based styling