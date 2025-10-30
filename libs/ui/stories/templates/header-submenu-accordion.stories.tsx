import type { Meta, StoryObj } from '@storybook/react'
import { Header } from '../../src/organisms/header'
import { HeaderSubmenuAccordion } from '../../src/templates/header-submenu-accordion'

const meta: Meta<typeof HeaderSubmenuAccordion> = {
  title: 'Templates/HeaderSubmenuAccordion',
  component: HeaderSubmenuAccordion,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
          A ready-to-use mobile header submenu template using Accordion with props-based API.
          This template provides a simplified interface for creating expandable/collapsible navigation menus,
          making it ideal for mobile-responsive e-commerce navigation and hierarchical menu structures.

          **Use in Header.Mobile** - This component is designed for mobile navigation.
          For desktop menus, use HeaderSubmenuPopover instead.

          Part of the templates layer in atomic design architecture.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of menu items with value, label, href, optional children for nesting, and optional icons',
      table: {
        category: 'Content',
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'borderless', 'child'],
      description: 'Visual style variant - "child" recommended for nested mobile menus',
      table: {
        category: 'Appearance',
      },
    },
    showIndicator: {
      control: 'boolean',
      description: 'Show expand/collapse indicator chevron',
      table: {
        category: 'Appearance',
      },
    },
    indicatorIcon: {
      control: 'text',
      description: 'Icon for expand/collapse indicator',
      table: {
        category: 'Appearance',
      },
    },
    indentNested: {
      control: 'boolean',
      description: 'Indent nested submenu items for visual hierarchy',
      table: {
        category: 'Appearance',
      },
    },
    indentClass: {
      control: 'text',
      description: 'CSS class for nested item indentation',
      table: {
        category: 'Appearance',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof HeaderSubmenuAccordion>

const mobileMenuItems = [
  { value: 'home', label: 'Home', href: '/' },
  { value: 'about', label: 'About', href: '/about' },
  {
    value: 'shop',
    label: 'Shop',
    children: [
      { value: 'new', label: 'New Arrivals', href: '/shop/new' },
      {
        value: 'categories',
        label: 'Categories',
        children: [
          { value: 'electronics', label: 'Electronics', href: '/shop/electronics' },
          { value: 'clothing', label: 'Clothing', href: '/shop/clothing' },
          { value: 'home', label: 'Home & Garden', href: '/shop/home' },
          { value: 'sports', label: 'Sports & Outdoors', href: '/shop/sports' },
        ],
      },
      { value: 'sale', label: 'Sale', href: '/shop/sale' },
    ],
  },
  { value: 'contact', label: 'Contact', href: '/contact' },
]

const iconMenuItems = [
  { value: 'home', label: 'Home', href: '/', icon: 'icon-[mdi--home]' },
  {
    value: 'shop',
    label: 'Shop',
    icon: 'icon-[mdi--shopping]',
    children: [
      { value: 'electronics', label: 'Electronics', href: '/shop/electronics', icon: 'icon-[mdi--laptop]' },
      { value: 'clothing', label: 'Clothing', href: '/shop/clothing', icon: 'icon-[mdi--t-shirt-crew]' },
      { value: 'home', label: 'Home & Garden', href: '/shop/home', icon: 'icon-[mdi--home-outline]' },
      { value: 'sports', label: 'Sports', href: '/shop/sports', icon: 'icon-[mdi--basketball]' },
    ],
  },
  { value: 'contact', label: 'Contact', href: '/contact', icon: 'icon-[mdi--email]' },
]

const simpleMenuItems = [
  { value: 'item1', label: 'New Arrivals', href: '/shop/new' },
  { value: 'item2', label: 'Best Sellers', href: '/shop/bestsellers' },
  { value: 'item3', label: 'Electronics', href: '/shop/electronics' },
  { value: 'item4', label: 'Clothing', href: '/shop/clothing' },
  { value: 'item5', label: 'Sale', href: '/shop/sale' },
]

export const Default: Story = {
  args: {
    items: mobileMenuItems,
    variant: 'child',
    showIndicator: true,
    indentNested: true,
  },
  render: (args) => (
    <Header>
      <Header.Desktop>
        <Header.Nav>
          <Header.NavItem>
            <a href="/">Home</a>
          </Header.NavItem>
          <Header.NavItem>
            <a href="/about">About</a>
          </Header.NavItem>
        </Header.Nav>
      </Header.Desktop>
      <Header.Mobile position="right">
        <HeaderSubmenuAccordion {...args} />
      </Header.Mobile>
      <Header.Hamburger />
    </Header>
  ),
}

export const NestedSubmenu: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Multi-level nested navigation**: Mobile menu with nested submenus up to 2+ levels deep.

Each nested level is indented for visual hierarchy. Perfect for complex category structures.
        `,
      },
    },
  },
  args: {
    items: mobileMenuItems,
    variant: 'child',
    showIndicator: true,
    indentNested: true,
    indentClass: 'px-0 pl-200',
  },
  render: (args) => (
    <Header>
      <Header.Desktop>
        <Header.Nav>
          <Header.NavItem>
            <a href="/">Home</a>
          </Header.NavItem>
        </Header.Nav>
      </Header.Desktop>
      <Header.Mobile position="right">
        <HeaderSubmenuAccordion {...args} />
      </Header.Mobile>
      <Header.Hamburger />
    </Header>
  ),
}

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Icon-enhanced menu items**: Each menu item can include an icon for better visual recognition.

Icons help users quickly identify sections in mobile navigation.
        `,
      },
    },
  },
  args: {
    items: iconMenuItems,
    variant: 'child',
    showIndicator: true,
    indentNested: true,
  },
  render: (args) => (
    <Header>
      <Header.Desktop>
        <Header.Nav>
          <Header.NavItem>
            <a href="/">Home</a>
          </Header.NavItem>
        </Header.Nav>
      </Header.Desktop>
      <Header.Mobile position="right">
        <HeaderSubmenuAccordion {...args} />
      </Header.Mobile>
      <Header.Hamburger />
    </Header>
  ),
}

export const SimpleList: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Simple flat menu**: No nesting, just a straightforward list of links.

Useful for simple mobile navigation without complex hierarchies.
        `,
      },
    },
  },
  args: {
    items: simpleMenuItems,
    variant: 'child',
    showIndicator: false,
    indentNested: false,
  },
  render: (args) => (
    <Header>
      <Header.Desktop>
        <Header.Nav>
          <Header.NavItem>
            <a href="/">Home</a>
          </Header.NavItem>
        </Header.Nav>
      </Header.Desktop>
      <Header.Mobile position="right">
        <HeaderSubmenuAccordion {...args} />
      </Header.Mobile>
      <Header.Hamburger />
    </Header>
  ),
}

export const VariantComparison: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Variant comparison**: Visual differences between default, borderless, and child variants.

- **default**: Standard bordered accordion style
- **borderless**: No borders between items
- **child**: Optimized for nested navigation (recommended)
        `,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-900">
      <div>
        <p className="mb-200 font-semibold">Default</p>
        <Header>
          <Header.Desktop>
            <Header.Nav>
              <Header.NavItem>
                <a href="/">Home</a>
              </Header.NavItem>
            </Header.Nav>
          </Header.Desktop>
          <Header.Mobile position="right">
            <HeaderSubmenuAccordion
              items={simpleMenuItems}
              variant="default"
              showIndicator={false}
            />
          </Header.Mobile>
          <Header.Hamburger />
        </Header>
      </div>

      <div>
        <p className="mb-200 font-semibold">Borderless</p>
        <Header>
          <Header.Desktop>
            <Header.Nav>
              <Header.NavItem>
                <a href="/">Home</a>
              </Header.NavItem>
            </Header.Nav>
          </Header.Desktop>
          <Header.Mobile position="right">
            <HeaderSubmenuAccordion
              items={simpleMenuItems}
              variant="borderless"
              showIndicator={false}
            />
          </Header.Mobile>
          <Header.Hamburger />
        </Header>
      </div>

      <div>
        <p className="mb-200 font-semibold">Child (Recommended)</p>
        <Header>
          <Header.Desktop>
            <Header.Nav>
              <Header.NavItem>
                <a href="/">Home</a>
              </Header.NavItem>
            </Header.Nav>
          </Header.Desktop>
          <Header.Mobile position="right">
            <HeaderSubmenuAccordion
              items={simpleMenuItems}
              variant="child"
              showIndicator={false}
            />
          </Header.Mobile>
          <Header.Hamburger />
        </Header>
      </div>
    </div>
  ),
}

export const Playground: Story = {
  name: '🎮 Interactive Playground',
  args: {
    items: [
      ...mobileMenuItems,
      { value: 'disabled', label: 'Disabled Item', href: '/disabled', disabled: true },
    ],
    variant: 'child',
    showIndicator: true,
    indicatorIcon: 'token-icon-accordion-chevron',
    indentNested: true,
    indentClass: 'px-0 pl-200',
  },
  render: (args) => (
    <Header>
      <Header.Desktop>
        <Header.Nav>
          <Header.NavItem>
            <a href="/">Home</a>
          </Header.NavItem>
          <Header.NavItem>
            <a href="/about">About</a>
          </Header.NavItem>
        </Header.Nav>
      </Header.Desktop>
      <Header.Mobile position="right">
        <HeaderSubmenuAccordion {...args} />
      </Header.Mobile>
      <Header.Hamburger />
    </Header>
  ),
}
