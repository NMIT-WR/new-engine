import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../../src/atoms/button'
import { Icon, type IconType } from '../../src/atoms/icon'
import { Image } from '../../src/atoms/image'
import { Link } from '../../src/atoms/link'
import { SearchForm } from '../../src/molecules/search-form'
import { Header } from '../../src/organisms/header'

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
        <Button variant="primary" size="sm">
          Sign In
        </Button>
      </Header.Actions>
    </Header>
  ),
}

export const WithActiveState: Story = {
  render: () => (
    <Header>
      <Header.Nav>
        <Header.NavItem href="/" active>
          Home
        </Header.NavItem>
        <Header.NavItem href="/products">Products</Header.NavItem>
        <Header.NavItem href="/about">About</Header.NavItem>
        <Header.NavItem href="/contact">Contact</Header.NavItem>
      </Header.Nav>
      <Header.Actions>
        <Button variant="primary" size="sm">
          Sign In
        </Button>
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

/*
export const WithSubmenu: Story = {
  render: () => (
    <Header>
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
          <Header.NavItem href="/services/warranty">Warranty</Header.NavItem>
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
        <Button variant="primary" size="sm">
          Sign In
        </Button>
      </Header.Actions>
    </Header>
  ),
}

export const WithNestedSubmenu: Story = {
  render: () => (
    <Header>
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
          <Header.NavItem href="/shop/deals">Special Deals</Header.NavItem>
          <Header.NavItem href="/shop/clearance">Clearance</Header.NavItem>
        </Header.Submenu>

        <Header.Submenu trigger="Support">
          <Header.NavItem href="/support/contact">
            Contact Support
          </Header.NavItem>
          <Header.NavItem href="/support/faq">FAQ</Header.NavItem>
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
        <Button variant="primary" size="sm">
          Account
        </Button>
      </Header.Actions>
    </Header>
  ),
}
*/

export const N1Header: Story = {
  render: () => {
    const links = [
      {
        href: '/novinky',
        label: 'Novinky',
      },
      {
        href: '/pansky',
        label: 'Pánské',
      },
      {
        href: '/damsky',
        label: 'Dámské',
      },
      {
        href: '/detske',
        label: 'Dětské',
      },
      {
        href: '/oblecemo',
        label: 'Oblečení',
      },
      {
        href: '/cyklo',
        label: 'Cyklo',
      },
      {
        href: '/moto',
        label: 'Moto',
      },
      {
        href: '/snb-skate',
        label: 'Snb-Skate',
      },
      {
        href: '/ski',
        label: 'Ski',
      },
      {
        href: '/vyprodej',
        label: 'Výprodej',
      },
    ]

    const buttonIcons = [
      'icon-[mdi--heart]',
      'icon-[mdi--shopping-cart]',
      'icon-[mdi--account]',
    ]

    return (
      <Header direction="vertical" className="h-fit max-h-96 bg-red-200">
        <Header.Container className="bg-gray-700">
          <div className="flex gap-200">
            <span>office@n1shop.cz</span>
            <span>Obchodní podmínky</span>
            <span>Novinky</span>
            <span>Kontakty</span>
          </div>
          <div className="flex gap-200">
            <Icon icon="icon-[cif--cz]" />
            <Icon icon="icon-[cif--gb]" />
          </div>
        </Header.Container>
        <Header.Container className="bg-gray-950">
          <div className="gap-400">
            <Image
              src="https://www.n1shop.cz/data/upload/images/assets/logo-1.png"
              alt="N1 Shop Logo"
              width={200}
              height={100}
            />
            <SearchForm buttonIcon size="sm" />
          </div>
          <Header.Actions>
            {buttonIcons.map((icon) => (
              <Button
                key={icon}
                theme="borderless"
                variant="primary"
                icon={icon as IconType}
                size="sm"
                className="px-0 text-2xl hover:bg-transparent"
              />
            ))}
          </Header.Actions>
        </Header.Container>

        <Header.Container className="border-gray-400 border-t bg-gray-950">
          <Header.Nav className="gap-x-0 px-0">
            {links.map((link) => (
              <Header.NavItem
                key={link.href}
                className="p-200 hover:bg-yellow-400 hover:text-black"
              >
                <Link href={link.href}>{link.label}</Link>
              </Header.NavItem>
            ))}
          </Header.Nav>
        </Header.Container>
      </Header>
    )
  },
}
