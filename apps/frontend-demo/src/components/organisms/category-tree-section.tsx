'use client'

import { useCategoryTree } from '@/hooks/use-categories'
import { TreeView } from '@ui/molecules/tree-view'
import { useRouter } from 'next/navigation'

interface CategoryTreeSectionProps {
  title?: string
  subtitle?: string
  className?: string
}

export function CategoryTreeSection({
  title = 'Browse Categories',
  subtitle,
  className = '',
}: CategoryTreeSectionProps) {
  const { tree, isLoading } = useCategoryTree()
  const router = useRouter()

  const handleCategorySelect = (details: { selectedValue: string[] }) => {
    // Navigate to products page with selected category
    if (details.selectedValue.length > 0) {
      const categoryId = details.selectedValue[0] // Take first selected
      router.push(`/products?categories=${categoryId}`)
    }
  }

  if (isLoading) {
    return (
      <section className={`py-12 ${className}`}>
        <div className="mx-auto px-4">
          <div className="text-center">Loading categories...</div>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-12 ${className}`}>
      <div className="mx-auto px-4">
        {title && (
          <div className="mb-8 text-center">
            <h2 className="font-bold text-3xl">{title}</h2>
            {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
          </div>
        )}

        <div className="mx-auto max-w-96">
          {tree.length > 0 ? (
            <TreeView
              id="homepage-category-tree"
              data={tree as any}
              selectionMode="single"
              onSelectionChange={handleCategorySelect}
            />
          ) : (
            <div className="text-center text-gray-500">
              No categories available
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
