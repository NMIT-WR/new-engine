'use client'

import { useAuth } from '@/hooks/use-auth'
import {
  AUTH_ERRORS,
  authFormFields,
  validateEmail,
  withLoading,
} from '@/lib/auth'
import { Button } from '@new-engine/ui/atoms/button'
import { ErrorText } from '@new-engine/ui/atoms/error-text'
import { Checkbox } from '@new-engine/ui/molecules/checkbox'
import { FormInput } from '@new-engine/ui/molecules/form-input'
import Link from 'next/link'
import { type FormEvent, useState } from 'react'
import { AuthFormWrapper } from './auth-form-wrapper'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const {
    login,
    loginMutation,
    error,
    getFieldError,
    setFieldError,
    clearErrors,
  } = useAuth()

  const isFormLoading = loginMutation.isPending

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearErrors()

    // Client-side validation
    if (!validateEmail(email)) {
      setFieldError('email', AUTH_ERRORS.INVALID_EMAIL)
      return
    }
    if (password.length < 1) {
      setFieldError('password', AUTH_ERRORS.PASSWORD_REQUIRED)
      return
    }

    // The mutation handles loading state and success/error toasts
    login(email, password)
  }

  return (
    <AuthFormWrapper
      title="Vítejte zpět"
      subtitle="Přihlaste se ke svému účtu a pokračujte"
      footerText="Nemáte účet?"
      footerLinkText="Zaregistrovat se"
      footerLinkHref="/auth/register"
    >
      <form onSubmit={handleSubmit} className="space-y-auth-form-gap">
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
          validateStatus={getFieldError('email') ? 'error' : 'default'}
          helpText={
            getFieldError('email') && (
              <ErrorText showIcon>{getFieldError('email')}</ErrorText>
            )
          }
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
          validateStatus={getFieldError('password') ? 'error' : 'default'}
          helpText={
            getFieldError('password') && (
              <ErrorText>{getFieldError('password')}</ErrorText>
            )
          }
        />

        <div className="flex items-center justify-between">
          <Checkbox
            id="rememberMe"
            labelText="Zapamatovat si mě"
            checked={rememberMe}
            onCheckedChange={(details) =>
              setRememberMe(details.checked === true)
            }
            disabled={isFormLoading}
          />

          <Link
            href="/auth/forgot-password"
            className="text-auth-link hover:text-auth-link-hover"
          >
            Zapoměli jste heslo?
          </Link>
        </div>

        {error && !getFieldError('email') && !getFieldError('password') && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isFormLoading}
        >
          {isFormLoading ? 'Přihlašování...' : 'Přihlásit se'}
        </Button>
      </form>
    </AuthFormWrapper>
  )
}
