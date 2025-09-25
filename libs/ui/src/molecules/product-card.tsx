import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
  createContext,
  useContext,
} from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Badge } from '../atoms/badge'
import { Button } from '../atoms/button'
import type { IconType } from '../atoms/icon'
import { Image } from '../atoms/image'
import { Rating, type RatingProps } from '../atoms/rating'
import { tv } from '../utils'

const productCardVariants = tv({
  slots: {
    root: [
      'rounded-product-card p-product-card-padding',
      'border-(length:--border-product-card-width) border-product-card-border bg-product-card-bg max-w-product-card-max shadow-sm',
    ],
    imageSlot:
      'object-cover aspect-product-card-image h-full rounded-product-card-image',
    nameSlot:
      'text-product-card-name-fg font-product-card-name text-product-card-name-size line-clamp-product-card-name',
    priceSlot:
      'text-product-card-price-fg font-product-card-price text-product-card-price-size',
    stockStatusSlot: [
      'text-product-card-stock-size font-product-card-stock',
      'data-[stock=in-stock]:text-product-card-stock-fg-in-stock',
      'data-[stock=limited-stock]:text-product-card-stock-fg-limited-stock',
      'data-[stock=out-of-stock]:text-product-card-stock-fg-out-of-stock',
    ],
    badgesSlot: 'flex flex-wrap gap-product-card-box',
    ratingSlot: 'flex items-center',
    actionsSlot: 'flex flex-wrap gap-product-card-buttons',
    badge: [
      'data-[variant=new]:bg-product-card-badge-new-bg data-[variant=new]:text-product-card-badge-new-fg',
      'data-[variant=info]:bg-product-card-badge-info-bg data-[variant=info]:text-product-card-badge-info-fg',
      'data-[variant=default]:bg-product-card-badge-default-bg data-[variant=default]:text-product-card-badge-default-fg',
      'data-[variant=limited]:bg-product-card-badge-limited-bg data-[variant=limited]:text-product-card-badge-limited-fg',
      'data-[variant=sale]:bg-product-card-badge-sale-bg data-[variant=sale]:text-product-card-badge-sale-fg',
    ],
    button: '',
  },
  variants: {
    buttonVariant: {
      cart: {
        button:
          'bg-button-cart-bg hover:bg-button-cart-bg-hover text-button-cart-fg w-max',
      },
      detail: {
        button:
          'bg-button-detail-bg hover:bg-button-detail-bg-hover text-button-detail-fg w-max',
      },
      wishlist: {
        button:
          'bg-button-wishlist-bg hover:bg-button-wishlist-bg-hover text-button-wishlist-fg w-max',
      },
      custom: {},
    },
    layout: {
      column: {
        root: ['grid grid-cols-1 gap-product-card-col-layout'],
      },
      row: {
        root: 'grid grid-cols-[auto_1fr] gap-x-product-card-row-layout',
      },
    },
  },
  defaultVariants: {
    layout: 'column',
    buttonVariant: 'cart',
  },
})

// === CONTEXT ===
interface ProductCardContextValue {
  layout?: 'column' | 'row'
}

const ProductCardContext = createContext<ProductCardContextValue>({})

// === TYPE DEFINITIONS ===
export interface ProductCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof productCardVariants> {
  children: ReactNode
  ref?: RefObject<HTMLDivElement>
}

type ProductCardImageProps<T extends ElementType = typeof Image> = {
  as?: T
  ref?: RefObject<HTMLElement>
  className?: string
} & Partial<ComponentPropsWithoutRef<T>>

interface ProductCardNameProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
  ref?: RefObject<HTMLHeadingElement>
}

interface ProductCardPriceProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
  ref?: RefObject<HTMLParagraphElement>
}

interface ProductCardStockProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
  status?: 'in-stock' | 'limited-stock' | 'out-of-stock'
  ref?: RefObject<HTMLParagraphElement>
}

interface ProductCardBadgesProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  ref?: RefObject<HTMLDivElement>
}

interface ProductCardRatingProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  ref?: RefObject<HTMLDivElement>
  rating?: RatingProps
}

interface ProductCardActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  ref?: RefObject<HTMLDivElement>
}

interface ProductCardButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  onClick?: () => void
  buttonVariant?: 'cart' | 'detail' | 'wishlist' | 'custom'
  icon?: IconType
  ref?: RefObject<HTMLButtonElement>
}

interface ProductCardBadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'new' | 'default' | 'limited' | 'sale' | 'info'
  children: string
}

// === ROOT COMPONENT ===
export function ProductCard({
  children,
  layout = 'column',
  className,
  ref,
  ...props
}: ProductCardProps) {
  const { root } = productCardVariants({ layout })

  return (
    <ProductCardContext.Provider value={{ layout }}>
      <div ref={ref} className={root({ className })} {...props}>
        {children}
      </div>
    </ProductCardContext.Provider>
  )
}

// === SUB-COMPONENTS ===

// ProductCard.Image
ProductCard.Image = function ProductCardImage<
  T extends ElementType = typeof Image,
>({ as, className, ref, ...props }: ProductCardImageProps<T>) {
  const context = useContext(ProductCardContext)
  const { imageSlot } = productCardVariants({ layout: context.layout })
  const ImageComponent = (as || Image) as ElementType

  return (
    <ImageComponent ref={ref} className={imageSlot({ className })} {...props} />
  )
}

// ProductCard.Name
ProductCard.Name = function ProductCardName({
  children,
  className,
  ref,
  ...props
}: ProductCardNameProps) {
  const context = useContext(ProductCardContext)
  const { nameSlot } = productCardVariants({ layout: context.layout })

  return (
    <h3 ref={ref} className={nameSlot({ className })} {...props}>
      {children}
    </h3>
  )
}

// ProductCard.Price
ProductCard.Price = function ProductCardPrice({
  children,
  className,
  ref,
  ...props
}: ProductCardPriceProps) {
  const context = useContext(ProductCardContext)
  const { priceSlot } = productCardVariants({ layout: context.layout })

  return (
    <p ref={ref} className={priceSlot({ className })} {...props}>
      {children}
    </p>
  )
}

// ProductCard.Stock
ProductCard.Stock = function ProductCardStock({
  children,
  className,
  ref,
  status = 'in-stock',
  ...props
}: ProductCardStockProps) {
  const context = useContext(ProductCardContext)
  const { stockStatusSlot } = productCardVariants({
    layout: context.layout,
  })

  return (
    <p
      ref={ref}
      data-stock={status}
      className={stockStatusSlot({ className })}
      {...props}
    >
      {children}
    </p>
  )
}

// ProductCard.Badges
ProductCard.Badges = function ProductCardBadges({
  children,
  className,
  ref,
  ...props
}: ProductCardBadgesProps) {
  const context = useContext(ProductCardContext)
  const { badgesSlot } = productCardVariants({ layout: context.layout })

  return (
    <div ref={ref} className={badgesSlot({ className })} {...props}>
      {children}
    </div>
  )
}

// ProductCard.Rating
ProductCard.Rating = function ProductCardRating({
  children,
  className,
  rating,
  ref,
  ...props
}: ProductCardRatingProps) {
  const context = useContext(ProductCardContext)
  const { ratingSlot } = productCardVariants({ layout: context.layout })

  return (
    <div ref={ref} className={ratingSlot({ className })} {...props}>
      {rating ? <Rating {...rating} /> : children}
    </div>
  )
}

// ProductCard.Actions
ProductCard.Actions = function ProductCardActions({
  children,
  className,
  ref,
  ...props
}: ProductCardActionsProps) {
  const context = useContext(ProductCardContext)
  const { actionsSlot } = productCardVariants({
    layout: context.layout,
  })

  return (
    <div ref={ref} className={actionsSlot({ className })} {...props}>
      {children}
    </div>
  )
}

// ProductCard.Button
ProductCard.Button = function ProductCardButton({
  children,
  onClick,
  icon,
  className,
  buttonVariant,
  ref,
  ...props
}: ProductCardButtonProps) {
  const { button } = productCardVariants({ buttonVariant })

  return (
    <Button
      ref={ref}
      size="sm"
      className={button({ className })}
      onClick={onClick}
      icon={icon}
      {...props}
    >
      {children}
    </Button>
  )
}

ProductCard.Badge = function ProductCardBadge({
  children,
  className,
  variant = 'default',
  ...props
}: ProductCardBadgeProps) {
  const { badge } = productCardVariants()

  return (
    <Badge className={badge({ className })} data-variant={variant} {...props}>
      {children}
    </Badge>
  )
}
