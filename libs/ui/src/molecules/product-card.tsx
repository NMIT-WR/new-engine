import { type HTMLAttributes, type ReactNode, useId } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Badge, type BadgeProps } from '../atoms/badge.tsx'
import { Button } from '../atoms/button.tsx'
import { Image } from '../atoms/image.tsx'
import { Rating, type RatingProps } from '../atoms/rating.tsx'
import { slugify, tv } from '../utils.ts'
import { NumericInput } from './numeric-input.tsx'

//object-cover aspect-product-card-image
const productCard = tv({
  slots: {
    base: [
      'rounded-pc p-pc-padding',
      'border-(length:--border-pc-width) border-pc-border bg-pc',
    ],
    imageSlot: 'object-cover aspect-pc-image h-full rounded-pc-image',
    nameSlot: 'text-pc-name-fg text-pc-name-size font-pc-name leading-pc-name',
    priceSlot: 'text-pc-price-fg text-pc-price-size',
    stockStatusSlot: 'text-pc-stock-fg text-pc-stock-size font-pc-stock',
    badgesSlot: 'flex flex-wrap gap-pc-box',
    ratingSlot: 'flex items-center',
    buttonsSlot: 'flex flex-wrap w-fit',
    cartButton: 'bg-btn-cart hover:bg-btn-cart-hover text-btn-cart-fg w-max',
    detailButton:
      'bg-btn-detail hover:bg-btn-detail-hover text-btn-detail-fg w-max',
    wishlistButton:
      'bg-btn-wishlist hover:bg-btn-wishlist-hover text-btn-wishlist-fg w-max',
  },
  variants: {
    // variant for layout of the card
    layout: {
      column: {
        base: ['grid grid-cols-1 gap-pc-col-layout'],
        imageSlot: 'w-full order-image',
        nameSlot: 'order-name',
        priceSlot: 'order-price',
        stockStatusSlot: 'order-stock',
        badgesSlot: 'order-badges',
        ratingSlot: 'order-ratings',
        buttonsSlot: 'order-buttons',
      },
      row: {
        base: 'grid grid-cols-[auto_1fr] gap-x-pc-row-layout',
        imageSlot: 'row-span-6',
      },
    },
    // variant for layout of the buttons
    buttonLayout: {
      horizontal: {
        buttonsSlot: 'justify-center gap-2',
      },
      vertical: {
        buttonsSlot: 'flex-col gap-2',
      },
    },
  },
  /* Define compound styles for slots */
  compoundSlots: [
    {
      layout: 'row',
      slots: [
        'nameSlot',
        'priceSlot',
        'stockStatusSlot',
        'badgesSlot',
        'ratingSlot',
        'buttonsSlot',
      ],
      class: ['col-start-2'],
    },
  ],
  defaultVariants: {
    layout: 'column',
    buttonLayout: 'horizontal',
  },
})

type ProductCardVariants = VariantProps<typeof productCard>

export interface ProductCardProps
  extends ProductCardVariants,
    HTMLAttributes<HTMLDivElement> {
  imageUrl: string
  name: string
  price: string
  stockStatus: string
  badges?: BadgeProps[]
  rating?: RatingProps
  // Set prepared button options
  hasCartButton?: boolean
  hasDetailButton?: boolean
  hasWishlistButton?: boolean
  cartButtonText?: string
  detailButtonText?: string
  wishlistButtonText?: string
  numericInput?: boolean
  customButtons?: ReactNode
}

export function ProductCard({
  imageUrl,
  name,
  price,
  stockStatus,
  badges = [],
  hasCartButton,
  hasDetailButton,
  hasWishlistButton,
  cartButtonText = 'Add to cart',
  detailButtonText = 'Detail',
  wishlistButtonText = 'Wishlist',
  numericInput,
  rating,
  className,
  layout,
  buttonLayout,
  customButtons,
  ...props
}: ProductCardProps) {
  const productCardId = useId()

  const {
    base,
    imageSlot,
    nameSlot,
    priceSlot,
    badgesSlot,
    ratingSlot,
    buttonsSlot,
    stockStatusSlot,
    cartButton,
    detailButton,
    wishlistButton,
  } = productCard({ layout, buttonLayout })

  return (
    <div className={base({ className, layout })} {...props}>
      {/* Image always rendered first for semantics, position controlled by CSS */}
      <Image src={imageUrl} alt={name} className={imageSlot({ layout })} />

      {/* Elements with grid positioning based on layout */}
      <h3 className={nameSlot({ layout })}>{name}</h3>

      {rating && (
        <div className={ratingSlot({ layout })}>
          <Rating {...rating} />
        </div>
      )}

      {badges.length > 0 && (
        <div className={badgesSlot({ layout })}>
          {badges.map((badge) => (
            <Badge
              key={`${productCardId}-${slugify(badge.children)}-${
                badge.variant
              }`}
              {...badge}
            >
              {badge.children}
            </Badge>
          ))}
        </div>
      )}

      <p className={stockStatusSlot({ layout })}>{stockStatus}</p>

      <p className={priceSlot({ layout })}>{price}</p>

      {(hasCartButton ||
        hasDetailButton ||
        hasWishlistButton ||
        customButtons) && (
        <div className={buttonsSlot({ buttonLayout })}>
          {hasCartButton && (
            <div className="flex gap-pc-box">
              {numericInput && <NumericInput />}
              <Button size="sm" className={cartButton()} icon="token-icon-cart">
                {cartButtonText}
              </Button>
            </div>
          )}
          {hasDetailButton && (
            <Button size="sm" className={detailButton()} icon="token-icon-eye">
              {detailButtonText}
            </Button>
          )}
          {hasWishlistButton && (
            <Button
              size="sm"
              className={wishlistButton()}
              icon="token-icon-heart"
            >
              {wishlistButtonText}
            </Button>
          )}
          {customButtons}
        </div>
      )}
    </div>
  )
}
