import type {MedusaRequest, MedusaResponse,} from "@medusajs/framework/http"
import {ContainerRegistrationKeys} from "@medusajs/framework/utils"
import {ProductProducerLink} from "../../links/product-producer";
import {syncMeilisearchProducersWorkflow} from "../../workflows/meilisearch/workflows/sync-producers";

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {

    // const meilisearchIndexService: MeiliSearchService =
    //     req.scope.resolve('meilisearch')

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    await syncMeilisearchProducersWorkflow(req.scope).run({input: {
        filters: {}
        }})

    const { data: product } = await query.graph({
        entity: ProductProducerLink.entryPoint,
        // entity: 'product',
        // fields: ["title", "handle", "producer.title", "producer.attributes.value", "producer.attributes.attributeType.name"],
        fields: ["id", "producer.title", "producer.attributes.value", "producer.attributes.attributeType.name", 'product.handle'],
        pagination: {
            take: 10,
            skip: 0,
        },
        filters: {
            producer_id: '01K1RA7DXJ400EKAFFJHX1S9M9'
        }
    })

    res.json({product})
}