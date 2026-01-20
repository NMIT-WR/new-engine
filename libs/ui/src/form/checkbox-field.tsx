import type { AnyFieldApi } from "@tanstack/react-form"
import type { ReactNode } from "react"
import {
  FormCheckbox,
  type FormCheckboxProps,
} from "../molecules/form-checkbox"
import {
  getCheckboxFieldProps,
  getFieldStatus,
  type FieldErrorVisibility,
} from "./field-bindings"

export type CheckboxFieldProps = Omit<
  FormCheckboxProps,
  "checked" | "onCheckedChange" | "validateStatus" | "id" | "name"
> & {
  field: AnyFieldApi
  id?: string
  name?: string
  label?: ReactNode
  errorVisibility?: FieldErrorVisibility
  externalError?: string
}

export function CheckboxField({
  field,
  id,
  name,
  errorVisibility = "blurred",
  externalError,
  ...props
}: CheckboxFieldProps) {
  const fieldProps = getCheckboxFieldProps(field, { id, name })
  const fieldStatus = getFieldStatus(field, {
    when: errorVisibility,
    externalError,
  })
  const helpText = fieldStatus.errorMessage ?? props.helpText

  return (
    <FormCheckbox
      {...props}
      helpText={helpText}
      checked={fieldProps.checked}
      id={fieldProps.id}
      name={fieldProps.name}
      onCheckedChange={fieldProps.onCheckedChange}
      validateStatus={fieldStatus.validateStatus}
    />
  )
}
