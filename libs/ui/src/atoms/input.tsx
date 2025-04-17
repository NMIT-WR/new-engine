import { type InputHTMLAttributes, type Ref } from "react";
import { type VariantProps } from "tailwind-variants";
import { tv } from "../utils";
;
const inputVariants = tv(
   { 
    base:[
    "block w-full",
    "bg-input-bg",  
    "text-input-text",
    "placeholder:text-input-placeholder",
    "border border-input-border",
    "rounded-input",
    "transition-all duration-200",
    "hover:bg-input-bg-hover hover:border-input-border-hover",
    "focus:outline-none focus:bg-input-bg-focus focus:border-input-border-focus",
    "focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-input-ring",
    "disabled:pointer-events-none",
  ],
    variants: {
      size: {
        sm: "h-input-sm p-input-sm text-input-sm",
        md: "h-input-md p-input-md text-input-md",
        lg: "h-input-lg p-input-lg text-input-lg",
      },
      variant: {
        default: "",
        error: [
          "border-input-border-danger",
          "hover:border-input-border-danger-hover",
          "focus:border-input-border-danger-focus",
          "focus-visible:ring-input-ring-danger",
          "placeholder:text-input-danger/60",
        ],
        success: [
          "border-input-border-success",
          "hover:border-input-border-success-hover",
          "focus:border-input-border-success-focus",
          "focus-visible:ring-input-ring-success",
        ],
        warning: [
          "border-input-border-warning",
          "hover:border-input-border-warning-hover",
          "focus:border-input-border-warning-focus",
          "focus-visible:ring-input-ring-warning",
        ],
      },
      disabled: {
        true: [
          "bg-input-bg-disabled",
          "border-input-border-disabled",
          "text-input-text-disabled",
          "placeholder:text-input-disabled/60",
        ],
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

export interface InputProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "size" | "disabled"
    >,
    VariantProps<typeof inputVariants> {
  ref?: Ref<HTMLInputElement>;
  disabled?: boolean;
}

export function Input({
  size,
  variant,
  disabled,
  ref,
  ...props
}: InputProps) {

  return (
    <input
      className={
        inputVariants({
          size,
          variant,
          disabled,
        })}
      disabled={disabled}
      ref={ref}
      {...props}
    />
  );
}

