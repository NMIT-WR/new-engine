import { MedusaService } from '@medusajs/framework/utils'
import CeskaPostaShipment from './models/shipment'
import type { BalikovnaFulfillmentData } from './types'

export type CreateShipmentInput = {
  fulfillment_id: string
  order_id: string
  service: BalikovnaFulfillmentData['service']
  status: string
  tracking_number: string
  label_url?: string | null
  environment: string
  pickup_point?: BalikovnaFulfillmentData['pickup_point']
  address?: BalikovnaFulfillmentData['address']
  contact?: BalikovnaFulfillmentData['contact']
  cash_on_delivery?: BalikovnaFulfillmentData['cash_on_delivery']
  provider_payload?: Record<string, unknown>
}

export type UpdateShipmentInput = {
  id: string
  status?: string
  label_url?: string | null
  tracking_number?: string
  provider_payload?: Record<string, unknown>
}

class CeskaPostaBalikovnaModuleService extends MedusaService({
  CeskaPostaShipment,
}) {
  async createShipments(input: CreateShipmentInput[]) {
    return this.createCeskaPostaShipments(
      input.map((i) => ({
        ...i,
      }))
    )
  }

  async updateShipments(input: UpdateShipmentInput[]) {
    return this.updateCeskaPostaShipments(input)
  }
}

export default CeskaPostaBalikovnaModuleService
