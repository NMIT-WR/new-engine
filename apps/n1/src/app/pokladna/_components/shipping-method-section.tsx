import type { HttpTypes } from "@medusajs/types"
import { Button } from "@techsio/ui-kit/atoms/button"
import { ErrorText } from "@techsio/ui-kit/atoms/error-text"
import { ExtraText } from "@techsio/ui-kit/atoms/extra-text"
import { Skeleton } from "@techsio/ui-kit/atoms/skeleton"
import type { ReactNode } from "react"
import type { UseCheckoutShippingReturn } from "@/hooks/use-checkout-shipping"
import { formatToTaxIncluded } from "@/utils/format/format-product"

type ShippingMethodSectionProps = {
  shipping: UseCheckoutShippingReturn
}

type ShippingOptionCardProps = {
  option: HttpTypes.StoreCartShippingOption
  selected: boolean
  isUpdating?: boolean
  onSelect: (id: string) => void
}

function ShippingOptionCard({
  option,
  selected,
  isUpdating,
  onSelect,
}: ShippingOptionCardProps) {
  const formattedPrice = formatToTaxIncluded({
    amount: option.amount,
    currency: option.calculated_price.currency_code ?? "czk",
  })

  return (
    <Button
      aria-label={`${option.name}, ${formattedPrice || "zdarma"}`}
      className="flex w-full items-center gap-300 rounded-lg border border-border-secondary bg-surface-light p-300 data-[selected=true]:border-border-primary/30 data-[selected=true]:bg-overlay-light"
      data-selected={selected}
      disabled={isUpdating}
      onClick={() => onSelect(option.id)}
      type="button"
      variant="tertiary"
    >
      <div className="flex-1 text-left">
        <p className="font-medium text-fg-primary text-sm">{option.name}</p>
        <ExtraText size="sm">Dodání 2-3 dny</ExtraText>
      </div>
      <span>{formattedPrice || "Zdarma"}</span>
    </Button>
  )
}

export function ShippingMethodSection({
  shipping,
}: ShippingMethodSectionProps) {
  let content: ReactNode

  if (shipping.isLoadingShipping) {
    content = (
      <div aria-busy="true" className="grid grid-cols-1 gap-200 md:grid-cols-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton.Rectangle className="h-[72px]" key={i} />
        ))}
      </div>
    )
  } else if (shipping.shippingOptions && shipping.shippingOptions.length > 0) {
    content = (
      <div
        aria-label="Vyberte způsob dopravy"
        className="grid grid-cols-1 gap-200 md:grid-cols-2"
        data-updating={shipping.isSettingShipping}
        role="radiogroup"
      >
        {shipping.shippingOptions.map((option) => (
          <ShippingOptionCard
            isUpdating={shipping.isSettingShipping}
            key={option.id}
            onSelect={shipping.setShipping}
            option={option}
            selected={shipping.selectedShippingMethodId === option.id}
          />
        ))}
      </div>
    )
  } else {
    content = (
      <ErrorText showIcon size="md">
        Žádné způsoby dopravy nejsou momentálně k dispozici. Zkuste to prosím
        později.
      </ErrorText>
    )
  }

  return (
    <section className="rounded border border-border-secondary bg-surface-light p-400">
      <h2 className="mb-400 font-semibold text-fg-primary text-lg">
        Způsob dopravy
      </h2>
      {content}
    </section>
  )
}
