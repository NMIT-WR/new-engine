import { ModuleProvider, Modules } from '@medusajs/framework/utils'
import CeskaPostaBalikovnaProvider from './service'

export * from './constants'
export * from './types'

export default ModuleProvider(Modules.FULFILLMENT, {
  services: [CeskaPostaBalikovnaProvider],
})
