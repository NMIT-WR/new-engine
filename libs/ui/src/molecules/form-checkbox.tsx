import type { ReactNode } from "react"
import { Checkbox, type CheckboxProps } from "../atoms/checkbox"
import { ErrorText } from "../atoms/error-text"
import { ExtraText } from "../atoms/extra-text"
import { Label, type LabelProps } from "../atoms/label"

type ValidateStatus = "default" | "error" | "success" | "warning"

interface FormCheckboxProps extends Omit<CheckboxProps, "size"> {
  id: string
  label: ReactNode
  validateStatus?: ValidateStatus
  helpText?: ReactNode
  extraText?: ReactNode
  size?: "sm" | "md" | "lg"

  /**
   * Props passed to the text Label component.
   */
  labelProps?: Omit<LabelProps, "children" | "htmlFor">
}

export function FormCheckboxRaw({
  id,
  label,
  validateStatus = "default",
  helpText,
  extraText,
  size = "md",
  required,
  disabled,
  labelProps,
  ...props
}: FormCheckboxProps) {
  const extraTextId = extraText ? `${id}-extra` : undefined
  const helpTextId = helpText ? `${id}-help` : undefined
  const describedBy =
    [extraTextId, helpTextId].filter(Boolean).join(" ") || undefined

  return (
    <div className="flex gap-form-checkbox-gap">
      <div className="mt-form-checkbox-indicator-offset flex items-start">
        <Checkbox
          aria-describedby={describedBy}
          disabled={disabled}
          id={id}
          invalid={validateStatus === "error"}
          required={required}
          {...props}
        />
      </div>
      <div className="flex flex-col">
        <Label
          disabled={disabled}
          htmlFor={id}
          required={required}
          size={size}
          {...labelProps}
        >
          {label}
        </Label>
        {helpText}
        {extraText && (
          <ExtraText id={extraTextId} size={size}>
            {extraText}
          </ExtraText>
        )}
      </div>
    </div>
  )
}

function renderHelpText(
  helpText: ReactNode,
  helpTextId: string | undefined,
  validateStatus: ValidateStatus | undefined,
  size: "sm" | "md" | "lg" | undefined
) {
  if (!helpText) {
    return null
  }
  if (validateStatus === "error") {
    return (
      <ErrorText id={helpTextId} size={size}>
        {helpText}
      </ErrorText>
    )
  }
  return (
    <ExtraText id={helpTextId} size={size}>
      {helpText}
    </ExtraText>
  )
}

export function FormCheckbox({
  helpText,
  id,
  validateStatus,
  size,
  ...props
}: FormCheckboxProps) {
  const helpTextId = helpText ? `${id}-helper` : undefined

  return (
    <FormCheckboxRaw
      helpText={renderHelpText(helpText, helpTextId, validateStatus, size)}
      id={id}
      size={size}
      validateStatus={validateStatus}
      {...props}
    />
  )
}
