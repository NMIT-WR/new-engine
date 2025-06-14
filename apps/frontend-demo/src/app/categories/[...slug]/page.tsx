import CategoryPageClient from '@/app/categories/components/category-page-client'

// Define known categories for static generation
const KNOWN_CATEGORIES = [
  't-shirts-tops',
  'jeans-pants',
  'shirts',
  'sweatshirts',
  'pants',
  'shorts',
  'jackets',
  'accessories',
  'shoes',
  'dresses',
  'skirts',
  'outerwear',
  'activewear',
]

export async function generateStaticParams() {
  return KNOWN_CATEGORIES.map((handle) => ({
    slug: [handle],
  }))
}

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params
  const handle = resolvedParams.slug[0]

  // For static export, we'll render a client component that fetches data
  return <CategoryPageClient categoryHandle={handle} />
}
