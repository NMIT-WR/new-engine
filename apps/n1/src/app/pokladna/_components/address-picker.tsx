"use client"

import { Badge } from "@techsio/ui-kit/atoms/badge"
import type { SelectItem } from "@techsio/ui-kit/molecules/select"
import { SelectTemplate } from "@techsio/ui-kit/templates/select"
import { useMemo } from "react"
import type { StoreCustomerAddress } from "@/services/customer-service"
import { addressToFormData } from "@/utils/address-helpers"
import type { AddressFormData } from "@/utils/address-validation"
import { formatPostalCode } from "@/utils/format/format-postal-code"

interface AddressPickerProps {
  addresses: StoreCustomerAddress[]
  selectedId: string | null
  onSelect: (address: AddressFormData, id: string) => void
  disabled?: boolean
}

type AddressSelectItem = SelectItem & {
  address: StoreCustomerAddress
  isDefault: boolean
}

export function AddressPicker({
  addresses,
  selectedId,
  onSelect,
  disabled,
}: AddressPickerProps) {
  const items = useMemo<AddressSelectItem[]>(
    () =>
      addresses.map((address, index) => ({
        value: address.id,
        label: `${address.city}, ${address.address_1}`,
        displayValue: `${address.city}, ${address.address_1}`,
        isDefault: index === 0,
        address,
      })),
    [addresses]
  )

  if (addresses.length === 0) {
    return null
  }

  return (
    <SelectTemplate
      items={items}
      className="w-full"
      disabled={disabled}
      label="Vyberte z vašich adres"
      onValueChange={(details) => {
        const newId = details.value[0]
        if (newId) {
          const address = addresses.find((a) => a.id === newId)
          if (address) {
            const formData = addressToFormData(address) as AddressFormData
            onSelect(formData, address.id)
          }
        }
      }}
      placeholder="Vyberte adresu"
      renderItem={(item) => {
        const addressItem = item as AddressSelectItem
        return (
          <div className="flex w-full items-center justify-between gap-200">
            <div className="flex min-w-0 flex-col gap-50">
              <span className="truncate text-fg-secondary text-sm">
                {addressItem.address.city},{" "}
                {formatPostalCode(addressItem.address.postal_code ?? "")}
              </span>
              <span className="truncate font-normal text-fg-secondary text-xs">
                {addressItem.address.address_1}
                {addressItem.address.address_2
                  ? `, ${addressItem.address.address_2}`
                  : ""}
              </span>
            </div>
            {addressItem.isDefault && (
              <Badge className="shrink-0 text-3xs" variant="info">
                Výchozí
              </Badge>
            )}
          </div>
        )
      }}
      size="lg"
      value={selectedId ? [selectedId] : []}
    />
  )
}
