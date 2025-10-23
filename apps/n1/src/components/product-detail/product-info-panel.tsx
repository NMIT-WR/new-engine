import type { ProductDetail, ProductVariantDetail } from '@/types/product'
import { Button } from '@new-engine/ui/atoms/button'
import NextLink from 'next/link'
import { ProductPrice } from '../product-price'
import { AddToCartSection } from './product-info-panel/add-to-cart-section'
import { DeliveryDate } from './product-info-panel/delivery-date'
import { ProductActions } from './product-info-panel/product-action'
import { ProductMetadata } from './product-info-panel/product-metadata'
import { ProductVariantSelect } from './product-info-panel/product-variant-select'
import { SectionBasicInfo } from './product-info-panel/section-basic-info'
import { StoreStatus } from './product-info-panel/store-status'

interface ProductInfoPanelProps {
  detail: ProductDetail
  selectedVariant: ProductVariantDetail | null
  handle: string
  quantity: number
}

export const ProductInfoPanel = ({
  detail,
  selectedVariant,
  handle,
  quantity,
}: ProductInfoPanelProps) => {
  return (
    <div className="flex flex-col gap-300">
      <SectionBasicInfo>
        <ProductMetadata
          rows={[
            { label: 'Výrobce', value: detail.producer?.title },
            {
              label: 'Kód produktu',
              value: selectedVariant?.metadata?.user_code,
            },
          ]}
        />
        <div className="flex flex-col gap-500 pb-400">
          <div className="flex flex-col gap-200">
            <span className="font-bold">Zvolte variantu:</span>
            {detail.variants && (
              <ProductVariantSelect
                detail={detail}
                selectedVariant={selectedVariant}
                handle={handle}
              />
            )}
          </div>
          <StoreStatus quantity={quantity} />
        </div>
      </SectionBasicInfo>

      <SectionBasicInfo>
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
          <ProductPrice
            size="lg"
            priceWithTax={detail.price}
            priceWithoutTax={detail.withoutTax}
          />
        )}

        <div className="flex gap-200">
          {selectedVariant ? (
            <AddToCartSection
              selectedVariant={selectedVariant}
              detail={detail}
            />
          ) : (
            <Button disabled>vyberte variantu</Button>
          )}
        </div>
      </SectionBasicInfo>

      <SectionBasicInfo divider={false}>
        <DeliveryDate />
        <ProductActions />
      </SectionBasicInfo>

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
    </div>
  )
}
