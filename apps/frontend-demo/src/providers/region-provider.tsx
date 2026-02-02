"use client"

import { RegionProvider as BaseRegionProvider } from "@techsio/storefront-data"
import type { ReactNode } from "react"
import { useSuspenseRegion } from "@/hooks/region-hooks"

/**
 * Region provider for frontend-demo app
 *
 * Wraps the storefront-data RegionProvider and automatically
 * fetches region using frontend-demo's region selection logic.
 * Uses suspense to ensure region is loaded before rendering children.
 */
export function RegionProvider({ children }: { children: ReactNode }) {
  const { regionId, countryCode } = useSuspenseRegion()

  // regionId is always defined thanks to suspense
  const region = { region_id: regionId, country_code: countryCode }

  return <BaseRegionProvider region={region}>{children}</BaseRegionProvider>
}
