import { sdk } from '@/lib/medusa-client'
import type { Metadata } from 'next'
import ProductDetail from './product-detail'

export async function generateStaticParams() {
  try {
    const response = await sdk.store.product.list({
      limit: 100,
    })
    return response.products.map((product) => ({
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
    const response = await sdk.store.product.list({
      handle: resolvedParams.handle,
      limit: 1,
    })

    const product = response.products[0]

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
