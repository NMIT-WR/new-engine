"use client"

import type { HttpTypes } from "@medusajs/types"
import { useQueryClient } from "@tanstack/react-query"
import {
  createMedusaRegionService,
  createRegionHooks,
  RegionProvider as BaseRegionProvider,
  type MedusaRegionDetailInput,
  type MedusaRegionListInput,
} from "@techsio/storefront-data"
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { sdk } from "@/lib/medusa-client"
import { queryKeys } from "@/lib/query-keys"

type Region = HttpTypes.StoreRegion

type RegionSelectionContextValue = {
  regions: Region[]
  selectedRegion: Region | null
  setSelectedRegion: (region: Region) => void
  regionId?: string
  countryCode: string
  currencyCode: string
  isLoading: boolean
  isFetching: boolean
}

const COOKIE_NAME = "medusa_region_id"
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60
const DEFAULT_COUNTRY_CODE = "cz"
const DEFAULT_CURRENCY_CODE = "czk"
const FALLBACK_CURRENCY_CODE = "eur"

const RegionSelectionContext = createContext<RegionSelectionContextValue | null>(
  null
)

const regionQueryKeys = {
  all: () => queryKeys.regions.all(),
  list: (params: MedusaRegionListInput) =>
    queryKeys.regions.list(params as Record<string, unknown>),
  detail: (params: MedusaRegionDetailInput) =>
    queryKeys.regions.detail(
      params as { id?: string; enabled?: boolean } & Record<string, unknown>
    ),
}

const baseHooks = createRegionHooks({
  service: createMedusaRegionService(sdk),
  queryKeys: regionQueryKeys,
})

function getStoredRegionId(): string | null {
  if (typeof window === "undefined") {
    return null
  }
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${COOKIE_NAME}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null
  }
  return null
}

function setStoredRegionId(regionId: string) {
  if (typeof window === "undefined") {
    return
  }
  document.cookie = `${COOKIE_NAME}=${regionId}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
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

export function RegionProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient()
  const { regions, isFetching } = baseHooks.useSuspenseRegions({})
  const [manualRegionId, setManualRegionId] = useState<string | null>(() =>
    getStoredRegionId()
  )

  const selectedRegion =
    (manualRegionId && findRegionById(regions, manualRegionId)) ||
    getDefaultRegion(regions)

  const { regionId, countryCode, currencyCode } = getRegionValues(selectedRegion)

  const setSelectedRegion = useCallback(
    (region: Region) => {
      if (region?.id && region.id !== selectedRegion?.id) {
        setManualRegionId(region.id)
        setStoredRegionId(region.id)
        queryClient.invalidateQueries({ queryKey: queryKeys.products.all() })
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.all() })
      }
    },
    [queryClient, selectedRegion?.id]
  )

  const contextValue = useMemo<RegionSelectionContextValue>(
    () => ({
      regions,
      selectedRegion: selectedRegion ?? null,
      setSelectedRegion,
      regionId,
      countryCode,
      currencyCode,
      isLoading: false,
      isFetching,
    }),
    [
      countryCode,
      currencyCode,
      isFetching,
      regionId,
      regions,
      selectedRegion,
      setSelectedRegion,
    ]
  )

  const region = { region_id: regionId, country_code: countryCode }

  return (
    <RegionSelectionContext.Provider value={contextValue}>
      <BaseRegionProvider region={region}>{children}</BaseRegionProvider>
    </RegionSelectionContext.Provider>
  )
}

export function useRegionSelection(): RegionSelectionContextValue {
  const context = useContext(RegionSelectionContext)
  if (!context) {
    throw new Error("useRegionSelection must be used within RegionProvider")
  }
  return context
}
