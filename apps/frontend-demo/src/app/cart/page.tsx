'use client'

import Image from 'next/image'
import { Button } from 'ui/src/atoms/button'
import { Icon } from 'ui/src/atoms/icon'
import { Link } from 'ui/src/atoms/link'
import { Breadcrumb } from 'ui/src/molecules/breadcrumb'
import { NumericInput } from 'ui/src/molecules/numeric-input'
import { tv } from 'ui/src/utils'
import { useCart } from '../../hooks/use-cart'
import { getProductPrice } from '../../utils/price-utils'
import { formatPrice } from '../../utils/product-utils'

const cartPageVariants = tv({
  slots: {
    root: 'min-h-screen bg-cart-bg',
    container:
      'mx-auto max-w-cart-max-w px-cart-container-x py-cart-container-y lg:px-cart-container-x-lg lg:py-cart-container-y-lg',
    breadcrumb: 'mb-cart-breadcrumb-margin',
    title: 'text-cart-title font-cart-title mb-cart-title-margin',
    content: 'lg:grid lg:grid-cols-cart-grid-cols lg:gap-cart-grid-gap',
    itemsSection: 'mb-cart-items-margin lg:mb-0',
    itemsList: 'divide-y divide-cart-item-divider',
    item: 'py-cart-item-y first:pt-0 last:pb-0',
    itemContent: 'flex gap-cart-item-gap',
    itemImage:
      'w-cart-item-image h-cart-item-image rounded-cart-item-image bg-cart-item-image-bg',
    itemDetails: 'flex-1',
    itemHeader: 'flex justify-between items-start mb-cart-item-header-margin',
    itemTitle: 'text-cart-item-title font-cart-item-title',
    itemPrice: 'text-cart-item-price font-cart-item-price',
    itemOptions: 'text-cart-item-options mb-cart-item-options-margin',
    itemActions: 'flex items-center gap-cart-item-actions-gap',
    removeButton: 'text-cart-remove hover:text-cart-remove-hover',
    summarySection: 'lg:sticky lg:top-cart-summary-top lg:h-fit',
    summaryCard:
      'bg-cart-summary-bg p-cart-summary-padding rounded-cart-summary shadow-cart-summary',
    summaryTitle:
      'text-cart-summary-title font-cart-summary-title mb-cart-summary-title-margin',
    summaryRows: 'space-y-cart-summary-rows-gap',
    summaryRow: 'flex justify-between text-cart-summary-text',
    summaryDivider:
      'my-cart-summary-divider border-t border-cart-summary-divider',
    totalRow: 'flex justify-between text-cart-total font-cart-total',
    checkoutButton: 'w-full mt-cart-checkout-margin',
    emptyState: 'text-center py-cart-empty-y',
    emptyIcon: 'text-cart-empty-icon mb-cart-empty-icon-margin',
    emptyTitle:
      'text-cart-empty-title font-cart-empty-title mb-cart-empty-title-margin',
    emptyText: 'text-cart-empty-text mb-cart-empty-text-margin',
  },
})

export default function CartPage() {
  const { items, subtotal, total, removeItem, updateQuantity, clearCart } =
    useCart()
  const styles = cartPageVariants()

  // Use helper to calculate tax properly
  const tax = subtotal * 0.21 // 21% VAT
  const shipping = 0 // Free shipping

  return (
    <div className={styles.root()}>
      <div className={styles.container()}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb()}>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Cart', href: '/cart' },
            ]}
          />
        </div>

        <h1 className={styles.title()}>Shopping Cart</h1>

        {items.length > 0 ? (
          <div className={styles.content()}>
            {/* Cart Items */}
            <div className={styles.itemsSection()}>
              <div className={styles.itemsList()}>
                {items.map((item) => {
                  const price = getProductPrice(item.product)
                  const itemTotal = price * item.quantity

                  return (
                    <div key={item.id} className={styles.item()}>
                      <div className={styles.itemContent()}>
                        {/* Product Image */}
                        <div className={styles.itemImage()}>
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
                        <div className={styles.itemDetails()}>
                          <div className={styles.itemHeader()}>
                            <div>
                              <h3 className={styles.itemTitle()}>
                                {item.product.title}
                              </h3>
                              <div className={styles.itemOptions()}>
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
                              <p className={styles.itemPrice()}>
                                {formatPrice(price)}
                              </p>
                            </div>
                            <p className={styles.itemPrice()}>
                              {formatPrice(itemTotal)}
                            </p>
                          </div>

                          <div className={styles.itemActions()}>
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
                              className={styles.removeButton()}
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
            <div className={styles.summarySection()}>
              <div className={styles.summaryCard()}>
                <h2 className={styles.summaryTitle()}>Order Summary</h2>

                <div className={styles.summaryRows()}>
                  <div className={styles.summaryRow()}>
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className={styles.summaryRow()}>
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className={styles.summaryRow()}>
                    <span>Tax (21%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                </div>

                <div className={styles.summaryDivider()} />

                <div className={styles.totalRow()}>
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <Button
                  className={styles.checkoutButton()}
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
          <div className={styles.emptyState()}>
            <Icon
              icon="icon-[mdi--cart-outline]"
              size="2xl"
              className={styles.emptyIcon()}
            />
            <h2 className={styles.emptyTitle()}>Your cart is empty</h2>
            <p className={styles.emptyText()}>
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
