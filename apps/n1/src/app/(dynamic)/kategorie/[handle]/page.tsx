'use client'
import { useLeadhub } from '@libs/analytics/leadhub'
import { Heading } from '@/components/heading'
import { N1Aside } from '@/components/n1-aside'
import { Breadcrumb } from '@techsio/ui-kit/molecules/breadcrumb'
import './layout.css'
import { Banner } from '@/components/atoms/banner'
import { ProductGrid } from '@/components/molecules/product-grid'
import {
  allCategories,
  categoryMap,
  categoryTree,
} from '@/data/static/categories'
import { usePrefetchCategoryChildren } from '@/hooks/use-prefetch-category-children'
import { usePrefetchPages } from '@/hooks/use-prefetch-pages'
import { usePrefetchRootCategories } from '@/hooks/use-prefetch-root-categories'
import { useProducts } from '@/hooks/use-products'
import { useRegion } from '@/hooks/use-region'
import {
  ALL_CATEGORIES_MAP,
  PRODUCT_LIMIT,
  VALID_CATEGORY_ROUTES,
} from '@/lib/constants'
import { componentDebugLogger } from '@/lib/loggers'
import { transformProduct } from '@/utils/transform/transform-product'
import type { IconType } from '@techsio/ui-kit/atoms/icon'
import { LinkButton } from '@techsio/ui-kit/atoms/link-button'
import NextLink from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const handle = params.handle as string
  const { regionId, countryCode } = useRegion()
  const { trackViewCategory } = useLeadhub()

  const currentCategory = allCategories.find((cat) => cat.handle === handle)
  const currentCategoryChildren = allCategories.filter(
    (cat) => cat.parent_category_id === currentCategory?.id
  )
  const rootCategory =
    allCategories.find((cat) => cat.id === currentCategory?.root_category_id) ??
    currentCategory

  // Build category path for Leadhub tracking (e.g., "Pánské > Oblečení > Trika")
  const buildCategoryPath = (): string | null => {
    if (!currentCategory) return null

    const path: string[] = []
    let current: typeof currentCategory | undefined = currentCategory

    while (current) {
      path.unshift(current.name)
      const parent = allCategories.find(
        (c) => c.id === current!.parent_category_id
      )
      if (!parent) break
      current = parent
    }

    return path.join(' > ')
  }

  // Leadhub ViewCategory tracking
  useEffect(() => {
    const categoryPath = buildCategoryPath()
    if (categoryPath) {
      trackViewCategory({ category: categoryPath })
    }
  }, [currentCategory?.id, trackViewCategory])

  // Get current page from URL or default to 1
  const currentPage = Number(searchParams.get('page')) || 1

  const {
    products: rawProducts,
    isLoading,
    isSuccess,
    isFetching,
    totalCount,
    currentPage: responsePage,
    totalPages,
    hasNextPage,
    hasPrevPage,
  } = useProducts({
    category_id: ALL_CATEGORIES_MAP[handle],
    page: currentPage,
    limit: PRODUCT_LIMIT,
  })

  // DEBUG: Log React Query states
  componentDebugLogger.categoryPage({
    isLoading,
    isFetching,
    isSuccess,
    isReady: isSuccess && !isFetching,
  })

  // Wait for fetch/refetch completion before prefetching
  const isCurrentPageReady = isSuccess && !isFetching

  // Prefetch other root categories when current page is loaded
  usePrefetchRootCategories({
    enabled: isCurrentPageReady,
    currentHandle: handle,
    delay: 200,
  })

  // Prefetch surrounding pages for instant navigation
  usePrefetchPages({
    enabled: isCurrentPageReady,
    currentPage: responsePage,
    hasNextPage,
    hasPrevPage,
    totalPages,
    pageSize: PRODUCT_LIMIT,
    category_id: ALL_CATEGORIES_MAP[handle],
    regionId,
    countryCode,
  })

  // Prefetch category children progressively
  usePrefetchCategoryChildren({
    enabled: isCurrentPageReady,
    categoryHandle: handle,
  })

  const products = rawProducts.map(transformProduct)

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('page', page.toString())
    router.push(`/kategorie/${handle}?${newSearchParams.toString()}`, {
      scroll: true,
    })
  }

  if (!VALID_CATEGORY_ROUTES.includes(handle)) {
    return <div>Category not found</div>
  }

  const rootCategoryTree = categoryTree.find(
    (cat) => cat.id === rootCategory?.id
  )

  const breadcrumbItems: { label: string; href: string; icon?: IconType }[] = [
    { label: 'Home', href: '/', icon: 'icon-[mdi--home]' },
    { label: rootCategory?.handle || handle, href: `/kategorie/${handle}` },
  ]

  return (
    <div className="product-layout p-400">
      <header className="col-span-2 row-span-1">
        <Breadcrumb linkAs={NextLink} items={breadcrumbItems} size="lg" />
      </header>
      <N1Aside
        categories={rootCategoryTree?.children || []}
        categoryMap={categoryMap}
        label={rootCategory?.handle}
        currentCategory={currentCategory}
      />
      <main className="px-300">
        <header className="space-y-300">
          <Heading as="h1">{currentCategory?.handle}</Heading>
          <div className="grid grid-cols-4 gap-100">
            {currentCategoryChildren?.map((child) => (
              <LinkButton
                key={child.id}
                href={`/kategorie/${child.handle}`}
                className="border border-overlay bg-surface py-200 text-fg-primary hover:bg-base"
              >
                {child.name}
              </LinkButton>
            ))}
          </div>
        </header>
        <Banner variant="warning" className="my-300">
          <div className="flex items-center gap-100">
            <span>Zobrazeno</span>
            <span className="font-bold">{totalCount}</span>
            <span>produktů</span>
          </div>
        </Banner>
        <section>
          <ProductGrid
            products={products}
            totalCount={totalCount}
            currentPage={responsePage}
            pageSize={PRODUCT_LIMIT}
            onPageChange={handlePageChange}
            isLoading={isLoading}
            skeletonCount={24}
          />
        </section>
      </main>
    </div>
  )
}
