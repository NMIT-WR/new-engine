# Token Refactor Analyzer

Analyze CSS token files in $ARGUMENTS for consistency and adherence to project standards, providing detailed recommendations without automatically implementing changes.

## Task

I'll analyze CSS token files against established guidelines and provide comprehensive recommendations including:

1. Study reference materials (CLAUDE.md, token-contribution.md, Tailwind docs)
2. Analyze target file against mandatory structure and naming conventions
3. Identify violations and inconsistencies
4. Provide detailed report with specific recommendations
5. Offer to implement changes only after user review and approval

## Process

I'll follow these steps:

1. **Reference Material Study**
   - Read project CLAUDE.md for token system rules
   - Study token-contribution.md guidelines
   - Fetch Tailwind CSS theme documentation for best practices
   - Understand mandatory token file structure patterns

2. **File Analysis**
   - Parse target CSS token file structure
   - Validate naming conventions against prefix-component-part-property-state pattern
   - Check for required prefixes (--color-, --spacing-, --text-, etc.)
   - Verify color suffix requirements (-bg, -fg, -border)
   - Assess two-layer token strategy implementation

3. **Compliance Assessment**
   - Compare against mandatory section order
   - Validate reference layer for theming
   - Check for forbidden patterns and naming violations
   - Identify missing or incorrectly structured sections

4. **Recommendation Generation**
   - Create detailed violation reports with explanations
   - Provide correct implementation examples
   - Suggest specific fixes for each identified issue
   - Prioritize changes by impact and importance

## Analysis Categories

### Token File Structure Validation
- Mandatory section order compliance (:root, @theme static with ordered sections)
- CSS custom property organization
- @theme static block structure
- Comment section presence and formatting

### Naming Convention Assessment
- Prefix consistency (--color-, --spacing-, --text-, --border-, --radius-)
- Component name alignment with filename
- Required color suffixes (-bg, -fg, -border)
- State modifier patterns (-hover, -active, -disabled)
- Proper order: --[prefix]-[component]-[part?]-[property]-[state?]

### Two-Layer Token Strategy
- Reference layer implementation (BASE COLOR MAPPING section)
- Base color mapping to semantic tokens
- Derived colors using reference tokens
- Proper abstraction for component variants

### Documentation Integration
- Alignment with CLAUDE.md mandatory structure
- Compliance with token-contribution.md guidelines
- Tailwind CSS best practices adherence
- Project-specific pattern consistency

## Violation Detection Examples

### Critical Issues
- Missing color suffixes: `--color-slider-track` → `--color-slider-track-bg`
- Wrong naming order: `--color-button-primary-bg` → `--color-button-bg-primary`
- Missing mandatory sections: No "BASE COLOR MAPPING" or "DERIVED COLORS"
- Inconsistent component names: `slider` vs `range-slider` (should match filename)

### Warning Issues
- Incomplete reference layer implementation
- Missing state variations (-hover, -disabled)
- Non-semantic direct color usage
- Inconsistent spacing or typography patterns

### Info Suggestions
- Optimization opportunities using oklch() functions
- Better organization of validation states
- Enhanced focus ring implementations
- Modern CSS feature utilization

## Reporting Format

### Structure Compliance Report
```
STRUCTURE ANALYSIS: _component-name.css
==========================================

✅ Section Order: PASSED/FAILED
   - :root block present: ✅/❌
   - @theme static block present: ✅/❌
   - BASE COLOR MAPPING section: ✅/❌
   - DERIVED COLORS section: ✅/❌
   - STATE VARIATIONS section: ✅/❌
   - COMPONENT VARIANTS section: ✅/❌

❌ CRITICAL VIOLATIONS:
   1. Missing -bg suffix on: --color-component-primary
   2. Inconsistent naming: uses 'btn' instead of 'button'
   
⚠️  WARNING ISSUES:
   1. Reference layer incomplete for secondary colors
   2. Missing hover states for interactive elements
```

### Detailed Recommendations
```
RECOMMENDED CHANGES:
===================

1. Fix Color Naming (CRITICAL)
   Current:  --color-slider-track: var(--color-surface);
   Fixed:    --color-slider-track-bg: var(--color-surface);
   Reason:   All colors must have explicit suffixes per CLAUDE.md

2. Implement Reference Layer (CRITICAL)
   Add:      --color-range-slider-primary: var(--color-primary);
   Then use: --color-range-slider-bg-primary: var(--color-range-slider-primary);
   Reason:   Enables easy theming via reference layer pattern

3. Component Name Consistency (WARNING)
   Current:  --color-slider-* throughout file
   Fixed:    --color-range-slider-* (match _range-slider.css filename)
   Reason:   Component names should match their token file names
```

## Implementation Guidelines

### Educational Approach
- Explain the reasoning behind each recommendation
- Reference specific CLAUDE.md sections being violated
- Show before/after examples with explanations
- Link to relevant Tailwind CSS documentation

### Change Management
- Never implement changes automatically
- Present full analysis report first
- Ask for explicit approval before any modifications
- Provide rollback plan for implemented changes
- Test recommendations in isolated environment

### Quality Assurance
- Validate changes don't break existing component usage
- Ensure theme switching continues to work
- Check that all variants maintain proper contrast
- Verify spacing consistency across components

## Best Practices

### Comprehensive Analysis
- Check all token categories present in file
- Validate against complete CLAUDE.md requirements
- Cross-reference with existing component implementations
- Ensure consistency with other token files

### Documentation Integration
- Reference official Tailwind CSS theme variable docs
- Align with project token-contribution.md guidelines  
- Maintain consistency with established patterns
- Provide educational context for each recommendation

### Non-Destructive Process
- Preserve all existing functionality
- Maintain backward compatibility where possible
- Offer gradual migration strategies
- Provide clear rollback procedures

I'll analyze the specified token file thoroughly, provide detailed educational feedback, and wait for explicit approval before implementing any changes.