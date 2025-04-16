import { type ButtonHTMLAttributes, type ReactNode, type Ref } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../utils";
import { Icon } from "./icon";

const buttonVariants = tv(
  {
    base: [
      "relative",
      "inline-flex items-center justify-center cursor-pointer",
      "font-medium",
      "transition-all duration-200",
      "focus:outline-none",
      "focus-visible:ring-3 focus-visible:ring-offset-2",
      "uppercase whitespace-nowrap",
      "rounded-sm",
      "text-fg-btn-primary", 
      "disabled:pointer-events-none",
    ],
    variants: {
      variant: {
        primary: "focus:ring-btn-ring-primary",
        secondary: "focus:ring-btn-ring-secondary",
        tertiary: "focus:ring-btn-ring-tertiary",
        danger: "focus:ring-btn-ring-danger",
        warning: "focus:ring-btn-ring-warning",
      },
      theme: {
        light: "",
        solid: "",
        borderless: "hover:bg-btn-borderless-hover active:bg-btn-borderless-active",
        outlined: "border",
      },
      size: {
        sm: "h-btn-sm p-btn-sm text-btn-sm rounded-btn-sm",
        md: "h-btn-md p-btn-md text-btn-md rounded-btn-md",
        lg: "h-btn-lg p-btn-lg text-btn-lg rounded-btn-lg",
      },
      border: {
        sm: "border-(length:--border-btn-width-sm)",
        md: "border-(length:--border-btn-width-md)",
        lg: "border-(length:--border-btn-width-lg)",
        none: "border-none",
      },
      block: {
        true: "w-full",
      },
    },
    compoundVariants: [
        {
          variant: "primary",
          theme: "solid",
          className: [
              "bg-btn-primary",
              "hover:bg-btn-primary-hover",
              "active:bg-btn-primary-active",
              "disabled:bg-btn-primary-disabled",
          ],

        },{
            variant: "secondary",
            theme: "solid",
            className: [
                "bg-btn-secondary",
                "hover:bg-btn-secondary-hover",
                "active:bg-btn-secondary-active",
                "disabled:bg-btn-secondary-disabled",
            ],
        },{
            variant: "tertiary",
            theme: "solid",
            className: [
                "bg-btn-tertiary",
                "hover:bg-btn-tertiary-hover",
                "active:bg-btn-tertiary-active",
                "disabled:bg-btn-tertiary-disabled",
                
            ],
        },{
            variant: "warning",
            theme: "solid",
            className: [
                "bg-btn-warning",
                "hover:bg-btn-warning-hover",
                "active:bg-btn-warning-active",
                "disabled:bg-btn-warning-disabled",
  
            ],

        },{
            variant: "danger",
            theme: "solid",
            className: [
                "bg-btn-danger",
                "hover:bg-btn-danger-hover",
                "active:bg-btn-danger-active",
                "disabled:bg-btn-danger-disabled",
  
            ],
        },{
            variant: "primary",
            theme: "light",
            className: [
            "bg-btn-primary-light",
            "hover:bg-btn-primary-light-hover",
            "active:bg-btn-primary-light-active",
            "disabled:bg-btn-primary-disabled",
            "text-fg-btn-secondary",
        ],
      },
      {
        variant: "secondary",
        theme: "light",
        className: [
            "bg-btn-secondary-light",
            "hover:bg-btn-secondary-light-hover",
            "active:bg-btn-secondary-light-active",
            "disabled:bg-btn-secondary-disabled",
            "text-fg-btn-secondary",
        ],
      },
      {
        variant: "tertiary",
        theme: "light",
        className: [
            "bg-btn-tertiary-light",
            "hover:bg-btn-tertiary-light-hover",
            "active:bg-btn-tertiary-light-active",
            "disabled:bg-btn-tertiary-disabled",

            "text-fg-btn-secondary",
        ],
      },
      {
        variant: "warning",
        theme: "light",
        className: [
            "bg-btn-warning-light",
            "hover:bg-btn-warning-light-hover",
            "active:bg-btn-warning-light-active",
            "disabled:bg-btn-warning-disabled",
            "text-fg-btn-secondary",
        ],
      },
      {
        variant: "danger",
        theme: "light",
        className: [
            "bg-btn-danger-light",
            "hover:bg-btn-danger-light-hover",
            "active:bg-btn-danger-light-active",
            "disabled:bg-btn-danger-disabled",
            "focus-visible:ring-btn-danger/50",
            "text-fg-btn-secondary",
        ],
      },
      {
        variant: "primary",
        theme: "outlined",
        className: [
          "border-btn-border-primary",
          "hover:bg-btn-outlined-primary-hover",
          "active:bg-btn-outlined-primary-active",
          "disabled:bg-btn-primary-disabled",
        ],
      },
      {
        variant: "secondary",
        theme: "outlined",
        className: [
          "border-btn-border-secondary",
          "hover:bg-btn-outlined-secondary-hover",
          "active:bg-btn-outlined-secondary-active",
          "disabled:bg-btn-secondary-disabled",
        ],
    },
    {
        variant: "tertiary",
        theme: "outlined",
        className: [
          "border-btn-border-tertiary",
          "hover:bg-btn-outlined-tertiary-hover",
          "active:bg-btn-outlined-tertiary-active",
          "disabled:bg-btn-primary-disabled",
        ],
      },
      {
        variant: "warning",
        theme: "outlined",
        className: [
          "border-btn-border-warning",
          "hover:bg-btn-outlined-warning-hover",
          "active:bg-btn-outlined-warning-active",
          "disabled:bg-btn-primary-disabled",
        ],
      }, {
        variant: "danger",
        theme: "outlined",
        className: [
          "border-btn-border-danger",
          "hover:bg-btn-outlined-danger-hover",
          "active:bg-btn-outlined-danger-active",
          "disabled:bg-btn-primary-disabled",
        ],
      },
      {
        variant: "primary",
        theme: "borderless",
        className: [
          "text-btn-primary",
          "disabled:bg-btn-primary-disabled",
        ],
      },
      {
        variant: "secondary",
        theme: "borderless",
        className: [
          "text-btn-secondary",
          "disabled:bg-btn-primary-disabled",
        ],
      },
      {
        variant: "tertiary",
        theme: "borderless",
        className: [   
          "text-btn-tertiary",
          "disabled:bg-btn-primary-disabled",
        ],
      },
      {
        variant: "warning",
        theme: "borderless",
        className: [
          "text-btn-warning",
          "disabled:bg-btn-primary-disabled",
        ],
      },
      {
        variant: "danger",
        theme: "borderless",
        className: [
          "text-btn-danger",
          "disabled:bg-btn-primary-disabled",
        ],
      }
    ],
    defaultVariants: {
      variant: "primary",
      theme: "solid",
      size: "md",
      light: false,
    },
  }
);

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "children">,
    VariantProps<typeof buttonVariants> {
  icon?: string;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  children?: ReactNode;
  border?: "sm" | "md" | "lg" | "none";
}



export function Button({
  variant,
  theme,
  size,
  block,
  disabled,
  isLoading,
  loadingText,
  icon,
  iconPosition = "left",
  border,
  children,
  className,
  ...props
}: ButtonProps & { ref?: Ref<HTMLButtonElement> }) {

  const buttonContent = isLoading ? (
    <span className="flex items-center justify-center gap-2">
      <span className="icon-[mdi--loading] text-sm animate-spin" />
      {loadingText}
    </span>
  ) : (
    <span className="flex items-center gap-1">
      {icon && iconPosition === "left" && <Icon icon={icon} size={size} />}
      {children}
      {icon && iconPosition === "right" && <Icon icon={icon} size={size} />}
    </span>
  );
  return (
    <button
      className={cn(
        buttonVariants({
          variant,
          theme,
          size,
          block,
          border,
          className,
        })
      )}
      disabled={disabled || isLoading}
      {...props}
    >
    {isLoading && (
      <span className="invisible" aria-hidden="true">
        {icon && iconPosition === "left" && <Icon icon={icon} size={size} />}
        {children}
        {icon && iconPosition === "right" && <Icon icon={icon} size={size} />}
      </span>
    )}
    
    <span className={isLoading ? "absolute inset-0 flex items-center justify-center" : ""}>
      {buttonContent}
    </span>
    </button>
  );
}

Button.displayName = "Button";