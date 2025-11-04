'use client'
import type { Category, CategoryTreeNode } from '@/data/static/type'
import { usePrefetchOnHover } from '@/hooks/use-prefetch-on-hover'
import { findNodeById } from '@/utils/transform/find-node-by-id'
import { getCategoryPath } from '@/utils/transform/get-category-path'
import { transformToTree } from '@/utils/transform/transform-to-tree'
import { TreeView } from '@new-engine/ui/molecules/tree-view'
import type { TreeView as TreeType } from '@new-engine/ui/types-zag'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

interface N1AsideProps {
  categories: CategoryTreeNode[]
  categoryMap: Record<string, Category>
  label?: string
  currentCategory?: Category
}

export function N1Aside({
  categories,
  categoryMap,
  label,
  currentCategory,
}: N1AsideProps) {
  const router = useRouter()
  const treeData = useMemo(() => {
    return transformToTree(categories)
  }, [categories])
  const { handleHover, cancelHover } = usePrefetchOnHover()

  const expandedPath = getCategoryPath(currentCategory, categoryMap)

  const handleSelect = (details: TreeType.SelectionChangeDetails) => {
    if (details.focusedValue) {
      const node = findNodeById(treeData, details.focusedValue)
      if (node) {
        router.push(`/kategorie/${node.handle}`)
      }
    }
  }

  const prefetchOnHover = (handle: string) => {
    handleHover(handle)
  }

  return (
    <aside onMouseLeave={cancelHover}>
      <TreeView
        className="w-3xs border-t-2 border-t-overlay p-200"
        data={treeData}
        selectionMode="single"
        onSelectionChange={handleSelect}
        defaultExpandedValue={expandedPath}
      >
        <TreeView.Label className="capitalize">{label}</TreeView.Label>
        <TreeView.Tree>
          {treeData?.map((node, index) => (
            <TreeView.Node
              showNodeIcons={false}
              key={node.id}
              node={node}
              indexPath={[index]}
              onTriggerHover={() => prefetchOnHover(node.handle as string)}
            />
          ))}
        </TreeView.Tree>
      </TreeView>
    </aside>
  )
}
