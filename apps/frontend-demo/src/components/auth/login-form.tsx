'use client'

import { useAuth } from '@/hooks/use-auth'
import {
  AUTH_ERRORS,
  AUTH_MESSAGES,
  authFormFields,
  getAuthErrorMessage,
  validateEmail,
  withLoading,
} from '@/lib/auth'
import Link from 'next/link'
import { type FormEvent, useState } from 'react'
import { Button } from 'ui/src/atoms/button'
import { ErrorText } from 'ui/src/atoms/error-text'
import { Checkbox } from 'ui/src/molecules/checkbox'
import { FormInput } from 'ui/src/molecules/form-input'
import { AuthFormWrapper } from './auth-form-wrapper'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const {
    login,
    error,
    isFormLoading,
    setFormLoading,
    getFieldError,
    setFieldError,
    clearErrors,
    showError,
    showSuccess,
  } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearErrors()

    // Client-side validation
    if (!validateEmail(email)) {
      setFieldError('email', AUTH_ERRORS.INVALID_EMAIL)
      showError('Invalid Email', AUTH_ERRORS.INVALID_EMAIL)
      return
    }
    if (password.length < 1) {
      setFieldError('password', AUTH_ERRORS.PASSWORD_REQUIRED)
      return
    }

    setFormLoading(true)

    try {
      await login(email, password)
      showSuccess(
        AUTH_MESSAGES.LOGIN_SUCCESS.title,
        AUTH_MESSAGES.LOGIN_SUCCESS.description
      )
    } catch (error: unknown) {
      const errorMessage = getAuthErrorMessage(error)

      // Set field-specific error if it's an email error
      if (error instanceof Error && error.message.includes('Invalid email')) {
        setFieldError('email', errorMessage)
      }

      showError('Sign in failed', errorMessage)
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <AuthFormWrapper
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
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
            labelText="Remember me"
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
            Forgot password?
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
          {isFormLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
    </AuthFormWrapper>
  )
}
