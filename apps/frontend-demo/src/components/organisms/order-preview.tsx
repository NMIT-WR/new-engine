'use client'

import { formatPrice } from '@/lib/format-price'
import { useCart } from '@/hooks/use-cart'
import Image from 'next/image'
import { tv } from 'tailwind-variants'

interface OrderPreviewProps {
  shippingPrice?: number
  paymentFee?: number
  showDetails?: boolean
  className?: string
}

const orderPreviewStyles = tv({
  slots: {
    root: 'rounded-lg p-6',
    title: 'text-lg font-semibold text-fg-primary mb-4',
    items: 'flex flex-col gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 mb-4',
    item: 'grid grid-cols-[auto_1fr_auto] gap-3 items-start',
    itemImage: 'w-[60px] h-[60px] flex-shrink-0',
    itemDetails: 'flex flex-col gap-1',
    itemName: 'font-medium text-fg-primary text-sm',
    itemVariant: 'text-xs text-fg-secondary',
    itemQuantity: 'text-xs text-fg-secondary',
    itemPrice: 'font-medium text-fg-primary text-sm',
    totals: 'flex flex-col gap-2',
    line: 'flex justify-between items-center py-3 text-sm text-fg-primary',
    lineDiscount: 'text-green-600 dark:text-green-400',
    lineTotal: 'border-t-2 border-gray-200 dark:border-gray-700 mt-2 pt-4 text-base font-semibold',
    info: 'flex flex-col gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700',
    infoItem: 'flex items-center gap-2 text-sm text-fg-secondary',
    infoIcon: 'w-4 h-4 text-fg-secondary',
  },
  variants: {
    sticky: {
      true: {
        root: 'sticky top-4',
      },
    },
  },
})

export function OrderPreview({ 
  shippingPrice = 0, 
  paymentFee = 0, 
  showDetails = true,
  className = ''
}: OrderPreviewProps) {
  const { cart } = useCart()
  
  const isSticky = className.includes('sticky')
  const { root, title, items, item, itemImage, itemDetails, itemName, itemVariant, itemQuantity, itemPrice, totals, line, lineDiscount, lineTotal, info, infoItem, infoIcon } = orderPreviewStyles({ sticky: isSticky })

  if (!cart) {
    return null
  }

  const finalTotal = cart.total + shippingPrice + paymentFee

  return (
    <div className={root()}>
      <h3 className={title()}>Souhrn objednávky</h3>
      
      {showDetails && cart.items && cart.items.length > 0 && (
        <div className={items()}>
          {cart.items.map((cartItem) => (
            <div key={cartItem.id} className={item()}>
              {cartItem.thumbnail && (
                <div className={itemImage()}>
                  <Image
                    src={cartItem.thumbnail}
                    alt={cartItem.title}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                </div>
              )}
              <div className={itemDetails()}>
                <div className={itemName()}>{cartItem.title}</div>
                {cartItem.variant && (
                  <div className={itemVariant()}>{cartItem.variant.title}</div>
                )}
                <div className={itemQuantity()}>Množství: {cartItem.quantity}</div>
              </div>
              <div className={itemPrice()}>
                {formatPrice(cartItem.unit_price * cartItem.quantity)}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className={totals()}>
        <div className={line()}>
          <span>Mezisoučet</span>
          <span>{formatPrice(cart.subtotal)}</span>
        </div>
        
        {cart.discount_total > 0 && (
          <div className={`${line()} ${lineDiscount()}`}>
            <span>Sleva</span>
            <span>-{formatPrice(cart.discount_total)}</span>
          </div>
        )}
        
        <div className={line()}>
          <span>DPH (21%)</span>
          <span>{formatPrice(cart.tax_total)}</span>
        </div>
        
        <div className={line()}>
          <span>Doprava</span>
          <span>{shippingPrice > 0 ? formatPrice(shippingPrice) : 'Zdarma'}</span>
        </div>
        
        {paymentFee > 0 && (
          <div className={line()}>
            <span>Poplatek za platbu</span>
            <span>{formatPrice(paymentFee)}</span>
          </div>
        )}
        
        <div className={`${line()} ${lineTotal()}`}>
          <span>Celkem</span>
          <span>{formatPrice(finalTotal)}</span>
        </div>
      </div>
      
      <div className={info()}>
        <div className={infoItem()}>
          <svg className={infoIcon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Zabezpečená platba</span>
        </div>
        <div className={infoItem()}>
          <svg className={infoIcon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>100% garance kvality</span>
        </div>
      </div>
    </div>
  )
}