'use client'
import type { CategoryTreeNode } from '@/data/static/type'
import { transformToTree } from '@/utils/transform/transform-to-tree'
import { TreeView } from '@new-engine/ui/molecules/tree-view'
import { useMemo } from 'react'

interface N1AsideProps {
  categories: CategoryTreeNode[]
  label?: string
}

export function N1Aside({ categories, label }: N1AsideProps) {
  const treeData = useMemo(() => {
    return transformToTree(categories)
  }, [categories])

  return (
    <aside>
      <TreeView
        className="w-3xs border-t-2 border-t-overlay p-200"
        data={treeData}
        selectionMode="single"
      >
        <TreeView.Label>{label}</TreeView.Label>
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
