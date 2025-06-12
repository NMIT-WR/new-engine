'use client'

import { CategoryGrid } from '@/components/organisms/category-grid'
import { ProductGrid } from '@/components/organisms/product-grid'
import { useCategories, type CategoryWithStats } from '@/hooks/use-categories'
import { useProducts } from '@/hooks/use-products'
import { useState } from 'react'
import { Badge } from 'ui/src/atoms/badge'
import { ErrorText } from 'ui/src/atoms/error-text'
import { Button } from 'ui/src/atoms/button'
import type { Category } from '@/types/product'

// Loading skeleton for categories
function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse space-y-3">
          <div className="aspect-video rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ApiCategoriesPage() {
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories()
  const { products, isLoading: productsLoading, error: productsError } = useProducts()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? products.filter(product =>
        product.categories?.some(cat => cat.id === selectedCategory.id) || false
      )
    : []

  const isLoading = categoriesLoading || productsLoading
  const error = categoriesError || productsError

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 font-bold text-3xl">Categories API Test</h1>
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="info">Backend: localhost:9000</Badge>
          <Badge variant={isLoading ? 'warning' : error ? 'danger' : 'success'}>
            {isLoading ? 'Loading...' : error ? 'Error' : 'Connected'}
          </Badge>
          <Badge variant="primary">{`Categories: ${categories.length}`}</Badge>
          <Badge variant="primary">{`Total Products: ${products.length}`}</Badge>
        </div>
        {error && (
          <ErrorText showIcon className="mb-4">
            {error}
          </ErrorText>
        )}
      </div>

      {/* Category Selection */}
      {selectedCategory && (
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            ← Back to Categories
          </Button>
          <h2 className="font-semibold text-xl">
            {selectedCategory.name} ({filteredProducts.length} products)
          </h2>
        </div>
      )}

      {/* Content */}
      {!selectedCategory ? (
        <>
          <h2 className="mb-4 font-semibold text-xl">All Categories</h2>
          {categoriesLoading ? (
            <CategoryGridSkeleton />
          ) : categories.length > 0 ? (
            <CategoryGrid
              categories={categories.map((cat: CategoryWithStats) => ({
                ...cat,
                imageUrl: cat.imageUrl || '/api/placeholder/400/300',
              }))}
              onCategoryClick={setSelectedCategory}
            />
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">No categories found</p>
            </div>
          )}
        </>
      ) : (
        <>
          {productsLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-700" />
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">No products found in this category</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}