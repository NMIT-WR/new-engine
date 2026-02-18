"use client"

import { ErrorText } from "@techsio/ui-kit/atoms/error-text"
import { Breadcrumb } from "@techsio/ui-kit/molecules/breadcrumb"
import Link from "next/link"
import { useEffect, useState } from "react"
import { SkeletonLoader } from "@/components/atoms/skeleton-loader"
import { Gallery } from "@/components/organisms/gallery"
import { ProductGrid } from "@/components/organisms/product-grid"
import { ProductInfo } from "@/components/organisms/product-info"
import { ProductTabs } from "@/components/organisms/product-tabs"
import { productHooks, useProducts } from "@/hooks/product-hooks"
import { truncateProductTitle } from "@/lib/order-utils"
import { useRegionSelection } from "@/providers/region-provider"
import { formatPrice } from "@/lib/format-price"

type ProductDetailProps = {
  handle: string
}

export default function ProductDetail({ handle }: ProductDetailProps) {
  const { selectedRegion } = useRegionSelection()
  const { product, isLoading, error } = productHooks.useProduct({ handle })
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || null
  )
  const titleQuery = product?.title.split(" ").slice(0, 2).join(" ") || ""
  // Update selected variant when product loads or changes
  useEffect(() => {
    if (product?.variants?.[0]) {
      setSelectedVariant(product.variants[0])
    }
  }, [product])

  // region_id is auto-injected from RegionProvider context
  const { products: relatedProducts } = useProducts({
    q: titleQuery,
    limit: 5,
    sort: "newest",
    enabled: !!titleQuery,
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
            <SkeletonLoader className="mb-8 w-48" size="md" variant="text" />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <SkeletonLoader className="aspect-square w-full" variant="box" />
              <div className="space-y-4">
                <SkeletonLoader className="w-3/4" size="xl" variant="text" />
                <SkeletonLoader className="w-1/4" size="lg" variant="text" />
                <SkeletonLoader className="h-24 w-full" variant="box" />
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
            {error || "The product you are looking for does not exist."}
          </ErrorText>
        </div>
      </div>
    )
  }

  let variantPrice = null
  if (selectedVariant?.calculated_price && selectedRegion?.currency_code) {
    variantPrice = selectedVariant.calculated_price
  }

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
    badges.push({ children: "New", variant: "info" as const })
  }
  if (product.metadata?.discount) {
    badges.push({
      children: `${product.metadata.discount}% OFF`,
      variant: "warning" as const,
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
        <div className="mb-product-detail-breadcrumb-margin">
          <Breadcrumb
            items={[
              { label: "Domů", href: "/" },
              { label: "Produkty", href: "/products" },
              {
                label: truncateProductTitle(product.title),
                href: `/products/${product.handle}`,
              },
            ]}
            linkAs={Link}
          />
        </div>
        <div className="grid grid-cols-1 gap-product-detail-content-gap lg:grid-cols-[auto_1fr]">
          <div className="aspect-square w-full max-w-container-sm">
            <Gallery
              aspectRatio="square"
              carouselSize={400}
              images={galleryImages}
              orientation="horizontal"
              thumbnailSize={50}
            />
          </div>
          <ProductInfo
            badges={badges}
            onVariantChange={setSelectedVariant}
            price={price || "Cena není k dispozici"}
            priceWithTax={priceWithTax}
            product={product}
            selectedVariant={selectedVariant}
          />
        </div>
        <ProductTabs product={product} />
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
