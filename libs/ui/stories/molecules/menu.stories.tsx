import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../../src/atoms/button'
import { Menu, type MenuItem } from '../../src/molecules/menu'
import { useState } from 'react'

const meta: Meta<typeof Menu> = {
  title: 'Molecules/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Story 1: Basic menu with actions
const fileMenuItems: MenuItem[] = [
  { type: 'action', value: 'new', label: 'New File', icon: 'token-icon-plus' },
  { type: 'action', value: 'open', label: 'Open...', icon: 'token-icon-folder' },
  { type: 'separator', id: 'sep-1' },
  { type: 'action', value: 'save', label: 'Save', icon: 'token-icon-save' },
  { type: 'action', value: 'exit', label: 'Exit' },
]

export const BasicMenu: Story = {
  args: {
    items: fileMenuItems,
    triggerText: 'File',
  },
}

// Story 2: Menu with checkboxes
const viewMenuItems: MenuItem[] = [
  { type: 'checkbox', value: 'sidebar', label: 'Show Sidebar', checked: true },
  { type: 'checkbox', value: 'toolbar', label: 'Show Toolbar', checked: true },
  { type: 'checkbox', value: 'statusbar', label: 'Show Status Bar', checked: false },
]

export const CheckboxMenu: Story = {
  render: () => {
    const [items, setItems] = useState(viewMenuItems)
    
    return (
      <Menu 
        items={items}
        triggerText="View Options"
        onCheckedChange={(item, checked) => {
          setItems(items.map(i => 
            i.type === 'checkbox' && i.value === item.value ? { ...i, checked } : i
          ))
        }}
      />
    )
  }
}

// Story 3: Menu with radio options
const sortMenuItems: MenuItem[] = [
  { type: 'radio', value: 'name', label: 'Sort by Name', name: 'sort', checked: true },
  { type: 'radio', value: 'date', label: 'Sort by Date', name: 'sort', checked: false },
  { type: 'radio', value: 'size', label: 'Sort by Size', name: 'sort', checked: false },
]

export const RadioMenu: Story = {
  render: () => {
    const [items, setItems] = useState(sortMenuItems)
    
    return (
      <Menu 
        items={items}
        triggerText="Sort By"
        onCheckedChange={(item, checked) => {
          if (item.type === 'radio' && checked) {
            setItems(items.map(i => 
              i.type === 'radio' && i.name === item.name 
                ? { ...i, checked: i.value === item.value }
                : i
            ))
          }
        }}
      />
    )
  }
}