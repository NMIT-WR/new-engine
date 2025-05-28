'use client'
import Link from 'next/link'
import { Button } from 'ui/src/atoms/button'
import { Icon } from 'ui/src/atoms/icon'
import { Menu } from 'ui/src/molecules/menu'

export function Navigation() {
  const menuItems = [
    {
      type: 'action' as const,
      value: 'profile',
      label: 'Profile',
      icon: 'token-icon-user' as const,
    },
    {
      type: 'action' as const,
      value: 'orders',
      label: 'My Orders',
      icon: 'token-icon-bag' as const,
    },
    { type: 'separator' as const, id: 'sep-1' },
    {
      type: 'action' as const,
      value: 'logout',
      label: 'Logout',
      icon: 'token-icon-logout' as const,
    },
  ]

  return (
    <nav className="sticky top-0 z-50 border-gray-200 border-b bg-gray-100/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-bold text-2xl">
            STORE
          </Link>

          {/* Main Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            <Link
              href="/products"
              className="font-medium text-gray-700 hover:text-gray-900"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="font-medium text-gray-700 hover:text-gray-900"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="font-medium text-gray-700 hover:text-gray-900"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="font-medium text-gray-700 hover:text-gray-900"
            >
              Contact
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <Link href="/search">
              <Button variant="secondary" theme="borderless" size="sm">
                <Icon icon="token-icon-search" />
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="secondary" theme="borderless" size="sm">
                <Icon icon="token-icon-cart-primary" />
                <span className="ml-1">Cart (0)</span>
              </Button>
            </Link>

            {/* User Menu */}
            <Menu
              id="user-menu"
              items={menuItems}
              customTrigger={
                <Button variant="secondary" theme="borderless" size="sm">
                  <Icon icon="token-icon-user" />
                </Button>
              }
              onSelect={(details) => {
                if (details.value === 'logout') {
                  console.log('Logout')
                }
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  )
}
