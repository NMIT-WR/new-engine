# CSS Token Reference

## CRITICAL: Token System

N1 uses custom design tokens. NEVER use Tailwind defaults.

---

## Spacing Scale (50-950)

**ALWAYS use numeric scale. NEVER use sm/md/lg.**

| Token | Value | Tailwind Class | Common Use |
|-------|-------|----------------|------------|
| `50` | 2px | `p-50`, `gap-50`, `m-50` | Hairline |
| `100` | 4px | `p-100`, `gap-100` | Micro |
| `150` | 6px | `p-150`, `gap-150` | Tiny |
| `200` | 8px | `p-200`, `gap-200` | Tight spacing |
| `250` | 10px | `p-250`, `gap-250` | Small |
| `300` | 12px | `p-300`, `gap-300` | Compact |
| `350` | 14px | `p-350`, `gap-350` | Default small |
| `400` | 16px | `p-400`, `gap-400` | **Standard padding** |
| `450` | 18px | `p-450`, `gap-450` | Medium |
| `500` | 20px | `p-500`, `gap-500` | **Product grid gap** |
| `550` | 22px | `p-550`, `gap-550` | Large-ish |
| `600` | 24px | `p-600`, `gap-600` | **Section padding** |
| `650` | 28px | `p-650`, `gap-650` | Generous |
| `700` | 32px | `p-700`, `gap-700` | Large |
| `750` | 36px | `p-750`, `gap-750` | Extra large |
| `800` | 40px | `p-800`, `gap-800` | **Section gaps** |
| `850` | 44px | `p-850`, `gap-850` | Huge |
| `900` | 48px | `p-900`, `gap-900` | Massive |
| `950` | 56px | `p-950`, `gap-950` | Maximum |

```typescript
// ✅ CORRECT
className="p-400"              // 16px padding
className="gap-600"            // 24px gap
className="py-300 px-400"      // 12px vertical, 16px horizontal
className="mt-200 mb-400"      // 8px top, 16px bottom

// ❌ WRONG - DOES NOT EXIST
className="p-sm"               // NO!
className="gap-md"             // NO!
className="p-lg"               // NO!
className="gap-4"              // NO! (Tailwind default)
```

---

## Semantic Colors

### Brand Colors

| Token | Tailwind Class | N1 Value | Use |
|-------|----------------|----------|-----|
| `primary` | `bg-primary`, `text-primary` | Yellow #FFE710 | Main brand, CTAs |
| `primary-hover` | `bg-primary-hover` | Darker yellow | Hover state |
| `primary-light` | `bg-primary-light` | Light yellow | Subtle backgrounds |
| `secondary` | `bg-secondary` | Gray #555555 | Secondary actions |
| `tertiary` | `bg-tertiary` | Blue #3498DB | Info, badges |

### Status Colors

| Token | Tailwind Class | Use |
|-------|----------------|-----|
| `success` | `bg-success`, `text-success` | "Skladem", confirmations |
| `success-light` | `bg-success-light` | Success backgrounds |
| `warning` | `bg-warning`, `text-warning` | "Posledni kus", alerts |
| `warning-light` | `bg-warning-light` | Warning backgrounds |
| `danger` | `bg-danger`, `text-danger` | "Akce", errors, sale |
| `danger-light` | `bg-danger-light` | Error backgrounds |
| `info` | `bg-info`, `text-info` | Information, "Novinka" |
| `info-light` | `bg-info-light` | Info backgrounds |

### Text Colors (Foreground)

| Token | Tailwind Class | Value | Use |
|-------|----------------|-------|-----|
| `fg-primary` | `text-fg-primary` | #000000 | Main text |
| `fg-secondary` | `text-fg-secondary` | #444444 | Muted text |
| `fg-tertiary` | `text-fg-tertiary` | #686868 | Subtle text |
| `fg-reverse` | `text-fg-reverse` | #FFFFFF | Text on dark bg |

### Background Colors

| Token | Tailwind Class | Value | Use |
|-------|----------------|-------|-----|
| `base` | `bg-base` | #FFFFFF | Page background |
| `surface` | `bg-surface` | #F6F6F6 | Cards, panels |
| `overlay` | `bg-overlay` | #ADADAD | Modal overlays |
| `float` | `bg-float` | white | Floating elements |
| `highlight` | `bg-highlight` | #2F2F2F | Dark sections |

### Border Colors

| Token | Tailwind Class | Use |
|-------|----------------|-----|
| `border-primary` | `border-border-primary` | Strong borders |
| `border-secondary` | `border-border-secondary` | Default borders |
| `border-tertiary` | `border-border-tertiary` | Subtle borders |

### Disabled State

| Token | Tailwind Class |
|-------|----------------|
| `disabled-bg` | `bg-disabled-bg` |
| `disabled-fg` | `text-disabled-fg` |
| `disabled-border` | `border-disabled-border` |

```typescript
// ✅ CORRECT - Semantic tokens
className="bg-primary text-fg-reverse"        // Yellow bg, white text
className="bg-surface text-fg-primary"        // Gray bg, black text
className="border border-border-secondary"    // Default border
className="bg-success text-fg-reverse"        // Green "Skladem"
className="bg-danger-light text-danger"       // Light red sale badge
className="text-fg-secondary"                 // Muted gray text

// ❌ WRONG - Tailwind defaults DO NOT EXIST
className="bg-gray-100"                       // NO!
className="text-blue-500"                     // NO!
className="border-red-400"                    // NO!
className="bg-slate-200"                      // NO!
```

---

## Typography Scale

| Token | Value | Tailwind Class | Use |
|-------|-------|----------------|-----|
| `3xl` | 1.75rem | `text-3xl` | Hero |
| `2xl` | 1.5rem | `text-2xl` | H1 |
| `xl` | 1.3125rem | `text-xl` | H2 |
| `lg` | 1.125rem | `text-lg` | H3, filter headlines |
| `md` | 1rem | `text-md` | Footer headlines |
| `sm` | 0.9375rem | `text-sm` | Category headlines |
| `xs` | 0.875rem | `text-xs` | **Base text**, menu, prices |
| `2xs` | 0.8125rem | `text-2xs` | Header, badges |
| `3xs` | 0.6875rem | `text-3xs` | Counters |

---

## Radius & Shadows

| Token | Value | Note |
|-------|-------|------|
| `radius-sm` | 0 | No rounding |
| `radius-md` | 2px | Subtle |
| `radius-lg` | 4px | Standard |
| `shadow-sm` | none | N1 minimal style |
| `shadow-md` | subtle | Cards |
| `shadow-lg` | pronounced | Modals |

---

## Common Patterns

```typescript
// Card
className="bg-surface p-400 border border-border-secondary"

// Button Primary
className="bg-primary text-fg-primary p-300 px-400"

// Button Secondary
className="bg-secondary text-fg-reverse p-300 px-400"

// Section
className="py-600 px-400"

// Product Grid
className="grid gap-500"

// Badge Success
className="bg-success-light text-success text-2xs px-200 py-50"

// Badge Sale
className="bg-danger text-fg-reverse text-2xs px-200 py-50"

// Form Input
className="border border-border-secondary p-300 text-fg-primary"

// Muted Text
className="text-fg-secondary text-sm"
```

---

## Token Files Reference

- **Spacing:** `src/tokens/_n1-spacing.css`
- **Semantic:** `src/tokens/_n1-semantic.css`
- **Overrides:** `src/tokens/_n1shop-overrides.css`
- **Components:** `src/tokens/_n1-components.css`
- **Typography:** `src/tokens/_n1-typography.css`
