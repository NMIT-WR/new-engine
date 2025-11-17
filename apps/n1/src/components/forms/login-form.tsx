import { useLogin } from '@/hooks/use-login'
import { AUTH_MESSAGES } from '@/lib/auth-messages'
import { Button } from '@new-engine/ui/atoms/button'
import { Checkbox } from '@new-engine/ui/molecules/checkbox'
import Link from 'next/link'
import { type FormEvent, useRef } from 'react'
import { ErrorBanner } from '../atoms/error-banner'
import { FormField } from '../molecules/form-field'

interface LoginFormProps {
  onSuccess?: () => void
  toggle?: () => void
  showRegisterLink?: boolean
  showForgotPasswordLink?: boolean
  className?: string
}

export const LoginForm = ({
  onSuccess,
  toggle,
  showRegisterLink,
  showForgotPasswordLink,
  className,
}: LoginFormProps) => {
  const formRef = useRef<HTMLFormElement>(null)

  const login = useLogin({
    onSuccess: () => {
      formRef.current?.reset()
      onSuccess?.()
    },
    onError: (error) => {
      console.error('Login failed:', error.message)
    },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    login.mutate({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    })
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="mt-100 flex flex-col gap-100"
    >
      {/* Server Error Banner */}
      {login.error && (
        <ErrorBanner
          title={AUTH_MESSAGES.LOGIN_FAILED}
          message={login.error.message}
        />
      )}

      {/* Email Field */}
      <FormField
        id="login-email"
        name="email"
        type="email"
        label="E-mailová adresa"
        placeholder="vas@email.cz"
        required
        errorMessage={AUTH_MESSAGES.EMAIL_REQUIRED}
        disabled={login.isPending}
        autoComplete="email"
      />

      {/* Password Field */}
      <FormField
        id="login-password"
        name="password"
        type="password"
        label="Heslo"
        placeholder="••••••••"
        required
        minLength={8}
        errorMessage={AUTH_MESSAGES.PASSWORD_TOO_SHORT}
        disabled={login.isPending}
        autoComplete="current-password"
      />

      {showForgotPasswordLink && (
        <div className="enter flex items-center gap-150">
          <Checkbox name="remember" disabled={login.isPending} />
          <span className="text-sm">Zapamatovat</span>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        theme="solid"
        size="sm"
        block
        disabled={login.isPending}
      >
        {login.isPending ? 'Přihlašování...' : 'Přihlásit se'}
      </Button>

      {(showRegisterLink || showForgotPasswordLink) && (
        <div className="flex items-center justify-between text-center text-fg-primary text-sm">
          {showForgotPasswordLink && (
            <Link
              href="/zapomenute-heslo"
              className="font-medium hover:underline"
              onClick={toggle}
            >
              Zapomenuté heslo
            </Link>
          )}
          {showRegisterLink && (
            <Link
              href="/registrace"
              className="font-medium hover:underline"
              onClick={toggle}
            >
              Zaregistrovat se
            </Link>
          )}
        </div>
      )}
    </form>
  )
}
