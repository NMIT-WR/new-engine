"use client"

import { Button } from "@techsio/ui-kit/atoms/button"
import { ErrorText } from "@techsio/ui-kit/atoms/error-text"
import { FormCheckbox } from "@techsio/ui-kit/molecules/form-checkbox"
import { FormInput } from "@techsio/ui-kit/molecules/form-input"
import { useToast } from "@techsio/ui-kit/molecules/toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type FormEvent, useCallback, useState } from "react"
import { authHooks } from "@/hooks/auth-hooks"
import { AUTH_ERRORS, AUTH_MESSAGES, authFormFields, validateEmail, withLoading } from "@/lib/auth"
import { AuthFormWrapper } from "./auth-form-wrapper"

type FieldErrors = Record<string, string | undefined>

export function LoginForm() {
  const router = useRouter()
  const toast = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [backendError, setBackendError] = useState<string>()

  const loginMutation = authHooks.useLogin({
    onSuccess: () => {
      toast.create({
        ...AUTH_MESSAGES.LOGIN_SUCCESS,
        type: "success",
      })
      router.push("/")
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : AUTH_ERRORS.GENERIC_ERROR
      setBackendError(message)
      toast.create({
        ...AUTH_MESSAGES.LOGIN_ERROR,
        description: message,
        type: "error",
      })
    },
  })

  const clearErrors = useCallback(() => {
    setFieldErrors({})
    setBackendError(undefined)
  }, [])

  const setFieldError = useCallback((field: string, message: string) => {
    setFieldErrors((prev) => ({ ...prev, [field]: message }))
  }, [])

  const getFieldError = useCallback(
    (field: string) => fieldErrors[field],
    [fieldErrors]
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    clearErrors()

    // Client-side validation
    if (!validateEmail(email)) {
      setFieldError("email", AUTH_ERRORS.INVALID_EMAIL)
      return
    }
    if (password.length < 1) {
      setFieldError("password", AUTH_ERRORS.PASSWORD_REQUIRED)
      return
    }

    loginMutation.mutate({ email, password })
  }

  const isFormLoading = loginMutation.isPending

  return (
    <AuthFormWrapper
      footerLinkHref="/auth/register"
      footerLinkText="Zaregistrovat se"
      footerText="Nemáte účet?"
      subtitle="Přihlaste se ke svému účtu a pokračujte"
      title="Vítejte zpět"
    >
      <form className="space-y-auth-form-gap" onSubmit={handleSubmit}>
        <FormInput
          {...withLoading(
            authFormFields.email({
              value: email,
              onChange: (e) => {
                setEmail(e.target.value)
                clearErrors()
              },
            }),
            isFormLoading
          )}
          helpText={
            getFieldError("email") && (
              <ErrorText showIcon>{getFieldError("email")}</ErrorText>
            )
          }
          validateStatus={getFieldError("email") ? "error" : "default"}
        />

        <FormInput
          {...withLoading(
            authFormFields.password({
              value: password,
              onChange: (e) => {
                setPassword(e.target.value)
                clearErrors()
              },
            }),
            isFormLoading
          )}
          helpText={
            getFieldError("password") && (
              <ErrorText>{getFieldError("password")}</ErrorText>
            )
          }
          validateStatus={getFieldError("password") ? "error" : "default"}
        />

        <div className="flex items-center justify-between">
          <FormCheckbox
            checked={rememberMe}
            disabled={isFormLoading}
            id="rememberMe"
            label="Zapamatovat si mě"
            onCheckedChange={setRememberMe}
          />

          <Link
            className="text-auth-link hover:text-auth-link-hover"
            href="/auth/forgot-password"
          >
            Zapoměli jste heslo?
          </Link>
        </div>

        {backendError && !getFieldError("email") && !getFieldError("password") && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-red-800 text-sm">{backendError}</p>
          </div>
        )}

        <Button
          className="w-full"
          disabled={isFormLoading}
          size="lg"
          type="submit"
        >
          {isFormLoading ? "Přihlašování..." : "Přihlásit se"}
        </Button>
      </form>
    </AuthFormWrapper>
  )
}
