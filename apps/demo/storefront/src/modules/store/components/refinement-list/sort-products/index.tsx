"use client"

import * as ReactAria from "react-aria-components"
import {
  UiSelectButton,
  UiSelectIcon,
  UiSelectListBox,
  UiSelectListBoxItem,
  UiSelectValue,
} from "@/components/ui/Select"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions | undefined
  setQueryParams: (name: string, value: SortOptions) => void
}

const SortProducts = ({ sortBy, setQueryParams }: SortProductsProps) => {
  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  return (
    <ReactAria.Select
      placeholder="Sort by"
      selectedKey={sortBy || "sortBy"}
      onSelectionChange={(key) => {
        handleChange(key as SortOptions)
      }}
      className="max-md:hidden"
      aria-label="Sort by"
    >
      <UiSelectButton>
        <UiSelectValue />
        <UiSelectIcon />
      </UiSelectButton>
      <ReactAria.Popover className="w-60" placement="bottom right">
        <UiSelectListBox>
          <UiSelectListBoxItem id="created_at">
            Latest Arrivals
          </UiSelectListBoxItem>
          <UiSelectListBoxItem id="price_asc">Lowest price</UiSelectListBoxItem>
          <UiSelectListBoxItem id="price_desc">
            Highest price
          </UiSelectListBoxItem>
        </UiSelectListBox>
      </ReactAria.Popover>
    </ReactAria.Select>
  )
}

export default SortProducts
