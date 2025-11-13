import { queryKeys } from '@/lib/query-keys'
import { type LoginCredentials, login } from '@/services/auth-service'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface UseLoginOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

/**
 * Login mutation hook
 * Automatically invalidates auth cache on success
 */
export function useLogin(options?: UseLoginOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: () => {
      // Invalidate auth cache to refetch customer data
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all() })
      options?.onSuccess?.()
    },
    onError: (error: Error) => {
      options?.onError?.(error)
    },
  })
}
