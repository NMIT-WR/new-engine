import { queryKeys } from '@/lib/query-keys'
import { type RegisterData, register } from '@/services/auth-service'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface UseRegisterOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

/**
 * Registration mutation hook
 * Automatically invalidates auth cache on success
 */
export function useRegister(options?: UseRegisterOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RegisterData) => register(data),
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
