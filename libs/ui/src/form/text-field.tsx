import type { AnyFieldApi } from "@tanstack/react-form"
import type { InputHTMLAttributes } from "react"
import { FormInput } from "../molecules/form-input"
import { getFieldStatus, getTextFieldProps } from "./field-bindings"

export type TextFieldProps = {
  field: AnyFieldApi
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
  autoComplete,
  maxLength,
  externalError,
  onExternalErrorClear,
}: TextFieldProps) {
  const fieldProps = getTextFieldProps(field, {
    parseValue: (value) => (transform ? transform(value) : value),
  })
  const fieldStatus = getFieldStatus(field, {
    externalError,
    when: "blurred",
  })

  return (
    <FormInput
      aria-describedby={fieldStatus["aria-describedby"]}
      aria-invalid={fieldStatus["aria-invalid"]}
      autoComplete={autoComplete}
      disabled={disabled}
      helpText={fieldStatus.errorMessage}
      id={fieldProps.id}
      label={label}
      maxLength={maxLength}
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
      type={type}
      validateStatus={fieldStatus.validateStatus}
      value={fieldProps.value}
      variant={fieldStatus.validateStatus === "error" ? "error" : "default"}
    />
  )
}
