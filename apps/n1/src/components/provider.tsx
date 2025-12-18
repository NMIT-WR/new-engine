"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster } from "@techsio/ui-kit/molecules/toast"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Suspense } from "react"
import { PrefetchManager } from "./prefetch-manager"

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <Suspense fallback={null}>
          <PrefetchManager />
        </Suspense>
        {children}
        <Toaster />
        {/* React Query DevTools - only in development */}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </NuqsAdapter>
    </QueryClientProvider>
  )
}
