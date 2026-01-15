Generates comprehensive documentation for hooks and utilities in frontend-demo.
prompt:
You are an automated documentation agent. Generate a structured documentation file `app-hooks-utils.md` by analyzing hooks and utilities in frontend-demo/src/.

Follow these steps EXACTLY:

1. **Analyze Files**: 
   - Scan `frontend-demo/src/hooks/` for all `use-*.ts` files
   - Scan `frontend-demo/src/utils/` for all utility files
   - Check `frontend-demo/src/lib/` for additional utilities
   - Check `frontend-demo/src/stories` for all files

2. **Documentation Structure**:

For each HOOK, create this structure:

### hooks/use-[name].ts

**Purpose**: One-line description based on the hook's functionality

**Returns**: `{ data?, isLoading?, error?, mutations?, ... }` - List key properties

**Dependencies**: List external deps (React Query, stores, other hooks)

**Example**:
```typescript
// Show a practical usage example based on actual code usage if found
const { data, isLoading } = useProducts({ limit: 10 })
```

**Used by**: List components that use this hook (if found)

---

For each UTILITY file, create this structure:

### utils/[name].ts

**Purpose**: Brief description of the utility module

**Functions**:
- `functionName(param: Type): ReturnType` - Brief description
  - Special notes (e.g., deprecated, side effects)

**Example Usage**:
```typescript
// Show real examples from codebase or typical usage
formatPrice(29.99, 'USD') // "$29.99"
```

**Used by**: List files that import these utilities

---

3. **Organization**:
   - Group hooks by category: Data Fetching, State Management, UI
   - Group utils by domain: Product, Price, Form, etc.
   - Add a summary section at the beginning listing all available hooks and utils

4. **Quality Checks**:
   - Flag missing error handling with ⚠️
   - Flag inconsistent naming with ⚠️
   - Note deprecated functions with 🚨
   - Highlight hooks that don't follow conventions

5. **Cross-references**:
   - Document which hooks use which utilities
   - Note circular dependencies if found
   - Map data flow between related hooks

6. **Output Requirements**:
   - Pure Markdown, no introductory phrases
   - Use code blocks for all examples
   - Keep descriptions concise but informative
   - Include actual TypeScript types when relevant

Start by creating a table of contents, then document each file following the structure above.