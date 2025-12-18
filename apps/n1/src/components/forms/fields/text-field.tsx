'use client'

import { Input } from '@ui/atoms/input'
import { Label } from '@ui/atoms/label'
import type { AnyFieldApi } from '@tanstack/react-form'
import type { ChangeEvent, InputHTMLAttributes } from 'react'

interface TextFieldProps {
  field: AnyFieldApi
  label: string
  type?: InputHTMLAttributes<HTMLInputElement>['type']
  placeholder?: string
  required?: boolean
  disabled?: boolean
  /** Transform value on change (e.g., formatPhoneNumber) */
  transform?: (value: string) => string
  className?: string
  autoComplete?: string
  maxLength?: number
}

/**
 * TanStack Form text field component
 * Integrates with @libs/ui Input and Label
 */
export function TextField({
  field,
  label,
  type = 'text',
  placeholder,
  required,
  disabled,
  transform,
  className,
  autoComplete,
  maxLength,
}: TextFieldProps) {
  const errors = field.state.meta.errors
  const hasError = errors.length > 0
  const isTouched = field.state.meta.isTouched

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = transform ? transform(e.target.value) : e.target.value
    field.handleChange(value)
  }

  return (
    <div className={`flex flex-col gap-50 ${className ?? ''}`}>
      <Label htmlFor={field.name} required={required}>
        {label}
      </Label>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        value={field.state.value ?? ''}
        onChange={handleChange}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        maxLength={maxLength}
        variant={isTouched && hasError ? 'error' : 'default'}
      />
      {isTouched && hasError && (
        <p className="font-medium text-2xs text-danger">{errors[0]}</p>
      )}
    </div>
  )
}
