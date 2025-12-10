import { ModuleProvider, Modules } from '@medusajs/framework/utils'
import PplFulfillmentProviderService from './service'

export default ModuleProvider(Modules.FULFILLMENT, {
  services: [PplFulfillmentProviderService],
})

// Re-export types for external use
export * from './types'
export { PplClient } from './client'
