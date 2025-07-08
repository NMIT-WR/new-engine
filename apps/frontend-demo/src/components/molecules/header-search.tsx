'use client'
import { useDebouncedCallback } from '@/hooks/use-debounce'
import { useSearchProducts } from '@/hooks/use-search-products'
import type { StoreProduct } from '@medusajs/types'
import { Icon } from '@ui/atoms/icon'
import { Combobox, type ComboboxItem } from '@ui/molecules/combobox'
import { Popover } from '@ui/molecules/popover'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export function HeaderSearch() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedValue, setSelectedValue] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Use search hook
  const { searchResults, isSearching, searchProducts } = useSearchProducts({
    limit: 6, // Limit to 6 results for better UX
  })

  // Create debounced search function
  const debouncedSearch = useDebouncedCallback(searchProducts, 300)

  // Update search query and trigger debounced search
  const handleInputChange = (value: string) => {
    setSearchQuery(value)
    debouncedSearch(value)
  }

  // Create combobox items
  const searchItems: ComboboxItem<StoreProduct>[] = searchResults.map(
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
      data: undefined as any,
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

    if (selectedValues.length > 0 && selectedValues[0]) {
      const selectedValue = selectedValues[0]

      // Check if it's a search query (not a product handle)
      if (selectedValue === '__search__') {
        handleSearch(searchQuery)
      } else {
        // Check if it's a product handle or a custom search query
        const isProductHandle = searchItems.some(
          (item) => item.value === selectedValue
        )
        if (isProductHandle) {
          router.push(`/products/${selectedValue}`)
          setSearchQuery('')
          setSelectedValue([])
        } else {
          // It's a custom search query (user pressed Enter with custom value)
          handleSearch(selectedValue)
        }
      }
    }
  }

  // Handle Enter key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const inputElement = containerRef.current?.querySelector('input')
        if (inputElement && document.activeElement === inputElement) {
          // Only handle Enter if no item is selected in dropdown
          if (
            searchItems.length === 0 ||
            !document.querySelector('[data-highlighted="true"]')
          ) {
            e.preventDefault()
            handleSearch(searchQuery)
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchQuery, searchItems])

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
      <div ref={containerRef}>
        <Combobox
          placeholder={
            isSearching ? 'Hledám...' : 'Hledat produkty...'
          }
          items={searchItems}
          value={selectedValue}
          onChange={handleSelect}
          onInputValueChange={handleInputChange}
          allowCustomValue={true}
          closeOnSelect
          clearable={false}
          size="sm"
          disabled={isSearching}
        />
      </div>
    </Popover>
  )
}
