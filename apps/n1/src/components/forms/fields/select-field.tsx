'use client'

import { Select } from '@ui/molecules/select'
import type { AnyFieldApi } from '@tanstack/react-form'

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
  const errors = field.state.meta.errors
  const hasError = errors.length > 0
  const isTouched = field.state.meta.isTouched

  return (
    <div
      className={`grid grid-rows-[auto_1fr] ${className ?? ''}`}
    >
      <Select
        id={field.name}
        label={label}
        size="lg"
        clearIcon={false}
        options={options}
        value={[field.state.value || '']}
        onValueChange={(details) => {
          const value = details.value[0]
          if (value) {
            field.handleChange(value)
          }
        }}
        disabled={disabled}
        className="[&_button]:h-full [&_button]:items-center"
      />
      {isTouched && hasError && (
        <p className="font-medium text-2xs text-danger">{errors[0]}</p>
      )}
    </div>
  )
}
