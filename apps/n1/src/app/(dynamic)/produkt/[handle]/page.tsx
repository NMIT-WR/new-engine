'use client'

import { Heading } from '@/components/heading'
import { Gallery } from '@/components/organisms/gallery'
import { ProductInfoPanel } from '@/components/product-detail/product-info-panel'
import { ProductTabs } from '@/components/product-detail/product-tabs'
import { useProduct } from '@/hooks/use-product'
import { selectVariant } from '@/utils/select-variant'
import { transformProductDetail } from '@/utils/transform/transform-product'
import { Button } from '@new-engine/ui/atoms/button'
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

  return (
    <div className="container mx-auto p-4">
      {/* PRODUCT DETAIL COMPONENT */}
      <div className="grid gap-8 md:grid-cols-2">
        <header className="col-span-2 space-y-4">
          <Heading as="h1">{title}</Heading>
          <Button
            variant="secondary"
            onClick={() => {
              console.log('raw', rawProduct)
              console.log('detail: ', detail)
            }}
          >
            Check product
          </Button>
        </header>
        <div className="aspect-square max-w-md">
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
      <ProductTabs />
      <div>
        <p>{detail.description}</p>
      </div>
      {/* RELEATED PRODUCTS */}
    </div>
  )
}
