"use client"

import { useForm } from "@tanstack/react-form"
import { Button } from "@ui/atoms/button"
import { Checkbox } from "@ui/atoms/checkbox"
import Link from "next/link"
import { TextField } from "@/components/forms/fields/text-field"
import { useLogin } from "@/hooks/use-login"
import { useAuthToast } from "@/hooks/use-toast"
import { AUTH_MESSAGES } from "@/lib/auth-messages"
import { emailValidator } from "@/lib/form-validators"
import { VALIDATION_MESSAGES } from "@/lib/validation-messages"
import { useAnalytics } from "@/providers/analytics-provider"
import { ErrorBanner } from "../atoms/error-banner"

type LoginFormProps = {
  onSuccess?: () => void
  toggle?: () => void
  showRegisterLink?: boolean
  showForgotPasswordLink?: boolean
  className?: string
}

type LoginFormData = {
  email: string
  password: string
}

const loginValidators = {
  email: emailValidator,
  password: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return VALIDATION_MESSAGES.password.required
      }
      if (value.length < 8) {
        return VALIDATION_MESSAGES.password.tooShort
      }
      return
    },
  },
}

export function LoginForm({
  onSuccess,
  toggle,
  showRegisterLink,
  showForgotPasswordLink,
}: LoginFormProps) {
  const toast = useAuthToast()
  const analytics = useAnalytics()

  const login = useLogin({
    onSuccess: () => {
      const email = form.state.values.email
      if (email) {
        analytics.trackIdentify({
          email,
          subscribe: [],
        })
      }

      toast.loginSuccess()
      form.reset()
      onSuccess?.()
    },
    onError: (error) => {
      console.error("Login failed:", error.message)
    },
  })

  const defaultValues: LoginFormData = {
    email: "",
    password: "",
  }

  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => {
      login.mutate({
        email: value.email,
        password: value.password,
      })
    },
  })

  return (
    <form
      className="mt-100 flex flex-col gap-100"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      {login.error && (
        <ErrorBanner
          message={login.error.message}
          title={AUTH_MESSAGES.LOGIN_FAILED}
        />
      )}

      <form.Field name="email" validators={loginValidators.email}>
        {(field) => (
          <TextField
            autoComplete="email"
            disabled={login.isPending}
            field={field}
            label="E-mailová adresa"
            placeholder="vas@email.cz"
            required
            type="email"
          />
        )}
      </form.Field>

      <form.Field name="password" validators={loginValidators.password}>
        {(field) => (
          <TextField
            autoComplete="current-password"
            disabled={login.isPending}
            field={field}
            label="Heslo"
            placeholder="••••••••"
            required
            type="password"
          />
        )}
      </form.Field>

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
