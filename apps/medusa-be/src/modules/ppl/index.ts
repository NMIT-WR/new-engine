import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import PplFulfillmentProviderService from "./service"
import initializeClientLoader from "./loaders/initialize-client"

export default ModuleProvider(Modules.FULFILLMENT, {
  services: [PplFulfillmentProviderService],
  loaders: [initializeClientLoader],
})

export { PplClient } from "./client"
export * from "./types"
