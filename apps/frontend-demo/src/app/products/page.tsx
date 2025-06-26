import { HydrationBoundary } from '@tanstack/react-query'
import { prefetchProductsWithFilters } from '@/lib/prefetch-helpers'
import ProductsPageClient from './page-client'

// Enable ISR (Incremental Static Regeneration) with cache
export const revalidate = 60 // Revalidate every 60 seconds as requested

interface PageProps {
  params: Promise<{}>
  searchParams: Promise<{ 
    page?: string
    sort?: string
    categories?: string | string[]
    sizes?: string | string[]
    colors?: string | string[]
    minPrice?: string
    maxPrice?: string
    onSale?: string
    search?: string
  }>
}

export default async function ProductsPageServer({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const sort = params.sort
  
  // Parse filters from searchParams
  const filters = {
    categories: params.categories 
      ? (Array.isArray(params.categories) ? params.categories : [params.categories])
      : undefined,
    sizes: params.sizes
      ? (Array.isArray(params.sizes) ? params.sizes : [params.sizes])
      : undefined,
    colors: params.colors
      ? (Array.isArray(params.colors) ? params.colors : [params.colors])
      : undefined,
    priceRange: params.minPrice && params.maxPrice
      ? [Number(params.minPrice), Number(params.maxPrice)] as [number, number]
      : undefined,
    onSale: params.onSale === 'true',
    search: params.search,
  }
  
  // Prefetch data on the server
  const dehydratedState = await prefetchProductsWithFilters({
    page,
    limit: 12,
    filters,
    sort,
  })
  
  return (
    <HydrationBoundary state={dehydratedState}>
      <ProductsPageClient />
    </HydrationBoundary>
  )
}