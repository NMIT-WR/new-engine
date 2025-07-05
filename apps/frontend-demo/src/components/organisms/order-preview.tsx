'use client'

import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/format-price'
import { orderHelpers, orderStore } from '@/stores/order-store'
import { useStore } from '@tanstack/react-store'
import { Icon } from '@ui/atoms/icon'
import Image from 'next/image'

interface OrderPreviewProps {
  shippingPrice?: number
  paymentFee?: number
  showDetails?: boolean
  className?: string
}

export function OrderPreview({
  shippingPrice = 0,
  paymentFee = 0,
  showDetails = true,
  className = '',
}: OrderPreviewProps) {
  const { cart } = useCart()
  const orderState = useStore(orderStore)

  // Use order data from store or current cart
  const orderData = orderHelpers.getOrderData(cart)

  if (!orderData) {
    return null
  }

  const finalTotal = orderData.total + shippingPrice + paymentFee

  return (
    <div
      className={`rounded-lg p-6 ${className.includes('sticky') ? 'sticky top-4' : ''}`}
    >
      <h3 className="mb-4 font-semibold text-fg-primary text-lg">
        Souhrn objednávky
      </h3>

      {showDetails && orderData.items && orderData.items.length > 0 && (
        <div className="mb-4 flex flex-col gap-3 border-gray-200 border-b pb-4 dark:border-gray-700">
          {orderData.items.map((cartItem) => (
            <div
              key={cartItem.id}
              className="grid grid-cols-[auto_1fr_auto] items-start gap-3"
            >
              {cartItem.thumbnail && (
                <div className="h-[60px] w-[60px] flex-shrink-0">
                  <Image
                    src={cartItem.thumbnail}
                    alt={cartItem.title}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <div className="font-medium text-fg-primary text-sm">
                  {cartItem.title}
                </div>
                {cartItem.variant && (
                  <div className="text-fg-secondary text-xs">
                    {cartItem.variant.title}
                  </div>
                )}
                <div className="text-fg-secondary text-xs">
                  Množství: {cartItem.quantity}
                </div>
              </div>
              <div className="font-medium text-fg-primary text-sm">
                {formatPrice(cartItem.unit_price * cartItem.quantity)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between py-3 text-fg-primary text-sm">
          <span>Mezisoučet</span>
          <span>{formatPrice(orderData.subtotal)}</span>
        </div>

        {orderData.discount_total > 0 && (
          <div className="flex items-center justify-between py-3 text-fg-primary text-green-600 text-sm dark:text-green-400">
            <span>Sleva</span>
            <span>-{formatPrice(orderData.discount_total)}</span>
          </div>
        )}

        <div className="flex items-center justify-between py-3 text-fg-primary text-sm">
          <span>DPH (21%)</span>
          <span>{formatPrice(orderData.tax_total)}</span>
        </div>

        <div className="flex items-center justify-between py-3 text-fg-primary text-sm">
          <span>Doprava</span>
          <span>
            {shippingPrice > 0 ? formatPrice(shippingPrice) : 'Zdarma'}
          </span>
        </div>

        {paymentFee > 0 && (
          <div className="flex items-center justify-between py-3 text-fg-primary text-sm">
            <span>Poplatek za platbu</span>
            <span>{formatPrice(paymentFee)}</span>
          </div>
        )}

        <div className="mt-2 flex items-center justify-between border-gray-200 border-t-2 py-3 pt-4 font-semibold text-base text-fg-primary text-sm dark:border-gray-700">
          <span>Celkem</span>
          <span>{formatPrice(finalTotal)}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-gray-200 border-t pt-4 dark:border-gray-700">
        <div className="flex items-center gap-2 text-fg-secondary text-sm">
          <Icon icon="token-icon-lock" />
          <span>Zabezpečená platba</span>
        </div>
        <div className="flex items-center gap-2 text-fg-secondary text-sm">
          <Icon icon='token-icon-check-decagram'/>
          <span>100% garance kvality</span>
        </div>
        <div className="flex items-center gap-2 text-fg-secondary text-sm">
          <Icon icon='token-icon-back'/>
          <span>30denní garance vrácení peněz</span>
        </div>
      </div>
    </div>
  )
}
