'use client'

import type { CategoryTreeNode } from '@/lib/server/categories'
import type { LeafCategory, LeafParent } from '@/lib/static-data/categories'
import { type TreeNode, TreeView } from '@ui/molecules/tree-view'
import { useMemo, useState } from 'react'

interface CategoryFilterProps {
  // Data
  categories: CategoryTreeNode[]
  leafCategories: LeafCategory[]
  leafParents: LeafParent[]

  // Callbacks
  onSelectionChange: (categoryIds: string[]) => void
  onCategoryHover?: (categoryIds: string[]) => void

  // UI Options
  selectionMode?: 'single' | 'multiple'
  showOnlySelectableNodes?: boolean
  defaultExpandedIds?: string[]

  // Labels/Content
  label?: string
  emptyMessage?: string

  // Styling
  className?: string
}

export function CategoryFilter({
  categories,
  leafCategories,
  leafParents,
  onSelectionChange,
  onCategoryHover,
  selectionMode = 'multiple',
  label,
  className,
}: CategoryFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Create Sets for quick lookup
  const leafCategoryIds = useMemo(
    () => new Set(leafCategories.map((cat) => cat.id)),
    [leafCategories]
  )

  const leafParentIds = useMemo(
    () => new Set(leafParents.map((cat) => cat.id)),
    [leafParents]
  )

  // Transform categoryTree to add selection info
  const transformTreeForSelection = (nodes: CategoryTreeNode[]): TreeNode[] => {
    return nodes.map((node) => ({
      id: node.id,
      name: node.name,
      children: node.children
        ? transformTreeForSelection(node.children)
        : undefined,
      selectable: leafCategoryIds.has(node.id) || leafParentIds.has(node.id),
    }))
  }

  const treeData = useMemo(
    () => transformTreeForSelection(categories),
    [categories, leafCategoryIds, leafParentIds]
  )

  // Get all category IDs based on selection
  const getCategoryIds = (selection: string[]): string[] => {
    if (!selection || selection.length === 0) return []

    const allCategoryIds: string[] = []

    selection.forEach((catId) => {
      if (leafCategoryIds.has(catId)) {
        // It's a leaf - just add it
        allCategoryIds.push(catId)
      } else if (leafParentIds.has(catId)) {
        // It's a leaf parent - add all its children
        const parent = leafParents.find((p) => p.id === catId)
        if (parent) {
          allCategoryIds.push(...parent.children)
        }
      }
    })

    // Remove duplicates
    return Array.from(new Set(allCategoryIds))
  }

  const handleSelectionChange = (details: any) => {
    console.log('Selection changed:', details)

    // TreeView v multiple mode vrací selectedValue array
    const newSelection = details.selectedValue || []

    if (
      leafCategoryIds.has(details.focusedValue) ||
      leafParentIds.has(details.focusedValue)
    ) {
      const filteredSelection = newSelection.filter(
        (id: string) => leafCategoryIds.has(id) || leafParentIds.has(id)
      )

      setSelectedCategories(filteredSelection)

      // Get final category IDs and notify parent
      const categoryIds = getCategoryIds(filteredSelection)
      onSelectionChange(categoryIds)
    }
  }

  return (
    <TreeView
      id="category-filter-v2"
      data={treeData}
      label={label}
      selectionMode={selectionMode}
      selectedValue={selectedCategories}
      showNodeIcons={false}
      onSelectionChange={handleSelectionChange}
      expandOnClick={true}
      className={className}
    />
  )
}

CategoryFilter.displayName = 'CategoryFilter'
