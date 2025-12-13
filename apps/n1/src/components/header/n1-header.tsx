'use client'
import { footerImgs } from '@/assets/footer'
import { Button } from '@techsio/ui-kit/atoms/button'
import { Icon } from '@techsio/ui-kit/atoms/icon'
import { Link } from '@techsio/ui-kit/atoms/link'
import { SearchForm } from '@techsio/ui-kit/molecules/search-form'
import { Header } from '@techsio/ui-kit/organisms/header'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import NextLink from 'next/link'
import { CartPopover } from './cart-popover'
import { DesktopSubmenu } from './desktop-submenu'
import { LoginPopover } from './login-popover'

// MobileMenu uses usePathname() which is runtime data
// Skip SSR to avoid "uncached data outside Suspense" during prerender
const MobileMenu = dynamic(
  () => import('./mobile-menu').then((m) => m.MobileMenu),
  {
    ssr: false,
  }
)

export const N1Header = () => {
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
        <div className="flex items-center gap-200 font-normal text-2xs text-fg-reverse">
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
      <Header.Container className="z-40 flex h-header-container justify-between bg-base-dark px-500 py-300">
        <div className="flex h-full items-center gap-750">
          <NextLink href="/">
            <Image
              src={footerImgs.footerLogo}
              alt="N1 Shop Logo"
              width={250}
              height={250}
              className="h-auto w-auto"
            />
          </NextLink>
          <SearchForm
            buttonIcon
            size="sm"
            className="w-search max-header-desktop:hidden"
          />
        </div>

        <Header.Actions className="relative text-2xl">
          <Header.Hamburger className="text-2xl text-fg-reverse" />
          <Button
            icon="icon-[mdi--heart-outline]"
            size="current"
            theme="unstyled"
            className="text-white"
          />
          <LoginPopover />
          <CartPopover />
        </Header.Actions>
      </Header.Container>

      <DesktopSubmenu />
      <MobileMenu />
    </Header>
  )
}
