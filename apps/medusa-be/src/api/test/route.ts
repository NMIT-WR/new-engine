import type {MedusaRequest, MedusaResponse,} from "@medusajs/framework/http"
import {ContainerRegistrationKeys} from "@medusajs/framework/utils"

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const { data: product } = await query.graph({
        entity: 'product',
        fields: ["title", "handle", "producer.title", "producer.attributes.value", "producer.attributes.attributeType.name"],
    })

    res.json({product})
}