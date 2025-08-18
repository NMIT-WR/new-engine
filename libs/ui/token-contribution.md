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

/* 1. LOCAL VARIABLES */
/* Only for opacity values or complex calculations */
:root {
    --opacity-component-specific: 50%;
    --custom-calculation: calc(var(--spacing-base) * 2);
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

Spacing Naming

/* === SPACING === */
/* Use semantic spacing tokens */
--spacing-component-padding: var(--spacing-250);           /* Generic padding */
--spacing-component-padding-sm: var(--spacing-200);        /* Small variant */
--spacing-component-padding-lg: var(--spacing-350);        /* Large variant */
--spacing-component-gap: var(--spacing-200);               /* Gap between elements */
--spacing-component-margin: var(--spacing-150);            /* External margin */

/* Composite spacing (multiple values) */
--spacing-component-padding-composite: var(--spacing-200) var(--spacing-350);

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