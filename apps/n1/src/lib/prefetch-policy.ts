import type { PrefetchSkipMode } from "@techsio/storefront-data"

export const PREFETCH_CACHE_STRATEGY = "semiStatic" as const
export const PREFETCH_SKIP_IF_CACHED = true
export const PREFETCH_SKIP_MODE: PrefetchSkipMode = "fresh"
