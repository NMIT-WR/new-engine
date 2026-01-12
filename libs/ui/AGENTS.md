# UI Library (`@libs/ui`)

React 19 + Tailwind v4 + Zag.js component library using atomic design.

## Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI framework (ref as prop, no forwardRef) |
| Tailwind CSS | 4 | Styling (@theme static, no config file) |
| Zag.js | latest | State machines for interactive components |
| tailwind-variants | latest | Component styling with tv() |
| Storybook | 10 | Documentation (CSF3, autodocs) |

## Architecture

```text
src/
+-- atoms/           # Button, Input, Icon, Badge, Skeleton
+-- molecules/       # Dialog, Combobox, Toast, Accordion, Menu
+-- tokens/
|   +-- components/
|   |   +-- atoms/      # _button.css, _input.css
|   |   +-- molecules/  # _dialog.css
|   +-- _semantic.css
+-- utils/           # tv setup, cn helper

stories/
+-- atoms/           # button.stories.tsx
+-- molecules/       # dialog.stories.tsx
```

## Commands

```bash
bunx nx run ui:storybook          # Component preview
bunx nx run ui:build              # Build library
pnpm validate:tokens              # Token validation
bunx biome check --write <file>   # Lint specific file (never ".")
```

## Required Reading

Before creating files, read the relevant guide:

| Task | Guide | When |
|------|-------|------|
| Component (.tsx) | [components.md](.claude/instructions/components.md) | Always for new components |
| Tokens (.css) | [tokens.md](.claude/instructions/tokens.md) | When creating/modifying tokens |
| Story (.stories.tsx) | [storybook.md](.claude/instructions/storybook.md) | Always for new stories |

## Decision Tree

```text
Creating new component?
+-- Interactive (dialog, menu, accordion)?
|   -> Research Zag.js first, then read components.md
+-- Simple (button, badge)?
    -> Proceed with tv() pattern, read components.md

Modifying tokens?
+-- New component?
|   -> Create reference + derived layers, read tokens.md
+-- Existing component?
    -> Follow existing pattern in the file

Writing story?
-> Always follow: Playground -> Variants -> Sizes -> States
   -> Read storybook.md for decorators and argTypes
```

## Critical Rules

**NEVER:**
- `forwardRef` / `useCallback` (React 19 doesn't need them)
- `tailwind.config.js` (Tailwind v4 uses @theme)
- Arbitrary values (`bg-[#ff0000]`, `p-[1rem]`)
- Abbreviations in tokens (`btn` -> `button`)
- Tokens without suffixes (`--color-button` -> `--color-button-bg`)

**ALWAYS:**
- `@theme static` blocks for tokens
- Two-layer tokens (reference -> derived)
- Data attributes for state (`data-[state=open]:...`)
- `tv()` with semantic token classes

## Minimal Pattern (emergency reference)

```typescript
const variants = tv({
  base: 'bg-component-bg text-component-fg',
  variants: { size: { sm: 'h-component-sm', md: 'h-component-md' } },
})

export function Component({ size, ref, ...props }) {
  return <div ref={ref} className={variants({ size })} {...props} />
}
```

## Research Tools

For Zag.js components, consult official documentation:
- [zagjs.com](https://zagjs.com)

For Tailwind v4 or tailwind-variants questions:
- [tailwindcss.com](https://tailwindcss.com)
