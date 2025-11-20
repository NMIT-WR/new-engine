import type { UseCheckoutShippingReturn } from '@/hooks/use-checkout-shipping'

interface ShippingMethodSectionProps {
  shipping: UseCheckoutShippingReturn
}

export function ShippingMethodSection({
  shipping,
}: ShippingMethodSectionProps) {
  return (
    <section className="rounded border border-border-primary bg-surface p-400">
      <h2 className="mb-400 font-semibold text-fg-primary text-lg">
        Shipping Method
      </h2>

      {shipping.isLoadingShipping ? (
        <p className="text-fg-secondary text-sm">Načítání způsobů dopravy...</p>
      ) : shipping.shippingOptions && shipping.shippingOptions.length > 0 ? (
        <div className="[&>*+*]:mt-200">
          {shipping.shippingOptions.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-center gap-200 rounded border border-border-primary bg-overlay p-200 hover:bg-surface"
            >
              <input
                type="radio"
                name="shipping"
                value={option.id}
                checked={shipping.selectedShippingMethodId === option.id}
                onChange={() => shipping.setShipping(option.id)}
                disabled={shipping.isSettingShipping}
                className="h-4 w-4"
              />
              <div className="flex-1">
                <p className="font-medium text-fg-primary text-sm">
                  {option.name}
                </p>
              </div>
              <p className="font-semibold text-fg-primary text-sm">
                {option.amount || 'Free'}
              </p>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-danger text-sm">Žádné způsoby dopravy k dispozici</p>
      )}
    </section>
  )
}
