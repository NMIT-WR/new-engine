'use client'

import { useCategories } from '@/hooks/use-categories'
import { useProducts } from '@/hooks/use-products'

export default function TestCategoriesPage() {
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories()
  const {
    products,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts()

  return (
    <div className="p-8">
      <h1 className="mb-4 font-bold text-2xl">Categories Test</h1>

      <div className="mb-8">
        <h2 className="mb-2 font-semibold text-xl">Categories from API:</h2>
        {categoriesLoading ? (
          <p>Loading categories...</p>
        ) : categoriesError ? (
          <p className="text-red-500">Error: {categoriesError}</p>
        ) : (
          <div>
            <p className="mb-2">Found {categories.length} categories:</p>
            <ul className="list-disc pl-6">
              {categories.map((cat: any) => (
                <li key={cat.id}>
                  {cat.name} ({cat.handle})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-2 font-semibold text-xl">
          Products with Categories:
        </h2>
        {productsLoading ? (
          <p>Loading products...</p>
        ) : productsError ? (
          <p className="text-red-500">Error: {productsError}</p>
        ) : (
          <div>
            <p className="mb-2">Checking first 10 products:</p>
            <ul className="list-disc pl-6">
              {products.slice(0, 10).map((product: any) => (
                <li key={product.id}>
                  <strong>{product.title}</strong> ({product.handle}):
                  {product.categories && product.categories.length > 0 ? (
                    product.categories.map((c: any) => c.name).join(', ')
                  ) : (
                    <span className="text-red-500"> NO CATEGORIES</span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Products with categories:{' '}
              {
                products.filter(
                  (p: any) => p.categories && p.categories.length > 0
                ).length
              }{' '}
              / {products.length}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
