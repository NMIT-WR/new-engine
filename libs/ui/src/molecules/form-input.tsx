import type { ReactNode } from "react"
import { Input, type InputProps } from "../atoms/input"
import { Label } from "../atoms/label"
import { StatusText } from "../atoms/status-text"

type ValidateStatus = "default" | "error" | "success" | "warning"

interface FormInputRawProps extends InputProps {
  id: string
  label: ReactNode
  validateStatus?: ValidateStatus
  helpText?: ReactNode
  showHelpTextIcon?: boolean
}

export function FormInputRaw({
  id,
  label,
  validateStatus = "default",
  helpText,
  showHelpTextIcon,
  size = "md",
  required,
  disabled,
  ...props
}: FormInputRawProps) {
  return (
    <div className="flex flex-col gap-form-field-gap">
      <Label disabled={disabled} htmlFor={id} required={required} size={size}>
        {label}
      </Label>
      <Input
        disabled={disabled}
        id={id}
        required={required}
        size={size}
        variant={validateStatus}
        {...props}
        className="p-input-sm md:p-input-md"
      />

      {helpText}
    </div>
  )
}

export function FormInput({
  helpText,
  id,
  validateStatus = "default",
  showHelpTextIcon = validateStatus === "default" ? false : true,
  size = "md",
  ...props
}: FormInputRawProps) {
  return (
    <FormInputRaw
      helpText={
        helpText && (
          <StatusText
            status={validateStatus}
            showIcon={showHelpTextIcon}
            size={size}
          >
            {helpText}
          </StatusText>
        )
      }
      id={id}
      size={size}
      validateStatus={validateStatus}
      showHelpTextIcon={showHelpTextIcon}
      {...props}
    />
  )
}
