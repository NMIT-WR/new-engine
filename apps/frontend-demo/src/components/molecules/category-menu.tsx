'use client'

import { categoryTree } from '@/lib/static-data/categories'
import { categoryTreeToMenuItems } from '@/utils/category-helpers'
import { Menu, type MenuItem } from '@ui/molecules/menu'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

export function CategoryMenu() {
  const router = useRouter()

  // Convert category tree to menu items
  const categoryMenuItems = useMemo<MenuItem[]>(() => {
    const items: MenuItem[] = [
      { type: 'action', value: 'all', label: 'Všechny kategorie' },
    ]

    if (categoryTree.length > 0) {
      items.push(
        { type: 'separator', id: 'sep-categories' },
        ...categoryTreeToMenuItems(categoryTree)
      )
    }

    return items
  }, [])

  const handleSelect = (details: { value: string }) => {
    if (details.value === 'all') {
      router.push('/categories')
    } else {
      router.push(`/products?categories=${details.value}`)
    }
  }

  return (
    <Menu
      items={categoryMenuItems}
      triggerText="Kategorie"
      triggerIcon="token-icon-grid"
      onSelect={handleSelect}
      size="md"
      positioning={{
        placement: 'bottom-start',
      }}
    />
  )
}
