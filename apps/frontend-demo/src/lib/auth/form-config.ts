import type { ComponentProps } from 'react'
import type { FormInput } from '@ui/molecules/form-input'
import { AUTH_FORM_CONFIG } from './constants'

type FormInputProps = ComponentProps<typeof FormInput>

/**
 * Common form field configurations
 */
export const authFormFields = {
  email: (props?: Partial<FormInputProps>): FormInputProps => ({
    id: props?.id || 'email',
    label: 'Email',
    type: 'email',
    placeholder: AUTH_FORM_CONFIG.EMAIL_PLACEHOLDER,
    required: true,
    autoComplete: 'email',
    extraText: AUTH_FORM_CONFIG.EMAIL_HELP_TEXT,
    ...props,
  }),

  password: (props?: Partial<FormInputProps>): FormInputProps => ({
    id: props?.id || 'password',
    label: 'Password',
    type: 'password',
    placeholder: AUTH_FORM_CONFIG.PASSWORD_PLACEHOLDER,
    required: true,
    autoComplete: 'current-password',
    ...props,
  }),

  newPassword: (props?: Partial<FormInputProps>): FormInputProps => ({
    id: props?.id || 'password',
    label: 'Password',
    type: 'password',
    placeholder: AUTH_FORM_CONFIG.PASSWORD_PLACEHOLDER,
    required: true,
    autoComplete: 'new-password',
    extraText: AUTH_FORM_CONFIG.PASSWORD_HELP_TEXT,
    ...props,
  }),

  confirmPassword: (props?: Partial<FormInputProps>): FormInputProps => ({
    id: props?.id || 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: AUTH_FORM_CONFIG.PASSWORD_PLACEHOLDER,
    required: true,
    autoComplete: 'new-password',
    ...props,
  }),

  firstName: (props?: Partial<FormInputProps>): FormInputProps => ({
    id: props?.id || 'firstName',
    label: 'First Name',
    type: 'text',
    placeholder: 'John',
    ...props,
  }),

  lastName: (props?: Partial<FormInputProps>): FormInputProps => ({
    id: props?.id || 'lastName',
    label: 'Last Name',
    type: 'text',
    placeholder: 'Doe',
    ...props,
  }),
}

/**
 * Helper to apply error state to form field
 */
export function withError(
  fieldProps: FormInputProps,
  error?: string
): FormInputProps {
  if (!error) return fieldProps

  return {
    ...fieldProps,
    validateStatus: 'error' as const,
    helpText: error,
  }
}

/**
 * Helper to apply loading state to form field
 */
export function withLoading(
  fieldProps: FormInputProps,
  isLoading: boolean
): FormInputProps {
  return {
    ...fieldProps,
    disabled: isLoading,
  }
}
