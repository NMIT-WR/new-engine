# Component Development Guide (.tsx)

> **Scope:** Creating and modifying `.tsx` component files
> **Related:** [tokens.md](./tokens.md) • [storybook.md](./storybook.md) • [CLAUDE.md](../CLAUDE.md)

---

How to create React components in this library.

## File Location

| Type | Location | Example |
|------|----------|---------|
| Atoms | `src/atoms/component-name.tsx` | `src/atoms/button.tsx` |
| Molecules | `src/molecules/component-name.tsx` | `src/molecules/dialog.tsx` |

**Naming:** kebab-case for files, PascalCase for exports.

## Component Types

### 1. Simple Components (Atoms)

Use `tv()` for styling. No state machine needed.

```typescript
import { tv, type VariantProps } from '../utils'

const buttonVariants = tv({
  base: 'inline-flex items-center justify-center transition-colors font-button',
  variants: {
    variant: {
      primary: 'bg-button-bg-primary text-button-fg-primary hover:bg-button-bg-primary-hover',
      secondary: 'bg-button-bg-secondary text-button-fg-secondary hover:bg-button-bg-secondary-hover',
      danger: 'bg-button-bg-danger text-button-fg-danger hover:bg-button-bg-danger-hover',
    },
    size: {
      sm: 'h-button-sm px-button-sm text-button-sm rounded-button-sm',
      md: 'h-button-md px-button-md text-button-md rounded-button-md',
      lg: 'h-button-lg px-button-lg text-button-lg rounded-button-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

type ButtonVariants = VariantProps<typeof buttonVariants>

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  ref?: React.Ref<HTMLButtonElement>
}

export function Button({ variant, size, className, ref, ...props }: ButtonProps) {
  return (
    <button
      ref={ref}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
}
```

### 2. Interactive Components (Zag.js)

**REQUIRED:** Use Context7 to research Zag.js documentation before implementing.

```typescript
import * as accordion from '@zag-js/accordion'
import { normalizeProps, useMachine } from '@zag-js/react'
import { createContext, useContext, useId, type PropsWithChildren } from 'react'

// 1. Context Definition
type AccordionApi = ReturnType<typeof accordion.connect>
const AccordionContext = createContext<AccordionApi | null>(null)

function useAccordionContext() {
  const context = useContext(AccordionContext)
  if (!context) throw new Error('useAccordionContext must be used within Accordion.Root')
  return context
}

// 2. Root Component (Provider)
interface AccordionRootProps extends PropsWithChildren {
  defaultValue?: string[]
  collapsible?: boolean
}

export function Root({ children, defaultValue, collapsible = true }: AccordionRootProps) {
  const service = useMachine(accordion.machine, {
    id: useId(),
    value: defaultValue,
    collapsible,
  })
  const api = accordion.connect(service, normalizeProps)

  return (
    <AccordionContext.Provider value={api}>
      <div {...api.getRootProps()} className="flex flex-col gap-accordion">
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

// 3. Sub-Components (Consumers)
interface ItemProps extends PropsWithChildren {
  value: string
}

export function Item({ children, value }: ItemProps) {
  const api = useAccordionContext()
  return (
    <div
      {...api.getItemProps({ value })}
      className="border-accordion-border rounded-accordion overflow-hidden"
    >
      {children}
    </div>
  )
}

export function Trigger({ children, value }: ItemProps) {
  const api = useAccordionContext()
  return (
    <button
      {...api.getItemTriggerProps({ value })}
      className="flex w-full justify-between p-accordion
                 bg-accordion-bg-trigger hover:bg-accordion-bg-trigger-hover
                 data-[state=open]:bg-accordion-bg-trigger-open"
    >
      {children}
      <span className="transform transition-transform data-[state=open]:rotate-180">
        ▼
      </span>
    </button>
  )
}

export function Content({ children, value }: ItemProps) {
  const api = useAccordionContext()
  return (
    <div
      {...api.getItemContentProps({ value })}
      className="p-accordion bg-accordion-bg-content
                 data-[state=closed]:hidden animate-accordion-down"
    >
      {children}
    </div>
  )
}

// 4. Export as namespace
export const Accordion = { Root, Item, Trigger, Content }
```

## tv() Patterns

### Slots for Multi-Part Components

```typescript
const dialogVariants = tv({
  slots: {
    backdrop: 'fixed inset-0 bg-dialog-backdrop',
    positioner: 'fixed inset-0 flex items-center justify-center',
    content: 'bg-dialog-bg rounded-dialog shadow-dialog p-dialog',
    title: 'text-dialog-title font-dialog-title',
    description: 'text-dialog-description',
  },
  variants: {
    size: {
      sm: { content: 'max-w-dialog-sm' },
      md: { content: 'max-w-dialog-md' },
      lg: { content: 'max-w-dialog-lg' },
    },
  },
  defaultVariants: { size: 'md' },
})

// Usage
const { backdrop, positioner, content, title, description } = dialogVariants({ size })
```

### Compound Variants

```typescript
const inputVariants = tv({
  base: 'border rounded transition-colors',
  variants: {
    size: { sm: 'h-input-sm', md: 'h-input-md' },
    validation: { none: '', error: '', success: '' },
  },
  compoundVariants: [
    { validation: 'error', className: 'border-input-border-error focus:ring-input-ring-error' },
    { validation: 'success', className: 'border-input-border-success focus:ring-input-ring-success' },
  ],
})
```

## State-Based Styling

Use data attributes from Zag.js, not conditional classes:

```typescript
// ✅ CORRECT - CSS handles state
className="bg-accordion-bg data-[state=open]:bg-accordion-bg-open"
className="data-disabled:opacity-disabled data-disabled:cursor-not-allowed"

// ❌ WRONG - JS handles state
className={clsx('bg-accordion-bg', isOpen && 'bg-accordion-bg-open')}
```

### Common Data Attributes

| Attribute | Source | Usage |
|-----------|--------|-------|
| `data-state="open\|closed"` | Zag.js | Expandable components |
| `data-highlighted` | Zag.js | Menu/listbox items |
| `data-disabled` | Zag.js / HTML | Disabled state |
| `data-selected` | Zag.js | Selected items |
| `data-focus` | Zag.js | Focus state |
| `data-invalid` | Zag.js | Validation error |

## React 19 Rules

### Ref as Prop

```typescript
// ✅ CORRECT - React 19
interface ButtonProps {
  ref?: React.Ref<HTMLButtonElement>
}

export function Button({ ref, ...props }: ButtonProps) {
  return <button ref={ref} {...props} />
}

// ❌ WRONG - Old React
export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <button ref={ref} {...props} />
})
```

### No useCallback for Event Handlers

```typescript
// ✅ CORRECT - React 19 compiler handles this
function Component() {
  const handleClick = () => { /* ... */ }
  return <button onClick={handleClick} />
}

// ❌ UNNECESSARY
function Component() {
  const handleClick = useCallback(() => { /* ... */ }, [])
  return <button onClick={handleClick} />
}
```

## Exports

### Single Component

```typescript
// src/atoms/button.tsx
export function Button() { /* ... */ }

// src/atoms/index.ts
export { Button } from './button'
```

### Compound Component

```typescript
// src/molecules/accordion.tsx
export const Accordion = { Root, Item, Trigger, Content }

// Or individual exports for tree-shaking
export { Root as AccordionRoot }
export { Item as AccordionItem }
export { Trigger as AccordionTrigger }
export { Content as AccordionContent }
```

## Anti-Patterns

### State Management

```typescript
// ❌ WRONG - Custom state for Zag component
const [isOpen, setIsOpen] = useState(false)
<Dialog open={isOpen} onOpenChange={setIsOpen}>

// ✅ CORRECT - Let Zag handle state
const service = useMachine(dialog.machine, { id: useId() })
const api = dialog.connect(service, normalizeProps)
```

### Styling

```typescript
// ❌ WRONG - Arbitrary values
className="bg-[#3b82f6] p-[14px]"

// ✅ CORRECT - Token classes
className="bg-button-bg-primary p-button-md"
```

### Props Spreading

```typescript
// ❌ WRONG - Missing Zag props
<button onClick={api.open}>Open</button>

// ✅ CORRECT - Spread Zag props
<button {...api.getTriggerProps()}>Open</button>
```

## Checklist

Before committing a component:

- [ ] Uses `tv()` for styling
- [ ] All classes use semantic tokens (no arbitrary values)
- [ ] React 19 patterns (ref as prop, no forwardRef)
- [ ] Zag.js components use Context + compound pattern
- [ ] Data attributes for state styling
- [ ] Props spread from Zag API where applicable
- [ ] TypeScript interfaces for all props
- [ ] Corresponding token file exists
- [ ] Storybook story created
