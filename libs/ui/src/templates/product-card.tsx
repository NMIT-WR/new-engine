import type { Ref } from 'react'
import { Badge } from '../atoms/badge'
import { ProductCard, type ProductCardProps } from '../molecules/product-card'

type ProductCardBadge =
  | {
      variant?:
        | 'primary'
        | 'secondary'
        | 'tertiary'
        | 'warning'
        | 'danger'
        | 'info'
        | 'discount'
        | 'success'
        | 'outline'
      label: string
    }
  | {
      variant: 'dynamic'
      label: string
      bgColor: string
      fgColor: string
      borderColor: string
    }

export interface ProductCardTemplateProps
  extends Pick<ProductCardProps, 'layout'> {
  image?: {
    src: string
    alt: string
  }
  name?: string
  price?: string
  originalPrice?: string
  badges?: ProductCardBadge[]
  rating?: {
    value: number
    count?: number
    reviewCount?: number
  }
  stock?: {
    status?: 'in-stock' | 'limited-stock' | 'out-of-stock'
    label: string
  }
  showActions?: boolean
  onAddToCart?: () => void
  onViewDetails?: () => void
  onAddToWishlist?: () => void
  cartButtonText?: string
  detailButtonText?: string
  wishlistButtonText?: string
  className?: string
  ref?: Ref<HTMLDivElement>
}

export function ProductCardTemplate({
  image,
  name,
  price,
  originalPrice,
  badges,
  rating,
  stock,
  showActions = true,
  onAddToCart,
  onViewDetails,
  onAddToWishlist,
  cartButtonText = 'Add to Cart',
  detailButtonText = 'View Details',
  wishlistButtonText = 'Add to Wishlist',
  layout = 'column',
  className,
  ref,
}: ProductCardTemplateProps) {
  return (
    <ProductCard layout={layout} className={className} ref={ref}>
      {image && <ProductCard.Image src={image.src} alt={image.alt} />}

      {badges && badges.length > 0 && (
        <ProductCard.Badges>
          {badges.map((badge, index) => {
            if (badge.variant === 'dynamic') {
              return (
                <Badge
                  key={index}
                  variant="dynamic"
                  bgColor={badge.bgColor || '#fff'}
                  fgColor={badge.fgColor || '#000'}
                  borderColor={badge.borderColor || '#ccc'}
                >
                  {badge.label}
                </Badge>
              )
            }

            return (
              <Badge key={index} variant={badge.variant || 'info'}>
                {badge.label}
              </Badge>
            )
          })}
        </ProductCard.Badges>
      )}

      {name && <ProductCard.Name>{name}</ProductCard.Name>}

      {(price || originalPrice) && (
        <div className="flex items-baseline gap-100">
          {originalPrice && (
            <span className="text-fg-muted line-through">{originalPrice}</span>
          )}
          {price && <ProductCard.Price>{price}</ProductCard.Price>}
        </div>
      )}

      {rating && (
        <div className="flex items-center gap-100">
          <ProductCard.Rating
            rating={{
              value: rating.value,
              count: rating.count,
            }}
          />
          {rating.reviewCount && (
            <span className="text-fg-muted text-sm">
              ({rating.reviewCount})
            </span>
          )}
        </div>
      )}

      {stock && (
        <ProductCard.Stock status={stock.status || 'in-stock'}>
          {stock.label}
        </ProductCard.Stock>
      )}

      {showActions && (onAddToCart || onViewDetails || onAddToWishlist) && (
        <ProductCard.Actions>
          {onAddToCart && (
            <ProductCard.Button
              buttonVariant="cart"
              icon="token-icon-cart-button"
              onClick={onAddToCart}
            >
              {cartButtonText}
            </ProductCard.Button>
          )}
          {onViewDetails && (
            <ProductCard.Button
              buttonVariant="detail"
              icon="token-icon-detail-button"
              onClick={onViewDetails}
            >
              {detailButtonText}
            </ProductCard.Button>
          )}
          {onAddToWishlist && (
            <ProductCard.Button
              buttonVariant="wishlist"
              icon="token-icon-wishlist-button"
              onClick={onAddToWishlist}
            >
              {wishlistButtonText}
            </ProductCard.Button>
          )}
        </ProductCard.Actions>
      )}
    </ProductCard>
  )
}
