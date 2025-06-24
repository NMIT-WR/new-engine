import { httpClient } from '@/lib/http-client'
import type { Metadata } from 'next'
import ProductDetail from './product-detail'

// Use error fallback for missing pages in static export
export const dynamic = 'error'

export async function generateStaticParams() {
  try {
    // Fetch ALL products to generate static pages
    const allProducts = []
    let offset = 0
    const limit = 100
    
    // Fetch products in batches
    while (true) {
      const response = await httpClient.get<{ products: any[]; count: number }>(
        '/store/products',
        {
          params: {
            limit,
            offset,
            fields: 'id,handle',
          },
        }
      )

      if (!response.products || response.products.length === 0) {
        break
      }

      allProducts.push(...response.products)
      
      // Check if we've fetched all products
      if (allProducts.length >= response.count || response.products.length < limit) {
        break
      }
      
      offset += limit
    }

    console.log(`[generateStaticParams] Generating params for ${allProducts.length} products`)

    return allProducts.map((product) => ({
      handle: product.handle || product.id,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const resolvedParams = await params

  try {
    const response = await httpClient.get<{ products: any[] }>(
      '/store/products',
      {
        params: {
          handle: resolvedParams.handle,
          limit: 1,
          fields: 'id,title,description,handle',
        },
      }
    )

    const product = response.products?.[0]

    if (!product) {
      return {
        title: 'Product Not Found',
      }
    }

    return {
      title: `${product.title} | Demo Store`,
      description: product.description || `Shop ${product.title} at our store`,
    }
  } catch (error) {
    return {
      title: 'Product | Demo Store',
    }
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const resolvedParams = await params

  return <ProductDetail handle={resolvedParams.handle} />
}
