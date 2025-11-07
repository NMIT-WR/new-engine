'use client'
import { footerImgs } from '@/assets/footer'
import { Badge } from '@new-engine/ui/atoms/badge'
import { Icon, type IconType } from '@new-engine/ui/atoms/icon'
import { Link } from '@new-engine/ui/atoms/link'
import { LinkButton } from '@new-engine/ui/atoms/link-button'
import { SearchForm } from '@new-engine/ui/molecules/search-form'
import { Header } from '@new-engine/ui/organisms/header'
import Image from 'next/image'
import NextLink from 'next/link'
import { DesktopSubmenu } from './desktop-submenu'
import { MobileMenu } from './mobile-menu'

export const N1Header = () => {
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
      badge: '0',
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

  return (
    <Header
      direction="vertical"
      className="z-50 flex h-fit max-h-96 w-full flex-col"
    >
      <Header.Container className="flex items-center justify-between bg-highlight px-400 py-150">
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
      <Header.Container className="z-40 flex justify-between bg-gray-950 px-500 py-300">
        <div className="flex h-full items-center gap-750">
          <Image
            src={footerImgs.footerLogo}
            alt="N1 Shop Logo"
            width={250}
            height={250}
            className="h-auto w-auto"
          />
          <SearchForm
            buttonIcon
            size="sm"
            className="w-[40vw] max-header-desktop:hidden"
          />
        </div>

        <Header.Actions>
          <Header.Hamburger className="text-2xl text-fg-reverse" />
          {headerActionButtons.map((button) => (
            <LinkButton
              key={button.href}
              theme="unstyled"
              variant="primary"
              size="current"
              href={button.href}
              className="items-center text-2xl text-fg-reverse hover:bg-transparent hover:text-primary"
            >
              {button?.badge && (
                <Badge
                  variant="primary"
                  className="-top-1 absolute left-1/4 z-1 aspect-square h-4 w-4 rounded-full px-0 text-fg-primary"
                >
                  0
                </Badge>
              )}
              {<Icon icon={button.icon as IconType} />}
              {button.children && (
                <span className="font-bold text-base">{button.children}</span>
              )}
            </LinkButton>
          ))}
        </Header.Actions>
      </Header.Container>

      <DesktopSubmenu />
      <MobileMenu />
    </Header>
  )
}
