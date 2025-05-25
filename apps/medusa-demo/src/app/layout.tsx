import { getBaseURL } from '@lib/util/env'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Mona_Sans } from 'next/font/google'

import '../styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

const monaSans = Mona_Sans({
  preload: true,
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  weight: 'variable',
  variable: '--font-mona-sans',
})

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className="antialiased">
      <body className={`${monaSans.className}`}>
        <main className="relative">{props.children}</main>
        <SpeedInsights />
      </body>
    </html>
  )
}
