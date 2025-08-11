'use client'
import { useCart } from '@/hooks/use-cart'
import { Badge } from '@new-engine/ui/atoms/badge'
import { Button } from '@new-engine/ui/atoms/button'
import { Icon, type IconType } from '@new-engine/ui/atoms/icon'
import { Popover } from '@new-engine/ui/molecules/popover'
import Link from 'next/link'
import { type ComponentPropsWithoutRef, type ReactNode, useState } from 'react'
import { Logo } from './atoms/logo'
import { AuthDropdown } from './auth/auth-dropdown'
import { CartPreview } from './molecules/cart-preview'
import { HeaderSearch } from './molecules/header-search'
import { type NavItem, Navigation } from './molecules/navigation'
import { MobileMenu } from './organisms/mobile-menu'
import { RegionSelector } from './region-selector'
import { ThemeToggle } from './theme-toggle'

interface HeaderProps extends ComponentPropsWithoutRef<'header'> {
  logo?: {
    text?: string
    icon?: IconType
    href?: string
  }
  navigationItems?: NavItem[]
  actions?: ReactNode
  showMobileMenu?: boolean
}

export function Header({
  logo = { text: 'Logo', href: '/' },
  navigationItems = [],
  actions,
  showMobileMenu = true,
  className,
  ...props
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { cart } = useCart()
  const itemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <header
      className={`sticky top-0 z-10 bg-header-bg shadow-header-default ${className}`}
      {...props}
    >
      <div className="mx-auto max-w-header-max-w px-header-container-x lg:px-header-container-x-lg">
        <div className="flex h-header-height-lg items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href={'/'}>
              <Logo size="sm" />
            </Link>

            {/* Navigation */}
            {navigationItems.length > 0 && (
              <div className="ml-header-nav-margin hidden lg:block">
                <Navigation items={navigationItems} />
              </div>
            )}
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-header-actions-gap lg:gap-header-actions-gap-lg">
            {/* Desktop utilities */}
            <div className="hidden items-center gap-2 lg:flex">
              <ThemeToggle />
            </div>

            {/* Vertical divider - desktop only */}
            <div className="hidden h-5 w-px bg-header-divider lg:block" />

            {/* Core actions - all sizes */}
            <div className="flex items-center">
              <HeaderSearch />
              {/* Cart button */}
              <Popover
                id="popover-header"
                trigger={
                  <div className="relative mr-100 flex items-center">
                    <Icon
                      className="text-header-icon-size text-tertiary"
                      icon="token-icon-cart"
                    />
                    {itemCount > 0 && (
                      <Badge
                        variant="danger"
                        className="-right-2 -top-2 absolute h-4 w-4 min-w-4 rounded-full text-xs"
                      >
                        {itemCount > 99 ? '99+' : itemCount.toString()}
                      </Badge>
                    )}
                  </div>
                }
                placement="bottom-end"
                contentClassName="z-50"
                triggerClassName="data-[state=open]:ring-0 data-[state=open]:ring-offset-0"
              >
                <CartPreview />
              </Popover>

              {/* User/Auth section */}
              <AuthDropdown />
              <RegionSelector className="hidden lg:flex" />

              {/* Custom actions */}
              {actions}

              {/* Mobile menu button */}
              {showMobileMenu && (
                <Button
                  theme="borderless"
                  size="sm"
                  icon="token-icon-menu"
                  className="inline-flex items-center justify-center rounded-header-mobile-menu p-header-mobile-menu-padding text-header-icon-size text-header-mobile-menu-text hover:bg-header-mobile-menu-hover hover:text-header-mobile-menu-text-hover focus:outline-none focus:ring-header-mobile-menu-color focus:ring-header-mobile-menu-width focus:ring-inset lg:hidden"
                  onClick={() => setIsMobileMenuOpen(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigationItems={navigationItems}
      />
    </header>
  )
}
