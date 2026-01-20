import type { AnyFieldApi } from "@tanstack/react-form"
import type { ReactNode } from "react"
import type { TextareaProps } from "../atoms/textarea"
import { FormTextarea } from "../molecules/form-textarea"
import { getFieldStatus, getTextFieldProps } from "./field-bindings"

export type TextareaFieldProps = {
  field: AnyFieldApi
  label: ReactNode
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  rows?: number
  minLength?: number
  maxLength?: number
  resize?: TextareaProps["resize"]
  size?: TextareaProps["size"]
  externalError?: string
  onExternalErrorClear?: () => void
}

export function TextareaField({
  field,
  label,
  placeholder,
  required,
  disabled,
  className,
  rows,
  minLength,
  maxLength,
  resize,
  size,
  externalError,
  onExternalErrorClear,
}: TextareaFieldProps) {
  const fieldProps = getTextFieldProps(field)
  const fieldStatus = getFieldStatus(field, {
    externalError,
    when: "blurred",
  })

  return (
    <FormTextarea
      aria-describedby={fieldStatus["aria-describedby"]}
      aria-invalid={fieldStatus["aria-invalid"]}
      className={className}
      disabled={disabled}
      helpText={fieldStatus.errorMessage}
      id={fieldProps.id}
      label={label}
      maxLength={maxLength}
      minLength={minLength}
      name={fieldProps.name}
      onBlur={fieldProps.onBlur}
      onChange={(event) => {
        fieldProps.onChange(event)
        if (externalError && onExternalErrorClear) {
          onExternalErrorClear()
        }
      }}
      placeholder={placeholder}
      required={required}
      resize={resize}
      rows={rows}
      size={size}
      validateStatus={fieldStatus.validateStatus}
      value={fieldProps.value}
    />
  )
}
