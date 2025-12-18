"use client"

import { useForm, useStore } from "@tanstack/react-form"
import { Button } from "@ui/atoms/button"
import { Checkbox } from "@ui/atoms/checkbox"
import { Input } from "@ui/atoms/input"
import { Label } from "@ui/atoms/label"
import Link from "next/link"
import { TextField } from "@/components/forms/fields/text-field"
import { useRegister } from "@/hooks/use-register"
import { useAuthToast } from "@/hooks/use-toast"
import { AUTH_MESSAGES } from "@/lib/auth-messages"
import { isPasswordValid, registerValidators } from "@/lib/form-validators"
import { useAnalytics } from "@/providers/analytics-provider"
import { ErrorBanner } from "../atoms/error-banner"
import { PasswordValidator, usePasswordValidation } from "./password-validator"

type RegisterFormProps = {
  onSuccess?: () => void
  toggle?: () => void
  showLoginLink?: boolean
  className?: string
}

type RegisterFormData = {
  first_name: string
  last_name: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export function RegisterForm({
  onSuccess,
  toggle,
  showLoginLink = true,
  className,
}: RegisterFormProps) {
  const toast = useAuthToast()
  const analytics = useAnalytics()

  const register = useRegister({
    onSuccess: () => {
      // Track customer identification in Leadhub
      const values = form.state.values
      analytics.trackIdentify({
        email: values.email,
        subscribe: [],
        first_name: values.first_name,
        last_name: values.last_name,
      })

      toast.registerSuccess()
      form.reset()
      onSuccess?.()
    },
    onError: (error) => {
      console.error("Registration failed:", error.message)
    },
  })

  const defaultValues: RegisterFormData = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  }
  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => {
      register.mutate({
        email: value.email,
        password: value.password,
        first_name: value.first_name,
        last_name: value.last_name,
      })
    },
  })

  // Subscribe to password value for PasswordValidator component
  const password = useStore(form.store, (state) => state.values.password)
  const passwordValidation = usePasswordValidation(password)

  // Subscribe to confirm password for match check
  const confirmPassword = useStore(
    form.store,
    (state) => state.values.confirmPassword
  )
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword
  const passwordsDontMatch =
    confirmPassword.length > 0 && password !== confirmPassword

  // Subscribe to form validity
  const isFormValid = useStore(form.store, (state) => {
    const { values } = state
    return (
      values.first_name.trim().length > 0 &&
      values.last_name.trim().length > 0 &&
      values.email.includes("@") &&
      isPasswordValid(values.password) &&
      values.password === values.confirmPassword &&
      values.acceptTerms
    )
  })

  // Helper for password input validation styling
  const getValidationClass = (hasValue: boolean, isValid: boolean) => {
    if (!hasValue) {
      return ""
    }
    return isValid
      ? "border-success focus-visible:ring-success"
      : "border-danger focus-visible:ring-danger"
  }

  return (
    <form
      className={`mt-100 flex flex-col gap-200 ${className}`}
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      {register.error && (
        <ErrorBanner
          message={register.error.message}
          title={AUTH_MESSAGES.REGISTER_FAILED}
        />
      )}

      {/* First name | Last name */}
      <div className="grid grid-cols-2 gap-100">
        <form.Field
          name="first_name"
          validators={registerValidators.first_name}
        >
          {(field) => (
            <TextField
              autoComplete="given-name"
              disabled={register.isPending}
              field={field}
              label="Jméno"
              placeholder="Jan"
              required
            />
          )}
        </form.Field>

        <form.Field name="last_name" validators={registerValidators.last_name}>
          {(field) => (
            <TextField
              autoComplete="family-name"
              disabled={register.isPending}
              field={field}
              label="Příjmení"
              placeholder="Novák"
              required
            />
          )}
        </form.Field>
      </div>

      {/* Email */}
      <form.Field name="email" validators={registerValidators.email}>
        {(field) => (
          <TextField
            autoComplete="email"
            disabled={register.isPending}
            field={field}
            label="E-mailová adresa"
            placeholder="vas@email.cz"
            required
            type="email"
          />
        )}
      </form.Field>

      {/* Password with validator UI */}
      <form.Field name="password" validators={registerValidators.password}>
        {(field) => (
          <div className="flex flex-col gap-50">
            <Label htmlFor="register-password" required>
              Heslo
            </Label>
            <Input
              autoComplete="new-password"
              className={`transition-colors ${getValidationClass(field.state.value.length > 0, passwordValidation.isValid)}`}
              disabled={register.isPending}
              id="register-password"
              minLength={8}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="••••••••"
              required
              type="password"
              value={field.state.value}
            />
            <PasswordValidator password={field.state.value} showRequirements />
          </div>
        )}
      </form.Field>

      {/* Confirm Password */}
      <form.Field
        name="confirmPassword"
        validators={{
          onChangeListenTo: ["password"],
          onChange: ({ value, fieldApi }) => {
            if (!value) {
              return "Potvrzení hesla je povinné"
            }
            const passwordValue = fieldApi.form.getFieldValue("password")
            if (value !== passwordValue) {
              return AUTH_MESSAGES.PASSWORDS_DONT_MATCH
            }
            return
          },
        }}
      >
        {(field) => (
          <div className="flex flex-col gap-50">
            <Label htmlFor="register-confirm-password" required>
              Potvrzení hesla
            </Label>
            <Input
              autoComplete="new-password"
              className={`transition-colors ${getValidationClass(field.state.value.length > 0, passwordsMatch)}`}
              disabled={register.isPending}
              id="register-confirm-password"
              minLength={8}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="••••••••"
              required
              type="password"
              value={field.state.value}
            />
            {passwordsMatch && (
              <span className="font-medium text-success text-xs">
                {AUTH_MESSAGES.PASSWORDS_MATCH}
              </span>
            )}
            {passwordsDontMatch && (
              <span className="font-medium text-danger text-xs">
                {AUTH_MESSAGES.PASSWORDS_DONT_MATCH}
              </span>
            )}
          </div>
        )}
      </form.Field>

      {/* Terms checkbox */}
      <form.Field
        name="acceptTerms"
        validators={registerValidators.acceptTerms}
      >
        {(field) => (
          <div className="flex items-center gap-200">
            <Checkbox
              checked={field.state.value}
              id="accept-terms"
              name="accept-terms"
              onChange={(e) => field.handleChange(e.target.checked)}
            />
            <Label className="cursor-pointer text-xs" htmlFor="accept-terms">
              Souhlasím s podmínkami
            </Label>
          </div>
        )}
      </form.Field>

      <Button
        block
        disabled={register.isPending || !isFormValid}
        size="sm"
        type="submit"
      >
        {register.isPending ? "Registruji..." : "Zaregistrovat se"}
      </Button>

      {showLoginLink && (
        <div className="text-center text-fg-primary text-sm">
          <span className="text-fg-secondary">Již máte účet? </span>
          <Link
            className="font-medium hover:underline"
            href="/prihlaseni"
            onClick={toggle}
          >
            Přihlaste se
          </Link>
        </div>
      )}
    </form>
  )
}
