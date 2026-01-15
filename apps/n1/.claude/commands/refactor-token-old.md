# Refactor Token

Refactor CSS token files in $ARGUMENTS to follow the UI library's mandatory token structure and naming conventions.

## Task

I'll analyze and refactor CSS token files to comply with the UI library standards including:

1. Mandatory token file structure with proper section organization
2. Two-layer token strategy (reference + derived colors)
3. Proper naming conventions with required prefixes and suffixes
4. State variations and component variants implementation
5. Validation against existing reference implementations

## Process

I'll follow these steps:

1. **File Discovery and Reading**
   - Locate target CSS file in token directory structure
   - Read current token file content and analyze structure
   - Identify component type (atom/molecule) from file path

2. **Standards Research**
   - Study UI library documentation (`CLAUDE.md`, `token-contribution.md`)
   - Analyze reference implementations (`_button.css`, `_badge.css`)
   - Extract mandatory patterns and validation rules

3. **Current Structure Analysis**
   - Map existing tokens to standard naming convention
   - Identify missing mandatory sections
   - Document naming violations and structural issues
   - Assess completeness of token coverage

4. **Refactoring Transformation**
   - Implement reference layer for themeable properties
   - Restructure tokens into mandatory sections with proper comments
   - Apply naming convention fixes and add missing suffixes
   - Generate state variations using OKLCH calculations
   - Add component variants and validation states

5. **Quality Validation**
   - Verify all mandatory sections are present and properly ordered
   - Check naming convention compliance
   - Ensure reference layer is properly implemented
   - Validate CSS syntax and token references

6. **File Generation and Reporting**
   - Generate refactored file with improved structure
   - Create detailed transformation report
   - Provide before/after comparison
   - Document new capabilities and usage patterns

## Token Structure Analysis

### Mandatory File Structure
I'll ensure the refactored file follows this exact structure:

1. **Root Variables**: Opacity values and calculations only
2. **@theme static block** containing:
   - BASE COLOR MAPPING (reference layer)
   - DERIVED COLORS (actual usage tokens)
   - STATE VARIATIONS (hover, active, disabled)
   - COMPONENT VARIANTS (light, outlined, etc.)
   - VALIDATION STATES (danger, success)
   - SPACING (padding, gap, margins)
   - TYPOGRAPHY (font sizes)
   - BORDERS & RADIUS
   - FOCUS RINGS

### Naming Convention Validation
I'll enforce these mandatory patterns:

**Required Format**: `--[prefix]-[component]-[part?]-[property]-[state?]`

**Required Prefixes**:
- `--color-`: ALL colors (never without suffix)
- `--spacing-`: All spacing properties
- `--text-`: Font sizes only
- `--border-`: Border properties
- `--radius-`: Border radius values
- `--shadow-`: Box shadow definitions
- `--opacity-`: Transparency values

**Mandatory Color Suffixes**:
- `-bg`: Background colors (REQUIRED)
- `-fg`: Foreground/text colors (not `-text`)
- `-border`: Border colors
- `-hover`: Hover state colors
- `-active`: Active state colors
- `-disabled`: Disabled state colors

## Reference Layer Implementation

### Two-Layer Token Strategy
I'll implement the mandatory reference + derived pattern:

```css
/* === BASE COLOR MAPPING === */
/* Reference layer - single source of truth */
--color-component-primary: var(--color-primary);
--color-component-secondary: var(--color-secondary);
--color-component-base: var(--color-surface);

/* === DERIVED COLORS === */
/* Actual usage tokens */
--color-component-bg-primary: var(--color-component-primary);
--color-component-fg-primary: var(--color-fg-reverse);
```

### State Variation Generation
I'll create proper state variations using OKLCH calculations:

```css
/* === STATE VARIATIONS === */
--color-component-bg-hover: oklch(from var(--color-component-bg) calc(l + var(--state-hover)) c h);
--color-component-bg-primary-hover: oklch(from var(--color-component-bg-primary) calc(l + var(--state-hover)) c h);
```

## Validation Rules

### Token Naming Validation
I'll check and fix these common violations:

**❌ Forbidden Patterns**:
- `--color-component` (missing -bg suffix)
- `--color-btn-primary` (use 'button' not 'btn')
- `--color-component-text` (use -fg not -text)
- `--color-component-primary-bg` (wrong order)

**✅ Correct Patterns**:
- `--color-component-bg-primary`
- `--color-component-fg-secondary`
- `--color-component-border-hover`

### Structure Validation
I'll ensure proper section organization:
1. Comments for each major section
2. Logical grouping of related tokens
3. Consistent spacing and formatting
4. Proper CSS custom property syntax

## Reference File Analysis

I'll study these reference implementations:
- `src/tokens/components/atoms/_button.css`: Complete atomic component example with proper structure
- `src/tokens/components/atoms/_badge.css`: Simple component with variants
- `src/tokens/_semantic.css`: Base semantic token definitions
- `token-contribution.md`: Comprehensive contribution guidelines and validation rules
- `CLAUDE.md`: Architecture patterns and naming conventions

### Example: Properly Structured _button.css Analysis
The reference file demonstrates:
- ✅ Reference layer: `--color-button-primary: var(--color-primary);`
- ✅ Derived tokens: `--color-button-bg-primary: var(--color-button-primary);`
- ✅ State calculations: `oklch(from var(--color-button-primary) calc(l + var(--state-hover)) c h)`
- ✅ Complete section organization with proper comments
- ✅ Alpha-based opacity for outlined variants
- ✅ Comprehensive variant coverage (light, outlined, borderless)

### Common Issues Found in _icon.css
- ❌ Missing reference layer for themeable properties
- ❌ Limited to typography tokens only
- ❌ No color tokens for icon theming
- ❌ Missing proper section structure
- ❌ No state variations or component variants

## Common Refactoring Transformations

### Token Renaming Examples
- Convert abbreviations: `--color-btn-primary` → `--color-button-bg-primary`
- Add missing suffixes: `--color-button` → `--color-button-bg-primary`
- Fix ordering: `--color-button-primary-bg` → `--color-button-bg-primary`
- Standardize parts: `--color-product-card-title-text` → `--color-product-card-fg-title`

### Structure Reorganization
- **Add reference layer**:
  ```css
  /* === BASE COLOR MAPPING === */
  --color-icon-primary: var(--color-primary);
  --color-icon-secondary: var(--color-secondary);
  ```
- **Create derived tokens**:
  ```css
  /* === DERIVED COLORS === */
  --color-icon-fg-primary: var(--color-icon-primary);
  --color-icon-fg-secondary: var(--color-icon-secondary);
  ```
- **Implement state variations**:
  ```css
  /* === STATE VARIATIONS === */
  --color-icon-fg-primary-hover: oklch(
    from var(--color-icon-fg-primary) calc(l + var(--state-hover)) c h
  );
  ```

### Missing Token Generation
- **Icon-specific tokens**:
  - `--color-icon-fg-danger` for error states
  - `--color-icon-fg-success` for success indicators
  - `--color-icon-fg-disabled` for disabled states
- **Sizing tokens**: Already present but ensure completeness
- **Component variant tokens** for different contexts
- **Focus and interaction states** for interactive icons

## Quality Assurance

### Final Validation Checklist
- [ ] All sections present in mandatory order
- [ ] Reference layer implemented for themeable properties
- [ ] All color tokens have explicit suffixes
- [ ] State variations use OKLCH calculations
- [ ] Component variants properly structured
- [ ] No forbidden naming patterns
- [ ] Consistent formatting and spacing
- [ ] Valid CSS custom property syntax

### Compliance Reporting
I'll provide a detailed report including:
- **Refactoring Summary**:
  - Number of tokens renamed/restructured
  - Naming convention violations fixed
  - Missing sections added
  - Reference layer mappings created
- **Before/After Comparison**:
  - Structure improvements
  - Token count changes
  - New capabilities added
- **Validation Results**:
  - ✅ All mandatory sections present
  - ✅ Proper naming conventions followed
  - ✅ Reference layer implemented
  - ✅ State variations complete
- **Usage Impact**:
  - New Tailwind classes available
  - Component theming capabilities
  - Migration notes for existing usage

### File Path Handling
I'll automatically detect:
- Full paths: `/home/user/project/src/tokens/components/atoms/_icon.css`
- Relative paths: `src/tokens/components/atoms/_icon.css`
- Short names: `_icon.css` (will search in standard token directories)
- Component type: Determine atoms vs molecules from file location

I'll adapt to your specific component needs while ensuring strict compliance with the UI library standards.