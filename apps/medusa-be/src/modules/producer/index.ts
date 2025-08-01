import ProducerModuleService from "./service"
import {Module} from "@medusajs/framework/utils"

export const PRODUCER_MODULE = "producer"

export default Module(PRODUCER_MODULE, {
    service: ProducerModuleService,
})