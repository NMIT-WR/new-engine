'use client'
import { useAuth } from '@/hooks/use-auth'
import {
  AUTH_ERRORS,
  AUTH_MESSAGES,
  type ValidationError,
  authFormFields,
  getAuthErrorMessage,
  validateEmail,
  validatePassword,
  withLoading,
} from '@/lib/auth'
import { type FormEvent, useState } from 'react'
import { Button } from 'ui/src/atoms/button'
import { ErrorText } from 'ui/src/atoms/error-text'
import { Checkbox } from 'ui/src/molecules/checkbox'
import { FormInput } from 'ui/src/molecules/form-input'
import { AuthFormWrapper } from './auth-form-wrapper'
import { PasswordRequirements } from './password-requirements'

export function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)

  const {
    register,
    isFormLoading,
    setFormLoading,
    setValidationErrors,
    getFieldError,
    showError,
    showSuccess,
    clearErrors,
  } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearErrors()

    // Client-side validation
    const errors: ValidationError[] = []

    // Email validation
    if (!validateEmail(email)) {
      errors.push({
        field: 'email',
        message: AUTH_ERRORS.INVALID_EMAIL,
      })
    }

    // Password validation
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      errors.push({
        field: 'password',
        message: passwordValidation.errors[0], // Show first error
      })
    }

    // Password match validation
    if (password !== confirmPassword) {
      errors.push({
        field: 'confirmPassword',
        message: AUTH_ERRORS.PASSWORD_MISMATCH,
      })
    }

    // Terms validation
    if (!acceptTerms) {
      errors.push({
        field: 'terms',
        message: AUTH_ERRORS.TERMS_REQUIRED,
      })
    }

    if (errors.length > 0) {
      setValidationErrors(errors)
      showError('Validation Error', errors[0].message)
      return
    }

    setFormLoading(true)

    try {
      await register(email, password, firstName, lastName)
      showSuccess(
        AUTH_MESSAGES.REGISTER_SUCCESS.title,
        AUTH_MESSAGES.REGISTER_SUCCESS.description
      )
    } catch (error: unknown) {
      const errorMessage = getAuthErrorMessage(error)
      showError('Registration failed', errorMessage)
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <AuthFormWrapper
      title="Create Account"
      subtitle="Sign up to get started"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkHref="/auth/login"
    >
      <form onSubmit={handleSubmit} className="space-y-auth-form-gap">
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
          validateStatus={getFieldError('email') ? 'error' : 'default'}
          helpText={
            getFieldError('email') && (
              <ErrorText showIcon>{getFieldError('email')}</ErrorText>
            )
          }
        />

        <FormInput
          {...withLoading(
            authFormFields.newPassword({
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

        <FormInput
          {...withLoading(
            authFormFields.confirmPassword({
              value: confirmPassword,
              onChange: (e) => {
                setConfirmPassword(e.target.value)
                clearErrors()
              },
            }),
            isFormLoading
          )}
          validateStatus={
            getFieldError('confirmPassword') ? 'error' : 'default'
          }
          helpText={
            getFieldError('confirmPassword') ? (
              <ErrorText>{getFieldError('confirmPassword')}</ErrorText>
            ) : undefined
          }
        />

        <div className="space-y-2">
          <Checkbox
            id="acceptTerms"
            labelText="I agree to the Terms and Conditions"
            checked={acceptTerms}
            onCheckedChange={(details) =>
              setAcceptTerms(details.checked === true)
            }
            disabled={isFormLoading}
          />
          {getFieldError('terms') && (
            <p className="text-red-600 text-sm">{getFieldError('terms')}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isFormLoading || !acceptTerms}
        >
          {isFormLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <PasswordRequirements password={password} />
      </form>
    </AuthFormWrapper>
  )
}
