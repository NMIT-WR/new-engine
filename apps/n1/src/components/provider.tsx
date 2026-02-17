"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster } from "@techsio/ui-kit/molecules/toast"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Suspense, useState } from "react"
import { PrefetchManager } from "./prefetch-manager"

function makeQueryClient() {
  return new QueryClient()
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient()
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }

  return browserQueryClient
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient())

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={null}>
          <PrefetchManager />
        </Suspense>
        {children}
        <Toaster />
        {/* React Query DevTools - only in development */}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </NuqsAdapter>
  )
}
