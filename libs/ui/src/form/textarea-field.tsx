import type { AnyFieldApi } from "@tanstack/react-form"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { FormTextarea } from "../molecules/form-textarea"
import { getFieldStatus, getTextFieldProps } from "./field-bindings"

type TextareaFieldBaseProps = Omit<
  ComponentPropsWithoutRef<typeof FormTextarea>,
  | "id"
  | "name"
  | "value"
  | "defaultValue"
  | "onChange"
  | "onBlur"
  | "label"
  | "helpText"
  | "validateStatus"
>

export type TextareaFieldProps = TextareaFieldBaseProps & {
  field: AnyFieldApi
  label: ReactNode
  externalError?: string
  onExternalErrorClear?: () => void
}

export function TextareaField({
  field,
  label,
  externalError,
  onExternalErrorClear,
  ...textareaProps
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
      helpText={fieldStatus.errorMessage}
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
      validateStatus={fieldStatus.validateStatus}
      value={fieldProps.value}
      {...textareaProps}
    />
  )
}
