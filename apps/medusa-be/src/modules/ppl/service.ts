import {
  AbstractFulfillmentProviderService,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import type {
  CalculatedShippingOptionPrice,
  CalculateShippingOptionPriceDTO,
  CreateFulfillmentResult,
  CreateShippingOptionDTO,
  FulfillmentDTO,
  FulfillmentItemDTO,
  FulfillmentOption,
  FulfillmentOrderDTO,
  IFileModuleService,
  Logger,
  MedusaContainer,
  ValidateFulfillmentDataContext,
} from "@medusajs/framework/types"
import { PplClient } from "./client"
import type {
  PplOptions,
  PplShipmentRequest,
  PplCodSettings,
  PplFulfillmentData,
  PplShippingOptionData,
  PplProductType,
} from "./types"

type InjectedDependencies = {
  logger: Logger
}

/**
 * PPL Fulfillment Provider Service
 *
 * Implements PPL CPL API integration for Medusa 2 fulfillment.
 * Supports:
 * - Pickup points (ParcelShop, ParcelBox, AlzaBox)
 * - Cash on Delivery (CZK only)
 * - PNG label generation and S3/MinIO storage
 */
class PplFulfillmentProviderService extends AbstractFulfillmentProviderService {
  static override identifier = "ppl"

  protected readonly logger_: Logger
  protected readonly options_: PplOptions
  protected readonly client: PplClient
  protected readonly container_: MedusaContainer

  constructor(
    container: MedusaContainer & InjectedDependencies,
    options: PplOptions
  ) {
    super()
    this.logger_ = container.logger
    this.options_ = options
    this.client = new PplClient(options, container.logger)
    this.container_ = container
  }

  /**
   * Returns available PPL shipping options for admin UI
   */
  override async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    return [
      {
        id: "ppl-parcel-smart",
        name: "PPL Parcel Smart (ParcelShop/ParcelBox)",
        product_type: "SMAR" as PplProductType,
        requires_access_point: true,
        supports_cod: false,
      },
      {
        id: "ppl-parcel-smart-cod",
        name: "PPL Parcel Smart + COD",
        product_type: "SMAD" as PplProductType,
        requires_access_point: true,
        supports_cod: true,
      },
      {
        id: "ppl-private",
        name: "PPL Private (Home Delivery)",
        product_type: "PRIV" as PplProductType,
        requires_access_point: false,
        supports_cod: false,
      },
      {
        id: "ppl-private-cod",
        name: "PPL Private + COD (Home Delivery)",
        product_type: "PRID" as PplProductType,
        requires_access_point: false,
        supports_cod: true,
      },
    ]
  }

  /**
   * Validates shipping option configuration
   */
  override async validateOption(
    data: Record<string, unknown>
  ): Promise<boolean> {
    const validProducts: PplProductType[] = ["SMAR", "SMAD", "PRIV", "PRID"]
    return validProducts.includes(data.product_type as PplProductType)
  }

  /**
   * Called during checkout when customer selects shipping method
   * Validates and stores access point selection from PPL Widget
   */
  override async validateFulfillmentData(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    _context: ValidateFulfillmentDataContext
  ): Promise<Record<string, unknown>> {
    const requiresAccessPoint = optionData.requires_access_point as boolean

    // If this option requires access point, validate it was selected
    if (requiresAccessPoint) {
      const accessPointId = data.access_point_id as string | undefined
      if (!accessPointId) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "PPL: Access point (pickup location) is required for this shipping method"
        )
      }

      this.logger_.debug(`PPL: Access point selected: ${accessPointId}`)
    }

    // Return data to be stored in shipping_method.data
    const shippingOptionData: PplShippingOptionData = {
      product_type: optionData.product_type as PplProductType,
      requires_access_point: requiresAccessPoint,
      supports_cod: optionData.supports_cod as boolean,
      access_point_id: data.access_point_id as string | undefined,
      access_point_name: data.access_point_name as string | undefined,
      access_point_type: data.access_point_type as string | undefined,
    }

    return shippingOptionData as unknown as Record<string, unknown>
  }

  /**
   * Called when admin creates fulfillment for an order
   * Creates shipment in PPL, downloads label, stores in S3
   */
  override async createFulfillment(
    data: Record<string, unknown>,
    items: Partial<Omit<FulfillmentItemDTO, "fulfillment">>[],
    order: Partial<FulfillmentOrderDTO> | undefined,
    fulfillment: Partial<
      Omit<FulfillmentDTO, "provider_id" | "data" | "items">
    >
  ): Promise<CreateFulfillmentResult> {
    const shippingData = data as unknown as PplShippingOptionData
    const productType = shippingData.product_type
    const accessPointId = shippingData.access_point_id
    const supportsCod = shippingData.supports_cod

    if (!order) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PPL: Order is required for fulfillment"
      )
    }

    // Build recipient address from order shipping address
    const shippingAddress = order.shipping_address
    if (!shippingAddress) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PPL: Shipping address is required"
      )
    }

    const recipient = {
      name: this.truncate(
        `${shippingAddress.first_name || ""} ${shippingAddress.last_name || ""}`.trim(),
        50
      ),
      street: this.truncate(shippingAddress.address_1 || "", 60),
      city: this.truncate(shippingAddress.city || "", 50),
      zipCode: shippingAddress.postal_code || "",
      country: (shippingAddress.country_code || "CZ").toUpperCase(),
      phone: this.truncate(shippingAddress.phone || "", 30),
      email: this.truncate(order.email || "", 50),
    }

    // Build COD settings if applicable
    let codSettings: PplCodSettings | undefined
    if (supportsCod) { //TODO: potentially add status of payment?
      const codAmount = order.total as number
      if (!codAmount) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "PPL: Order total is required for COD"
        )
      }

      // Generate variable symbol from order ID
      const orderId =
        order.display_id?.toString() ||
        order.id?.substring(0, 10) ||
        ""

      codSettings = {
        codPrice: codAmount,
        codCurrency: "CZK",
        codVarSym: orderId,
        ...(this.options_.cod_iban
          ? {
              iban: this.options_.cod_iban,
              swift: this.options_.cod_swift,
            }
          : {
              bankAccount: this.options_.cod_bank_account,
              bankCode: this.options_.cod_bank_code,
            }),
      }
    }

    // Check if PPL customer profile is configured (warn if not)
    const customerInfo = await this.client.getCustomerInfo()
    if (!customerInfo) {
      this.logger_.warn(
        "PPL: Customer profile not configured (GET /customer returned 404). " +
        "Shipment creation may fail with 'Invalid customer'. " +
        "Contact PPL support at ithelp@ppl.cz to set up your customer profile."
      )
    }

    // Check if PPL customer has sender address configured, otherwise use fallback
    let sender: PplShipmentRequest["sender"] | undefined
    const customerAddresses = await this.client.getCustomerAddresses()

    if (!customerAddresses || customerAddresses.items.length === 0) {
      // No PPL address configured - check for fallback sender in options
      const { sender_name, sender_street, sender_city, sender_zip_code, sender_country } = this.options_

      if (!sender_name || !sender_street || !sender_city || !sender_zip_code || !sender_country) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "PPL: No sender address configured in PPL system and no fallback sender address provided. " +
          "Please configure a sender address in your PPL account or set COMPANY_ADDRESS_* environment variables."
        )
      }

      sender = {
        name: sender_name,
        street: sender_street,
        city: sender_city,
        zipCode: sender_zip_code,
        country: sender_country,
        ...(this.options_.sender_phone && { phone: this.options_.sender_phone }),
        ...(this.options_.sender_email && { email: this.options_.sender_email }),
      }

      this.logger_.info("PPL: Using fallback sender address from environment variables")
    }

    // Build shipment request
    const fulfillmentId = fulfillment.id || `temp-${Date.now()}`
    const shipmentRequest: PplShipmentRequest = {
      referenceId: fulfillmentId,
      productType,
      recipient,
      ...(sender && { sender }),
      externalNumbers: [
        {
          code: "CUST",
          externalNumber:
            order.display_id?.toString() || order.id || "",
        },
      ],
      ...(accessPointId && {
        specificDelivery: { parcelShopCode: accessPointId },
      }),
      ...(codSettings && { cashOnDelivery: codSettings }),
    }

    this.logger_.info(
      `PPL: Creating shipment for fulfillment ${fulfillmentId}, product: ${productType}`
    )

    // Create shipment in PPL
    const batchId = await this.client.createShipmentBatch([shipmentRequest])

    // Poll until complete (typically ~2 seconds)
    const batchResult = await this.client.pollUntilComplete(batchId)

    const shipmentResult = batchResult.items[0]
    if (!shipmentResult || shipmentResult.errorMessage) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PPL shipment failed: ${shipmentResult?.errorMessage || "Unknown error"}`
      )
    }

    if (!shipmentResult.shipmentNumber || !shipmentResult.labelUrl) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PPL: Shipment created but missing shipment number or label URL"
      )
    }

    // Download label and upload to S3/MinIO
    let storedLabelUrl: string = shipmentResult.labelUrl
    try {
      const labelBuffer = await this.client.downloadLabel(
        shipmentResult.labelUrl
      )
      const fileService = this.container_.resolve<IFileModuleService>(
        Modules.FILE
      )

      const uploadedFiles = await fileService.createFiles([
        {
          filename: `ppl-label-${shipmentResult.shipmentNumber}.png`,
          mimeType: "image/png",
          content: labelBuffer.toString("base64"),
        },
      ])

      if (uploadedFiles[0]) {
        storedLabelUrl = uploadedFiles[0].url
      }
      this.logger_.info(`PPL: Label stored at ${storedLabelUrl}`)
    } catch (error) {
      this.logger_.warn(
        `PPL: Failed to store label in S3: ${error instanceof Error ? error.message : String(error)}. Using PPL URL.`
      )
      // Continue with PPL URL - label is still accessible
    }

    const trackingUrl =
      shipmentResult.trackingUrl ||
      `https://www.ppl.cz/vyhledat-zasilku?shipmentId=${shipmentResult.shipmentNumber}`

    // Build fulfillment data
    const fulfillmentData: PplFulfillmentData = {
      shipment_number: shipmentResult.shipmentNumber,
      ppl_label_url: shipmentResult.labelUrl,
      label_url: storedLabelUrl,
      tracking_url: trackingUrl,
      access_point_id: accessPointId,
      batch_id: batchId,
      product_type: productType,
    }

    this.logger_.info(
      `PPL: Fulfillment created - Shipment: ${shipmentResult.shipmentNumber}`
    )

    return {
      data: fulfillmentData as unknown as Record<string, unknown>,
      labels: [
        {
          tracking_number: shipmentResult.shipmentNumber,
          tracking_url: trackingUrl,
          label_url: storedLabelUrl,
        },
      ],
    }
  }

  /**
   * Called when admin cancels a fulfillment
   * Uses POST /shipment/{shipmentNumber}/cancel
   * NOTE: Only works BEFORE physical pickup by PPL courier
   */
  override async cancelFulfillment(
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const fulfillmentData = data as unknown as PplFulfillmentData
    const shipmentNumber = fulfillmentData.shipment_number

    if (!shipmentNumber) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PPL: No shipment number found for cancellation"
      )
    }

    this.logger_.info(`PPL: Attempting to cancel shipment ${shipmentNumber}`)

    const cancelled = await this.client.cancelShipment(shipmentNumber)

    if (!cancelled) {
      this.logger_.warn(
        `PPL: Cancellation failed for ${shipmentNumber}. Shipment may have been picked up.`
      )
      return {
        cancelled: false,
        shipment_number: shipmentNumber,
        note: "Cancellation failed. Shipment may have been picked up. Contact PPL support.",
      }
    }

    this.logger_.info(`PPL: Shipment ${shipmentNumber} successfully cancelled`)

    return {
      cancelled: true,
      shipment_number: shipmentNumber,
    }
  }

  /**
   * Called when creating a return fulfillment
   * NOTE: Return flow may differ - verify with PPL documentation
   */
  override async createReturnFulfillment(
    _fulfillment: Record<string, unknown>
  ): Promise<CreateFulfillmentResult> {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "PPL: Return fulfillment not yet implemented. Contact PPL for return label process."
    )
  }

  /**
   * Whether this provider can calculate shipping prices dynamically
   * Returns false to use flat rates configured in Medusa
   */
  override async canCalculate(
    _data: CreateShippingOptionDTO
  ): Promise<boolean> {
    return false
  }

  /**
   * Calculate shipping price (not used when canCalculate returns false)
   */
  override async calculatePrice(
    _optionData: CalculateShippingOptionPriceDTO["optionData"],
    _data: CalculateShippingOptionPriceDTO["data"],
    _context: CalculateShippingOptionPriceDTO["context"]
  ): Promise<CalculatedShippingOptionPrice> {
    return {
      calculated_amount: 0,
      is_calculated_price_tax_inclusive: false,
    }
  }

  override async getFulfillmentDocuments(
    data: Record<string, unknown>
  ): Promise<never[]> {
    // Return empty array as per base class signature
    // Labels are accessible via fulfillment.data.label_url
    return []
  }

  /**
   * Get label documents for a fulfillment
   * Note: Base class returns never[], so this is a separate helper method
   */
  async getLabelDocuments(
    data: Record<string, unknown>
  ): Promise<{ type: string; url: string; format: string }[]> {
    const fulfillmentData = data as unknown as PplFulfillmentData
    const labelUrl = fulfillmentData.label_url

    if (!labelUrl) {
      return []
    }

    return [
      {
        type: "label",
        url: labelUrl,
        format: "png",
      },
    ]
  }

  override async getReturnDocuments(
    _data: Record<string, unknown>
  ): Promise<never[]> {
    return []
  }

  override async getShipmentDocuments(
    _data: Record<string, unknown>
  ): Promise<never[]> {
    return []
  }

  override async retrieveDocuments(
    _fulfillmentData: Record<string, unknown>,
    _documentType: string
  ): Promise<void> {
    // Not implemented
  }

  /**
   * Truncate string to max length
   */
  private truncate(str: string, maxLength: number): string {
    if (!str) return ""
    return str.length > maxLength ? str.substring(0, maxLength) : str
  }
}

export default PplFulfillmentProviderService
