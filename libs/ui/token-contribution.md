## 🚀 QUICK REFERENCE

### Essential Rules
1. **All colors need suffixes**: `-bg`, `-fg`, `-border` (never just `--color-button`)
2. **Two-layer strategy**: Reference layer → Derived tokens
3. **No abbreviations**: `button` not `btn`, `product-card` not `pc`
4. **Follow the pattern**: `--[prefix]-[component]-[part?]-[property]-[state?]`

### Validation
```bash
pnpm validate:tokens        # Check token naming compliance
pnpm check:unused-tokens    # Find unused tokens
```

### Real Example (Button)
```css
/* Optional: only if needed */
:root {
  --opacity-outlined-hover: 16%;
}

@theme static {
  /* Reference layer first */
  --color-button-primary: var(--color-primary);
  --color-button-secondary: var(--color-secondary);
  
  /* Then derived tokens */
  --color-button-bg-primary: var(--color-button-primary);
  --color-button-fg-primary: var(--color-fg-reverse);
  
  /* Spacing - separate single and composite */
  --spacing-button-sm: var(--spacing-150);
  --padding-button-sm: var(--spacing-150) var(--spacing-250);
}
```

---

🎯 BASIC PRINCIPLES

1. Predictability Over Brevity

- Token names MUST be self-explanatory
- No abbreviations that are not widely known
- Consistency is more important than short names

2. Single Source of Truth

- Each component has a reference layer for theming
- All derived tokens use references
- One token = one responsibility

3. Scalable Architecture

- The pattern must work for 100+ components
- Must support variants, states, themes
- Automated validation rules

---
📋 NAMING CONVENTION AUTHORITY

Mandatory Pattern

--[prefix]-[component]-[part?]-[property]-[state?]

Required Prefixes

| PREFIX     | USAGE                                          | EXAMPLE                   |
|------------|------------------------------------------------|---------------------------|
| --color-   | ALL colors                                     | --color-button-bg-primary |
| --spacing- | Spacing including width/height needing max/min | --spacing-button-padding  |
| --text-    | Font sizes only                                | --text-button-lg          |
| --border-  | Border properties                              | --border-button-width     |
| --radius-  | Border radius                                  | --radius-button-sm        |
| --shadow-  | Box shadows                                    | --shadow-button-focus     |
| --opacity- | Transparency values                            | --opacity-button-disabled |

Required Suffixes for Colors

| SUFFIX    | USAGE                  | FORBIDDEN                 |
|-----------|------------------------|---------------------------|
| -bg       | Background colors      | --color-button ❌          |
| -fg       | Foreground/text colors | --color-button-text ❌     |
| -border   | Border colors          | --color-button-outline ❌  |
| -hover    | Hover states           | --color-button-hovered ❌  |
| -active   | Active states          | --color-button-pressed ❌  |
| -disabled | Disabled states        | --color-button-inactive ❌ |
| -focus    | Focus states           | --color-button-focused ❌  |

Component Naming Rules

/* ✅ CORRECT */
--color-button-bg-primary
--color-accordion-fg-title
--color-product-card-bg

/* ❌ FORBIDDEN */
--color-btn-primary           /* Use 'button' not 'btn' */
--color-pc-bg                 /* Use 'product-card' not 'pc' */
--color-button                /* Missing -bg suffix */
--color-button-text           /* Use -fg not -text */

---
🏗️ MANDATORY FILE STRUCTURE

/* === COMPONENT TOKEN FILE STRUCTURE === */

/* 1. LOCAL VARIABLES (OPTIONAL) */
/* Only when needed for opacity values or complex calculations */
:root {
    --opacity-outlined-hover: 16%;
    --opacity-outlined-active: 12%;
}

/* 2. THEME TOKENS */
@theme static {
    /* === BASE COLOR MAPPING === */
    /* Reference layer - single source of truth for theming */

    /* === DERIVED COLORS === */
    /* Background, foreground, border colors using references */

    /* === STATE VARIATIONS === */
    /* Auto-calculated from derived colors */

    /* === COMPONENT VARIANTS === */
    /* Light, outlined, borderless variants */

    /* === VALIDATION STATES === */
    /* Success, warning, danger states */

    /* === DISABLED STATES === */
    /* Disabled appearance */

    /* === SPACING === */
    /* Padding, margin, gap values */

    /* === TYPOGRAPHY === */
    /* Font sizes and weights */

    /* === BORDERS & RADIUS === */
    /* Border widths and radius values */

    /* === SHADOWS === */
    /* Box shadow definitions */

    /* === FOCUS RINGS === */
    /* Focus ring colors and styles */
}

/* 3. UTILITIES */
/* Component-specific utility classes */
@utility component-variant {
    /* utility definitions */
}

/* 4. SEMANTIC ICON TOKENS */
/* Icon mappings if needed */
@utility token-icon-component-action {
    @apply icon-[mdi--icon-name];
}

---
🎨 COLOR TOKEN ARCHITECTURE

Reference Layer Pattern

/* === BASE COLOR MAPPING === */
/* Reference layer - single source of truth for theming */
--color-component-primary: var(--color-primary);       /* Theme reference */
--color-component-secondary: var(--color-secondary);   /* Theme reference */
--color-component-base: var(--color-surface);          /* Base reference */
--color-component-success: var(--color-success);       /* State reference */
--color-component-warning: var(--color-warning);       /* State reference */
--color-component-danger: var(--color-danger);         /* State reference */

Derived Colors

/* === DERIVED COLORS === */
/* Background colors - using reference layer */
--color-button-bg-primary: var(--color-button-primary);
--color-button-bg-secondary: var(--color-button-secondary);
--color-button-bg-danger: var(--color-button-danger);

/* Foreground colors - can have shared base */
--color-button-fg: var(--color-fg-reverse);  /* Shared base */
--color-button-fg-primary: var(--color-button-fg);
--color-button-fg-secondary: var(--color-button-fg);
--color-button-fg-danger: var(--color-button-fg);

/* Border colors */
--color-button-border-primary: var(--color-button-primary);
--color-button-border-secondary: var(--color-button-secondary);

/* Aliases for special cases */
--color-badge-bg-discount: var(--color-badge-danger); /* Alias */

State Calculations

/* === STATE VARIATIONS === */
/* Auto-calculated using semantic state modifiers */
--color-component-bg-hover: oklch(
    from var(--color-component-bg) calc(l + var(--state-hover)) c h
);
--color-component-bg-primary-hover: oklch(
    from var(--color-component-bg-primary) calc(l + var(--state-hover)) c h
);
--color-component-bg-primary-active: oklch(
    from var(--color-component-bg-primary) calc(l + var(--state-active)) c h
);

---
📏 SPACING & SIZING TOKENS

Spacing Patterns

/* === SPACING === */
/* Single spacing values for uniform padding */
--spacing-button-sm: var(--spacing-150);           /* Small size */
--spacing-button-md: var(--spacing-200);           /* Medium size */
--spacing-button-lg: var(--spacing-250);           /* Large size */

/* Composite padding (vertical horizontal) */
--padding-button-sm: var(--spacing-150) var(--spacing-250);
--padding-button-md: var(--spacing-200) var(--spacing-350);
--padding-button-lg: var(--spacing-250) var(--spacing-450);

/* Simple composite for badges */
--padding-badge: var(--spacing-100) var(--spacing-100);

Typography Tokens

/* === TYPOGRAPHY === */
--text-component-sm: var(--text-sm);                       /* Small text */
--text-component-md: var(--text-md);                       /* Medium text */
--text-component-lg: var(--text-lg);                       /* Large text */
--font-weight-component: var(--font-weight-medium);        /* Font weight */
--font-weight-component-title: var(--font-weight-semibold); /* Title weight */

---
💡 VARIANT PATTERNS

Component Variants

/* === LIGHT VARIANTS === */
--color-component-bg-primary-light: var(--color-primary-light);
--color-component-fg-primary-light: var(--color-fg-reverse);
--color-component-bg-primary-light-hover: oklch(
    from var(--color-component-bg-primary-light) calc(l + var(--state-hover)) c h
);

/* === OUTLINED VARIANTS === */
--color-component-bg-outlined-primary: transparent;
--color-component-fg-outlined-primary: var(--color-component-primary);
--color-component-border-outlined-primary: var(--color-component-primary);
--color-component-bg-outlined-primary-hover: --alpha(
    var(--color-component-primary) / var(--opacity-outlined-hover)
);

/* === BORDERLESS VARIANTS === */
--color-component-bg-borderless: transparent;
--color-component-fg-borderless: var(--color-fg-primary);
--color-component-border-borderless: transparent;
--color-component-bg-borderless-hover: var(--color-fill-hover);

---
🔧 COMPONENT INTEGRATION

Using Tokens in Components

```typescript
// With tailwind-variants (tv) - Real button example
const buttonVariants = tv({
  base: 'transition-colors font-medium',
  variants: {
    variant: {
      primary: 'bg-button-bg-primary text-button-fg-primary hover:bg-button-bg-primary-hover',
      secondary: 'bg-button-bg-secondary text-button-fg-secondary hover:bg-button-bg-secondary-hover',
      outlined: 'bg-transparent border-button-border-primary text-button-fg-outlined-primary'
    },
    size: {
      sm: 'p-button-sm text-button-sm rounded-button-sm',
      md: 'p-button-md text-button-md rounded-button-md',
      lg: 'p-button-lg text-button-lg rounded-button-lg'
    }
  }
})
```

State-Based Styling

```typescript
// Use data attributes for dynamic states
'data-[state=open]:bg-button-bg-open'
'data-[highlighted]:bg-button-bg-hover'
'data-[disabled]:opacity-button-disabled'
'data-[validation=error]:border-button-border-danger'
```

---
🚨 VALIDATION RULES

Mandatory Checks

1. All colors MUST have explicit suffix (-bg, -fg, -border)
2. No abbreviations except universally known (no btn, pc, etc.)
3. Reference layer before derived colors
4. Consistent section ordering
5. No hardcoded values in component tokens (use semantic references)

Forbidden Patterns

/* ❌ FORBIDDEN */
--color-button:                          /* Missing suffix */
--color-btn-primary:                     /* Abbreviation */
--color-button-text:                     /* Use -fg not -text */
--color-button-primary: #3b82f6;         /* Hardcoded value */
--padding-btn-sm:                        /* Use 'button' not 'btn' */
--spacing-component: 1rem;               /* Use semantic token */

/* ✅ CORRECT */
--color-button-bg-primary:               /* Explicit suffix */
--color-button-primary: var(--color-primary); /* Reference layer */
--color-button-fg-primary:               /* Use -fg for text */
--spacing-button-padding: var(--spacing-200); /* Semantic reference */

---
📝 COMMENT CONVENTIONS

Section Headers

/* === SECTION NAME === */

Subsection Headers

/* Subsection description */

Inline Comments

--token-name: value; /* Explanation when needed */

Required Section Order

1. /* === BASE COLOR MAPPING === */
2. /* === DERIVED COLORS === */
3. /* === STATE VARIATIONS === */
4. /* === COMPONENT VARIANTS === */
5. /* === VALIDATION STATES === */
6. /* === DISABLED STATES === */
7. /* === SPACING === */
8. /* === TYPOGRAPHY === */
9. /* === BORDERS & RADIUS === */
10. /* === SHADOWS === */
11. /* === FOCUS RINGS === */