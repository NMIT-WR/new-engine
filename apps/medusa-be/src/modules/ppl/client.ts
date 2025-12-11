import { OAuth2Client } from "@badgateway/oauth2-client"
import type { Logger } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import type {
  PplAccessPoint,
  PplAccessPointsQuery,
  PplAddressWhisperItem,
  PplAddressWhisperQuery,
  PplApiInfo,
  PplBatchLabelQuery,
  PplBatchLabelResponse,
  PplBatchResponse,
  PplBatchUpdateRequest,
  PplCodelistCountry,
  PplCodelistCurrency,
  PplCodelistProduct,
  PplCodelistQuery,
  PplCodelistServiceItem,
  PplCodelistServicePriceLimit,
  PplCodelistStatus,
  PplConnectSetRequest,
  PplCustomerAddressResponse,
  PplCustomerInfo,
  PplLabelSettings,
  PplOptions,
  PplOrder,
  PplOrderBatchRequest,
  PplOrderBatchResponse,
  PplOrderCancelQuery,
  PplOrderCancelRequest,
  PplOrderQuery,
  PplPaginatedResponse,
  PplReturnChannel,
  PplRoutingQuery,
  PplRoutingResponse,
  PplServicePriceLimitQuery,
  PplShipmentInfo,
  PplShipmentQuery,
  PplShipmentRedirectRequest,
  PplShipmentRequest,
  PplVersionInformationResponse,
} from "./types"

/**
 * PPL CPL API Base URLs by environment
 */
const BASE_URLS = {
  testing: "https://api-dev.dhl.com/ecs/ppl/myapi2",
  production: "https://api.dhl.com/ecs/ppl/myapi2",
} as const

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: unknown
  expectedStatus?: number
}

type RequestOptionsWithAllow404 = RequestOptions & { allow404?: boolean }

/**
 * PPL CPL API Client (Singleton)
 *
 * Handles OAuth 2.0 authentication via @badgateway/oauth2-client,
 * rate limiting, and all API operations.
 *
 * Usage:
 * - Call PplClient.initialize(options, logger) once at startup
 * - Use PplClient.getInstance() to get the singleton
 * - Use PplClient.getInstanceOrNull() in jobs that should skip when PPL is disabled
 *
 * Rate Limits:
 * - Token requests: 12/minute max
 * - Request interval: 40ms minimum between requests
 * - Shipments per batch: 1,000 max
 * - Orders per status request: 100 max
 */
export class PplClient {
  private static instance: PplClient | null = null

  private static cachedAccessToken: string | null = null
  private static tokenExpiresAt = 0
  private static lastRequestTime = 0
  private static oauth2Client: OAuth2Client | null = null

  private static readonly MIN_REQUEST_INTERVAL = 40
  private static readonly TOKEN_BUFFER_MS = 60_000
  private static readonly MAX_RETRIES = 3
  private static readonly INITIAL_RETRY_DELAY_MS = 200

  private readonly options: PplOptions
  private readonly logger: Logger

  private constructor(options: PplOptions, logger: Logger) {
    this.options = options
    this.logger = logger
    this.initOAuthClient()
  }

  private initOAuthClient(): void {
    PplClient.oauth2Client = new OAuth2Client({
      server: this.baseUrl,
      tokenEndpoint: "/ecs/ppl/myapi2/login/getAccessToken",
      clientId: this.options.client_id,
      clientSecret: this.options.client_secret,
      authenticationMethod: "client_secret_post",
    })
    PplClient.cachedAccessToken = null
    PplClient.tokenExpiresAt = 0
  }

  static initialize(options: PplOptions, logger: Logger): PplClient {
    if (PplClient.instance) {
      return PplClient.instance
    }
    PplClient.instance = new PplClient(options, logger)
    logger.info(`PPL: Client initialized (${options.environment} environment)`)
    return PplClient.instance
  }

  static getInstance(): PplClient {
    if (!PplClient.instance) {
      throw new Error(
        "PplClient not initialized. Call PplClient.initialize() first."
      )
    }
    return PplClient.instance
  }

  static getInstanceOrNull(): PplClient | null {
    return PplClient.instance
  }

  getOptions(): Readonly<PplOptions> {
    return this.options
  }

  private get baseUrl(): string {
    return BASE_URLS[this.options.environment]
  }

  async getAccessToken(): Promise<string> {
    if (
      PplClient.cachedAccessToken &&
      PplClient.tokenExpiresAt > Date.now() + PplClient.TOKEN_BUFFER_MS
    ) {
      return PplClient.cachedAccessToken
    }

    await this.throttle()

    if (!PplClient.oauth2Client) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PPL: OAuth2 client not initialized"
      )
    }

    try {
      const tokenResponse = await PplClient.oauth2Client.clientCredentials({
        scope: ["myapi2"],
      })

      PplClient.cachedAccessToken = tokenResponse.accessToken
      PplClient.tokenExpiresAt = tokenResponse.expiresAt
        ? tokenResponse.expiresAt * 1000
        : Date.now() + 1800 * 1000

      this.logger.debug("PPL: OAuth token obtained/refreshed")

      return PplClient.cachedAccessToken
    } catch (error) {
      this.logger.error(
        "PPL auth failed",
        error instanceof Error ? error : new Error(String(error))
      )
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL authentication failed: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * Create shipment batch - returns batchId for polling
   *
   * POST /shipment/batch returns HTTP 201 with batchId in Location header
   *
   * @param shipments - Array of shipment requests
   * @param options - Optional label settings, return channel, and sort order
   */
  async createShipmentBatch(
    shipments: PplShipmentRequest[],
    options?: {
      labelSettings?: PplLabelSettings
      returnChannel?: PplReturnChannel
      shipmentsOrderBy?: string
    }
  ): Promise<string> {
    const body = {
      shipments,
      labelSettings: options?.labelSettings ?? {
        format: this.options.default_label_format,
        dpi: 300,
      },
      ...(options?.returnChannel && { returnChannel: options.returnChannel }),
      ...(options?.shipmentsOrderBy && {
        shipmentsOrderBy: options.shipmentsOrderBy,
      }),
    }

    return this.createBatchWithLocationHeader(
      "/shipment/batch",
      body,
      "shipment"
    )
  }

  /**
   * Get batch status
   */
  async getBatchStatus(batchId: string): Promise<PplBatchResponse> {
    return this.get<PplBatchResponse>(`/shipment/batch/${batchId}`)
  }

  /**
   * Download label as Buffer for S3 storage
   *
   * @param labelUrl - Full URL or dataGuid path
   */
  async downloadLabel(labelUrl: string): Promise<Buffer> {
    const token = await this.getAccessToken()
    await this.throttle()

    // If labelUrl is relative (e.g., /data/{guid}), prepend base URL
    const fullUrl = labelUrl.startsWith("http")
      ? labelUrl
      : `${this.baseUrl}${labelUrl}`

    const response = await fetch(fullUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL label download failed: ${response.status}`
      )
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }

  /**
   * Get shipment information and tracking status
   *
   * GET /shipment with query parameters
   *
   * @param query - Query parameters for filtering shipments
   */
  async getShipmentInfo(query: PplShipmentQuery): Promise<PplShipmentInfo[]> {
    const params = this.buildShipmentQueryParams(query)
    const { data } = await this.makeRequest<
      PplPaginatedResponse<PplShipmentInfo> | PplShipmentInfo[]
    >(`/shipment?${params}`)
    return Array.isArray(data) ? data : data?.items || []
  }

  private buildShipmentQueryParams(query: PplShipmentQuery): URLSearchParams {
    const params = new URLSearchParams({
      Limit: String(query.limit || 100),
      Offset: String(query.offset || 0),
    })

    const arrayParams: [string[] | undefined, string][] = [
      [query.shipmentNumbers, "ShipmentNumbers"],
      [query.invoiceNumbers, "InvoiceNumbers"],
      [query.customerReferences, "CustomerReferences"],
      [query.variableSymbols, "VariableSymbols"],
      [query.shipmentStates, "ShipmentStates"],
    ]

    for (const [values, key] of arrayParams) {
      if (values) {
        for (const value of values) {
          params.append(key, value)
        }
      }
    }

    if (query.dateFrom) {
      params.append("DateFrom", query.dateFrom)
    }
    if (query.dateTo) {
      params.append("DateTo", query.dateTo)
    }

    return params
  }

  /**
   * Get shipment info by shipment numbers (convenience method)
   *
   * @param shipmentNumbers - Array of shipment numbers (max 100 per request)
   */
  async getShipmentsByNumbers(
    shipmentNumbers: string[]
  ): Promise<PplShipmentInfo[]> {
    if (shipmentNumbers.length === 0) {
      return []
    }
    if (shipmentNumbers.length > 100) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PPL: Maximum 100 shipment numbers per request"
      )
    }
    return this.getShipmentInfo({ shipmentNumbers })
  }

  /**
   * Cancel a shipment
   *
   * POST /shipment/{shipmentNumber}/cancel
   *
   * NOTE: Only works BEFORE physical pickup by PPL courier
   *
   * @returns true if cancelled successfully, false if cancellation failed
   */
  async cancelShipment(shipmentNumber: string): Promise<boolean> {
    try {
      await this.makeRequest(`/shipment/${shipmentNumber}/cancel`, {
        method: "POST",
      })
      this.logger.info(`PPL: Shipment ${shipmentNumber} cancelled`)
      return true
    } catch (error) {
      this.logger.warn(
        `PPL: Cancellation failed for ${shipmentNumber}: ${error instanceof Error ? error.message : String(error)}`
      )
      return false
    }
  }

  /**
   * Get access points (ParcelShop, ParcelBox, AlzaBox)
   *
   * GET /accessPoint with query parameters
   */
  async getAccessPoints(
    query: PplAccessPointsQuery = {}
  ): Promise<PplAccessPoint[]> {
    const params = new URLSearchParams({
      Limit: String(query.limit || 1000),
      Offset: String(query.offset || 0),
    })

    if (query.countryCode) {
      params.append("CountryCode", query.countryCode)
    }
    if (query.zipCode) {
      params.append("ZipCode", query.zipCode)
    }
    if (query.city) {
      params.append("City", query.city)
    }
    if (query.accessPointTypes) {
      params.append("AccessPointTypes", query.accessPointTypes)
    }
    if (query.radius) {
      params.append("Radius", String(query.radius))
    }
    if (query.latitude) {
      params.append("Latitude", String(query.latitude))
    }
    if (query.longitude) {
      params.append("Longitude", String(query.longitude))
    }

    const { data } = await this.makeRequest<
      PplPaginatedResponse<PplAccessPoint> | PplAccessPoint[]
    >(`/accessPoint?${params}`)
    return Array.isArray(data) ? data : data?.items || []
  }

  /**
   * Get address suggestions (autocomplete)
   *
   * GET /addressWhisper
   */
  async getAddressWhisper(
    query: PplAddressWhisperQuery
  ): Promise<PplAddressWhisperItem[]> {
    const params = new URLSearchParams()
    if (query.street) {
      params.append("Street", query.street)
    }
    if (query.zipCode) {
      params.append("ZipCode", query.zipCode)
    }
    if (query.city) {
      params.append("City", query.city)
    }
    if (query.calledFrom) {
      params.append("CalledFrom", query.calledFrom)
    }

    const { data } = await this.makeRequest<
      { items: PplAddressWhisperItem[] } | PplAddressWhisperItem[]
    >(`/addressWhisper?${params}`)
    return Array.isArray(data) ? data : data?.items || []
  }

  /**
   * Get products codelist
   */
  async getCodelistProducts(
    query: PplCodelistQuery = { limit: 100, offset: 0 }
  ): Promise<PplCodelistProduct[]> {
    return this.fetchCodelist<PplCodelistProduct>("product", query)
  }

  /**
   * Get countries codelist
   */
  async getCodelistCountries(
    query: PplCodelistQuery = { limit: 100, offset: 0 }
  ): Promise<PplCodelistCountry[]> {
    return this.fetchCodelist<PplCodelistCountry>("country", query)
  }

  /**
   * Get currencies codelist
   */
  async getCodelistCurrencies(
    query: PplCodelistQuery = { limit: 100, offset: 0 }
  ): Promise<PplCodelistCurrency[]> {
    return this.fetchCodelist<PplCodelistCurrency>("currency", query)
  }

  /**
   * Get services codelist
   */
  async getCodelistServices(
    query: PplCodelistQuery = { limit: 100, offset: 0 }
  ): Promise<PplCodelistServiceItem[]> {
    return this.fetchCodelist<PplCodelistServiceItem>("service", query)
  }

  /**
   * Get statuses codelist
   */
  async getCodelistStatuses(
    query: PplCodelistQuery = { limit: 100, offset: 0 }
  ): Promise<PplCodelistStatus[]> {
    return this.fetchCodelist<PplCodelistStatus>("status", query)
  }

  /**
   * Get service price limits
   */
  async getCodelistServicePriceLimits(
    query: PplServicePriceLimitQuery
  ): Promise<PplCodelistServicePriceLimit[]> {
    const params = new URLSearchParams({
      Limit: String(query.limit),
      Offset: String(query.offset),
    })
    if (query.service) {
      params.append("Service", query.service)
    }
    if (query.currency) {
      params.append("Currency", query.currency)
    }
    if (query.country) {
      params.append("Country", query.country)
    }
    if (query.product) {
      params.append("Product", query.product)
    }

    const { data } = await this.makeRequest<
      | PplPaginatedResponse<PplCodelistServicePriceLimit>
      | PplCodelistServicePriceLimit[]
    >(`/codelist/servicePriceLimit?${params}`)
    return Array.isArray(data) ? data : data?.items || []
  }

  /**
   * Generic codelist fetcher
   */
  private async fetchCodelist<T>(
    codelistName: string,
    query: PplCodelistQuery
  ): Promise<T[]> {
    const params = new URLSearchParams({
      Limit: String(query.limit),
      Offset: String(query.offset),
    })

    const { data } = await this.makeRequest<PplPaginatedResponse<T> | T[]>(
      `/codelist/${codelistName}?${params}`
    )
    return Array.isArray(data) ? data : data?.items || []
  }

  /**
   * Get customer information
   *
   * GET /customer
   *
   * @returns Customer info or null if no customer profile is configured (404)
   */
  async getCustomerInfo(): Promise<PplCustomerInfo | null> {
    const { data, status } = await this.makeRequest<PplCustomerInfo>(
      "/customer",
      { allow404: true }
    )
    if (status === 404) {
      this.logger.warn(
        "PPL: No customer profile configured for these credentials"
      )
      return null
    }
    return data
  }

  /**
   * Get customer addresses
   *
   * GET /customer/address
   *
   * @returns Customer addresses or null if no address is configured (404)
   */
  async getCustomerAddresses(): Promise<PplCustomerAddressResponse | null> {
    const { data, status } = await this.makeRequest<PplCustomerAddressResponse>(
      "/customer/address",
      { allow404: true }
    )
    if (status === 404) {
      this.logger.warn("PPL: Customer has no address configured in PPL system")
      return null
    }
    return data
  }

  /**
   * Create order batch (pickup scheduling)
   *
   * POST /order/batch returns HTTP 201 with batchId in Location header
   * NOTE: Uses direct fetch because we need access to Location header
   */
  async createOrderBatch(request: PplOrderBatchRequest): Promise<string> {
    return this.createBatchWithLocationHeader("/order/batch", request, "order")
  }

  /**
   * Get order batch status
   *
   * GET /order/batch/{batchId}
   */
  async getOrderBatchStatus(batchId: string): Promise<PplOrderBatchResponse> {
    return this.get<PplOrderBatchResponse>(`/order/batch/${batchId}`)
  }

  /**
   * Get orders with query filters
   *
   * GET /order
   */
  async getOrders(query: PplOrderQuery): Promise<PplOrder[]> {
    const params = this.buildOrderQueryParams(query)
    const { data } = await this.makeRequest<
      PplPaginatedResponse<PplOrder> | PplOrder[]
    >(`/order?${params}`)
    return Array.isArray(data) ? data : data?.items || []
  }

  private buildOrderQueryParams(query: PplOrderQuery): URLSearchParams {
    const params = new URLSearchParams({
      Limit: String(query.limit),
      Offset: String(query.offset),
    })

    const arrayParams: [string[] | number[] | undefined, string][] = [
      [query.shipmentNumbers, "ShipmentNumbers"],
      [query.customerReferences, "CustomerReferences"],
      [query.orderReferences, "OrderReferences"],
      [query.orderNumbers, "OrderNumbers"],
      [query.orderIds, "OrderIds"],
      [query.orderStates, "OrderStates"],
    ]

    for (const [values, key] of arrayParams) {
      if (values) {
        for (const value of values) {
          params.append(key, String(value))
        }
      }
    }

    if (query.dateFrom) {
      params.append("DateFrom", query.dateFrom)
    }
    if (query.dateTo) {
      params.append("DateTo", query.dateTo)
    }
    if (query.sendDate) {
      params.append("SendDate", query.sendDate)
    }
    if (query.productType) {
      params.append("ProductType", query.productType)
    }

    return params
  }

  /**
   * Cancel an order
   *
   * POST /order/cancel
   */
  async cancelOrder(
    query: PplOrderCancelQuery,
    request?: PplOrderCancelRequest
  ): Promise<boolean> {
    const params = new URLSearchParams()
    if (query.customerReference) {
      params.append("CustomerReference", query.customerReference)
    }
    if (query.orderReference) {
      params.append("OrderReference", query.orderReference)
    }

    try {
      await this.makeRequest(`/order/cancel?${params}`, {
        method: "POST",
        body: request,
      })
      this.logger.info("PPL: Order cancelled")
      return true
    } catch (error) {
      this.logger.warn(
        `PPL: Order cancellation failed: ${error instanceof Error ? error.message : String(error)}`
      )
      return false
    }
  }

  /**
   * Update batch settings
   *
   * PUT /shipment/batch/{batchId}
   */
  async updateBatch(
    batchId: string,
    request: PplBatchUpdateRequest
  ): Promise<void> {
    await this.makeRequest(`/shipment/batch/${batchId}`, {
      method: "PUT",
      body: request,
    })
    this.logger.info(`PPL: Batch ${batchId} updated`)
  }

  /**
   * Get batch labels
   *
   * GET /shipment/batch/{batchId}/label
   */
  async getBatchLabels(
    batchId: string,
    query: PplBatchLabelQuery
  ): Promise<PplBatchLabelResponse> {
    const params = new URLSearchParams({
      Limit: String(query.limit),
      Offset: String(query.offset),
    })
    if (query.pageSize) {
      params.append("PageSize", query.pageSize)
    }
    if (query.position) {
      params.append("Position", String(query.position))
    }
    if (query.orderBy) {
      params.append("OrderBy", query.orderBy)
    }

    return this.get<PplBatchLabelResponse>(
      `/shipment/batch/${batchId}/label?${params}`
    )
  }

  /**
   * Redirect shipment (update contact info)
   *
   * POST /shipment/{shipmentNumber}/redirect
   */
  async redirectShipment(
    shipmentNumber: string,
    request: PplShipmentRedirectRequest
  ): Promise<boolean> {
    try {
      await this.makeRequest(`/shipment/${shipmentNumber}/redirect`, {
        method: "POST",
        body: request,
      })
      this.logger.info(`PPL: Shipment ${shipmentNumber} redirected`)
      return true
    } catch (error) {
      this.logger.warn(
        `PPL: Redirect failed for ${shipmentNumber}: ${error instanceof Error ? error.message : String(error)}`
      )
      return false
    }
  }

  /**
   * Connect shipments into a set
   *
   * POST /shipment/batch/connectSet
   */
  async connectShipmentSet(request: PplConnectSetRequest): Promise<boolean> {
    try {
      await this.makeRequest("/shipment/batch/connectSet", {
        method: "POST",
        body: request,
      })
      this.logger.info(
        `PPL: Shipments connected to set ${request.externalSetNumber}`
      )
      return true
    } catch (error) {
      this.logger.warn(
        `PPL: Connect set failed: ${error instanceof Error ? error.message : String(error)}`
      )
      return false
    }
  }

  /**
   * Get routing information for an address
   *
   * GET /routing
   */
  async getRouting(query: PplRoutingQuery): Promise<PplRoutingResponse> {
    const params = new URLSearchParams({ Country: query.country })
    if (query.parcelShopCode) {
      params.append("ParcelShopCode", query.parcelShopCode)
    }
    if (query.street) {
      params.append("Street", query.street)
    }
    if (query.city) {
      params.append("City", query.city)
    }
    if (query.zipCode) {
      params.append("ZipCode", query.zipCode)
    }
    if (query.productType) {
      params.append("ProductType", query.productType)
    }

    return this.get<PplRoutingResponse>(`/routing?${params}`)
  }

  /**
   * Get API version information
   *
   * GET /versionInformation
   */
  async getVersionInformation(): Promise<PplVersionInformationResponse> {
    return this.get<PplVersionInformationResponse>("/versionInformation")
  }

  /**
   * Get API info
   *
   * GET /info
   */
  async getApiInfo(): Promise<PplApiInfo> {
    return this.get<PplApiInfo>("/info")
  }

  private async throttle(): Promise<void> {
    const now = Date.now()
    const elapsed = now - PplClient.lastRequestTime
    if (elapsed < PplClient.MIN_REQUEST_INTERVAL) {
      await this.sleep(PplClient.MIN_REQUEST_INTERVAL - elapsed)
    }
    PplClient.lastRequestTime = Date.now()
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private isRetryable(status: number): boolean {
    return status === 429 || status >= 500
  }

  /**
   * Creates a batch resource and extracts batchId from Location header
   * Used for both shipment and order batch creation
   */
  private async createBatchWithLocationHeader(
    path: string,
    body: unknown,
    resourceType: string
  ): Promise<string> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= PplClient.MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        const delay = PplClient.INITIAL_RETRY_DELAY_MS * 2 ** (attempt - 1)
        this.logger.debug(
          `PPL: Retry ${attempt}/${PplClient.MAX_RETRIES} after ${delay}ms`
        )
        await this.sleep(delay)
      }

      try {
        const token = await this.getAccessToken()
        await this.throttle()

        const response = await fetch(`${this.baseUrl}${path}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(body),
        })

        if (
          this.isRetryable(response.status) &&
          attempt < PplClient.MAX_RETRIES
        ) {
          const errorText = await response.text()
          lastError = new Error(`${response.status} - ${errorText}`)
          continue
        }

        if (response.status !== 201) {
          const errorText = await response.text()
          this.logger.error(`PPL ${resourceType} batch failed: ${errorText}`)
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `PPL ${resourceType} creation failed: ${errorText}`
          )
        }

        const location = response.headers.get("Location")
        const batchId = location?.split("/").pop()

        if (!batchId) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `PPL: No batchId returned in Location header for ${resourceType}`
          )
        }

        this.logger.info(`PPL: ${resourceType} batch created: ${batchId}`)
        return batchId
      } catch (error) {
        if (error instanceof MedusaError) {
          throw error
        }
        lastError = error instanceof Error ? error : new Error(String(error))
        if (attempt === PplClient.MAX_RETRIES) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `PPL ${resourceType} batch failed after ${PplClient.MAX_RETRIES + 1} attempts: ${lastError.message}`
          )
        }
      }
    }

    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `PPL ${resourceType} batch failed: ${lastError?.message || "Unknown error"}`
    )
  }

  private async get<T>(path: string): Promise<T> {
    const { data } = await this.makeRequest<T>(path)
    return data as T
  }

  private async makeRequest<T>(
    path: string,
    options: RequestOptionsWithAllow404 = {}
  ): Promise<{ data: T | null; status: number }> {
    const {
      method = "GET",
      body,
      expectedStatus = 200,
      allow404 = false,
    } = options
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= PplClient.MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        const delay = PplClient.INITIAL_RETRY_DELAY_MS * 2 ** (attempt - 1)
        this.logger.debug(
          `PPL: Retry ${attempt}/${PplClient.MAX_RETRIES} after ${delay}ms`
        )
        await this.sleep(delay)
      }

      try {
        const token = await this.getAccessToken()
        await this.throttle()

        const headers: Record<string, string> = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
        if (body) {
          headers["Content-Type"] = "application/json"
        }

        const response = await fetch(`${this.baseUrl}${path}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        })

        if (allow404 && response.status === 404) {
          return { data: null, status: 404 }
        }

        if (
          this.isRetryable(response.status) &&
          attempt < PplClient.MAX_RETRIES
        ) {
          const errorText = await response.text()
          lastError = new Error(`${response.status} - ${errorText}`)
          continue
        }

        if (response.status !== expectedStatus && !response.ok) {
          const errorText = await response.text()
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `PPL request failed: ${response.status} - ${errorText}`
          )
        }

        const data =
          response.status === 204 ? null : ((await response.json()) as T)
        return { data, status: response.status }
      } catch (error) {
        if (error instanceof MedusaError) {
          throw error
        }
        lastError = error instanceof Error ? error : new Error(String(error))
        if (attempt === PplClient.MAX_RETRIES) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `PPL request failed after ${PplClient.MAX_RETRIES + 1} attempts: ${lastError.message}`
          )
        }
      }
    }

    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `PPL request failed: ${lastError?.message || "Unknown error"}`
    )
  }
}
