/**
 * Simple localStorage utilities with error handling
 */

export const storage = {
  /**
   * Get item from localStorage
   */
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (e) {
      return null
    }
  },

  /**
   * Set item in localStorage
   */
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      // Silently fail - localStorage might be full or disabled
    }
  },

  /**
   * Remove item from localStorage
   */
  remove: (key: string): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  },
}

/**
 * Storage keys constants
 */
export const STORAGE_KEYS = {
  // Medusa specific
  REGION_ID: 'medusa_region_id',
  CART_ID: 'medusa_cart_id',
} as const