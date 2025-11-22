/**
 * Type-safe localStorage utilities with error handling
 */

interface StorageItem<T> {
  value: T
  timestamp: number
  version?: string
}

export const storage = {
  /**
   * Get item from localStorage with type safety
   */
  get: <T>(key: string): T | null => {
    if (typeof window === "undefined") return null

    try {
      const item = localStorage.getItem(key)
      if (!item) return null

      const parsed: StorageItem<T> = JSON.parse(item)
      return parsed.value
    } catch (e) {
      console.error(`[Storage] Failed to get ${key}:`, e)
      return null
    }
  },

  /**
   * Get item with metadata (timestamp, version)
   */
  getWithMeta: <T>(key: string): StorageItem<T> | null => {
    if (typeof window === "undefined") return null

    try {
      const item = localStorage.getItem(key)
      if (!item) return null

      return JSON.parse(item)
    } catch (e) {
      console.error(`[Storage] Failed to get ${key}:`, e)
      return null
    }
  },

  /**
   * Set item in localStorage with timestamp
   */
  set: <T>(key: string, value: T, version?: string): void => {
    if (typeof window === "undefined") return

    try {
      const item: StorageItem<T> = {
        value,
        timestamp: Date.now(),
        version,
      }
      localStorage.setItem(key, JSON.stringify(item))
    } catch (e) {
      console.error(`[Storage] Failed to save ${key}:`, e)
      // Handle quota exceeded error
      if (e instanceof DOMException && e.code === 22) {
        console.error("[Storage] Quota exceeded, attempting cleanup...")
        storage.cleanup("temp_", 0) // Remove all temp items
      }
    }
  },

  /**
   * Remove item from localStorage
   */
  remove: (key: string): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(key)
  },

  /**
   * Check if item exists and is not expired
   */
  has: (key: string, maxAge?: number): boolean => {
    if (typeof window === "undefined") return false

    const item = storage.getWithMeta(key)
    if (!item) return false

    if (maxAge && Date.now() - item.timestamp > maxAge) {
      storage.remove(key)
      return false
    }

    return true
  },

  /**
   * Clear all items with specific prefix
   */
  clear: (prefix: string): void => {
    if (typeof window === "undefined") return

    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key)
      }
    })
  },

  /**
   * Cleanup old items with specific prefix
   */
  cleanup: (prefix: string, maxAge: number): void => {
    if (typeof window === "undefined") return

    const keys = Object.keys(localStorage)
    let removed = 0

    keys.forEach((key) => {
      if (key.startsWith(prefix)) {
        const item = storage.getWithMeta(key)
        if (item && Date.now() - item.timestamp > maxAge) {
          localStorage.removeItem(key)
          removed++
        }
      }
    })

    if (removed > 0) {
      console.log(
        `[Storage] Cleaned up ${removed} expired items with prefix "${prefix}"`
      )
    }
  },

  /**
   * Get storage size info
   */
  getSize: (): { used: number; total: number; percentage: number } | null => {
    if (typeof window === "undefined") return null

    try {
      let used = 0
      for (const key in localStorage) {
        if (Object.hasOwn(localStorage, key)) {
          used += localStorage[key].length + key.length
        }
      }

      // Estimate total (usually 5-10MB)
      const total = 5 * 1024 * 1024 // 5MB
      const percentage = (used / total) * 100

      return { used, total, percentage }
    } catch (e) {
      console.error("[Storage] Failed to calculate size:", e)
      return null
    }
  },
}

/**
 * Hook for automatic cleanup on mount
 */
export function useStorageCleanup() {
  if (typeof window === "undefined") return

  // Cleanup on mount
  storage.cleanup("temp_", 24 * 60 * 60 * 1000) // 24 hours
  storage.cleanup("draft_", 7 * 24 * 60 * 60 * 1000) // 7 days

  // Check storage size
  const size = storage.getSize()
  if (size && size.percentage > 80) {
    console.warn(
      `[Storage] Usage at ${size.percentage.toFixed(1)}% - consider cleanup`
    )
  }
}
