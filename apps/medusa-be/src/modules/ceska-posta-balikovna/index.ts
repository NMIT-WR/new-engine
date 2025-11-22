import { Module } from '@medusajs/framework/utils'
import CeskaPostaBalikovnaModuleService from './shipment-service'

export const CESKA_POSTA_BALIKOVNA_MODULE = 'ceskaPostaBalikovnaService'

export * from './constants'
export * from './types'
export * from './models/shipment'

export default Module(CESKA_POSTA_BALIKOVNA_MODULE, {
  service: CeskaPostaBalikovnaModuleService,
})
