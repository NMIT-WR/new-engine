"use client"

import type { HttpTypes } from "@medusajs/types"
import {
  createCollectionHooks,
  type CollectionDetailInputBase,
  type CollectionListInputBase,
  type CollectionService,
} from "@techsio/storefront-data"
import { sdk } from "@/lib/medusa-client"

type StoreCollection = HttpTypes.StoreCollection
type StoreCollectionListParams = HttpTypes.StoreCollectionListParams
type StoreCollectionDetailParams = {
  id: string
  fields?: string
}

export type StorefrontCollectionListInput = CollectionListInputBase &
  StoreCollectionListParams
export type StorefrontCollectionDetailInput = CollectionDetailInputBase &
  StoreCollectionDetailParams

const service: CollectionService<
  StoreCollection,
  StoreCollectionListParams,
  StoreCollectionDetailParams
> = {
  getCollections: async (params) => {
    const response = await sdk.store.collection.list(params)
    return {
      collections: response.collections,
      count: response.count,
    }
  },
  getCollection: async (params) => {
    if (!params.id) {
      return null
    }
    const response = await sdk.store.collection.retrieve(params.id, {
      fields: params.fields,
    })
    return response.collection ?? null
  },
}

const { useCollections, useCollection } = createCollectionHooks({
  service,
})

export { useCollections, useCollection }
