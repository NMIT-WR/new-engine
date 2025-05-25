'use client'

import { useMemo } from 'react'

import {
  UiSelectButton,
  UiSelectIcon,
  UiSelectListBox,
  UiSelectListBoxItem,
  UiSelectValue,
} from '@/components/ui/Select'
import type { HttpTypes } from '@medusajs/types'
import * as ReactAria from 'react-aria-components'

export type CountrySelectProps = ReactAria.SelectProps<
  Exclude<HttpTypes.StoreRegion['countries'], undefined>[number]
> & {
  region?: HttpTypes.StoreRegion
}

const CountrySelect = ({
  placeholder = 'Country',
  region,
  ...props
}: CountrySelectProps) => {
  const countryOptions = useMemo(() => {
    if (!region) {
      return []
    }

    return region.countries?.map((country) => ({
      value: country.iso_2,
      label: country.display_name,
    }))
  }, [region])

  return (
    <ReactAria.Select
      aria-label="Select country"
      {...props}
      placeholder={placeholder}
    >
      <UiSelectButton className="!h-14">
        <UiSelectValue className="text-base" />
        <UiSelectIcon />
      </UiSelectButton>
      <ReactAria.Popover className="w-[--trigger-width]">
        <UiSelectListBox>
          {countryOptions?.map(({ value, label }, index) => (
            <UiSelectListBoxItem key={index} id={value}>
              {label}
            </UiSelectListBoxItem>
          ))}
        </UiSelectListBox>
      </ReactAria.Popover>
    </ReactAria.Select>
  )
}

CountrySelect.displayName = 'CountrySelect'

export default CountrySelect
