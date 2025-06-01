'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from 'ui/src/atoms/button'
import { Input } from 'ui/src/atoms/input'
import { HoverCard } from 'ui/src/molecules/hover-card'
import { Menu } from 'ui/src/molecules/menu'
import { tv } from 'ui/src/utils'
import { useAuth } from '../../hooks/use-auth'
import { authHelpers } from '../../stores/auth-store'

const authDropdownVariants = tv({
  slots: {
    form: 'space-y-4 w-64',
    header: 'space-y-1',
    title: 'font-semibold text-lg text-primary',
    subtitle: 'text-sm text-secondary',
    inputGroup: 'space-y-3',
    error: 'text-xs text-danger',
    actions: 'space-y-2',
    signupPrompt: 'flex items-center gap-2 text-xs',
    signupText: 'text-secondary',
    signupLink: 'p-0 h-auto font-normal text-link hover:text-link-hover',
  },
})

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

  const styles = authDropdownVariants()

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
    <form onSubmit={handleSubmit} className={styles.form()}>
      <div className={styles.header()}>
        <h3 className={styles.title()}>Sign In</h3>
        <p className={styles.subtitle()}>Enter your credentials to continue</p>
      </div>

      <div className={styles.inputGroup()}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          size="sm"
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          size="sm"
        />
      </div>

      {error && <p className={styles.error()}>{error}</p>}

      <div className={styles.actions()}>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className={styles.signupPrompt()}>
          <span className={styles.signupText()}>New here?</span>
          <Button
            type="button"
            variant="tertiary"
            theme="borderless"
            size="sm"
            onClick={() => router.push('/auth/register')}
            className={styles.signupLink()}
          >
            Create account
          </Button>
        </div>
      </div>
    </form>
  )
}
