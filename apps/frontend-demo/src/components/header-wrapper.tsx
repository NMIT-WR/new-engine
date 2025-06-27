'use client'

import { Header } from '@/components/header'
import type { NavItem } from '@/components/molecules/navigation'
import { allCategories } from '@/lib/static-data/categories'
import { useMemo } from 'react'

interface HeaderWrapperProps {
  logo: {
    text?: string
    icon?: any
  }
}

export function HeaderWrapper({ logo }: HeaderWrapperProps) {
  const navigationItems = useMemo<NavItem[]>(() => {
    const categoryItems: NavItem[] = [
      { title: 'Všechny kategorie', href: '/categories' },
    ]

    // Add static categories
    if (allCategories.length > 0) {
      categoryItems.push(
        ...allCategories.slice(0, 10).map((cat) => ({
          title: cat.name,
          href: `/products?categories=${cat.id}`,
        }))
      )
    }

    return [
      { title: 'Domů', href: '/' },
      { title: 'Produkty', href: '/products' },
      {
        title: 'Kategorie',
        role: 'submenu' as const,
        children: categoryItems,
      },
      { title: 'O nás', href: '/about' },
      { title: 'Kontakt', href: '/contact' },
    ]
  }, [])

  return <Header logo={logo} navigationItems={navigationItems} />
}
