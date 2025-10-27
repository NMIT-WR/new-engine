import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from '../../src/atoms/button'
import { Icon, type IconType } from '../../src/atoms/icon'
import { Image } from '../../src/atoms/image'
import { Link } from '../../src/atoms/link'
import { Dialog } from '../../src/molecules/dialog'
import { Popover } from '../../src/molecules/popover'
import { SearchForm } from '../../src/molecules/search-form'
import { Header } from '../../src/organisms/header'
import { Accordion } from '../../src/molecules/accordion'

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
      <Header.Hamburger />
      <Header.Nav>
        <Header.NavItem>
          <Link href="/">Home</Link>
        </Header.NavItem>
        <Header.NavItem>
          <Link href="/products">Products</Link>
        </Header.NavItem>
        <Header.NavItem>
          <Link href="/about">About</Link>
        </Header.NavItem>
        <Header.NavItem>
          <Link href="/contact">Contact</Link>
        </Header.NavItem>
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
      <Header.Hamburger />
      <Header.Nav>
        <Header.NavItem active>
          <Link href="/">Home</Link>
        </Header.NavItem>
        <Header.NavItem>
          <Link href="/products">Products</Link>
        </Header.NavItem>
        <Header.NavItem>
          <Link href="/about">About</Link>
        </Header.NavItem>
        <Header.NavItem>
          <Link href="/contact">Contact</Link>
        </Header.NavItem>
      </Header.Nav>
      <Header.Actions>
        <Button variant="primary" size="sm">
          Sign In
        </Button>
      </Header.Actions>
    </Header>
  ),
}

export const PersistActionsBox: Story = {
  render: () => (
    <Header>
      <Header.Desktop>
        <Header.Nav>
          <Header.NavItem active>
            <Link href="/">Home</Link>
          </Header.NavItem>
          <Header.NavItem><Link href="/products">Products</Link></Header.NavItem>
          <Header.NavItem><Link href="/about">About</Link></Header.NavItem>
          <Header.NavItem><Link href="/contact">Contact</Link></Header.NavItem>
        </Header.Nav>
      </Header.Desktop>
      <Header.Mobile>
        <Header.Nav>
          <Header.NavItem active>
            <Link href="/">Home</Link>
          </Header.NavItem>
          <Header.NavItem><Link href="/products">Products</Link></Header.NavItem>
          <Header.NavItem><Link href="/about">About</Link></Header.NavItem>
          <Header.NavItem><Link href="/contact">Contact</Link></Header.NavItem>
        </Header.Nav>
      </Header.Mobile>
      <Header.Container position='end'>
      <Header.Hamburger />
      <Header.Actions>
        <Button variant="primary" size="sm">
          Sign In
        </Button>
      </Header.Actions>
      </Header.Container>
    </Header>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-300">
      <div>
        <p className="mb-100 text-fg-muted">Small</p>
        <Header size="sm">
          <Header.Hamburger />
          <Header.Nav>
            <Header.NavItem><Link href="/">Home</Link></Header.NavItem>
            <Header.NavItem><Link href="/products">Products</Link></Header.NavItem>
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
          <Header.Hamburger />
          <Header.Nav>
            <Header.NavItem><Link href="/">Home</Link></Header.NavItem>
            <Header.NavItem><Link href="/products">Products</Link></Header.NavItem>
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
            <Header.NavItem><Link href="/">Home</Link></Header.NavItem>
            <Header.NavItem><Link href="/products">Products</Link></Header.NavItem>
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

export const NavWithMobileSubmenu: Story = {
  render: () => {
    return (
      <Header>
        <Header.Hamburger />
        <Header.Desktop>
          <Header.Nav>
            <Header.NavItem><Link href="/">Home</Link></Header.NavItem>
            <Popover
              trigger={
                <Header.NavItem>
                <span>Electronics</span>
                <Icon icon="icon-[mdi--chevron-down]" />
              </Header.NavItem>
            }
            placement="bottom"
            size="sm"
            triggerClassName="text-fg-primary hover:bg-transparent"
          >
            <Header.NavItem>
              <Link href="/products/electronics">Electronics</Link>
            </Header.NavItem>
            <Header.NavItem>
              <Link href="/products/clothing">Clothing & Fashion</Link>
            </Header.NavItem>
            <Header.NavItem>
              <Link href="/products/home-garden">Home & Garden</Link>
            </Header.NavItem>
            <Header.NavItem>
              <Link href="/products/sports">Sports & Outdoors</Link>
            </Header.NavItem>
          </Popover>
          <Header.NavItem><Link href="/about">About</Link></Header.NavItem>
          <Header.NavItem><Link href="/contact">Contact</Link></Header.NavItem>
          </Header.Nav>
        </Header.Desktop>
        <Header.Actions>
          <Button variant="primary" size="sm">
            Sign In
          </Button>
        </Header.Actions>
        <Header.Mobile position='left'>
          <Accordion variant='child'>
            <Accordion.Item value="home">
              <Header.NavItem><Link href="/">Home</Link></Header.NavItem>
            </Accordion.Item>
            <Accordion.Item value="electronics">
              <Accordion.Header>
                <Header.NavItem>
                  <Link href="/products/electronics">Electronics</Link>
                </Header.NavItem>
                <Accordion.Indicator />
              </Accordion.Header>
              <Accordion.Content className='px-0'>
                  <Header.NavItem>
                    <Link href="/products/clothing">Clothing</Link>
                  </Header.NavItem>
                  <Header.NavItem>
                    <Link href="/products/home-garden">Garden</Link>
                  </Header.NavItem>
                  <Header.NavItem>
                    <Link href="/products/sports">Sports</Link>
                  </Header.NavItem>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="about">
              <Header.NavItem><Link href="/about">About</Link></Header.NavItem>
            </Accordion.Item>
            <Accordion.Item value="contact">
              <Header.NavItem><Link href="/contact">Contact</Link></Header.NavItem>
            </Accordion.Item>
          </Accordion>
        </Header.Mobile>
      </Header>
    )
  }
}

export const WithPopoverSubmenu: Story = {
  render: () => (
    <Header>
      <Header.Hamburger />
      <Header.Nav>
        <Header.NavItem><Link href="/">Home</Link></Header.NavItem>
        <Popover
          trigger={
            <Header.NavItem>
              <span>Electronics</span>
              <Icon icon="icon-[mdi--chevron-down]" />
            </Header.NavItem>
          }
          placement="bottom"
          size="sm"
          triggerClassName="text-fg-primary hover:bg-transparent"
        >
          <Header.NavItem>
            <Link href="/products/electronics">Electronics</Link>
          </Header.NavItem>
          <Header.NavItem>
            <Link href="/products/clothing">Clothing & Fashion</Link>
          </Header.NavItem>
          <Header.NavItem>
            <Link href="/products/home-garden">Home & Garden</Link>
          </Header.NavItem>
          <Header.NavItem>
            <Link href="/products/sports">Sports & Outdoors</Link>
          </Header.NavItem>
        </Popover>
        <Popover
          trigger={
            <Header.NavItem>
              <span>Services</span>
              <Icon icon="icon-[mdi--chevron-down]" />
            </Header.NavItem>
          }
          placement="bottom"
          triggerClassName="text-fg-primary hover:bg-transparent"
        >
          <Header.NavItem>
            <Link href="/services/shipping">Shipping Info</Link>
          </Header.NavItem>
          <Header.NavItem>
            <Link href="/services/returns">Returns & Exchanges</Link>
          </Header.NavItem>
          <Header.NavItem><Link href="/services/warranty">Warranty</Link></Header.NavItem>
        </Popover>
        <Header.NavItem><Link href="/about">About</Link></Header.NavItem>
        <Header.NavItem><Link href="/contact">Contact</Link></Header.NavItem>
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
      <Header.Hamburger />
      <Header.Nav>
        <Header.NavItem><Link href="/">Home</Link></Header.NavItem>

        <Popover
          trigger={
            <Header.NavItem>
              <span>Shop</span>
              <Icon icon="icon-[mdi--chevron-down]" />
            </Header.NavItem>
          }
          placement="bottom"
          triggerClassName="text-fg-primary hover:bg-transparent"
        >
          <Header.NavItem>
            <Link href="/shop/new-arrivals">New Arrivals</Link>
          </Header.NavItem>
          <Header.NavItem>
            <Link href="/shop/best-sellers">Best Sellers</Link>
          </Header.NavItem>

          <Popover
            trigger={
              <Header.NavItem>
                <span>Categories</span>
                <Icon icon="icon-[mdi--chevron-down]" />
              </Header.NavItem>
            }
            placement="right-start"
            triggerClassName="text-fg-primary px-0 py-0 hover:bg-transparent"
          >
            <Header.NavItem>
              <Link href="/shop/categories/laptops">Laptops & Computers</Link>
            </Header.NavItem>
            <Header.NavItem>
              <Link href="/shop/categories/phones">Phones & Tablets</Link>
            </Header.NavItem>

            <Popover
              trigger={
                <Header.NavItem>
                  <span>Accessories</span>
                  <Icon icon="icon-[mdi--chevron-down]" />
                </Header.NavItem>
              }
              placement="right-start"
              triggerClassName="text-fg-primary px-0 py-0 hover:bg-transparent"
            >
              <Header.NavItem>
                <Link href="/shop/accessories/cases">Cases & Covers</Link>
              </Header.NavItem>
              <Header.NavItem>
                <Link href="/shop/accessories/chargers">Chargers & Cables</Link>
              </Header.NavItem>
              <Header.NavItem>
                <Link href="/shop/accessories/headphones">Headphones</Link>
              </Header.NavItem>
            </Popover>

            <Header.NavItem>
              <Link href="/shop/categories/gaming">Gaming</Link>
            </Header.NavItem>
          </Popover>

          <Header.NavItem><Link href="/shop/deals">Special Deals</Link></Header.NavItem>
          <Header.NavItem><Link href="/shop/clearance">Clearance</Link></Header.NavItem>
        </Popover>

        <Popover
          trigger={
            <Header.NavItem>
              <span>Support</span>
              <Icon icon="icon-[mdi--chevron-down]" />
            </Header.NavItem>
          }
          placement="bottom"
          triggerClassName="text-fg-primary hover:bg-transparent"
        >
          <Header.NavItem>
            <Link href="/support/contact">Contact Support</Link>
          </Header.NavItem>
          <Header.NavItem><Link href="/support/faq">FAQ</Link></Header.NavItem>

          <Popover
            trigger={
              <Header.NavItem>
                <span>Resources</span>
                <Icon icon="icon-[mdi--chevron-down]" />
              </Header.NavItem>
            }
            placement="right-start"
            triggerClassName="text-fg-primary px-0 py-0 hover:bg-transparent"
          >
            <Header.NavItem>
              <Link href="/resources/guides">User Guides</Link>
            </Header.NavItem>
            <Header.NavItem>
              <Link href="/resources/videos">Video Tutorials</Link>
            </Header.NavItem>
            <Header.NavItem>
              <Link href="/resources/downloads">Downloads</Link>
            </Header.NavItem>
          </Popover>
        </Popover>

        <Header.NavItem><Link href="/about">About</Link></Header.NavItem>
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

    const handleNavClick = () => {
      setDrawerOpen(prev => !prev)
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
        <Header.Hamburger />
        <Header.Nav>
          <Header.NavItem><Link href="/novinky">Novinky</Link></Header.NavItem>
          <Header.NavItem><Link href="/panske">Pánské</Link></Header.NavItem>
          <Header.NavItem><Link href="/damske">Dámské</Link></Header.NavItem>
          <Header.NavItem>
            <Button className='hover:bg-transparent px-0 py-0' theme="borderless" onClick={handleNavClick} icon="icon-[mdi--chevron-down]">
              Dětské
            </Button>
          </Header.NavItem>
          <Header.NavItem><Link href="/obleceni">Oblečení</Link></Header.NavItem>
          <Header.NavItem><Link href="/cyklo">Cyklo</Link></Header.NavItem>

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
          customTrigger
          placement="top"
          size="xs"
          hideCloseButton
          behavior="modeless"
          className="top-10"
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
      <Header direction="vertical" className="z-50 flex h-fit max-h-96">
        <Header.Container className="bg-gray-700 justify-between items-center">
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
        <Header.Container className="bg-gray-950 justify-between p-200">
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
