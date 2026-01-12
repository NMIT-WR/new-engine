# Storybook Development Guide (.stories.tsx)

> **Scope:** Creating and modifying `.stories.tsx` story files
> **Related:** [components.md](./components.md) • [tokens.md](./tokens.md) • [CLAUDE.md](../CLAUDE.md)
> **Reference:** [button.stories.tsx](../../stories/atoms/button.stories.tsx)

---

How to create Storybook stories for components.

## File Location

| Type | Location | Example |
|------|----------|---------|
| Atoms | `stories/atoms/component-name.stories.tsx` | `button.stories.tsx` |
| Molecules | `stories/molecules/component-name.stories.tsx` | `dialog.stories.tsx` |

## File Structure

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { VariantContainer, VariantGroup } from '../../.storybook/decorator'
import { ComponentName } from '../../src/atoms/component-name'

const meta: Meta<typeof ComponentName> = {
  title: 'Atoms/ComponentName',  // or 'Molecules/ComponentName'
  component: ComponentName,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    // Define controls for all props
  },
  args: {
    // Default values
    onClick: fn(),
  },
}

export default meta
type Story = StoryObj<typeof ComponentName>
```

## Meta Configuration

| Property | Required | Description |
|----------|----------|-------------|
| `title` | Yes | Path in Storybook sidebar (`Atoms/Button`) |
| `component` | Yes | Reference to the component |
| `tags` | Yes | Always `['autodocs']` for automatic docs |
| `parameters` | Yes | Layout and other settings |
| `argTypes` | Yes | Control definitions for props |
| `args` | Yes | Default prop values |

## Required Stories

Every component must have these stories in this order:

```
1. Playground    - Interactive testing with Controls
2. Variants      - All visual variants (primary, secondary, ...)
3. Sizes         - All size variants (sm, md, lg)
4. States        - Component states (disabled, loading, error)
5. [Specific]    - Component-specific stories (WithIcon, etc.)
```

### 1. Playground

Always first. For interactive testing:

```tsx
export const Playground: Story = {
  args: {
    children: 'Playground Button',
  },
}
```

### 2. Variants

Show all visual variants:

```tsx
export const Variants: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Solid themes">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="danger">Danger</Button>
      </VariantGroup>

      <VariantGroup title="Light themes">
        <Button variant="primary" theme="light">Primary Light</Button>
        <Button variant="secondary" theme="light">Secondary Light</Button>
      </VariantGroup>

      <VariantGroup title="Outlined themes">
        <Button variant="primary" theme="outlined">Outlined</Button>
      </VariantGroup>
    </VariantContainer>
  ),
}
```

### 3. Sizes

Show all size variants:

```tsx
export const Sizes: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Size comparison">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </VariantGroup>
    </VariantContainer>
  ),
}
```

### 4. States

Show interactive states:

```tsx
export const States: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Interactive states">
        <Button>Default</Button>
        <Button disabled>Disabled</Button>
        <Button isLoading>Loading</Button>
      </VariantGroup>
    </VariantContainer>
  ),
}
```

## ArgTypes

### Select for Enum Props

For props with multiple options:

```tsx
argTypes: {
  variant: {
    control: 'select',
    options: ['primary', 'secondary', 'tertiary', 'warning', 'danger'],
    description: 'Visual style variant',
    table: {
      defaultValue: { summary: 'primary' },
    },
  },
}
```

### Radio for Few Options (2-4)

```tsx
argTypes: {
  type: {
    control: 'radio',
    options: ['button', 'submit', 'reset'],
    description: 'HTML button type',
    table: {
      defaultValue: { summary: 'button' },
    },
  },
}
```

### Boolean Toggle

```tsx
argTypes: {
  disabled: {
    control: 'boolean',
    description: 'Disables the component',
    table: {
      defaultValue: { summary: 'false' },
    },
  },
}
```

### Text Input

```tsx
argTypes: {
  loadingText: {
    control: 'text',
    description: 'Text shown when loading',
  },
}
```

### Icons with Labels

```tsx
import { iconLabels, iconOptions } from '../helpers/icon-options'

argTypes: {
  icon: {
    control: {
      type: 'select',
      labels: iconLabels,
    },
    options: iconOptions,
    description: 'Icon to display',
  },
}
```

## Default Args

Always define defaults for all props:

```tsx
args: {
  variant: 'primary',
  theme: 'solid',
  size: 'md',
  disabled: false,
  isLoading: false,
  children: 'Button',
  onClick: fn(),  // Use fn() for event handlers
}
```

## Layout Decorators

### VariantContainer

Wrapper for all visual stories:

```tsx
<VariantContainer>
  {/* Groups of variants */}
</VariantContainer>
```

### VariantGroup

Groups related variants with a title:

```tsx
<VariantGroup title="Group Title">
  <Component />
  <Component />
</VariantGroup>

// For full-width components
<VariantGroup title="Full Width" fullWidth>
  <Input />
</VariantGroup>
```

## Token System in Stories

**CRITICAL:** Use our semantic tokens. No hardcoded Tailwind values!

### Spacing

```tsx
// ✅ CORRECT - Our token system
<div className="p-200 gap-150 mt-300">

// ❌ WRONG - Hardcoded Tailwind
<div className="p-4 gap-2 mt-6">
<div className="p-[1rem] gap-[8px]">
```

**Available spacing tokens:** `50`, `100`, `150`, `200`, `250`, `300`, `350`, `400`, `450`, `500`...

### Colors

```tsx
// ✅ CORRECT - Semantic colors
<div className="bg-primary text-fg-reverse">
<div className="bg-success border-danger">

// ❌ WRONG - Tailwind palette
<div className="bg-blue-500 text-white">
<div className="bg-green-400 border-red-500">
```

**Available semantic colors:**
- `primary`, `secondary`, `tertiary`
- `success`, `warning`, `danger`, `info`
- `surface`, `surface-elevated`, `surface-sunken`
- `fg`, `fg-secondary`, `fg-muted`, `fg-reverse`

## Naming Conventions

### Story Names

| Type | Name | Description |
|------|------|-------------|
| Interactive | `Playground` | First story, for Controls |
| Variants | `Variants` | All style variants |
| Sizes | `Sizes` | All size variants |
| States | `States` | disabled, loading, error |
| Complete | `AllVariants` | Full matrix |
| Specific | `IconButtons`, `WithLabel` | Named by function |

### Forbidden Names

- `Example` - too generic
- `Test` - not descriptive
- `Demo` - unspecific

## Component Usage

Use our components, not native HTML:

```tsx
// ✅ CORRECT - Our components
import { Button } from '../../src/atoms/button'
import { Input } from '../../src/atoms/input'

<Button variant="primary">Click me</Button>
<Input placeholder="Enter text" />

// ❌ WRONG - Native elements
<button className="...">Click me</button>
<input className="..." placeholder="Enter text" />
```

## Complete Example

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { VariantContainer, VariantGroup } from '../../.storybook/decorator'
import { Button } from '../../src/atoms/button'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'danger'],
      description: 'Visual style variant',
      table: { defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
      table: { defaultValue: { summary: 'md' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    children: 'Button',
    onClick: fn(),
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Playground: Story = {
  args: {
    children: 'Playground Button',
  },
}

export const Variants: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Solid">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
      </VariantGroup>
    </VariantContainer>
  ),
}

export const Sizes: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="Sizes">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </VariantGroup>
    </VariantContainer>
  ),
}

export const States: Story = {
  render: () => (
    <VariantContainer>
      <VariantGroup title="States">
        <Button>Default</Button>
        <Button disabled>Disabled</Button>
        <Button isLoading>Loading</Button>
      </VariantGroup>
    </VariantContainer>
  ),
}
```

## Checklist

Before committing a story:

### Structure
- [ ] Meta has `tags: ['autodocs']`
- [ ] All props have `argTypes` with `description` and `defaultValue`
- [ ] `Playground` story exists
- [ ] `Variants`, `Sizes`, `States` stories exist
- [ ] Uses `VariantContainer` and `VariantGroup`
- [ ] Story names are descriptive (not Example, Test, Demo)
- [ ] Event handlers use `fn()` from `storybook/test`

### Token System
- [ ] Spacing uses tokens (50-950, not p-4, gap-8)
- [ ] Colors use semantic tokens (not bg-blue-500)
- [ ] No arbitrary values `[...]` in classNames
- [ ] Uses our components, not native HTML elements
