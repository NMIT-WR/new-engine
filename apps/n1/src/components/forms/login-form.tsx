import { useLogin } from '@/hooks/use-login'
import { Button } from '@new-engine/ui/atoms/button'
import { Input } from '@new-engine/ui/atoms/input'
import { Label } from '@new-engine/ui/atoms/label'
import { Checkbox } from '@new-engine/ui/molecules/checkbox'
import Link from 'next/link'
import { type FormEvent, useRef } from 'react'

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
        <div className="rounded-md bg-danger-light p-100 text-danger text-sm">
          <p className="font-medium">Přihlášení se nezdařilo</p>
          <p className="mt-50 text-xs">{login.error.message}</p>
        </div>
      )}

      {/* Email Field */}
      <div className="flex flex-col gap-50">
        <Label htmlFor="login-email" required>
          E-mailová adresa
        </Label>
        <Input
          id="login-email"
          name="email"
          type="email"
          placeholder="vas@email.cz"
          required
          autoComplete="email"
          disabled={login.isPending}
          className="peer user-invalid:border-danger user-valid:border-success focus-visible:user-invalid:ring-danger focus-visible:user-valid:ring-success"
        />
        <p className="invisible text-danger text-xs peer-user-invalid:visible">
          Zadejte platnou e-mailovou adresu
        </p>
      </div>

      {/* Password Field */}
      <div className="flex flex-col gap-50">
        <Label htmlFor="login-password" required>
          Heslo
        </Label>
        <Input
          id="login-password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
          autoComplete="current-password"
          disabled={login.isPending}
          className="peer user-invalid:border-danger user-valid:border-success focus-visible:user-invalid:ring-danger focus-visible:user-valid:ring-success"
        />
        <p className="invisible text-danger text-xs peer-user-invalid:visible">
          Heslo musí mít alespoň 8 znaků
        </p>
      </div>

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
