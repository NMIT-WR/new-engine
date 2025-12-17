# CLAUDE.md - Medusa BE

## Commands

```bash
npx tsc --noEmit                          # typecheck
bunx biome check --write .                # lint (monorepo root)
pnpm test:unit                            # run unit tests
npx medusa exec ./src/scripts/my-script.ts  # run script
npx medusa db:generate MODULE             # gen migration
```

**Feature-flagged module migrations:** When a module is conditionally loaded via `FEATURE_*` env var, migrations can't
be generated unless the feature is enabled. Restart the container with the feature enabled before running
`make medusa-generate-migration MODULE=my_module`.

## Structure

```
src/
├── admin/      # dashboard widgets and UI routes
├── api/        # REST routes (store/, admin/, auth/)
├── jobs/       # cron tasks
├── links/      # module relations
├── modules/    # custom modules and providers
├── scripts/    # one-off tasks (medusa exec)
├── subscribers/# event listeners (async)
├── utils/      # shared utilities (errors, db, schema)
├── workflows/  # multi-step w/ rollback
```

## Module Isolation

Modules can't access other modules directly.

**Patterns:**

- **Links** → associate data (`defineLink`)
- **Query** → retrieve linked data (`query.graph`)
- **Workflows** → orchestrate multi-module ops

Module container ≠ framework container. Query/Link unavailable in module service → use workflows.

## Module vs ModuleProvider

| Aspect       | Module                               | ModuleProvider                                |
|--------------|--------------------------------------|-----------------------------------------------|
| Definition   | `Module("key", { service })`         | `ModuleProvider(Modules.X, { services })`     |
| Container    | Own isolated container               | Parent module's container                     |
| `__hooks`    | ✅ `onApplicationStart` called        | ❌ Not called                                  |
| Registration | Registered in sharedContainer by key | Registered with provider key format           |
| Use case     | Standalone domain logic              | Extend existing module (payment, fulfillment) |

**Naming:** Directory names use hyphens (`my-module/`), module keys use underscores (`my_module`). Key constraint:
alphanumeric + underscores only.

## Module Loading Timing

**Critical:** Modules load in **parallel** (`promiseAll`).

| Phase                | What Happens                                                  |
|----------------------|---------------------------------------------------------------|
| Module loading       | All modules bootstrap in parallel, loaders run                |
| Service registration | Services registered as **lazy singletons** (not instantiated) |
| `onApplicationStart` | Called after ALL modules loaded                               |
| Server starts        | Ready for requests                                            |
| First request        | Lazy services **instantiated** (dependencies available!)      |

**Implications:**

- **Loaders** run during parallel loading → can't resolve cross-module deps reliably
- **Service constructors** run at request time → all deps available
- Use `__hooks.onApplicationStart` for deferred init needing other modules

## Cross-Module Dependencies for Providers

To inject a custom module into a ModuleProvider, use `dependencies` config:

```typescript
// medusa-config.ts
modules: {
    // 1. Define custom module (use underscores, not hyphens!)
    "my_client"
:
    {
        resolve: "./src/modules/my_client",
            options
    :
        { /* ... */
        }
    ,
    }
,

    // 2. Inject into provider's parent module
    [Modules.FULFILLMENT]
:
    {
        resolve: "@medusajs/medusa/fulfillment",
            dependencies
    :
        ["my_client"],  // Injects into provider container
            options
    :
        {
            providers: [{
                resolve: "./src/modules/my-provider",
                id: "my-provider",
            }],
        }
    ,
    }
,
}

// Provider service - access via container using constant
import {MY_CLIENT_MODULE} from "../my_client"

type InjectedDependencies = {
    logger: Logger
} & Record<typeof MY_CLIENT_MODULE, MyClientService>

class MyProviderService extends AbstractFulfillmentProviderService {
    constructor(container: InjectedDependencies, options: any) {
        super()
        this.myClient = container[MY_CLIENT_MODULE]  // Available at request time
    }
}
```

**Why this works:** Provider services are lazy singletons. Constructor runs at request time, when all modules are
loaded.

**Tip:** Export the module key as a constant (`MY_CLIENT_MODULE = "my_client"`) and use it everywhere to avoid
hardcoding the name.

## Container Access

| Context | Access                      |
|---------|-----------------------------|
| Route   | `req.scope.resolve()`       |
| Job     | `container.resolve()`       |
| Step    | 2nd param `{ container }`   |
| Service | inherited via MedusaService |

## Key Resolutions

```typescript
resolve<Logger>(ContainerRegistrationKeys.LOGGER)
resolve<Query>(ContainerRegistrationKeys.QUERY)
resolve<IRegionModuleService>(Modules.REGION)
resolve<IFulfillmentModuleService>(Modules.FULFILLMENT)
resolve<ILockingModule>(Modules.LOCKING)
resolve<ICachingModuleService>(Modules.CACHING)  // NOT Modules.CACHE!
```

**Watch out:** Use `Modules.CACHING` (not `CACHE`), `Modules.LOCKING` (not `LOCK`). The constants use gerund form (
-ING).

## Code Style (Biome)

Project uses Biome with `ultracite` preset.

**80/20 rule for comments:**

- Code should be self-documenting via clear naming
- Only comment the "why", never the "what"
- Skip JSDoc for private methods - function name should explain purpose
- Accept biome complexity warnings when justified (e.g., centralized retry logic)

**Key rules to follow:**

```typescript
// ✅ Always use block statements (braces) - never single-line
if (condition) {
    doSomething()
}

// ❌ Biome will expand this
if (condition) doSomething()

// ✅ Arrow functions with blocks for non-trivial bodies
const handler = async () => {
    const result = await fetch()
    return result
}

// ✅ Semicolons: as needed (omit where optional)
const x = 1
const y = {a: 1, b: 2}

// ✅ One variable per declaration
const a = 1
const b = 2

// ❌ Not this
const a = 1, b = 2

// ❌ Non-null assertions forbidden - use proper null checks or type guards
const value = obj.prop!  // Don't do this
const value = obj.prop ?? fallback  // ✅ Use nullish coalescing
if (obj.prop) { /* use obj.prop */
}  // ✅ Use type guards
```

**Functional core, imperative shell:**
Extract pure functions (no side effects, no container dependencies) to separate files. This allows importing and testing
them without loading modules that have runtime dependencies (OAuth clients, service instantiation). Keep side-effect
code (API calls, DB queries, container resolution) in the main file.

## Patterns

### Route

```typescript
export async function GET(req: MedusaRequest, res: MedusaResponse) {
    const query = req.scope.resolve<Query>(ContainerRegistrationKeys.QUERY)
    const {data} = await query.graph({entity: "my_entity", ...req.queryConfig})
    res.json({items: data})
}
```

**Admin route authentication:** Routes under `/admin/` are automatically protected by Medusa framework. No
authentication middleware needed—just create the route file.

### Module

```typescript
export const MY_MODULE = "my_module"
export default Module(MY_MODULE, {service: MyModuleService})
```

### Module with Model (Extending MedusaService)

To add a data model to an existing module while keeping custom methods:

```typescript
// service.ts - Extend MedusaService with your model
export class MyModuleService extends MedusaService({ MyConfig }) {
  // Auto-generated: listMyConfigs, createMyConfigs, updateMyConfigs, deleteMyConfigs

  constructor(container: InjectedDependencies, options: MyModuleOptions) {
    super(...arguments)  // Required - passes container and options to MedusaService
    this.logger_ = container.logger
    this.environment_ = options.environment
  }

  // Keep custom methods alongside auto-generated CRUD
  async myCustomMethod() { /* ... */ }
}
```

### Module Loaders

Use `loaders` array for initialization that runs at module load time (e.g., creating default DB records):

```typescript
// src/modules/my-module/loaders/init.ts
export default async function initLoader({ container, options }: LoaderOptions<MyOptions>) {
  // Runs during module bootstrap
}

// src/modules/my-module/index.ts
export default Module(MY_MODULE, {
  service: MyModuleService,
  loaders: [initLoader],
})
```

**Note:** Loaders run during parallel module loading. For cross-module deps, use `__hooks.onApplicationStart`.

### Model

```typescript
const MyEntity = model.define("my_entity", {
    id: model.id().primaryKey(),
    title: model.text().searchable(),
    rating: model.float(),           // Decimals (less precision than bigNumber)
    price: model.bigNumber(),        // High-precision decimals (money)
    items: model.hasMany(() => MyItem, {mappedBy: "parent"}),
}).indexes([
    // String format (raw SQL)
    {on: ["handle"], unique: true, where: "deleted_at IS NULL"},
    // Object format (DML)
    {on: ["handle"], unique: true, where: {deleted_at: {$ne: null}}},
]).checks([
    // Database constraints
    {name: "title_length", expression: (cols) => `LENGTH(${cols.title}) <= 200`},
])
```

### Link

```typescript
export const ProductMyEntityLink = defineLink(
    {linkable: ProductModule.linkable.product, isList: true},
    {linkable: MyModule.linkable.my_entity, filterable: ["id", "title"]}
)

// Read-only link (query only, no link.create/dismiss)
defineLink(
    {linkable: MyModule.linkable.my_entity, field: "external_id"},
    ExternalModule.linkable.external,
    {readOnly: true}
)

// With cascade delete and custom columns
defineLink(Parent.linkable.parent, {linkable: Child.linkable.child, deleteCascades: true}, {
    database: {extraColumns: {sort_order: {type: "integer"}}}
})
```

### Middleware

```typescript
import {
    defineMiddlewares,
    validateAndTransformQuery,
    validateAndTransformBody,
    authenticate
} from "@medusajs/framework/http"

export default defineMiddlewares({
    routes: [
        {
            methods: ["GET"],
            matcher: "/store/my-entities",
            middlewares: [validateAndTransformQuery(Schema, {
                defaults: ["id"],
                allowed: ["id", "title"],
                isList: true
            })],
        },
        {
            methods: ["POST"],
            matcher: "/store/my-entities",
            middlewares: [
                authenticate("customer", ["session", "bearer"]),  // Require auth
                validateAndTransformBody(CreateSchema),           // Validate body
            ],
        },
    ],
})
```

### Step

```typescript
export const createRegionsStep = createStep("create-regions-step",
    async (input: Input, {container}) => {
        const service = container.resolve<IRegionModuleService>(Modules.REGION)
        return new StepResponse({result})
    }
)
```

### Workflow + Transform

```typescript
const workflow = createWorkflow("my-workflow", (input: Input) => {
    const stepResult = Steps.myStep(input.data)
    const derived = transform({stepResult}, (d) => ({id: d.stepResult.id}))
    return new WorkflowResponse({result: derived})
})
```

**Workflow limits:**

- Vars have no values at definition, only at execution
- Can't reassign vars or iterate arrays in workflow body
- `transform()` = data manipulation only, runs lazily
- No if-conditions → use `when-then`:
  ```typescript
  import { when } from "@medusajs/framework/workflows-sdk"
  when(input, (i) => i.is_active).then(() => activeStep())
  ```
- Use `useQueryGraphStep` from `@medusajs/medusa/core-flows` for Query in workflows

### Job w/ Locking

```typescript
export default async function myJob(container: MedusaContainer) {
    const lock = container.resolve<ILockingModule>(Modules.LOCKING)
    try {
        await lock.execute("job-key", async () => { /* logic */
        }, {timeout: 120})
    } catch (e) {
        if (e instanceof Error && e.message.includes("Timed-out")) return
        throw e
    }
}
export const config = {
    name: "my-job",
    schedule: "*/5 * * * *",
    // numberOfExecutions: 3,  // Optional: limit to N runs per app lifetime
}
```

### Workflow w/ Lock Steps (simpler alternative)

```typescript
import {acquireLockStep, releaseLockStep} from "@medusajs/medusa/core-flows"

const workflow = createWorkflow("protected-op", (input: { key: string }) => {
    acquireLockStep({key: input.key, timeout: 2, ttl: 10})
    protectedStep(input)
    releaseLockStep({key: input.key})  // Auto-releases on error via compensation
})
```

### Caching (v2.11.0+, Redis-backed)

```typescript
const cacheService = container.resolve<ICachingModuleService>(Modules.CACHING)  // NOT Modules.CACHE!

// Generate consistent cache key from object (hashes the input)
const cacheKey = await cacheService.computeKey({filters, page, limit})

// Get cached value (object-based API)
const cached = await cacheService.get({key: cacheKey}) as MyType[] | null
if (cached) return cached

// Fetch and cache with TTL (seconds) and tags for bulk invalidation
const data = await fetchData()
await cacheService.set({key: cacheKey, data, ttl: 3600, tags: ["my_module", "my_module:subset"]})

// Clear by tag (all entries with this tag)
await cacheService.clear({tags: ["my_module:subset"]})
```

**Multi-container:** For shared state (tokens, rate limiting), always prioritize Redis over local variables. Local
fallback only when Redis unavailable.

### External API Client Pattern

For third-party API integrations, separate concerns:

```typescript
// client.ts - Pure HTTP layer (no caching, no state)
class MyApiClient {
    async fetchData(token: string, query: Query): Promise<Data> {
        // Only HTTP logic, retries, response parsing
    }

    async fetchNewToken(): Promise<{ accessToken: string; expiresAt: number }> {
    }
}

// service.ts - Smart orchestration layer
class MyApiModuleService {
    private client_: MyApiClient
    private cacheService_: ICachingModuleService | null

    // Manages: token sharing via Redis, rate limiting, caching, invalidation
    async getData(query: Query): Promise<Data> {
        await this.acquireRateLimitSlot()  // Redis-coordinated
        const token = await this.getToken() // Redis-shared
        return this.getCached("key", () => this.client_.fetchData(token, query), ttl, tags)
    }
}
```

### Script (instead of HTTP endpoint)

```typescript
// src/scripts/seed-data.ts - run via: npx medusa exec ./src/scripts/seed-data.ts
export default async function seedData({container, args}: ExecArgs) {
    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    // args = CLI arguments after script path: npx medusa exec ./script.ts arg1 arg2
}
```

**Run on startup:** Add to package.json: `"dev": "medusa exec ./src/scripts/startup.ts && medusa develop"`

### Query + Filters

```typescript
const {data} = await query.graph({
    entity: "fulfillment",
    fields: ["id", "data"],
    filters: {provider_id: "my_shipping_default"},  // DB stores {identifier}_{id}
})
return data.filter(f => f.data?.status === "pending")  // JSON filter in-memory
```

### Provider ID Naming

Fulfillment/payment providers have two IDs:

| Where            | Format                 | Example                  |
|------------------|------------------------|--------------------------|
| DB `provider_id` | `{identifier}_{id}`    | `my_shipping_default`    |
| Container key    | `fp_{identifier}_{id}` | `fp_my_shipping_default` |

- `identifier` = static property on service class (provider type)
- `id` = config value in `medusa-config.ts` (instance name)

**Tip:** Keep both short and identical when you have one instance: `identifier = "carrier"`, `id = "carrier"` →
`carrier_carrier`

### SQL Results Typing

```typescript
interface ProductRow {
    id: string;
    title: string
}

const results = await dbService.sqlRaw<ProductRow[]>(query)
```

### Error Handling

```typescript
// Prefer MedusaError for API errors
throw new MedusaError(MedusaError.Types.INVALID_DATA, "Missing field")

// Common error types:
// INVALID_DATA (400)      - validation errors
// NOT_FOUND (404)         - resource not found
// UNAUTHORIZED (401)      - auth required
// NOT_ALLOWED (400)       - operation forbidden
// DUPLICATE_ERROR (422)   - record already exists
// CONFLICT (409)          - concurrent request conflict

// Catch pattern
catch
(error)
{
    logger.error("Failed", error instanceof Error ? error : new Error(String(error)))
}
```

## Config Examples

### Conditional Module

```typescript
...
(FEATURE_ENABLED ? [{
    resolve: "@medusajs/medusa/fulfillment",
    dependencies: ["my_client"],  // Inject custom module into provider container
    options: {providers: [{resolve: "./src/modules/my_provider", id: "my_provider"}]}
}] : []),
```

### Redis Locking

```typescript
{
    resolve: "@medusajs/medusa/locking", options
:
    {
        providers: [{
            resolve: "@medusajs/medusa/locking-redis",
            id: "locking-redis",
            is_default: true,
            options: {redisUrl}
        }]
    }
}
```

## Do / Don't

**DO:**

- Validate before cast
- Use `Modules.*` / `ContainerRegistrationKeys.*` constants
- Batch operations with `CHUNK_SIZE`
- Lock overlapping jobs
- Resolve external clients via container
- Convert destructive endpoints → `medusa exec` scripts

**DON'T:**

- `as Type` without validation
- Validation logic in `transform()`
- Resolve `Query`/`Link` in module service (use workflows)
- Create unprotected destructive GET endpoints

## Testing

Uses `@medusajs/test-utils` + Jest. Medusa's framework is for **integration tests only**; unit tests use plain Jest.

| Type               | Location                             | Command                         | Runner                        |
|--------------------|--------------------------------------|---------------------------------|-------------------------------|
| Unit               | `src/**/__tests__/**/*.unit.spec.ts` | `pnpm test:unit`                | Jest                          |
| Unit (jobs)        | `tests/unit/jobs/*.unit.spec.ts`     | `pnpm test:unit`                | Jest                          |
| HTTP Integration   | `integration-tests/http/`            | `pnpm test:integration:http`    | `medusaIntegrationTestRunner` |
| Module Integration | `src/modules/*/__tests__/`           | `pnpm test:integration:modules` | `moduleIntegrationTestRunner` |

**⚠️ Job tests:** Must be in `tests/unit/jobs/`, NOT `src/jobs/__tests__/`. Medusa loads all files in `src/jobs/` at
runtime—test files with Jest globals (`describe`, `jest`) will crash the dev server.

### Unit Tests

**80/20 rule:**

- Focus on critical paths: input validation, money handling, core business logic
- Skip trivial tests: getters, static arrays, simple transformations
- One happy path + unhappy paths only for errors users actually hit

**Strategy:**

- Mock module dependencies (`jest.mock("../../my-client")`)
- Don't mock `fetch` in service tests → mock the client dependency instead
- For HTTP client tests: consider MSW or accept targeted fetch mocking
- Avoid testing implementation details (field truncation, uppercase transforms)

**Testability:**

- Extract pure helpers from complex functions (complexity > 15)
- Keep helpers private but test behavior through public methods

**Anti-patterns to avoid:**

- Testing constants (`expect(MAX_ATTEMPTS).toBe(60)`) — catches no bugs
- Testing Set/Map contents you just defined — tautological
- Mocking inherited MedusaService methods (`listMyEntities`, `createMyEntities`) — tests mock behavior, not code
- Testing `query.graph()` pass-through routes — just tests framework
- Testing static option arrays (`validateOption` for known values)

**Good test patterns:**

- Factory functions: `createService()`, `createOrder(overrides)` for reusable test data
- Boundary tests: just under/over limits (e.g., timeout thresholds)
- `it.each()` for parameterized error type testing
- `jest.useFakeTimers()` for time-dependent logic (rate limiting, token expiry)

**Fake timers gotchas:**

- `jest.clearAllMocks()` does NOT clear `mockResolvedValueOnce` queue — use `mockFn.mockReset()` for specific mocks
- For async code with `sleep()`/timers, use this pattern:
  ```typescript
  const promise = service.doSomething()
  await jest.advanceTimersByTimeAsync(waitTime)
  await promise
  ```
- For deterministic `Date.now()`, use `jest.setSystemTime(fixedTimestamp)` instead of `jest.useRealTimers()`
- Always restore real timers in `afterEach` to prevent global pollution

### HTTP Integration Tests

**When to write them:**

- Routes with business logic beyond `query.graph()` pass-through
- Middleware validation that's critical to security
- Multi-step operations with database state changes

**When to skip them:**

- Thin routes that just call `query.graph()` and return — tests Medusa framework, not your code
- Routes calling external APIs (PPL, payment gateways) — requires mocking external service, defeating integration
  purpose
- Seed workflows and one-time scripts — maintenance burden exceeds value

```typescript
import {medusaIntegrationTestRunner} from "@medusajs/test-utils"

medusaIntegrationTestRunner({
    testSuite: ({api, getContainer}) => {
        describe("GET /store/my-entity", () => {
            it("returns data", async () => {
                const response = await api.get("/store/my-entity")
                expect(response.status).toEqual(200)
                expect(response.data).toHaveProperty("items")
            })
        })
    },
})
jest.setTimeout(60 * 1000)  // Required: DB ops are slow
```

**`api` methods:** `get(path)`, `post(path, data?)`, `delete(path)`

**Auth header for admin routes:**

```typescript
const token = jwt.sign({actor_id: user.id, actor_type: "user", auth_identity_id}, "supersecret")
await api.get("/admin/my-entity", {headers: {authorization: `Bearer ${token}`}})
```

**Publishable key for store routes:**

```typescript
await api.get("/store/my-entity", {headers: {"x-publishable-api-key": pak.token}})
```

### Module Integration Tests

**When to use:** Custom methods on MedusaService subclasses that can't be properly unit tested by mocking inherited
methods. If you find yourself mocking `listMyEntities`, `createMyEntities`, etc., use module integration test instead.

```typescript
import {moduleIntegrationTestRunner} from "@medusajs/test-utils"

moduleIntegrationTestRunner<MyModuleService>({
    moduleName: MY_MODULE,
    moduleModels: [MyEntity],
    resolve: "./src/modules/my-module",
    injectedDependencies: {
        [Modules.EVENT_BUS]: {emit: jest.fn()},  // Mock to prevent real events
    },
    testSuite: ({service}) => {
        it("creates entity", async () => {
            const result = await service.createMyEntities({title: "Test"})
            expect(result.title).toBe("Test")
        })
    },
})
```

**Key options:**

- `moduleModels` → required even if empty (use dummy model)
- `injectedDependencies` → mock external modules to prevent side effects

### Workflow Tests

```typescript
medusaIntegrationTestRunner({
    testSuite: ({getContainer}) => {
        it("executes workflow", async () => {
            const {result} = await myWorkflow(getContainer()).run({
                input: {name: "Test"},
            })
            expect(result.id).toBeDefined()
        })

        it("handles errors", async () => {
            const {errors} = await myWorkflow(getContainer()).run({
                input: {invalid: true},
                throwOnError: false,  // Capture errors instead of throwing
            })
            expect(errors[0].error.message).toBe("Validation failed")
        })
    },
})
```

## Env Vars

- always sync .env.docker, .env.template, .env.test and docker-compose.yml

## Keeping This Updated

- After each session, ask:

  > "[Backend] Based on our conversation and Claude Code best practices, is there anything that should be added to
  `CLAUDE.MD`, or does anything make current instructions obsolete?"

- After each "No" to a suggestion from Claude, think about what should be added or edited in `CLAUDE.MD` to make the
  instructions clearer for next time.

**IMPORTANT:** All code examples in this file must use generic names (`my_module`, `my_provider`, `MyService`, etc.),
never project-specific names. This keeps examples reusable and prevents coupling documentation to specific
implementations.