import type { Metadata } from 'next'
import '../tokens/index.css'
import type { ReactNode } from 'react'
import { Navigation } from '../components/navigation'
import { Footer } from '../components/footer'

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
      <body className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
