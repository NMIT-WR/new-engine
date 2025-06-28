import ProductDetail from './product-detail'

// Enable ISR with 60 second revalidation
export const revalidate = 60

// Don't pre-generate any products at build time
// They will be generated on-demand
export async function generateStaticParams() {
  return []
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const resolvedParams = await params

  return <ProductDetail handle={resolvedParams.handle} />
}
