"use client"

import { useForm, useStore } from "@tanstack/react-form"
import { Button } from "@ui/atoms/button"
import { FormCheckbox } from "@techsio/ui-kit/molecules/form-checkbox"
import { FormInput } from "@techsio/ui-kit/molecules/form-input"
import Link from "next/link"
import { TextField } from "@/components/forms/fields/text-field"
import { useRegister } from "@/hooks/use-register"
import { useAuthToast } from "@/hooks/use-toast"
import { AUTH_MESSAGES } from "@/lib/auth-messages"
import { registerValidators } from "@/lib/form-validators"
import { VALIDATION_MESSAGES } from "@/lib/validation-messages"
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

  const getValidateStatus = (hasValue: boolean, isValid: boolean) => {
    if (!hasValue) {
      return "default"
    }
    return isValid ? "success" : "error"
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

      <form.Field name="password" validators={registerValidators.password}>
        {(field) => (
          <div className="flex flex-col gap-50">
            <FormInput
              autoComplete="new-password"
              disabled={register.isPending}
              id="register-password"
              label="Heslo"
              minLength={8}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="••••••••"
              required
              type="password"
              validateStatus={getValidateStatus(
                field.state.value.length > 0,
                passwordValidation.isValid
              )}
              value={field.state.value}
            />
            <PasswordValidator password={field.state.value} showRequirements />
          </div>
        )}
      </form.Field>

      <form.Field
        name="confirmPassword"
        validators={{
          onChangeListenTo: ["password"],
          onChange: ({ value, fieldApi }) => {
            if (!value) {
              return VALIDATION_MESSAGES.password.confirmRequired
            }
            const passwordValue = fieldApi.form.getFieldValue("password")
            if (value !== passwordValue) {
              return VALIDATION_MESSAGES.password.mismatch
            }
            return
          },
        }}
      >
        {(field) => (
          <div className="flex flex-col gap-50">
            <FormInput
              autoComplete="new-password"
              disabled={register.isPending}
              id="register-confirm-password"
              label="Potvrzení hesla"
              minLength={8}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="••••••••"
              required
              type="password"
              validateStatus={getValidateStatus(
                field.state.value.length > 0,
                passwordsMatch
              )}
              value={field.state.value}
            />
            {passwordsMatch && (
              <span className="font-medium text-success text-xs">
                {VALIDATION_MESSAGES.password.match}
              </span>
            )}
            {passwordsDontMatch && (
              <span className="font-medium text-danger text-xs">
                {VALIDATION_MESSAGES.password.mismatch}
              </span>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="acceptTerms"
        validators={registerValidators.acceptTerms}
      >
        {(field) => (
          <FormCheckbox
            checked={field.state.value}
            id="accept-terms"
            label="Souhlasím s podmínkami"
            name="accept-terms"
            onCheckedChange={(checked) => field.handleChange(checked)}
            size="sm"
          />
        )}
      </form.Field>

      <Button
        block
        disabled={register.isPending || !form.state.canSubmit}
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
