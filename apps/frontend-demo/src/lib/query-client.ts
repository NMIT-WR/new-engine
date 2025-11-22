import { QueryClient } from "@tanstack/react-query"
import { cache } from "react"

// Create a singleton query client for server-side rendering
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          // With SSR, we usually want to set some default staleTime
          // above 0 to avoid refetching immediately on the client
          staleTime: 60 * 1000, // 1 minute
        },
      },
    })
)
