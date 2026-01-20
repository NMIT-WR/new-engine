import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react"
import { Input, type InputProps } from "../atoms/input"
import { Label } from "../atoms/label"
import { StatusText } from "../atoms/status-text"

type ValidateStatus = "default" | "error" | "success" | "warning"

interface FormInputRawProps extends InputProps {
  id: string
  label: ReactNode
  validateStatus?: ValidateStatus
  helpText?: ReactNode
}

export function FormInputRaw({
  id,
  label,
  validateStatus = "default",
  helpText,
  size = "md",
  required,
  disabled,
  className,
  ...props
}: FormInputRawProps) {
  const { ["aria-describedby"]: ariaDescribedBy, ...inputProps } = props
  const helpTextElement = isValidElement(helpText)
    ? (helpText as ReactElement<{ id?: string }>)
    : null
  const resolvedHelpTextId =
    helpTextElement?.props?.id ?? (helpText ? `${id}-helptext` : undefined)
  const mergedDescribedBy = [ariaDescribedBy, resolvedHelpTextId]
    .filter(Boolean)
    .join(" ") || undefined
  const inputClassName = className
    ? `p-input-sm md:p-input-md ${className}`
    : "p-input-sm md:p-input-md"
  const helpTextContent = helpText
    ? helpTextElement
      ? helpTextElement.props.id
        ? helpTextElement
        : cloneElement(helpTextElement, {
            id: resolvedHelpTextId,
          })
      : (
          <div id={resolvedHelpTextId}>
            {helpText}
          </div>
        )
    : null

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
        aria-describedby={mergedDescribedBy}
        {...inputProps}
        className={inputClassName}
      />

      {helpTextContent}
    </div>
  )
}

type FormInputProps = FormInputRawProps & {
  showHelpTextIcon?: boolean
}

export function FormInput({
  helpText,
  id,
  validateStatus = "default",
  showHelpTextIcon = validateStatus !== "default",
  size = "md",
  ...props
}: FormInputProps) {
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
      {...props}
    />
  )
}
