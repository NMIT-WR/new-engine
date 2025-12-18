"use client"

import type { AnyFieldApi } from "@tanstack/react-form"
import { Select } from "@ui/molecules/select"

type SelectOption = {
  value: string
  label: string
}

interface SelectFieldProps {
  field: AnyFieldApi
  label: string
  options: SelectOption[]
  required?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
}

/**
 * TanStack Form select field component
 * Integrates with @libs/ui Select
 */
export function SelectField({
  field,
  label,
  options,
  required,
  disabled,
  placeholder,
  className,
}: SelectFieldProps) {
  // TanStack Form: show errors only after field has been blurred (user finished editing)
  const errors = field.state.meta.errors
  const showErrors = field.state.meta.isBlurred && errors.length > 0

  const handleValueChange = (details: { value: string[] }) => {
    const value = details.value[0]
    if (value) {
      field.handleChange(value)
      // Mark as touched when user selects a value
      if (!field.state.meta.isTouched) {
        field.handleBlur()
      }
    }
  }

  return (
    <>
      <Select
        className={`grid grid-rows-[auto_1fr] [&_button]:h-full [&_button]:items-center ${className ?? ""}`}
        clearIcon={false}
        disabled={disabled}
        id={field.name}
        label={label}
        onValueChange={handleValueChange}
        options={options}
        size="lg"
        value={[field.state.value || ""]}
      />
      {showErrors && (
        <p className="font-medium text-2xs text-danger">{errors[0]}</p>
      )}
    </>
  )
}
