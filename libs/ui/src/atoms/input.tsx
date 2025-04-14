import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const inputVariants = cva(
  [
    "block w-full",
    "bg-input",
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
  {
    variants: {
      size: {
        small: "h-input-s p-input-s text-input-s",
        default: "h-input-m p-input-m text-input-m",
        large: "h-input-l p-input-l text-input-l",
      },
      variant: {
        default: "",
        danger: [
          "border-input-border-danger",
          "hover:border-input-border-danger-hover",
          "focus:border-input-border-danger-focus",
          "focus-visible:ring-input-ring-danger",
          "placeholder:text-input-border-danger/60",
        ],
        success: [
          "border-input-border-success",
          "hover:border-input-border-success-hover",
          "focus:border-input-border-success-focus",
          "focus-visible:ring-input-ring-success",
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
      size: "default",
      variant: "default",
    },
  }
);

export interface InputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "size" | "disabled"
    >,
    VariantProps<typeof inputVariants> {
  error?: boolean;
  success?: boolean;
  ref?: React.Ref<HTMLInputElement>;
  disabled?: boolean;
}

function Input({
  className,
  size,
  variant,
  disabled,
  error,
  success,
  ref,
  ...props
}: InputProps) {
  const computedVariant = error ? "danger" : success ? "success" : variant;

  return (
    <input
      className={cn(
        inputVariants({
          size,
          variant: computedVariant,
          disabled,
          className,
        })
      )}
      disabled={disabled}
      ref={ref}
      {...props}
    />
  );
}

export { Input, inputVariants };
