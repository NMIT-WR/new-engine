import { Module } from "@medusajs/framework/utils"
import DataLayerModuleService from "./service"

export const DATA_LAYER_MODULE = "data_layer"

export default Module(DATA_LAYER_MODULE, {
  service: DataLayerModuleService,
})
