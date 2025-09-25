'use client'
import { footerImgs } from '@/assets/footer'
import { type SubmenuCategory, links, submenuItems } from '@/data/header'
import { Icon, type IconType } from '@new-engine/ui/atoms/icon'
import { Link } from '@new-engine/ui/atoms/link'
import { LinkButton } from '@new-engine/ui/atoms/link-button'
import { Dialog } from '@new-engine/ui/molecules/dialog'
import { SearchForm } from '@new-engine/ui/molecules/search-form'
import { Header } from '@new-engine/ui/organisms/header'
import Image from 'next/image'
import NextLink from 'next/link'
import { useState } from 'react'

export const N1Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<SubmenuCategory | null>(
    null
  )

  const headerActionButtons = [
    {
      icon: 'icon-[mdi--heart-outline]',
      href: '/oblibene',
    },
    {
      icon: 'icon-[mdi--account-outline]',
      href: '/profil',
    },
    {
      icon: 'icon-[mdi--shopping-cart-outline]',
      children: 'Košík',
      href: '/kosik',
    },
  ]

  const topHeaderLinks = [
    {
      href: '/obchodni-podminky',
      label: 'Obchodní podmínky',
    },
    {
      href: '/novinky',
      label: 'Novinky',
    },
    {
      href: '/kontakty',
      label: 'Kontakty',
    },
  ]

  const handleOpenSubmenu = (categoryName: string) => {
    const category = submenuItems.find((item) => item.name === categoryName)

    if (!category) {
      setDrawerOpen(false)
      return
    }

    setActiveCategory(category)
    setDrawerOpen(true)
  }

  return (
    <Header direction="vertical" className="z-50 h-fit max-h-96">
      <Header.Container className="items-center bg-highlight px-400 py-150">
        <div className="flex items-center gap-200 font-normal text-[12.6px] text-fg-reverse">
          <Link as={NextLink} href="mailto:office@n1shop.cz">
            <Icon icon="icon-[mdi--email-outline]" className="mr-200" />
            <span className="hover:text-primary hover:underline">
              office@n1shop.cz
            </span>
          </Link>
          <span className="h-1.5 w-1.5 bg-secondary" />
          {topHeaderLinks.map((link) => (
            <Link
              key={link.href}
              as={NextLink}
              href={link.href}
              className="hover:text-primary hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex gap-200">
          <Icon icon="icon-[cif--cz]" />
          <Icon icon="icon-[cif--gb]" />
        </div>
      </Header.Container>
      <Header.Container className="z-40 bg-gray-950 px-500 py-300">
        <div className="flex h-full items-center gap-750">
          <Image
            src={footerImgs.footerLogo}
            alt="N1 Shop Logo"
            width={250}
            height={2500}
          />
          <SearchForm buttonIcon size="sm" className="w-[40vw]" />
        </div>
        <Header.Actions>
          {headerActionButtons.map((button) => (
            <LinkButton
              key={button.href}
              theme="borderless"
              variant="primary"
              size="current"
              href={button.href}
              className="gap-x-300 px-0 py-0 text-2xl text-fg-reverse hover:bg-transparent hover:text-primary"
            >
              {<Icon icon={button.icon as IconType} />}
              {button.children && (
                <span className="font-bold text-md">{button.children}</span>
              )}
            </LinkButton>
          ))}
        </Header.Actions>
      </Header.Container>

      <div className="w-full" onMouseLeave={() => setDrawerOpen(false)}>
        <Header.Container className="w-full border-highlight border-t-[1px] bg-gray-950 py-0">
          <Header.Nav className="z-30 gap-x-0 px-0 py-0">
            {links.map((link) => (
              <Header.NavItem
                key={link.href}
                onMouseEnter={() => handleOpenSubmenu(link.label)}
                className="group px-300 py-300 hover:bg-yellow-400"
              >
                <Link
                  as={NextLink}
                  href={link.href}
                  className="font-bold text-fg-reverse group-hover:text-black"
                >
                  {link.label}
                </Link>
              </Header.NavItem>
            ))}
          </Header.Nav>
        </Header.Container>

        <Dialog
          open={drawerOpen}
          customTrigger
          placement="top"
          position="absolute"
          size="xs"
          hideCloseButton
          behavior="modeless"
          className="top-full grid grid-rows-[1fr] starting:grid-rows-[0fr] bg-white shadow-none transition-all duration-500 ease-out"
          modal={false}
          trapFocus={false}
          preventScroll={false}
          closeOnInteractOutside={true}
          portal={false}
        >
          <div className="overflow-hidden">
            <div className="grid grid-cols-6 gap-200">
              {activeCategory?.items.map((item) => (
                <Header.NavItem className="text-sm" key={item.name}>
                  <div className="grid h-full items-center justify-center border border-transparent hover:border-border-primary">
                    <div className="flex flex-col items-center gap-200">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={100}
                          height={100}
                          quality={50}
                          className="h-[100px] w-full object-contain"
                        />
                      )}
                      <h3 className="font-bold text-md">{item.name}</h3>
                    </div>
                  </div>
                </Header.NavItem>
              ))}
            </div>
          </div>
        </Dialog>
      </div>
    </Header>
  )
}
