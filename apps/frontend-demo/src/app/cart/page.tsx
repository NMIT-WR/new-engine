'use client'

import { SkeletonLoader } from '@/components/atoms/skeleton-loader'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/utils/price-utils'
import { getProductPath } from '@/utils/product-utils'
import Image from 'next/image'
import { Button } from '@ui/atoms/button'
import { Icon } from '@ui/atoms/icon'
import { Link } from '@ui/atoms/link'
import { LinkButton } from '@ui/atoms/link-button'
import { Breadcrumb } from '@ui/molecules/breadcrumb'
import { NumericInput } from '@ui/molecules/numeric-input'

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart, isLoading } = useCart()

  const items = cart?.items || []
  const subtotal = cart?.subtotal || 0
  const total = cart?.total || 0
  const currencyCode = cart?.region?.currency_code

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
              { label: 'Domů', href: '/' },
              { label: 'Košík', href: '/cart' },
            ]}
          />
        </div>

        <h1 className="mb-cart-title-margin font-cart-title text-cart-title">
          Nákupní košík
        </h1>

        {isLoading ? (
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
                            <div >
                              <Link
                                href={getProductPath(
                                  item.variant?.product?.handle || ''
                                )}
                              >
                                <h3 className="font-cart-item-title text-tertiary hover:text-cart-item-title">
                                  {item.title}
                                </h3>
                              </Link>
                              <div className="mb-cart-item-options-margin text-cart-item-options">
                                {item.variant?.title &&
                                  item.variant.title !== item.title && (
                                    <span>{item.variant.title}</span>
                                  )}
                              </div>
                              <p className="font-cart-item-price text-cart-item-price">
                                {formatPrice(price, currencyCode)}
                              </p>
                            </div>

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
                              className='py-0'
                            />
                            <Button
                              variant="tertiary"
                              theme="borderless"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              icon="icon-[mdi--delete-outline]"
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

              {/* Clear cart button */}
              <div className="mt-4">
                <Button
                  variant="tertiary"
                  theme="borderless"
                  size="sm"
                  onClick={clearCart}
                  icon="icon-[mdi--delete-sweep-outline]"
                >
                  Vyprázdnit košík
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-cart-summary-top lg:h-fit">
              <div className="rounded-cart-summary bg-cart-summary-bg p-cart-summary-padding shadow-cart-summary">
                <h2 className="mb-cart-summary-title-margin font-cart-summary-title text-cart-summary-title">
                  Souhrn objednávky
                </h2>

                <div className="space-y-cart-summary-rows-gap">
                  <div className="flex justify-between text-cart-summary-text">
                    <span>Mezisoučet</span>
                    <span>{formatPrice(subtotal, currencyCode)}</span>
                  </div>
                  <div className="flex justify-between text-cart-summary-text">
                    <span>Doprava</span>
                    <span>
                      {shipping === 0
                        ? 'ZDARMA'
                        : formatPrice(shipping, currencyCode)}
                    </span>
                  </div>
                  <div className="flex justify-between text-cart-summary-text">
                    <span>DPH (21%)</span>
                    <span>{formatPrice(tax, currencyCode)}</span>
                  </div>
                </div>

                <div className="my-cart-summary-divider border-cart-summary-divider border-t" />

                <div className="flex justify-between text-cart-summary-text">
                  <span>Celkem</span>
                  <span>{formatPrice(total, currencyCode)}</span>
                </div>

                <Link href="/payment" className="block">
                  <Button
                    className="mt-cart-checkout-margin w-full"
                    size="lg"
                    icon="icon-[mdi--lock-outline]"
                  >
                    Přejít k platbě
                  </Button>
                </Link>

                <Link href="/products" className="mt-4 block text-center">
                  <Button variant="tertiary" theme="borderless" size="sm">
                    Pokračovat v nakupování
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
              Váš košík je prázdný
            </h2>
            <p className="mb-cart-empty-text-margin text-cart-empty-text">
              Vypadá to, že jste do košíku ještě nic nepřidali.
            </p>
            <LinkButton 
              href="/products" 
              size="lg" 
              icon="icon-[mdi--shopping-outline]"
            >
              Začít Nakupovat
            </LinkButton>
          </div>
        )}
      </div>
    </div>
  )
}
