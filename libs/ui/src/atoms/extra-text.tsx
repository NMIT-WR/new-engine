import { type HTMLAttributes } from "react";
import { type VariantProps } from "class-variance-authority";
import {tv} from "tailwind-variants";
import { cn } from "../utils";

const extraTextVariants = tv(
  {
    base: ["text-helper-text", "text-helper-md"],
    variants: {
      variant: {
        default: "",
        error: "text-error-text",
        success: "text-success-text",
        warning: "text-warning-text",
      },
      size: {
        sm: "text-helper-sm",
        md: "text-helper-md",
        lg: "text-helper-lg",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

export interface ExtraTextProps
  extends HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof extraTextVariants> {
  inputSize?: "sm" | "md" | "lg";
}

export function ExtraText({
  children,
  inputSize,
  size = inputSize,
  variant = "default",
  ...props
}: ExtraTextProps) {
  if (!children) return null;

  return (
    <p
      className={cn(
        extraTextVariants({
          size,
          variant,
        })
      )}
      {...props}
    >
      {children}
    </p>
  );
}
