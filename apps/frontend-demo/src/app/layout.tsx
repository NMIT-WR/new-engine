import type { Metadata } from 'next'
import '../tokens/index.css'
import type { ReactNode } from 'react'
import { Footer } from '../components/footer'
import { Header } from '../components/header'
import type { NavItem } from '../components/navigation'
import { Providers } from '../components/providers'

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
        { title: 'All Categories', href: '/categories' },
        { title: 'T-Shirts & Tops', href: '/categories/t-shirts-tops' },
        { title: 'Jeans & Pants', href: '/categories/jeans-pants' },
        { title: 'Shoes & Sneakers', href: '/categories/shoes-sneakers' },
        { title: 'Jackets & Coats', href: '/categories/jackets-coats' },
        { title: 'Dresses', href: '/categories/dresses' },
        { title: 'Accessories', href: '/categories/accessories' },
        { title: 'Knitwear', href: '/categories/knitwear' },
        { title: 'Activewear', href: '/categories/activewear' },
      ],
    },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
  ]

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header
            logo={{ text: 'Demo Store', icon: 'icon-[mdi--store]' }}
            navigationItems={navigationItems}
          />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
