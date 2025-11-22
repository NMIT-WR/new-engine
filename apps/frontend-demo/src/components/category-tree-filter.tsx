"use client"
import { type TreeNode, TreeView } from "@new-engine/ui/molecules/tree-view"
import { useCallback, useMemo, useState } from "react"
import { useAccordionTree } from "@/hooks/use-accordion-tree"
import { useCategoryPrefetch } from "@/hooks/use-category-prefetch"
import type { CategoryTreeNode } from "@/lib/server/categories"
import type { LeafCategory, LeafParent } from "@/lib/static-data/categories"
import {
  findNodeById,
  getLeafIdsForCategory,
  isSelectableCategory,
} from "@/utils/category-tree-helpers"

type CategoryFilterProps = {
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
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const { expandedNodes, handleAccordionExpansion } =
    useAccordionTree(categories)
  const { delayedPrefetch, prefetchCategoryProducts } = useCategoryPrefetch()
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
    const transformTreeForSelection = (nodes: CategoryTreeNode[]): TreeNode[] =>
      nodes.map((node) => ({
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
    return transformTreeForSelection(categories)
  }, [categories, leafCategoryIds, leafParentIds])

  const handleSelectionChange = (details: { selectedValue: string[] }) => {
    // In single mode, selectedValue is still an array but with max 1 item
    const selectedCategoryId = details.selectedValue?.[0]

    if (selectedCategoryId) {
      // Cancel all pending prefetches since user made a selection
      // cancelAllPrefetches()

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
      const finalExpanded = handleAccordionExpansion(details)

      // Find which nodes were newly expanded
      const newlyExpanded = finalExpanded.filter(
        (nodeId: string) => !expandedNodes.includes(nodeId)
      )

      // Process each newly expanded node
      for (const nodeId of newlyExpanded) {
        // 1. LEAF CATEGORY - nothing to prefecth
        if (leafCategoryIds.has(nodeId)) {
          continue
        }

        // 2. LEAF PARENT CATEGORY - prefetch direct children only
        if (leafParentIds.has(nodeId)) {
          const expandedParentLeaf = leafParents.find((p) => p.id === nodeId)
          if (!expandedParentLeaf) {
            continue
          }

          //console.log(`[Prefetch] Expanding parentLeaf: ${expandedParentLeaf.name}`)
          for (const childId of expandedParentLeaf.children || []) {
            if (leafCategoryIds.has(childId)) {
              // Direct leaf child - prefetch individually with delay
              delayedPrefetch([childId], 800, `leaf_${childId}`)
            } else if (leafParentIds.has(childId)) {
              // Direct parentLeaf child - prefetch limited children, not all leafs
              const childParentLeaf = leafParents.find((p) => p.id === childId)
              if (childParentLeaf) {
                const children = childParentLeaf.children
                if (children.length > 0) {
                  delayedPrefetch(children, 800, `parent_leaf_${childId}`)
                }
              }
            }
          }

          continue
        }

        // 3. Standard category (non-selectable) - prefetch selectable children
        const expandedNode = findNodeById(categories, nodeId)
        if (expandedNode?.children) {
          // console.log(`[Prefetch] Expanding standard category: ${expandedNode.name}`)

          // Process each direct child
          for (const child of expandedNode.children) {
            if (leafParentIds.has(child.id)) {
              // Child is a parentLeaf - prefetch limited children instead of all leafs
              const childParentLeaf = leafParents.find((p) => p.id === child.id)
              if (childParentLeaf) {
                /*console.log(
                  `[Prefetch] - ParentLeaf child "${childParentLeaf.name}": ${childParentLeaf.leafs.length} leafs`
                )*/
                prefetchCategoryProducts(childParentLeaf.leafs)
              }
            }
          }
        }
      }
    },
    [
      expandedNodes,
      handleAccordionExpansion,
      leafParents,
      leafCategoryIds,
      leafParentIds,
      categories,
      delayedPrefetch,
      prefetchCategoryProducts,
    ]
  )

  return (
    <TreeView
      data={treeData}
      expandedValue={expandedNodes}
      expandOnClick={true}
      id="category-filter-v2"
      label={label}
      onExpandedChange={handleExpandedChange}
      onSelectionChange={handleSelectionChange}
      selectedValue={selectedCategory ? [selectedCategory] : []}
      selectionMode="single"
      showIndentGuides={false}
      showNodeIcons={false}
    />
  )
}

CategoryTreeFilter.displayName = "CategoryTreeFilter"
