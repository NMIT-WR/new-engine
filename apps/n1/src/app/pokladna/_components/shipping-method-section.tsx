import type { HttpTypes } from "@medusajs/types"
import { Button } from "@techsio/ui-kit/atoms/button"
import { ErrorText } from "@techsio/ui-kit/atoms/error-text"
import { ExtraText } from "@techsio/ui-kit/atoms/extra-text"
import type { ReactNode } from "react"
import type { UseCheckoutShippingReturn } from "@/hooks/checkout-shipping"
import type { UsePickupPointShippingReturn } from "@/hooks/use-pickup-point-shipping"
import type { ShippingMethodData } from "@/services/cart-service"
import { formatToTaxIncluded } from "@/utils/format/format-product"
import { SelectedParcelCard } from "./selected-parcel-card"

type ShippingMethodSectionProps = {
  shipping: UseCheckoutShippingReturn
  pickupPoint: UsePickupPointShippingReturn
}

type ShippingOptionCardProps = {
  option: HttpTypes.StoreCartShippingOption
  selected: boolean
  isUpdating?: boolean
  pickupPoint: UsePickupPointShippingReturn
  onSelect: (id: string, data?: ShippingMethodData) => void
}

function ShippingOptionCard({
  option,
  selected,
  isUpdating,
  pickupPoint,
  onSelect,
}: ShippingOptionCardProps) {
  const formattedPrice = formatToTaxIncluded({
    amount: option.amount,
    currency: option.calculated_price.currency_code ?? "czk",
  })

  const handleClick = () => {
    if (pickupPoint.requiresAccessPoint(option.name)) {
      // PPL Parcel - if we have selected access point, use it; otherwise open dialog
      if (pickupPoint.hasSelection) {
        const data = pickupPoint.getShippingData()
        if (data) onSelect(option.id, data)
      } else {
        pickupPoint.openDialog(option.id)
      }
    } else {
      // Regular shipping (including PPL Private)
      onSelect(option.id)
    }
  }

  return (
    <Button
      aria-checked={selected}
      aria-label={`${option.name}, ${formattedPrice || "zdarma"}`}
      className="flex w-full items-center gap-300 text-left data-[selected=true]:border-border-primary/30 data-[selected=true]:bg-overlay-light"
      data-selected={selected}
      disabled={isUpdating}
      onClick={handleClick}
      role="radio"
      theme="outlined"
      type="button"
      variant="secondary"
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
  pickupPoint,
}: ShippingMethodSectionProps) {
  let content: ReactNode

  const selectedOption = shipping.selectedOption

  const showParcelCard =
    selectedOption &&
    pickupPoint.requiresAccessPoint(selectedOption.name) &&
    pickupPoint.hasSelection

  if (shipping.shippingOptions && shipping.shippingOptions.length > 0) {
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
            pickupPoint={pickupPoint}
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

      {showParcelCard && pickupPoint.state.selectedPoint && (
        <SelectedParcelCard
          accessPoint={pickupPoint.state.selectedPoint}
          onChangeClick={() => pickupPoint.openDialog(selectedOption.id)}
        />
      )}
    </section>
  )
}
