import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from '../../src/atoms/button'
import { Icon, type IconType } from '../../src/atoms/icon'
import { Image } from '../../src/atoms/image'
import { Dialog } from '../../src/molecules/dialog'
import { Popover } from '../../src/molecules/popover'
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
    <div className="flex flex-col gap-300">
      <div>
        <p className="mb-100 text-fg-muted">Small</p>
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
        <p className="mb-100 text-fg-muted">Medium (Default)</p>
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
        <p className="mb-s100 text-fg-muted">Large</p>
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

export const WithPopoverSubmenu: Story = {
  render: () => (
    <Header>
      <Header.Nav>
        <Header.NavItem href="/">Home</Header.NavItem>
        <Popover
          trigger={
            <Header.NavItem href="/products/electronics">
              <span>Electronics</span>
              <Icon icon="icon-[mdi--chevron-down]" />
            </Header.NavItem>
          }
          placement="bottom"
          size="sm"
          triggerClassName="text-fg-primary hover:bg-transparent"
        >
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
        </Popover>
        <Popover
          trigger={
            <Header.NavItem href="/products/electronics">
              <span>Services</span>
              <Icon icon="icon-[mdi--chevron-down]" />
            </Header.NavItem>
          }
          placement="bottom"
          triggerClassName="text-fg-primary hover:bg-transparent"
        >
          <Header.NavItem href="/services/shipping">
            Shipping Info
          </Header.NavItem>
          <Header.NavItem href="/services/returns">
            Returns & Exchanges
          </Header.NavItem>
          <Header.NavItem href="/services/warranty">Warranty</Header.NavItem>
        </Popover>
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

export const WithNestedPopoverSubmenu: Story = {
  render: () => (
    <Header>
      <Header.Nav>
        <Header.NavItem href="/">Home</Header.NavItem>

        <Popover
          trigger={
            <Header.NavItem href="/shop/new-arrivals">
              <span>Shop</span>
              <Icon icon="icon-[mdi--chevron-down]" />
            </Header.NavItem>
          }
          placement="bottom"
          triggerClassName="text-fg-primary hover:bg-transparent"
        >
          <Header.NavItem href="/shop/new-arrivals">
            New Arrivals
          </Header.NavItem>
          <Header.NavItem href="/shop/best-sellers">
            Best Sellers
          </Header.NavItem>

          <Popover
            trigger={
              <Header.NavItem href="/shop/categories/laptops">
                <span>Categories</span>
                <Icon icon="icon-[mdi--chevron-down]" />
              </Header.NavItem>
            }
            placement="right-start"
            triggerClassName="text-fg-primary px-0 py-0 hover:bg-transparent"
          >
            <Header.NavItem href="/shop/categories/laptops">
              Laptops & Computers
            </Header.NavItem>
            <Header.NavItem href="/shop/categories/phones">
              Phones & Tablets
            </Header.NavItem>

            <Popover
              trigger={
                <Header.NavItem href="/shop/accessories/cases">
                  <span>Accessories</span>
                  <Icon icon="icon-[mdi--chevron-down]" />
                </Header.NavItem>
              }
              placement="right-start"
              triggerClassName="text-fg-primary px-0 py-0 hover:bg-transparent"
            >
              <Header.NavItem href="/shop/accessories/cases">
                Cases & Covers
              </Header.NavItem>
              <Header.NavItem href="/shop/accessories/chargers">
                Chargers & Cables
              </Header.NavItem>
              <Header.NavItem href="/shop/accessories/headphones">
                Headphones
              </Header.NavItem>
            </Popover>

            <Header.NavItem href="/shop/categories/gaming">
              Gaming
            </Header.NavItem>
          </Popover>

          <Header.NavItem href="/shop/deals">Special Deals</Header.NavItem>
          <Header.NavItem href="/shop/clearance">Clearance</Header.NavItem>
        </Popover>

        <Popover
          trigger={
            <Header.NavItem href="/support/contact">
              <span>Support</span>
              <Icon icon="icon-[mdi--chevron-down]" />
            </Header.NavItem>
          }
          placement="bottom"
          triggerClassName="text-fg-primary hover:bg-transparent"
        >
          <Header.NavItem href="/support/contact">
            Contact Support
          </Header.NavItem>
          <Header.NavItem href="/support/faq">FAQ</Header.NavItem>

          <Popover
            trigger={
              <Header.NavItem href="/support/resources">
                <span>Resources</span>
                <Icon icon="icon-[mdi--chevron-down]" />
              </Header.NavItem>
            }
            placement="right-start"
            triggerClassName="text-fg-primary px-0 py-0 hover:bg-transparent"
          >
            <Header.NavItem href="/resources/guides">
              User Guides
            </Header.NavItem>
            <Header.NavItem href="/resources/videos">
              Video Tutorials
            </Header.NavItem>
            <Header.NavItem href="/resources/downloads">
              Downloads
            </Header.NavItem>
          </Popover>
        </Popover>

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

export const HeaderWithDrawerSubmenu: Story = {
  render: () => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState('')

    const handleNavClick = (category: string) => {
      setActiveCategory(category)
      if (drawerOpen) {
        setDrawerOpen(false)
      } else {
        setDrawerOpen(true)
      }
    }

    const submenuItems = [
      {
        name: 'Oblečení',
        icon: 'icon-[mdi--t-shirt-crew]',
      },
      {
        name: 'Cyklo',
        icon: 'icon-[mdi--bicycle]',
      },
      {
        name: 'Moto',
        icon: 'icon-[mdi--motorcycle]',
      },
      {
        name: 'Snb-Skate',
        icon: 'icon-[mdi--skate]',
      },
      {
        name: 'Ski',
        icon: 'icon-[mdi--ski]',
      },
    ]

    return (
      <Header className="z-50">
        <Header.Nav>
          <Header.NavItem href="/novinky">Novinky</Header.NavItem>
          <Header.NavItem href="/panske">Pánské</Header.NavItem>
          <Header.NavItem href="/damske">Dámské</Header.NavItem>
          <Header.NavItem onClick={() => handleNavClick('Dětské')}>
            <span>Dětské</span>
            <Icon icon="icon-[mdi--chevron-down]" />
          </Header.NavItem>
          <Header.NavItem href="/obleceni">Oblečení</Header.NavItem>
          <Header.NavItem href="/cyklo">Cyklo</Header.NavItem>
          <Header.NavItem href="/moto">Moto</Header.NavItem>
          <Header.NavItem href="/snb-skate">Snb-Skate</Header.NavItem>
          <Header.NavItem href="/ski">Ski</Header.NavItem>
          <Header.NavItem href="/vyprodej">Výprodej</Header.NavItem>
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
        <Dialog
          open={drawerOpen}
          onOpenChange={({ open }) => setDrawerOpen(open)}
          customTrigger
          placement="top"
          size="xs"
          hideCloseButton
          behavior="modeless"
          className="top-16"
          modal={false}
        >
          <div className="flex items-center justify-evenly">
            {submenuItems.map((item) => (
              <div
                key={item.name}
                className="flex cursor-pointer flex-col items-center gap-100 hover:opacity-75"
                onClick={() => setDrawerOpen(false)}
              >
                <Icon icon={item.icon} className="text-2xl" />
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </Dialog>
      </Header>
    )
  },
}

export const N1Header: Story = {
  render: () => {
    type SubmenuCategory = {
      name: string
      href: string
      items: string[]
    }
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [activeCategory, setActiveCategory] =
      useState<SubmenuCategory | null>(null)

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

    const submenuItems = [
      {
        name: 'Pánské',
        href: '/panske',
        items: ['Oblečení', 'Cyklo', 'Moto', 'Snb-Skate', 'Ski'],
      },
      {
        name: 'Dámské',
        href: '/damske',
        items: ['Oblečení', 'Cyklo', 'Moto', 'Snb-Skate', 'Ski'],
      },
      {
        name: 'Dětské',
        href: '/detske',
        items: ['Oblečení', 'Cyklo', 'Moto', 'Snb-Skate', 'Ski'],
      },
      {
        name: 'Oblečení',
        href: '/obleceni',
        items: [
          'Bundy',
          'Mikiny',
          'Svetry',
          'Košile',
          'Trika a tílka',
          'Kalhoty',
          'Kraťasy',
          'Plavky',
          'Brýle',
          'Šaty a Sukně',
          'Doplňky',
        ],
      },
      {
        name: 'Cyklo',
        href: '/cyklo',
        items: [
          'Kola',
          'Elektrokola',
          'Oblečení',
          'Přilby',
          'Chrániče',
          'Sedla',
          'Zapletená kola',
        ],
      },
      {
        name: 'Moto',
        href: '/moto',
        items: ['Přilby', 'Boty', 'Oblečení', 'Chrániče', 'Brýle', 'Doplňky'],
      },
      {
        name: 'Snb-Skate',
        href: '/snb-skate',
        items: ['Skateboarding', 'Snowboarding', 'Brusle'],
      },
      {
        name: 'Ski',
        href: '/ski',
        items: ['Oblečení', 'Doplňky'],
      },
    ]

    const buttonIcons = [
      'icon-[mdi--heart]',
      'icon-[mdi--shopping-cart]',
      'icon-[mdi--account]',
    ]

    const handleOpenSubmenu = (categoryName: string) => {
      if (drawerOpen) {
        setDrawerOpen(false)
        return
      }

      const category = submenuItems.find((item) => item.name === categoryName)

      if (!category) {
        return
      }

      setActiveCategory(category)
      setDrawerOpen(true)
    }

    return (
      <div className='min-h-[150rem]'>
      <Header direction="vertical" className="z-50 h-fit max-h-96">
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
          <div className="flex gap-950">
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
                className="px-0 py-0 text-2xl hover:bg-transparent"
              />
            ))}
          </Header.Actions>
        </Header.Container>

        <Header.Container className="border-gray-400 border-t bg-gray-950">
          <Header.Nav className="gap-x-0 px-0 py-0">
            {links.map((link) => (
              <Header.NavItem
                key={link.href}
                onClick={() => handleOpenSubmenu(link.label)}
                className="p-200 hover:bg-yellow-400 hover:text-black"
              >
                {link.label}
              </Header.NavItem>
            ))}
          </Header.Nav>
        </Header.Container>
        <Dialog
          open={drawerOpen}
          //onOpenChange={({ open }) => setDrawerOpen(open)}
          customTrigger
          placement="top"
          size="xs"
          hideCloseButton
          behavior="modeless"
          className="top-[9rem]"
          modal={false}
          preventScroll={false}
        >
          <div className="grid grid-cols-6 items-center justify-center gap-200 p-200">
            <h2>{activeCategory?.name}</h2>
            {activeCategory?.items.map((item) => (
              <Header.NavItem className="text-sm" key={item}>
                {item}
              </Header.NavItem>
            ))}
          </div>
        </Dialog>
      </Header></div>
    )
  },
}
