"use client"

import type { FindParams, HttpTypes } from "@medusajs/types"
import {
  createRegionHooks,
  type RegionDetailInputBase,
  type RegionListInputBase,
  type RegionService,
} from "@techsio/storefront-data"
import { sdk } from "@/lib/medusa-client"

type StoreRegion = HttpTypes.StoreRegion
type StoreRegionListParams = FindParams & HttpTypes.StoreRegionFilters
type StoreRegionDetailParams = {
  id: string
  fields?: string
}

export type StorefrontRegionListInput = RegionListInputBase &
  StoreRegionListParams
export type StorefrontRegionDetailInput = RegionDetailInputBase &
  StoreRegionDetailParams

const service: RegionService<
  StoreRegion,
  StoreRegionListParams,
  StoreRegionDetailParams
> = {
  getRegions: async (params) => {
    const response = await sdk.store.region.list(params)
    return {
      regions: response.regions,
      count: response.count,
    }
  },
  getRegion: async (params) => {
    if (!params.id) {
      return null
    }
    const response = await sdk.store.region.retrieve(params.id, {
      fields: params.fields,
    })
    return response.region ?? null
  },
}

const { useRegions, useRegion } = createRegionHooks({
  service,
})

export { useRegions, useRegion }
