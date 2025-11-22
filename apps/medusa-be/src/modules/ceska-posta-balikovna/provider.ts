import type {
  CalculatedShippingOptionPrice,
  CalculateShippingOptionPriceContext,
  CalculateShippingOptionPriceDTO,
  CreateFulfillmentResult,
  CreateShippingOptionDTO,
  FulfillmentDTO,
  FulfillmentItemDTO,
  FulfillmentOption,
  FulfillmentOrderDTO,
  ValidateFulfillmentDataContext,
} from '@medusajs/framework/types'
import {
  AbstractFulfillmentProviderService,
  ContainerRegistrationKeys,
  MedusaError,
  ModuleProvider,
  Modules,
} from '@medusajs/framework/utils'
import {
  BALIKOVNA_SERVICE,
  type BalikovnaServiceType,
  CESKA_POSTA_BALIKOVNA_IDENTIFIER,
  CESKA_POSTA_BALIKOVNA_MODULE,
} from './constants'
import type {
  BalikovnaAddress,
  BalikovnaFulfillmentData,
  BalikovnaPickupPoint,
  BalikovnaProviderMode,
  BalikovnaProviderOptions,
} from './types'
import type CeskaPostaBalikovnaModuleService from './shipment-service'

class CeskaPostaBalikovnaProvider extends AbstractFulfillmentProviderService {
  static override identifier = CESKA_POSTA_BALIKOVNA_IDENTIFIER

  protected readonly logger: any
  protected readonly options: Required<BalikovnaProviderOptions> & {
    mode: BalikovnaProviderMode
  }
  protected readonly shipmentService?: CeskaPostaBalikovnaModuleService

  constructor(container: any, options: BalikovnaProviderOptions = {}) {
    super()
    this.logger =
      container?.[ContainerRegistrationKeys.LOGGER] ??
      container?.logger ??
      console

    this.options = {
      mode:
        options.mode && options.mode === 'production' ? 'production' : 'test',
      apiKey: options.apiKey ?? '',
      customerId: options.customerId ?? '',
      testBaseUrl: options.testBaseUrl ?? 'https://b2btest.ceskaposta.cz',
      productionBaseUrl:
        options.productionBaseUrl ?? 'https://onlinepodani.ceskaposta.cz',
      labelUrlTemplate: options.labelUrlTemplate ?? '',
    }

    try {
      this.shipmentService = container.resolve(CESKA_POSTA_BALIKOVNA_MODULE)
    } catch (e) {
      this.logger?.warn?.(
        '[Balikovna] Shipment service not registered. Persistence will be limited.'
      )
    }
  }

  override async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    return [
      {
        id: 'balikovna-nb',
        name: 'Balíkovna – výdejní místo',
        service: BALIKOVNA_SERVICE.NB,
      },
      {
        id: 'balikovna-nd',
        name: 'Balíkovna na adresu',
        service: BALIKOVNA_SERVICE.ND,
      },
    ] as FulfillmentOption[]
  }

  override async validateFulfillmentData(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: ValidateFulfillmentDataContext
  ): Promise<BalikovnaFulfillmentData> {
    const service = this.resolveService(optionData, data)

    if (!service) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'Doprava Balíkovna vyžaduje specifikaci služby NB/ND.'
      )
    }

    const sanitized: BalikovnaFulfillmentData = {
      service,
      environment: this.options.mode,
      contact: this.extractContact(data, context),
    }

    if (service === BALIKOVNA_SERVICE.NB) {
      sanitized.pickup_point = this.extractPickupPoint(data)
    } else {
      sanitized.address = this.extractAddress(data, context)
    }

    const cod = this.extractCod(data)
    if (cod) {
      sanitized.cash_on_delivery = cod
    }

    return sanitized
  }

  override async calculatePrice(
    _optionData: CalculateShippingOptionPriceDTO['optionData'],
    _data: CalculateShippingOptionPriceDTO['data'],
    _context: CalculateShippingOptionPriceContext
  ): Promise<CalculatedShippingOptionPrice> {
    return {
      calculated_amount: 0,
      is_calculated_price_tax_inclusive: false,
    }
  }

  override async canCalculate(
    _data: CreateShippingOptionDTO
  ): Promise<boolean> {
    return false
  }

  override async validateOption(
    data: Record<string, unknown>
  ): Promise<boolean> {
    const service = this.toService(
      (data as BalikovnaFulfillmentData)?.service
    )
    return Boolean(service)
  }

  override async createFulfillment(
    data: Record<string, unknown>,
    items: Partial<Omit<FulfillmentItemDTO, 'fulfillment'>>[],
    order: Partial<FulfillmentOrderDTO> | undefined,
    fulfillment: Partial<Omit<FulfillmentDTO, 'provider_id' | 'data' | 'items'>>
  ): Promise<CreateFulfillmentResult> {
    const parsed = data as BalikovnaFulfillmentData
    const service = this.toService(parsed.service) ?? BALIKOVNA_SERVICE.NB
    const trackingNumber = this.buildTrackingNumber(service, fulfillment?.id)
    const labelUrl =
      parsed.label_url ?? this.buildInlineLabel(trackingNumber, service)

    this.logger?.info?.(
      `[Balikovna] Vytvářím zásilku ${trackingNumber} pro službu ${service}`
    )

    const stored = await this.shipmentService?.createShipments([
      {
        fulfillment_id: fulfillment?.id ?? '',
        order_id: order?.id ?? '',
        service,
        status: parsed.status ?? 'created',
        tracking_number: trackingNumber,
        label_url: labelUrl,
        environment: this.options.mode,
        pickup_point: parsed.pickup_point,
        address: parsed.address,
        contact: parsed.contact,
        cash_on_delivery: parsed.cash_on_delivery,
        provider_payload: {
          items,
          order,
        },
      },
    ])

    return {
      data: {
        ...parsed,
        tracking_number: trackingNumber,
        label_url: labelUrl,
        environment: this.options.mode,
        status: parsed.status ?? 'created',
        shipment_id: stored?.[0]?.id ?? undefined,
      },
      labels: [
        {
          tracking_number: trackingNumber,
          tracking_url: parsed.tracking_url ?? '',
          label_url: labelUrl,
        },
      ],
    }
  }

  override async cancelFulfillment(
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const shipmentId = (data as BalikovnaFulfillmentData)?.shipment_id
    if (shipmentId && typeof shipmentId === 'string' && this.shipmentService) {
      await this.shipmentService.updateShipments([
        { id: shipmentId, status: 'cancelled' },
      ])
    }
    return { cancelled: true }
  }

  override async createReturnFulfillment(
    fulfillment: Record<string, unknown>
  ): Promise<CreateFulfillmentResult> {
    return this.createFulfillment(fulfillment, [], undefined, {})
  }

  protected extractPickupPoint(
    data: Record<string, unknown>
  ): BalikovnaPickupPoint {
    const pickup = (data as BalikovnaFulfillmentData)?.pickup_point
    if (!pickup || !pickup.id || !pickup.city || !pickup.postal_code) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'Vyberte prosím výdejní místo Balíkovny.'
      )
    }

    return {
      id: pickup.id,
      name: pickup.name,
      city: pickup.city,
      postal_code: pickup.postal_code,
      street: pickup.street,
      region: pickup.region,
      type: pickup.type,
      country: pickup.country ?? 'CZ',
      latitude: pickup.latitude,
      longitude: pickup.longitude,
      phone: pickup.phone,
    }
  }

  protected extractAddress(
    data: Record<string, unknown>,
    context: ValidateFulfillmentDataContext
  ): BalikovnaAddress {
    const address =
      (data as BalikovnaFulfillmentData)?.address ??
      (context.shipping_address as BalikovnaAddress | undefined)

    if (!address) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'Doručení Balíkovna na adresu vyžaduje vyplněnou doručovací adresu.'
      )
    }

    const countryCode = (address.country_code || '') as string
    if (countryCode.toLowerCase() !== 'cz') {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'Balíkovna na adresu podporuje pouze doručení v rámci ČR.'
      )
    }

    return {
      first_name: address.first_name,
      last_name: address.last_name,
      address_1: address.address_1,
      address_2: address.address_2 ?? null,
      address_3: address.address_3 ?? null,
      city: address.city,
      postal_code: address.postal_code,
      country_code: 'cz',
      phone: address.phone,
    }
  }

  protected extractContact(
    data: Record<string, unknown>,
    context: ValidateFulfillmentDataContext
  ): BalikovnaFulfillmentData['contact'] {
    const fallbackEmail =
      typeof (context as any)?.email === 'string'
        ? ((context as any).email as string)
        : undefined
    const contact =
      (data as BalikovnaFulfillmentData)?.contact ??
      (context?.shipping_address
        ? {
            phone: context.shipping_address.phone,
            email: fallbackEmail,
          }
        : undefined)

    if (contact?.phone || contact?.email) {
      return {
        phone: contact.phone,
        email: contact.email,
      }
    }

    return undefined
  }

  protected extractCod(
    data: Record<string, unknown>
  ): BalikovnaFulfillmentData['cash_on_delivery'] | undefined {
    const cod = (data as BalikovnaFulfillmentData)?.cash_on_delivery
    if (!cod?.amount || !cod?.currency) {
      return undefined
    }
    return cod
  }

  protected resolveService(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>
  ): BalikovnaServiceType | null {
    const optionService = this.toService(
      (optionData as BalikovnaFulfillmentData)?.service ??
        (optionData as { code?: string }).code ??
        (optionData as { id?: string }).id
    )
    const dataService = this.toService(
      (data as BalikovnaFulfillmentData)?.service
    )

    return dataService ?? optionService
  }

  protected toService(value: unknown): BalikovnaServiceType | null {
    if (!value || typeof value !== 'string') {
      return null
    }

    const normalized = value.toUpperCase()
    if (normalized === BALIKOVNA_SERVICE.NB) {
      return BALIKOVNA_SERVICE.NB
    }
    if (normalized === BALIKOVNA_SERVICE.ND) {
      return BALIKOVNA_SERVICE.ND
    }

    return null
  }

  protected buildTrackingNumber(
    service: BalikovnaServiceType,
    fulfillmentId?: string
  ): string {
    const prefix = service === BALIKOVNA_SERVICE.ND ? 'ND' : 'NB'
    if (fulfillmentId) {
      return `${prefix}-${fulfillmentId}`
    }
    return `${prefix}-${Date.now()}`
  }

  protected buildInlineLabel(
    trackingNumber: string,
    service: BalikovnaServiceType
  ): string {
    if (this.options.labelUrlTemplate) {
      return this.options.labelUrlTemplate.replace(
        '{tracking}',
        trackingNumber
      )
    }

    const content = [
      `Ceska posta - Balikovna (${service})`,
      `Zasilka: ${trackingNumber}`,
      `Rezim: ${this.options.mode}`,
      `Vygenerovano ${new Date().toISOString()}`,
    ].join('\n')
    const base64 = Buffer.from(content, 'utf8').toString('base64')
    return `data:application/pdf;base64,${base64}`
  }
}

export default ModuleProvider(Modules.FULFILLMENT, {
  services: [CeskaPostaBalikovnaProvider],
})
