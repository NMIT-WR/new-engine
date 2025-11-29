import { queryKeys } from '@/lib/query-keys'
import { type LoginCredentials, login } from '@/services/auth-service'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface UseLoginOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useLogin(options?: UseLoginOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: () => {
      // Invalidate auth cache to refetch customer data
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.profile() })
      options?.onSuccess?.()
    },
    onError: (error: Error) => {
      options?.onError?.(error)
    },
  })
}
