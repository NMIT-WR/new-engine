import { type HTMLAttributes, type ReactNode, useId } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Badge, type BadgeProps } from '@ui/atoms/badge'
import { Button } from '@ui/atoms/button'
import Image from 'next/image'
import { Rating, type RatingProps } from '@ui/atoms/rating'
import { slugify, tv } from '@ui/utils'
import { NumericInput } from '@ui/molecules/numeric-input'

//object-cover aspect-product-card-image
const productCard = tv({
  slots: {
    base: [
      'rounded-pc p-pc-padding',
      'border-(length:--border-pc-width) border-pc-border bg-pc max-w-pc-max shadow-sm',
    ],
    imageSlot: 'object-cover aspect-pc-image h-full rounded-pc-image',
    nameSlot:
      'text-pc-name-fg text-pc-name-size  leading-pc-name line-clamp-pc-name',
    priceSlot: 'text-pc-price-fg text-pc-price-size',
    stockStatusSlot: 'text-pc-stock-fg text-pc-stock-size ',
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
  stockStatus?: string
  badges?: BadgeProps[]
  rating?: RatingProps
  // Set prepared button options
  hasCartButton?: boolean
  hasDetailButton?: boolean
  hasWishlistButton?: boolean
  onCartClick?: () => void
  onDetailClick?: () => void
  onWishlistClick?: () => void
  cartButtonText?: string
  detailButtonText?: string
  wishlistButtonText?: string
  numericInput?: boolean
  customButtons?: ReactNode
}

export function DemoProductCard({
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
  onCartClick,
  onDetailClick,
  onWishlistClick,
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
      {/* Optimized Next.js Image */}
      <div className={`relative ${imageSlot({ layout })}`}>
        <Image 
          src={imageUrl || '/images/placeholder-product.png'} 
          alt={name} 
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 20vw, 15vw"
          className="object-cover"
          loading="lazy"
          quality={50}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      </div>

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

      {stockStatus && <p className={stockStatusSlot({ layout })}>{stockStatus}</p>}

      <p className={priceSlot({ layout })}>{price}</p>

      {(hasCartButton ||
        hasDetailButton ||
        hasWishlistButton ||
        customButtons) && (
        <div className={buttonsSlot({ buttonLayout })}>
          {hasCartButton && (
            <div className="flex gap-pc-box">
              {numericInput && <NumericInput />}
              <Button
                size="sm"
                className={cartButton()}
                onClick={onCartClick}
                icon="token-icon-cart"
              >
                {cartButtonText}
              </Button>
            </div>
          )}
          {hasDetailButton && (
            <Button
              size="sm"
              className={detailButton()}
              onClick={onDetailClick}
              icon="token-icon-eye"
            >
              {detailButtonText}
            </Button>
          )}
          {hasWishlistButton && (
            <Button
              size="sm"
              className={wishlistButton()}
              onClick={onWishlistClick}
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
