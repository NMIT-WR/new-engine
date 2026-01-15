'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient, type QueryClientConfig } from '../client/query-client'

interface QueryProviderProps {
  children: React.ReactNode
  /** QueryClient configuration */
  config?: QueryClientConfig
}

/**
 * QueryClientProvider wrapper with SSR-safe client management
 *
 * Note: Add ReactQueryDevtools separately in your app if needed:
 * ```tsx
 * import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
 * // Inside QueryProvider children:
 * <ReactQueryDevtools initialIsOpen={false} />
 * ```
 */
export function QueryProvider({ children, config }: QueryProviderProps) {
  const queryClient = getQueryClient(config)

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
