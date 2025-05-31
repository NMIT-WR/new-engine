'use client'
import { useRouter } from 'next/navigation'
import { Button } from 'ui/src/atoms/button'
import { HoverCard } from 'ui/src/molecules/hover-card'
import { Menu } from 'ui/src/molecules/menu'
import { useAuth } from '../../hooks/use-auth'

export function AuthDropdown() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <HoverCard
        content={
          <div className="space-y-3">
            <div className="text-secondary text-sm">
              Sign in to access your account
            </div>
            <div className="space-y-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => router.push('/auth/login')}
              >
                Sign In
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => router.push('/auth/register')}
              >
                Create Account
              </Button>
            </div>
          </div>
        }
      >
        <Button
          variant="tertiary"
          theme="borderless"
          size="sm"
          icon="icon-[mdi--account-outline]"
          aria-label="Sign in"
        />
      </HoverCard>
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
