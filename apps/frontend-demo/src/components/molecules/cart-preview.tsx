'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from 'ui/src/atoms/button'
import { useCart } from '../../hooks/use-cart'
import { getProductPrice } from '../../utils/price-utils'
import { getProductPath } from '../../utils/product-utils'

export function CartPreview() {
  const { items, removeItem, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-cart-preview-max">
        <div className="flex flex-col gap-4 py-cart-preview-empty-padding text-center">
          <p className="text-cart-preview-empty-size font-semibold text-cart-preview-fg">Cart is empty</p>
          <Link href="/products" className="mt-cart-preview-empty-mt inline-block">
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
        <h3 className="text-cart-preview-title-size font-cart-preview-title text-cart-preview-fg">Your Cart:</h3>
      </div>

      <div className="max-h-cart-preview-height overflow-y-auto">
        {items.map((cartItem) => {
          const price = getProductPrice(cartItem.product)
          const imageUrl =
            cartItem.product.thumbnail ||
            cartItem.product.images?.[0]?.url ||
            '/placeholder.png'

          return (
            <div key={cartItem.id} className="flex gap-cart-preview border-b border-cart-preview-item-border last:border-b-0">
              <div className="h-cart-preview-item-image w-cart-preview-item-image rounded-cart-preview bg-cart-preview-item-image-bg">
                <Image
                  src={imageUrl}
                  alt={cartItem.product.title}
                  width={60}
                  height={60}
                  className="h-full w-full object-cover p-1"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={getProductPath(cartItem.product.handle)} className="text-cart-preview-item-size font-cart-preview-item text-cart-preview-fg hover:text-cart-preview-fg-secondary block">
                  <span className='line-clamp-cart-item-name'>{cartItem.product.title}</span>
                </Link>
                {(cartItem.selectedColor || cartItem.selectedSize) && (
                  <p className="text-cart-preview-detail-size text-cart-preview-fg-secondary">
                    {cartItem.selectedColor &&
                      `Color: ${cartItem.selectedColor}`}
                      <br />
                    {cartItem.selectedSize &&
                      `Size: ${cartItem.selectedSize}`}
                  </p>
                )}
                <p className="text-cart-preview-detail-size text-cart-preview-fg-secondary">Amount: {cartItem.quantity}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <Button
                  type="button"
                  theme='borderless'
                  onClick={() => removeItem(cartItem.id)}
                  className="text-cart-preview-fg-secondary hover:text-cart-preview-fg px-0 py-0"
                  aria-label="Remove from cart"
                  icon='token-icon-close'
                />
                <p className="text-cart-preview-item-size font-cart-preview-item text-cart-preview-fg">
                  €{(price * cartItem.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t border-cart-preview-footer-border pt-cart-preview">
        <div className="mb-cart-preview flex items-center justify-between">
          <span className="text-cart-preview-subtotal-label-size font-cart-preview-subtotal-label text-cart-preview-fg-secondary">Total</span>
          <span className="text-cart-preview-subtotal-size font-cart-preview-subtotal-amount text-cart-preview-fg">€{total.toFixed(2)}</span>
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
