"use client"

import { StorefrontDataProvider } from "@techsio/storefront-data"
import { Toaster } from "@techsio/ui-kit/molecules/toast"
import { ThemeProvider } from "next-themes"
import type { PropsWithChildren } from "react"
import { Suspense } from "react"
import { RegionProvider } from "@/providers/region-provider"

export function Providers({ children }: PropsWithChildren) {
  return (
    <StorefrontDataProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
      >
        <Suspense fallback={null}>
          <RegionProvider>
            {children}
            <Toaster />
          </RegionProvider>
        </Suspense>
      </ThemeProvider>
    </StorefrontDataProvider>
  )
}
