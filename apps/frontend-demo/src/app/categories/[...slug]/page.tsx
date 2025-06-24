import { redirect } from 'next/navigation'

// Define known categories for static generation
const KNOWN_CATEGORIES = [
  { handle: 't-shirts-tops', id: 'cat_01' },
  { handle: 'jeans-pants', id: 'cat_02' },
  { handle: 'shirts', id: 'cat_03' },
  { handle: 'sweatshirts', id: 'cat_04' },
  { handle: 'pants', id: 'cat_05' },
  { handle: 'shorts', id: 'cat_06' },
  { handle: 'jackets', id: 'cat_07' },
  { handle: 'accessories', id: 'cat_08' },
  { handle: 'shoes', id: 'cat_09' },
  { handle: 'dresses', id: 'cat_10' },
  { handle: 'skirts', id: 'cat_11' },
  { handle: 'outerwear', id: 'cat_12' },
  { handle: 'activewear', id: 'cat_13' },
]

export async function generateStaticParams() {
  return KNOWN_CATEGORIES.map((cat) => ({
    slug: [cat.handle],
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

  // Find category by handle
  const category = KNOWN_CATEGORIES.find((cat) => cat.handle === handle)

  if (category) {
    // Redirect to products page with category filter
    redirect(`/products?categories=${category.id}`)
  }

  // If category not found, redirect to products page
  redirect('/products')
}
