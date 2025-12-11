import type { Query } from "@medusajs/framework"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import type { MeiliSearchService } from "@rokmohar/medusa-plugin-meilisearch"
import { MEILISEARCH, PRODUCERS } from "../"

export type SyncMeilisearchProducersStepInput = {
  filters?: Record<string, unknown>
  limit?: number
  offset?: number
}

export const syncMeilisearchProducersStep = createStep(
  "sync-meilisearch-producers-step",
  async (
    { filters, limit, offset }: SyncMeilisearchProducersStepInput,
    { container }
  ) => {
    const queryService = container.resolve<Query>("query")
    const meilisearchService: MeiliSearchService =
      container.resolve(MEILISEARCH)

    const producerFields = await meilisearchService.getFieldsForType(PRODUCERS)
    const producerIndexes = await meilisearchService.getIndexesByType(PRODUCERS)

    const { data: producers } = await queryService.graph({
      entity: "producer",
      fields: producerFields,
      pagination: {
        take: limit,
        skip: offset,
      },
      filters: {
        deleted_at: null,
        ...filters,
      },
    })

    const existingProducerIds = new Set(
      (
        await Promise.all(
          producerIndexes.map((index) =>
            meilisearchService.search(index, "", {
              filter: `id IN [${producers.map((c) => c.id).join(",")}]`,
              attributesToRetrieve: ["id"],
            })
          )
        )
      )
        .flatMap((result) => result.hits)
        .map((hit) => hit.id)
    )

    const producersToDelete = Array.from(existingProducerIds).filter(
      (id) => !producers.some((c) => c.id === id)
    )

    const transformedProducers = producers.map((producer) => ({
      ...producer,
      handle: `/store/producers/${producer.handle}/products`,
    }))

    await Promise.all(
      producerIndexes.map((index) =>
        meilisearchService.addDocuments(index, transformedProducers)
      )
    )
    await Promise.all(
      producerIndexes.map((index) =>
        meilisearchService.deleteDocuments(index, producersToDelete)
      )
    )

    return new StepResponse({
      producers,
    })
  }
)
