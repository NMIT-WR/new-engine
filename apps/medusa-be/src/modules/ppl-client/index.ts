import { Module } from "@medusajs/framework/utils"
import { PplClientModuleService } from "./service"

export const PPL_CLIENT_MODULE = "ppl_client"

export default Module(PPL_CLIENT_MODULE, { service: PplClientModuleService })

export type { PplClientModuleService } from "./service"
