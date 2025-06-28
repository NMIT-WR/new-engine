import { allCategories } from '@/lib/static-data/categories'
import CategoryPageClient from '../components/category-page-client'

export async function generateStaticParams() {
  return allCategories.map((cat) => ({
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

  return <CategoryPageClient categoryHandle={handle} />
}
