'use client'

import { useState } from 'react'
import { Button } from 'ui/src/atoms/button'
import { Checkbox } from 'ui/src/molecules/checkbox'
import { Dialog } from 'ui/src/molecules/dialog'
import { RangeSlider } from 'ui/src/molecules/range-slider'
import { type FilterConfig, activeFilterConfig } from '../data/filter-config'
import { mockProducts } from '../data/mock-products'
import { getColorHex } from '../utils/color-map'
import {
  type FilterState,
  calculateProductCounts,
  getColorsWithCounts,
  getSizesWithCounts,
} from '../utils/product-filters'
import { ColorSwatch } from './atoms/color-swatch'
import { FilterSection } from './molecules/filter-section'


interface ProductFiltersProps {
  className?: string
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  hideCategories?: boolean
}

export function ProductFilters({
  className,
  filters,
  onFiltersChange,
  hideCategories = false,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const filterConfig = activeFilterConfig // Use active configuration

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({
      ...filters,
      ...updates,
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      priceRange: [0, 300],
      categories: new Set(),
      sizes: new Set(),
      colors: new Set(),
    })
  }

  const hasActiveFilters =
    filters.categories.size > 0 ||
    filters.sizes.size > 0 ||
    filters.colors.size > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 300

  // Get product counts using utility functions
  const productCounts = calculateProductCounts(mockProducts)
  const sizesWithCounts = getSizesWithCounts(mockProducts)
  const colorsWithCounts = getColorsWithCounts(mockProducts)

  // Get color hex values from products
  const colorHexMap = new Map<string, string>()
  mockProducts.forEach((product) => {
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
            className='space-y-product-filters-item-gap'
            renderItem={(category) => {
              const isDisabled = category.count === 0
              return (
                <Checkbox
                  key={category.handle}
                  id={`category-${category.handle}`}
                  name="categories"
                  value={category.handle}
                  labelText={`${category.name} (${category.count})`}
                  checked={filters.categories.has(category.handle)}
                  disabled={isDisabled}
                  onCheckedChange={(details) => {
                    const { checked } = details
                    const newCategories = new Set(filters.categories)
                    if (checked === true) {
                      newCategories.add(category.handle)
                    } else {
                      newCategories.delete(category.handle)
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
              value={filters.priceRange}
              onChange={(value) =>
                updateFilters({ priceRange: value as [number, number] })
              }
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
                {filters.priceRange[0]}
              </span>
              <span className="text-product-filters-range-label text-sm">
                to
              </span>
              <span className="font-product-filters-range-value text-product-filters-range-value text-sm">
                {config.range?.prefix}
                {filters.priceRange[1]}
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
            className='flex flex-wrap gap-2'
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
                  size='sm'
                  className='border rounded-sm'
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
            className='grid grid-cols-4 gap-2'
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

      default:
        return null
    }
  }

  const filterContent = (
    <>
      {/* Clear All Filters */}
      {hasActiveFilters && (
        <div className="mb-4 text-right">
          <Button theme='borderless' onClick={clearAllFilters} className='text-sm text-primary hover:underline cursor-pointer'>
            Clear all filters
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
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
        className='md:hidden flex items-center gap-product-filters-mobile-btn-gap mb-product-filters-mobile-btn-margin'
        icon="icon-[mdi--filter-variant]"
      >
        Filters
      </Button>

      {/* Desktop Filters */}
      <div className='hidden md:block'>{filterContent}</div>

      {/* Mobile Filter Dialog */}
      <div className='md:hidden'>
      <Dialog
        open={isOpen}
        onOpenChange={({ open }) => setIsOpen(open)}
        title="Filters"
        description="Refine your product search"
      >
        <div className='p-product-filters-dialog-padding'>
          <div className='flex items-center justify-between mb-product-filters-dialog-header-margin'>
            <h2 className='text-product-filters-dialog-title font-product-filters-dialog-title'>Filters</h2>
            <Button
              variant="tertiary"
              theme="borderless"
              size="sm"
              onClick={() => setIsOpen(false)}
              icon="icon-[mdi--close]"
            >
              Close
            </Button>
          </div>
          {filterContent}
          <div className="mt-product-filters-actions-margin flex gap-product-filters-actions-gap">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => {
                clearAllFilters()
                setIsOpen(false)
              }}
            >
              Clear All
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Dialog></div>
    </div>
  )
}
