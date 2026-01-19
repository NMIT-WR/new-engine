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
  const decorationStyle = {
    backgroundColor: "var(--color-success)",
    clipPath: "polygon(0 0, 100% 100%, 100% 0)",
    height: "0.5rem",
    width: "0.5rem",
  }

  return (
    <div className="flex flex-wrap gap-200">
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
              <span
                aria-hidden="true"
                className="absolute right-0 top-0"
                style={decorationStyle}
              />
            </LinkButtonWithTooltip>
          )
        })}
    </div>
  )
}
