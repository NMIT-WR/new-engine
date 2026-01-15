'use client'

import { useProducts, usePrefetchProduct } from '@libs/medusa-data/hooks'

export function TestPrefetch() {
  const { products, isLoading } = useProducts({ limit: 6 })
  const { delayedPrefetch, cancelPrefetch } = usePrefetchProduct()

  if (isLoading) {
    return <div className="text-fg-secondary">Loading products for prefetch test...</div>
  }

  return (
    <div className="flex flex-col gap-400">
      <p className="text-sm bg-warning-light text-warning p-200 rounded">
        💡 Hover over a product card for 400ms to trigger prefetch. Check browser
        console for prefetch logs.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-400">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-border-secondary rounded p-300 cursor-pointer hover:border-primary hover:shadow-md transition-all"
            onMouseEnter={() => {
              if (product.handle) {
                console.log(`[Test] Mouse enter: ${product.handle}`)
                delayedPrefetch(product.handle)
              }
            }}
            onMouseLeave={() => {
              if (product.handle) {
                console.log(`[Test] Mouse leave: ${product.handle}`)
                cancelPrefetch(product.handle)
              }
            }}
          >
            {product.thumbnail && (
              <img
                src={product.thumbnail}
                alt={product.title || ''}
                className="w-full h-[100px] object-cover rounded mb-200"
              />
            )}
            <div className="font-medium text-fg-primary">{product.title}</div>
            <div className="text-xs text-fg-tertiary mt-100">
              Handle: <code className="bg-surface px-50 rounded">{product.handle}</code>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-fg-tertiary mt-200">
        <strong>How to verify:</strong>
        <ol className="list-decimal pl-400 mt-100 flex flex-col gap-50">
          <li>Open browser DevTools console</li>
          <li>Hover over a product card for &gt;400ms</li>
          <li>Check console for prefetch log messages (🚀 and 💾 icons)</li>
          <li>Network tab should show the prefetched request</li>
        </ol>
      </div>
    </div>
  )
}
