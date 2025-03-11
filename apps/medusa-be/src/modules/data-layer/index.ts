import DataLayerModuleService from "./service"
import {Module} from "@medusajs/framework/utils"

export const DATA_LAYER_MODULE = "data_layer"

export default Module(DATA_LAYER_MODULE, {
    service: DataLayerModuleService,
})
