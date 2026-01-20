import type { ReactNode } from "react"
import { Label } from "../atoms/label"
import { NumericInput, type NumericInputProps } from "../atoms/numeric-input"
import { StatusText } from "../atoms/status-text"

type ValidateStatus = "default" | "error" | "success" | "warning"

interface FormNumericInputProps extends Omit<NumericInputProps, "children"> {
  id: string
  label: ReactNode
  validateStatus?: ValidateStatus
  helpText?: ReactNode
  showHelpTextIcon?: boolean
  children: ReactNode
}

export function FormNumericInput({
  id,
  label,
  validateStatus = "default",
  helpText,
  showHelpTextIcon = validateStatus !== "default",
  size = "md",
  required,
  disabled,
  children,
  ...numericInputProps
}: FormNumericInputProps) {
  const { describedBy, ...inputProps } = numericInputProps
  const helpTextId = helpText ? `${id}-helptext` : undefined
  const mergedDescribedBy = [describedBy, helpTextId]
    .filter(Boolean)
    .join(" ") || undefined
  return (
    <div
      className="flex flex-col gap-form-field-gap"
    >
      <Label disabled={disabled} htmlFor={id} required={required} size={size}>
        {label}
      </Label>

      <NumericInput
        disabled={disabled}
        id={id}
        invalid={validateStatus === "error"}
        required={required}
        size={size}
        describedBy={mergedDescribedBy}
        {...inputProps}
      >
        {children}
      </NumericInput>

      {helpText && (
        <StatusText
          id={helpTextId}
          status={validateStatus}
          showIcon={showHelpTextIcon}
          size={size}
        >
          {helpText}
        </StatusText>
      )}
    </div>
  )
}
