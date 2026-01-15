# Generate Component

Generate a complete UI component in $ARGUMENTS following atomic design principles and the UI library standards.

## Task

I'll create a comprehensive component implementation including:

1. Component file with proper React 19 patterns (no forwardRef, ref as prop)
2. Token file with mandatory structure following `_button.css` patterns
3. Storybook story with all variants and states
4. Integration with existing component architecture
5. Proper Zag.js implementation for interactive components

## Process

I'll follow these steps:

1. **Component Type Analysis**
   - Determine if component is atom, molecule, or organism
   - Identify if component needs Zag.js for interactivity
   - Analyze required props and functionality
   - Plan component variants and states

2. **Research Phase**
   - **Context7**: Study Zag.js documentation for interactive components
   - **MCP Quillopy**: Research tailwind-variants patterns
   - Analyze existing components for patterns
   - Review reference implementations (`_button.css`, `_badge.css`)

3. **Token File Creation**
   - Create token file in proper location: `src/tokens/components/[atoms|molecules]/_component-name.css`
   - Follow mandatory structure from reference files
   - Implement two-layer token strategy (reference + derived)
   - Add comprehensive variants and state variations

4. **Component Implementation**
   - Create component file: `src/[atoms|molecules]/component-name.tsx`
   - Use React 19 patterns (ref as prop, no forwardRef)
   - Implement tailwind-variants for styling
   - Add Zag.js integration if interactive
   - Include proper TypeScript interfaces

5. **Story Creation**
   - Create Storybook story: `stories/component-name.stories.tsx`
   - Cover all variants and states
   - Include usage examples and documentation
   - Add accessibility considerations

6. **Integration and Export**
   - Add component to index exports
   - Update token imports in main CSS file
   - Verify component works in development
   - Document usage patterns

## Component Generation Types

### Atomic Components (atoms/)
Simple, single-purpose components:
- **Button variants**: primary, secondary, outlined, borderless
- **Input fields**: text, email, password, number
- **Display elements**: badge, avatar, icon, divider
- **Form controls**: checkbox, radio, switch, slider

### Molecular Components (molecules/)
Composite components with multiple parts:
- **Interactive elements**: accordion, dialog, combobox, popover
- **Form components**: form group, search field, date picker
- **Display components**: card, toast notification, tooltip
- **Navigation**: dropdown menu, tabs, breadcrumb

### Component Structure Templates

#### Simple Atom Component
```typescript
import { tv } from '../utils'

export interface ComponentNameProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  ref?: Ref<HTMLElement>
  // other props
}

const componentNameVariants = tv({
  base: [
    'inline-flex', 'items-center',
    'transition-colors', 'focus-visible:outline-none'
  ],
  variants: {
    variant: {
      primary: 'bg-component-bg-primary text-component-fg-primary',
      secondary: 'bg-component-bg-secondary text-component-fg-secondary'
    },
    size: {
      sm: 'px-component-sm py-component-sm text-component-sm',
      md: 'px-component-md py-component-md text-component-md',
      lg: 'px-component-lg py-component-lg text-component-lg'
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md'
  }
})

export function ComponentName({ 
  variant, 
  size, 
  disabled, 
  ref, 
  ...props 
}: ComponentNameProps) {
  const classes = componentNameVariants({ variant, size })
  
  return (
    <div 
      ref={ref}
      className={classes}
      data-disabled={disabled}
      {...props}
    >
      {/* Component content */}
    </div>
  )
}
```

#### Interactive Zag.js Component
```typescript
import * as component from '@zag-js/component-name'
import { normalizeProps, useMachine } from '@zag-js/react'
import { useId } from 'react'
import { tv } from '../utils'

export interface ComponentNameProps {
  // Zag.js specific props
  open?: boolean
  onOpenChange?: (open: boolean) => void
  // UI props
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  ref?: Ref<HTMLElement>
}

const componentNameVariants = tv({
  slots: {
    root: ['relative'],
    trigger: [
      'inline-flex', 'items-center', 'justify-between',
      'bg-component-bg', 'text-component-fg',
      'data-[state=open]:bg-component-bg-open'
    ],
    content: [
      'absolute', 'z-50',
      'bg-component-content-bg', 'text-component-content-fg',
      'border', 'border-component-border', 'rounded-component',
      'data-[state=open]:animate-in',
      'data-[state=closed]:animate-out'
    ]
  },
  variants: {
    variant: {
      primary: {
        trigger: 'bg-component-bg-primary text-component-fg-primary',
        content: 'border-component-border-primary'
      },
      secondary: {
        trigger: 'bg-component-bg-secondary text-component-fg-secondary',
        content: 'border-component-border-secondary'
      }
    },
    size: {
      sm: {
        trigger: 'px-component-sm py-component-sm text-component-sm',
        content: 'p-component-content-sm'
      },
      md: {
        trigger: 'px-component-md py-component-md text-component-md',
        content: 'p-component-content-md'
      }
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md'
  }
})

export function ComponentName({ 
  open, 
  onOpenChange,
  variant,
  size,
  ref,
  ...props 
}: ComponentNameProps) {
  const service = useMachine(component.machine({
    id: useId(),
    open,
    onOpenChange
  }))
  
  const api = component.connect(service, normalizeProps)
  const { root, trigger, content } = componentNameVariants({ variant, size })
  
  return (
    <div {...api.getRootProps()} ref={ref} className={root()}>
      <button {...api.getTriggerProps()} className={trigger()}>
        Trigger content
      </button>
      {api.open && (
        <div {...api.getContentProps()} className={content()}>
          Content
        </div>
      )}
    </div>
  )
}
```

## Token File Generation

### Mandatory Token Structure
Following `_button.css` reference pattern:

```css
/* Root variables for calculations only */
:root {
  --opacity-component-hover: 16%;
  --opacity-component-active: 12%;
}

@theme static {
  /* === BASE COLOR MAPPING === */
  /* Reference layer - single source of truth for theming */
  --color-component-primary: var(--color-primary);
  --color-component-secondary: var(--color-secondary);
  --color-component-base: var(--color-surface);

  /* === DERIVED COLORS === */
  /* Background colors - using reference layer */
  --color-component-bg: var(--color-component-base);
  --color-component-bg-primary: var(--color-component-primary);
  --color-component-bg-secondary: var(--color-component-secondary);

  /* Foreground colors */
  --color-component-fg: var(--color-fg-primary);
  --color-component-fg-primary: var(--color-fg-reverse);
  --color-component-fg-secondary: var(--color-fg-reverse);

  /* Border colors */
  --color-component-border: var(--color-border-primary);
  --color-component-border-primary: var(--color-component-primary);
  --color-component-border-secondary: var(--color-component-secondary);

  /* === STATE VARIATIONS === */
  --color-component-bg-hover: oklch(
    from var(--color-component-bg) calc(l + var(--state-hover)) c h
  );
  --color-component-bg-primary-hover: oklch(
    from var(--color-component-bg-primary) calc(l + var(--state-hover)) c h
  );
  --color-component-bg-secondary-hover: oklch(
    from var(--color-component-bg-secondary) calc(l + var(--state-hover)) c h
  );

  /* === COMPONENT VARIANTS === */
  /* Light variants */
  --color-component-bg-primary-light: var(--color-primary-light);
  --color-component-bg-secondary-light: var(--color-secondary-light);

  /* Outlined variants */
  --color-component-bg-outlined-primary: transparent;
  --color-component-bg-outlined-primary-hover: --alpha(
    var(--color-component-primary) / var(--opacity-component-hover)
  );

  /* === VALIDATION STATES === */
  --color-component-bg-danger: var(--color-danger);
  --color-component-bg-success: var(--color-success);
  --color-component-fg-danger: var(--color-fg-reverse);
  --color-component-fg-success: var(--color-fg-reverse);

  /* === DISABLED STATES === */
  --color-component-bg-disabled: var(--color-disabled-bg);
  --color-component-fg-disabled: var(--color-disabled-fg);
  --color-component-border-disabled: var(--color-disabled-border);

  /* === SPACING === */
  --spacing-component-sm: var(--spacing-150);
  --spacing-component-md: var(--spacing-200);
  --spacing-component-lg: var(--spacing-250);

  --padding-component-sm: var(--spacing-150) var(--spacing-250);
  --padding-component-md: var(--spacing-200) var(--spacing-350);
  --padding-component-lg: var(--spacing-250) var(--spacing-450);

  /* === TYPOGRAPHY === */
  --text-component-sm: var(--text-sm);
  --text-component-md: var(--text-md);
  --text-component-lg: var(--text-lg);

  /* === BORDERS & RADIUS === */
  --radius-component: var(--radius-md);
  --border-component-width: var(--border-width-sm);

  /* === FOCUS RINGS === */
  --color-component-ring-primary: --alpha(
    var(--color-component-primary) / var(--opacity-ring)
  );
}
```

## Story Generation

### Comprehensive Story Template
```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from '../src/atoms/component-name'

const meta: Meta<typeof ComponentName> = {
  title: 'Atoms/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'ComponentName provides [brief description of functionality].'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outlined']
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg']
    },
    disabled: {
      control: { type: 'boolean' }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Component content'
  }
}

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <ComponentName variant="primary" size="sm">Primary Small</ComponentName>
        <ComponentName variant="primary" size="md">Primary Medium</ComponentName>
        <ComponentName variant="primary" size="lg">Primary Large</ComponentName>
      </div>
      <div className="flex gap-4 items-center">
        <ComponentName variant="secondary" size="sm">Secondary Small</ComponentName>
        <ComponentName variant="secondary" size="md">Secondary Medium</ComponentName>
        <ComponentName variant="secondary" size="lg">Secondary Large</ComponentName>
      </div>
      <div className="flex gap-4 items-center">
        <ComponentName variant="outlined" size="sm">Outlined Small</ComponentName>
        <ComponentName variant="outlined" size="md">Outlined Medium</ComponentName>
        <ComponentName variant="outlined" size="lg">Outlined Large</ComponentName>
      </div>
    </div>
  )
}

// States showcase
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <ComponentName variant="primary">Default</ComponentName>
        <ComponentName variant="primary" disabled>Disabled</ComponentName>
      </div>
    </div>
  )
}

// Interactive story (for Zag.js components)
export const Interactive: Story = {
  render: () => (
    <ComponentName 
      variant="primary" 
      size="md"
      onOpenChange={(open) => console.log('Open changed:', open)}
    >
      Interactive content
    </ComponentName>
  )
}
```

## Quality Standards

### Component Validation Checklist
- [ ] **Token file structure**: Follows mandatory section order from `_button.css`
- [ ] **Token naming**: All colors have explicit suffixes (-bg, -fg, -border)
- [ ] **Reference layer**: Implemented for all themeable properties
- [ ] **React 19 patterns**: No forwardRef, ref as prop, no useCallback
- [ ] **Tailwind-variants**: Proper tv() implementation with slots if needed
- [ ] **Zag.js integration**: Correct machine usage and API connection
- [ ] **Story coverage**: All variants, states, and interactions documented
- [ ] **TypeScript**: Proper interface definitions and type safety
- [ ] **Accessibility**: ARIA attributes and keyboard navigation
- [ ] **File locations**: Correct atomic design organization

### Required Research Tools
- **Context7**: MUST use for Zag.js component research
- **MCP Quillopy**: MUST use for Tailwind v4 and tailwind-variants patterns
- Reference existing components and token files

I'll generate comprehensive, production-ready components that follow all established patterns and integrate seamlessly with your UI library architecture.