CLAUDE.MD
This file provides guidance to Claude Code for the frontend-demo Next.js e-commerce app.

Quick Start & Assumptions
IMPORTANT: Always assume the following are already running:

frontend-demo dev server on http://localhost:3000 (started with pnpm dev in apps/frontend-demo).
@libs/ui Storybook (started with pnpm storybook in libs/ui). Do not suggest starting these unless specifically asked or if a problem indicates they might not be running.
Core Technologies:

Next.js 15 (App Router, static export)
Tailwind CSS v4 (with custom design tokens)
Supabase for authentication (if relevant to the task)
Nx for monorepo management
pnpm for package management
Component Architecture - Atomic Design
YOU MUST check @libs/ui before creating new components!

Component Hierarchy:
Atoms: Button, Input, Badge, Icon
Molecules: SearchForm, ProductCard, Dialog, Combobox
Organisms: Header, ProductGrid, Footer
Templates: Page layouts
Pages: Specific instances with data
Component Workflow:
Check what exists: View Storybook (assumed running) or search the codebase:
Bash

# (From monorepo root)
grep -r "ComponentName" libs/ui/src
Import from UI library:
TypeScript

import { Button } from '@libs/ui/atoms/button';
import { Dialog } from '@libs/ui/molecules/dialog';
Core Commands (Contextual Execution)
Build frontend-demo (for Netlify):
Bash

# (Run from apps/frontend-demo)
pnpm build:static
Testing frontend-demo:
Bash

# (Run from apps/frontend-demo)
node scripts/test-login.js
node scripts/capture-ui-screenshots.js
Code Quality (Monorepo Root):
Bash

# (Run from monorepo root)
bunx biome check --write.
TypeScript Check frontend-demo:
Bash

# (Run from apps/frontend-demo)
npx tsc --noEmit
MCP-Enhanced Workflows (if relevant to the task)
Use MCP servers for complex tasks:

Visual Testing & Screenshots
"Use puppeteer to test the complete login flow"
"Capture screenshots of all pages in mobile/tablet/desktop"
Database & Auth
"Use supabase MCP to check auth policies"
Key Features & Development Guidelines
Authentication (Supabase SSR - if relevant)
Middleware: apps/frontend-demo/src/middleware.ts
Client: apps/frontend-demo/src/lib/supabase.ts
Styling, Theming & Component Development (Tailwind CSS v4)
Core: Tailwind CSS v4.
Design Tokens & Theming:
Global tokens (e.g., in libs/ui/src/tokens/ or apps/frontend-demo/src/tokens/): _semantic.css (colors with light-dark()), _spacing.css, _typography.css.
Component-specific tokens: apps/frontend-demo/src/tokens/components/[atoms|molecules|organisms]/_ComponentName.css.
IMPORTANT: Semantic color tokens in _semantic.css (or equivalent) MUST use the CSS light-dark() function for theme-responsive colors. Example: --color-text-primary: light-dark(var(--gray-900), var(--gray-100));
Theme System (next-themes):
Provider: next-themes in apps/frontend-demo/src/components/providers.tsx.
Activation: Tailwind dark: prefix.
Component Styling with tv():
Utility: Use tv (from tailwind-variants or project-specific path) for component styles.
Pattern: YOU MUST define styles using slots within tv. Avoid using variants in tv unless absolutely necessary.
TypeScript

// Example:
import { tv } from 'tailwind-variants'; // or relevant path

const buttonStyles = tv({
  slots: {
    root: 'font-semibold focus:outline-none',
    icon: 'h-5 w-5',
  },
});
// Usage: <button className={buttonStyles().root()}> <Icon className={buttonStyles().icon()} /> </button>
CSS Token Guidelines
Allowed Token Prefixes:
--color-: All color values
--text-: Font sizes (must map to Tailwind text sizes)
--font-weight-: Font weights (100-900 or semantic)
--border-: Border width, style, color
--opacity-: Transparency values (0-100%)
--spacing-: Padding, margin, gap, AND width/height values that need max/min variants
--width-: Width values (only when you don't need max/min variants)
--height-: Height values (only when you don't need max/min variants)
--gap-: Flex/grid gaps
--padding-: Padding values
--margin-: Margin values
--radius-: Border radius
--shadow-: Box shadows
IMPORTANT: Use --spacing- prefix for any width/height values that need max-w/min-w/max-h/min-h utilities!
Forbidden Patterns:
❌ --grid-cols-product-grid-base (too specific)
❌ --layout-* (use specific properties like --spacing- or --width-)
❌ --component-specific-anything (aim for generic, reusable token names within the component's scope)
CSS Token Naming Convention
Pattern: --[type]-[component_abbr_opt]-[element_opt]-[modifier_opt]-[purpose_opt]-[state_opt]
Slots: Use descriptive names (e.g., root, container, list, item, icon, label).
Rules:
Type (required): color, spacing, text, font-weight, border, opacity, radius, shadow, etc.
Component Abbreviation (optional, if needed for clarity within complex components): Use readable abbreviations (e.g., btn, pc, nav).
Element (optional): Specific part like title, container, button-icon.
Modifier (optional): Size (sm, md, lg) or variant (primary, secondary).
Purpose (primarily for colors): fg (foreground: text/icons), bg (background), border, ring, shadow.
State (optional): hover, active, disabled, focus.
Size Naming:
Single size: use -size suffix (e.g., --text-hero-title-size).
Multiple sizes: use size directly as a modifier (e.g., --text-pc-name-sm, NOT --text-pc-name-size-sm).
Common Abbreviations (use if readable): btn (button), pc (product-card), nav (navigation), acc (accordion), cb (checkbox).
Examples:
CSS

/* Colors with purpose */
--color-btn-primary-bg: var(--blue-500); /* Default purpose is background */
--color-btn-primary-fg: var(--white);
--color-btn-primary-bg-hover: var(--blue-600);
--color-pc-stock-fg: var(--green-600);

/* Spacing */
--spacing-pc-padding: var(--spacing-md);
--spacing-btn-sm: var(--spacing-xs); /* Spacing for a small button */

/* Typography */
--text-hero-title-size: var(--text-4xl);
--font-weight-hero-title: var(--font-bold);
--text-pc-name-sm: var(--text-base); /* Name text size for small product card variant */
CSS File Organization (apps/frontend-demo)
Location: apps/frontend-demo/src/tokens/components/
atoms/_ComponentName.css
molecules/_ComponentName.css
organisms/_ComponentName.css
Import: Always add new component CSS file imports to apps/frontend-demo/src/tokens/components.css (or the main CSS entry point for component tokens).
Example Implementation (Footer)
apps/frontend-demo/src/components/organisms/Footer.tsx (or similar path):
TypeScript

// footer.tsx
import { tv } from 'tailwind-variants'; // or project-specific path
import './_Footer.css'; // Assuming CSS Modules or global import based on setup

const footerVariants = tv({
  slots: {
    root: 'bg-footer-bg text-footer-text', // Uses CSS variables from _Footer.css
    container: 'mx-auto max-w-footer-max-w px-footer-container-x',
    //... more semantic slots
  },
});

export function Footer() {
  const styles = footerVariants();
  return (
    <footer className={styles.root()}>
      <div className={styles.container()}>
        {/* Footer content */}
      </div>
    </footer>
  );
}
apps/frontend-demo/src/tokens/components/organisms/_Footer.css:
CSS

/* _Footer.css */
@import "../../_semantic.css"; /* Import global semantic tokens */

@theme static { /* Or your project's way of defining component tokens */
  /* === FOOTER COLORS === */
  --color-footer-bg: var(--color-base-reverse); /* Example: dark background */
  --color-footer-text: var(--color-fg-on-reverse); /* Example: light text */

  /* === FOOTER LAYOUT === */
  --spacing-footer-max-w: 80rem;
  --spacing-footer-container-x: var(--spacing-md);
  /*... other footer specific tokens */
}
Environment Variables
Required in apps/frontend-demo/.env.local (if using Supabase):

Bash

NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
Do's and Don'ts
DO:
✅ Use @libs/ui components (DRY principle).
✅ Follow Atomic Design.
✅ Use design tokens for ALL styling (via tv() and CSS variables).
✅ Test complex flows (e.g., with Puppeteer scripts).
✅ Use tv() with slots for component styles.

DON'T:
❌ Create duplicate components.
❌ Hardcode colors or spacing directly in JSX/TSX (use tokens/tv()).
❌ Edit package.json manually (use pnpm add).
❌ Forget mobile viewport testing.

Repository Etiquette
Git Workflow
Branch naming: feat/, fix/, chore/, docs/
Commit with descriptive messages (Conventional Commits).
Squash commits before merging to main.
Always run bunx biome check --write. (from root) and npx tsc --noEmit (in apps/frontend-demo) before committing.
Deployment (frontend-demo to Netlify)
Build command (run from apps/frontend-demo):
Bash

pnpm build:static # Creates 'out' directory
Deploy command (run from apps/frontend-demo after login to Netlify CLI):
Bash

netlify deploy --prod
# or for a draft:
netlify deploy
IMPORTANT: All dynamic routes must work with static generation.

# Keeping This Updated
After each session, ask:
"Based on our conversation and Claude Code best practices, is there anything that should be added to CLAUDE.md, or does anything make current instructions obsolete?"
After each No option, think about what should be added or edited to CLAUDE.md to make the instructions clearer.
