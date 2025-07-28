'use client'
import { useCategoryPrefetch } from '@/hooks/use-category-prefetch'
import type { CategoryTreeNode } from '@/lib/server/categories'
import type { LeafCategory, LeafParent } from '@/lib/static-data/categories'
import {
  findNodeById,
  getLeafIdsForCategory,
  isSelectableCategory,
} from '@/utils/category-tree-helpers'
import { type TreeNode, TreeView } from '@ui/molecules/tree-view'
import { useCallback, useMemo, useState } from 'react'

interface CategoryFilterProps {
  categories: CategoryTreeNode[]
  leafCategories: LeafCategory[]
  leafParents: LeafParent[]
  onSelectionChange: (categoryIds: string[]) => void
  label?: string
}

export function CategoryTreeFilter({
  categories,
  leafCategories,
  leafParents,
  onSelectionChange,
  label,
}: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [expandedNodes, setExpandedNodes] = useState<string[]>([])
  const { prefetchCategoryProducts } = useCategoryPrefetch()
  // Create Sets for quick lookup
  const leafCategoryIds = useMemo(
    () => new Set(leafCategories.map((cat) => cat.id)),
    [leafCategories]
  )
  const leafParentIds = useMemo(
    () => new Set(leafParents.map((cat) => cat.id)),
    [leafParents]
  )

  // Transform static category data for TreeView
  const treeData = useMemo(() => {
    const transformTreeForSelection = (
      nodes: CategoryTreeNode[]
    ): TreeNode[] => {
      return nodes.map((node) => ({
        id: node.id,
        name: node.name,
        children: node.children
          ? transformTreeForSelection(node.children)
          : undefined,
        selectable: isSelectableCategory(
          node.id,
          leafCategoryIds,
          leafParentIds
        ),
      }))
    }
    return transformTreeForSelection(categories)
  }, [categories, leafCategoryIds, leafParentIds])

  const handleSelectionChange = (details: { selectedValue: string[] }) => {
    // In single mode, selectedValue is still an array but with max 1 item
    const selectedCategoryId = details.selectedValue?.[0]

    if (selectedCategoryId) {
      setSelectedCategory(selectedCategoryId)

      // Get leaf IDs and notify parent
      const leafIds = getLeafIdsForCategory(
        selectedCategoryId,
        leafCategoryIds,
        leafParentIds,
        leafParents
      )
      onSelectionChange(leafIds)
    }
  }

  // Handle expanded change events from TreeView
  const handleExpandedChange = useCallback(
    (details: { expandedValue: string[] }) => {
      const newExpandedNodes = details.expandedValue || []

      // Find which nodes were newly expanded
      const newlyExpanded = newExpandedNodes.filter(
        (nodeId: string) => !expandedNodes.includes(nodeId)
      )

      // Process each newly expanded node
      for (const nodeId of newlyExpanded) {
        // 1. LEAF CATEGORY - nothing to prefecth
        if (leafCategoryIds.has(nodeId)) {
          continue
        }

        // 2. LEAF PARENT CATEGORY - prefetch all sub tree
        if (leafParentIds.has(nodeId)) {
          const leafParent = leafParents.find((p) => p.id === nodeId)
          if (leafParent) {
            prefetchCategoryProducts(leafParent.leafs)
          }
          continue
        }

        // 3. Standard category (non-selectable) - prefetch selectable children
        const expandedNode = findNodeById(categories, nodeId)
        if (expandedNode?.children) {
          const selectableChildren = expandedNode.children.filter((child) =>
            isSelectableCategory(child.id, leafCategoryIds, leafParentIds)
          )

          const allLeafIds = selectableChildren.flatMap((child) =>
            getLeafIdsForCategory(
              child.id,
              leafCategoryIds,
              leafParentIds,
              leafParents
            )
          )

          if (allLeafIds.length > 0) {
            prefetchCategoryProducts(allLeafIds)
          }
        }
      }

      // Update state
      setExpandedNodes(newExpandedNodes)
    },
    [
      expandedNodes,
      leafParents,
      leafCategoryIds,
      leafParentIds,
      categories,
      prefetchCategoryProducts,
    ]
  )

  return (
    <TreeView
      id="category-filter-v2"
      data={treeData}
      label={label}
      selectionMode="single"
      selectedValue={selectedCategory ? [selectedCategory] : []}
      showNodeIcons={false}
      onSelectionChange={handleSelectionChange}
      onExpandedChange={handleExpandedChange}
      expandOnClick={true}
    />
  )
}

CategoryTreeFilter.displayName = 'CategoryTreeFilter'
