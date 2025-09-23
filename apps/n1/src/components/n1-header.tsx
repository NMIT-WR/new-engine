'use client'
import { footerImgs } from '@/assets/footer'
import { Button } from '@new-engine/ui/atoms/button'
import { Icon, type IconType } from '@new-engine/ui/atoms/icon'
import { Dialog } from '@new-engine/ui/molecules/dialog'
import { SearchForm } from '@new-engine/ui/molecules/search-form'
import { Header } from '@new-engine/ui/organisms/header'
import Image from 'next/image'
import { useState } from 'react'

export const N1Header = () => {
  type SubmenuCategory = {
    name: string
    href: string
    items: string[]
  }
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<SubmenuCategory | null>(
    null
  )

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
            src={footerImgs.footerLogo}
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
    </Header>
  )
}
