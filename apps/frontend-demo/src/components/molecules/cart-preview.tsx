'use client'
import { SkeletonLoader } from '@/components/atoms/skeleton-loader'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/utils/price-utils'
import { getProductPath } from '@/utils/product-utils'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from 'ui/src/atoms/button'

export function CartPreview() {
  const { cart, removeItem, isLoading } = useCart()
  const items = cart?.items || []
  const total = cart?.total || 0

  if (isLoading) {
    return (
      <div className="max-w-cart-preview-max">
        <div className="space-y-4 p-4">
          <SkeletonLoader variant="text" size="md" block={true} />
          <SkeletonLoader variant="box" className="h-20" />
          <SkeletonLoader variant="box" className="h-20" block={true} />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-cart-preview-max">
        <div className="flex flex-col gap-4 py-cart-preview-empty-padding text-center">
          <p className="font-semibold text-cart-preview-empty-size text-cart-preview-fg">
            Cart is empty
          </p>
          <Link
            href="/products"
            className="mt-cart-preview-empty-mt inline-block"
          >
            <Button variant="primary" size="sm" block>
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-cart-preview-max">
      <div className="pb-cart-preview">
        <h3 className="font-cart-preview-title text-cart-preview-fg text-cart-preview-title-size">
          Your Cart:
        </h3>
      </div>

      <div className="max-h-cart-preview-height overflow-y-auto">
        {items.map((item) => {
          const price = item.unit_price || 0
          const imageUrl = item.thumbnail || '/placeholder.png'

          return (
            <div
              key={item.id}
              className="flex gap-cart-preview border-cart-preview-item-border border-b last:border-b-0"
            >
              <div className="h-cart-preview-item-image w-cart-preview-item-image rounded-cart-preview bg-cart-preview-item-image-bg">
                <Image
                  src={imageUrl}
                  alt={item.title}
                  width={60}
                  height={60}
                  className="h-full w-full object-cover p-1"
                />
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={getProductPath(item.variant?.product?.handle || '')}
                  className="block font-cart-preview-item text-cart-preview-fg text-cart-preview-item-size hover:text-cart-preview-fg-secondary"
                >
                  <span className="line-clamp-cart-item-name">
                    {item.title}
                  </span>
                </Link>
                {item.variant?.title && item.variant.title !== item.title && (
                  <p className="text-cart-preview-detail-size text-cart-preview-fg-secondary">
                    {item.variant.title}
                  </p>
                )}
                <p className="text-cart-preview-detail-size text-cart-preview-fg-secondary">
                  Amount: {item.quantity}
                </p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <Button
                  type="button"
                  theme="borderless"
                  onClick={() => removeItem(item.id)}
                  className="px-0 py-0 text-cart-preview-fg-secondary hover:text-cart-preview-fg"
                  aria-label="Remove from cart"
                  icon="token-icon-close"
                />
                <p className="font-cart-preview-item text-cart-preview-fg text-cart-preview-item-size">
                  {formatPrice(
                    price * item.quantity,
                    cart?.region?.currency_code
                  )}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-cart-preview-footer-border border-t pt-cart-preview">
        <div className="mb-cart-preview flex items-center justify-between">
          <span className="font-cart-preview-subtotal-label text-cart-preview-fg-secondary text-cart-preview-subtotal-label-size">
            Total
          </span>
          <span className="font-cart-preview-subtotal-amount text-cart-preview-fg text-cart-preview-subtotal-size">
            {formatPrice(total, cart?.region?.currency_code)}
          </span>
        </div>
        <div className="flex flex-col gap-cart-preview-actions-gap">
          <Link href="/cart" className="block">
            <Button variant="primary" size="md" block>
              To cart
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
