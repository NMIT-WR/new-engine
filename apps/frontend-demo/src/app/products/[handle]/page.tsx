import { mockProducts } from '../../../data/mock-products'
import ProductDetail from './product-detail'

export async function generateStaticParams() {
  return mockProducts.map((product) => ({
    handle: product.handle,
  }))
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const resolvedParams = await params
  
  // Find product by handle (in real app, this would be an API call)
  const product = mockProducts.find((p) => p.handle === resolvedParams.handle)

  if (!product) {
    return <div>Product not found</div>
  }

  return <ProductDetail product={product} />
}