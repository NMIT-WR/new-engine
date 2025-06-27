'use client'

import { categoryTree } from '@/lib/static-data/categories'
import { TreeView } from '@ui/molecules/tree-view'
import { useRouter } from 'next/navigation'

interface CategoryTreeSectionProps {
  title?: string
  subtitle?: string
  className?: string
}

export function CategoryTreeSection({
  title = 'Procházet kategorie',
  subtitle,
  className = '',
}: CategoryTreeSectionProps) {
  const router = useRouter()

  const handleCategorySelect = (details: { selectedValue: string[] }) => {
    // Navigate to products page with selected category
    if (details.selectedValue.length > 0) {
      const categoryId = details.selectedValue[0] // Take first selected
      router.push(`/products?categories=${categoryId}`)
    }
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
          {categoryTree.length > 0 ? (
            <TreeView
              id="homepage-category-tree"
              data={categoryTree as any}
              selectionMode="single"
              onSelectionChange={handleCategorySelect}
            />
          ) : (
            <div className="text-center text-gray-500">
              Žádné kategorie nejsou k dispozici
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
