'use client'

import { type FilterConfig, activeFilterConfig } from '@/data/filter-config'
import { useCategoryTree } from '@/hooks/use-categories'
import { useDebouncedCallback } from '@/hooks/use-debounce'
import type { Product } from '@/types/product'
import { getColorHex } from '@/utils/color-map'
import {
  type FilterState,
  calculateProductCounts,
  getColorsWithCounts,
  getSizesWithCounts,
} from '@/utils/product-filters'
import { Button } from '@ui/atoms/button'
import { Checkbox } from '@ui/molecules/checkbox'
import { Dialog } from '@ui/molecules/dialog'
import { RangeSlider } from '@ui/molecules/range-slider'
import { TreeView } from '@ui/molecules/tree-view'
import { useEffect, useState } from 'react'
import { ColorSwatch } from '@/components/atoms/color-swatch'
import { FilterSection } from '../molecules/filter-section'

interface ProductFiltersProps {
  className?: string
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  hideCategories?: boolean
  products?: Product[]
}

export function ProductFilters({
  className,
  filters,
  onFiltersChange,
  hideCategories = false,
  products = [],
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localPriceRange, setLocalPriceRange] = useState(filters.priceRange)
  const [localDiscountRange, setLocalDiscountRange] = useState(
    filters.discountRange || [0, 100]
  )
  const filterConfig = activeFilterConfig // Use active configuration
  const { tree: categoryTree, isLoading: categoriesLoading } = useCategoryTree()

  // Sync local state with props
  useEffect(() => {
    setLocalPriceRange(filters.priceRange)
    setLocalDiscountRange(filters.discountRange || [0, 100])
  }, [filters.priceRange, filters.discountRange])

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({
      ...filters,
      ...updates,
    })
  }

  // Debounced update for price range
  const debouncedPriceUpdate = useDebouncedCallback(
    (value: [number, number]) => {
      updateFilters({ priceRange: value })
    },
    500
  )

  // Debounced update for discount range
  const debouncedDiscountUpdate = useDebouncedCallback(
    (value: [number, number]) => {
      updateFilters({ discountRange: value })
    },
    500
  )

  const clearAllFilters = () => {
    onFiltersChange({
      priceRange: [0, 300],
      categories: new Set(),
      sizes: new Set(),
      colors: new Set(),
      onSale: false,
      discountRange: [0, 100],
    })
  }

  const hasActiveFilters =
    filters.categories.size > 0 ||
    filters.sizes.size > 0 ||
    filters.colors.size > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 300 ||
    filters.onSale ||
    (filters.discountRange && filters.discountRange[0] > 0)

  // Count active filters for mobile button
  const activeFilterCount =
    filters.categories.size +
    filters.sizes.size +
    filters.colors.size +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 300 ? 1 : 0) +
    (filters.onSale ? 1 : 0)

  // Get product counts using utility functions
  const productCounts = calculateProductCounts(products)
  const sizesWithCounts = getSizesWithCounts(products)
  const colorsWithCounts = getColorsWithCounts(products)

  // Get color hex values from products
  const colorHexMap = new Map<string, string>()
  products.forEach((product) => {
    product.variants?.forEach((variant) => {
      const color = variant.options?.color
      if (color && variant.colorHex) {
        colorHexMap.set(color.toLowerCase(), variant.colorHex)
      }
    })
  })

  // Render filter based on config
  const renderFilter = (config: FilterConfig) => {
    switch (config.type) {
      case 'checkbox':
        // For categories, use TreeView instead of checkboxes
        if (config.id === 'categories') {

          // Get selected category IDs as array
          const selectedIds = Array.from(filters.categories) as string[]

          return (
            <FilterSection
              key={config.id}
              title={config.title}
              onClear={
                config.showClearButton && filters.categories.size > 0
                  ? () => updateFilters({ categories: new Set() })
                  : undefined
              }
            >
              {categoriesLoading ? (
                <div className="text-gray-500 text-sm">
                  Načítání kategorií...
                </div>
              ) : categoryTree.length > 0 ? (
                <>
                  <div className="text-xs text-gray-500 mb-2">
                    Tip: Filtry se aplikují pouze na koncové podkategorie
                  </div>
                  <TreeView
                    id="category-tree"
                    data={categoryTree as any}
                    selectionMode="single"
                    selectedValue={selectedIds}
                    defaultExpandedValue={[]}
                    expandOnClick={true}
                    showIndentGuides={true}
                    showNodeIcons={false}
                    onSelectionChange={(details) => {
                      // Helper function to check if a node has children
                      const hasChildren = (nodeId: string): boolean => {
                        const findNode = (nodes: any[]): any => {
                          for (const node of nodes) {
                            if (node.id === nodeId) return node
                            if (node.children) {
                              const found = findNode(node.children)
                              if (found) return found
                            }
                          }
                          return null
                        }
                        const node = findNode(categoryTree)
                        return node && node.children && node.children.length > 0
                      }

                      // Get the selected value (single selection mode returns array with one item)
                      const selectedValue = details.selectedValue?.[0]
                      
                      // Get currently selected category
                      const currentSelection = Array.from(filters.categories)[0]
                      
                      // Check if selection is empty (deselect happened)
                      if (!selectedValue || selectedValue === undefined || details.selectedValue.length === 0) {
                        // Nothing selected or deselected, clear filter
                        updateFilters({ categories: new Set() })
                        return
                      }
                      
                      // Check if it's a leaf node
                      if (!hasChildren(String(selectedValue))) {
                        // It's a leaf node
                        if (currentSelection === String(selectedValue)) {
                          // Clicking on already selected item - deselect it
                          updateFilters({ categories: new Set() })
                        } else {
                          // New selection - apply filter
                          updateFilters({ categories: new Set([String(selectedValue)]) })
                        }
                      }
                      // If it's not a leaf node, do nothing (just expand/collapse)
                    }}
                    className="max-h-96 overflow-auto"
                  />
                </>
              ) : (
                <div className="text-gray-500 text-sm">
                  Žádné kategorie nejsou k dispozici
                </div>
              )}
            </FilterSection>
          )
        }

        // Fallback for other checkbox filters (if any)
        return (
          <FilterSection
            key={config.id}
            title={config.title}
            items={productCounts.categoryCounts}
            defaultItemsShown={config.defaultItemsShown}
            onClear={
              config.showClearButton
                ? () => updateFilters({ categories: new Set() })
                : undefined
            }
            className="space-y-product-filters-item-gap"
            renderItem={(category) => {
              const isDisabled = category.count === 0
              return (
                <Checkbox
                  key={category.id}
                  id={`category-${category.id}`}
                  name="categories"
                  value={category.id}
                  labelText={`${category.name} (${category.count})`}
                  checked={filters.categories.has(category.id)}
                  disabled={isDisabled}
                  onCheckedChange={(details) => {
                    const { checked } = details
                    const newCategories = new Set(filters.categories)
                    if (checked === true) {
                      newCategories.add(category.id)
                    } else {
                      newCategories.delete(category.id)
                    }
                    updateFilters({ categories: newCategories })
                  }}
                />
              )
            }}
          />
        )

      case 'range':
        return (
          <FilterSection key={config.id} title={config.title}>
            <RangeSlider
              value={localPriceRange}
              onChange={(value) => {
                const newRange = value as [number, number]
                setLocalPriceRange(newRange)
                debouncedPriceUpdate(newRange)
              }}
              min={config.range?.min || 0}
              max={config.range?.max || 300}
              step={config.range?.step || 10}
              minStepsBetweenThumbs={0}
              formatValue={(value) =>
                `${config.range?.prefix || ''}${value}${config.range?.suffix || ''}`
              }
            />
            <div className="mt-product-filters-range-margin flex justify-between">
              <span className="font-product-filters-range-value text-product-filters-range-value text-sm">
                {config.range?.prefix}
                {localPriceRange[0]}
              </span>
              <span className="text-product-filters-range-label text-sm">
                do
              </span>
              <span className="font-product-filters-range-value text-product-filters-range-value text-sm">
                {config.range?.prefix}
                {localPriceRange[1]}
              </span>
            </div>
          </FilterSection>
        )

      case 'size':
        return (
          <FilterSection
            key={config.id}
            title={config.title}
            items={sizesWithCounts}
            defaultItemsShown={config.defaultItemsShown}
            onClear={
              config.showClearButton
                ? () => updateFilters({ sizes: new Set() })
                : undefined
            }
            className="flex flex-wrap gap-2"
            renderItem={({ size, count }) => {
              const isSelected = filters.sizes.has(size)
              const isDisabled = count === 0

              return (
                <Button
                  key={size}
                  theme={isSelected ? 'solid' : 'borderless'}
                  disabled={isDisabled}
                  onClick={() => {
                    const newSizes = new Set(filters.sizes)
                    if (isSelected) {
                      newSizes.delete(size)
                    } else {
                      newSizes.add(size)
                    }
                    updateFilters({ sizes: newSizes })
                  }}
                  size="sm"
                  className="rounded-sm border"
                >
                  {size}
                </Button>
              )
            }}
          />
        )

      case 'color':
        return (
          <FilterSection
            key={config.id}
            title={config.title}
            items={colorsWithCounts}
            defaultItemsShown={config.defaultItemsShown}
            onClear={
              config.showClearButton
                ? () => updateFilters({ colors: new Set() })
                : undefined
            }
            className="grid grid-cols-4 gap-2"
            renderItem={({ color, count }) => {
              const isSelected = filters.colors.has(color)
              const isDisabled = count === 0
              // First try to get color from product variants, then fall back to color map
              const colorHex =
                colorHexMap.get(color.toLowerCase()) || getColorHex(color)

              return (
                <ColorSwatch
                  key={color}
                  selected={isSelected}
                  disabled={isDisabled}
                  color={colorHex}
                  colorName={color}
                  onClick={() => {
                    if (!isDisabled) {
                      const newColors = new Set(filters.colors)
                      if (isSelected) {
                        newColors.delete(color)
                      } else {
                        newColors.add(color)
                      }
                      updateFilters({ colors: newColors })
                    }
                  }}
                />
              )
            }}
          />
        )

      case 'sale':
        return (
          <FilterSection key={config.id} title={config.title}>
            <div className="space-y-4">
              <Checkbox
                id="on-sale"
                name="onSale"
                value="true"
                labelText="Ve výprodeji"
                checked={filters.onSale || false}
                onCheckedChange={(details) => {
                  const isChecked = details.checked === true
                  if (isChecked) {
                    updateFilters({ onSale: true })
                  } else {
                    updateFilters({
                      onSale: false,
                      discountRange: [0, 100],
                    })
                    setLocalDiscountRange([0, 100])
                  }
                }}
              />
              {filters.onSale && (
                <div className="mt-4">
                  <label className="mb-2 block font-medium text-sm">
                    Rozsah slevy
                  </label>
                  <RangeSlider
                    value={localDiscountRange}
                    onChange={(value) => {
                      const newRange = value as [number, number]
                      setLocalDiscountRange(newRange)
                      debouncedDiscountUpdate(newRange)
                    }}
                    min={0}
                    max={100}
                    step={5}
                    minStepsBetweenThumbs={5}
                    formatValue={(value) => `${value}%`}
                    showValueText
                    markerCount={5}
                    showMarkers
                  />
                </div>
              )}
            </div>
          </FilterSection>
        )

      default:
        return null
    }
  }

  const filterContent = (
    <>
      {/* Clear All Filters */}
      {hasActiveFilters && (
        <div className="mb-4 text-right">
          <Button
            theme="borderless"
            onClick={clearAllFilters}
            className="cursor-pointer text-primary text-sm hover:underline"
          >
            Vymazat všechny filtry
          </Button>
        </div>
      )}

      {/* Render filters based on configuration */}
      {filterConfig
        .filter((config) => !(hideCategories && config.id === 'categories'))
        .map(renderFilter)}
    </>
  )

  return (
    <div className={`w-full ${className || ''}`}>
      {/* Mobile Filter Button */}
      <Button
        theme="outlined"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center md:hidden bg-surface"
        icon="icon-[mdi--filter-variant]"
      >
        Filtry
        {activeFilterCount > 0 && (
          <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-white text-xs">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {/* Desktop Filters */}
      <div className="hidden md:block">{filterContent}</div>

      {/* Mobile Filter Dialog */}
      <div className="hidden">
        <Dialog
          open={isOpen}
          onOpenChange={({ open }) => setIsOpen(open)}
          title="Filtry"
          description="Upřesněte hledání produktů"
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="font-semibold text-lg">
                Filtry
              </h2>
              <Button
                theme="borderless"
                size="sm"
                onClick={() => setIsOpen(false)}
                icon="icon-[mdi--close]"
                aria-label="Zavřít filtry"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {filterContent}
            </div>
            <div className="border-t p-4 flex gap-2">
              <Button
                theme="outlined"
                size="sm"
                className="flex-1"
                onClick={() => {
                  clearAllFilters()
                  setIsOpen(false)
                }}
              >
                Vymazat vše
              </Button>
              <Button
                theme="solid"
                size="sm"
                className="flex-1"
                onClick={() => setIsOpen(false)}
              >
                Použít filtry
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  )
}
