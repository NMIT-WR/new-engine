import { model } from '@medusajs/framework/utils'

export const CeskaPostaShipment = model.define('ceska_posta_shipment', {
  id: model.id().primaryKey(),
  fulfillment_id: model.text().unique(),
  order_id: model.text(),
  service: model.text(),
  status: model.text(),
  tracking_number: model.text(),
  label_url: model.text().nullable(),
  environment: model.text(),
  pickup_point: model.json().nullable(),
  address: model.json().nullable(),
  contact: model.json().nullable(),
  cash_on_delivery: model.json().nullable(),
  provider_payload: model.json().nullable(),
})

export default CeskaPostaShipment
