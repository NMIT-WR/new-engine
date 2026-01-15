import { Suspense } from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient, createServerPrefetch } from '@libs/medusa-data/server'
import { createMedusaClient } from '@libs/medusa-data/client'
import { TestProducts } from './components/test-products'
import { TestPrefetch } from './components/test-prefetch'
import { TestRegion } from './components/test-region'

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

export default async function TestMedusaDataPage() {
  const queryClient = getQueryClient()

  // Create SDK and server prefetch utilities
  const sdk = createMedusaClient({
    baseUrl: BACKEND_URL,
    publishableKey: PUBLISHABLE_KEY,
  })

  const serverPrefetch = createServerPrefetch({
    queryKeysConfig: { prefix: 'test-lib' },
    sdk,
    baseUrl: BACKEND_URL,
    publishableKey: PUBLISHABLE_KEY,
    defaultCountryCode: 'cz',
  })

  // Prefetch regions first
  await serverPrefetch.prefetchRegions(queryClient)

  // Get region ID for product prefetch
  const regions = queryClient.getQueryData<Array<{ id: string }>>(
    serverPrefetch.queryKeys.regions()
  )
  const regionId = regions?.[0]?.id

  // Prefetch products if we have a region
  if (regionId) {
    await serverPrefetch.prefetchProducts(queryClient, {
      region_id: regionId,
      limit: 12,
      page: 1,
    })
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="p-600">
        <h1 className="text-2xl font-bold mb-600">
          @libs/medusa-data Test Page
        </h1>

        <div className="flex flex-col gap-600">
          {/* Section 1: Region Hook Test */}
          <section className="border border-border-secondary p-400 rounded-lg">
            <h2 className="text-xl font-semibold mb-400">1. useRegion Hook</h2>
            <Suspense fallback={<div className="text-fg-secondary">Loading region...</div>}>
              <TestRegion />
            </Suspense>
          </section>

          {/* Section 2: Products Hook Test (SSR prefetched) */}
          <section className="border border-border-secondary p-400 rounded-lg">
            <h2 className="text-xl font-semibold mb-400">
              2. useProducts Hook (SSR Prefetched)
            </h2>
            <p className="text-sm text-fg-secondary mb-400">
              Data was prefetched on server - should render instantly without loading state
            </p>
            <Suspense fallback={<div className="text-fg-secondary">Loading products...</div>}>
              <TestProducts />
            </Suspense>
          </section>

          {/* Section 3: Prefetch Hook Test */}
          <section className="border border-border-secondary p-400 rounded-lg">
            <h2 className="text-xl font-semibold mb-400">
              3. usePrefetchProduct Hook
            </h2>
            <p className="text-sm text-fg-secondary mb-400">
              Hover over product cards to trigger prefetch (check console)
            </p>
            <TestPrefetch />
          </section>

          {/* Section 4: Cache Status */}
          <section className="border border-border-secondary p-400 rounded-lg">
            <h2 className="text-xl font-semibold mb-400">4. Cache Info</h2>
            <ul className="list-disc pl-400 text-sm text-fg-secondary">
              <li>Query key prefix: <code className="bg-surface px-100 rounded">test-lib</code></li>
              <li>Regions: cached with Infinity staleTime</li>
              <li>Products: cached with semiStatic (1h staleTime)</li>
            </ul>
          </section>
        </div>
      </div>
    </HydrationBoundary>
  )
}
