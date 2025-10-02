'use client'
import { Heading } from '@/components/heading'
import { N1Aside } from '@/components/n1-aside'
import { Breadcrumb } from '@new-engine/ui/molecules/breadcrumb'
import './layout.css'
import { Banner } from '@/components/atoms/banner'
import { ProductGrid } from '@/components/molecules/product-grid'
import { allCategories, categoryTree } from '@/data/static/categories'
import { usePrefetchPages } from '@/hooks/use-prefetch-pages'
import { useProducts } from '@/hooks/use-products'
import { useRegion } from '@/hooks/use-region'
import {
  CATEGORY_MAP_2,
  CATEGORY_MAP_EXTENDED,
  PRODUCT_LIMIT,
  VALID_CATEGORY_ROUTES,
} from '@/lib/constants'
import { transformProduct } from '@/utils/transform/transform-product'
import type { IconType } from '@new-engine/ui/atoms/icon'
import { LinkButton } from '@new-engine/ui/atoms/link-button'
import NextLink from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const category = params.category as string
  const categoryIds = CATEGORY_MAP_EXTENDED[category]
  const { regionId, countryCode } = useRegion()

  const currentCategory = allCategories.find((cat) => cat.handle === category)
  const rootCategory =
    allCategories.find((cat) => cat.id === currentCategory?.root_category_id) ??
    currentCategory
  /*
  console.log('=== CATEGORY PAGE DEBUG ===')
  console.log('category:', category)
  console.log('categoryIds:', categoryIds)
  console.log('info:', rootCategory)
  console.log('CATEGORY_MAP_EXTENDED[ski]:', CATEGORY_MAP_EXTENDED)
  console.log('CATEGORY_MAP_2[ski]:', CATEGORY_MAP_2)*/

  // Get current page from URL or default to 1
  const currentPage = Number(searchParams.get('page')) || 1

  const {
    products: rawProducts,
    isLoading,
    totalCount,
    currentPage: responsePage,
    totalPages,
    hasNextPage,
    hasPrevPage,
  } = useProducts({
    category_id: CATEGORY_MAP_2[category],
    page: currentPage,
    limit: PRODUCT_LIMIT,
  })

  // Prefetch surrounding pages for instant navigation
  usePrefetchPages({
    currentPage: responsePage,
    hasNextPage,
    hasPrevPage,
    totalPages,
    pageSize: PRODUCT_LIMIT,
    category_id: CATEGORY_MAP_2[category],
    regionId,
    countryCode,
  })

  const products = rawProducts.map(transformProduct)

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('page', page.toString())
    router.push(`/${category}?${newSearchParams.toString()}`, { scroll: true })
  }

  if (!VALID_CATEGORY_ROUTES.includes(category)) {
    return <div>Category not found</div>
  }

  const rootCategoryTree = categoryTree.find(
    (cat) => cat.id === rootCategory?.id
  )

  const breadcrumbItems: { label: string; href: string; icon?: IconType }[] = [
    { label: 'Home', href: '/', icon: 'icon-[mdi--home]' },
    { label: rootCategory?.handle || category, href: `/${category}` },
  ]

  return (
    <div className="product-layout p-400">
      <header className="col-span-2 row-span-1">
        <Breadcrumb linkAs={NextLink} items={breadcrumbItems} size="lg" />
      </header>
      <N1Aside
        categories={rootCategoryTree?.children || []}
        label={rootCategory?.handle}
      />
      <main className="px-300">
        <header className="space-y-300">
          <Heading as="h1" onClick={() => console.log(CATEGORY_MAP_EXTENDED)}>
            {currentCategory?.handle}
          </Heading>
          <div className="grid grid-cols-4 gap-100">
            {rootCategoryTree?.children?.map((child) => (
              <LinkButton
                key={child.id}
                href={child.name}
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
          {isLoading ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">Načítání produktů...</p>
            </div>
          ) : (
            <ProductGrid
              products={products}
              totalCount={totalCount}
              currentPage={responsePage}
              pageSize={PRODUCT_LIMIT}
              onPageChange={handlePageChange}
            />
          )}
        </section>
      </main>
    </div>
  )
}
