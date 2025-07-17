'use client'
import { useSearchProducts } from '@/hooks/use-search-products'
import { Product } from '@/types/product'
import type { StoreProduct } from '@medusajs/types'
import { Icon } from '@ui/atoms/icon'
import { Combobox, type ComboboxItem } from '@ui/molecules/combobox'
import { Popover } from '@ui/molecules/popover'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

export function HeaderSearch() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedValue, setSelectedValue] = useState<string[]>([])
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // Use search hook
  const { searchResults, isSearching, searchProducts } = useSearchProducts({
    limit: 5,
  })

  const comboboxItems = searchResults.map((product) => ({
    id: product.id,
    value: product.handle || product.id,
    label: product.title || 'Untitled Product',
  }))

  // Update search query and trigger debounced search
  const handleInputChange = useCallback(
    (value: string) => {
      setSearchQuery(value)

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        searchProducts(value)
      }, 300)
    },
    [searchProducts]
  )

  // Create combobox items
  const searchItems: ComboboxItem<Product>[] = searchResults.map(
    (product) => ({
      value: product.handle || product.id,
      label: product.title || 'Untitled Product',
      data: product,
    })
  )

  // Add "View all results" option if there's a search query
  if (searchQuery && searchResults.length > 0) {
    searchItems.push({
      value: '__search__',
      label: `Zobrazit všechny výsledky pro "${searchQuery}"`,
      data: undefined,
    })
  }

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`)
      setSearchQuery('')
      setSelectedValue([])
    }
  }

  const handleSelect = (value: string | string[]) => {
    const selectedValues = Array.isArray(value) ? value : [value]
    console.log('Selected values:', selectedValues)

    if (selectedValues.length > 0 && selectedValues[0]) {
      const selectedValue = selectedValues[0]

      // Zkontrolovat jestli je to existující produkt nebo custom search
      const isProductHandle = searchItems.some(
        (item) => item.value === selectedValue
      )

      if (isProductHandle) {
        router.push(`/products/${selectedValue}`)
      } else {
        // Custom hodnota = search query
        handleSearch(selectedValue)
      }

      setSearchQuery('')
      setSelectedValue([])
    }
  }

  return (
    <Popover
      id="header-search-popover"
      trigger={
        <Icon
          className="text-header-icon-size text-tertiary"
          icon="token-icon-search"
        />
      }
      triggerClassName="data-[state=open]:ring-0 data-[state=open]:ring-offset-0"
      contentClassName="z-10"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (searchQuery.trim()) {
            handleSearch(searchQuery)
          }
        }}
      >
         <Combobox
          placeholder="Hledat produkty..."
          items={comboboxItems}
          value={selectedValue}
          onChange={handleSelect}
          onInputValueChange={handleInputChange}
          allowCustomValue={true}
          autoFocus={true}
          closeOnSelect
          clearable={false}
          size="sm"
        /> 
      </form>
    </Popover>
  )
}
