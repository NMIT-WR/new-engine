'use client'
import { useCategories } from '@/hooks/use-categories-v2'
import { categoriesToTreeNodes } from '@/utils/category-tree'
import { TreeView } from '@ui/molecules/tree-view'

export default function TestCategoriesPage() {
  const { categories, isLoading, error } = useCategories()

  if (isLoading) return <div>Loading categories...</div>
  if (error) return <div>Error: {error}</div>

  const rootCategories = categories.filter(cat => !cat.parent_category_id)
  const treeData = categoriesToTreeNodes(rootCategories.length > 0 ? rootCategories : categories)

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Test Categories</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Stats:</h2>
        <ul>
          <li>Total categories: {categories.length}</li>
          <li>Root categories: {rootCategories.length}</li>
          <li>Tree nodes: {treeData.length}</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Root Categories:</h2>
        <ul>
          {rootCategories.map(cat => (
            <li key={cat.id}>{cat.name} ({cat.handle})</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Tree View:</h2>
        {treeData.length > 0 ? (
          <TreeView
            id="test-category-tree"
            data={treeData}
            selectionMode="multiple"
            defaultExpandedValue={[]}
            expandOnClick={true}
            showIndentGuides={true}
            showNodeIcons={false}
            className="max-h-96 overflow-auto"
          />
        ) : (
          <div>No tree data</div>
        )}
      </div>
    </div>
  )
}