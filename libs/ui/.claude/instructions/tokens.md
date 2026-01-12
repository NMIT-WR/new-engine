# Token Development Guide (.css)

> **Scope:** Creating and modifying `.css` token files
> **Related:** [components.md](./components.md) • [storybook.md](./storybook.md) • [CLAUDE.md](../CLAUDE.md)

---

How to create design tokens for components.

## File Location

| Type | Location | Example |
|------|----------|---------|
| Atoms | `src/tokens/components/atoms/_component-name.css` | `_button.css` |
| Molecules | `src/tokens/components/molecules/_component-name.css` | `_dialog.css` |

**Naming:** `_kebab-case.css` with underscore prefix.

## Two-Layer Architecture

Every component token file must implement two layers:

```css
@theme static {
  /* === LAYER 1: REFERENCE (Themeable) === */
  --color-button-primary: var(--color-primary);
  --color-button-secondary: var(--color-secondary);
  --color-button-danger: var(--color-danger);

  /* === LAYER 2: DERIVED (Component-specific) === */
  --color-button-bg-primary: var(--color-button-primary);
  --color-button-fg-primary: var(--color-fg-reverse);
  --color-button-border-primary: var(--color-button-primary);
}
```

**Why?**
- Reference layer enables theming (change `--color-button-primary` once, affects all derived)
- Derived layer maps to specific component parts (bg, fg, border)

## Naming Convention

**Pattern:** `--[prefix]-[component]-[part?]-[property]-[state?]`

### Required Prefixes

| Prefix | Usage | Example |
|--------|-------|---------|
| `--color-` | All colors | `--color-button-bg-primary` |
| `--spacing-` | Padding, margin, gap, height, width | `--spacing-button-padding` |
| `--text-` | Font sizes only | `--text-button-lg` |
| `--radius-` | Border radius | `--radius-button-sm` |
| `--border-` | Border width | `--border-button-width` |
| `--shadow-` | Box shadows | `--shadow-button-focus` |
| `--opacity-` | Transparency | `--opacity-button-disabled` |

### Required Color Suffixes

| Suffix | Usage | Forbidden |
|--------|-------|-----------|
| `-bg` | Background | `--color-button` |
| `-fg` | Foreground/text | `--color-button-text` |
| `-border` | Border colors | `--color-button-outline` |

### State Suffixes

| Suffix | Usage |
|--------|-------|
| `-hover` | Hover state |
| `-active` | Active/pressed state |
| `-focus` | Focus state |
| `-disabled` | Disabled state |
| `-open` | Open state (expandables) |

### Examples

```css
/* ✅ CORRECT */
--color-button-bg-primary
--color-button-fg-primary-hover
--color-dialog-border-focus
--spacing-accordion-padding-sm
--radius-input-md

/* ❌ WRONG */
--color-btn-primary          /* Use 'button' not 'btn' */
--color-button               /* Missing -bg suffix */
--color-button-text          /* Use -fg not -text */
--button-padding             /* Missing --spacing- prefix */
--color-pc-bg                /* Use 'product-card' not 'pc' */
```

## File Structure

Every token file follows this section order:

```css
/* === 1. LOCAL VARIABLES (Optional) === */
:root {
  --opacity-outlined-hover: 16%;
}

@theme static {
  /* === 2. BASE COLOR MAPPING (Reference Layer) === */
  --color-component-primary: var(--color-primary);
  --color-component-secondary: var(--color-secondary);

  /* === 3. DERIVED COLORS === */
  --color-component-bg-primary: var(--color-component-primary);
  --color-component-fg-primary: var(--color-fg-reverse);
  --color-component-border-primary: var(--color-component-primary);

  /* === 4. STATE VARIATIONS === */
  --color-component-bg-primary-hover: oklch(
    from var(--color-component-bg-primary) calc(l + var(--state-hover)) c h
  );

  /* === 5. COMPONENT VARIANTS (light, outlined, borderless) === */
  --color-component-bg-outlined-primary: transparent;
  --color-component-fg-outlined-primary: var(--color-component-primary);

  /* === 6. VALIDATION STATES === */
  --color-component-border-error: var(--color-danger);
  --color-component-border-success: var(--color-success);

  /* === 7. DISABLED STATES === */
  --opacity-component-disabled: var(--opacity-disabled);

  /* === 8. SPACING === */
  --spacing-component-sm: var(--spacing-150);
  --spacing-component-md: var(--spacing-200);
  --padding-component-sm: var(--spacing-150) var(--spacing-250);

  /* === 9. TYPOGRAPHY === */
  --text-component-sm: var(--text-sm);
  --text-component-md: var(--text-md);

  /* === 10. BORDERS & RADIUS === */
  --border-component-width: var(--border-width-default);
  --radius-component-sm: var(--radius-sm);
  --radius-component-md: var(--radius-md);

  /* === 11. SHADOWS === */
  --shadow-component-default: var(--shadow-sm);
  --shadow-component-focus: var(--shadow-ring);

  /* === 12. FOCUS RINGS === */
  --color-component-ring-focus: var(--color-ring);
}

/* === 13. UTILITIES (Optional) === */
@utility component-custom {
  /* Custom utility definition */
}

/* === 14. ICON TOKENS (Optional) === */
@utility token-icon-component-action {
  @apply icon-[mdi--icon-name];
}
```

## State Calculations

Use OKLCH for automatic state variations:

```css
/* Hover - slightly lighter */
--color-button-bg-primary-hover: oklch(
  from var(--color-button-bg-primary) calc(l + var(--state-hover)) c h
);

/* Active - slightly darker */
--color-button-bg-primary-active: oklch(
  from var(--color-button-bg-primary) calc(l + var(--state-active)) c h
);
```

## Variant Patterns

### Solid (Default)

```css
--color-button-bg-primary: var(--color-button-primary);
--color-button-fg-primary: var(--color-fg-reverse);
```

### Light

```css
--color-button-bg-primary-light: var(--color-primary-light);
--color-button-fg-primary-light: var(--color-primary);
```

### Outlined

```css
--color-button-bg-outlined-primary: transparent;
--color-button-fg-outlined-primary: var(--color-button-primary);
--color-button-border-outlined-primary: var(--color-button-primary);
--color-button-bg-outlined-primary-hover: --alpha(
  var(--color-button-primary) / var(--opacity-outlined-hover)
);
```

### Borderless/Ghost

```css
--color-button-bg-borderless: transparent;
--color-button-fg-borderless: var(--color-fg-primary);
--color-button-bg-borderless-hover: var(--color-fill-hover);
```

## Usage in Components

```typescript
// In .tsx file - use token classes
const buttonVariants = tv({
  variants: {
    variant: {
      primary: 'bg-button-bg-primary text-button-fg-primary hover:bg-button-bg-primary-hover',
      secondary: 'bg-button-bg-secondary text-button-fg-secondary',
      outlined: 'bg-button-bg-outlined-primary text-button-fg-outlined-primary border-button-border-outlined-primary',
    },
    size: {
      sm: 'p-button-sm text-button-sm rounded-button-sm',
      md: 'p-button-md text-button-md rounded-button-md',
    },
  },
})
```

## Anti-Patterns

```css
/* ❌ WRONG - Hardcoded values */
--color-button-bg-primary: #3b82f6;
--spacing-button-padding: 1rem;

/* ✅ CORRECT - Semantic references */
--color-button-bg-primary: var(--color-button-primary);
--spacing-button-padding: var(--spacing-200);

/* ❌ WRONG - Missing reference layer */
--color-button-bg-primary: var(--color-primary);

/* ✅ CORRECT - With reference layer */
--color-button-primary: var(--color-primary);  /* Reference */
--color-button-bg-primary: var(--color-button-primary);  /* Derived */

/* ❌ WRONG - Abbreviations */
--color-btn-bg-primary
--color-dlg-backdrop

/* ✅ CORRECT - Full names */
--color-button-bg-primary
--color-dialog-backdrop
```

## Checklist

Before committing a token file:

- [ ] Uses `@theme static` block
- [ ] Reference layer implemented (themeable)
- [ ] All derived tokens use references
- [ ] All colors have `-bg`, `-fg`, or `-border` suffix
- [ ] No abbreviations in component names
- [ ] No hardcoded color/spacing values
- [ ] Sections in correct order
- [ ] State variations use OKLCH calculations
- [ ] Validation passed: `pnpm validate:tokens`
