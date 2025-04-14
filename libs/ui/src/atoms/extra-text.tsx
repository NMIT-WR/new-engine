import React from "react";
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
        small: "text-helper-s",
        default: "text-helper-m",
        large: "text-helper-l",
      },
    },
    defaultVariants: {
      position: "bottom",
      size: "default",
    },
  }
);

export interface ExtraTextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof extraTextVariants> {
  ref?: React.Ref<HTMLParagraphElement>;
  // Synchronizace s inputem - stejně jako Label/Error - zlepšuje UX
  inputSize?: "small" | "default" | "large";
}

function ExtraText({
  className,
  children,
  position,
  inputSize,
  size = inputSize, // Automaticky odvodit z inputSize, pokud není explicitně size
  ref,
  ...props
}: ExtraTextProps) {
  if (!children) return null;

  return (
    <p
      ref={ref}
      className={cn(
        extraTextVariants({
          position,
          size,
          className,
        })
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export { ExtraText, extraTextVariants };
