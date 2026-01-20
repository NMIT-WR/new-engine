import type { AnyFieldApi } from "@tanstack/react-form"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { FormInput } from "../molecules/form-input"
import { getFieldStatus, getTextFieldProps } from "./field-bindings"

type TextFieldBaseProps = Omit<
  ComponentPropsWithoutRef<typeof FormInput>,
  | "id"
  | "name"
  | "value"
  | "defaultValue"
  | "onChange"
  | "onBlur"
  | "label"
  | "validateStatus"
>

export type TextFieldProps = TextFieldBaseProps & {
  field: AnyFieldApi
  label: ReactNode
  transform?: (value: string) => string
  externalError?: string
  onExternalErrorClear?: () => void
}

export function TextField({
  field,
  label,
  transform,
  externalError,
  onExternalErrorClear,
  type = "text",
  helpText,
  ...inputProps
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
      aria-invalid={fieldStatus["aria-invalid"]}
      helpText={fieldStatus.errorMessage ?? helpText}
      id={fieldProps.id}
      label={label}
      name={fieldProps.name}
      onBlur={fieldProps.onBlur}
      onChange={(event) => {
        fieldProps.onChange(event)
        if (externalError && onExternalErrorClear) {
          onExternalErrorClear()
        }
      }}
      type={type}
      validateStatus={fieldStatus.validateStatus}
      value={fieldProps.value}
      {...inputProps}
    />
  )
}
