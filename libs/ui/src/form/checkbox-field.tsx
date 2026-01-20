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
  "checked" | "onCheckedChange" | "helpText" | "validateStatus" | "id" | "name"
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

  return (
    <FormCheckbox
      {...props}
      aria-describedby={fieldStatus["aria-describedby"]}
      checked={fieldProps.checked}
      helpText={fieldStatus.errorMessage}
      id={fieldProps.id}
      name={fieldProps.name}
      onCheckedChange={fieldProps.onCheckedChange}
      validateStatus={fieldStatus.validateStatus}
    />
  )
}
