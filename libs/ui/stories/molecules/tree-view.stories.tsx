import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Badge } from '../../src/atoms/badge'
import { Button } from '../../src/atoms/button'
import { TreeView, type TreeNode } from '../../src/molecules/tree-view'
import React from 'react'

const meta: Meta<typeof TreeView> = {
  title: 'Molecules/TreeView',
  component: TreeView,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A compound tree view component built with Zag.js. Provides flexible composition for creating file explorers, navigation menus, and hierarchical data displays.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TreeView>

// Sample data
const fileSystemData: TreeNode[] = [
  {
    id: 'src',
    name: 'src',
    children: [
      {
        id: 'components',
        name: 'components',
        children: [
          {
            id: 'atoms',
            name: 'atoms',
            children: [
              { id: 'button.tsx', name: 'button.tsx' },
              { id: 'input.tsx', name: 'input.tsx' },
              { id: 'icon.tsx', name: 'icon.tsx' },
            ],
          },
          {
            id: 'molecules',
            name: 'molecules',
            children: [
              { id: 'dialog.tsx', name: 'dialog.tsx' },
              { id: 'combobox.tsx', name: 'combobox.tsx' },
              { id: 'tree-comp.tsx', name: 'tree-comp.tsx' },
            ],
          },
        ],
      },
      {
        id: 'utils',
        name: 'utils',
        children: [
          { id: 'helpers.ts', name: 'helpers.ts' },
          { id: 'constants.ts', name: 'constants.ts' },
        ],
      },
      { id: 'index.ts', name: 'index.ts' },
    ],
  },
  {
    id: 'public',
    name: 'public',
    children: [
      { id: 'favicon.ico', name: 'favicon.ico' },
      { id: 'robots.txt', name: 'robots.txt' },
    ],
  },
  {
    id: 'package.json',
    name: 'package.json',
  },
  {
    id: 'README.md',
    name: 'README.md',
  },
]

const navigationData: TreeNode[] = [
  {
    id: 'home',
    name: 'Home',
    selectable: false,
  },
  {
    id: 'products',
    name: 'Products',
    selectable: false,
    children: [
      {
        id: 'electronics',
        name: 'Electronics',
        selectable: false,
        children: [
          { id: 'phones', name: 'Phones' },
          { id: 'laptops', name: 'Laptops' },
          { id: 'tablets', name: 'Tablets' },
        ],
      },
      {
        id: 'clothing',
        name: 'Clothing',
        selectable: false,
        children: [
          { id: 'mens', name: "Men's" },
          { id: 'womens', name: "Women's" },
          { id: 'kids', name: 'Kids' },
        ],
      },
    ],
  },
  {
    id: 'about',
    name: 'About Us',
  },
  {
    id: 'contact',
    name: 'Contact',
  },
]

// Basic usage with helper component
export const Default: Story = {
  render: () => (
      <TreeView data={fileSystemData} className='w-md' selectionMode="multiple">
        <TreeView.Label>File Explorer</TreeView.Label>
        <TreeView.Tree>
          {fileSystemData.map((node, index) => (
            <TreeView.Node
              key={node.id}
              node={node}
              indexPath={[index]}
              showIndentGuides
              showNodeIcons
            />
          ))}
        </TreeView.Tree>
      </TreeView>
  ),
}

// Full compound pattern with custom composition
export const CustomComposition: Story = {
  render: () => (
      <TreeView data={fileSystemData} className='w-md' selectionMode="multiple">
        <TreeView.Label>Project Structure</TreeView.Label>
        <TreeView.Tree>
          {fileSystemData.map((node, index) => {
            const RenderNode = ({ node, indexPath }: any) => (
              <TreeView.NodeProvider node={node} indexPath={indexPath}>
                {node.children ? (
                  <TreeView.Branch>
                    <TreeView.BranchTrigger>
                      <TreeView.BranchControl>
                        <TreeView.NodeIcon />
                        <TreeView.BranchText />
                        {node.children && (
                          <Badge variant="secondary" className="ml-xs">
                            {node.children.length}
                          </Badge>
                        )}
                      </TreeView.BranchControl>
                      <TreeView.BranchIndicator />
                    </TreeView.BranchTrigger>
                    <TreeView.BranchContent>
                      <TreeView.IndentGuide />
                      {node.children?.map((child, idx) => (
                        <RenderNode
                          key={child.id}
                          node={child}
                          indexPath={[...indexPath, idx]}
                        />
                      ))}
                    </TreeView.BranchContent>
                  </TreeView.Branch>
                ) : (
                  <TreeView.Item>
                    <TreeView.NodeIcon />
                    <TreeView.ItemText />
                    {node.name.endsWith('.tsx') && (
                      <Badge variant="info" className="ml-auto">
                        TSX
                      </Badge>
                    )}
                    {node.name.endsWith('.ts') && !node.name.endsWith('.tsx') && (
                      <Badge variant="warning" className="ml-auto">
                        TS
                      </Badge>
                    )}
                  </TreeView.Item>
                )}
              </TreeView.NodeProvider>
            )

            return <RenderNode key={node.id} node={node} indexPath={[index]} />
          })}
        </TreeView.Tree>
      </TreeView>
  ),
}

// Without indent guides and icons
export const Minimal: Story = {
  render: () => (
      <TreeView data={navigationData} selectionMode="single" className='w-xs'>
        <TreeView.Tree>
          {navigationData.map((node, index) => (
            <TreeView.Node
              key={node.id}
              node={node}
              indexPath={[index]}
              showIndentGuides={false}
              showNodeIcons={false}
            />
          ))}
        </TreeView.Tree>
      </TreeView>
  ),
}

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-300">
        <TreeView data={fileSystemData} size="sm" className='w-md' selectionMode="single">
          <TreeView.Label>Small Size</TreeView.Label>
          <TreeView.Tree>
            {fileSystemData.map((node, index) => (
              <TreeView.Node key={node.id} node={node} indexPath={[index]} />
            ))}
          </TreeView.Tree>
        </TreeView>
        <TreeView data={fileSystemData} size="md" className='w-md' selectionMode="single">
          <TreeView.Label>Medium Size (Default)</TreeView.Label>
          <TreeView.Tree>
            {fileSystemData.map((node, index) => (
              <TreeView.Node key={node.id} node={node} indexPath={[index]} />
            ))}
          </TreeView.Tree>
        </TreeView>
        <TreeView data={fileSystemData} size="lg" className='w-md' selectionMode="single">
          <TreeView.Label>Large Size</TreeView.Label>
          <TreeView.Tree>
            {fileSystemData.map((node, index) => (
              <TreeView.Node key={node.id} node={node} indexPath={[index]} />
            ))}
          </TreeView.Tree>
        </TreeView>
    </div>
  ),
}

// Selection behaviors
export const SelectionBehaviors: Story = {
  render: () => (
    <div className="flex flex-col gap-300">
        <TreeView
          className='w-md'
          data={fileSystemData}
          selectionMode="multiple"
          selectionBehavior="all"
        >
          <TreeView.Label>All Selectable (Default)</TreeView.Label>
          <TreeView.Tree>
            {fileSystemData.map((node, index) => (
              <TreeView.Node key={node.id} node={node} indexPath={[index]} />
            ))}
          </TreeView.Tree>
        </TreeView>
        <TreeView
          className='w-md'
          data={fileSystemData}
          selectionMode="multiple"
          selectionBehavior="leaf-only"
        >
          <TreeView.Label>Leaf Only Selectable</TreeView.Label>
          <TreeView.Tree>
            {fileSystemData.map((node, index) => (
              <TreeView.Node key={node.id} node={node} indexPath={[index]} />
            ))}
          </TreeView.Tree>
        </TreeView>
        <TreeView
          className='w-md'
          data={navigationData}
          selectionMode="single"
          selectionBehavior="custom"
        >
          <TreeView.Label>Custom (via selectable prop)</TreeView.Label>
          <TreeView.Tree>
            {navigationData.map((node, index) => (
              <TreeView.Node key={node.id} node={node} indexPath={[index]} />
            ))}
          </TreeView.Tree>
        </TreeView>
    </div>
  ),
}

// Controlled state
export const Controlled: Story = {
  render: () => {
    const ControlledExample = () => {
      const [expanded, setExpanded] = useState<string[]>(['src', 'components'])
      const [selected, setSelected] = useState<string[]>(['button.tsx'])

      return (
        <div className="flex gap-300">
            <TreeView
              className='w-md'
              data={fileSystemData}
              selectionMode="multiple"
              expandedValue={expanded}
              selectedValue={selected}
              onExpandedChange={(details) => setExpanded(details.expandedValue)}
              onSelectionChange={(details) =>
                setSelected(details.selectedValue)
              }
            >
              <TreeView.Label>Controlled Tree</TreeView.Label>
              <TreeView.Tree>
                {fileSystemData.map((node, index) => (
                  <TreeView.Node
                    key={node.id}
                    node={node}
                    indexPath={[index]}
                  />
                ))}
              </TreeView.Tree>
            </TreeView>

          <div className="flex flex-col gap-100">
            <div className="p-100 bg-surface-secondary rounded-md">
              <h4 className="text-sm font-semibold mb-xs">Expanded Nodes:</h4>
              <ul className="text-xs space-y-xs">
                {expanded.map((id) => (
                  <li key={id} className="text-fg-muted">
                    {id}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-100 bg-surface-secondary rounded-md">
              <h4 className="text-sm font-semibold mb-xs">Selected Nodes:</h4>
              <ul className="text-xs space-y-xs">
                {selected.map((id) => (
                  <li key={id} className="text-fg-muted">
                    {id}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-50">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setExpanded(['src', 'components', 'atoms'])}
              >
                Expand Some
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setExpanded([])}
              >
                Collapse All
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setSelected([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return <ControlledExample />
  },
}

// Advanced custom styling
export const CustomStyling: Story = {
  render: () => (
      <TreeView data={fileSystemData} selectionMode="single" className="w-lg bg-gradient-to-br from-surface to-surface-secondary rounded-lg">
        <h2 className="text-lg font-bold mb-md bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          🎨 Styled File Explorer
        </h2>
        <TreeView.Tree className="bg-white/50 dark:bg-black/20 backdrop-blur-sm">
          {fileSystemData.map((node, index) => {
            const CustomNode = ({ node, indexPath }: any) => (
              <TreeView.NodeProvider node={node} indexPath={indexPath}>
                {node.children ? (
                  <TreeView.Branch>
                    <TreeView.BranchTrigger className="hover:bg-primary/10 rounded-sm transition-colors">
                      <TreeView.BranchControl>
                        <span className="text-primary">
                          <TreeView.NodeIcon />
                        </span>
                        <TreeView.BranchText className="font-semibold text-fg-primary" />
                      </TreeView.BranchControl>
                      <TreeView.BranchIndicator className="text-secondary" />
                    </TreeView.BranchTrigger>
                    <TreeView.BranchContent>
                      <div className="ml-md pl-sm border-l-2 border-border-secondary/30">
                        {node.children?.map((child, idx) => (
                          <CustomNode
                            key={child.id}
                            node={child}
                            indexPath={[...indexPath, idx]}
                          />
                        ))}
                      </div>
                    </TreeView.BranchContent>
                  </TreeView.Branch>
                ) : (
                  <TreeView.Item className="hover:bg-secondary/10 rounded-sm transition-colors ml-sm">
                    <span className="text-secondary">
                      <TreeView.NodeIcon />
                    </span>
                    <TreeView.ItemText className="text-fg-secondary" />
                  </TreeView.Item>
                )}
              </TreeView.NodeProvider>
            )

            return <CustomNode key={node.id} node={node} indexPath={[index]} />
          })}
        </TreeView.Tree>
      </TreeView>
  ),
}

// With default expanded items
export const DefaultExpanded: Story = {
  render: () => (
      <TreeView
        data={fileSystemData}
        selectionMode="single"
        defaultExpandedValue={['src', 'components', 'atoms']}
        defaultSelectedValue={['button.tsx']}
        className='w-md'
      >
        <TreeView.Label>With Default State</TreeView.Label>
        <TreeView.Tree>
          {fileSystemData.map((node, index) => (
            <TreeView.Node key={node.id} node={node} indexPath={[index]} />
          ))}
        </TreeView.Tree>
      </TreeView>
  ),
}