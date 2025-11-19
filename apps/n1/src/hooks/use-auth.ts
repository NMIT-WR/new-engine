import { cacheConfig } from '@/lib/cache-config'
import { queryKeys } from '@/lib/query-keys'
import {
  getTokenFromStorage,
  isTokenExpired,
  clearToken,
} from '@/lib/token-utils'
import { getCustomer } from '@/services/auth-service'
import { useQuery } from '@tanstack/react-query'

export interface UseAuthReturn {
  customer: Awaited<ReturnType<typeof getCustomer>>
  isAuthenticated: boolean
  isLoading: boolean
  error: Error | null
  isTokenExpired: boolean
}

/**
 * Get current authenticated customer
 * Checks token expiration before making API request
 * Uses realtime cache for responsive auth state
 */
export function useAuth(): UseAuthReturn {
  const { data: customer = null, isLoading, error } = useQuery({
    queryKey: queryKeys.auth.customer(),
    queryFn: async () => {
      // Check token expiration BEFORE making request
      const token = getTokenFromStorage()

      if (!token) {
        return null // No token = not authenticated
      }

      if (isTokenExpired(token)) {
        // Token expired - clear it and don't make request
        clearToken()
        return null
      }

      // Token valid - fetch customer data
      return getCustomer()
    },
    retry: false, // Don't retry auth failures
    ...cacheConfig.realtime, // 30s stale, refetch on focus
  })

  // Check current token expiration status for UI
  const token = getTokenFromStorage()
  const tokenExpired = token ? isTokenExpired(token) : false

  return {
    customer,
    isAuthenticated: customer !== null,
    isLoading,
    error: error as Error | null,
    isTokenExpired: tokenExpired,
  }
}
