/**
 * Unified Prefetch Logging Utility
 * Provides consistent logging format across all prefetch systems
 */

type PrefetchType = 'Categories' | 'Pages' | 'Children' | 'Product'

export const prefetchLogger = {
  /**
   * Log prefetch start
   */
  start: (type: PrefetchType, label: string, metadata?: Record<string, any>) => {
    if (process.env.NODE_ENV !== 'development') return

    const metaStr = metadata
      ? ` ${Object.entries(metadata)
          .map(([k, v]) => `${k}:${v}`)
          .join(', ')}`
      : ''

    console.log(`🚀 [Prefetch ${type}] ${label}${metaStr}`)
  },

  /**
   * Log prefetch completion
   */
  complete: (type: PrefetchType, label: string, duration: number) => {
    if (process.env.NODE_ENV !== 'development') return

    console.log(
      `✅ [Prefetch ${type}] ${label} ready in ${Math.round(duration)}ms`
    )
  },

  /**
   * Log prefetch skip
   */
  skip: (type: PrefetchType, label: string, reason?: string) => {
    if (process.env.NODE_ENV !== 'development') return

    const reasonStr = reason ? ` (${reason})` : ''
    console.log(`⏭️ [Prefetch ${type}] ${label} skipped${reasonStr}`)
  },

  /**
   * Log cache hit
   */
  cacheHit: (type: PrefetchType, label: string) => {
    if (process.env.NODE_ENV !== 'development') return

    console.log(`💾 [Cache hit ${type}] ${label}`)
  },

  /**
   * Log general info
   */
  info: (type: PrefetchType, message: string) => {
    if (process.env.NODE_ENV !== 'development') return

    console.log(`ℹ️ [Prefetch ${type}] ${message}`)
  },
}
