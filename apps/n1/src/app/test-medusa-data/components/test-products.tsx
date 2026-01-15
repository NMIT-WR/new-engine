'use client'

import { useState } from 'react'
import { useProducts } from '@libs/medusa-data/hooks'

export function TestProducts() {
  const [page, setPage] = useState(1)

  const {
    products,
    isLoading,
    isFetching,
    isPlaceholderData,
    error,
    totalCount,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
  } = useProducts({
    page,
    limit: 12,
  })

  if (error) {
    return <div className="text-danger">Error: {error}</div>
  }

  return (
    <div className="flex flex-col gap-400">
      {/* Status */}
      <div className="flex gap-300 text-sm flex-wrap">
        <span
          className={`px-200 py-50 rounded ${
            isLoading ? 'bg-warning-light text-warning' : 'bg-success-light text-success'
          }`}
        >
          {isLoading ? '⏳ Loading' : '✅ Loaded'}
        </span>
        {isFetching && !isLoading && (
          <span className="px-200 py-50 rounded bg-info-light text-info">
            🔄 Fetching page {page}...
          </span>
        )}
        {isPlaceholderData && (
          <span className="px-200 py-50 rounded bg-tertiary text-fg-reverse">
            📋 Showing previous data
          </span>
        )}
        <span className="px-200 py-50 rounded bg-surface text-fg-secondary">
          Total: {totalCount} products
        </span>
      </div>

      {/* Products Grid */}
      <div
        className={`grid grid-cols-2 md:grid-cols-4 gap-400 transition-opacity ${
          isPlaceholderData ? 'opacity-60' : 'opacity-100'
        }`}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-border-secondary rounded p-200 text-sm"
          >
            {product.thumbnail && (
              <img
                src={product.thumbnail}
                alt={product.title || ''}
                className="w-full h-[80px] object-cover rounded mb-200"
              />
            )}
            <div className="font-medium text-fg-primary truncate">
              {product.title}
            </div>
            <div className="text-fg-tertiary text-xs truncate">
              {product.handle}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-400">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={!hasPrevPage || isFetching}
          className="px-400 py-200 bg-surface rounded disabled:opacity-50 text-fg-primary"
        >
          Previous
        </button>
        <span className="text-sm text-fg-secondary">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasNextPage || isFetching}
          className="px-400 py-200 bg-surface rounded disabled:opacity-50 text-fg-primary"
        >
          Next
        </button>
      </div>
    </div>
  )
}
