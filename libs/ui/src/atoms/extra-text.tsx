import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const extraTextVariants = cva(
  ["text-helper-text", "text-helper-m", "mt-helper"],
  {
    variants: {
      position: {
        bottom: "",
        middle: "mb-helper",
      },
      size: {
        sm: "text-helper-s",
        md: "text-helper-m",
        lg: "text-helper-l",
      },
    },
    defaultVariants: {
      position: "bottom",
      size: "md",
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
  position,
  inputSize,
  size = inputSize,
  ...props
}: ExtraTextProps) {
  if (!children) return null;

  return (
    <p
      className={cn(
        extraTextVariants({
          position,
          size,
          })
      )}
      {...props}
    >
      {children}
    </p>
  );
}
