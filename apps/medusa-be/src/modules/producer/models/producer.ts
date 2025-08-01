import { model } from "@medusajs/framework/utils"
import ProducerAttribute from "./producer-attribute";

const Producer = model.define("producer", {
    id: model.id().primaryKey(),
    title: model.text(),
    attributes: model.hasMany(() => ProducerAttribute, {
        mappedBy: "producer"
    })
})

export default Producer
