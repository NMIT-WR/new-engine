import type { Metadata } from 'next'
import '../tokens/index.css'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Frontend Demo',
  description: 'Demo application using the UI library',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
