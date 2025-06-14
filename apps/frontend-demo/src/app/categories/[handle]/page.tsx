import { categoriesData, getCategoryByHandle } from '@/data/categories-content'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CategoryPageClient from './category-page-client'

export async function generateStaticParams() {
  return categoriesData.map((category) => ({
    handle: category.handle,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const category = getCategoryByHandle(resolvedParams.handle)

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: category.seoTitle || `${category.name} | Demo Store`,
    description: category.seoDescription || category.description,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const resolvedParams = await params
  const category = getCategoryByHandle(resolvedParams.handle)

  if (!category) {
    notFound()
  }

  return <CategoryPageClient category={category} />
}
