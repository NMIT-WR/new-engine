import { model } from "@medusajs/framework/utils"

export const DataLayer = model.define("data_layer", {
  id: model.id().primaryKey(),
  hash: model.text(),
})
