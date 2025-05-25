import { sdk } from '@lib/config'
import type { HttpTypes } from '@medusajs/types'

export const listCategories = async () =>
  sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      '/store/product-categories',
      {
        query: { fields: '+category_children' },
        next: { tags: ['categories'] },
        cache: 'force-cache',
      }
    )
    .then(({ product_categories }) => product_categories)

export const getCategoriesList = async (
  offset = 0,
  limit = 100,
  fields?: (keyof HttpTypes.StoreProductCategory)[]
) =>
  sdk.client.fetch<{
    product_categories: HttpTypes.StoreProductCategory[]
  }>('/store/product-categories', {
    query: {
      limit,
      offset,
      fields: fields ? fields.join(',') : undefined,
    },
    next: { tags: ['categories'] },
    cache: 'force-cache',
  })

export const getCategoryByHandle = async (categoryHandle: string[]) =>
  sdk.client.fetch<HttpTypes.StoreProductCategoryListResponse>(
    `/store/product-categories`,
    {
      query: { handle: categoryHandle },
      next: { tags: ['categories'] },
      cache: 'force-cache',
    }
  )
