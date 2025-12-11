import { Module } from "@medusajs/framework/utils"
import DataLayerModuleService from "./service"

export const DATABASE_MODULE = "database"

export default Module(DATABASE_MODULE, {
  service: DataLayerModuleService,
})
