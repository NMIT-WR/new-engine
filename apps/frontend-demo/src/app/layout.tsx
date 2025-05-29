import type { Metadata } from 'next'
import '../tokens/index.css'
import type { ReactNode } from 'react'
import { Footer } from '../components/footer'
import { Header } from '../components/header'
import type { NavItem } from '../components/navigation'

export const metadata: Metadata = {
  title: 'Frontend Demo',
  description: 'Demo application using the UI library',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const navigationItems: NavItem[] = [
    { title: 'Home', href: '/' },
    { title: 'Products', href: '/products' },
    {
      title: 'Categories',
      role: 'submenu',
      children: [
        { title: 'Clothing', href: '/categories/clothing' },
        { title: 'Accessories', href: '/categories/accessories' },
        { title: 'Shoes', href: '/categories/shoes' },
        { title: 'Sale', href: '/sale', label: 'Hot' },
      ],
    },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
  ]

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Header
          logo={{ text: 'Demo Store', icon: 'icon-[mdi--store]' }}
          navigationItems={navigationItems}
        />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
