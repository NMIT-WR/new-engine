'use client'
import {
  UiSelectButton,
  UiSelectIcon,
  UiSelectListBox,
  UiSelectListBoxItem,
  UiSelectValue,
} from '@/components/ui/Select'
import { updateDefaultBillingAddress } from '@lib/data/customer'
import type { StoreCustomerAddress } from '@medusajs/types'
import type { BaseRegionCountry } from '@medusajs/types/dist/http/region/common'
import * as ReactAria from 'react-aria-components'

type DefaultBillingAddressSelectProps = {
  addresses: StoreCustomerAddress[]
  countries: BaseRegionCountry[]
}

export const DefaultBillingAddressSelect = ({
  addresses,
  countries,
}: DefaultBillingAddressSelectProps) => {
  const handleAddressSelect = async (value: string) => {
    await updateDefaultBillingAddress(value)
  }

  return (
    <>
      <p className="mb-1.5 text-grayscale-500 text-xs">
        Default billing address
      </p>
      <ReactAria.Select
        aria-label="Select default shipping address"
        defaultSelectedKey={addresses.find((i) => i.is_default_billing)?.id}
        placeholder="Select default shipping address"
        className="mb-8"
        onSelectionChange={(key) => {
          if (typeof key === 'string') {
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
                  [address.postal_code, address.city].filter(Boolean).join(' '),
                  countries.find(({ iso_2 }) => iso_2 === address.country_code)
                    ?.display_name,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </UiSelectListBoxItem>
            ))}
          </UiSelectListBox>
        </ReactAria.Popover>
      </ReactAria.Select>
    </>
  )
}
