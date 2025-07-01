'use client'

import { categoryTree } from '@/lib/static-data/categories'
import type { Product } from '@/types/product'
import { Button } from '@ui/atoms/button'
import { Dialog } from '@ui/molecules/dialog'
import { TreeView } from '@ui/molecules/tree-view'
import { useState } from 'react'
import { FilterSection } from '../molecules/filter-section'

export interface FilterState {
  categories: Set<string>
  sizes: Set<string>
}

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

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({
      ...filters,
      ...updates,
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      categories: new Set(),
      sizes: new Set(),
    })
  }

  const hasActiveFilters =
    filters.categories.size > 0 ||
    filters.sizes.size > 0

  // Count active filters for mobile button
  const activeFilterCount =
    filters.categories.size +
    filters.sizes.size

  const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2X']

  const renderCategories = () => {
    const selectedIds = Array.from(filters.categories) as string[]

    return (
      <FilterSection
        title="Kategorie"
        onClear={
          filters.categories.size > 0
            ? () => updateFilters({ categories: new Set() })
            : undefined
        }
      >
        {categoryTree.length > 0 && (
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

                const selectedValue = details.selectedValue?.[0]
                const currentSelection = Array.from(filters.categories)[0]
                
                if (!selectedValue || selectedValue === undefined || details.selectedValue.length === 0) {
                  updateFilters({ categories: new Set() })
                  return
                }
                
                if (!hasChildren(String(selectedValue))) {
                  if (currentSelection === String(selectedValue)) {
                    updateFilters({ categories: new Set() })
                  } else {
                    updateFilters({ categories: new Set([String(selectedValue)]) })
                  }
                }
              }}
              className="max-h-96 overflow-auto"
            />
          </>
        )}
      </FilterSection>
    )
  }

  const renderSizes = () => {
    return (
      <FilterSection
        title="Velikost"
        onClear={
          filters.sizes.size > 0
            ? () => updateFilters({ sizes: new Set() })
            : undefined
        }
      >
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const isSelected = filters.sizes.has(size)
            return (
              <Button
                key={size}
                theme={isSelected ? 'solid' : 'borderless'}
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
          })}
        </div>
      </FilterSection>
    )
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

      {/* Categories Filter */}
      {!hideCategories && renderCategories()}
      
      {/* Sizes Filter */}
      {renderSizes()}
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