import { cacheConfig } from '@/lib/cache-config'
import { queryKeys } from '@/lib/query-keys'
import { getCustomer } from '@/services/auth-service'
import { useQuery } from '@tanstack/react-query'

export interface UseAuthReturn {
  customer: Awaited<ReturnType<typeof getCustomer>>
  isAuthenticated: boolean
  isLoading: boolean
  error: Error | null
}

/**
 * Get current authenticated customer
 * Uses realtime cache for responsive auth state
 */
export function useAuth(): UseAuthReturn {
  const { data: customer = null, isLoading, error } = useQuery({
    queryKey: queryKeys.auth.customer(),
    queryFn: getCustomer,
    retry: false, // Don't retry auth failures
    ...cacheConfig.realtime, // 30s stale, refetch on focus
  })

  return {
    customer,
    isAuthenticated: customer !== null,
    isLoading,
    error: error as Error | null,
  }
}
