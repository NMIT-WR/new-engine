'use client'

import { type ReactNode } from 'react'
import { Toaster } from 'ui/src/molecules/toast'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}