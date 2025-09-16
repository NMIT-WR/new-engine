import type { Meta, StoryObj } from '@storybook/react'
import { Header } from '../../src/organisms/header'
import { Button } from '../../src/atoms/button'
import { Icon } from '../../src/atoms/icon'

const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Header>

export const Default: Story = {
  render: () => (
    <Header>
      <Header.Brand>My Brand</Header.Brand>
      <Header.Nav>
        <Header.NavItem href="/">Home</Header.NavItem>
        <Header.NavItem href="/products">Products</Header.NavItem>
        <Header.NavItem href="/about">About</Header.NavItem>
        <Header.NavItem href="/contact">Contact</Header.NavItem>
      </Header.Nav>
      <Header.Actions>
        <Button theme="borderless" variant="primary" size="sm">
          <Icon icon="icon-[lucide--search]" />
        </Button>
        <Button theme="borderless" variant="primary" size="sm">
          <Icon icon="icon-[lucide--shopping-cart]" />
        </Button>
        <Button variant="primary" size="sm">Sign In</Button>
      </Header.Actions>
    </Header>
  ),
}

export const Transparent: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-secondary">
      <Header variant="transparent">
        <Header.Brand>My Brand</Header.Brand>
        <Header.Nav>
          <Header.NavItem href="/">Home</Header.NavItem>
          <Header.NavItem href="/products">Products</Header.NavItem>
          <Header.NavItem href="/about">About</Header.NavItem>
        </Header.Nav>
        <Header.Actions>
          <Button theme="borderless" variant="primary" size="sm">
            <Icon icon="icon-[lucide--user]" />
          </Button>
        </Header.Actions>
      </Header>
      <div className="p-lg">
        <h1 className="text-2xl font-bold text-fg-primary">Page Content</h1>
        <p className="text-fg-secondary mt-md">This header has a transparent background.</p>
      </div>
    </div>
  ),
}



export const WithActiveState: Story = {
  render: () => (
    <Header>
      <Header.Brand>Navigation States</Header.Brand>
      <Header.Nav>
        <Header.NavItem href="/" active>Home</Header.NavItem>
        <Header.NavItem href="/products">Products</Header.NavItem>
        <Header.NavItem href="/about">About</Header.NavItem>
        <Header.NavItem href="/contact">Contact</Header.NavItem>
      </Header.Nav>
      <Header.Actions>
        <Button variant="primary" size="sm">Sign In</Button>
      </Header.Actions>
    </Header>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-lg">
      <div>
        <p className="mb-sm text-fg-muted">Small</p>
        <Header size="sm">
          <Header.Brand>Small Header</Header.Brand>
          <Header.Nav>
            <Header.NavItem href="/">Home</Header.NavItem>
            <Header.NavItem href="/products">Products</Header.NavItem>
          </Header.Nav>
          <Header.Actions size="sm">
            <Button theme="borderless" size="sm">
              <Icon icon="icon-[lucide--user]" />
            </Button>
          </Header.Actions>
        </Header>
      </div>

      <div>
        <p className="mb-sm text-fg-muted">Medium (Default)</p>
        <Header size="md">
          <Header.Brand>Medium Header</Header.Brand>
          <Header.Nav>
            <Header.NavItem href="/">Home</Header.NavItem>
            <Header.NavItem href="/products">Products</Header.NavItem>
          </Header.Nav>
          <Header.Actions size="md">
            <Button theme="borderless" variant="primary" size="md">
              <Icon icon="icon-[lucide--user]" />
            </Button>
          </Header.Actions>
        </Header>
      </div>

      <div>
        <p className="mb-sm text-fg-muted">Large</p>
        <Header size="lg">
          <Header.Brand>Large Header</Header.Brand>
          <Header.Nav>
            <Header.NavItem href="/">Home</Header.NavItem>
            <Header.NavItem href="/products">Products</Header.NavItem>
          </Header.Nav>
          <Header.Actions size="lg">
            <Button theme="borderless" variant="primary" size="lg">
              <Icon icon="icon-[lucide--user]" />
            </Button>
          </Header.Actions>
        </Header>
      </div>
    </div>
  ),
}

export const WithSubmenu: Story = {
  render: () => (
    <Header>
      <Header.Brand>My Shop</Header.Brand>
      <Header.Nav>
        <Header.NavItem href="/">Home</Header.NavItem>

        <Header.Submenu trigger="Products">
          <Header.NavItem href="/products/electronics">
            Electronics
          </Header.NavItem>
          <Header.NavItem href="/products/clothing">
            Clothing & Fashion
          </Header.NavItem>
          <Header.NavItem href="/products/home-garden">
            Home & Garden
          </Header.NavItem>
          <Header.NavItem href="/products/sports">
            Sports & Outdoors
          </Header.NavItem>
        </Header.Submenu>

        <Header.Submenu trigger="Services">
          <Header.NavItem href="/services/shipping">
            Shipping Info
          </Header.NavItem>
          <Header.NavItem href="/services/returns">
            Returns & Exchanges
          </Header.NavItem>
          <Header.NavItem href="/services/warranty">
            Warranty
          </Header.NavItem>
        </Header.Submenu>

        <Header.NavItem href="/about">About</Header.NavItem>
        <Header.NavItem href="/contact">Contact</Header.NavItem>
      </Header.Nav>
      <Header.Actions>
        <Button theme="borderless" variant="primary" size="sm">
          <Icon icon="icon-[lucide--search]" />
        </Button>
        <Button theme="borderless" variant="primary" size="sm">
          <Icon icon="icon-[lucide--shopping-cart]" />
        </Button>
        <Button variant="primary" size="sm">Sign In</Button>
      </Header.Actions>
    </Header>
  ),
}

export const WithNestedSubmenu: Story = {
  render: () => (
    <Header>
      <Header.Brand>Tech Store</Header.Brand>
      <Header.Nav>
        <Header.NavItem href="/">Home</Header.NavItem>

        <Header.Submenu trigger="Shop">
            <Header.NavItem href="/shop/new-arrivals">
              New Arrivals
            </Header.NavItem>
            <Header.NavItem href="/shop/best-sellers">
              Best Sellers
            </Header.NavItem>
            <Header.Submenu trigger="Categories" placement="right-start">
              <Header.NavItem href="/shop/categories/laptops">
                Laptops & Computers
              </Header.NavItem>
              <Header.NavItem href="/shop/categories/phones">
                Phones & Tablets
              </Header.NavItem>
              <Header.Submenu trigger="Accessories" placement="right-start">
                  <Header.NavItem href="/shop/accessories/cases">
                    Cases & Covers
                  </Header.NavItem>
                  <Header.NavItem href="/shop/accessories/chargers">
                    Chargers & Cables
                  </Header.NavItem>
                  <Header.NavItem href="/shop/accessories/headphones">
                    Headphones
                  </Header.NavItem>
              </Header.Submenu>
              <Header.NavItem href="/shop/categories/gaming">
                Gaming
              </Header.NavItem>
            </Header.Submenu>
            <Header.NavItem href="/shop/deals">
              Special Deals
            </Header.NavItem>
            <Header.NavItem href="/shop/clearance">
              Clearance
            </Header.NavItem>
        </Header.Submenu>

        <Header.Submenu trigger="Support">
            <Header.NavItem href="/support/contact">
              Contact Support
            </Header.NavItem>
            <Header.NavItem href="/support/faq">
              FAQ
            </Header.NavItem>
            <Header.Submenu trigger="Resources" placement="right-start">
              <Header.NavItem href="/resources/guides">
                User Guides
              </Header.NavItem>
              <Header.NavItem href="/resources/videos">
                Video Tutorials
              </Header.NavItem>
              <Header.NavItem href="/resources/downloads">
                Downloads
              </Header.NavItem>
            </Header.Submenu>
        </Header.Submenu>

        <Header.NavItem href="/about">About</Header.NavItem>
      </Header.Nav>
      <Header.Actions>
        <Button variant="primary" size="sm">Account</Button>
      </Header.Actions>
    </Header>
  ),
}