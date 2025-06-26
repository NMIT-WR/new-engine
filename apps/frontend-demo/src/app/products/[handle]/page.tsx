import { httpClient } from '@/lib/http-client'
import type { Metadata } from 'next'
import ProductDetail from './product-detail'

// Enable ISR with 60 second revalidation
export const revalidate = 60

// Don't pre-generate any products at build time
// They will be generated on-demand
export async function generateStaticParams() {
  return []
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
