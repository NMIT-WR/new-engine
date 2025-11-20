import type { Cart } from '@/services/cart-service'
import type { HttpTypes } from '@medusajs/types'
import { Button } from '@ui/atoms/button'
import { Input } from '@ui/atoms/input'
import { Label } from '@ui/atoms/label'
import { CartItemRow } from './cart-item-row'
import { PriceSummaryRow } from './price-summary-row'

interface OrderSummaryProps {
  cart: Cart
  selectedShipping?: HttpTypes.StoreCartShippingOption
  errorMessage?: string
  isReady: boolean
  isCompletingCart: boolean
  onBack: () => void
  onComplete: () => void
}

export function OrderSummary({
  cart,
  selectedShipping,
  errorMessage,
  isReady,
  isCompletingCart,
  onBack,
  onComplete,
}: OrderSummaryProps) {
  return (
    <div className="rounded border border-border-primary bg-surface p-400 lg:sticky lg:top-4">
      <h2
        className="mb-400 font-semibold text-fg-primary text-lg"
        onClick={() =>
          console.log({
            cart: cart,
            selectedShipping: selectedShipping,
          })
        }
      >
        Shrnutí objednávky
      </h2>

      {/* Cart Items */}
      <div className="mb-400 border-border-primary border-b pb-400 [&>*+*]:mt-200">
        {cart.items?.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            currencyCode={cart.currency_code}
          />
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="border-border-primary border-b pb-400 [&>*+*]:mt-200">
        <PriceSummaryRow
          label="Subtotal"
          value={`${cart.subtotal} ${cart.currency_code}`}
        />

        {selectedShipping && (
          <PriceSummaryRow
            label="Delivery"
            value={selectedShipping.amount || 'Free'}
          />
        )}

        {cart.discount_total > 0 && (
          <PriceSummaryRow
            label="Discount"
            value={`-${cart.discount_total} ${cart.currency_code}`}
            variant="success"
          />
        )}

        <PriceSummaryRow
          label="Tax"
          value={`${cart.tax_total} ${cart.currency_code}`}
        />
      </div>

      {/* Total */}
      <div className="mt-400 mb-400">
        <PriceSummaryRow
          label="Order Total"
          value={`${cart.total} ${cart.currency_code}`}
          variant="bold"
        />
      </div>

      {/* Coupon Code */}
      <div className="mb-400">
        <Label htmlFor="coupon" className="text-sm">
          Coupon Code
        </Label>
        <div className="mt-100 flex gap-200">
          <Input
            id="coupon"
            type="text"
            placeholder="Enter code"
            className="flex-1"
          />
          <Button variant="secondary" size="sm">
            Apply
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-400 rounded bg-danger p-200 text-white">
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-200">
        <Button
          onClick={onBack}
          variant="secondary"
          disabled={isCompletingCart}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={onComplete}
          disabled={!isReady || isCompletingCart}
          className="flex-1"
        >
          {isCompletingCart
            ? 'Processing...'
            : `Confirm Payment ${cart.total} ${cart.currency_code}`}
        </Button>
      </div>
    </div>
  )
}
