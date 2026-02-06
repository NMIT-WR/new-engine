"use client"

import { RegionProvider as BaseRegionProvider } from "@techsio/storefront-data"
import { useSuspenseRegion } from "@/hooks/region-hooks"
import type { ReactNode } from "react"

/**
 * Region provider for n1 app
 *
 * Wraps the storefront-data RegionProvider and automatically
 * fetches region using n1's region selection logic (CZ default).
 * Uses suspense to ensure region is loaded before rendering children.
 */
export function RegionProvider({ children }: { children: ReactNode }) {
  const { regionId, countryCode } = useSuspenseRegion()

  // regionId is always defined thanks to suspense
  const region = { region_id: regionId, country_code: countryCode }

  return <BaseRegionProvider region={region}>{children}</BaseRegionProvider>
}
