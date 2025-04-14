// form-input.tsx (molekula)
import React, { useId } from "react";
import { Input, type InputProps } from "../atoms/input";
import { Label } from "../atoms/input-label";
import { Error } from "../atoms/error";
import { ExtraText } from "../atoms/extra-text";
import { cn } from "../utils";

export interface FormInputProps extends Omit<InputProps, "error" | "success"> {
  label?: React.ReactNode;
  helpText?: React.ReactNode;
  extraText?: React.ReactNode;
  extraTextPosition?: "middle" | "bottom";
  error?: React.ReactNode;
  success?: boolean;
  size?: "small" | "default" | "large";
  optional?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
}

export function FormInput({
  id: externalId,
  label,
  helpText,
  extraText,
  extraTextPosition = "bottom",
  error,
  success,
  size,
  optional,
  required,
  className,
  ...inputProps
}: FormInputProps) {
  const fallbackId = useId();
  const id = externalId || fallbackId;
  const errorId = `${id}-error`;
  const helpTextId = `${id}-help`;

  const describedBy =
    [error ? errorId : null, helpText ? helpTextId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div
      className={cn("form-field", className)}
      data-error={!!error || undefined}
      data-success={success || undefined}
    >
      {label && (
        <Label
          htmlFor={id}
          inputSize={size}
          required={required}
          optional={optional}
        >
          {label}
        </Label>
      )}

      {extraText && extraTextPosition === "middle" && (
        <ExtraText position="middle" inputSize={size}>
          {extraText}
        </ExtraText>
      )}

      <Input
        id={id}
        error={!!error}
        success={success}
        size={size}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        {...inputProps}
      />

      {helpText && (
        <ExtraText id={helpTextId} inputSize={size}>
          {helpText}
        </ExtraText>
      )}

      {error && (
        <Error id={errorId} inputSize={size}>
          {error}
        </Error>
      )}

      {extraText && extraTextPosition === "bottom" && (
        <ExtraText inputSize={size}>{extraText}</ExtraText>
      )}
    </div>
  );
}
