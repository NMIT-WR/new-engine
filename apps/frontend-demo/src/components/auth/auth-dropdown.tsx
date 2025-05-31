'use client'

import Link from 'next/link'
import { Button } from 'ui/src/atoms/button'
import { Icon } from 'ui/src/atoms/icon'
import { Menu } from 'ui/src/molecules/menu'
import { useAuth } from '../../hooks/use-auth'

export function AuthDropdown() {
  const { user, signOut } = useAuth()

  if (!user) {
    return (
      <Link href="/auth/login">
        <Button
          variant="tertiary"
          theme="borderless"
          size="sm"
          icon="icon-[mdi--account-outline]"
          aria-label="Sign in"
        />
      </Link>
    )
  }

  const menuItems = [
    {
      type: 'action' as const,
      value: 'profile',
      label: 'My Profile',
      icon: 'icon-[mdi--account-outline]' as const,
    },
    {
      type: 'action' as const,
      value: 'orders',
      label: 'My Orders',
      icon: 'icon-[mdi--package-variant-closed]' as const,
    },
    {
      type: 'separator' as const,
      id: 'sep-1',
    },
    {
      type: 'action' as const,
      value: 'settings',
      label: 'Settings',
      icon: 'icon-[mdi--cog-outline]' as const,
    },
    {
      type: 'action' as const,
      value: 'logout',
      label: 'Sign Out',
      icon: 'icon-[mdi--logout]' as const,
    },
  ]

  const handleSelect = (value: string) => {
    switch (value) {
      case 'logout':
        signOut()
        break
      case 'profile':
        // Navigate to profile
        break
      case 'orders':
        // Navigate to orders
        break
      case 'settings':
        // Navigate to settings
        break
    }
  }

  return (
    <Menu
      id="auth-dropdown"
      items={menuItems}
      onSelect={({ value }) => handleSelect(value)}
      customTrigger={
        <Button
          variant="tertiary"
          theme="borderless"
          size="sm"
          icon="icon-[mdi--account-circle]"
          aria-label={user.email || 'User menu'}
        >
          <span className="hidden lg:inline">{user.email}</span>
        </Button>
      }
    />
  )
}