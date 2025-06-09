'use client'
import Link from 'next/link'
import { type ComponentPropsWithoutRef, type ReactNode, useState } from 'react'
import { Badge } from 'ui/src/atoms/badge'
import { Button } from 'ui/src/atoms/button'
import { Icon, type IconType } from 'ui/src/atoms/icon'
import { useCart } from '../hooks/use-cart'
import { AuthDropdown } from './auth/auth-dropdown'
import { CartPreview } from './molecules/cart-preview'
import { MobileMenu } from './mobile-menu'
import { type NavItem, Navigation } from './navigation'
import { RegionSelector } from './region-selector'
import { ThemeToggle } from './theme-toggle'
import { Popover } from 'ui/src/molecules/popover'

export interface HeaderProps extends ComponentPropsWithoutRef<'header'> {
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
  const { itemCount } = useCart()

  return (
    <header className={`bg-header-bg shadow-header-default ${className}`} {...props}>
      <div className='mx-auto max-w-header-max-w px-header-container-x lg:px-header-container-x-lg'>
        <div className='flex h-header-height lg:h-header-height-lg items-center justify-between'>
          {/* Logo Section */}
          <div className='flex items-center'>
            <Link href={logo.href || '/'} className='text-header-logo lg:text-header-logo-lg font-header-logo flex items-center gap-header-logo-gap text-header-text'>
              {logo.icon && <Icon icon={logo.icon} size="lg" />}
              {logo.text && <span>{logo.text}</span>}
            </Link>

            {/* Navigation */}
            {navigationItems.length > 0 && (
              <div className='ml-header-nav-margin hidden lg:block'>
                <Navigation items={navigationItems} />
              </div>
            )}
          </div>

          {/* Actions Section */}
          <div className='flex items-center gap-header-actions-gap lg:gap-header-actions-gap-lg'>
            {/* Desktop utilities */}
            <div className="hidden items-center gap-2 lg:flex">
              <RegionSelector />
              <ThemeToggle />
            </div>

            {/* Vertical divider - desktop only */}
            <div className="hidden h-5 w-px bg-header-divider lg:block" />

            {/* Core actions - all sizes */}
            <div className="flex items-center">
              {/* Search button */}
              <Link href="/search">
                <Button
                  variant="tertiary"
                  theme="borderless"
                  size="sm"
                  icon="icon-[mdi--magnify]"
                  className='font-bold text-md'
                  aria-label="Search"
                />
              </Link>

              {/* Cart button */}
              <Popover
                id="cart-preview"
                trigger={
                  <div className="relative flex items-center">
                    <Icon className='text-tertiary' icon="icon-[mdi--cart-outline]" />
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
                triggerClassName='rounded-header-action p-header-action-padding text-header-action-fg transition-colors hover:bg-header-action-bg-hover hover:text-header-action-fg-hover'
                size="lg"
              >
                <CartPreview/>
              </Popover>
              {/* <div className="relative">
                <Link href="/cart">
                  <Button
                    variant="tertiary"
                    theme="borderless"
                    size="sm"
                    icon="icon-[mdi--cart-outline]"
                    aria-label="Shopping cart"
                  />
                </Link>
                {itemCount > 0 && (
                  <Badge
                    variant="danger"
                    className="-right-1 -top-1 absolute flex h-4 w-4 min-w-4 items-center justify-center rounded-full p-0 text-xs"
                  >
                    {itemCount > 99 ? '99+' : itemCount.toString()}
                  </Badge>
                )}
              </div> */}

              {/* User/Auth section */}
              <AuthDropdown />

              {/* Custom actions */}
              {actions}

              {/* Mobile menu button */}
              {showMobileMenu && (
                <button
                  type="button"
                  className='lg:hidden inline-flex items-center justify-center rounded-header-mobile-menu p-header-mobile-menu-padding text-header-mobile-menu-text hover:bg-header-mobile-menu-hover hover:text-header-mobile-menu-text-hover focus:outline-none focus:ring-header-mobile-menu-width focus:ring-inset focus:ring-header-mobile-menu-color'
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Icon icon="icon-[mdi--menu]" size="md" />
                </button>
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

export default Header
