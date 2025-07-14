'use client'
import { useAuth } from '@/hooks/use-auth'
import { authFormFields, getAuthErrorMessage, withLoading } from '@/lib/auth'
import { Button } from '@ui/atoms/button'
import { Icon } from '@ui/atoms/icon'
import { LinkButton } from '@ui/atoms/link-button'
import { FormInput } from '@ui/molecules/form-input'
import { Popover } from '@ui/molecules/popover'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'

export function AuthDropdown() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const signOut = async () => {
    await logout()
    // Toast is already shown in use-auth hook
  }

  if (!user) {
    return (
      <Popover
        id="auth-dropdown"
        trigger={
          <Icon
            className="text-header-icon-size text-tertiary"
            icon="token-icon-account"
          />
        }
        placement="bottom-end"
        size="sm"
        contentClassName="z-50"
        triggerClassName="data-[state=open]:ring-0 data-[state=open]:ring-offset-0"
      >
        <QuickLoginForm />
      </Popover>
    )
  }

  const menuItems = [
    {
      type: 'action' as const,
      value: 'profile',
      label: 'Můj profil',
      href: '/account/profile',
      icon: 'icon-[mdi--account-outline]' as const,
    },
    {
      type: 'action' as const,
      value: 'orders',
      label: 'Moje objednávky',
      href: '/account/orders',
      icon: 'icon-[mdi--package-variant-closed]' as const,
    },
    {
      type: 'separator' as const,
      id: 'sep-1',
    },
    {
      type: 'action' as const,
      value: 'logout',
      label: 'Odhlásit se',
      href: '/',
      icon: 'icon-[mdi--logout]' as const,
    },
  ]

  return (
    <Popover
      id="user-menu"
      trigger={
        <span className="flex h-full items-center gap-2 rounded-md px-2 py-1 text-sm text-tertiary hover:bg-surface">
          <Icon icon="icon-[mdi--account-circle]" />
          <span className="hidden truncate xl:inline">
            {user.email.split('@')[0]}
          </span>
        </span>
      }
      contentClassName="z-50"
      triggerClassName="hover:bg-transparent active:bg-transparent data-[state=open]:ring-0 data-[state=open]:ring-offset-0"
    >
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <li key={item.href}>
            {item.type === 'action' ? (
              <LinkButton
                theme="borderless"
                size="sm"
                as={Link}
                prefetch={true}
                href={item.href ?? ''}
                onClick={item.value === 'logout' ? signOut : undefined}
                className="w-full justify-start"
                icon={item.icon}
              >
                {item.label}
              </LinkButton>
            ) : (
              <div className="h-px w-full bg-highlight" />
            )}
          </li>
        ))}
      </ul>
    </Popover>
  )
}

function QuickLoginForm() {
  const { login, isFormLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await login(email, password)
      // Toast is already shown in use-auth hook
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err))
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-auth-dropdown-form space-y-auth-dropdown-form-gap"
    >
      <div className="space-y-auth-dropdown-header-gap">
        <h3 className="font-auth-dropdown-title text-auth-dropdown-title text-auth-dropdown-title-size">
          Přihlásit se
        </h3>
        <p className="text-auth-dropdown-subtitle text-auth-dropdown-subtitle-size">
          Zadejte své přihlašovací údaje
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
            isFormLoading
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
            isFormLoading
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
          disabled={isFormLoading}
        >
          {isFormLoading ? 'Přihlašování...' : 'Přihlásit se'}
        </Button>

        <div className="flex items-center gap-auth-dropdown-signup-gap text-auth-dropdown-signup-size">
          <span className="text-auth-dropdown-signup-text">Jste tu noví?</span>
          <LinkButton
            href="/auth/register"
            variant="tertiary"
            theme="borderless"
            size="sm"
            className="h-auto p-0 font-normal text-auth-dropdown-signup-link hover:text-auth-dropdown-signup-link-hover"
          >
            Vytvořit účet
          </LinkButton>
        </div>
      </div>
    </form>
  )
}
