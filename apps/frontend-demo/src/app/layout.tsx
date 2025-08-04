import type { Metadata } from 'next'
import '../tokens/index.css'
import { DisclaimerWrapper } from '@/components/disclaimer-wrapper'
import { Footer } from '@/components/footer'
import { HeaderWrapper } from '@/components/header-wrapper'
import { Providers } from '@/components/providers'
import type * as React from 'react'

export const metadata: Metadata = {
  title: 'Frontend Demo',
  description: 'Demo application using the UI library',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen min-w-layout-min flex-col">
        <Providers>
          <HeaderWrapper
            logo={{ text: 'Demo Store', icon: 'icon-[mdi--store]' }}
          />
          <main className="flex-1">
            <DisclaimerWrapper />
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
