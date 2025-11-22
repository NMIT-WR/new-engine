import type { ReactNode } from "react"
import { ErrorText } from "../atoms/error-text"
import { ExtraText } from "../atoms/extra-text"
import { Input, type InputProps } from "../atoms/input"
import { Label } from "../atoms/label"

type ValidateStatus = "default" | "error" | "success" | "warning"

interface FormInputRawProps extends InputProps {
  id: string
  label: ReactNode
  validateStatus?: ValidateStatus
  helpText?: ReactNode
  extraText?: ReactNode
}

export function FormInputRaw({
  id,
  label,
  validateStatus = "default",
  helpText,
  extraText,
  size = "md",
  required,
  disabled,
  ...props
}: FormInputRawProps) {
  const extraTextId = extraText ? `${id}-extra` : undefined

  return (
    <div className="flex flex-col gap-1">
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

      {/* Status message */}
      {helpText}

      {extraText && (
        <ExtraText id={extraTextId} size={size}>
          {extraText}
        </ExtraText>
      )}
    </div>
  )
}

export function FormInput({
  helpText,
  id,
  validateStatus,
  size,
  ...props
}: FormInputRawProps) {
  const helpTextId = helpText ? `${id}-helper` : undefined

  return (
    <FormInputRaw
      helpText={
        validateStatus === "error" ? (
          <ErrorText id={helpTextId} showIcon size={size}>
            {helpText}
          </ErrorText>
        ) : (
          <ExtraText id={helpTextId} size={size}>
            {helpText}
          </ExtraText>
        )
      }
      id={id}
      size={size}
      validateStatus={validateStatus}
      {...props}
    />
  )
}
