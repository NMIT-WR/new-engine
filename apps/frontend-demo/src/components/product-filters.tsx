'use client'

import { useState } from 'react'
import { Button } from 'ui/src/atoms/button'
import { Checkbox } from 'ui/src/molecules/checkbox'
import { Dialog } from 'ui/src/molecules/dialog'
import { RangeSlider } from 'ui/src/molecules/range-slider'
import { tv } from 'ui/src/utils'
import { categories } from '../data/mock-products'

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

interface ProductFiltersProps {
  className?: string
}

export function ProductFilters({ className }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const styles = productFiltersVariants()

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
            >
              {category.name} ({category.count})
            </Checkbox>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className={styles.section()}>
        <h3 className={styles.title()}>Price Range</h3>
        <RangeSlider
          defaultValue={[0, 200]}
          min={0}
          max={300}
          step={10}
          minStepsBetweenThumbs={10}
          formatValue={(value) => `€${value}`}
        />
        <div className="mt-product-filters-range-margin flex justify-between">
          <span className="text-product-filters-range-value font-product-filters-range-value text-sm">€0</span>
          <span className="text-product-filters-range-label text-sm">to</span>
          <span className="text-product-filters-range-value font-product-filters-range-value text-sm">€200</span>
        </div>
      </div>

      {/* Size Filter */}
      <div className={styles.section()}>
        <h3 className={styles.title()}>Size</h3>
        <div className={styles.filterList()}>
          {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
            <Checkbox key={size} id={`size-${size}`} name="sizes" value={size}>
              {size}
            </Checkbox>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className={styles.section()}>
        <h3 className={styles.title()}>Color</h3>
        <div className={styles.filterList()}>
          {['Black', 'White', 'Grey', 'Blue', 'Brown'].map((color) => (
            <Checkbox
              key={color}
              id={`color-${color}`}
              name="colors"
              value={color}
            >
              {color}
            </Checkbox>
          ))}
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
                // Reset filters logic
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
