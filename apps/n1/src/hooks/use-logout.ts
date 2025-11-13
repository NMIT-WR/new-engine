import { queryKeys } from '@/lib/query-keys'
import { logout } from '@/services/auth-service'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface UseLogoutOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

/**
 * Logout mutation hook
 * Clears all auth cache on success
 */
export function useLogout(options?: UseLogoutOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear all auth cache
      queryClient.removeQueries({ queryKey: queryKeys.auth.all() })
      options?.onSuccess?.()
    },
    onError: (error: Error) => {
      options?.onError?.(error)
    },
  })
}
