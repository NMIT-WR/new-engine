/**
 * Lightweight logging utilities for development
 */

type PrefetchType = 'Root' | 'Categories' | 'Pages' | 'Children' | 'Product'

const isDev = () =>
  typeof process !== 'undefined' && process.env.NODE_ENV === 'development'

/**
 * Fetch Logger - Logs timing for data fetching operations
 */
export const fetchLogger = {
  current: (label: string, duration: number) => {
    if (!isDev()) return
    console.log(`✅ [Current] ${label} ready in ${Math.round(duration)}ms`)
  },

  cancelled: (label: string, offset?: number) => {
    if (!isDev()) return
    const offsetStr = offset !== undefined ? ` @offset:${offset}` : ''
    console.log(`🚫 [Cancelled] ${label}${offsetStr}`)
  },
}

/**
 * Prefetch Logger - Unified logging for prefetch operations
 */
export const prefetchLogger = {
  start: (
    type: PrefetchType,
    label: string,
    metadata?: Record<string, unknown>
  ) => {
    if (!isDev()) return
    const metaStr = metadata
      ? ` ${Object.entries(metadata)
          .map(([k, v]) => `${k}:${v}`)
          .join(', ')}`
      : ''
    console.log(`🚀 [Prefetch ${type}] ${label}${metaStr}`)
  },

  complete: (type: PrefetchType, label: string, duration: number) => {
    if (!isDev()) return
    console.log(
      `✅ [Prefetch ${type}] ${label} ready in ${Math.round(duration)}ms`
    )
  },

  skip: (type: PrefetchType, label: string, reason?: string) => {
    if (!isDev()) return
    const reasonStr = reason ? ` (${reason})` : ''
    console.log(`⏭️ [Prefetch ${type}] ${label} skipped${reasonStr}`)
  },

  cacheHit: (type: PrefetchType, label: string) => {
    if (!isDev()) return
    console.log(`💾 [Cache hit ${type}] ${label}`)
  },

  info: (type: PrefetchType, message: string) => {
    if (!isDev()) return
    console.log(`ℹ️ [Prefetch ${type}] ${message}`)
  },
}

/**
 * Cache Logger - Logs React Query cache status
 */
export const cacheLogger = {
  query: (
    operation: string,
    _queryKey: readonly unknown[],
    status: {
      isLoading?: boolean
      isFetching?: boolean
      isSuccess?: boolean
      isError?: boolean
      dataUpdatedAt?: number
    }
  ) => {
    if (!isDev()) return

    const cacheAge = status.dataUpdatedAt
      ? Date.now() - status.dataUpdatedAt
      : 0
    const ageSeconds = Math.round(cacheAge / 1000)

    let indicator = '🔍'
    let statusText = 'unknown'

    if (status.isError) {
      indicator = '❌'
      statusText = 'error'
    } else if (status.isLoading) {
      indicator = '⏳'
      statusText = 'loading'
    } else if (status.isFetching) {
      indicator = '🔄'
      statusText = 'fetching'
    } else if (status.isSuccess && cacheAge < 3600000) {
      indicator = '🟢'
      statusText = `fresh (${ageSeconds}s)`
    } else if (status.isSuccess) {
      indicator = '🟡'
      statusText = `stale (${ageSeconds}s)`
    }

    console.log(`${indicator} [Cache] ${operation} ${statusText}`)
  },

  error: (operation: string, error: unknown) => {
    if (!isDev()) return
    console.group(`❌ [Error] ${operation}`)
    console.error(error)
    console.groupEnd()
  },
}

export const logQuery = cacheLogger.query.bind(cacheLogger)
export const logError = cacheLogger.error.bind(cacheLogger)
