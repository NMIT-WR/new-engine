import { MedusaError } from "@medusajs/framework/utils"
import type { Logger } from "@medusajs/framework/types"
import { OAuth2Client } from "@badgateway/oauth2-client"
import type {
  PplOptions,
  PplShipmentRequest,
  PplBatchResponse,
  PplAccessPoint,
  PplShipmentInfo,
  PplAccessPointsQuery,
  PplLabelSettings,
  PplReturnChannel,
  PplPaginatedResponse,
  PplShipmentQuery,
  PplBatchUpdateRequest,
  PplBatchLabelQuery,
  PplBatchLabelResponse,
  PplShipmentRedirectRequest,
  PplConnectSetRequest,
  PplAddressWhisperQuery,
  PplAddressWhisperItem,
  PplCodelistQuery,
  PplCodelistProduct,
  PplCodelistCountry,
  PplCodelistCurrency,
  PplCodelistServiceItem,
  PplCodelistStatus,
  PplServicePriceLimitQuery,
  PplCodelistServicePriceLimit,
  PplCustomerInfo,
  PplCustomerAddressResponse,
  PplOrderBatchRequest,
  PplOrderBatchResponse,
  PplOrderQuery,
  PplOrder,
  PplOrderCancelRequest,
  PplOrderCancelQuery,
  PplRoutingQuery,
  PplRoutingResponse,
  PplVersionInformationResponse,
  PplApiInfo,
} from "./types"

/**
 * PPL CPL API Base URLs by environment
 */
const BASE_URLS = {
  testing: "https://api-dev.dhl.com/ecs/ppl/myapi2",
  production: "https://api.dhl.com/ecs/ppl/myapi2",
} as const

/**
 * PPL CPL API Client
 *
 * Handles OAuth 2.0 authentication via @badgateway/oauth2-client,
 * rate limiting, and all API operations.
 *
 * Rate Limits:
 * - Token requests: 12/minute max
 * - Request interval: 40ms minimum between requests
 * - Shipments per batch: 1,000 max
 * - Orders per status request: 100 max
 */
export class PplClient {
  private readonly options: PplOptions
  private readonly logger: Logger
  private readonly oauth2Client: OAuth2Client
  private cachedAccessToken: string | null = null
  private tokenExpiresAt: number = 0
  private lastRequestTime = 0
  private readonly MIN_REQUEST_INTERVAL = 40 // ms
  private readonly TOKEN_BUFFER_MS = 60_000 // 60s buffer before expiry

  constructor(options: PplOptions, logger: Logger) {
    this.options = options
    this.logger = logger

    // Initialize OAuth2 client
    this.oauth2Client = new OAuth2Client({
      server: this.baseUrl,
      tokenEndpoint: "/ecs/ppl/myapi2/login/getAccessToken",
      clientId: options.client_id,
      clientSecret: options.client_secret,
      authenticationMethod: "client_secret_post",
    })
  }

  private get baseUrl(): string {
    return BASE_URLS[this.options.environment]
  }

  /**
   * Get OAuth 2.0 access token using @badgateway/oauth2-client
   * Token is cached with 60s buffer before expiry
   */
  async getAccessToken(): Promise<string> {
    // Return cached token if still valid (with 60s safety buffer)
    if (
      this.cachedAccessToken &&
      this.tokenExpiresAt > Date.now() + this.TOKEN_BUFFER_MS
    ) {
      return this.cachedAccessToken
    }

    await this.throttle()

    try {
      // Use client credentials grant with custom scope
      const tokenResponse = await this.oauth2Client.clientCredentials({
        scope: ["myapi2"],
      })

      this.cachedAccessToken = tokenResponse.accessToken
      // Calculate expiry time (expiresAt is a timestamp in seconds)
      this.tokenExpiresAt = tokenResponse.expiresAt
        ? tokenResponse.expiresAt * 1000
        : Date.now() + 1800 * 1000 // Default 30 min if not provided

      this.logger.debug("PPL: OAuth token obtained/refreshed via OAuth2Client")

      return this.cachedAccessToken
    } catch (error) {
      this.logger.error('PPL auth failed', error instanceof Error ? error : new Error(String(error)))
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
    const token = await this.getAccessToken()
    await this.throttle()

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

    const response = await fetch(`${this.baseUrl}/shipment/batch`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })

    if (response.status !== 201) {
      const error = await response.text()
      this.logger.error(`PPL shipment batch failed: ${error}`)
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL shipment creation failed: ${error}`
      )
    }

    // batchId is in Location header: /shipment/batch/{batchId}
    const location = response.headers.get("Location")
    const batchId = location?.split("/").pop()

    if (!batchId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PPL: No batchId returned in Location header"
      )
    }

    this.logger.info(`PPL: Shipment batch created: ${batchId}`)
    return batchId
  }

  /**
   * Get batch status
   */
  async getBatchStatus(batchId: string): Promise<PplBatchResponse> {
    const token = await this.getAccessToken()
    await this.throttle()

    const response = await fetch(`${this.baseUrl}/shipment/batch/${batchId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL batch status check failed: ${response.status} - ${error}`
      )
    }

    return (await response.json()) as PplBatchResponse
  }

  /**
   * Poll until batch processing is complete
   *
   * Typically takes ~2 seconds for single shipment
   *
   * @param batchId - Batch ID from createShipmentBatch
   * @param maxAttempts - Maximum poll attempts (default: 30)
   * @param intervalMs - Interval between polls in ms (default: 500)
   */
  async pollUntilComplete(
    batchId: string,
    maxAttempts = 30,
    intervalMs = 500
  ): Promise<PplBatchResponse> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const batch = await this.getBatchStatus(batchId)

      if (batch.importState === "Complete") {
        this.logger.info(
          `PPL: Batch ${batchId} completed after ${attempt + 1} polls`
        )
        return batch
      }

      if (batch.importState === "Error") {
        const errors = batch.items
          .filter((item) => item.errorMessage)
          .map((item) => `${item.referenceId}: ${item.errorMessage}`)
          .join("; ")
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `PPL batch failed: ${errors || "Unknown error"}`
        )
      }

      // Still processing (Received or InProcess), wait and retry
      this.logger.debug(
        `PPL: Batch ${batchId} state: ${batch.importState}, attempt ${attempt + 1}/${maxAttempts}`
      )
      await this.sleep(intervalMs)
    }

    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `PPL batch ${batchId} timed out after ${maxAttempts} attempts`
    )
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
    const token = await this.getAccessToken()
    await this.throttle()

    const params = new URLSearchParams({
      Limit: String(query.limit || 100),
      Offset: String(query.offset || 0),
    })

    if (query.shipmentNumbers) {
      for (const num of query.shipmentNumbers) {
        params.append("ShipmentNumbers", num)
      }
    }
    if (query.invoiceNumbers) {
      for (const num of query.invoiceNumbers) {
        params.append("InvoiceNumbers", num)
      }
    }
    if (query.customerReferences) {
      for (const ref of query.customerReferences) {
        params.append("CustomerReferences", ref)
      }
    }
    if (query.variableSymbols) {
      for (const sym of query.variableSymbols) {
        params.append("VariableSymbols", sym)
      }
    }
    if (query.dateFrom) params.append("DateFrom", query.dateFrom)
    if (query.dateTo) params.append("DateTo", query.dateTo)
    if (query.shipmentStates) {
      for (const state of query.shipmentStates) {
        params.append("ShipmentStates", state)
      }
    }

    const response = await fetch(`${this.baseUrl}/shipment?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL shipment info fetch failed: ${response.status} - ${error}`
      )
    }

    const data = (await response.json()) as
      | PplPaginatedResponse<PplShipmentInfo>
      | PplShipmentInfo[]

    // API may return array directly or wrapped in items
    return Array.isArray(data) ? data : data.items || []
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
    const token = await this.getAccessToken()
    await this.throttle()

    const response = await fetch(
      `${this.baseUrl}/shipment/${shipmentNumber}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    )

    if (!response.ok) {
      const error = await response.text()
      this.logger.warn(
        `PPL: Cancellation failed for ${shipmentNumber}: ${response.status} - ${error}`
      )
      return false
    }

    this.logger.info(`PPL: Shipment ${shipmentNumber} cancelled`)
    return true
  }

  /**
   * Get access points (ParcelShop, ParcelBox, AlzaBox)
   *
   * GET /accessPoint with query parameters
   */
  async getAccessPoints(
    query: PplAccessPointsQuery = {}
  ): Promise<PplAccessPoint[]> {
    const token = await this.getAccessToken()
    await this.throttle()

    const params = new URLSearchParams({
      Limit: String(query.limit || 1000),
      Offset: String(query.offset || 0),
    })

    if (query.countryCode) params.append("CountryCode", query.countryCode)
    if (query.zipCode) params.append("ZipCode", query.zipCode)
    if (query.city) params.append("City", query.city)
    if (query.accessPointTypes)
      params.append("AccessPointTypes", query.accessPointTypes)
    if (query.radius) params.append("Radius", String(query.radius))
    if (query.latitude) params.append("Latitude", String(query.latitude))
    if (query.longitude) params.append("Longitude", String(query.longitude))

    const response = await fetch(`${this.baseUrl}/accessPoint?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL access points fetch failed: ${response.status} - ${error}`
      )
    }

    const data = (await response.json()) as
      | PplPaginatedResponse<PplAccessPoint>
      | PplAccessPoint[]

    return Array.isArray(data) ? data : data.items || []
  }

  /**
   * Get address suggestions (autocomplete)
   *
   * GET /addressWhisper
   */
  async getAddressWhisper(
    query: PplAddressWhisperQuery
  ): Promise<PplAddressWhisperItem[]> {
    const token = await this.getAccessToken()
    await this.throttle()

    const params = new URLSearchParams()
    if (query.street) params.append("Street", query.street)
    if (query.zipCode) params.append("ZipCode", query.zipCode)
    if (query.city) params.append("City", query.city)
    if (query.calledFrom) params.append("CalledFrom", query.calledFrom)

    const response = await fetch(`${this.baseUrl}/addressWhisper?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL address whisper failed: ${response.status} - ${error}`
      )
    }

    const data = (await response.json()) as
      | { items: PplAddressWhisperItem[] }
      | PplAddressWhisperItem[]

    return Array.isArray(data) ? data : data.items || []
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
    const token = await this.getAccessToken()
    await this.throttle()

    const params = new URLSearchParams({
      Limit: String(query.limit),
      Offset: String(query.offset),
    })
    if (query.service) params.append("Service", query.service)
    if (query.currency) params.append("Currency", query.currency)
    if (query.country) params.append("Country", query.country)
    if (query.product) params.append("Product", query.product)

    const response = await fetch(
      `${this.baseUrl}/codelist/servicePriceLimit?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL codelist servicePriceLimit fetch failed: ${response.status} - ${error}`
      )
    }

    const data = (await response.json()) as
      | PplPaginatedResponse<PplCodelistServicePriceLimit>
      | PplCodelistServicePriceLimit[]

    return Array.isArray(data) ? data : data.items || []
  }

  /**
   * Generic codelist fetcher
   */
  private async fetchCodelist<T>(
    codelistName: string,
    query: PplCodelistQuery
  ): Promise<T[]> {
    const token = await this.getAccessToken()
    await this.throttle()

    const params = new URLSearchParams({
      Limit: String(query.limit),
      Offset: String(query.offset),
    })

    const response = await fetch(
      `${this.baseUrl}/codelist/${codelistName}?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL codelist ${codelistName} fetch failed: ${response.status} - ${error}`
      )
    }

    const data = (await response.json()) as PplPaginatedResponse<T> | T[]
    return Array.isArray(data) ? data : data.items || []
  }

  /**
   * Get customer information
   *
   * GET /customer
   *
   * @returns Customer info or null if no customer profile is configured (404)
   */
  async getCustomerInfo(): Promise<PplCustomerInfo | null> {
    const token = await this.getAccessToken()
    await this.throttle()

    const response = await fetch(`${this.baseUrl}/customer`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    // 404 means no customer profile configured for these OAuth credentials
    if (response.status === 404) {
      this.logger.warn("PPL: No customer profile configured for these credentials")
      return null
    }

    if (!response.ok) {
      const error = await response.text()
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL customer info fetch failed: ${response.status} - ${error}`
      )
    }

    return (await response.json()) as PplCustomerInfo
  }

  /**
   * Get customer addresses
   *
   * GET /customer/address
   *
   * @returns Customer addresses or null if no address is configured (404)
   */
  async getCustomerAddresses(): Promise<PplCustomerAddressResponse | null> {
    const token = await this.getAccessToken()
    await this.throttle()

    const response = await fetch(`${this.baseUrl}/customer/address`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    // 404 means customer has no address configured - return null instead of throwing
    if (response.status === 404) {
      this.logger.warn("PPL: Customer has no address configured in PPL system")
      return null
    }

    if (!response.ok) {
      const error = await response.text()
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL customer addresses fetch failed: ${response.status} - ${error}`
      )
    }

    return (await response.json()) as PplCustomerAddressResponse
  }

  /**
   * Create order batch (pickup scheduling)
   *
   * POST /order/batch returns HTTP 201 with batchId in Location header
   */
  async createOrderBatch(request: PplOrderBatchRequest): Promise<string> {
    const token = await this.getAccessToken()
    await this.throttle()

    const response = await fetch(`${this.baseUrl}/order/batch`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(request),
    })

    if (response.status !== 201) {
      const error = await response.text()
      this.logger.error(`PPL order batch failed: ${error}`)
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL order creation failed: ${error}`
      )
    }

    const location = response.headers.get("Location")
    const batchId = location?.split("/").pop()

    if (!batchId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PPL: No batchId returned in Location header for order"
      )
    }

    this.logger.info(`PPL: Order batch created: ${batchId}`)
    return batchId
  }

  /**
   * Get order batch status
   *
   * GET /order/batch/{batchId}
   */
  async getOrderBatchStatus(batchId: string): Promise<PplOrderBatchResponse> {
    const token = await this.getAccessToken()
    await this.throttle()

    const response = await fetch(`${this.baseUrl}/order/batch/${batchId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL order batch status check failed: ${response.status} - ${error}`
      )
    }

    return (await response.json()) as PplOrderBatchResponse
  }

  /**
   * Get orders with query filters
   *
   * GET /order
   */
  async getOrders(query: PplOrderQuery): Promise<PplOrder[]> {
    const token = await this.getAccessToken()
    await this.throttle()

    const params = new URLSearchParams({
      Limit: String(query.limit),
      Offset: String(query.offset),
    })

    if (query.shipmentNumbers) {
      for (const num of query.shipmentNumbers) {
        params.append("ShipmentNumbers", num)
      }
    }
    if (query.customerReferences) {
      for (const ref of query.customerReferences) {
        params.append("CustomerReferences", ref)
      }
    }
    if (query.orderReferences) {
      for (const ref of query.orderReferences) {
        params.append("OrderReferences", ref)
      }
    }
    if (query.orderNumbers) {
      for (const num of query.orderNumbers) {
        params.append("OrderNumbers", num)
      }
    }
    if (query.orderIds) {
      for (const id of query.orderIds) {
        params.append("OrderIds", String(id))
      }
    }
    if (query.dateFrom) params.append("DateFrom", query.dateFrom)
    if (query.dateTo) params.append("DateTo", query.dateTo)
    if (query.sendDate) params.append("SendDate", query.sendDate)
    if (query.productType) params.append("ProductType", query.productType)
    if (query.orderStates) {
      for (const state of query.orderStates) {
        params.append("OrderStates", state)
      }
    }

    const response = await fetch(`${this.baseUrl}/order?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL orders fetch failed: ${response.status} - ${error}`
      )
    }

    const data = (await response.json()) as
      | PplPaginatedResponse<PplOrder>
      | PplOrder[]

    return Array.isArray(data) ? data : data.items || []
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
    const token = await this.getAccessToken()
    await this.throttle()

    const params = new URLSearchParams()
    if (query.customerReference)
      params.append("CustomerReference", query.customerReference)
    if (query.orderReference)
      params.append("OrderReference", query.orderReference)

    const response = await fetch(`${this.baseUrl}/order/cancel?${params}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: request ? JSON.stringify(request) : undefined,
    })

    if (!response.ok) {
      const error = await response.text()
      this.logger.warn(`PPL: Order cancellation failed: ${response.status} - ${error}`)
      return false
    }

    this.logger.info(`PPL: Order cancelled`)
    return true
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
    const token = await this.getAccessToken()
    await this.throttle()

    const response = await fetch(`${this.baseUrl}/shipment/batch/${batchId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL batch update failed: ${response.status} - ${error}`
      )
    }

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
    const token = await this.getAccessToken()
    await this.throttle()

    const params = new URLSearchParams({
      Limit: String(query.limit),
      Offset: String(query.offset),
    })
    if (query.pageSize) params.append("PageSize", query.pageSize)
    if (query.position) params.append("Position", String(query.position))
    if (query.orderBy) params.append("OrderBy", query.orderBy)

    const response = await fetch(
      `${this.baseUrl}/shipment/batch/${batchId}/label?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL batch labels fetch failed: ${response.status} - ${error}`
      )
    }

    return (await response.json()) as PplBatchLabelResponse
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
    const token = await this.getAccessToken()
    await this.throttle()

    const response = await fetch(
      `${this.baseUrl}/shipment/${shipmentNumber}/redirect`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(request),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      this.logger.warn(
        `PPL: Redirect failed for ${shipmentNumber}: ${response.status} - ${error}`
      )
      return false
    }

    this.logger.info(`PPL: Shipment ${shipmentNumber} redirected`)
    return true
  }

  /**
   * Connect shipments into a set
   *
   * POST /shipment/batch/connectSet
   */
  async connectShipmentSet(request: PplConnectSetRequest): Promise<boolean> {
    const token = await this.getAccessToken()
    await this.throttle()

    const response = await fetch(`${this.baseUrl}/shipment/batch/connectSet`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.text()
      this.logger.warn(`PPL: Connect set failed: ${response.status} - ${error}`)
      return false
    }

    this.logger.info(
      `PPL: Shipments connected to set ${request.externalSetNumber}`
    )
    return true
  }

  /**
   * Get routing information for an address
   *
   * GET /routing
   */
  async getRouting(query: PplRoutingQuery): Promise<PplRoutingResponse> {
    const token = await this.getAccessToken()
    await this.throttle()

    const params = new URLSearchParams({
      Country: query.country,
    })
    if (query.parcelShopCode)
      params.append("ParcelShopCode", query.parcelShopCode)
    if (query.street) params.append("Street", query.street)
    if (query.city) params.append("City", query.city)
    if (query.zipCode) params.append("ZipCode", query.zipCode)
    if (query.productType) params.append("ProductType", query.productType)

    const response = await fetch(`${this.baseUrl}/routing?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL routing fetch failed: ${response.status} - ${error}`
      )
    }

    return (await response.json()) as PplRoutingResponse
  }

  /**
   * Get API version information
   *
   * GET /versionInformation
   */
  async getVersionInformation(): Promise<PplVersionInformationResponse> {
    const token = await this.getAccessToken()
    await this.throttle()

    const response = await fetch(`${this.baseUrl}/versionInformation`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL version info fetch failed: ${response.status} - ${error}`
      )
    }

    return (await response.json()) as PplVersionInformationResponse
  }

  /**
   * Get API info
   *
   * GET /info
   */
  async getApiInfo(): Promise<PplApiInfo> {
    const token = await this.getAccessToken()
    await this.throttle()

    const response = await fetch(`${this.baseUrl}/info`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL API info fetch failed: ${response.status} - ${error}`
      )
    }

    return (await response.json()) as PplApiInfo
  }

  /**
   * Ensure minimum 40ms between requests
   */
  private async throttle(): Promise<void> {
    const now = Date.now()
    const elapsed = now - this.lastRequestTime
    if (elapsed < this.MIN_REQUEST_INTERVAL) {
      await this.sleep(this.MIN_REQUEST_INTERVAL - elapsed)
    }
    this.lastRequestTime = Date.now()
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
