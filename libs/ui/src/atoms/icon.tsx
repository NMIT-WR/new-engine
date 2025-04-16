import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const iconVariants = cva(
  // Base classes - inline-block ensures it behaves like an image, flex-shrink-0 is good in flex layouts
  ["inline-block flex-shrink-0 align-middle leading-none"],
  {
    variants: {
      size: {
        xs: "text-icon-xs",
        sm: "text-icon-s",
        md: "text-icon-m",
        lg: "text-icon-l",
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
 function Icon({ icon, size, color, ...props }: IconProps) {

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


export { Icon, iconVariants }