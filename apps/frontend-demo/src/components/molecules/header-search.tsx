'use client'
import { useDebounce } from '@/hooks/use-debounce'
import { useProducts } from '@/hooks/use-products'
import type { Product } from '@/types/product'
import { Icon } from '@ui/atoms/icon'
import { Combobox, type ComboboxItem } from '@ui/molecules/combobox'
import { Popover } from '@ui/molecules/popover'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export function HeaderSearch() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedValue, setSelectedValue] = useState<string[]>([])
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const containerRef = useRef<HTMLDivElement>(null)

  // Get products from database
  const { products, isLoading } = useProducts()

  // Filter products based on search query
  const filteredProducts =
    debouncedSearchQuery && products
      ? products
          .filter((product) => {
            const query = debouncedSearchQuery.toLowerCase()
            return (
              product.title.toLowerCase().includes(query) ||
              product.description?.toLowerCase().includes(query) ||
              product.handle.toLowerCase().includes(query)
            )
          })
          .slice(0, 6) // Limit to 6 results for better UX
      : []

  // Create combobox items
  const searchItems: ComboboxItem<Product>[] = filteredProducts.map(
    (product) => ({
      value: product.handle,
      label: product.title,
      data: product,
    })
  )

  // Add "View all results" option if there's a search query
  if (searchQuery && filteredProducts.length > 0) {
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
      contentClassName="z-50"
    >
      <div ref={containerRef}>
        <Combobox
          placeholder={
            isLoading ? 'Načítání produktů...' : 'Hledat produkty...'
          }
          items={searchItems}
          value={selectedValue}
          onChange={handleSelect}
          onInputValueChange={setSearchQuery}
          allowCustomValue={true}
          closeOnSelect
          clearable={false}
          size="sm"
          disabled={isLoading}
        />
      </div>
    </Popover>
  )
}
