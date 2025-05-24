import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getBaseURL } from '@lib/util/env'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {props.children}
      <Footer />
    </>
  )
}
