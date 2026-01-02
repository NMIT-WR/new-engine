/**
 * Shared utility for safely accessing global window functions
 * Eliminates DRY violations across analytics hooks
 */

/**
 * Creates a type-safe getter for a global window function
 *
 * @param keys - Single key or array of keys to check on window object
 * @returns A function that returns the global function or null if not available
 *
 * @example
 * ```ts
 * // Single key
 * const getGtag = createWindowGetter<GtagFunction>('gtag')
 *
 * // Multiple keys (Leadhub uses both 'lhi' and 'LHInsights')
 * const getLhi = createWindowGetter<LeadhubFunction>(['lhi', 'LHInsights'])
 * ```
 */
export function createWindowGetter<T>(keys: string | string[]): () => T | null {
  const keyArray = Array.isArray(keys) ? keys : [keys]

  return (): T | null => {
    if (typeof window === "undefined") {
      return null
    }

    for (const key of keyArray) {
      const value = (window as unknown as Record<string, unknown>)[key]
      if (value) {
        return value as T
      }
    }

    return null
  }
}
