import type { HttpTypes } from "@medusajs/types"
import {
  createMedusaRegionService,
  createRegionHooks,
  type MedusaRegionDetailInput,
  type MedusaRegionListInput,
} from "@techsio/storefront-data"
import { sdk } from "@/lib/medusa-client"
import { queryKeys } from "@/lib/query-keys"

/**
 * Region type from Medusa
 */
type Region = HttpTypes.StoreRegion

/**
 * Input types
 */
type RegionListInput = {
  enabled?: boolean
}

type RegionDetailInput = {
  id?: string
  enabled?: boolean
}

function buildListParams(_input: RegionListInput): MedusaRegionListInput {
  return {}
}

function buildDetailParams(input: RegionDetailInput): MedusaRegionDetailInput {
  return { id: input.id }
}

/**
 * Query keys for regions (matches n1 namespace)
 */
const regionQueryKeys = {
  all: () => [...queryKeys.all, "regions"] as const,
  list: (_params: MedusaRegionListInput) => queryKeys.regions(),
  detail: (params: MedusaRegionDetailInput) =>
    [...queryKeys.regions(), "detail", params.id] as const,
}

/**
 * Create base region hooks using storefront-data factory
 */
const baseHooks = createRegionHooks<
  Region,
  RegionListInput,
  MedusaRegionListInput,
  RegionDetailInput,
  MedusaRegionDetailInput
>({
  service: createMedusaRegionService(sdk),
  buildListParams,
  buildDetailParams,
  queryKeys: regionQueryKeys,
  queryKeyNamespace: "n1",
})

/**
 * Default country code for region selection
 */
const DEFAULT_COUNTRY_CODE = "cz"
const DEFAULT_CURRENCY_CODE = "czk"

/**
 * Find region by country code
 */
function findRegionByCountry(
  regions: Region[],
  countryCode: string
): Region | undefined {
  return regions.find((r) => r.countries?.some((c) => c.iso_2 === countryCode))
}

/**
 * Get derived values from selected region
 */
function getRegionValues(region: Region | undefined) {
  const firstCountry = region?.countries?.[0]
  return {
    regionId: region?.id,
    countryCode: firstCountry?.iso_2 || DEFAULT_COUNTRY_CODE,
    currencyCode: region?.currency_code || DEFAULT_CURRENCY_CODE,
  }
}

/**
 * useRegion - fetches regions and auto-selects CZ region
 * n1-specific: hardcoded CZ country preference
 */
export function useRegion() {
  const { regions, isLoading, isFetching } = baseHooks.useRegions({})

  // Auto-select CZ region or fallback to first
  const selectedRegion =
    findRegionByCountry(regions, DEFAULT_COUNTRY_CODE) || regions[0]

  const { regionId, countryCode, currencyCode } =
    getRegionValues(selectedRegion)

  return {
    regions,
    selectedRegion,
    regionId,
    countryCode,
    currencyCode,
    isLoading,
    isFetching,
  }
}

/**
 * useSuspenseRegion - suspense version of useRegion
 */
export function useSuspenseRegion() {
  const { regions, isFetching } = baseHooks.useSuspenseRegions({})

  // Auto-select CZ region or fallback to first
  const selectedRegion =
    findRegionByCountry(regions, DEFAULT_COUNTRY_CODE) || regions[0]

  const { regionId, countryCode, currencyCode } =
    getRegionValues(selectedRegion)

  return {
    regions,
    selectedRegion,
    regionId,
    countryCode,
    currencyCode,
    isFetching,
  }
}

// Re-export base hooks for advanced usage
export const {
  useRegions,
  useSuspenseRegions,
  useRegion: useRegionById,
  useSuspenseRegion: useSuspenseRegionById,
  usePrefetchRegions,
  usePrefetchRegion,
} = baseHooks
