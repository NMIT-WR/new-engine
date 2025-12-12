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

    // Fetch all existing producer IDs from all indexes
    const existingProducerIds = new Set<string>()
    for (const index of producerIndexes) {
      let searchOffset = 0
      const batchSize = 1000
      while (true) {
        const result = await meilisearchService.search(index, "", {
          offset: searchOffset,
          limit: batchSize,
          attributesToRetrieve: ["id"],
        })

        for (const hit of result.hits) {
          existingProducerIds.add(hit.id)
        }

        if (result.hits.length < batchSize) {
          break
        }
        searchOffset += batchSize
      }
    }

    const currentProducerIds = new Set(producers.map((p) => p.id))
    const producersToDelete = Array.from(existingProducerIds).filter(
      (id) => !currentProducerIds.has(id)
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
