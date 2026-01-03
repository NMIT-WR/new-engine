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
  const items = useMemo(
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
    <div className="flex flex-col gap-2">
      <h2 className="text-sm">Vyberte z vašich adres</h2>
      <Select
        items={items}
        className="w-full"
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
        size="lg"
        value={selectedId ? [selectedId] : []}
      >
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Vyberte adresu" />
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            {items.map((item) => (
              <Select.Item key={item.value} item={item}>
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className="truncate text-fg-secondary text-sm">
                      {item.address.city}, {formatPostalCode(item.address.postal_code ?? "")}
                    </span>
                    <span className="truncate font-normal text-fg-secondary text-xs">
                      {item.address.address_1}
                      {item.address.address_2 ? `, ${item.address.address_2}` : ""}
                    </span>
                  </div>
                  {item.isDefault && (
                    <Badge className="shrink-0 text-3xs" variant="info">
                      Výchozí
                    </Badge>
                  )}
                </div>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select>
    </div>
  )
}
