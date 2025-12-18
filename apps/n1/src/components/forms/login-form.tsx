import { Button } from "@techsio/ui-kit/atoms/button"
import { Checkbox } from "@techsio/ui-kit/molecules/checkbox"
import Link from "next/link"
import { type FormEvent, useRef } from "react"
import { useLogin } from "@/hooks/use-login"
import { useAuthToast } from "@/hooks/use-toast"
import { AUTH_MESSAGES } from "@/lib/auth-messages"
import { useAnalytics } from "@/providers/analytics-provider"
import { ErrorBanner } from "../atoms/error-banner"
import { FormField } from "../molecules/form-field"

type LoginFormProps = {
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
}: LoginFormProps) => {
  const formRef = useRef<HTMLFormElement>(null)
  const toast = useAuthToast()
  const analytics = useAnalytics()
  const emailRef = useRef<string>("")

  const login = useLogin({
    onSuccess: () => {
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
      console.error("Login failed:", error.message)
    },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string

    emailRef.current = email

    login.mutate({
      email,
      password: formData.get("password") as string,
    })
  }

  return (
    <form
      className="mt-100 flex flex-col gap-100"
      noValidate
      onSubmit={handleSubmit}
      ref={formRef}
    >
      {login.error && (
        <ErrorBanner
          message={login.error.message}
          title={AUTH_MESSAGES.LOGIN_FAILED}
        />
      )}
      <FormField
        autoComplete="email"
        disabled={login.isPending}
        errorMessage={AUTH_MESSAGES.EMAIL_REQUIRED}
        id="login-email"
        label="E-mailová adresa"
        name="email"
        placeholder="vas@email.cz"
        required
        type="email"
      />

      <FormField
        autoComplete="current-password"
        disabled={login.isPending}
        errorMessage={AUTH_MESSAGES.PASSWORD_TOO_SHORT}
        id="login-password"
        label="Heslo"
        minLength={8}
        name="password"
        placeholder="••••••••"
        required
        type="password"
      />

      {showForgotPasswordLink && (
        <div className="enter flex items-center gap-150">
          <Checkbox disabled={login.isPending} name="remember" />
          <span className="text-sm">Zapamatovat</span>
        </div>
      )}

      <Button
        block
        disabled={login.isPending}
        size="sm"
        theme="solid"
        type="submit"
        variant="primary"
      >
        {login.isPending ? "Přihlašování..." : "Přihlásit se"}
      </Button>

      {(showRegisterLink || showForgotPasswordLink) && (
        <div className="flex items-center justify-between text-center text-fg-primary text-sm">
          {showForgotPasswordLink && (
            <Link
              className="font-medium hover:underline"
              href="/zapomenute-heslo"
              onClick={toggle}
            >
              Zapomenuté heslo
            </Link>
          )}
          {showRegisterLink && (
            <Link
              className="font-medium hover:underline"
              href="/registrace"
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
