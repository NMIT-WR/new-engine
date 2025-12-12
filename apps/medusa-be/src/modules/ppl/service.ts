import type {
  CalculatedShippingOptionPrice,
  CalculateShippingOptionPriceDTO,
  CreateFulfillmentResult,
  CreateShippingOptionDTO,
  FulfillmentDTO,
  FulfillmentItemDTO,
  FulfillmentOption,
  FulfillmentOrderDTO,
  Logger,
  ValidateFulfillmentDataContext,
} from "@medusajs/framework/types"
import {
  AbstractFulfillmentProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import { PplClient } from "./client"
import type {
  PplCodSettings,
  PplFulfillmentData,
  PplOptions,
  PplProductType,
  PplShipmentRequest,
  PplShippingOptionData,
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

  constructor(container: InjectedDependencies, _options: PplOptions) {
    super()
    this.logger_ = container.logger
  }

  private getClient(): PplClient {
    return PplClient.getInstance()
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

    return shippingOptionData
  }

  /**
   * Called when admin creates fulfillment for an order
   * Creates shipment in PPL, downloads label, stores in S3
   */
  override async createFulfillment(
    data: Record<string, unknown>,
    _items: Partial<Omit<FulfillmentItemDTO, "fulfillment">>[],
    order: Partial<FulfillmentOrderDTO> | undefined,
    fulfillment: Partial<Omit<FulfillmentDTO, "provider_id" | "data" | "items">>
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

    const countryCode = shippingAddress.country_code?.toUpperCase()
    if (!countryCode) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PPL: Shipping address must include country_code"
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
      country: countryCode,
      phone: this.truncate(shippingAddress.phone || "", 30),
      email: this.truncate(order.email || "", 50),
    }

    // Build COD settings if applicable
    let codSettings: PplCodSettings | undefined
    if (supportsCod) {
      // Validate COD amount
      const codAmount = order.total
      if (codAmount == null || typeof codAmount !== "number") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "PPL: Order total must be a valid number for COD shipments"
        )
      }

      // Validate order currency
      const orderCurrency = order.currency_code?.toUpperCase()
      if (!orderCurrency) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "PPL: Order currency_code is required for COD shipments"
        )
      }

      // Validate currency is supported by PPL
      const supportedCurrencies = await this.getClient().getCachedCurrencies()
      const currencySupported = supportedCurrencies.some(
        (c) => c.code === orderCurrency
      )
      if (!currencySupported) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `PPL: Currency ${orderCurrency} is not supported for COD. Supported: ${supportedCurrencies.map((c) => c.code).join(", ")}`
        )
      }

      // Validate COD is allowed for destination country
      const countries = await this.getClient().getCachedCountries()
      const destCountry = countries.find((c) => c.code === countryCode)
      if (destCountry && destCountry.codAllowed === false) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `PPL: COD is not allowed for country ${countryCode}`
        )
      }

      // Generate variable symbol from order ID
      const orderId =
        order.display_id?.toString() || order.id?.substring(0, 10) || ""

      const options = this.getClient().getOptions()
      codSettings = {
        codPrice: codAmount,
        codCurrency: orderCurrency,
        codVarSym: orderId,
        ...(options.cod_iban
          ? {
              iban: options.cod_iban,
              swift: options.cod_swift,
            }
          : {
              bankAccount: options.cod_bank_account,
              bankCode: options.cod_bank_code,
            }),
      }
    }

    // Check if PPL customer profile is configured (warn if not)
    const customerInfo = await this.getClient().getCustomerInfo()
    if (!customerInfo) {
      this.logger_.warn(
        "PPL: Customer profile not configured (GET /customer returned 404). " +
          "Shipment creation may fail with 'Invalid customer'. " +
          "Contact PPL support at ithelp@ppl.cz to set up your customer profile."
      )
    }

    const sender = await this.getSenderAddress()

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
          externalNumber: order.display_id?.toString() || order.id || "",
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

    // Create shipment batch in PPL - returns immediately with batch_id
    // The batch will be processed asynchronously by PPL
    const batchId = await this.getClient().createShipmentBatch([
      shipmentRequest,
    ])

    this.logger_.info(
      `PPL: Shipment batch ${batchId} created for fulfillment ${fulfillmentId}. Status will be updated by ppl-label-sync job.`
    )

    // Build fulfillment data with pending status
    // Label and shipment number will be populated by ppl-label-sync job
    const fulfillmentData: PplFulfillmentData = {
      status: "pending",
      batch_id: batchId,
      product_type: productType,
      access_point_id: accessPointId,
    }

    // Return without labels - they will be added when ppl-label-sync job completes
    // Medusa expects labels array, but we return empty for now
    return {
      data: fulfillmentData,
      labels: [],
    }
  }

  private async getSenderAddress() {
    // Check if PPL customer has sender address configured, otherwise use fallback
    let sender: PplShipmentRequest["sender"] | undefined
    const customerAddresses = await this.getClient().getCustomerAddresses()
    const defaultSeatAddress = customerAddresses?.find(
      (a) => a.code === "SEAT" && a.default === true
    )

    if (defaultSeatAddress) {
      sender = {
        name: defaultSeatAddress.name,
        street: defaultSeatAddress.street,
        city: defaultSeatAddress.city,
        zipCode: defaultSeatAddress.zipCode,
        country: defaultSeatAddress.country,
        ...(defaultSeatAddress.phone && { phone: defaultSeatAddress.phone }),
        ...(defaultSeatAddress.email && { email: defaultSeatAddress.email }),
      }
    } else {
      const options = this.getClient().getOptions()
      const {
        sender_name,
        sender_street,
        sender_city,
        sender_zip_code,
        sender_country,
        sender_phone,
        sender_email,
      } = options

      if (
        !(
          sender_name &&
          sender_street &&
          sender_city &&
          sender_zip_code &&
          sender_country
        )
      ) {
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
        ...(sender_phone && { phone: sender_phone }),
        ...(sender_email && { email: sender_email }),
      }

      this.logger_.info(
        "PPL: Using fallback sender address from environment variables"
      )
    }

    return sender
  }

  /**
   * Called when admin cancels a fulfillment
   *
   * If fulfillment is pending (no shipment_number yet), just return success
   * since the shipment hasn't been processed by PPL yet.
   *
   * If fulfillment is completed, use POST /shipment/{shipmentNumber}/cancel
   * NOTE: Only works BEFORE physical pickup by PPL courier
   */
  override async cancelFulfillment(
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const fulfillmentData = data as unknown as PplFulfillmentData
    const shipmentNumber = fulfillmentData.shipment_number
    const status = fulfillmentData.status

    // If pending, batch may still be processing - we can't cancel via API
    // but the shipment effectively doesn't exist yet
    if (status === "pending" || !shipmentNumber) {
      this.logger_.info(
        `PPL: Fulfillment cancelled while pending (batch_id: ${fulfillmentData.batch_id}). No PPL cancellation needed.`
      )
      return {
        cancelled: true,
        status: "pending",
        batch_id: fulfillmentData.batch_id,
        note: "Fulfillment was pending - no shipment to cancel in PPL",
      }
    }

    this.logger_.info(`PPL: Attempting to cancel shipment ${shipmentNumber}`)

    const cancelled = await this.getClient().cancelShipment(shipmentNumber)

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
    _data: Record<string, unknown>
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
    if (!str) {
      return ""
    }
    return str.length > maxLength ? str.substring(0, maxLength) : str
  }
}

export default PplFulfillmentProviderService
