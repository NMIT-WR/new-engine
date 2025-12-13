import type { ICachingModuleService, Logger } from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { PplClient } from "./client"
import type {
  PplAccessPoint,
  PplAccessPointsQuery,
  PplBatchResponse,
  PplCodelistCountry,
  PplCodelistCurrency,
  PplCodelistProduct,
  PplCodelistServiceItem,
  PplCodelistStatus,
  PplCustomerAddressResponse,
  PplCustomerInfo,
  PplLabelSettings,
  PplOptions,
  PplReturnChannel,
  PplShipmentInfo,
  PplShipmentQuery,
  PplShipmentRequest,
} from "./types"

// ============================================
// Cache Configuration
// ============================================

const CACHE_KEYS = {
  TOKEN: "ppl:oauth:token",
  RATE_LIMIT: "ppl:rate:last_request",
  COUNTRIES: "ppl:codelist:countries",
  CURRENCIES: "ppl:codelist:currencies",
  PRODUCTS: "ppl:codelist:products",
  SERVICES: "ppl:codelist:services",
  STATUSES: "ppl:codelist:statuses",
} as const

const CACHE_TAGS = {
  ALL: "ppl",
  CODELISTS: "ppl:codelists",
} as const

const CACHE_TTL = {
  CODELISTS: 3600, // 1 hour
  RATE_LIMIT: 1, // 1 second
} as const

const MIN_REQUEST_INTERVAL_MS = 40
const TOKEN_BUFFER_MS = 60_000

type InjectedDependencies = {
  logger: Logger
  [Modules.CACHING]?: ICachingModuleService
}

type CachedToken = {
  accessToken: string
  expiresAt: number
}

/**
 * PPL Client Module Service
 *
 * Manages the PPL API client lifecycle and provides:
 * - Distributed rate limiting via Redis (prioritized)
 * - Shared OAuth token across containers via Redis
 * - Cached codelists with tag-based invalidation
 * - Local fallback only when Redis is unavailable
 *
 * This module is only registered when PPL_ENABLED=1.
 */
export class PplClientModuleService {
  private readonly client_: PplClient
  private readonly logger_: Logger
  private readonly cacheService_: ICachingModuleService | null
  private readonly options_: PplOptions

  // Local fallback state (only used when Redis unavailable)
  private fallbackToken_: string | null = null
  private fallbackTokenExpiresAt_ = 0
  private fallbackLastRequestTime_ = 0

  constructor(container: InjectedDependencies, options: PplOptions) {
    this.logger_ = container.logger
    this.cacheService_ = container[Modules.CACHING] ?? null

    if (!this.validateOptions(options)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PPL: Missing required configuration (client_id, client_secret, environment, default_label_format)"
      )
    }

    this.options_ = options

    if (!this.cacheService_) {
      this.logger_.warn(
        "PPL: Cache service not available. Using local-only mode (not suitable for multi-container)."
      )
    }

    this.client_ = new PplClient(options)
    this.logger_.info(
      `PPL: Module service initialized (${options.environment} environment)`
    )
  }

  private validateOptions(opts: Partial<PplOptions>): opts is PplOptions {
    return !!(
      opts?.client_id &&
      opts?.client_secret &&
      opts?.environment &&
      opts?.default_label_format
    )
  }

  // ============================================
  // Token Management (Redis prioritized)
  // ============================================

  private async getToken(): Promise<string> {
    // Redis available - use distributed token
    if (this.cacheService_) {
      const cached = (await this.cacheService_.get({
        key: CACHE_KEYS.TOKEN,
      })) as CachedToken | null

      if (cached && cached.expiresAt > Date.now() + TOKEN_BUFFER_MS) {
        this.logger_.debug("PPL: Using shared OAuth token from Redis")
        return cached.accessToken
      }

      // Need new token - acquire rate limit slot first
      await this.acquireRateLimitSlot()

      const { accessToken, expiresAt } =
        await this.fetchTokenWithErrorHandling()

      // Store in Redis
      const ttlSeconds = Math.max(
        1,
        Math.floor((expiresAt - Date.now()) / 1000) - 60
      )
      await this.cacheService_.set({
        key: CACHE_KEYS.TOKEN,
        data: { accessToken, expiresAt } satisfies CachedToken,
        ttl: ttlSeconds,
        tags: [CACHE_TAGS.ALL],
      })
      this.logger_.debug("PPL: Stored OAuth token in Redis")

      return accessToken
    }

    // Fallback: Local-only mode (Redis unavailable)
    if (
      this.fallbackToken_ &&
      this.fallbackTokenExpiresAt_ > Date.now() + TOKEN_BUFFER_MS
    ) {
      return this.fallbackToken_
    }

    await this.acquireRateLimitSlot()

    const tokenResult = await this.fetchTokenWithErrorHandling()
    this.fallbackToken_ = tokenResult.accessToken
    this.fallbackTokenExpiresAt_ = tokenResult.expiresAt

    return tokenResult.accessToken
  }

  private async fetchTokenWithErrorHandling(): Promise<{
    accessToken: string
    expiresAt: number
  }> {
    try {
      const result = await this.client_.fetchNewToken()
      this.logger_.debug("PPL: OAuth token obtained/refreshed")
      return result
    } catch (error) {
      this.logger_.error(
        "PPL auth failed",
        error instanceof Error ? error : new Error(String(error))
      )
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL authentication failed: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  // ============================================
  // Rate Limiting (Redis prioritized)
  // ============================================

  private async acquireRateLimitSlot(): Promise<void> {
    const now = Date.now()

    // Redis available - use distributed rate limiting
    if (this.cacheService_) {
      const cached = (await this.cacheService_.get({
        key: CACHE_KEYS.RATE_LIMIT,
      })) as { timestamp: number } | null

      if (cached && now - cached.timestamp < MIN_REQUEST_INTERVAL_MS) {
        const waitTime = MIN_REQUEST_INTERVAL_MS - (now - cached.timestamp)
        await this.sleep(waitTime)
      }

      await this.cacheService_.set({
        key: CACHE_KEYS.RATE_LIMIT,
        data: { timestamp: Date.now() },
        ttl: CACHE_TTL.RATE_LIMIT,
      })
      return
    }

    // Fallback: Local-only mode (Redis unavailable)
    const elapsed = now - this.fallbackLastRequestTime_
    if (elapsed < MIN_REQUEST_INTERVAL_MS) {
      await this.sleep(MIN_REQUEST_INTERVAL_MS - elapsed)
    }
    this.fallbackLastRequestTime_ = Date.now()
  }

  // ============================================
  // Cache Helpers
  // ============================================

  private async getCached<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number,
    tags: string[]
  ): Promise<T> {
    if (this.cacheService_) {
      const cached = (await this.cacheService_.get({ key })) as T | null
      if (cached !== null) {
        this.logger_.debug(`PPL: Cache hit for ${key}`)
        return cached
      }
    }

    const data = await fetcher()

    if (this.cacheService_ && data !== null) {
      await this.cacheService_.set({ key, data: data as object, ttl, tags })
      this.logger_.debug(`PPL: Cached ${key}`)
    }

    return data
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // ============================================
  // Public API: Configuration
  // ============================================

  getOptions(): Readonly<PplOptions> {
    return this.options_
  }

  // ============================================
  // Public API: Cache Invalidation
  // ============================================

  async invalidateCodelists(): Promise<void> {
    if (!this.cacheService_) {
      return
    }
    await this.cacheService_.clear({ tags: [CACHE_TAGS.CODELISTS] })
    this.logger_.info("PPL: Invalidated codelist cache")
  }

  async invalidateAllCaches(): Promise<void> {
    if (!this.cacheService_) {
      // Clear local fallback
      this.fallbackToken_ = null
      this.fallbackTokenExpiresAt_ = 0
      return
    }

    await this.cacheService_.clear({ tags: [CACHE_TAGS.ALL] })
    this.logger_.info("PPL: Invalidated all caches")
  }

  // ============================================
  // Public API: Shipment Operations
  // ============================================

  async createShipmentBatch(
    shipments: PplShipmentRequest[],
    options?: {
      labelSettings?: PplLabelSettings
      returnChannel?: PplReturnChannel
      shipmentsOrderBy?: string
    }
  ): Promise<string> {
    await this.acquireRateLimitSlot()
    const token = await this.getToken()
    return this.client_.createShipmentBatch(token, shipments, options)
  }

  async getBatchStatus(batchId: string): Promise<PplBatchResponse> {
    await this.acquireRateLimitSlot()
    const token = await this.getToken()
    return this.client_.getBatchStatus(token, batchId)
  }

  async downloadLabel(labelUrl: string): Promise<Buffer> {
    await this.acquireRateLimitSlot()
    const token = await this.getToken()
    return this.client_.downloadLabel(token, labelUrl)
  }

  async getShipmentInfo(query: PplShipmentQuery): Promise<PplShipmentInfo[]> {
    await this.acquireRateLimitSlot()
    const token = await this.getToken()
    return this.client_.getShipmentInfo(token, query)
  }

  async cancelShipment(shipmentNumber: string): Promise<boolean> {
    await this.acquireRateLimitSlot()
    const token = await this.getToken()
    const result = await this.client_.cancelShipment(token, shipmentNumber)
    if (result) {
      this.logger_.info(`PPL: Shipment ${shipmentNumber} cancelled`)
    } else {
      this.logger_.warn(`PPL: Cancellation failed for ${shipmentNumber}`)
    }
    return result
  }

  // ============================================
  // Public API: Access Points
  // ============================================

  async getAccessPoints(
    query: PplAccessPointsQuery = {}
  ): Promise<PplAccessPoint[]> {
    await this.acquireRateLimitSlot()
    const token = await this.getToken()
    return this.client_.getAccessPoints(token, query)
  }

  // ============================================
  // Public API: Cached Codelists
  // ============================================

  async getCachedCountries(): Promise<PplCodelistCountry[]> {
    return this.getCached(
      CACHE_KEYS.COUNTRIES,
      async () => {
        await this.acquireRateLimitSlot()
        const token = await this.getToken()
        return this.client_.getCodelistCountries(token)
      },
      CACHE_TTL.CODELISTS,
      [CACHE_TAGS.ALL, CACHE_TAGS.CODELISTS]
    )
  }

  async getCachedCurrencies(): Promise<PplCodelistCurrency[]> {
    return this.getCached(
      CACHE_KEYS.CURRENCIES,
      async () => {
        await this.acquireRateLimitSlot()
        const token = await this.getToken()
        return this.client_.getCodelistCurrencies(token)
      },
      CACHE_TTL.CODELISTS,
      [CACHE_TAGS.ALL, CACHE_TAGS.CODELISTS]
    )
  }

  async getCachedProducts(): Promise<PplCodelistProduct[]> {
    return this.getCached(
      CACHE_KEYS.PRODUCTS,
      async () => {
        await this.acquireRateLimitSlot()
        const token = await this.getToken()
        return this.client_.getCodelistProducts(token)
      },
      CACHE_TTL.CODELISTS,
      [CACHE_TAGS.ALL, CACHE_TAGS.CODELISTS]
    )
  }

  async getCachedServices(): Promise<PplCodelistServiceItem[]> {
    return this.getCached(
      CACHE_KEYS.SERVICES,
      async () => {
        await this.acquireRateLimitSlot()
        const token = await this.getToken()
        return this.client_.getCodelistServices(token)
      },
      CACHE_TTL.CODELISTS,
      [CACHE_TAGS.ALL, CACHE_TAGS.CODELISTS]
    )
  }

  async getCachedStatuses(): Promise<PplCodelistStatus[]> {
    return this.getCached(
      CACHE_KEYS.STATUSES,
      async () => {
        await this.acquireRateLimitSlot()
        const token = await this.getToken()
        return this.client_.getCodelistStatuses(token)
      },
      CACHE_TTL.CODELISTS,
      [CACHE_TAGS.ALL, CACHE_TAGS.CODELISTS]
    )
  }

  // ============================================
  // Public API: Customer Data (not cached)
  // ============================================

  async getCustomerInfo(): Promise<PplCustomerInfo | null> {
    await this.acquireRateLimitSlot()
    const token = await this.getToken()
    const result = await this.client_.getCustomerInfo(token)
    if (!result) {
      this.logger_.warn(
        "PPL: No customer profile configured for these credentials"
      )
    }
    return result
  }

  async getCustomerAddresses(): Promise<PplCustomerAddressResponse | null> {
    await this.acquireRateLimitSlot()
    const token = await this.getToken()
    const result = await this.client_.getCustomerAddresses(token)
    if (!result) {
      this.logger_.warn("PPL: Customer has no address configured in PPL system")
    }
    return result
  }
}
