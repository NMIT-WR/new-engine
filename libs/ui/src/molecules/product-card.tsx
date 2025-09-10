import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  useId,
} from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Badge, type BadgeProps } from '../atoms/badge'
import { Button } from '../atoms/button'
import { Image } from '../atoms/image'
import { NumericInput } from '../atoms/numeric-input'
import { Rating, type RatingProps } from '../atoms/rating'
import { slugify, tv } from '../utils'

//object-cover aspect-product-card-image
const productCard = tv({
  slots: {
    base: [
      'rounded-product-card p-product-card-padding',
      'border-(length:--border-product-card-width) border-product-card-border bg-product-card-bg max-w-product-card-max shadow-sm',
    ],
    imageSlot:
      'object-cover aspect-product-card-image h-full rounded-product-card-image',
    nameSlot:
      'text-product-card-name-fg text-product-card-name-size line-clamp-product-card-name',
    priceSlot: 'text-product-card-price-fg text-product-card-price-size',
    stockStatusSlot: 'text-product-card-stock-fg text-product-card-stock-size ',
    badgesSlot: 'flex flex-wrap gap-product-card-box',
    ratingSlot: 'flex items-center',
    buttonsSlot: 'flex flex-wrap gap-product-card-buttons',
    cartButton:
      'bg-button-cart-bg hover:bg-button-cart-bg-hover text-button-cart-fg w-max',
    detailButton:
      'bg-button-detail-bg hover:bg-button-detail-bg-hover text-button-detail-fg w-max',
    wishlistButton:
      'bg-button-wishlist-bg hover:bg-button-wishlist-bg-hover text-button-wishlist-fg w-max',
  },
  variants: {
    // variant for layout of the card
    layout: {
      column: {
        base: ['grid grid-cols-1 gap-product-card-col-layout'],
        imageSlot: 'w-full order-image',
        nameSlot: 'order-name',
        priceSlot: 'order-price',
        stockStatusSlot: 'order-stock',
        badgesSlot: 'order-badges',
        ratingSlot: 'order-ratings',
        buttonsSlot: 'order-buttons',
      },
      row: {
        base: 'grid grid-cols-[auto_1fr] gap-x-product-card-row-layout',
        imageSlot: 'row-span-6',
      },
    },
    // variant for layout of the buttons
    buttonLayout: {
      horizontal: {
        buttonsSlot: 'justify-start',
      },
      vertical: {
        buttonsSlot: 'flex-col w-full',
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
    buttonLayout: 'vertical',
  },
})

type ProductCardVariants = VariantProps<typeof productCard>

// Core ProductCard props
export interface ProductCardCoreProps<T extends ElementType = typeof Image>
  extends ProductCardVariants,
    Omit<HTMLAttributes<HTMLDivElement>, 'width' | 'height'> {
  imageSrc?: string
  name: string
  price: string
  stockStatus: string
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
  imageAs?: T
}

// Combine core props with image component props
export type ProductCardProps<T extends ElementType = typeof Image> =
  ProductCardCoreProps<T> & Partial<ComponentPropsWithoutRef<T>>

export function ProductCard<T extends ElementType = typeof Image>(
  props: ProductCardProps<T>
) {
  // List of known ProductCard props to separate from image props
  const {
    // Core ProductCard props
    imageSrc,
    name,
    price,
    stockStatus,
    badges = [],
    rating,
    hasCartButton,
    hasDetailButton,
    hasWishlistButton,
    onCartClick,
    onDetailClick,
    onWishlistClick,
    cartButtonText = 'Add to cart',
    detailButtonText = 'Detail',
    wishlistButtonText = 'Wishlist',
    numericInput,
    customButtons,
    className,
    layout,
    buttonLayout,
    imageAs,
    // HTML div props
    onClick,
    onMouseEnter,
    onMouseLeave,
    style,
    id,
    tabIndex,
    role,
    'aria-label': ariaLabel,
    // Everything else goes to image
    ...imageProps
  } = props

  // Reconstruct div props
  const divProps = {
    onClick,
    onMouseEnter,
    onMouseLeave,
    style,
    id,
    tabIndex,
    role,
    'aria-label': ariaLabel,
  }
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

  const ImageComponent = (imageAs || Image) as ElementType

  // Merge image props with defaults
  const finalImageProps = {
    ...imageProps, // Image component props first
    src: imageProps.src || imageSrc, // Allow override
    alt: imageProps.alt || name, // Allow override
    className: imageSlot({ layout, className: imageProps.className }), // Our className last
  }

  return (
    <div className={base({ className, layout })} {...divProps}>
      {/* Image always rendered first for semantics, position controlled by CSS */}
      {finalImageProps.src && <ImageComponent {...finalImageProps} />}

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
            <div className="flex gap-product-card-box">
              {numericInput && <NumericInput />}
              <Button
                size="sm"
                className={cartButton()}
                onClick={onCartClick}
                icon="token-icon-cart-button"
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
              icon="token-icon-detail-button"
            >
              {detailButtonText}
            </Button>
          )}
          {hasWishlistButton && (
            <Button
              size="sm"
              className={wishlistButton()}
              onClick={onWishlistClick}
              icon="token-icon-wishlist-button"
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
