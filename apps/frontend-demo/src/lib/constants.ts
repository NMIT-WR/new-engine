/**
 * Centralized constants for the application
 */

// Storage keys
export const STORAGE_KEYS = {
  // Authentication & Cart
  AUTH_TOKEN: 'medusa_auth_token',
  CART_ID: 'medusa_cart_id',

  // User preferences
  THEME: 'theme',
  LANGUAGE: 'language',
  CURRENCY: 'currency',

  // UI state
  SIDEBAR_OPEN: 'sidebar_open',
  FILTERS_OPEN: 'filters_open',

  // Feature data
  RECENTLY_VIEWED: 'recently_viewed_products',
  SEARCH_HISTORY: 'search_history',

  // Temporary data
  FORM_DRAFT: 'temp_form_draft',
  CHECKOUT_DRAFT: 'temp_checkout_draft',
} as const

// API configuration
export const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
