'use client'

import { useCategoryPrefetch } from '@/hooks/use-category-prefetch'
import type { CategoryTreeNode } from '@/lib/server/categories'
import type { LeafCategory, LeafParent } from '@/lib/static-data/categories'
import { getDirectChildren } from '@/utils/category-tree-helpers'
import { type TreeNode, TreeView } from '@ui/molecules/tree-view'
import { useCallback, useMemo, useState } from 'react'

interface CategoryFilterProps {
  // Data
  categories: CategoryTreeNode[]
  leafCategories: LeafCategory[]
  leafParents: LeafParent[]

  // Callbacks
  onSelectionChange: (categoryIds: string[]) => void

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

export function CategoryTreeFilter({
  categories,
  leafCategories,
  leafParents,
  onSelectionChange,
  selectionMode = 'multiple',
  label,
  className,
}: CategoryFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [expandedNodes, setExpandedNodes] = useState<string[]>([])
  const { prefetchForCategory } = useCategoryPrefetch()

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

  // Handle prefetching when categories are expanded
  const handlePrefetchCategories = useCallback(
    (nodeId: string, isExpanded: boolean) => {
      if (!isExpanded) return

      // Get direct children of the expanded node
      const children = getDirectChildren(nodeId, categories)

      if (children.length > 0) {
        console.log(
          `📂 Expanding category, prefetching ${children.length} children`
        )
      }

      children.forEach((child) => {
        // Use the prefetchForCategory function which handles leaf/leafParent logic
        prefetchForCategory(
          child.id,
          leafCategoryIds,
          leafParentIds,
          leafParents
        )
      })
    },
    [
      categories,
      leafCategoryIds,
      leafParentIds,
      leafParents,
      prefetchForCategory,
    ]
  )

  // Handle expanded change events from TreeView
  const handleExpandedChange = useCallback(
    (details: any) => {
      const newExpandedNodes = details.expandedValue || []
      
      // Find which node was newly expanded
      const newlyExpanded = newExpandedNodes.filter(
        (nodeId: string) => !expandedNodes.includes(nodeId)
      )
      
      // Prefetch for each newly expanded node
      newlyExpanded.forEach((nodeId: string) => {
        handlePrefetchCategories(nodeId, true)
      })
      
      // Update state
      setExpandedNodes(newExpandedNodes)
    },
    [expandedNodes, handlePrefetchCategories]
  )

  return (
    <TreeView
      id="category-filter-v2"
      data={treeData}
      label={label}
      selectionMode={selectionMode}
      selectedValue={selectedCategories}
      showNodeIcons={false}
      onSelectionChange={handleSelectionChange}
      onExpandedChange={handleExpandedChange}
      expandOnClick={true}
      className={className}
    />
  )
}

CategoryTreeFilter.displayName = 'CategoryTreeFilter'
