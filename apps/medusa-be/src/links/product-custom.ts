import {defineLink} from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import DataLayerModule from "../modules/data-layer";

export default defineLink(
    ProductModule.linkable.product,
    DataLayerModule.linkable.dataLayer
)
