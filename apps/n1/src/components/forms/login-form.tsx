import { useLogin } from '@/hooks/use-login'
import { useAuthToast } from '@/hooks/use-toast'
import { AUTH_MESSAGES } from '@/lib/auth-messages'
import { useAnalytics } from '@/providers/analytics-provider'
import { Button } from '@techsio/ui-kit/atoms/button'
import { Checkbox } from '@techsio/ui-kit/molecules/checkbox'
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
  const toast = useAuthToast()
  const analytics = useAnalytics()
  const emailRef = useRef<string>('')

  const login = useLogin({
    onSuccess: () => {
      // Track customer identification in Leadhub
      if (emailRef.current) {
        analytics.trackIdentify({
          email: emailRef.current,
          subscribe: [],
        })
      }

      toast.loginSuccess()
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
    const email = formData.get('email') as string

    // Store email for Leadhub tracking after successful login
    emailRef.current = email

    login.mutate({
      email,
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
      {login.error && (
        <ErrorBanner
          title={AUTH_MESSAGES.LOGIN_FAILED}
          message={login.error.message}
        />
      )}
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
