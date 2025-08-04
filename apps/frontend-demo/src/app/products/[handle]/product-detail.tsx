'use client'

import { SkeletonLoader } from '@/components/atoms/skeleton-loader'
import { Gallery } from '@/components/organisms/gallery'
import { ProductGrid } from '@/components/organisms/product-grid'
import { ProductInfo } from '@/components/organisms/product-info'
import { ProductTabs } from '@/components/organisms/product-tabs'
import { useProduct, useProducts } from '@/hooks/use-products'
import { useRegions } from '@/hooks/use-region'
import { truncateProductTitle } from '@/lib/order-utils'
import { formatPrice } from '@/utils/price-utils'
import { ErrorText } from '@ui/atoms/error-text'
import { Breadcrumb } from '@ui/molecules/breadcrumb'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface ProductDetailProps {
  handle: string
}

export default function ProductDetail({ handle }: ProductDetailProps) {
  const { selectedRegion } = useRegions()
  const { product, isLoading, error } = useProduct(handle, selectedRegion?.id)
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || null
  )
  const titleQuery = product?.title.split(' ').slice(0, 3).join(' ') || ''
  // Update selected variant when product loads or changes
  useEffect(() => {
    if (product?.variants?.[0]) {
      setSelectedVariant(product.variants[0])
    }
  }, [product])

  const { products: relatedProducts, isLoading: isLoadingRelated } =
    useProducts({
      q: titleQuery,
      region_id: selectedRegion?.id,
      limit: 5,
      sort: 'newest',
      enabled: !!titleQuery && !!selectedRegion?.id,
    })

  // Filter out the current product from related products
  const filteredRelatedProducts = relatedProducts
    ?.filter((p) => p.handle !== handle)
    .slice(0, 4)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-product-detail-bg">
        <div className="mx-auto max-w-product-detail-max-w px-product-detail-container-x py-product-detail-container-y">
          <div>
            <SkeletonLoader variant="text" size="md" className="mb-8 w-48" />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <SkeletonLoader variant="box" className="aspect-square w-full" />
              <div className="space-y-4">
                <SkeletonLoader variant="text" size="xl" className="w-3/4" />
                <SkeletonLoader variant="text" size="lg" className="w-1/4" />
                <SkeletonLoader variant="box" className="h-24 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-product-detail-bg">
        <div className="mx-auto max-w-product-detail-max-w px-product-detail-container-x py-product-detail-container-y text-center">
          <h1 className="mb-4 font-semibold text-2xl">Product not found</h1>
          <ErrorText showIcon>
            {error || 'The product you are looking for does not exist.'}
          </ErrorText>
        </div>
      </div>
    )
  }

  // Get price for selected variant and region
  // Find the price that matches the current currency
  let variantPrice = null
  if (selectedVariant?.calculated_price && selectedRegion?.currency_code) {
    variantPrice = selectedVariant.calculated_price
  }

  // Prices from Medusa are already in dollars/euros, NOT cents
  const price =
    variantPrice?.calculated_amount &&
    formatPrice(variantPrice.calculated_amount, selectedRegion?.currency_code)

  const priceWithTax =
    variantPrice?.calculated_amount_with_tax &&
    formatPrice(
      variantPrice.calculated_amount_with_tax,
      selectedRegion?.currency_code
    )
  // Get badges for the product
  const badges = []
  if (product.metadata?.isNew) {
    badges.push({ children: 'New', variant: 'info' as const })
  }
  if (product.metadata?.discount) {
    badges.push({
      children: `${product.metadata.discount}% OFF`,
      variant: 'warning' as const,
    })
  }

  const galleryImages =
    product.images?.map((img, idx) => ({
      id: `image-${idx}`,
      src: img.url,
      alt: img.alt || product.title,
    })) || []

  return (
    <div className="min-h-screen bg-product-detail-bg">
      <div className="mx-auto max-w-product-detail-max-w px-product-detail-container-x py-product-detail-container-y lg:px-product-detail-container-x-lg lg:py-product-detail-container-y-lg">
        {/* Breadcrumb */}
        <div className="mb-product-detail-breadcrumb-margin">
          <Breadcrumb
            items={[
              { label: 'Domů', href: '/' },
              { label: 'Produkty', href: '/products' },
              {
                label: truncateProductTitle(product.title),
                href: `/products/${product.handle}`,
              },
            ]}
            linkComponent={Link}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-product-detail-content-gap lg:grid-cols-[auto_1fr]">
          {/* Image Gallery */}
          <div className="aspect-square w-full max-w-container-sm">
            <Gallery
              images={galleryImages}
              aspectRatio="square"
              orientation="horizontal"
              thumbnailSize={50}
              carouselSize={400}
            />
          </div>

          {/* Info Section */}
          <ProductInfo
            product={product}
            selectedVariant={selectedVariant}
            badges={badges}
            price={price || 'Cena není k dispozici'}
            priceWithTax={priceWithTax}
            onVariantChange={setSelectedVariant}
          />
        </div>

        {/* Tabs Section */}
        <ProductTabs product={product} />

        {/* Related Products */}
        {filteredRelatedProducts.length > 0 && (
          <div className="mt-product-detail-related-margin">
            <div className="mb-4 flex flex-col">
              <h2 className="font-bold text-featured-title text-featured-title-size">
                Mohlo by se vám líbit
              </h2>
            </div>
            <ProductGrid products={filteredRelatedProducts} />
          </div>
        )}
      </div>
    </div>
  )
}
