import type { Meta, StoryObj } from '@storybook/react'
import { Header } from '../../src/organisms/header'
import { HeaderSubmenuPopover } from '../../src/templates/header-submenu-popover'

const meta: Meta<typeof HeaderSubmenuPopover> = {
  title: 'Templates/HeaderSubmenuPopover',
  component: HeaderSubmenuPopover,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
          A ready-to-use desktop header submenu template using Popover with props-based API.
          This template provides a simplified interface for creating nested dropdown navigation menus,
          making it ideal for e-commerce category navigation and hierarchical menu structures.

          **Use in Header.Desktop** - This component is designed for desktop navigation.
          For mobile menus, use HeaderSubmenuAccordion instead.

          Part of the templates layer in atomic design architecture.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of menu items with label, href, optional children for nesting, and optional icons',
      table: {
        category: 'Content',
      },
    },
    trigger: {
      control: 'text',
      description: 'Trigger content - can be string or ReactNode',
      table: {
        category: 'Content',
      },
    },
    placement: {
      control: 'select',
      options: ['bottom', 'bottom-start', 'bottom-end', 'top', 'top-start', 'top-end'],
      description: 'Popover placement relative to trigger',
      table: {
        category: 'Appearance',
      },
    },
    showChevron: {
      control: 'boolean',
      description: 'Show chevron icon next to trigger text',
      table: {
        category: 'Appearance',
      },
    },
    chevronIcon: {
      control: 'text',
      description: 'Icon for chevron indicator',
      table: {
        category: 'Appearance',
      },
    },
    nestedPlacement: {
      control: 'select',
      options: ['right-start', 'right', 'right-end', 'left-start', 'left', 'left-end'],
      description: 'Placement for nested submenu popovers',
      table: {
        category: 'Appearance',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof HeaderSubmenuPopover>

const shopMenuItems = [
  { label: 'New Arrivals', href: '/shop/new' },
  { label: 'Best Sellers', href: '/shop/bestsellers' },
  {
    label: 'Categories',
    children: [
      { label: 'Electronics', href: '/shop/electronics' },
      { label: 'Clothing', href: '/shop/clothing' },
      { label: 'Home & Garden', href: '/shop/home' },
      { label: 'Sports & Outdoors', href: '/shop/sports' },
    ],
  },
  { label: 'Sale', href: '/shop/sale' },
]

const nestedMenuItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Shop',
    children: [
      { label: 'New Arrivals', href: '/shop/new' },
      {
        label: 'Categories',
        children: [
          { label: 'Electronics', href: '/shop/electronics' },
          { label: 'Clothing', href: '/shop/clothing' },
          { label: 'Home & Garden', href: '/shop/home' },
        ],
      },
      { label: 'Sale', href: '/shop/sale' },
    ],
  },
  { label: 'Contact', href: '/contact' },
]

const iconMenuItems = [
  { label: 'Electronics', href: '/shop/electronics', icon: 'icon-[mdi--laptop]' },
  { label: 'Clothing', href: '/shop/clothing', icon: 'icon-[mdi--t-shirt-crew]' },
  { label: 'Home & Garden', href: '/shop/home', icon: 'icon-[mdi--home]' },
  { label: 'Sports', href: '/shop/sports', icon: 'icon-[mdi--basketball]' },
]

export const Default: Story = {
  args: {
    items: shopMenuItems,
    trigger: 'Shop',
    placement: 'bottom',
    showChevron: true,
    nestedPlacement: 'right-start',
  },
  render: (args) => (
    <Header>
      <Header.Desktop>
        <Header.Nav>
          <Header.NavItem>
            <a href="/">Home</a>
          </Header.NavItem>
          <HeaderSubmenuPopover {...args} />
          <Header.NavItem>
            <a href="/about">About</a>
          </Header.NavItem>
        </Header.Nav>
      </Header.Desktop>
    </Header>
  ),
}

export const NestedSubmenu: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Multi-level nested navigation**: Main menu with nested submenus up to 2+ levels deep.

Perfect for e-commerce sites with complex category hierarchies.
        `,
      },
    },
  },
  args: {
    items: nestedMenuItems,
    trigger: 'Menu',
    placement: 'bottom',
    showChevron: true,
    nestedPlacement: 'right-start',
  },
  render: (args) => (
    <Header>
      <Header.Desktop>
        <Header.Nav>
          <HeaderSubmenuPopover {...args} />
        </Header.Nav>
      </Header.Desktop>
    </Header>
  ),
}

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Icon-enhanced menu items**: Each menu item can include an icon for better visual recognition.

Useful for category browsing and visual navigation.
        `,
      },
    },
  },
  args: {
    items: iconMenuItems,
    trigger: 'Categories',
    placement: 'bottom',
    showChevron: true,
  },
  render: (args) => (
    <Header>
      <Header.Desktop>
        <Header.Nav>
          <Header.NavItem>
            <a href="/">Home</a>
          </Header.NavItem>
          <HeaderSubmenuPopover {...args} />
        </Header.Nav>
      </Header.Desktop>
    </Header>
  ),
}

export const CustomPlacement: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Custom placement options**: Control where the submenu appears relative to the trigger.

Try different placement values: bottom, bottom-start, bottom-end, top, etc.
        `,
      },
    },
  },
  args: {
    items: shopMenuItems,
    trigger: 'Shop',
    placement: 'bottom-start',
    showChevron: true,
    nestedPlacement: 'right-start',
  },
  render: (args) => (
    <Header>
      <Header.Desktop>
        <Header.Nav>
          <HeaderSubmenuPopover {...args} />
        </Header.Nav>
      </Header.Desktop>
    </Header>
  ),
}

export const Playground: Story = {
  name: '🎮 Interactive Playground',
  args: {
    items: [
      ...shopMenuItems,
      { label: 'Disabled Item', href: '/disabled', disabled: true },
    ],
    trigger: 'Shop',
    placement: 'bottom',
    showChevron: true,
    chevronIcon: 'icon-[mdi--chevron-down]',
    nestedPlacement: 'right-start',
  },
  render: (args) => (
    <Header>
      <Header.Desktop>
        <Header.Nav>
          <Header.NavItem>
            <a href="/">Home</a>
          </Header.NavItem>
          <HeaderSubmenuPopover {...args} />
          <Header.NavItem>
            <a href="/about">About</a>
          </Header.NavItem>
        </Header.Nav>
      </Header.Desktop>
    </Header>
  ),
}
