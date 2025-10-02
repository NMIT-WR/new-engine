'use client'
import type { CategoryTreeNode } from '@/data/static/type'
import { transformToTree } from '@/utils/transform/transform-to-tree'
import { TreeView } from '@new-engine/ui/molecules/tree-view'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

interface N1AsideProps {
  categories: CategoryTreeNode[]
  label?: string
}

export function N1Aside({ categories, label }: N1AsideProps) {
  const router = useRouter()
  const treeData = useMemo(() => {
    return transformToTree(categories)
  }, [categories])

  const handleSelect = (details: any) => {
    if (details.focusedValue) {
      // Find handle in treeData (recursively search through children)
      const findNodeHandle = (
        nodes: typeof treeData,
        id: string
      ): string | null => {
        for (const node of nodes) {
          if (node.id === id) return node.handle as string
          if (node.children) {
            const found = findNodeHandle(node.children, id)
            if (found) return found
          }
        }
        return null
      }

      const handle = findNodeHandle(treeData, details.focusedValue)

      if (handle) {
        router.push(`/${handle}`)
      }
    }
  }

  return (
    <aside>
      <TreeView
        className="w-3xs border-t-2 border-t-overlay p-200"
        data={treeData}
        selectionMode="single"
        onSelectionChange={handleSelect}
      >
        <TreeView.Label className="capitalize">{label}</TreeView.Label>
        <TreeView.Tree>
          {treeData?.map((node, index) => (
            <TreeView.Node
              showNodeIcons={false}
              key={node.id}
              node={node}
              indexPath={[index]}
            />
          ))}
        </TreeView.Tree>
      </TreeView>
    </aside>
  )
}
