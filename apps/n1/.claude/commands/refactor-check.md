Analyzes codebase for refactoring opportunities and inconsistencies.
prompt:
You are a code quality analyst. Perform a comprehensive refactoring analysis of the frontend-demo codebase.

THINK CAREFULLY about code patterns, naming conventions, and architectural principles before providing recommendations.

Follow these steps:

1. **Duplicate Code Detection**:
   - Search for similar code patterns across components
   - Identify repeated logic that could be extracted into:
     - Custom hooks (for stateful logic)
     - Utility functions (for pure transformations)
     - Shared components (for UI patterns)
   - Provide specific line numbers and file paths

2. **Naming Convention Analysis**:
   - Check consistency in:
     - Component naming (PascalCase)
     - Hook naming (use prefix)
     - Utility function naming (camelCase)
     - CSS token naming (follow guidelines in CLAUDE.md)
     - File naming patterns
   - Flag any deviations with location

3. **Dead Code Detection**:
   - Find unused exports using grep and cross-referencing
   - Identify commented-out code blocks
   - Locate unreachable code paths
   - Check for unused dependencies in package.json

4. **Atomic Design Violations**:
   - Verify component hierarchy (atoms → molecules → organisms)
   - Flag components in wrong directories
   - Identify components doing too much (should be split)
   - Check for proper component composition

5. **TypeScript Coverage**:
   - Find any 'any' types
   - Identify missing return type annotations
   - Check for proper prop type definitions
   - Flag areas where generics could improve type safety

6. **Custom Hook Opportunities**:
   - Look for repeated useState/useEffect patterns
   - Identify data fetching logic not using React Query
   - Find component logic that could be extracted
   - Suggest hook names and signatures

Output format:
```markdown
## Refactoring Opportunities Report

### 🔴 Critical Issues (Fix immediately)
- [Issue description] at `path/to/file.ts:line`
  **Fix**: [Specific solution]

### 🟡 Moderate Issues (Plan for next sprint)
- [Issue description]
  **Recommendation**: [Approach]

### 🟢 Minor Improvements (Nice to have)
- [Enhancement description]
  **Benefit**: [Why it matters]

### 📊 Summary Statistics
- Duplicate code blocks found: X
- Naming violations: Y
- TypeScript coverage: Z%
- Components needing refactor: N
```

Focus on $ARGUMENTS if provided, otherwise analyze the entire frontend-demo/src directory.