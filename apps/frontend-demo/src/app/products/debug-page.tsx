'use client'
import { ProductService } from '@/services/product-service'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export default function DebugProductsPage() {
  const [clientLog, setClientLog] = useState<string[]>([])

  const addLog = (msg: string) => {
    console.log(`[DEBUG] ${msg}`)
    setClientLog((prev) => [...prev, `${new Date().toISOString()}: ${msg}`])
  }

  // Direct API test
  useEffect(() => {
    addLog('Component mounted')

    // Test 1: Direct fetch
    fetch('https://medusa-13d1-9000.prg1.zerops.app/store/products?limit=2', {
      headers: {
        'x-publishable-api-key':
          'pk_74f1324ffd40391dc3b032570712687dc7d2575c82e70f2c68a1b78ee1c14191',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        addLog(
          `Direct fetch: ${data.products?.length || 0} products, total: ${data.count || 0}`
        )
      })
      .catch((err) => {
        addLog(`Direct fetch error: ${err.message}`)
      })

    // Test 2: ProductService
    ProductService.getProducts({ limit: 2, offset: 0 })
      .then((data) => {
        addLog(
          `ProductService: ${data.products?.length || 0} products, total: ${data.count || 0}`
        )
      })
      .catch((err) => {
        addLog(`ProductService error: ${err.message}`)
      })
  }, [])

  // Test 3: React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['debug-products'],
    queryFn: () => {
      addLog('React Query: queryFn called')
      return ProductService.getProducts({ limit: 2, offset: 0 })
    },
  })

  useEffect(() => {
    addLog(
      `React Query state: isLoading=${isLoading}, hasData=${!!data}, hasError=${!!error}`
    )
  }, [isLoading, data, error])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 font-bold text-2xl">Debug Products Page</h1>

      <div className="space-y-4">
        <section className="rounded border p-4">
          <h2 className="mb-2 font-bold">Client Log:</h2>
          <pre className="max-h-60 overflow-auto rounded bg-gray-100 p-2 text-xs">
            {clientLog.join('\n')}
          </pre>
        </section>

        <section className="rounded border p-4">
          <h2 className="mb-2 font-bold">React Query State:</h2>
          <pre className="rounded bg-gray-100 p-2 text-xs">
            {JSON.stringify(
              {
                isLoading,
                hasData: !!data,
                productsLength: data?.products?.length || 0,
                totalCount: data?.count || 0,
                error: error ? String(error) : null,
              },
              null,
              2
            )}
          </pre>
        </section>

        <section className="rounded border p-4">
          <h2 className="mb-2 font-bold">First Product (if any):</h2>
          <pre className="max-h-40 overflow-auto rounded bg-gray-100 p-2 text-xs">
            {data?.products?.[0]
              ? JSON.stringify(data.products[0], null, 2)
              : 'No products'}
          </pre>
        </section>
      </div>
    </div>
  )
}
