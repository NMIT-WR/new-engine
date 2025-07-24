import Image from 'next/image'
import '../../tokens/app-components/molecules/_shipping-selection.css'
import { SHIPPING_METHODS } from '@/lib/checkout-data'
import { formatPrice } from '@/lib/format-price'
import type {
  ReducedShippingMethod,
  ShippingSelectionProps,
} from '@/types/checkout'
import { Button } from '@ui/atoms/button'

const ShippingMethodDetail = ({
  method,
  selected,
}: {
  method: ReducedShippingMethod
  selected: string
}) => {
  const detailInfo = SHIPPING_METHODS.find((m) => m.name === method.name)

  const priceWithTax = (method.calculated_price?.calculated_amount || 0) * 1.21
  const formattedPrice = formatPrice(
    priceWithTax,
    method.calculated_price.currency_code || 'CZK'
  )

  return (
    <div className="flex flex-1 items-center gap-3 sm:gap-4">
      {detailInfo?.image && (
        <Image
          src={detailInfo.image}
          alt={detailInfo.name}
          width={100}
          height={50}
          className="h-[30px] w-[60px] object-contain sm:h-[40px] sm:w-[80px] lg:h-[50px] lg:w-[100px]"
        />
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-fg-primary text-sm">{method.name}</h3>
        <p className="mt-0.5 text-fg-secondary text-xs sm:text-sm">
          {detailInfo?.description}
        </p>
        <p className="font-medium text-fg-secondary text-xs">
          {detailInfo?.deliveryDate || detailInfo?.delivery}
        </p>
      </div>
      <span className="ml-auto font-bold text-fg-primary sm:text-lg">
        {formattedPrice}
      </span>
      <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-border bg-base transition-all duration-200 sm:h-5 sm:w-5">
        <div
          className="h-2 w-2 scale-0 rounded-full bg-primary opacity-0 transition-all duration-200 data-[selected=true]:scale-100 data-[selected=true]:opacity-100 sm:h-2.5 sm:w-2.5"
          data-selected={selected === method.id}
        />
      </div>
    </div>
  )
}

export function ShippingSelection({
  selected,
  onSelect,
  shippingMethods,
  isLoading,
}: ShippingSelectionProps) {
  return (
    <div className="w-full p-2 sm:p-4">
      <div
        className="grid grid-cols-1 gap-3 sm:gap-4"
        role="radiogroup"
        aria-label="Vyberte způsob dopravy"
      >
        {shippingMethods?.map((method) => (
          <Button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className="relative flex items-center rounded-lg border-2 border-border-subtle bg-surface p-3 transition-all duration-200 hover:bg-surface-hover hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base data-[selected=true]:border-primary data-[selected=true]:bg-surface-selected data-[selected=true]:shadow-lg sm:p-4"
            data-selected={selected === method.id}
            aria-checked={selected === method.id}
            aria-label={`${method.name} - ${method.calculated_price.calculated_amount}`}
          >
            <ShippingMethodDetail method={method} selected={selected} />
          </Button>
        ))}
      </div>
    </div>
  )
}
