'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from 'ui/src/atoms/button'
import { FormInput } from 'ui/src/molecules/form-input'
import { HoverCard } from 'ui/src/molecules/hover-card'
import { Menu } from 'ui/src/molecules/menu'
import { useAuth } from '../../hooks/use-auth'
import { authHelpers } from '../../stores/auth-store'

export function AuthDropdown() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <HoverCard
        id="auth-dropdown"
        openDelay={500}
        closeDelay={500}
        content={<QuickLoginForm />}
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

function QuickLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authHelpers.signIn(email, password)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-auth-dropdown-form-gap w-auth-dropdown-form">
      <div className="space-y-auth-dropdown-header-gap">
        <h3 className="font-auth-dropdown-title text-auth-dropdown-title-size text-auth-dropdown-title">Sign In</h3>
        <p className="text-auth-dropdown-subtitle-size text-auth-dropdown-subtitle">Enter your credentials to continue</p>
      </div>

      <div className="space-y-auth-dropdown-input-gap">
        <FormInput
          id="quick-login-email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          size="sm"
        />

        <FormInput
          id="quick-login-password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          size="sm"
        />
      </div>

      {error && <p className="text-auth-dropdown-error-size text-auth-dropdown-error">{error}</p>}

      <div className="space-y-auth-dropdown-actions-gap">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="flex items-center gap-auth-dropdown-signup-gap text-auth-dropdown-signup-size">
          <span className="text-auth-dropdown-signup-text">New here?</span>
          <Button
            type="button"
            variant="tertiary"
            theme="borderless"
            size="sm"
            onClick={() => router.push('/auth/register')}
            className="p-0 h-auto font-normal text-auth-dropdown-signup-link hover:text-auth-dropdown-signup-link-hover"
          >
            Create account
          </Button>
        </div>
      </div>
    </form>
  )
}
