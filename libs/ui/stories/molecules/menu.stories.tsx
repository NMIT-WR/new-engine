import type { Meta, StoryObj } from '@storybook/react'
import { Menu, type MenuItem } from '../../src/molecules/menu'

const meta: Meta<typeof Menu> = {
  title: 'Molecules/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    triggerText: {
      control: { type: 'text' },
    },
    customTrigger: {
      control: { type: 'boolean' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const basicItems: MenuItem[] = [
  { type: 'action', value: 'new-file', label: 'New File', icon: 'token-icon-plus' },
  { type: 'action', value: 'open', label: 'Open...', icon: 'token-icon-folder' },
  { type: 'separator', id: 'separator-1' },
  { type: 'action', value: 'save', label: 'Save', icon: 'token-icon-save' },
  { type: 'action', value: 'save-as', label: 'Save As...', icon: 'token-icon-save' },
  { type: 'separator', id: 'separator-2' },
  { type: 'action', value: 'exit', label: 'Exit', icon: 'token-icon-close' },
]

export const Default: Story = {
  args: {
    items: basicItems,
    triggerText: 'File',
  },
}

export const Small: Story = {
  args: {
    items: basicItems,
    triggerText: 'File',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    items: basicItems,
    triggerText: 'File',
    size: 'lg',
  },
}

export const WithCustomPositioning: Story = {
  args: {
    items: basicItems,
    triggerText: 'File',
    positioning: {
      placement: 'top',
    },
  },
}

const itemsWithDisabled: MenuItem[] = [
  { type: 'action', value: 'cut', label: 'Cut', icon: 'token-icon-scissors' },
  { type: 'action', value: 'copy', label: 'Copy', icon: 'token-icon-copy' },
  { type: 'action', value: 'paste', label: 'Paste', icon: 'token-icon-clipboard', disabled: true },
  { type: 'separator', id: 'separator' },
  { type: 'action', value: 'delete', label: 'Delete', icon: 'token-icon-trash' },
]

export const WithDisabledItems: Story = {
  args: {
    items: itemsWithDisabled,
    triggerText: 'Edit',
  },
}

const contextMenuItems: MenuItem[] = [
  { type: 'action', value: 'undo', label: 'Undo', icon: 'token-icon-undo' },
  { type: 'action', value: 'redo', label: 'Redo', icon: 'token-icon-redo' },
  { type: 'separator', id: 'separator-1' },
  { type: 'action', value: 'cut', label: 'Cut', icon: 'token-icon-scissors' },
  { type: 'action', value: 'copy', label: 'Copy', icon: 'token-icon-copy' },
  { type: 'action', value: 'paste', label: 'Paste', icon: 'token-icon-clipboard' },
  { type: 'separator', id: 'separator-2' },
  { type: 'action', value: 'select-all', label: 'Select All' },
]

export const ContextMenu: Story = {
  args: {
    items: contextMenuItems,
    triggerText: 'Right Click',
  },
}

export const CustomTrigger: Story = {
  args: {
    items: basicItems,
    customTrigger: (
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Custom Trigger
      </button>
    ),
  },
}

export const WithSelectHandler: Story = {
  args: {
    items: basicItems,
    triggerText: 'Actions',
    onSelect: (details) => {
      console.log('Selected:', details.value)
      alert(`You selected: ${details.value}`)
    },
  },
}

const viewMenuItems: MenuItem[] = [
  { type: 'checkbox', value: 'show-sidebar', label: 'Show Sidebar', checked: true },
  { type: 'checkbox', value: 'show-toolbar', label: 'Show Toolbar', checked: true },
  { type: 'checkbox', value: 'show-statusbar', label: 'Show Status Bar', checked: false },
  { type: 'separator', id: 'separator-1' },
  { type: 'radio', value: 'list-view', label: 'List View', name: 'view-mode', checked: true },
  { type: 'radio', value: 'grid-view', label: 'Grid View', name: 'view-mode', checked: false },
  { type: 'radio', value: 'detail-view', label: 'Detail View', name: 'view-mode', checked: false },
]

export const WithOptionsMenu: Story = {
  args: {
    items: viewMenuItems,
    triggerText: 'View',
    onCheckedChange: (item, checked) => {
      console.log('Option changed:', item.value, 'checked:', checked)
    },
  },
}

// Story pro keyboard navigation
export const KeyboardNavigation: Story = {
  args: {
    items: basicItems,
    triggerText: 'Press Arrow Keys',
    typeahead: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Use arrow keys to navigate, Enter to select, and type to search',
      },
    },
  },
}

// Story pro positioning
const positioningItems: MenuItem[] = [
  { type: 'action', value: 'top', label: 'Top placement' },
  { type: 'action', value: 'right', label: 'Right placement' },
  { type: 'action', value: 'bottom', label: 'Bottom placement' },
  { type: 'action', value: 'left', label: 'Left placement' },
]

export const DifferentPlacements: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-16 p-20">
      <Menu items={positioningItems} triggerText="Top" positioning={{ placement: 'top' }} />
      <Menu items={positioningItems} triggerText="Right" positioning={{ placement: 'right' }} />
      <Menu items={positioningItems} triggerText="Bottom" positioning={{ placement: 'bottom' }} />
      <Menu items={positioningItems} triggerText="Left" positioning={{ placement: 'left' }} />
    </div>
  ),
}

// Story pro mixed content
const mixedContentItems: MenuItem[] = [
  { type: 'action', value: 'profile', label: 'My Profile', icon: 'token-icon-user' },
  { type: 'action', value: 'settings', label: 'Settings', icon: 'token-icon-settings' },
  { type: 'separator', id: 'sep-1' },
  { type: 'checkbox', value: 'notifications', label: 'Enable Notifications', checked: true },
  { type: 'checkbox', value: 'sounds', label: 'Enable Sounds', checked: false },
  { type: 'separator', id: 'sep-2' },
  { type: 'radio', value: 'light', label: 'Light Theme', name: 'theme', checked: true },
  { type: 'radio', value: 'dark', label: 'Dark Theme', name: 'theme', checked: false },
  { type: 'radio', value: 'system', label: 'System Theme', name: 'theme', checked: false },
  { type: 'separator', id: 'sep-3' },
  { type: 'action', value: 'logout', label: 'Logout', icon: 'token-icon-logout' },
]

export const ComplexMenu: Story = {
  args: {
    items: mixedContentItems,
    triggerText: 'Account',
    triggerIcon: 'token-icon-user',
  },
}

// Story pro long menu with scroll
const longMenuItems: MenuItem[] = Array.from({ length: 20 }, (_, i) => ({
  type: 'action' as const,
  value: `item-${i}`,
  label: `Menu Item ${i + 1}`,
  icon: i % 3 === 0 ? 'token-icon-star' : undefined,
}))

export const ScrollableMenu: Story = {
  args: {
    items: longMenuItems,
    triggerText: 'Long Menu',
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu with many items shows scrollbar when exceeding max height',
      },
    },
  },
}