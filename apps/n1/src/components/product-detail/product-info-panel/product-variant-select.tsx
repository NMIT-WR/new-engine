import type { ProductDetail, ProductVariantDetail } from '@/types/product'
import { LinkButtonWithTooltip } from '../../molecules/link-button-with-tooltip'
import { TooltipContent } from './tooltip-content'

interface ProductVariantSelectProps {
  detail: ProductDetail
  selectedVariant: ProductVariantDetail | null
  handle: string
}

export const ProductVariantSelect = ({
  detail,
  selectedVariant,
  handle,
}: ProductVariantSelectProps) => {
  return (
    <div className="flex gap-200">
      {detail.variants?.length > 1 &&
        detail.variants.map((variant) => {
          return (
            <LinkButtonWithTooltip
              href={`/produkt/${handle}?variant=${variant.title.toLowerCase()}`}
              key={variant.id}
              selected={variant.id === selectedVariant?.id}
              tooltip={
                <TooltipContent
                  title={detail.title}
                  variant={variant.title}
                  quantity={variant.inventory_quantity ?? 0}
                />
              }
              placement="bottom-start"
              data-selected={variant.id === selectedVariant?.id}
            >
              {variant.title}
              <span className="button-decoration" />
            </LinkButtonWithTooltip>
          )
        })}
    </div>
  )
}
