"use client"

import { Input } from "@ui/atoms/input"
import { Label } from "@ui/atoms/label"
import type { AnyFieldApiCompat } from "@/types/form"
import type { ChangeEvent, InputHTMLAttributes } from "react"
import { FormInput } from "@techsio/ui-kit/molecules/form-input"

type TextFieldProps = {
  field: AnyFieldApiCompat
  label: string
  type?: InputHTMLAttributes<HTMLInputElement>["type"]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  transform?: (value: string) => string
  className?: string
  autoComplete?: string
  maxLength?: number
  externalError?: string
  onExternalErrorClear?: () => void
}

export function TextField({
  field,
  label,
  type = "text",
  placeholder,
  required,
  disabled,
  transform,
  className,
  autoComplete,
  maxLength,
  externalError,
  onExternalErrorClear,
}: TextFieldProps) {
  const fieldErrors = field.state.meta.errors
  const showFieldErrors = field.state.meta.isBlurred && fieldErrors.length > 0

  const errorId = `${field.name}-error`
  const showError = !!externalError || showFieldErrors
  const errorMessage = externalError || fieldErrors[0]

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = transform ? transform(e.target.value) : e.target.value
    field.handleChange(value)

    // Clear external error when user starts typing
    if (externalError && onExternalErrorClear) {
      onExternalErrorClear()
    }
  }

  return (
      <FormInput
        label={label}
        required={required}
        autoComplete={autoComplete}
        disabled={disabled}
        id={field.name}
        maxLength={maxLength}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={handleChange}
        placeholder={placeholder}
        type={type}
        value={field.state.value ?? ""}
        variant={showError ? "error" : "default"}
        aria-invalid={showError}
        aria-describedby={showError ? errorId : undefined}
        helpText={showError && errorMessage}
        validateStatus={showError ? "error" : "default"}
        showIcon={false}
      />
  )
}
