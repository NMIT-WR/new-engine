import type { HttpTypes } from '@medusajs/types'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { Layout, LayoutColumn } from '@/components/Layout'
import { LocalizedLink } from '@/components/LocalizedLink'
import { collectionMetadataCustomFieldsSchema } from '@lib/util/collections'
import ImageGallery from '@modules/products/components/image-gallery'
import ProductActions from '@modules/products/components/product-actions'
import RelatedProducts from '@modules/products/components/related-products'
import ProductInfo from '@modules/products/templates/product-info'
import SkeletonRelatedProducts from '@modules/skeletons/templates/skeleton-related-products'

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  materials: {
    id: string
    name: string
    colors: {
      id: string
      name: string
      hex_code: string
    }[]
  }[]
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate = ({
  product,
  materials,
  region,
  countryCode,
}: ProductTemplateProps) => {
  if (!product || !product.id) {
    return notFound()
  }

  const images = product.images || []
  const hasImages = Boolean(
    product.images &&
      product.images.filter((image) => Boolean(image.url)).length > 0
  )

  const collectionDetails = collectionMetadataCustomFieldsSchema.safeParse(
    product.collection?.metadata ?? {}
  )

  return (
    <div
      className="pt-18 pb-26 md:pt-26 md:pb-36 lg:pt-37"
      data-testid="product-container"
    >
      <ImageGallery className="md:hidden" images={images} />
      <Layout>
        <LayoutColumn className="mb-26 md:mb-52">
          <div className="flex gap-8 max-lg:flex-col xl:gap-27">
            {hasImages && (
              <div className="flex flex-1 flex-col gap-8 lg:w-1/2">
                <ImageGallery className="max-md:hidden" images={images} />
              </div>
            )}
            <div className="sticky top-0 flex-1">
              <ProductInfo product={product} />
              <ProductActions
                product={product}
                materials={materials}
                region={region}
              />
            </div>
            {!hasImages && <div className="flex-1" />}
          </div>
        </LayoutColumn>
      </Layout>
      {collectionDetails.success &&
        ((typeof collectionDetails.data.product_page_heading === 'string' &&
          collectionDetails.data.product_page_heading.length > 0) ||
          typeof collectionDetails.data.product_page_image?.url ===
            'string') && (
          <Layout>
            <LayoutColumn>
              {typeof collectionDetails.data.product_page_heading ===
                'string' &&
                collectionDetails.data.product_page_heading.length > 0 && (
                  <h2 className="mb-8 text-md md:text-2xl">
                    {collectionDetails.data.product_page_heading}
                  </h2>
                )}
              {typeof collectionDetails.data.product_page_image?.url ===
                'string' && (
                <div className="relative mb-8 aspect-[3/2] md:mb-20">
                  <Image
                    src={collectionDetails.data.product_page_image.url}
                    alt="Collection product page image"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </LayoutColumn>
          </Layout>
        )}
      {collectionDetails.success &&
        collectionDetails.data.product_page_wide_image &&
        typeof collectionDetails.data.product_page_wide_image.url ===
          'string' && (
          <div className="relative mb-8 aspect-[3/2] md:mb-20 md:aspect-[7/3]">
            <Image
              src={collectionDetails.data.product_page_wide_image.url}
              alt="Collection product page wide image"
              fill
              className="object-cover"
            />
          </div>
        )}
      {collectionDetails.success &&
        (typeof collectionDetails.data.product_page_cta_image?.url ===
          'string' ||
          (typeof collectionDetails.data.product_page_cta_heading ===
            'string' &&
            collectionDetails.data.product_page_cta_heading.length > 0) ||
          (typeof collectionDetails.data.product_page_cta_link === 'string' &&
            collectionDetails.data.product_page_cta_link.length > 0)) && (
          <Layout>
            {typeof collectionDetails.data.product_page_cta_image?.url ===
              'string' && (
              <LayoutColumn start={1} end={{ base: 10, md: 6 }}>
                <div className="relative aspect-[3/4]">
                  <Image
                    src={collectionDetails.data.product_page_cta_image.url}
                    fill
                    alt="Collection product page CTA image"
                  />
                </div>
              </LayoutColumn>
            )}
            {((typeof collectionDetails.data.product_page_cta_heading ===
              'string' &&
              collectionDetails.data.product_page_cta_heading.length > 0) ||
              (typeof collectionDetails.data.product_page_cta_link ===
                'string' &&
                collectionDetails.data.product_page_cta_link.length > 0)) && (
              <LayoutColumn start={{ base: 1, md: 7 }} end={13}>
                {typeof collectionDetails.data.product_page_cta_heading ===
                  'string' &&
                  collectionDetails.data.product_page_cta_heading.length >
                    0 && (
                    <h3 className="my-8 text-md md:mt-20 md:text-2xl">
                      {collectionDetails.data.product_page_cta_heading}
                    </h3>
                  )}
                {typeof collectionDetails.data.product_page_cta_link ===
                  'string' &&
                  collectionDetails.data.product_page_cta_link.length > 0 &&
                  typeof product.collection?.handle === 'string' && (
                    <p className="text-base md:text-md">
                      <LocalizedLink
                        href={`/collections/${product.collection.handle}`}
                        variant="underline"
                      >
                        {collectionDetails.data.product_page_cta_link}
                      </LocalizedLink>
                    </p>
                  )}
              </LayoutColumn>
            )}
          </Layout>
        )}

      <Suspense fallback={<SkeletonRelatedProducts />}>
        <RelatedProducts product={product} countryCode={countryCode} />
      </Suspense>
    </div>
  )
}

export default ProductTemplate
