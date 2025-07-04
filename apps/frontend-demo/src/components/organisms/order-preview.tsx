'use client'

import { formatPrice } from '@/lib/format-price'
import { useCart } from '@/hooks/use-cart'
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
  className = ''
}: OrderPreviewProps) {
  const { cart } = useCart()

  if (!cart) {
    return null
  }

  const finalTotal = cart.total + shippingPrice + paymentFee

  return (
    <div className={`rounded-lg p-6 ${className.includes('sticky') ? 'sticky top-4' : ''}`}>
      <h3 className="text-lg font-semibold text-fg-primary mb-4">Souhrn objednávky</h3>
      
      {showDetails && cart.items && cart.items.length > 0 && (
        <div className="flex flex-col gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
          {cart.items.map((cartItem) => (
            <div key={cartItem.id} className="grid grid-cols-[auto_1fr_auto] gap-3 items-start">
              {cartItem.thumbnail && (
                <div className="w-[60px] h-[60px] flex-shrink-0">
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
                <div className="font-medium text-fg-primary text-sm">{cartItem.title}</div>
                {cartItem.variant && (
                  <div className="text-xs text-fg-secondary">{cartItem.variant.title}</div>
                )}
                <div className="text-xs text-fg-secondary">Množství: {cartItem.quantity}</div>
              </div>
              <div className="font-medium text-fg-primary text-sm">
                {formatPrice(cartItem.unit_price * cartItem.quantity)}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center py-3 text-sm text-fg-primary">
          <span>Mezisoučet</span>
          <span>{formatPrice(cart.subtotal)}</span>
        </div>
        
        {cart.discount_total > 0 && (
          <div className="flex justify-between items-center py-3 text-sm text-fg-primary text-green-600 dark:text-green-400">
            <span>Sleva</span>
            <span>-{formatPrice(cart.discount_total)}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center py-3 text-sm text-fg-primary">
          <span>DPH (21%)</span>
          <span>{formatPrice(cart.tax_total)}</span>
        </div>
        
        <div className="flex justify-between items-center py-3 text-sm text-fg-primary">
          <span>Doprava</span>
          <span>{shippingPrice > 0 ? formatPrice(shippingPrice) : 'Zdarma'}</span>
        </div>
        
        {paymentFee > 0 && (
          <div className="flex justify-between items-center py-3 text-sm text-fg-primary">
            <span>Poplatek za platbu</span>
            <span>{formatPrice(paymentFee)}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center py-3 text-sm text-fg-primary border-t-2 border-gray-200 dark:border-gray-700 mt-2 pt-4 text-base font-semibold">
          <span>Celkem</span>
          <span>{formatPrice(finalTotal)}</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-fg-secondary">
          <svg className="w-4 h-4 text-fg-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Zabezpečená platba</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-fg-secondary">
          <svg className="w-4 h-4 text-fg-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>100% garance kvality</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-fg-secondary">
          <svg className="w-4 h-4 text-fg-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          <span>30denní garance vrácení peněz</span>
        </div>
      </div>
    </div>
  )
}