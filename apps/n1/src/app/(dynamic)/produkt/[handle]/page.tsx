'use client'

import { HeurekaProduct } from '@libs/analytics/heureka'
import { useMetaPixel } from '@libs/analytics/meta'
import { useEffect } from 'react'
import { Heading } from '@/components/heading'
import { Gallery } from '@/components/organisms/gallery'
import { ProductInfoPanel } from '@/components/product-detail/product-info-panel'
import { ProductSizes } from '@/components/product-detail/product-sizes'
import { ProductTable } from '@/components/product-detail/product-table'
import { ProductTabs } from '@/components/product-detail/product-tabs'
import { RelatedProducts } from '@/components/product-detail/related-products'
import { useProduct } from '@/hooks/use-product'
import { CATEGORY_MAP_BY_ID } from '@/lib/constants'
import {
  buildBreadcrumbs,
  buildProductBreadcrumbs,
} from '@/utils/helpers/build-breadcrumb'
import { selectVariant } from '@/utils/select-variant'
import { transformProductDetail } from '@/utils/transform/transform-product'
import { Link } from '@techsio/ui-kit/atoms/link'
import { Breadcrumb } from '@techsio/ui-kit/molecules/breadcrumb'
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

  // Meta Pixel - ViewContent tracking
  const { trackViewContent } = useMetaPixel()

  useEffect(() => {
    if (detail && selectedVariant) {
      trackViewContent({
        content_ids: [selectedVariant.id],
        content_type: 'product',
        content_name: detail.title,
        content_category: rawProduct?.categories?.[0]?.name,
        currency: selectedVariant.calculated_price?.currency_code ?? 'CZK',
        value: (selectedVariant.calculated_price?.calculated_amount_with_tax ?? 0),
      })
    }
  }, [detail?.id, selectedVariant?.id])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-fg-5">Načítání produktu...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-danger-light">Chyba při načítání produktu</p>
      </div>
    )
  }

  if (!rawProduct || !detail) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-fg-5">Produkt nebyl nalezen</p>
      </div>
    )
  }

  const breadcrumbPath = buildProductBreadcrumbs(
    rawProduct.categories?.[0].id,
    CATEGORY_MAP_BY_ID,
    rawProduct.title,
    rawProduct.handle
  )

  const breadcrumbPathMobile = buildBreadcrumbs(
    rawProduct.categories?.[0].id,
    CATEGORY_MAP_BY_ID
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
    <div className="container mx-auto p-400">
      {/* Heureka Product Tracking */}
      <HeurekaProduct country="cz" />

      {/* PRODUCT DETAIL COMPONENT */}
      <div className="grid grid-cols-1 gap-700 md:grid-cols-[auto_1fr]">
        <header className="col-span-1 space-y-400 md:col-span-2">
          <Breadcrumb
            items={breadcrumbPath}
            linkAs={Link}
            size="md"
            className="mb-400 hidden md:inline-flex"
          />
          <Breadcrumb
            items={breadcrumbPathMobile}
            linkAs={Link}
            size="md"
            className="mb-400 md:hidden"
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
