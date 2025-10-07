'use client'

import { Heading } from '@/components/heading'
import { Gallery } from '@/components/organisms/gallery'
import { ProductVariantSelect } from '@/components/product-detail/product-variant-select'
import { StoreStatus } from '@/components/product-detail/store-status'
import { useProduct } from '@/hooks/use-product'
import { selectVariant } from '@/utils/select-variant'
import { transformProductDetail } from '@/utils/transform/transform-product'
import { Button } from '@new-engine/ui/atoms/button'
import { NumericInput } from '@new-engine/ui/atoms/numeric-input'
import NextLink from 'next/link'
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

  const manufacturer = title?.slice(0, title.indexOf('-')).trim()

  const withoutTax =
    selectedVariant?.calculated_price?.calculated_amount?.toFixed(0)

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
        <div>
          <header className="space-y-4">
            <Heading as="h1">{title}</Heading>
            <Button
              variant="secondary"
              onClick={() => {
                console.log('raw', rawProduct)
                console.log('param: ', variantParam)
              }}
            >
              Check product
            </Button>
          </header>
          <div className="aspect-square bg-gray-100">
            {detail.images && (
              <Gallery
                images={detail.images}
                carouselSize={150}
                size="sm"
                aspectRatio="square"
                orientation="horizontal"
              />
            )}
          </div>
        </div>
        <div>
          <div className="text-secondary">
            <div className="flex justify-between">
              <span>Výrobce</span>
              <span>{selectedVariant?.metadata?.user_code}</span>
            </div>
            <div className="flex justify-between">
              <span>Kód produktu</span>
              <span>{selectedVariant?.metadata?.user_code}</span>
            </div>
          </div>
          <div>
            <span className="font-bold">Zvolte variantu:</span>
            {detail.variants && (
              <ProductVariantSelect
                detail={detail}
                selectedVariant={selectedVariant}
                handle={handle}
              />
            )}

            <StoreStatus quantity={quantity} />
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-100">
              <span className="font-bold">Zvolená varianta:</span>
              {selectedVariant?.title}
            </div>
            <NextLink href="/doprava" className="underline">
              Možnosti dopravy
            </NextLink>
          </div>

          {detail.price && (
            <div className="flex flex-col">
              <span className="font-semibold text-2xl">{detail.price}</span>
              <span className="text-fg-secondary text-sm">
                {withoutTax} Kč bez DPH
              </span>
            </div>
          )}
          {
            /*button and numeric input */
            <div className="flex gap-200">
              {selectedVariant ? (
                <>
                  <NumericInput />
                  <Button variant="secondary">Přidat do košíku</Button>
                </>
              ) : (
                <Button disabled>vyberte variantu</Button>
              )}
            </div>
          }
          {/* DORUČENÍ */}
          {/* ACTIONS */}
          {detail.badges && detail.badges.length > 0 && (
            <div className="flex gap-2">
              {detail.badges.map((badge) => (
                <span
                  key={badge.text}
                  className="rounded bg-gray-200 px-3 py-1 text-sm"
                >
                  {badge.text}
                </span>
              ))}
            </div>
          )}
          {detail.stockStatus && (
            <p className="text-gray-600 text-sm">{detail.stockStatus}</p>
          )}
        </div>
      </div>
      {/* PRODUCT TABS */}
      <div>
        <p>{detail.description}</p>
        <span>{manufacturer}</span>
      </div>
      {/* RELEATED PRODUCTS */}
    </div>
  )
}
