'use client'
import {
  AUTH_MESSAGES,
  authFormFields,
  getAuthErrorMessage,
  useAuthForm,
  withLoading,
} from '@/lib/auth'
import { useAuth } from '@/lib/context/auth-context'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'
import { Button } from 'ui/src/atoms/button'
import { Icon } from 'ui/src/atoms/icon'
import { FormInput } from 'ui/src/molecules/form-input'
import { Menu } from 'ui/src/molecules/menu'
import { Popover } from 'ui/src/molecules/popover'

export function AuthDropdown() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { showSuccess } = useAuthForm()

  const signOut = async () => {
    await logout()
    showSuccess(
      AUTH_MESSAGES.LOGOUT_SUCCESS.title,
      AUTH_MESSAGES.LOGOUT_SUCCESS.description
    )
  }

  if (!user) {
    return (
      <Popover
        trigger={
          <Icon className="text-tertiary" icon="icon-[mdi--account-outline]" />
        }
        triggerClassName="rounded-header-action p-header-action-padding hover:bg-header-action-bg-hover"
        placement="bottom-end"
        size="sm"
      >
        <QuickLoginForm />
      </Popover>
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
        router.push('/account/profile')
        break
      case 'orders':
        router.push('/account/orders')
        break
      case 'settings':
        router.push('/account/settings')
        break
      default:
        break
    }
  }

  return (
    <Menu
      id="user-menu"
      items={menuItems}
      // @ts-ignore
      onSelect={({ value }) => handleSelect(value)}
      customTrigger={
        <Button
          variant="tertiary"
          theme="borderless"
          size="sm"
          icon="icon-[mdi--account-circle]"
        >
          <span className="hidden xl:inline">{user.email}</span>
        </Button>
      }
    />
  )
}

function QuickLoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { isLoading, setIsLoading, showSuccess } = useAuthForm()
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      showSuccess(
        AUTH_MESSAGES.LOGIN_SUCCESS.title,
        AUTH_MESSAGES.LOGIN_SUCCESS.description
      )
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-auth-dropdown-form space-y-auth-dropdown-form-gap"
    >
      <div className="space-y-auth-dropdown-header-gap">
        <h3 className="font-auth-dropdown-title text-auth-dropdown-title text-auth-dropdown-title-size">
          Sign In
        </h3>
        <p className="text-auth-dropdown-subtitle text-auth-dropdown-subtitle-size">
          Enter your credentials to continue
        </p>
      </div>

      <div className="space-y-auth-dropdown-input-gap">
        <FormInput
          {...withLoading(
            authFormFields.email({
              id: 'quick-login-email',
              size: 'sm',
              value: email,
              onChange: (e) => setEmail(e.target.value),
            }),
            isLoading
          )}
        />

        <FormInput
          {...withLoading(
            authFormFields.password({
              id: 'quick-login-password',
              size: 'sm',
              value: password,
              onChange: (e) => setPassword(e.target.value),
            }),
            isLoading
          )}
        />
      </div>

      {error && (
        <p className="text-auth-dropdown-error text-auth-dropdown-error-size">
          {error}
        </p>
      )}

      <div className="space-y-auth-dropdown-actions-gap">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="flex items-center gap-auth-dropdown-signup-gap text-auth-dropdown-signup-size">
          <span className="text-auth-dropdown-signup-text">New here?</span>
          <Button
            type="button"
            variant="tertiary"
            theme="borderless"
            size="sm"
            onClick={() => router.push('/auth/register')}
            className="h-auto p-0 font-normal text-auth-dropdown-signup-link hover:text-auth-dropdown-signup-link-hover"
          >
            Create account
          </Button>
        </div>
      </div>
    </form>
  )
}
