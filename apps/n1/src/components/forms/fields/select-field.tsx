"use client"

import type { AnyFieldApi } from "@tanstack/react-form"
import { Select } from "@ui/molecules/select"

type SelectOption = {
  value: string
  label: string
}

type SelectFieldProps = {
  field: AnyFieldApi
  label: string
  options: SelectOption[]
  required?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
}

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
  const showErrors = field.state.meta.isBlurred && errors.length > 0

  const handleValueChange = (details: { value: string[] }) => {
    const value = details.value[0]
    if (value) {
      field.handleChange(value)
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
        placeholder={placeholder}
        required={required}
        size="lg"
        value={[field.state.value || ""]}
      />
      {showErrors && (
        <p className="font-medium text-2xs text-danger">{errors[0]}</p>
      )}
    </>
  )
}
