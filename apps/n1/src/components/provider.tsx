"use client"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import {
  makeQueryClient,
  StorefrontDataProvider,
} from "@techsio/storefront-data/client"
import { Toaster } from "@techsio/ui-kit/molecules/toast"
import { Suspense } from "react"
import { PrefetchManager } from "./prefetch-manager"

const queryClient = makeQueryClient({
  defaultOptions: {
    mutations: {
      retry: 0,
      retryDelay: 0,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StorefrontDataProvider client={queryClient}>
      <Suspense fallback={null}>
        <PrefetchManager />
      </Suspense>
      {children}
      <Toaster />
      {/* React Query DevTools - only in development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </StorefrontDataProvider>
  )
}
