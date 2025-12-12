import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import PplFulfillmentProviderService from "./service"

export default ModuleProvider(Modules.FULFILLMENT, {
  services: [PplFulfillmentProviderService],
})

// Re-export types from ppl-client for backward compatibility with jobs/routes
export * from "../ppl-client/types"
