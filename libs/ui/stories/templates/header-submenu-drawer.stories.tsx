import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from '../../src/atoms/button'
import { Header } from '../../src/organisms/header'
import { HeaderSubmenuDrawer } from '../../src/templates/header-submenu-drawer'

const meta: Meta<typeof HeaderSubmenuDrawer> = {
  title: 'Templates/HeaderSubmenuDrawer',
  component: HeaderSubmenuDrawer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
          A ready-to-use header drawer submenu template using Dialog with props-based API.
          This template creates a mega menu that slides down from the header, perfect for
          showcasing categories with icons in a visual grid or flex layout.

          **Works on both desktop and mobile** - Unlike Popover (desktop-only) and Accordion (mobile-only),
          the drawer pattern works across all viewport sizes.

          **State management required** - You must provide \`open\` and \`onOpenChange\` props
          to control the drawer's visibility (use useState in your component).

          Part of the templates layer in atomic design architecture.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    categories: {
      control: 'object',
      description: 'Array of categories with name, icon, href, and optional description',
      table: {
        category: 'Content',
      },
    },
    trigger: {
      control: 'text',
      description: 'Trigger button content - can be string or ReactNode',
      table: {
        category: 'Content',
      },
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state (required)',
      table: {
        category: 'State',
      },
    },
    layout: {
      control: 'select',
      options: ['flex', 'grid'],
      description: 'Layout mode - flex for horizontal row, grid for multi-column layout',
      table: {
        category: 'Appearance',
      },
    },
    gridCols: {
      control: 'select',
      options: [2, 3, 4, 5, 6],
      description: 'Number of columns when layout is "grid"',
      table: {
        category: 'Appearance',
      },
    },
    placement: {
      control: 'select',
      options: ['top', 'bottom'],
      description: 'Dialog placement relative to header',
      table: {
        category: 'Appearance',
      },
    },
    showTriggerIcon: {
      control: 'boolean',
      description: 'Show icon on trigger button',
      table: {
        category: 'Appearance',
      },
    },
    triggerIcon: {
      control: 'text',
      description: 'Icon for trigger button',
      table: {
        category: 'Appearance',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof HeaderSubmenuDrawer>

const basicCategories = [
  { name: 'Electronics', icon: 'icon-[mdi--laptop]', href: '/electronics' },
  { name: 'Clothing', icon: 'icon-[mdi--t-shirt-crew]', href: '/clothing' },
  { name: 'Home & Garden', icon: 'icon-[mdi--home]', href: '/home' },
  { name: 'Sports', icon: 'icon-[mdi--basketball]', href: '/sports' },
]

const categoriesWithDescriptions = [
  {
    name: 'Electronics',
    icon: 'icon-[mdi--laptop]',
    href: '/electronics',
    description: 'Phones, Laptops & More',
  },
  {
    name: 'Clothing',
    icon: 'icon-[mdi--t-shirt-crew]',
    href: '/clothing',
    description: 'Fashion & Apparel',
  },
  {
    name: 'Home & Garden',
    icon: 'icon-[mdi--home]',
    href: '/home',
    description: 'Furniture & Decor',
  },
  {
    name: 'Sports',
    icon: 'icon-[mdi--basketball]',
    href: '/sports',
    description: 'Outdoor & Fitness',
  },
]

const expandedCategories = [
  { name: 'Electronics', icon: 'icon-[mdi--laptop]', href: '/electronics' },
  { name: 'Clothing', icon: 'icon-[mdi--t-shirt-crew]', href: '/clothing' },
  { name: 'Home & Garden', icon: 'icon-[mdi--home]', href: '/home' },
  { name: 'Sports', icon: 'icon-[mdi--basketball]', href: '/sports' },
  { name: 'Books', icon: 'icon-[mdi--book-open]', href: '/books' },
  { name: 'Toys', icon: 'icon-[mdi--toy-brick]', href: '/toys' },
  { name: 'Beauty', icon: 'icon-[mdi--palette]', href: '/beauty' },
  { name: 'Automotive', icon: 'icon-[mdi--car]', href: '/automotive' },
]

export const FlexLayout: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Flex layout**: Categories arranged in a single horizontal row with even spacing.

Perfect for 4-6 main categories that fit comfortably across the screen.
        `,
      },
    },
  },
  render: () => {
    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
      <Header>
        <Header.Desktop>
          <Header.Nav className="z-[100]">
            <Header.NavItem>
              <a href="/">Home</a>
            </Header.NavItem>
            <HeaderSubmenuDrawer.Trigger
              trigger="Categories"
              open={drawerOpen}
              onOpenChange={setDrawerOpen}
            />
            <Header.NavItem>
              <a href="/about">About</a>
            </Header.NavItem>
          </Header.Nav>
        </Header.Desktop>
        <Header.Container position="end">
          <Header.Actions>
            <Button icon="icon-[mdi--account]" theme="borderless" size="sm">
              Account
            </Button>
            <Button icon="icon-[mdi--cart]" theme="borderless" size="sm">
              Cart
            </Button>
          </Header.Actions>
        </Header.Container>
        <Header.Hamburger />

        <HeaderSubmenuDrawer.Content
          categories={basicCategories}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          layout="flex"
        />
      </Header>
    )
  },
}

export const GridLayout: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Grid layout**: Categories arranged in a multi-column grid.

Perfect for showcasing many categories (8+) in an organized, scannable format.
        `,
      },
    },
  },
  render: () => {
    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
      <Header>
        <Header.Desktop>
          <Header.Nav className="z-[100]">
            <Header.NavItem>
              <a href="/">Home</a>
            </Header.NavItem>
            <HeaderSubmenuDrawer.Trigger
              trigger="All Categories"
              open={drawerOpen}
              onOpenChange={setDrawerOpen}
            />
            <Header.NavItem>
              <a href="/about">About</a>
            </Header.NavItem>
          </Header.Nav>
        </Header.Desktop>
        <Header.Container position="end">
          <Header.Actions>
            <Button icon="icon-[mdi--account]" theme="borderless" size="sm">
              Account
            </Button>
            <Button icon="icon-[mdi--cart]" theme="borderless" size="sm">
              Cart
            </Button>
          </Header.Actions>
        </Header.Container>
        <Header.Hamburger />

        <HeaderSubmenuDrawer.Content
          categories={expandedCategories}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          layout="grid"
          gridCols={4}
        />
      </Header>
    )
  },
}

export const WithDescriptions: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Enhanced categories**: Each category includes a description for additional context.

Helps users understand what they'll find in each category.
        `,
      },
    },
  },
  render: () => {
    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
      <Header>
        <Header.Desktop>
          <Header.Nav className="z-[100]">
            <Header.NavItem>
              <a href="/">Home</a>
            </Header.NavItem>
            <HeaderSubmenuDrawer.Trigger
              trigger="Shop by Category"
              open={drawerOpen}
              onOpenChange={setDrawerOpen}
            />
            <Header.NavItem>
              <a href="/about">About</a>
            </Header.NavItem>
          </Header.Nav>
        </Header.Desktop>
        <Header.Container position="end">
          <Header.Actions>
            <Button icon="icon-[mdi--account]" theme="borderless" size="sm">
              Account
            </Button>
            <Button icon="icon-[mdi--cart]" theme="borderless" size="sm">
              Cart
            </Button>
          </Header.Actions>
        </Header.Container>
        <Header.Hamburger />

        <HeaderSubmenuDrawer.Content
          categories={categoriesWithDescriptions}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          layout="grid"
          gridCols={4}
        />
      </Header>
    )
  },
}

export const GridColumnsComparison: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**Grid column variations**: Comparison of different grid column counts.

Choose the right column count based on your number of categories and available space.
        `,
      },
    },
  },
  render: () => {
    const [drawer2Cols, setDrawer2Cols] = useState(false)
    const [drawer3Cols, setDrawer3Cols] = useState(false)
    const [drawer4Cols, setDrawer4Cols] = useState(false)

    return (
      <div className="flex flex-col gap-800">
        <div>
          <p className="mb-200 font-semibold">2 Columns</p>
          <Header>
            <Header.Desktop>
              <Header.Nav className="z-[100]">
                <HeaderSubmenuDrawer.Trigger
                  trigger="Categories"
                  open={drawer2Cols}
                  onOpenChange={setDrawer2Cols}
                />
              </Header.Nav>
            </Header.Desktop>
            <HeaderSubmenuDrawer.Content
              categories={basicCategories}
              open={drawer2Cols}
              onOpenChange={setDrawer2Cols}
              layout="grid"
              gridCols={2}
            />
          </Header>
        </div>

        <div>
          <p className="mb-200 font-semibold">3 Columns</p>
          <Header>
            <Header.Desktop>
              <Header.Nav className="z-[100]">
                <HeaderSubmenuDrawer.Trigger
                  trigger="Categories"
                  open={drawer3Cols}
                  onOpenChange={setDrawer3Cols}
                />
              </Header.Nav>
            </Header.Desktop>
            <HeaderSubmenuDrawer.Content
              categories={basicCategories}
              open={drawer3Cols}
              onOpenChange={setDrawer3Cols}
              layout="grid"
              gridCols={3}
            />
          </Header>
        </div>

        <div>
          <p className="mb-200 font-semibold">4 Columns</p>
          <Header>
            <Header.Desktop>
              <Header.Nav className="z-[100]">
                <HeaderSubmenuDrawer.Trigger
                  trigger="Categories"
                  open={drawer4Cols}
                  onOpenChange={setDrawer4Cols}
                />
              </Header.Nav>
            </Header.Desktop>
            <HeaderSubmenuDrawer.Content
              categories={basicCategories}
              open={drawer4Cols}
              onOpenChange={setDrawer4Cols}
              layout="grid"
              gridCols={4}
            />
          </Header>
        </div>
      </div>
    )
  },
}

export const Playground: Story = {
  name: '🎮 Interactive Playground',
  render: (args) => {
    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
      <Header>
        <Header.Desktop>
          <Header.Nav className="z-[100]">
            <Header.NavItem>
              <a href="/">Home</a>
            </Header.NavItem>
            <HeaderSubmenuDrawer.Trigger
              trigger={args.trigger}
              open={drawerOpen}
              onOpenChange={setDrawerOpen}
              showTriggerIcon={args.showTriggerIcon}
              triggerIcon={args.triggerIcon}
            />
            <Header.NavItem>
              <a href="/about">About</a>
            </Header.NavItem>
          </Header.Nav>
        </Header.Desktop>
        <Header.Container position="end">
          <Header.Actions>
            <Button icon="icon-[mdi--account]" theme="borderless" size="sm">
              Account
            </Button>
            <Button icon="icon-[mdi--cart]" theme="borderless" size="sm">
              Cart
            </Button>
          </Header.Actions>
        </Header.Container>
        <Header.Hamburger />

        <HeaderSubmenuDrawer.Content
          categories={args.categories}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          layout={args.layout}
          gridCols={args.gridCols}
          placement={args.placement}
          dialogClassName={args.dialogClassName}
        />
      </Header>
    )
  },
  args: {
    categories: expandedCategories,
    trigger: 'Shop All',
    layout: 'grid',
    gridCols: 4,
    placement: 'top',
    showTriggerIcon: true,
    triggerIcon: 'icon-[mdi--chevron-down]',
    dialogClassName: '-z-1 top-11 shadow-none',
  },
}
