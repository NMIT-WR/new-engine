import { MedusaError, Modules } from "@medusajs/framework/utils"

// Mock the client before importing service
jest.mock("../client", () => ({
  PplClient: jest.fn().mockImplementation(() => mockPplClient),
}))

const mockPplClient = {
  fetchNewToken: jest.fn(),
  getCodelistCountries: jest.fn(),
  getCodelistCurrencies: jest.fn(),
  getCodelistProducts: jest.fn(),
  getCodelistServices: jest.fn(),
  getCodelistStatuses: jest.fn(),
  createShipmentBatch: jest.fn(),
  getBatchStatus: jest.fn(),
  getShipmentInfo: jest.fn(),
  cancelShipment: jest.fn(),
  getAccessPoints: jest.fn(),
  getCustomerInfo: jest.fn(),
  getCustomerAddresses: jest.fn(),
  downloadLabel: jest.fn(),
}

const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
  clear: jest.fn(),
}

const mockLockingService = {
  execute: jest.fn().mockImplementation(async (_key, fn) => fn()),
}

const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}

const validOptions = {
  client_id: "test-client",
  client_secret: "test-secret",
  environment: "testing" as const,
  default_label_format: "Pdf" as const,
}

// Import after mocks
import { PplClientModuleService } from "../service"

const createService = (
  options = validOptions,
  cacheService: typeof mockCacheService | null = mockCacheService,
  lockingService: typeof mockLockingService | null = mockLockingService
) =>
  new PplClientModuleService(
    {
      logger: mockLogger,
      [Modules.CACHING]: cacheService,
      [Modules.LOCKING]: lockingService,
    } as any,
    options
  )

describe("PplClientModuleService", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Clear mockResolvedValueOnce queue (clearAllMocks doesn't do this)
    mockCacheService.get.mockReset()
    mockLockingService.execute.mockReset()
    mockLockingService.execute.mockImplementation(async (_key, fn) => fn())
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe("constructor", () => {
    it("throws on missing required options", () => {
      expect(() =>
        createService({
          client_id: "",
          client_secret: "",
          environment: "testing",
          default_label_format: "",
        } as any)
      ).toThrow("PPL: Missing required configuration")
    })

    it("logs warning when cache or locking service unavailable", () => {
      createService(validOptions, null, null)
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Cache or locking service not available")
      )
    })

    it("initializes successfully with valid options", () => {
      const service = createService()
      expect(service.getOptions()).toEqual(validOptions)
    })
  })

  describe("token management", () => {
    it("returns cached token when valid and not expired", async () => {
      const futureExpiry = Date.now() + 120_000 // 2 minutes from now
      mockCacheService.get
        .mockResolvedValueOnce(null) // rate limit - acquireRateLimitSlot first
        .mockResolvedValueOnce({
          accessToken: "cached-token",
          expiresAt: futureExpiry,
        }) // token

      const service = createService()
      await service.createShipmentBatch([])

      expect(mockPplClient.fetchNewToken).not.toHaveBeenCalled()
      expect(mockPplClient.createShipmentBatch).toHaveBeenCalledWith(
        "cached-token",
        [],
        undefined
      )
    })

    it("fetches new token when cached token expired", async () => {
      const pastExpiry = Date.now() - 1000
      mockCacheService.get
        .mockResolvedValueOnce(null) // rate limit for shipment
        .mockResolvedValueOnce({
          accessToken: "old-token",
          expiresAt: pastExpiry,
        }) // expired token
        .mockResolvedValueOnce(null) // rate limit for token fetch

      mockPplClient.fetchNewToken.mockResolvedValue({
        accessToken: "new-token",
        expiresAt: Date.now() + 1_800_000,
      })

      const service = createService()
      await service.createShipmentBatch([])

      expect(mockPplClient.fetchNewToken).toHaveBeenCalled()
      expect(mockCacheService.set).toHaveBeenCalledWith(
        expect.objectContaining({ key: "ppl:oauth:token" })
      )
    })

    it("uses local fallback when Redis unavailable", async () => {
      // MIN_REQUEST_INTERVAL_MS = 40 in service.ts
      const MIN_INTERVAL = 40
      const fixedNow = new Date("2025-01-15T12:00:00Z").getTime()
      jest.setSystemTime(fixedNow)

      mockPplClient.fetchNewToken.mockResolvedValue({
        accessToken: "fallback-token",
        expiresAt: fixedNow + 1_800_000,
      })

      const service = createService(validOptions, null, null)
      // createShipmentBatch calls acquireRateLimitSlot twice:
      // 1. Before getToken() - elapsed is huge (from 0), no wait
      // 2. Inside getToken() when fetching - elapsed is 0 (same tick), needs wait
      const promise = service.createShipmentBatch([])
      await jest.advanceTimersByTimeAsync(MIN_INTERVAL * 2)
      await promise

      expect(mockPplClient.fetchNewToken).toHaveBeenCalled()
      expect(mockPplClient.createShipmentBatch).toHaveBeenCalledWith(
        "fallback-token",
        [],
        undefined
      )
    })

    it("throws MedusaError when token fetch fails", async () => {
      mockCacheService.get.mockResolvedValue(null)
      mockPplClient.fetchNewToken.mockRejectedValue(new Error("Auth failed"))

      const service = createService()

      await expect(service.createShipmentBatch([])).rejects.toThrow(MedusaError)
    })
  })

  describe("rate limiting", () => {
    // MIN_REQUEST_INTERVAL_MS = 40 in service.ts
    const MIN_INTERVAL = 40

    it("waits when under MIN_REQUEST_INTERVAL", async () => {
      const elapsedSinceLastRequest = 10
      const recentTimestamp = Date.now() - elapsedSinceLastRequest

      // Call order: acquireRateLimitSlot() -> getToken()
      mockCacheService.get
        .mockResolvedValueOnce({ timestamp: recentTimestamp }) // rate limit - triggers wait
        .mockResolvedValueOnce({
          accessToken: "token",
          expiresAt: Date.now() + 120_000,
        }) // token - valid, no refetch needed

      const service = createService()
      const promise = service.createShipmentBatch([])

      // Advance well past MIN_INTERVAL to ensure sleep completes
      await jest.advanceTimersByTimeAsync(MIN_INTERVAL * 2)
      await promise

      expect(mockCacheService.set).toHaveBeenCalledWith(
        expect.objectContaining({ key: "ppl:rate:last_request" })
      )
      expect(mockPplClient.fetchNewToken).not.toHaveBeenCalled()
    })
  })

  describe("caching - codelists", () => {
    it("returns cached countries on cache hit", async () => {
      const cachedCountries = [{ code: "CZ" }, { code: "SK" }]
      mockCacheService.get.mockResolvedValueOnce(cachedCountries) // cache hit for countries

      const service = createService()
      const result = await service.getCachedCountries()

      expect(result).toEqual(cachedCountries)
      expect(mockPplClient.getCodelistCountries).not.toHaveBeenCalled()
    })

    it("fetches and caches countries on cache miss", async () => {
      const freshCountries = [{ code: "CZ" }]
      mockCacheService.get
        .mockResolvedValueOnce(null) // cache miss for countries
        .mockResolvedValueOnce(null) // rate limit
        .mockResolvedValueOnce({
          accessToken: "token",
          expiresAt: Date.now() + 120_000,
        }) // token

      mockPplClient.getCodelistCountries.mockResolvedValue(freshCountries)

      const service = createService()
      const result = await service.getCachedCountries()

      expect(result).toEqual(freshCountries)
      expect(mockCacheService.set).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "ppl:codelist:countries",
          tags: ["ppl", "ppl:codelists"],
        })
      )
    })
  })

  describe("cache invalidation", () => {
    it("invalidateCodelists clears tagged cache", async () => {
      const service = createService()
      await service.invalidateCodelists()

      expect(mockCacheService.clear).toHaveBeenCalledWith({
        tags: ["ppl:codelists"],
      })
    })

    it("invalidateAllCaches clears all PPL caches", async () => {
      const service = createService()
      await service.invalidateAllCaches()

      expect(mockCacheService.clear).toHaveBeenCalledWith({
        tags: ["ppl"],
      })
    })

    it("invalidateAllCaches clears local fallback when Redis unavailable", async () => {
      // MIN_REQUEST_INTERVAL_MS = 40 in service.ts
      const MIN_INTERVAL = 40
      const fixedNow = new Date("2025-01-15T12:00:00Z").getTime()
      jest.setSystemTime(fixedNow)

      const service = createService(validOptions, null, null)

      // Prime local fallback
      mockPplClient.fetchNewToken.mockResolvedValue({
        accessToken: "token",
        expiresAt: fixedNow + 1_800_000,
      })
      // First call - needs timer advance for rate limit sleep inside getToken()
      const primePromise = service.createShipmentBatch([])
      await jest.advanceTimersByTimeAsync(MIN_INTERVAL * 2)
      await primePromise

      // Invalidate
      await service.invalidateAllCaches()

      // Advance time past rate limit interval before next call
      await jest.advanceTimersByTimeAsync(MIN_INTERVAL * 2)

      // Next call should fetch new token (cache was invalidated)
      mockPplClient.fetchNewToken.mockClear()
      const secondPromise = service.createShipmentBatch([])
      await jest.advanceTimersByTimeAsync(MIN_INTERVAL * 2)
      await secondPromise

      expect(mockPplClient.fetchNewToken).toHaveBeenCalled()
    })
  })

  describe("shipment operations", () => {
    beforeEach(() => {
      mockCacheService.get
        .mockResolvedValueOnce(null) // rate limit
        .mockResolvedValueOnce({
          accessToken: "token",
          expiresAt: Date.now() + 120_000,
        }) // token
    })

    it("createShipmentBatch passes shipments to client", async () => {
      mockPplClient.createShipmentBatch.mockResolvedValue("batch-123")

      const service = createService()
      const shipments = [{ referenceId: "ref-1", productType: "PRIV" }]
      const result = await service.createShipmentBatch(shipments as any)

      expect(result).toBe("batch-123")
      expect(mockPplClient.createShipmentBatch).toHaveBeenCalledWith(
        "token",
        shipments,
        undefined
      )
    })

    it("cancelShipment returns true on success", async () => {
      mockCacheService.get
        .mockResolvedValueOnce(null) // rate limit
        .mockResolvedValueOnce({
          accessToken: "token",
          expiresAt: Date.now() + 120_000,
        })
      mockPplClient.cancelShipment.mockResolvedValue(true)

      const service = createService()
      const result = await service.cancelShipment("123456")

      expect(result).toBe(true)
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining("cancelled")
      )
    })

    it("cancelShipment returns false on failure", async () => {
      mockCacheService.get
        .mockResolvedValueOnce(null) // rate limit
        .mockResolvedValueOnce({
          accessToken: "token",
          expiresAt: Date.now() + 120_000,
        })
      mockPplClient.cancelShipment.mockResolvedValue(false)

      const service = createService()
      const result = await service.cancelShipment("123456")

      expect(result).toBe(false)
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Cancellation failed")
      )
    })
  })
})
