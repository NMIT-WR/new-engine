'use client'

import { useState } from 'react'
import { Button } from 'ui/src/atoms/button'
import { Checkbox } from 'ui/src/molecules/checkbox'
import { Dialog } from 'ui/src/molecules/dialog'
import { RangeSlider } from 'ui/src/molecules/range-slider'
import { tv } from 'ui/src/utils'
import { categories, mockProducts } from '../data/mock-products'

const productFiltersVariants = tv({
  slots: {
    root: 'w-full',
    mobileButton: 'md:hidden flex items-center gap-2 mb-4',
    desktopFilters: 'hidden md:block',
    section: 'mb-product-filters-section-margin',
    title:
      'text-product-filters-title font-product-filters-title mb-product-filters-title-margin',
    filterList: 'space-y-product-filters-item-gap',
    dialogContent: 'p-product-filters-dialog-padding',
    dialogHeader:
      'flex items-center justify-between mb-product-filters-dialog-header-margin',
    dialogTitle:
      'text-product-filters-dialog-title font-product-filters-dialog-title',
  },
})

export interface FilterState {
  priceRange: [number, number]
  categories: Set<string>
  sizes: Set<string>
  colors: Set<string>
}

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
  const styles = productFiltersVariants()

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({
      ...filters,
      ...updates,
    })
  }

  // Calculate counts for sizes
  const sizeCounts: Record<string, number> = {}
  mockProducts.forEach((product) => {
    if (product.variants) {
      product.variants.forEach((variant) => {
        if (variant.options?.size) {
          sizeCounts[variant.options.size] =
            (sizeCounts[variant.options.size] || 0) + 1
        }
      })
    }
  })

  // Calculate counts for colors
  const colorCounts: Record<string, number> = {}
  mockProducts.forEach((product) => {
    if (product.variants) {
      product.variants.forEach((variant) => {
        if (variant.options?.color) {
          colorCounts[variant.options.color] =
            (colorCounts[variant.options.color] || 0) + 1
        }
      })
    }
  })

  const filterContent = (
    <>
      {/* Categories */}
      <div className={styles.section()}>
        <h3 className={styles.title()}>Categories</h3>
        <div className={styles.filterList()}>
          {categories.map((category) => (
            <Checkbox
              key={category.id}
              id={`category-${category.id}`}
              name="categories"
              value={category.handle}
              labelText={`${category.name} (${category.count})`}
              checked={filters.categories.has(category.handle)}
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
          ))}
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

      {/* Size Filter */}
      <div className={styles.section()}>
        <h3 className={styles.title()}>Size</h3>
        <div className={styles.filterList()}>
          {['XS', 'S', 'M', 'L', 'XL'].map((size) => {
            const count = sizeCounts[size] || 0
            if (count === 0) return null
            return (
              <Checkbox
                key={size}
                id={`size-${size}`}
                name="sizes"
                value={size}
                labelText={`${size} (${count})`}
                checked={filters.sizes.has(size)}
                onCheckedChange={(details) => {
                  const { checked } = details
                  const newSizes = new Set(filters.sizes)
                  if (checked === true) {
                    newSizes.add(size)
                  } else {
                    newSizes.delete(size)
                  }
                  updateFilters({ sizes: newSizes })
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div className={styles.section()}>
        <h3 className={styles.title()}>Color</h3>
        <div className={styles.filterList()}>
          {['Black', 'White', 'Grey', 'Blue', 'Brown', 'Navy', 'Red'].map(
            (color) => {
              const count = colorCounts[color] || 0
              if (count === 0) return null
              return (
                <Checkbox
                  key={color}
                  id={`color-${color}`}
                  name="colors"
                  value={color}
                  labelText={`${color} (${count})`}
                  checked={filters.colors.has(color)}
                  onCheckedChange={(details) => {
                    const { checked } = details
                    const newColors = new Set(filters.colors)
                    if (checked === true) {
                      newColors.add(color)
                    } else {
                      newColors.delete(color)
                    }
                    updateFilters({ colors: newColors })
                  }}
                />
              )
            }
          )}
        </div>
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
          <div className="mt-6 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => {
                updateFilters({
                  priceRange: [0, 200],
                  categories: new Set(),
                  sizes: new Set(),
                  colors: new Set(),
                })
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
