import Image from 'next/image'
import '../../tokens/app-components/molecules/_shipping-selection.css'
import { SHIPPING_METHODS } from '@/lib/checkout-data'
import type { ShippingSelectionProps } from '@/types/checkout'
import { Button } from '@ui/atoms/button'

export function ShippingSelection({
  selected,
  onSelect,
}: ShippingSelectionProps) {
  return (
    <div className="w-full p-2 sm:p-4">
      <div
        className="grid grid-cols-1 gap-3 sm:gap-4"
        role="radiogroup"
        aria-label="Vyberte způsob dopravy"
      >
        {SHIPPING_METHODS.map((method) => (
          <Button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className="relative flex items-center rounded-lg border-2 border-border-subtle bg-surface p-3 transition-all duration-200 hover:bg-surface-hover hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base data-[selected=true]:border-primary data-[selected=true]:bg-surface-selected data-[selected=true]:shadow-lg sm:p-4"
            data-selected={selected === method.id}
            aria-checked={selected === method.id}
            aria-label={`${method.name} - ${method.description} - ${method.price}`}
          >
            {' '}
            <div className="flex flex-1 items-center gap-3 sm:gap-4">
              {method.image && (
                <Image
                  src={method.image}
                  alt={method.name}
                  width={100}
                  height={50}
                  className="h-[30px] w-[60px] object-contain sm:h-[40px] sm:w-[80px] lg:h-[50px] lg:w-[100px]"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-fg-primary text-sm">
                  {method.name}
                </h3>
                <p className="mt-0.5 text-fg-secondary text-xs sm:text-sm">
                  {method.description}
                </p>
                <p className="font-medium text-fg-secondary text-xs">
                  {method.deliveryDate || method.delivery}
                </p>
              </div>
              <span className="ml-auto font-bold text-fg-primary sm:text-lg">
                {method.priceFormatted}
              </span>
              <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-border bg-base transition-all duration-200 sm:h-5 sm:w-5">
                <div
                  className="h-2 w-2 scale-0 rounded-full bg-primary opacity-0 transition-all duration-200 data-[selected=true]:scale-100 data-[selected=true]:opacity-100 sm:h-2.5 sm:w-2.5"
                  data-selected={selected === method.id}
                />
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
