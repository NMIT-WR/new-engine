'use client'

import { MedusaDataProvider } from '@libs/medusa-data/providers'

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

export default function TestMedusaDataLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MedusaDataProvider
      baseUrl={BACKEND_URL}
      publishableKey={PUBLISHABLE_KEY}
      queryKeysPrefix="test-lib"
      defaultCountryCode="cz"
      debug
    >
      {children}
    </MedusaDataProvider>
  )
}
