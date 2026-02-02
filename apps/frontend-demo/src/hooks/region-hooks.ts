import type { HttpTypes } from "@medusajs/types"
import { useQueryClient } from "@tanstack/react-query"
import {
  createMedusaRegionService,
  createRegionHooks,
  type MedusaRegionDetailInput,
  type MedusaRegionListInput,
} from "@techsio/storefront-data"
import { useCallback, useState } from "react"
import { sdk } from "@/lib/medusa-client"
import { queryKeys } from "@/lib/query-keys"

type Region = HttpTypes.StoreRegion

const regionQueryKeys = {
  all: () => [...queryKeys.all, "regions"] as const,
  list: (_params: MedusaRegionListInput) => queryKeys.regions(),
  detail: (params: MedusaRegionDetailInput) =>
    [...queryKeys.regions(), "detail", params.id] as const,
}

const baseHooks = createRegionHooks({
  service: createMedusaRegionService(sdk),
  queryKeys: regionQueryKeys,
  queryKeyNamespace: "frontend-demo",
})

const DEFAULT_COUNTRY_CODE = "cz"
const DEFAULT_CURRENCY_CODE = "czk"
const FALLBACK_CURRENCY_CODE = "eur"

const COOKIE_NAME = "medusa_region_id"
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60

function setCookie(name: string, value: string) {
  if (typeof window !== "undefined") {
    document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
  }
}

function getCookie(name: string): string | null {
  if (typeof window === "undefined") {
    return null
  }

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null
  }
  return null
}

function findRegionByCountry(
  regions: Region[],
  countryCode: string
): Region | undefined {
  return regions.find((r) => r.countries?.some((c) => c.iso_2 === countryCode))
}

function findRegionByCurrency(
  regions: Region[],
  currencyCode: string
): Region | undefined {
  return regions.find((r) => r.currency_code === currencyCode)
}

function findRegionById(regions: Region[], id: string): Region | undefined {
  return regions.find((r) => r.id === id)
}

function getDefaultRegion(regions: Region[]): Region | undefined {
  return (
    findRegionByCountry(regions, DEFAULT_COUNTRY_CODE) ||
    findRegionByCurrency(regions, DEFAULT_CURRENCY_CODE) ||
    findRegionByCurrency(regions, FALLBACK_CURRENCY_CODE) ||
    regions[0]
  )
}

function getRegionValues(region: Region | undefined) {
  const firstCountry = region?.countries?.[0]
  return {
    regionId: region?.id,
    countryCode: firstCountry?.iso_2 || DEFAULT_COUNTRY_CODE,
    currencyCode: region?.currency_code || DEFAULT_CURRENCY_CODE,
  }
}

export function useRegion() {
  const queryClient = useQueryClient()
  const { regions, isLoading, isFetching } = baseHooks.useRegions({})

  const [manualRegionId, setManualRegionId] = useState<string | null>(() =>
    getCookie(COOKIE_NAME)
  )

  const selectedRegion =
    (manualRegionId && findRegionById(regions, manualRegionId)) ||
    getDefaultRegion(regions)

  const { regionId, countryCode, currencyCode } =
    getRegionValues(selectedRegion)

  const setSelectedRegion = useCallback(
    (region: Region) => {
      if (region?.id && region.id !== selectedRegion?.id) {
        setManualRegionId(region.id)
        setCookie(COOKIE_NAME, region.id)
        queryClient.invalidateQueries({ queryKey: queryKeys.products.all() })
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.all() })
      }
    },
    [selectedRegion?.id, queryClient]
  )

  return {
    regions,
    selectedRegion: selectedRegion || null,
    setSelectedRegion,
    regionId,
    countryCode,
    currencyCode,
    isLoading,
    isFetching,
  }
}

export function useSuspenseRegion() {
  const { regions, isFetching } = baseHooks.useSuspenseRegions({})

  const storedRegionId =
    typeof window !== "undefined" ? getCookie(COOKIE_NAME) : null
  const selectedRegion =
    (storedRegionId && findRegionById(regions, storedRegionId)) ||
    getDefaultRegion(regions)

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
