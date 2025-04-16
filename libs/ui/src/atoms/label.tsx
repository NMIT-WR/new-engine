import {type LabelHTMLAttributes} from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../utils";

const labelVariants = tv(
  {
    base: ["block", "text-label-text", "font-label"],
    variants: {
      size: {
        sm: "text-label-sm",
        md: "text-label-md",
        lg: "text-label-lg",
      },
      disabled: {
        true: "text-label-disabled",
      },
    },
    defaultVariants: {
      size: "md",
      disabled: false,
    },
  }
);

export interface LabelProps
  extends LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
  children?: React.ReactNode;
}

export function Label({
  size,
  disabled,
  required,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        labelVariants({
          size,
          disabled,
        })
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-label-required ml-label">*</span>
      )}

    </label>
  );
}


