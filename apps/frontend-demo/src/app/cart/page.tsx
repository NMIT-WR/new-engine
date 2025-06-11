'use client'

import { useCart } from '@/hooks/use-cart'
import { getProductPrice } from '@/utils/price-utils'
import { formatPrice, getProductPath } from '@/utils/product-utils'
import Image from 'next/image'
import { Button } from 'ui/src/atoms/button'
import { Icon } from 'ui/src/atoms/icon'
import { Link } from 'ui/src/atoms/link'
import { Breadcrumb } from 'ui/src/molecules/breadcrumb'
import { NumericInput } from 'ui/src/molecules/numeric-input'

export default function CartPage() {
  const { items, subtotal, total, removeItem, updateQuantity, clearCart } =
    useCart()

  // Use helper to calculate tax properly
  const tax = subtotal * 0.21 // 21% VAT
  const shipping = 0 // Free shipping

  return (
    <div className="min-h-screen bg-cart-bg">
      <div className="mx-auto max-w-cart-max-w px-cart-container-x py-cart-container-y lg:px-cart-container-x-lg lg:py-cart-container-y-lg">
        {/* Breadcrumb */}
        <div className="mb-cart-breadcrumb-margin">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Cart', href: '/cart' },
            ]}
          />
        </div>

        <h1 className="mb-cart-title-margin font-cart-title text-cart-title">
          Shopping Cart
        </h1>

        {items.length > 0 ? (
          <div className="lg:grid lg:grid-cols-cart-grid-cols lg:gap-cart-grid-gap">
            {/* Cart Items */}
            <div className="mb-cart-items-margin lg:mb-0">
              <div className="divide-y divide-cart-item-divider">
                {items.map((item) => {
                  const price = getProductPrice(item.product)
                  const itemTotal = price * item.quantity

                  return (
                    <div
                      key={item.id}
                      className="py-cart-item-y first:pt-0 last:pb-0"
                    >
                      <div className="flex gap-cart-item-gap">
                        {/* Product Image */}
                        <div className="h-cart-item-image w-cart-item-image rounded-cart-item-image bg-cart-item-image-bg">
                          {item.product.thumbnail && (
                            <Image
                              src={item.product.thumbnail}
                              alt={item.product.title}
                              width={120}
                              height={120}
                              className="h-full w-full rounded-cart-item-image object-cover"
                            />
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="mb-cart-item-header-margin flex items-start justify-between">
                            <div>
                              <Link href={getProductPath(item.product.handle)}>
                                <h3 className="font-cart-item-title text-tertiary hover:text-cart-item-title">
                                  {item.product.title}
                                </h3>
                              </Link>
                              <div className="mb-cart-item-options-margin text-cart-item-options">
                                {item.selectedSize && (
                                  <span>Size: {item.selectedSize}</span>
                                )}
                                {item.selectedSize && item.selectedColor && (
                                  <span> • </span>
                                )}
                                {item.selectedColor && (
                                  <span>Color: {item.selectedColor}</span>
                                )}
                              </div>
                              <p className="font-cart-item-price text-cart-item-price">
                                {formatPrice(price)}
                              </p>
                            </div>
                            <p className="font-cart-item-price text-cart-item-price">
                              {formatPrice(itemTotal)}
                            </p>
                          </div>

                          <div className="flex items-center gap-cart-item-actions-gap">
                            <NumericInput
                              value={item.quantity}
                              min={1}
                              max={99}
                              onChange={(value) =>
                                updateQuantity(item.id, value)
                              }
                              size="sm"
                            />
                            <Button
                              variant="tertiary"
                              theme="borderless"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              icon="icon-[mdi--delete-outline]"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Clear cart button */}
              <div className="mt-4">
                <Button
                  variant="tertiary"
                  theme="borderless"
                  size="sm"
                  onClick={clearCart}
                  icon="icon-[mdi--delete-sweep-outline]"
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-cart-summary-top lg:h-fit">
              <div className="rounded-cart-summary bg-cart-summary-bg p-cart-summary-padding shadow-cart-summary">
                <h2 className="mb-cart-summary-title-margin font-cart-summary-title text-cart-summary-title">
                  Order Summary
                </h2>

                <div className="space-y-cart-summary-rows-gap">
                  <div className="flex justify-between text-cart-summary-text">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-cart-summary-text">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-cart-summary-text">
                    <span>Tax (21%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                </div>

                <div className="my-cart-summary-divider border-cart-summary-divider border-t" />

                <div className="flex justify-between text-cart-summary-text">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <Button
                  className="mt-cart-checkout-margin w-full"
                  size="lg"
                  icon="icon-[mdi--lock-outline]"
                >
                  Proceed to Checkout
                </Button>

                <Link href="/products" className="mt-4 block text-center">
                  <Button variant="tertiary" theme="borderless" size="sm">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart */
          <div className="py-cart-empty-y text-center">
            <Icon
              icon="icon-[mdi--cart-outline]"
              size="2xl"
              className="mb-cart-empty-icon-margin"
            />
            <h2 className="mb-cart-empty-title-margin font-cart-empty-title text-cart-empty-title">
              Your cart is empty
            </h2>
            <p className="mb-cart-empty-text-margin text-cart-empty-text">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/products">
              <Button size="lg" icon="icon-[mdi--shopping-outline]">
                Start Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
