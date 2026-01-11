# Web Revolution UI Library – Design System README

Welcome to the Web Revolution UI Library! This guide explains our design system’s fundamentals, folder structure, theming, and customization rules. Follow these guidelines to keep our system consistent, flexible, and easy to maintain.

---

## 1. Overview

Our design system is built with **Tailwind CSS v4** and React. It uses a **multi-layered design token approach** to control all colors, spacing, typography, and other visual aspects. We maintain one shared UI library, and we allow brand-specific customizations via a dedicated `brands` folder inside the library.

**Key Points:**

- **Multi-layered design tokens:** We separate tokens into three layers: global, semantic, and component.
- **Single UI library:** All shared components live in one library (e.g. `ui`).
- **Centralized CSS Variables:** All design tokens (CSS variables) are defined in one central place.
- **Hybrid Structure:** Our UI library is organized into atoms, molecules, and domain-based organisms. Basic components (like buttons) are atoms or molecules; only composite, domain-specific components go into organisms.
- **Clear Boundaries:** For example, a button is an atom or molecule. We never export a button from an organism.

---

## 2. Design Tokens

### Multi-Layered Tokens

1. **Global Tokens:**
    - These are the raw design values (like our base color palette, spacing scales, etc.).
    - They are defined in our central tokens files (e.g. `_colors.css`, `_spacing.css`).
2. **Semantic Tokens:**
    - These give meaning to global tokens by mapping them to their design role.
    - For example, `-color-brand-primary` maps to a global blue value.
    - All components will use semantic tokens rather than raw values.
3. **Component Tokens:**
    - These are defined for each component and act as a layer between the component and semantic tokens.
    - For example, a Button component uses `-button-bg` which is set to `var(--color-brand-primary)`.
    - **Important:** All component tokens are defined centrally, not near the component code.

---

## 3. Folder Structure

Our UI library follows a hybrid approach with three main parts:

### A. Basic Components (Atoms & Molecules)

- **Atoms:**
Small, reusable components such as buttons, inputs, icons, etc.
- **Molecules:**
Simple combinations of atoms like form groups or card headers.

These live in folders such as:

```
ui/atoms/
ui/molecules/

```

### B. Domain-Based Organisms

- **Organisms:**
Larger, composite components that are specific to a business domain (e.g. cart, checkout, navigation).**Note:** Organisms should not export basic building blocks like buttons. If you need a button, use the atom or molecule from the appropriate folder.

Organisms are organized by domain:

```
ui/organisms/cart/
ui/organisms/checkout/
ui/organisms/navigation/

```

### C. Brand Customizations

- **Brands Folder:**
Custom, brand-specific overrides live in a dedicated folder. For example, if a brand needs a special Header, its custom component will live under:
This keeps the shared UI library clean while allowing brands to override only what they need.

    ```
    ui/brands/customer-a/

    ```


> Note: Always use kebab-case for folder and component filenames. For example, use customer-a instead of customerA.
>

---

## 4. Theming and CSS Variables

### Centralized Tokens

- **All CSS Variables:**
We define all our design tokens in one central set of CSS files (e.g. in the `tokens/` directory). Do not scatter token definitions next to component code.
- **Optional Default Theme:**
We support a “default theme” file that you can import if you want to start with predefined values. However, the core system is theme-agnostic: our self-referencing palette contains only semantic tokens. If you want the default look, import the default theme; otherwise, you can define your own theme based on the semantic tokens.
- **Using Tailwind’s `@theme`:**
Our CSS token files use Tailwind’s `@theme` block to generate CSS variables, ensuring consistency with our Tailwind utilities.

### How Overrides Work

- Brand-specific override files (e.g. `ui/brands/customer-a/theme.css`) can override any semantic token.
- In your app’s main CSS, import the global tokens first, then the brand override file. This cascade ensures that the brand’s values override the defaults.

---

## 5. Development Guidelines

### Component Development

- **Use Tokens Exclusively:**
Always use component tokens (e.g. `-button-bg`) in your styles. Do not use semantic tokens directly in component code.
- **Keep It Simple:**
Build your atoms and molecules first. Organisms are domain-specific composites and should use the shared atoms/molecules.
- **Export Only Where Appropriate:**
For example, if a component is basic (like a Button), it belongs in atoms or molecules. Never export a Button from an organism.

### Brand Customizations

- **Custom Components:**
If a customer needs a completely custom component, add it to the `brands/` folder. Do not modify the core shared components.
- **Override Process:**
When overriding, create a file in the brand folder and map the semantic tokens to the custom values. This way, the core remains untouched.

### Documentation

- We use **Storybook** for our component documentation and previews (for now). We may add other documentation tools later.
- Our documentation explains all tokens, component usage, and override guidelines. Please refer to Storybook for live examples and further details.

---

## 6. Quick Reference

- **Design Tokens:**
    - Global Tokens: Defined in `tokens/_*.css` files.
    - Semantic Tokens: Map global tokens to design roles (e.g. `-color-brand-primary`).
    - Component Tokens: Defined centrally; used in component styling (e.g. `-button-bg`).
- **Folder Organization:**
    - **Atoms/Molecules:** `ui/atoms/` and `ui/molecules/`
    - **Organisms:** Domain-based (e.g. `ui/organisms/cart/`)
    - **Brands:** Overrides and customizations (e.g. `ui/brands/customer-a/`)
- **Theming:**

    Import tokens first, then any default or brand-specific theme overrides in your main CSS file.

- **Guidelines:**
    - Always use the token system.
    - Never mix token definitions with component code.
    - Keep overrides in dedicated brand folders.
    - Basic components (e.g., Button) belong only in atoms/molecules.

## 7. Visual Regression Tests (Playwright + Docker)

To keep screenshots stable across machines, run component tests inside Docker.

1. Build Storybook static output (only needed once, or after changes):

```bash
pnpm -C libs/ui build:storybook
```

2. Run Playwright tests in a consistent Linux environment:

```bash
pnpm -C libs/ui test:components:docker
```

3. Update snapshots (inside Docker):

```bash
pnpm -C libs/ui test:components:docker:update
```

Optional environment overrides:
- `TEST_BASE_URL` (default: `http://host.docker.internal:6006`)
- `DOCKER_PLATFORM` (default: `linux/amd64`)
- `PLAYWRIGHT_DOCKER_IMAGE` (default: `new-engine-ui-playwright`)

## 8. Publishing and releases

- Build + publint: `pnpm -C libs/ui build` runs `rsbuild-plugin-publint` after the build; if exports/entrypoints are wrong, this command fails.
- Exports only, no barrel: import from explicit subpaths (e.g. `@techsio/ui-kit/atoms/button`, `@techsio/ui-kit/templates/accordion`, `@techsio/ui-kit/utils`). The package root is intentionally not exported.
- Automated releases: `libs/ui/release.config.mjs` uses semantic-release (tag format `ui-kit-v<version>`) to bump versions, update changelog, and publish to npm. While we are <1.0.0, `BREAKING CHANGE` commits are forced to “minor” bumps to stay in 0.x; remove that release rule when stabilizing for 1.0.0+ to restore SemVer majors.
- Security posture: releases are restricted to GitHub Actions (`GITHUB_ACTIONS` required), npm publishes use provenance (`NPM_CONFIG_PROVENANCE=true`), and tokens live only in Actions secrets (`GH_TOKEN`, `NPM_TOKEN`). Keep secrets in a protected environment for extra safety.
- CI workflow: `.github/workflows/ui-release.yml` builds `libs/ui` and runs semantic-release on `master`/`main` with `GH_TOKEN` and `NPM_TOKEN` secrets.
- Local dry run: `pnpm -C libs/ui semantic-release --dry-run`.
- Commit format: follow Conventional Commits (`feat:`, `fix:`, `chore:`, `BREAKING CHANGE:`) so semantic-release can infer the correct version bump.
- Required CI secrets: `GH_TOKEN` (repo write) and `NPM_TOKEN` (publish).

## 9. Conclusion

This README serves as the single source of truth for building and maintaining our design system. By adhering to these guidelines, you ensure that our UI remains consistent, flexible, and scalable across multiple brands. If you have any questions or suggestions, please reach out to the design system team.
