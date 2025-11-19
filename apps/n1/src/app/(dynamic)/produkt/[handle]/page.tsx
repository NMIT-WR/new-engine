'use client'

import { Heading } from '@/components/heading'
import { Gallery } from '@/components/organisms/gallery'
import { ProductInfoPanel } from '@/components/product-detail/product-info-panel'
import { ProductSizes } from '@/components/product-detail/product-sizes'
import { ProductTable } from '@/components/product-detail/product-table'
import { ProductTabs } from '@/components/product-detail/product-tabs'
import { RelatedProducts } from '@/components/product-detail/related-products'
import { useProduct } from '@/hooks/use-product'
import { CATEGORY_MAP_BY_ID } from '@/lib/constants'
import { buildProductBreadcrumbs } from '@/utils/helpers/build-breadcrumb'
import { selectVariant } from '@/utils/select-variant'
import { transformProductDetail } from '@/utils/transform/transform-product'
import { Link } from '@new-engine/ui/atoms/link'
import { Breadcrumb } from '@new-engine/ui/molecules/breadcrumb'
import { useParams, useSearchParams } from 'next/navigation'

export default function ProductPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const handle = params.handle as string
  const variantParam = searchParams.get('variant')

  const { data: rawProduct, isLoading, error } = useProduct({ handle })

  const detail = rawProduct ? transformProductDetail(rawProduct) : null
  const selectedVariant = selectVariant(detail?.variants, variantParam)

  const title = selectedVariant
    ? `${detail?.title} - ${selectedVariant.title}`
    : detail?.title
  const quantity = selectedVariant?.inventory_quantity ?? 0

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Načítání produktu...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Chyba při načítání produktu</p>
      </div>
    )
  }

  if (!rawProduct || !detail) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Produkt nebyl nalezen</p>
      </div>
    )
  }

  const breadcrumbPath = buildProductBreadcrumbs(
    rawProduct.categories?.[0].id,
    CATEGORY_MAP_BY_ID,
    rawProduct.title,
    rawProduct.handle
  )

  const productTableRows = [
    {
      key: 'kód produktu',
      value: detail.type_id,
    },
    {
      key: 'hmotnost',
      value: detail.weight,
    },
    {
      key: 'materiál',
      value: detail.material,
    },
    {
      key: 'distibutor',
      value: detail.producer?.title,
    },
    {
      key: 'velikost',
      value: selectedVariant?.title,
    },
  ]

  const tabsData = [
    {
      value: 'tab1',
      label: 'PRODUKTOVÉ PARAMETRY',
      headline: 'PRODUKTOVÉ PARAMETRY',
      content: <ProductTable rows={productTableRows} />,
    },
    {
      value: 'tab2',
      label: 'TABULKA VELIKOSTÍ',
      headline: 'TABULKA VELIKOSTÍ',
      content: <ProductSizes attributes={detail.producer?.attributes} />,
    },
  ]

  return (
    <div className="container mx-auto p-4">
      {/* PRODUCT DETAIL COMPONENT */}
      <div className="grid gap-8 md:grid-cols-2">
        <header className="col-span-2 space-y-4">
          <Breadcrumb
            items={breadcrumbPath}
            linkAs={Link}
            size="md"
            className="mb-4"
          />
          <Heading as="h1">{title}</Heading>
        </header>
        <div className="mx-auto aspect-square max-w-md">
          {detail.images && (
            <Gallery
              images={detail.images}
              carouselSize={150}
              size="md"
              objectFit="cover"
              aspectRatio="square"
              orientation="horizontal"
            />
          )}
        </div>
        <ProductInfoPanel
          detail={detail}
          selectedVariant={selectedVariant}
          handle={handle}
          quantity={quantity}
        />
      </div>
      {/* PRODUCT TABS */}
      <ProductTabs description={detail.description} tabs={tabsData} />
      {/* RELEATED PRODUCTS */}
      <RelatedProducts
        categories={rawProduct.categories?.map((category) => category.id)}
      />
    </div>
  )
}
