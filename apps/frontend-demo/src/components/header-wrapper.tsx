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
      { title: 'All Categories', href: '/categories' },
    ]

    // Add dynamic categories if loaded
    if (!isLoading && categories.length > 0) {
      categoryItems.push(
        ...categories.slice(0, 10).map((cat: any) => ({
          title: cat.name,
          href: `/categories/${cat.handle}`,
        }))
      )
    }

    return [
      { title: 'Home', href: '/' },
      { title: 'Products', href: '/products' },
      {
        title: 'Categories',
        role: 'submenu' as const,
        children: categoryItems,
      },
      { title: 'About', href: '/about' },
      { title: 'Contact', href: '/contact' },
    ]
  }, [categories, isLoading])

  return <Header logo={logo} navigationItems={navigationItems} />
}
