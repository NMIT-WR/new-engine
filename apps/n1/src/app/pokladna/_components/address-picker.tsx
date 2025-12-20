"use client"

import { Badge } from "@techsio/ui-kit/atoms/badge"
import { Select } from "@techsio/ui-kit/molecules/select"
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

export function AddressPicker({
  addresses,
  selectedId,
  onSelect,
  disabled,
}: AddressPickerProps) {
  const options = useMemo(
    () =>
      addresses.map((address, index) => {
        const isDefault = index === 0
        const label = (
          <div
            className="flex w-full items-center justify-between gap-2"
            key={address.id}
          >
            <div className="flex flex-col gap-0.5 overflow-hidden">
              <span className="truncate text-fg-secondary text-sm">
                {address.city}, {formatPostalCode(address.postal_code ?? "")}
              </span>
              <span className="truncate font-normal text-fg-secondary text-xs">
                {address.address_1}
                {address.address_2 ? `, ${address.address_2}` : ""}
              </span>
            </div>
            {isDefault && (
              <Badge className="shrink-0 text-3xs" variant="info">
                Výchozí
              </Badge>
            )}
          </div>
        )

        return {
          label,
          value: address.id,
          displayValue: `${address.city}, ${address.address_1}`,
        }
      }),
    [addresses]
  )

  if (addresses.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm">Vyberte z vašich adres</h2>
      <Select
        className="w-full"
        clearIcon={false}
        disabled={disabled}
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
        options={options}
        placeholder="Vyberte adresu"
        size="lg"
        value={selectedId ? [selectedId] : []}
      />
    </div>
  )
}
