"use client"

import type { HttpTypes } from "@medusajs/types"
import {
  createCategoryHooks,
  type CategoryDetailInputBase,
  type CategoryListInputBase,
  type CategoryService,
} from "@techsio/storefront-data"
import { sdk } from "@/lib/medusa-client"

type StoreCategory = HttpTypes.StoreProductCategory
type StoreCategoryListParams = HttpTypes.StoreProductCategoryListParams
type StoreCategoryDetailParams = {
  id: string
  fields?: string
}

export type StorefrontCategoryListInput = CategoryListInputBase &
  StoreCategoryListParams
export type StorefrontCategoryDetailInput = CategoryDetailInputBase &
  StoreCategoryDetailParams

const service: CategoryService<
  StoreCategory,
  StoreCategoryListParams,
  StoreCategoryDetailParams
> = {
  getCategories: async (params) => {
    const response = await sdk.store.category.list(params)
    return {
      categories: response.product_categories,
      count: response.count,
    }
  },
  getCategory: async (params) => {
    if (!params.id) {
      return null
    }
    const response = await sdk.store.category.retrieve(params.id, {
      fields: params.fields,
    })
    return response.product_category ?? null
  },
}

const { useCategories, useCategory } = createCategoryHooks({
  service,
})

export { useCategories, useCategory }
