'use client'

import { useState } from 'react'
import { Button } from 'ui/src/atoms/button'
import { Icon } from 'ui/src/atoms/icon'
import { Checkbox } from 'ui/src/molecules/checkbox'
import { Dialog } from 'ui/src/molecules/dialog'
import { RangeSlider } from 'ui/src/molecules/range-slider'
import { TreeView } from 'ui/src/molecules/tree-view'
import { tv } from 'ui/src/utils'
import { categories, mockProducts } from '../data/mock-products'
import {
  type FilterState,
  calculateProductCounts,
  getColorsWithCounts,
  getSizesWithCounts,
} from '../utils/product-filters'

const productFiltersVariants = tv({
  slots: {
    root: 'w-full',
    mobileButton: 'md:hidden flex items-center gap-product-filters-mobile-btn-gap mb-product-filters-mobile-btn-margin',
    desktopFilters: 'hidden md:block',
    section: 'mb-product-filters-section-margin',
    title:
      'text-product-filters-title font-product-filters-title mb-product-filters-title-margin flex items-center justify-between',
    filterList: 'space-y-product-filters-item-gap',
    dialogContent: 'p-product-filters-dialog-padding',
    dialogHeader:
      'flex items-center justify-between mb-product-filters-dialog-header-margin',
    dialogTitle:
      'text-product-filters-dialog-title font-product-filters-dialog-title',
    clearButton: 'text-sm text-primary hover:underline cursor-pointer',
    colorGrid: 'grid grid-cols-4 gap-2',
    colorSwatch: 'group relative w-10 h-10 rounded-full border-2 transition-all cursor-pointer',
    sizeGrid: 'flex flex-wrap gap-2',
    sizeButton: 'px-3 py-1.5 border rounded transition-all text-sm',
    viewMore: 'text-sm text-primary hover:underline cursor-pointer mt-2',
  },
})

interface ProductFiltersProps {
  className?: string
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function ProductFilters({
  className,
  filters,
  onFiltersChange,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showAllSizes, setShowAllSizes] = useState(false)
  const [showAllColors, setShowAllColors] = useState(false)
  const styles = productFiltersVariants()

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
  mockProducts.forEach(product => {
    product.variants?.forEach(variant => {
      const color = variant.options?.color
      if (color && variant.colorHex) {
        colorHexMap.set(color.toLowerCase(), variant.colorHex)
      }
    })
  })

  // Limit visible items when collapsed
  const visibleSizes = showAllSizes ? sizesWithCounts : sizesWithCounts.slice(0, 8)
  const visibleColors = showAllColors ? colorsWithCounts : colorsWithCounts.slice(0, 8)

  const filterContent = (
    <>
      {/* Clear All Filters */}
      {hasActiveFilters && (
        <div className="mb-4 text-right">
          <button
            onClick={clearAllFilters}
            className={styles.clearButton()}
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Categories with Tree View */}
      <div className={styles.section()}>
        <h3 className={styles.title()}>Categories</h3>
        <div className={styles.filterList()}>
          {/* For now, using checkboxes but could be replaced with TreeView for hierarchical categories */}
          {productCounts.categoryCounts.map((category) => {
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
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className={styles.section()}>
        <h3 className={styles.title()}>Price Range</h3>
        <RangeSlider
          value={filters.priceRange}
          onChange={(value) =>
            updateFilters({ priceRange: value as [number, number] })
          }
          min={0}
          max={300}
          step={10}
          minStepsBetweenThumbs={0}
          formatValue={(value) => `€${value}`}
        />
        <div className="mt-product-filters-range-margin flex justify-between">
          <span className="font-product-filters-range-value text-product-filters-range-value text-sm">
            €{filters.priceRange[0]}
          </span>
          <span className="text-product-filters-range-label text-sm">to</span>
          <span className="font-product-filters-range-value text-product-filters-range-value text-sm">
            €{filters.priceRange[1]}
          </span>
        </div>
      </div>

      {/* Size Filter with Buttons */}
      <div className={styles.section()}>
        <h3 className={styles.title()}>Size</h3>
        <div className={styles.sizeGrid()}>
          {visibleSizes.map(({ size, count }) => {
            const isSelected = filters.sizes.has(size)
            const isDisabled = count === 0
            
            return (
              <button
                key={size}
                onClick={() => {
                  const newSizes = new Set(filters.sizes)
                  if (isSelected) {
                    newSizes.delete(size)
                  } else {
                    newSizes.add(size)
                  }
                  updateFilters({ sizes: newSizes })
                }}
                disabled={isDisabled}
                className={`
                  ${styles.sizeButton()}
                  ${isSelected
                    ? 'border-primary bg-primary text-white'
                    : isDisabled
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                title={`${size} (${count} products)`}
              >
                {size}
              </button>
            )
          })}
        </div>
        {sizesWithCounts.length > 8 && (
          <button
            onClick={() => setShowAllSizes(!showAllSizes)}
            className={styles.viewMore()}
          >
            {showAllSizes ? 'Show less' : `Show ${sizesWithCounts.length - 8} more`}
          </button>
        )}
      </div>

      {/* Color Filter with Swatches */}
      <div className={styles.section()}>
        <h3 className={styles.title()}>Color</h3>
        <div className={styles.colorGrid()}>
          {visibleColors.map(({ color, count }) => {
            const isSelected = filters.colors.has(color)
            const isDisabled = count === 0
            const colorHex = colorHexMap.get(color.toLowerCase()) || '#ccc'
            
            return (
              <button
                key={color}
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
                disabled={isDisabled}
                className={`
                  ${styles.colorSwatch()}
                  ${isSelected ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-gray-300'}
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
                `}
                title={`${color} (${count} products)`}
              >
                <span
                  className="absolute inset-1 rounded-full"
                  style={{ backgroundColor: colorHex }}
                />
                {isSelected && (
                  <Icon
                    icon="icon-[mdi--check]"
                    className="absolute inset-0 m-auto text-white mix-blend-difference z-10"
                  />
                )}
              </button>
            )
          })}
        </div>
        {colorsWithCounts.length > 8 && (
          <button
            onClick={() => setShowAllColors(!showAllColors)}
            className={styles.viewMore()}
          >
            {showAllColors ? 'Show less' : `Show ${colorsWithCounts.length - 8} more`}
          </button>
        )}
      </div>
    </>
  )

  return (
    <div className={`${styles.root()} ${className || ''}`}>
      {/* Mobile Filter Button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={styles.mobileButton()}
        icon="icon-[mdi--filter-variant]"
      >
        Filters
      </Button>

      {/* Desktop Filters */}
      <div className={styles.desktopFilters()}>{filterContent}</div>

      {/* Mobile Filter Dialog */}
      <Dialog
        open={isOpen}
        onOpenChange={({ open }) => setIsOpen(open)}
        title="Filters"
        description="Refine your product search"
      >
        <div className={styles.dialogContent()}>
          <div className={styles.dialogHeader()}>
            <h2 className={styles.dialogTitle()}>Filters</h2>
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
      </Dialog>
    </div>
  )
}
