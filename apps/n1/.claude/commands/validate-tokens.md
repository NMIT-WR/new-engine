# Token Validator

Validate CSS token files in $ARGUMENTS against the UI library's mandatory standards, Tailwind v4 theme requirements, and established naming conventions.

## Task

I'll perform comprehensive validation of CSS token files by analyzing them against multiple authoritative sources:

1. **CLAUDE.md** token rules and mandatory patterns
2. **tokens-contribution.md** for structure and organization standards
3. **Tailwind v4 documentation** for @theme blocks and namespace compliance
4. **Reference implementations** (`_button.css`, `_badge.css`) as proven patterns
5. **Consistency validation** across all token definitions

## Process

I'll follow these steps:

1. **Load All Configuration Sources**
   - Read CLAUDE.md token system rules from project root
   - Parse tokens-contribution.md for structure requirements
   - Extract Tailwind v4 theme namespace rules (https://tailwindcss.com/docs/theme#theme-variable-namespaces)
   - Load reference implementations (`_button.css`, `_badge.css`)
   - Build unified validation criteria from all sources

2. **File Discovery and Analysis**
   - Locate target CSS files in token directory structure
   - Read and parse token file contents
   - Identify component type from file location (atoms/molecules)
   - Map existing token structure against all validation sources

3. **Multi-Source Structure Validation**
   - **From CLAUDE.md**: Check mandatory token file structure
   - **From tokens-contribution.md**: Verify section ordering and comments
   - **From Tailwind v4**: Validate `@theme static` vs `@theme` usage
   - **Consistency check**: Ensure uniform formatting across all tokens

4. **Tailwind v4 Namespace Compliance**
   - Validate CSS variable namespace mapping (--color-* → bg-*/text-*/border-*)
   - Check proper @theme block scoping
   - Verify token-to-utility generation compatibility
   - Validate OKLCH color space usage and --alpha() functions

5. **Naming Convention Compliance (from CLAUDE.md)**
   - Validate token naming against mandatory patterns
   - Check required prefixes (--color-, --spacing-, --text-, etc.)
   - Verify mandatory color suffixes (-bg, -fg, -border, never -text)
   - Ensure proper ordering (-bg-primary, not -primary-bg)

6. **Reference Layer Analysis (from contribution docs)**
   - Verify two-layer token strategy implementation
   - Check BASE COLOR MAPPING section presence
   - Validate DERIVED COLORS use reference layer
   - Ensure theming capability through reference layer

7. **Section Order Validation (from tokens-contribution.md)**
   - Verify exact section ordering compliance
   - Check for all required section comments
   - Validate consistent comment formatting (/* === SECTION === */)
   - Ensure no sections are out of order or missing

8. **Consistency Analysis**
   - Compare against `_button.css` and `_badge.css` patterns
   - Check for consistent value formats (var() references, not direct values)
   - Validate state calculation consistency (OKLCH for colors)
   - Ensure spacing and typography follow semantic tokens

9. **Comprehensive Compliance Reporting**
   - Report validation against each source (CLAUDE.md, contribution, Tailwind)
   - Provide specific line numbers and violation examples
   - Show correct patterns from reference files
   - Generate prioritized fix recommendations

## Validation Sources

### 📚 CLAUDE.md Rules
- Token System Rules (MANDATORY section)
- Token File Structure requirements
- Naming Convention Authority patterns
- Two-Layer Token Strategy
- Required prefixes and suffixes
- Component naming rules (no abbreviations)

### 📋 tokens-contribution.md Standards
- Exact section ordering (1-10 sections in specific order)
- Section comment formatting (/* === SECTION === */)
- Consistency in value formats
- Reference layer requirements
- State calculation patterns

### 🎨 Tailwind v4 Documentation
- @theme static vs @theme usage
- CSS variable namespace mapping:
  - `--color-*` → `bg-*`, `text-*`, `border-*`
  - `--spacing-*` → `p-*`, `m-*`, `gap-*`, `w-*`, `h-*`
  - `--radius-*` → `rounded-*`
  - `--text-*` → `text-*` (font sizes)
- Proper scoping and utility generation
- OKLCH color space support

### 🔧 Reference Files (_button.css, _badge.css)
- Proven patterns and implementations
- Complete token coverage examples
- State variation implementations
- Component variant strategies

## Validation Categories

### 1. Mandatory Structure Compliance (from CLAUDE.md + contribution)

#### Required File Structure
```css
/* ✅ REQUIRED: Root variables (calculations only) */
:root {
  --opacity-component-specific: 50%;
}

/* ✅ REQUIRED: @theme static block */
@theme static {
  /* === BASE COLOR MAPPING === */
  /* Reference layer comments required */
  
  /* === DERIVED COLORS === */
  /* Usage token comments required */
  
  /* === STATE VARIATIONS === */
  /* State calculations required */
  
  /* === COMPONENT VARIANTS === */
  /* Variant tokens if applicable */
  
  /* === VALIDATION STATES === */
  /* Error/success states if applicable */
  
  /* === DISABLED STATES === */
  /* Disabled tokens required */
  
  /* === SPACING === */
  /* Spacing tokens required */
  
  /* === TYPOGRAPHY === */
  /* Text tokens if applicable */
  
  /* === BORDERS & RADIUS === */
  /* Border tokens if applicable */
  
  /* === FOCUS RINGS === */
  /* Focus tokens if applicable */
}
```

#### Section Validation Rules
- [ ] **Root Variables**: Only opacity and calculation values
- [ ] **@theme static**: All token definitions in single block
- [ ] **Section Comments**: Proper `=== SECTION ===` format
- [ ] **Section Order**: Follows mandatory organization
- [ ] **Comment Completeness**: All sections have descriptive comments

### 2. Naming Convention Validation

#### Token Pattern Validation
**Required Format**: `--[prefix]-[component]-[part?]-[property]-[state?]`

#### Required Prefixes
- [ ] **--color-**: ALL color tokens (never without suffix)
- [ ] **--spacing-**: All spacing properties including width/height needing max/min
- [ ] **--text-**: Font sizes only (must map to Tailwind text sizes)
- [ ] **--border-**: Border width, style, color properties
- [ ] **--radius-**: Border radius values
- [ ] **--shadow-**: Box shadow definitions
- [ ] **--opacity-**: Transparency values

#### Mandatory Color Suffixes
- [ ] **-bg**: Background colors (MANDATORY - never `--color-component`)
- [ ] **-fg**: Foreground/text colors (never `-text`)
- [ ] **-border**: Border colors
- [ ] **-hover**: Hover state colors
- [ ] **-active**: Active state colors
- [ ] **-disabled**: Disabled state colors

#### Common Violation Patterns
```css
/* ❌ VIOLATIONS */
--color-component              /* Missing -bg suffix */
--color-btn-primary           /* Use 'button' not 'btn' */
--color-component-text        /* Use -fg not -text */
--color-component-primary-bg  /* Wrong order - should be -bg-primary */
--layout-component-width      /* Use --spacing- or --width- */
--component-specific-token    /* Missing proper prefix */

/* ✅ CORRECT */
--color-component-bg-primary  /* Proper background token */
--color-component-fg-secondary /* Proper foreground token */
--color-component-border-hover /* Proper border with state */
--spacing-component-padding   /* Proper spacing token */
```

### 3. Reference Layer Validation

#### Two-Layer Strategy Compliance
```css
/* ✅ REQUIRED: Reference layer */
/* === BASE COLOR MAPPING === */
--color-component-primary: var(--color-primary);
--color-component-secondary: var(--color-secondary);

/* ✅ REQUIRED: Derived layer */
/* === DERIVED COLORS === */
--color-component-bg-primary: var(--color-component-primary);
--color-component-fg-primary: var(--color-fg-reverse);
```

#### Reference Layer Validation Rules
- [ ] **Reference tokens exist**: Base color mappings to semantic tokens
- [ ] **Derived tokens use reference**: No direct semantic token usage in derived layer
- [ ] **Theming capability**: Easy one-line theme changes possible
- [ ] **Consistent mapping**: All reference tokens properly mapped

### 4. State Variation Validation

#### Required State Calculations
```css
/* ✅ REQUIRED: OKLCH calculations for states */
--color-component-bg-primary-hover: oklch(
  from var(--color-component-primary) calc(l + var(--state-hover)) c h
);

/* ✅ REQUIRED: Alpha calculations for outlined */
--color-component-bg-outlined-hover: --alpha(
  var(--color-component-primary) / var(--opacity-outlined-hover)
);
```

#### State Validation Rules
- [ ] **Hover states**: All interactive tokens have hover variants
- [ ] **Active states**: All interactive tokens have active variants
- [ ] **OKLCH usage**: Color calculations use modern OKLCH function
- [ ] **Alpha variants**: Outlined/transparent variants use --alpha()
- [ ] **State completeness**: All variants have proper state coverage

### 5. Component Variant Validation

#### Required Variant Categories
Based on `_button.css` reference patterns:

- [ ] **Primary variant**: Default component styling
- [ ] **Secondary variant**: Alternative styling option
- [ ] **Light variants**: Subtle background versions
- [ ] **Outlined variants**: Border-only with transparent backgrounds
- [ ] **Borderless variants**: Minimal styling for subtle actions

#### Variant Validation Rules
- [ ] **Complete coverage**: All variants have bg, fg, border tokens
- [ ] **State consistency**: All variants have hover/active states
- [ ] **Naming consistency**: Variant naming follows established patterns
- [ ] **Visual hierarchy**: Variants provide clear visual differentiation

### 6. Token Completeness Analysis

#### Mandatory Token Categories
- [ ] **Colors**: Background, foreground, border colors for all variants
- [ ] **States**: Hover, active, disabled states for interactive elements
- [ ] **Spacing**: Padding, margins, gaps appropriate for component
- [ ] **Typography**: Text sizes if component contains text
- [ ] **Borders**: Border radius, width if component has borders
- [ ] **Focus**: Focus ring colors for interactive components

#### Component-Specific Requirements

**Interactive Components** (buttons, inputs, links):
- [ ] **Focus rings**: Proper focus indication
- [ ] **Disabled states**: Complete disabled styling
- [ ] **State feedback**: Clear hover/active feedback

**Container Components** (cards, panels, modals):
- [ ] **Background variants**: Light/dark theming support
- [ ] **Border variants**: Optional border styling
- [ ] **Shadow variants**: Elevation indication if applicable

**Text Components** (headings, labels, descriptions):
- [ ] **Typography scales**: Multiple size variants
- [ ] **Color variants**: Primary, secondary, muted text colors
- [ ] **State colors**: Error, success, warning text colors

## Validation Reporting

### Report Structure
```markdown
# Token Validation Report: [component-name]

## Overall Compliance: [PASS/FAIL] ([X]/[Y] checks passed)

## Source-Specific Validation Results

### 📚 CLAUDE.md Compliance
✅ Token file structure follows mandatory format
✅ Two-layer token strategy implemented
❌ Naming convention violations found (3 issues)
❌ Missing required color suffixes (2 tokens)

### 📋 tokens-contribution.md Compliance  
✅ Section comments properly formatted
❌ Section ordering incorrect (STATE VARIATIONS before DERIVED COLORS)
❌ Missing required section: COMPONENT VARIANTS
✅ Reference layer properly implemented

### 🎨 Tailwind v4 Theme Compliance
✅ @theme static block properly used
✅ CSS variable namespaces correct for utility generation
❌ Direct color values used instead of var() (line 45)
⚠️ --size-tooltip-width won't map to utility (use --spacing-*)

### 🔧 Reference Files Comparison
- vs _button.css: 75% pattern compliance
- vs _badge.css: 85% pattern compliance
- Missing patterns: outlined variants, state calculations

## Detailed Issues

### ❌ Critical Issues (Must Fix)
1. **Section Order Violation** (tokens-contribution.md)
   - Line 35: STATE VARIATIONS appears before DERIVED COLORS
   - Fix: Move STATE VARIATIONS section after DERIVED COLORS

2. **Naming Convention Violations** (CLAUDE.md)
   - Line 12: `--color-tooltip` missing -bg suffix
   - Line 18: `--color-tooltip-text` should use -fg not -text
   - Line 24: `--color-tooltip-primary-bg` wrong order, should be -bg-primary

3. **Tailwind Namespace Issue** (Tailwind v4 docs)
   - Line 48: `--size-tooltip-width` won't generate utilities
   - Fix: Use `--spacing-tooltip-width` or `--width-tooltip`

### ⚠️ Warnings (Should Fix)
1. **Consistency Issues**
   - Line 45: Using direct color `#1a1a1a` instead of var()
   - Line 52: RGB format inconsistent with OKLCH usage

2. **Missing Sections** (tokens-contribution.md)
   - COMPONENT VARIANTS section not present
   - STATE VARIATIONS incomplete

### 📊 Compliance Scores
- CLAUDE.md compliance: 70%
- tokens-contribution.md: 65%
- Tailwind v4 compatibility: 85%
- Reference pattern match: 80%

### 🎯 Recommendations
1. Study `_button.css` for complete state implementation
2. Add missing hover/active states using OKLCH calculations
3. Implement outlined variant with alpha-based backgrounds
4. Consider adding light variants for better theming support

### 📋 Next Steps
1. Run `/refactor-token [file-path]` to auto-fix issues
2. Verify fixes with another validation run
3. Update component implementation to use new tokens
4. Test component in Storybook with all variants
```

### Comparison Analysis
I'll compare against reference implementations:

**Reference File Analysis**:
- **_button.css**: 95+ tokens, complete variant coverage, perfect structure
- **_badge.css**: Simpler implementation, good for basic components
- **Target file**: [Analysis of compliance gaps]

**Best Practice Recommendations**:
- Follow `_button.css` patterns for complex interactive components
- Use `_badge.css` patterns for simple display components
- Ensure all interactive elements have complete state coverage
- Implement proper reference layer for easy theming

## Batch Validation

### Multiple File Validation
I can validate multiple files simultaneously:
```bash
# Validate specific directory
/validate-tokens src/tokens/components/atoms/

# Validate specific files
/validate-tokens _button.css _badge.css _input.css

# Validate all token files
/validate-tokens src/tokens/components/
```

### Summary Reporting
For batch validation, I'll provide:
- Overall compliance summary across all files
- Most common violations and patterns
- Best and worst performing files
- Recommended priority fixes
- Standards compliance trending

I'll provide actionable validation reports that help maintain high-quality token implementations across your UI library.