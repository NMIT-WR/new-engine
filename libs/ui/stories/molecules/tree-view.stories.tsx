import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from '../../src/atoms/button'
import { type TreeNode, TreeView } from '../../src/molecules/tree-view'

// === MOCK DATA ===

const fileSystemData: TreeNode[] = [
  {
    id: 'documents',
    name: 'Documents',
    children: [
      {
        id: 'reports',
        name: 'Reports',
        children: [
          {
            id: 'q1-report',
            name: 'Q1 Report.pdf',
            icon: 'icon-[mdi--file-document]',
          },
          {
            id: 'q2-report',
            name: 'Q2 Report.pdf',
            icon: 'icon-[mdi--file-document]',
          },
        ],
      },
      { id: 'resume', name: 'Resume.docx', icon: 'icon-[mdi--file-document]' },
      {
        id: 'presentation',
        name: 'Presentation.pptx',
        icon: 'icon-[mdi--file-document]',
      },
    ],
  },
  {
    id: 'downloads',
    name: 'Downloads',
    children: [
      { id: 'image1', name: 'photo.jpg', icon: 'icon-[mdi--file-image]' },
      { id: 'video1', name: 'movie.mp4', icon: 'icon-[mdi--file-video]' },
      {
        id: 'archive1',
        name: 'backup.zip',
        icon: 'icon-[file-icons--progress]',
      },
    ],
  },
  {
    id: 'projects',
    name: 'Projects',
    children: [
      {
        id: 'web-app',
        name: 'Web Application',
        children: [
          {
            id: 'src',
            name: 'src',
            children: [
              { id: 'app', name: 'App.tsx', icon: 'icon-[mdi--file-code]' },
              {
                id: 'index',
                name: 'index.html',
                icon: 'icon-[mdi--file-code]',
              },
            ],
          },
          {
            id: 'package',
            name: 'package.json',
            icon: 'icon-[file-icons--json5]',
          },
          {
            id: 'readme',
            name: 'README.md',
            icon: 'icon-[file-icons--mdx]',
          },
        ],
      },
      {
        id: 'mobile-app',
        name: 'Mobile App',
        disabled: true,
        children: [
          { id: 'main', name: 'Main.kt', icon: 'icon-[mdi--file-code]' },
        ],
      },
    ],
  },
]

const organizationData: TreeNode[] = [
  {
    id: 'company',
    name: 'Acme Corporation',
    icon: 'icon-[mdi--domain]',
    children: [
      {
        id: 'engineering',
        name: 'Engineering',
        icon: 'icon-[mdi--cog]',
        children: [
          {
            id: 'frontend',
            name: 'Frontend Team',
            icon: 'icon-[mdi--account-group]',
            children: [
              { id: 'john', name: 'John Doe', icon: 'icon-[mdi--account]' },
              { id: 'jane', name: 'Jane Smith', icon: 'icon-[mdi--account]' },
            ],
          },
          {
            id: 'backend',
            name: 'Backend Team',
            icon: 'icon-[mdi--account-group]',
            children: [
              { id: 'bob', name: 'Bob Johnson', icon: 'icon-[mdi--account]' },
              { id: 'alice', name: 'Alice Brown', icon: 'icon-[mdi--account]' },
            ],
          },
        ],
      },
      {
        id: 'design',
        name: 'Design',
        icon: 'icon-[mdi--palette]',
        children: [
          { id: 'sarah', name: 'Sarah Wilson', icon: 'icon-[mdi--account]' },
          { id: 'mike', name: 'Mike Davis', icon: 'icon-[mdi--account]' },
        ],
      },
      {
        id: 'marketing',
        name: 'Marketing',
        icon: 'icon-[mdi--bullhorn]',
        children: [
          { id: 'lisa', name: 'Lisa Garcia', icon: 'icon-[mdi--account]' },
        ],
      },
    ],
  },
]

// === STORYBOOK META ===

const meta: Meta<typeof TreeView> = {
  title: 'Molecules/TreeView',
  component: TreeView,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A tree view component built with Zag.js that provides hierarchical data visualization with keyboard navigation, selection, and accessibility features.

## Features
- Hierarchical data display
- Single and multiple selection modes
- Keyboard navigation with typeahead search
- Expand/collapse functionality
- Custom icons and node rendering
- Accessibility with ARIA attributes
- Indent guides for visual hierarchy
- Size variants (sm, md, lg)
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Data
    data: {
      control: { type: 'object' },
      description: 'Tree data structure',
    },
    label: {
      control: { type: 'text' },
      description: 'Tree label/title',
    },

    // Machine props
    selectionMode: {
      control: { type: 'select' },
      options: ['single', 'multiple'],
      description: 'Node selection behavior',
    },
    expandOnClick: {
      control: { type: 'boolean' },
      description: 'Expand branches when clicking on them',
    },
    typeahead: {
      control: { type: 'boolean' },
      description: 'Enable typeahead search',
    },
    dir: {
      control: { type: 'select' },
      options: ['ltr', 'rtl'],
      description: 'Text direction',
    },

    // State
    defaultExpandedValue: {
      control: { type: 'object' },
      description: 'Initially expanded node IDs',
    },
    defaultSelectedValue: {
      control: { type: 'object' },
      description: 'Initially selected node IDs',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// === BASIC EXAMPLES ===

export const Default: Story = {
  args: {
    data: fileSystemData,
    label: 'File System',
  },
}

export const AsideMenu: Story = {
  args: {
    data: fileSystemData,
    label: 'File System',
    showIndentGuides: false,
    showNodeIcons: false,
    selectionMode: 'single',
  },
}

export const SelectionModes: Story = {
  render: () => (
    <div className="grid w-full grid-cols-2 gap-6">
      <div>
        <h3 className="mb-4 font-medium text-sm">Single Selection</h3>
        <TreeView
          id=""
          data={organizationData}
          selectionMode="single"
          defaultExpandedValue={['company', 'engineering']}
          defaultSelectedValue={['john']}
        />
      </div>
      <div>
        <h3 className="mb-4 font-medium text-sm">Multiple Selection</h3>
        <TreeView
          id=""
          data={organizationData}
          selectionMode="multiple"
          defaultExpandedValue={['company', 'engineering']}
          defaultSelectedValue={['john', 'jane', 'sarah']}
        />
      </div>
    </div>
  ),
}

// === CUSTOMIZATION EXAMPLES ===

export const CustomIcons: Story = {
  render: () => {
    // Tech stack with specific icons per node type
    const techStackData: TreeNode[] = [
      {
        id: 'frontend',
        name: 'Frontend',
        icons: { branch: 'icon-[mdi--monitor]' },
        children: [
          {
            id: 'react',
            name: 'React Components',
            icons: { branch: 'icon-[mdi--react]' },
            children: [
              {
                id: 'button',
                name: 'Button.tsx',
                icons: { leaf: 'icon-[mdi--gesture-tap]' },
              },
              {
                id: 'input',
                name: 'Input.tsx',
                icons: { leaf: 'icon-[mdi--form-textbox]' },
              },
            ],
          },
          {
            id: 'styles',
            name: 'Styles',
            icons: { branch: 'icon-[mdi--palette]' },
            children: [
              {
                id: 'global',
                name: 'globals.css',
                icons: { leaf: 'icon-[mdi--language-css3]' },
              },
            ],
          },
        ],
      },
      {
        id: 'backend',
        name: 'Backend',
        icons: { branch: 'icon-[mdi--server]' },
        children: [
          {
            id: 'api',
            name: 'API Routes',
            icons: { branch: 'icon-[mdi--api]' },
            children: [
              {
                id: 'users',
                name: 'users.ts',
                icons: { leaf: 'icon-[mdi--account-multiple]' },
              },
              {
                id: 'auth',
                name: 'auth.ts',
                icons: { leaf: 'icon-[mdi--shield-key]' },
              },
            ],
          },
        ],
      },
    ]

    return (
      <TreeView
        id=""
        data={techStackData}
        label="Tech Stack with Custom Icons"
        defaultExpandedValue={['frontend', 'backend', 'react', 'api']}
      />
    )
  },
}

// === STATE MANAGEMENT ===
export const ControlledState: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<string[]>(['documents'])
    const [selected, setSelected] = useState<string[]>([])

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setExpanded(['documents', 'downloads', 'projects'])}
          >
            Expand All
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setExpanded([])}>
            Collapse All
          </Button>
          <Button size="sm" variant="tertiary" onClick={() => setSelected([])}>
            Clear Selection
          </Button>
        </div>

        <TreeView
          id=""
          data={fileSystemData}
          label="Controlled Tree"
          selectionMode="multiple"
          expandedValue={expanded}
          selectedValue={selected}
          onExpandedChange={(details) => setExpanded(details.expandedValue)}
          onSelectionChange={(details) => setSelected(details.selectedValue)}
        />

        <div className="space-y-1 text-sm">
          <div>
            <strong>Expanded:</strong> {expanded.join(', ') || 'None'}
          </div>
          <div>
            <strong>Selected:</strong> {selected.join(', ') || 'None'}
          </div>
        </div>
      </div>
    )
  },
}

export const DeepNesting: Story = {
  render: () => {
    const deepData: TreeNode[] = [
      {
        id: 'level1',
        name: 'Level 1',
        children: [
          {
            id: 'level2',
            name: 'Level 2',
            children: [
              {
                id: 'level3',
                name: 'Level 3',
                children: [
                  {
                    id: 'level4',
                    name: 'Level 4',
                    children: [{ id: 'level5', name: 'Level 5 (Leaf)' }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ]

    return (
      <TreeView
        id=""
        data={deepData}
        label="Deep Nesting Example"
        defaultExpandedValue={['level1', 'level2', 'level3', 'level4']}
      />
    )
  },
}

export const RTLDirection: Story = {
  args: {
    data: fileSystemData.slice(0, 2),
    label: 'ملفات النظام', // "System Files" in Arabic
    dir: 'rtl',
    defaultExpandedValue: ['documents'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Tree view with right-to-left text direction.',
      },
    },
  },
}

export const TypeaheadDebugDemo: Story = {
  render: () => {
    const flatData: TreeNode[] = [
      { id: 'alpha', name: 'Alpha' },
      { id: 'beta', name: 'Beta' },
      { id: 'gamma', name: 'Gamma' },
    ]
    const handleKeyDown = (_e: React.KeyboardEvent<HTMLDivElement>) => {}

    return (
      <div className="space-y-4">
        <div
          id="debug-wrapper-div"
          className="rounded-lg bg-blue-50/10 p-4"
          onKeyDown={handleKeyDown}
        >
          <TreeView
            id=""
            data={flatData}
            label="Typeahead Debug"
            typeahead={true}
          />
        </div>
      </div>
    )
  },
}
