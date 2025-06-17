'use client'

import { SkeletonLoader } from '@/components/atoms/skeleton-loader'
import { FeaturedProducts } from '@/components/organisms/featured-products'
import { Gallery } from '@/components/organisms/gallery'
import { ProductInfo } from '@/components/organisms/product-info'
import { ProductTabs } from '@/components/organisms/product-tabs'
import { useProduct, useProducts } from '@/hooks/use-products'
import { useCurrentRegion } from '@/hooks/use-region'
import { formatPrice } from '@/utils/price-utils'
import { useEffect, useState } from 'react'
import { ErrorText } from '@ui/atoms/error-text'
import { Breadcrumb } from '@ui/molecules/breadcrumb'

interface ProductDetailProps {
  handle: string
}

export default function ProductDetail({ handle }: ProductDetailProps) {
  const { product, isLoading, error } = useProduct(handle)
  const { region } = useCurrentRegion()
  const { products: allProducts = [] } = useProducts()

  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || null
  )

  // Update selected variant when product loads or changes
  useEffect(() => {
    if (product?.variants?.[0]) {
      setSelectedVariant(product.variants[0])
    }
  }, [product])

  // Loading state
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
  if (selectedVariant?.prices && region?.currency_code) {
    variantPrice = selectedVariant.prices.find(
      (p) => p.currency_code === region.currency_code
    )
    // If not found, use the first available price
    if (!variantPrice && selectedVariant.prices.length > 0) {
      variantPrice = selectedVariant.prices[0]
    }
  }

  // Prices from Medusa are already in dollars/euros, NOT cents
  const price =
    variantPrice?.calculated_price !== undefined &&
    typeof variantPrice.calculated_price === 'number'
      ? formatPrice(variantPrice.calculated_price, region?.currency_code)
      : variantPrice?.amount !== undefined &&
          typeof variantPrice.amount === 'number'
        ? formatPrice(variantPrice.amount, region?.currency_code)
        : 'Price not available'

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

  // Get related products from API
  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        p.categories?.some((cat) =>
          product.categories?.some((pCat) => pCat.id === cat.id)
        )
    )
    .slice(0, 4)

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
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: product.title, href: `/products/${product.handle}` },
            ]}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-product-detail-content-gap lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="aspect-square md:max-h-[60svh]">
            <Gallery images={galleryImages} aspectRatio="portrait" />
          </div>

          {/* Info Section */}
          <ProductInfo
            product={product}
            selectedVariant={selectedVariant}
            badges={badges}
            price={price}
            onVariantChange={setSelectedVariant}
          />
        </div>

        {/* Tabs Section */}
        <ProductTabs product={product} />

        {/* Related Products */}
        <div className="mt-product-detail-related-margin">
          <FeaturedProducts
            title="You May Also Like"
            subtitle="Check out these similar products"
            products={relatedProducts}
          />
        </div>
      </div>
    </div>
  )
}
