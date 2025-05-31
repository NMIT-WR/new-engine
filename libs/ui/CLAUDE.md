# UI Library CLAUDE.md

This file provides guidance to Claude Code for the UI library component development.

## Component Architecture

The UI library follows atomic design principles with Zag.js for complex interactions.

### Component Structure

```
libs/ui/
├── src/
│   ├── atoms/          # Basic components (button, input, icon)
│   ├── molecules/      # Composite components (dialog, combobox, toast)
│   ├── organisms/      # Complex page sections (rarely used in lib)
│   ├── tokens/         # Design tokens and CSS
│   └── utils/          # Shared utilities
└── stories/            # Storybook stories
```

## Styling Conventions

### 1. Tailwind Variants (tv) Usage

Components use `tailwind-variants` for styling with specific conventions:

```typescript
import { tv } from '../utils'

const componentVariants = tv({
  base: [...],      // Always use array syntax
  slots: {          // For multi-part components
    root: [...],
    content: [...],
  },
  variants: {
    size: {
      sm: [...],
      md: [...],
    }
  },
  compoundVariants: [...],
  defaultVariants: {
    size: 'md'
  }
})
```

### 2. CSS Custom Properties in Tailwind Classes

**CRITICAL**: CSS custom properties are used with Tailwind's arbitrary value syntax:

```typescript
// ✅ CORRECT - Using Tailwind's bracket notation
'bg-[var(--color-button-bg)]'
'p-[var(--spacing-button-sm)]'
'rounded-[var(--radius-button)]'
'border-(length:--border-width-button)'  // Special syntax for border width
'z-(--z-index)'                          // Special syntax for z-index

// ❌ WRONG - Direct class names
'bg-button-bg'
'p-button-sm'
'rounded-button'
```

### 3. Token Naming Convention

Tokens follow a hierarchical naming pattern:

```css
@theme static {
  /* Category-Component-Property-Variant */
  --color-button-bg: var(--color-primary);
  --color-button-bg-hover: var(--color-primary-hover);
  --spacing-button-sm: var(--spacing-xs);
  --radius-button: var(--radius-md);
}
```

### 4. CSS File Structure

Each component has a corresponding CSS file:

```css
/* Always import semantic tokens */
@import "../../_semantic.css";

/* Root-level variables for component-specific values */
:root {
  --opacity-button-disabled: 50%;
}

/* Static theme tokens */
@theme static {
  /* Base color mapping */
  --color-button-primary: var(--color-primary);
  
  /* State variations using oklch() */
  --color-button-primary-hover: oklch(
    from var(--color-button-primary) calc(l + var(--state-hover)) c h
  );
}
```

## Component Patterns

### 1. Zag.js Integration

For complex interactions, use Zag.js:

```typescript
import * as component from '@zag-js/component-name'
import { normalizeProps, useMachine } from '@zag-js/react'
import { useId } from 'react'

export function Component(props: ComponentProps) {
  const [state, send] = useMachine(component.machine({
    id: useId(),
    ...props
  }))
  
  const api = component.connect(state, send, normalizeProps)
  
  return (
    <div {...api.getRootProps()}>
      {/* Component parts */}
    </div>
  )
}
```

### 2. Token-icon Usage

Icons use the `token-icon-*` prefix for semantic icons:

```typescript
'token-icon-close'     // Generic close icon
'token-icon-chevron'   // Chevron/arrow icon
'token-icon-check'     // Checkmark icon
```

### 3. Data Attributes for State

Use data attributes for styling state variations:

```typescript
'data-[state=open]:rotate-180'
'data-[highlighted]:bg-item-hover'
'data-[disabled]:opacity-50'
'data-[type=error]:bg-error'
```

## Common Mistakes to Avoid

1. **Don't use direct token names as Tailwind classes**
   ```typescript
   // ❌ Wrong
   'bg-button-primary'
   
   // ✅ Correct
   'bg-[var(--color-button-primary)]'
   ```

2. **Don't forget to import CSS tokens**
   ```css
   /* Every component CSS should start with */
   @import "../../_semantic.css";
   ```

3. **Don't use inline styles for tokens**
   ```typescript
   // ❌ Wrong
   style={{ backgroundColor: 'var(--color-primary)' }}
   
   // ✅ Correct
   className="bg-[var(--color-primary)]"
   ```

## Testing Components

Always create comprehensive Storybook stories:

```typescript
const meta: Meta<typeof Component> = {
  title: 'Category/ComponentName',
  component: Component,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    // Define controls for props
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // Default props
  },
}

// Create variations for all major use cases
export const Small: Story = { ... }
export const WithIcon: Story = { ... }
export const Disabled: Story = { ... }
```

## Debugging Checklist

If a component doesn't look right:

1. ✅ Check CSS file is imported in `components.css`
2. ✅ Verify token names match between CSS and TSX
3. ✅ Ensure using `[var(--token-name)]` syntax
4. ✅ Check semantic tokens are imported in CSS
5. ✅ Verify parent containers don't override styles
6. ✅ Use browser DevTools to inspect computed values