'use client'

import { Header } from '@/components/header'
import type { NavItem } from '@/components/molecules/navigation'
import { useCategories } from '@/hooks/use-categories'
import { useMemo } from 'react'

interface HeaderWrapperProps {
  logo: {
    text?: string
    icon?: any
  }
}

export function HeaderWrapper({ logo }: HeaderWrapperProps) {
  const { categories, isLoading } = useCategories()

  const navigationItems = useMemo<NavItem[]>(() => {
    const categoryItems: NavItem[] = [
      { title: 'Všechny kategorie', href: '/categories' },
    ]

    // Add dynamic categories if loaded
    if (!isLoading && categories.length > 0) {
      categoryItems.push(
        ...categories.slice(0, 10).map((cat: any) => ({
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
  }, [categories, isLoading])

  return <Header logo={logo} navigationItems={navigationItems} />
}
