"use client"
import * as React from "react"
import * as ReactAria from "react-aria-components"
import { StoreCustomerAddress } from "@medusajs/types"
import { BaseRegionCountry } from "@medusajs/types/dist/http/region/common"
import { updateDefaultShippingAddress } from "@lib/data/customer"
import {
  UiSelectButton,
  UiSelectValue,
  UiSelectIcon,
  UiSelectListBox,
  UiSelectListBoxItem,
} from "@/components/ui/Select"

export const DefaultShippingAddressSelect: React.FC<{
  addresses: StoreCustomerAddress[]
  countries: BaseRegionCountry[]
}> = ({ addresses, countries }) => {
  const handleAddressSelect = async (value: string) => {
    await updateDefaultShippingAddress(value)
  }

  return (
    <>
      <p className="text-xs text-grayscale-500 mb-1.5">
        Default shipping address
      </p>
      <ReactAria.Select
        aria-label="Select default shipping address"
        defaultSelectedKey={addresses.find((i) => i.is_default_shipping)?.id}
        placeholder="Select default shipping address"
        className="mb-8"
        onSelectionChange={(key) => {
          if (typeof key === "string") {
            handleAddressSelect(key)
          }
        }}
      >
        <UiSelectButton className="!h-14">
          <UiSelectValue className="text-base" />
          <UiSelectIcon />
        </UiSelectButton>
        <ReactAria.Popover className="w-[--trigger-width]">
          <UiSelectListBox>
            {addresses?.map((address) => (
              <UiSelectListBoxItem key={address.id} id={address.id}>
                {[
                  address.address_1,
                  address.address_2,
                  [address.postal_code, address.city].filter(Boolean).join(" "),
                  countries.find(({ iso_2 }) => iso_2 === address.country_code)
                    ?.display_name,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </UiSelectListBoxItem>
            ))}
          </UiSelectListBox>
        </ReactAria.Popover>
      </ReactAria.Select>
    </>
  )
}
