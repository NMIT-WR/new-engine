"use client"

import type { PropsWithChildren } from "react"
import { StorefrontDataProvider } from "@techsio/storefront-data/client"

export default function TestPageLayout({ children }: PropsWithChildren) {
  return <StorefrontDataProvider>{children}</StorefrontDataProvider>
}
