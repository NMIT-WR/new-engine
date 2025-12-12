import type { ICachingModuleService, Logger } from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { PplClient } from "./client"
import type {
  PplAccessPoint,
  PplAccessPointsQuery,
  PplBatchResponse,
  PplCodelistCountry,
  PplCodelistCurrency,
  PplCustomerAddressResponse,
  PplCustomerInfo,
  PplLabelSettings,
  PplOptions,
  PplReturnChannel,
  PplShipmentInfo,
  PplShipmentQuery,
  PplShipmentRequest,
} from "./types"

type InjectedDependencies = {
  logger: Logger
  [Modules.CACHING]?: ICachingModuleService
}

/**
 * PPL Client Module Service
 *
 * Manages the PPL API client lifecycle and exposes PPL operations.
 * This module is only registered when PPL_ENABLED=1, so if we get here
 * the configuration must be valid.
 */
export class PplClientModuleService {
  private readonly client_: PplClient
  private readonly logger_: Logger

  constructor(container: InjectedDependencies, options: PplOptions) {
    this.logger_ = container.logger

    if (!this.validateOptions(options)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PPL: Missing required configuration (client_id, client_secret, environment, default_label_format)"
      )
    }

    const cacheService = container[Modules.CACHING] ?? null
    if (!cacheService) {
      this.logger_.debug(
        "PPL: Cache service not available, codelists will not be cached"
      )
    }

    this.client_ = new PplClient(options, this.logger_, cacheService)
  }

  private validateOptions(opts: Partial<PplOptions>): opts is PplOptions {
    return !!(
      opts?.client_id &&
      opts?.client_secret &&
      opts?.environment &&
      opts?.default_label_format
    )
  }

  /**
   * Get the configuration options
   */
  getOptions(): Readonly<PplOptions> {
    return this.client_.getOptions()
  }

  // ============================================
  // Shipment Operations
  // ============================================

  /**
   * Create shipment batch - returns batchId for polling
   */
  async createShipmentBatch(
    shipments: PplShipmentRequest[],
    options?: {
      labelSettings?: PplLabelSettings
      returnChannel?: PplReturnChannel
      shipmentsOrderBy?: string
    }
  ): Promise<string> {
    return this.client_.createShipmentBatch(shipments, options)
  }

  /**
   * Get batch status
   */
  async getBatchStatus(batchId: string): Promise<PplBatchResponse> {
    return this.client_.getBatchStatus(batchId)
  }

  /**
   * Download label as Buffer for S3 storage
   */
  async downloadLabel(labelUrl: string): Promise<Buffer> {
    return this.client_.downloadLabel(labelUrl)
  }

  /**
   * Get shipment information and tracking status
   */
  async getShipmentInfo(query: PplShipmentQuery): Promise<PplShipmentInfo[]> {
    return this.client_.getShipmentInfo(query)
  }

  /**
   * Cancel a shipment
   * @returns true if cancelled successfully, false if cancellation failed
   */
  async cancelShipment(shipmentNumber: string): Promise<boolean> {
    return this.client_.cancelShipment(shipmentNumber)
  }

  // ============================================
  // Access Points
  // ============================================

  /**
   * Get access points (ParcelShop, ParcelBox, AlzaBox)
   */
  async getAccessPoints(
    query: PplAccessPointsQuery = {}
  ): Promise<PplAccessPoint[]> {
    return this.client_.getAccessPoints(query)
  }

  // ============================================
  // Cached Codelists
  // ============================================

  /**
   * Get countries with caching (24h TTL)
   */
  async getCachedCountries(): Promise<PplCodelistCountry[]> {
    return this.client_.getCachedCountries()
  }

  /**
   * Get currencies with caching (24h TTL)
   */
  async getCachedCurrencies(): Promise<PplCodelistCurrency[]> {
    return this.client_.getCachedCurrencies()
  }

  // ============================================
  // Customer Info
  // ============================================

  /**
   * Get customer information
   */
  async getCustomerInfo(): Promise<PplCustomerInfo | null> {
    return this.client_.getCustomerInfo()
  }

  /**
   * Get customer addresses
   */
  async getCustomerAddresses(): Promise<PplCustomerAddressResponse | null> {
    return this.client_.getCustomerAddresses()
  }
}
