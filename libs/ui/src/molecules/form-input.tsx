import { type ReactNode } from "react";
import { InputLabel } from "../atoms/input-label";
import { Input, type InputProps } from "../atoms/input";
import { Error } from "../atoms/error";
import { ExtraText } from "../atoms/extra-text";

type ValidateStatus = "default" | "error" | "success" | "warning";

interface FormInputProps extends InputProps {
  id: string;
  label: ReactNode;
  validateStatus?: ValidateStatus;
  helperText?: ReactNode;
  extraText?: ReactNode;
  extraTextPosition?: "middle" | "bottom";
}

export function FormInput({
  id,
  label,
  validateStatus = "default",
  helperText,
  extraText,
  extraTextPosition = "bottom",
  size = "md", 
  required, 
  disabled,
  ...props
}: FormInputProps) {

  const helperTextId = helperText ? `${id}-helper` : undefined;
  const extraTextId = extraText ? `${id}-extra` : undefined;
  
  return (
    <div className="flex flex-col">
      <InputLabel
        htmlFor={id}
        size={size}
        required={required}
        disabled={disabled}
      >
        {label}
      </InputLabel>
      <Input
        id={id} 
        size={size}
        required={required}
        variant={validateStatus}
        {...props} 
      />

      
{extraText && extraTextPosition === "middle" && (
        <ExtraText size={size} className="mt-1">
          {extraText}
        </ExtraText>
      )}

    {/* Status message */}
    {helperText && (
        validateStatus === "error" ? (
          <Error
            id={helperTextId}
            size={size}
            className="mt-1"
          >
            {helperText}
          </Error>
        ) : (
          <ExtraText
            id={helperTextId}
            size={size}
            className="mt-1"
          >
            {helperText}
          </ExtraText>
        )
      )}

{extraText && extraTextPosition === "bottom" && !helperText && (
        <ExtraText
          id={extraTextId}
          size={size}
          className="mt-1"
        >
          {extraText}
        </ExtraText>
      )}
    </div>
  );
};