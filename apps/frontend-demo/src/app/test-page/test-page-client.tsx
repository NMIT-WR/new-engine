"use client"

import { useQuery } from "@tanstack/react-query"
import { testQueryOptions } from "./test-query"
import { useProducts } from "./storefront-products"
import { useCollections } from "./storefront-collections"
import { useCategories } from "./storefront-categories"
import { useRegions } from "./storefront-regions"

export function TestPageClient() {
  const { data, dataUpdatedAt, status } = useQuery(testQueryOptions)
  const {
    products,
    isLoading,
    error,
    currentPage,
    totalPages,
  } = useProducts({
    page: 1,
    limit: 4,
    sort: "newest",
  })
  const collectionsQuery = useCollections({
    limit: 4,
  })
  const categoriesQuery = useCategories({
    limit: 4,
  })
  const regionsQuery = useRegions({})
  const updatedAt = dataUpdatedAt
    ? new Date(dataUpdatedAt).toISOString()
    : "n/a"

  return (
    <main className="mx-auto flex w-full max-w-layout-max flex-col gap-4 px-4 py-10">
      <h1 className="font-bold text-2xl">Storefront data test</h1>
      <div className="rounded-md border border-border-subtle bg-surface p-4">
        <div className="text-sm text-fg-secondary">Query status: {status}</div>
        <pre className="mt-2 whitespace-pre-wrap font-mono text-sm">
          {data ? JSON.stringify(data, null, 2) : "No data yet"}
        </pre>
        <div className="mt-2 text-xs text-fg-tertiary">
          Updated at: {updatedAt}
        </div>
      </div>
      <div className="rounded-md border border-border-subtle bg-surface p-4">
        <div className="text-sm text-fg-secondary">
          Products hook (page {currentPage} / {totalPages || 1})
        </div>
        {isLoading ? (
          <div className="mt-2 text-sm text-fg-tertiary">Loading products...</div>
        ) : error ? (
          <div className="mt-2 text-sm text-red-600">{error}</div>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {products.length === 0 ? (
              <li className="text-fg-tertiary">No products returned.</li>
            ) : (
              products.map((product) => (
                <li key={product.id}>
                  <span className="font-medium">{product.title}</span>
                  {product.handle ? (
                    <span className="ml-2 text-fg-tertiary">
                      / {product.handle}
                    </span>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      <div className="rounded-md border border-border-subtle bg-surface p-4">
        <div className="text-sm text-fg-secondary">Collections hook</div>
        {collectionsQuery.isLoading ? (
          <div className="mt-2 text-sm text-fg-tertiary">
            Loading collections...
          </div>
        ) : collectionsQuery.error ? (
          <div className="mt-2 text-sm text-red-600">
            {collectionsQuery.error}
          </div>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {collectionsQuery.collections.length === 0 ? (
              <li className="text-fg-tertiary">No collections returned.</li>
            ) : (
              collectionsQuery.collections.map((collection) => (
                <li key={collection.id}>
                  <span className="font-medium">{collection.title}</span>
                  {collection.handle ? (
                    <span className="ml-2 text-fg-tertiary">
                      / {collection.handle}
                    </span>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      <div className="rounded-md border border-border-subtle bg-surface p-4">
        <div className="text-sm text-fg-secondary">Categories hook</div>
        {categoriesQuery.isLoading ? (
          <div className="mt-2 text-sm text-fg-tertiary">
            Loading categories...
          </div>
        ) : categoriesQuery.error ? (
          <div className="mt-2 text-sm text-red-600">
            {categoriesQuery.error}
          </div>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {categoriesQuery.categories.length === 0 ? (
              <li className="text-fg-tertiary">No categories returned.</li>
            ) : (
              categoriesQuery.categories.map((category) => (
                <li key={category.id}>
                  <span className="font-medium">{category.name}</span>
                  {category.handle ? (
                    <span className="ml-2 text-fg-tertiary">
                      / {category.handle}
                    </span>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      <div className="rounded-md border border-border-subtle bg-surface p-4">
        <div className="text-sm text-fg-secondary">Regions hook</div>
        {regionsQuery.isLoading ? (
          <div className="mt-2 text-sm text-fg-tertiary">
            Loading regions...
          </div>
        ) : regionsQuery.error ? (
          <div className="mt-2 text-sm text-red-600">{regionsQuery.error}</div>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {regionsQuery.regions.length === 0 ? (
              <li className="text-fg-tertiary">No regions returned.</li>
            ) : (
              regionsQuery.regions.map((region) => (
                <li key={region.id}>
                  <span className="font-medium">
                    {region.name || region.currency_code}
                  </span>
                  <span className="ml-2 text-fg-tertiary">
                    {region.currency_code?.toUpperCase()}
                  </span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </main>
  )
}
