import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import initializeClientLoader from "./loaders/initialize-client"
import PplFulfillmentProviderService from "./service"

export default ModuleProvider(Modules.FULFILLMENT, {
  services: [PplFulfillmentProviderService],
  loaders: [initializeClientLoader],
})

export { PplClient } from "./client"
export * from "./types"
