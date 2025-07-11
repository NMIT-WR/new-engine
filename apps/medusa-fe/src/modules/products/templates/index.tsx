import type React from 'react'
import { Suspense } from 'react'

import type { HttpTypes } from '@medusajs/types'
import ImageGallery from '@modules/products/components/image-gallery'
import ProductActions from '@modules/products/components/product-actions'
import ProductOnboardingCta from '@modules/products/components/product-onboarding-cta'
import ProductTabs from '@modules/products/components/product-tabs'
import RelatedProducts from '@modules/products/components/related-products'
import ProductInfo from '@modules/products/templates/product-info'
import SkeletonRelatedProducts from '@modules/skeletons/templates/skeleton-related-products'
import { notFound } from 'next/navigation'
import ProductActionsWrapper from './product-actions-wrapper'

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div
        className="relative flex flex-col py-6 content-container small:flex-row small:items-start"
        data-testid="product-container"
      >
        <div className="flex w-full flex-col gap-y-6 py-8 small:sticky small:top-48 small:max-w-[300px] small:py-0">
          <ProductInfo product={product} />
          <ProductTabs product={product} />
        </div>
        <div className="relative block w-full">
          <ImageGallery images={product?.images || []} />
        </div>
        <div className="flex w-full flex-col gap-y-12 py-8 small:sticky small:top-48 small:max-w-[300px] small:py-0">
          <ProductOnboardingCta />
          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>
        </div>
      </div>
      <div
        className="my-16 content-container small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
