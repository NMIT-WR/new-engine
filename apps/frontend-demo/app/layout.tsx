import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Frontend Demo',
  description: 'Demo e-commerce frontend',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  )
}
