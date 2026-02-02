"use client"

import { Button } from "@techsio/ui-kit/atoms/button"
import { ErrorText } from "@techsio/ui-kit/atoms/error-text"
import { FormCheckbox } from "@techsio/ui-kit/molecules/form-checkbox"
import { FormInput } from "@techsio/ui-kit/molecules/form-input"
import { useToast } from "@techsio/ui-kit/molecules/toast"
import { useRouter } from "next/navigation"
import { type FormEvent, useCallback, useState } from "react"
import { authHooks } from "@/hooks/auth-hooks"
import {
  AUTH_ERRORS,
  AUTH_MESSAGES,
  authFormFields,
  validateEmail,
  validatePassword,
  withLoading,
} from "@/lib/auth"
import { AuthFormWrapper } from "./auth-form-wrapper"
import { PasswordRequirements } from "./password-requirements"

type FieldErrors = Record<string, string | undefined>

export function RegisterForm() {
  const router = useRouter()
  const toast = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const registerMutation = authHooks.useRegister({
    onSuccess: () => {
      toast.create({
        ...AUTH_MESSAGES.REGISTER_SUCCESS,
        type: "success",
      })
      router.push("/")
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : AUTH_ERRORS.GENERIC_ERROR
      toast.create({
        ...AUTH_MESSAGES.REGISTER_ERROR,
        description: message,
        type: "error",
      })
    },
  })

  const clearErrors = useCallback(() => {
    setFieldErrors({})
  }, [])

  const getFieldError = useCallback(
    (field: string) => fieldErrors[field],
    [fieldErrors]
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    clearErrors()

    // Client-side validation
    const errors: FieldErrors = {}

    if (!validateEmail(email)) {
      errors.email = AUTH_ERRORS.INVALID_EMAIL
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0]
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = AUTH_ERRORS.PASSWORD_MISMATCH
    }

    if (!acceptTerms) {
      errors.terms = AUTH_ERRORS.TERMS_REQUIRED
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    registerMutation.mutate({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    })
  }

  const isFormLoading = registerMutation.isPending

  return (
    <AuthFormWrapper
      footerLinkHref="/auth/login"
      footerLinkText="Přihlásit se"
      footerText="Již máte účet?"
      subtitle="Zaregistrujte se a začněte"
      title="Vytvořit účet"
    >
      <form className="space-y-auth-form-gap" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            {...withLoading(
              authFormFields.firstName({
                value: firstName,
                onChange: (e) => setFirstName(e.target.value),
              }),
              isFormLoading
            )}
          />

          <FormInput
            {...withLoading(
              authFormFields.lastName({
                value: lastName,
                onChange: (e) => setLastName(e.target.value),
              }),
              isFormLoading
            )}
          />
        </div>

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

        <div>
          <FormInput
            {...withLoading(
              authFormFields.newPassword({
                value: password,
                onChange: (e) => {
                  setPassword(e.target.value)
                  clearErrors()
                },
                placeholder: "Zadejte heslo",
              }),
              isFormLoading
            )}
            helpText={
              getFieldError("password") && (
                <ErrorText showIcon>{getFieldError("password")}</ErrorText>
              )
            }
            validateStatus={getFieldError("password") ? "error" : "default"}
          />
          <PasswordRequirements password={password} />
        </div>

        <FormInput
          {...withLoading(
            authFormFields.confirmPassword({
              value: confirmPassword,
              onChange: (e) => {
                setConfirmPassword(e.target.value)
                clearErrors()
              },
              placeholder: "Znovu zadejte heslo",
            }),
            isFormLoading
          )}
          helpText={
            getFieldError("confirmPassword") ? (
              <ErrorText showIcon>{getFieldError("confirmPassword")}</ErrorText>
            ) : undefined
          }
          validateStatus={
            getFieldError("confirmPassword") ? "error" : "default"
          }
        />

        <FormCheckbox
          checked={acceptTerms}
          disabled={isFormLoading}
          helpText={getFieldError("terms")}
          id="acceptTerms"
          label="Souhlasím s obchodními podmínkami"
          onCheckedChange={setAcceptTerms}
          validateStatus={getFieldError("terms") ? "error" : "default"}
        />

        <Button
          className="w-full"
          disabled={isFormLoading || !acceptTerms}
          size="lg"
          type="submit"
        >
          {isFormLoading ? "Vytváření účtu..." : "Vytvořit účet"}
        </Button>
      </form>
    </AuthFormWrapper>
  )
}
