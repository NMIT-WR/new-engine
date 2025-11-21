'use client'

import { SkeletonLoader } from '@/components/atoms/skeleton-loader'
import { CartSummary } from '@/components/cart/cart-summary'
import { EmptyCart } from '@/components/cart/empty-cart'
import { useCart } from '@/hooks/use-cart'
import { truncateProductTitle } from '@/lib/order-utils'
import { orderHelpers } from '@/stores/order-store'
import { formatPrice } from '@/utils/price-utils'
import { getProductPath } from '@/utils/product-utils'
import { Button } from '@ui/atoms/button'
import { NumericInput } from '@ui/atoms/numeric-input'
import { Breadcrumb } from '@ui/molecules/breadcrumb'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart, isLoading } = useCart()

  const items = cart?.items || []
  const subtotal = cart?.subtotal || 0
  const total = cart?.total || 0
  const currencyCode = cart?.region?.currency_code

  // Use helper to calculate tax properly
  const tax = subtotal * 0.21 // 21% VAT
  const shipping = 0 // Free shipping

  // Clear previous completed order
  orderHelpers.clearCompletedOrder()

  return (
    <div className="min-h-screen bg-cart-bg">
      <div className="mx-auto max-w-cart-max-w px-cart-container-x py-cart-container-y lg:px-cart-container-x-lg lg:py-cart-container-y-lg">
        {/* Breadcrumb */}
        <div className="mb-cart-breadcrumb-margin">
          <Breadcrumb
            items={[
              { label: 'Domů', href: '/' },
              { label: 'Košík', href: '/cart' },
            ]}
            linkAs={Link}
          />
        </div>

        <div className="mb-400 flex items-center justify-between gap-400">
          <h1 className="font-cart-title text-cart-title-size">
            Nákupní košík
          </h1>
          {/* Clear cart button */}
          <Button
            variant="tertiary"
            theme="borderless"
            size="sm"
            onClick={clearCart}
            icon="token-icon-remove-all"
          >
            Vyprázdnit košík
          </Button>
        </div>

        {isLoading || !cart ? (
          <div className="space-y-4">
            <SkeletonLoader variant="box" className="h-32 w-full" />
            <SkeletonLoader variant="box" className="h-32 w-full" />
            <SkeletonLoader variant="box" className="h-32 w-full" />
          </div>
        ) : items.length > 0 ? (
          <div className="lg:grid lg:grid-cols-cart-grid-cols lg:gap-cart-grid-gap">
            {/* Cart Items */}
            <div className="mb-cart-items-margin lg:mb-0">
              <div className="divide-y divide-cart-item-divider">
                {items.map((item) => {
                  const price = item.unit_price || 0
                  const itemTotal = price * item.quantity

                  return (
                    <div
                      key={item.id}
                      className="py-cart-item-y first:pt-0 last:pb-0"
                    >
                      <div className="flex gap-cart-item-gap">
                        {/* Product Image */}
                        <div className="h-cart-item-image w-cart-item-image rounded-cart-item-image bg-cart-item-image-bg">
                          {item.thumbnail && (
                            <Image
                              src={item.thumbnail}
                              alt={item.title}
                              width={120}
                              height={120}
                              className="h-full w-full rounded-cart-item-image object-cover"
                            />
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="mb-cart-item-header-margin flex items-start justify-between">
                            <div className="flex items-end gap-300 text-cart-item-title-size">
                              <Link
                                href={getProductPath(item.product_handle || '')}
                              >
                                <h3 className="font-cart-item-title text-tertiary hover:text-cart-item-title">
                                  {`${truncateProductTitle(item.title)} (${item.variant_title})`}
                                </h3>
                              </Link>
                              <p className="font-cart-item-price text-cart-item-price">
                                {formatPrice(price, currencyCode)}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-cart-item-actions-gap sm:flex-row sm:items-center">
                            <NumericInput
                              value={item.quantity}
                              min={1}
                              max={99}
                              hideControls={false}
                              onChange={(value) =>
                                updateQuantity(item.id, value)
                              }
                              size="sm"
                              className="h-fit w-24 py-0"
                            />
                            <Button
                              variant="tertiary"
                              theme="borderless"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              icon="token-icon-remove"
                            >
                              Odebrat
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <CartSummary
              subtotal={subtotal}
              total={total}
              tax={tax}
              shipping={shipping}
              currencyCode={currencyCode}
            />
          </div>
        ) : (
          <EmptyCart />
        )}
      </div>
    </div>
  )
}
