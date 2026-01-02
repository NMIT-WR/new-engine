/**
 * Component Debug Logger Utility
 * Logs component state for debugging purposes
 */

interface CategoryPageStates {
  isLoading: boolean
  isFetching: boolean
  isSuccess: boolean
  isReady: boolean
}

export const componentDebugLogger = {
  /**
   * Log category page React Query states
   */
  categoryPage: (states: CategoryPageStates) => {
    if (process.env.NODE_ENV !== 'development') return

    console.log('🔍 [Debug] Category Page', states)
  },
}
