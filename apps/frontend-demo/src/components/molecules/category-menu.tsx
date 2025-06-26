'use client'

import { useCategoryTree, type CategoryTreeNode } from '@/hooks/use-categories'
import { Menu, type MenuItem } from '@ui/molecules/menu'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

export function CategoryMenu() {
  const router = useRouter()
  const { tree: categoryTree, isLoading } = useCategoryTree()

  // Convert category tree to menu items
  const categoryMenuItems = useMemo<MenuItem[]>(() => {
    function categoryToMenuItem(category: CategoryTreeNode): MenuItem {
      if (category.children && category.children.length > 0) {
        return {
          type: 'submenu',
          value: category.id,
          label: category.name,
          items: category.children.map(categoryToMenuItem),
        }
      }
      return {
        type: 'action',
        value: category.id,
        label: category.name,
      }
    }

    const items: MenuItem[] = [
      { type: 'action', value: 'all', label: 'Všechny kategorie' },
    ]

    if (!isLoading && categoryTree.length > 0) {
      items.push(
        { type: 'separator', id: 'sep-categories' },
        ...categoryTree.map(categoryToMenuItem)
      )
    }

    return items
  }, [categoryTree, isLoading])

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
      triggerText={isLoading ? 'Načítání...' : 'Kategorie'}
      triggerIcon="token-icon-grid"
      onSelect={handleSelect}
      size="md"
      positioning={{
        placement: 'bottom-start',
      }}
    />
  )
}