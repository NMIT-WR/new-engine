import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { MeiliSearchService } from '@rokmohar/medusa-plugin-meilisearch'
import {CATEGORIES, MEILISEARCH} from "../";

export type SyncMeilisearchCategoriesStepInput = {
  filters?: Record<string, unknown>
  limit?: number
  offset?: number
}

export const syncMeilisearchCategoriesStep = createStep(
  'sync-meilisearch-categories-step',
  async ({ filters, limit, offset }: SyncMeilisearchCategoriesStepInput, { container }) => {
    const queryService = container.resolve('query')
    const meilisearchService: MeiliSearchService = container.resolve(MEILISEARCH)

    const categoryFields = await meilisearchService.getFieldsForType(CATEGORIES)
    const categoryIndexes = await meilisearchService.getIndexesByType(CATEGORIES)

      const { data: categories } = await queryService.graph({
          entity: 'product_category',
          fields: categoryFields,
          pagination: {
              take: limit,
              skip: offset,
          },
          filters: {
              is_active: true,
              ...filters,
          },
      })

      const existingCategoryIds = new Set(
          (
              await Promise.all(
                  categoryIndexes.map((index) =>
                      meilisearchService.search(index, '', {
                          filter: `id IN [${categories.map((c) => c.id).join(',')}]`,
                          attributesToRetrieve: ['id'],
                      }),
                  ),
              )
          )
              .flatMap((result) => result.hits)
              .map((hit) => hit.id),
      )

      const categoriesToDelete = Array.from(existingCategoryIds).filter((id) => !categories.some((c) => c.id === id))

      await Promise.all(categoryIndexes.map((index) => meilisearchService.addDocuments(index, categories)))
      await Promise.all(categoryIndexes.map((index) => meilisearchService.deleteDocuments(index, categoriesToDelete)))

      return new StepResponse({
          categories,
      })
  },
)
