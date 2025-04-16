import { type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../utils";

const iconVariants = tv(
  {
    base: ["inline-block flex-shrink-0 align-middle leading-none"],
    variants: {
      size: {
        xs: "text-icon-xs",
        sm: "text-icon-sm",
        md: "text-icon-md",
        lg: "text-icon-lg",
        xl: "text-icon-xl",
      },
      color: {
        current: "text-current",
        primary: "text-primary", 
        secondary: "text-secondary",
        danger: "text-danger",
        success: "text-success",
        warning: "text-warning",
      },
    },
    defaultVariants: {
      size: "md",
      color: "current",
    },
  }
);

export interface IconProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof iconVariants> {
  icon: string;
}
 export function Icon({ icon, size, color, ...props }: IconProps) {

  return (
    <span
      className={cn(
        iconVariants({ size, color }),
        icon, 
      )}
      aria-hidden="true"
      {...props} 
    />
  );
}
