import type { HTMLAttributes, ReactNode, Ref } from "react"
import type { VariantProps } from "tailwind-variants"
import { tv } from "../utils"
import { Icon } from "./icon"

const statusTextVariants = tv({
  slots: {
    base: "flex items-center",
    icon: "self-start"
  },
  variants: {
    status: {
      error: "text-status-text-fg-error",
      success: "text-status-text-fg-success",
      warning: "text-status-text-fg-warning",
      default: "text-status-text-fg-default",
    },
    size: {
      sm: {
        base: "text-status-text-sm gap-status-text-icon-gap-sm",
        icon: "mt-status-text-icon-sm",
      },
      md: {
        base: "text-status-text-md gap-status-text-icon-gap-md",
        icon: "mt-status-text-icon-md",
      },
      lg: {
        base: "text-status-text-lg gap-status-text-icon-gap-lg",
        icon: "mt-status-text-icon-lg",
      },
    },
  },
  defaultVariants: {
    status: "default",
    size: "md",
  },
})

const ICON_MAP = {
  error: "token-icon-status-text-error",
  success: "token-icon-status-text-success",
  warning: "token-icon-status-text-warning",
  default: undefined,
} as const

export interface StatusTextProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusTextVariants> {
  ref?: Ref<HTMLDivElement>
  showIcon?: boolean
  children: ReactNode
}

export function StatusText({
  className,
  showIcon = false,
  status = "default",
  size = "md",
  children,
  ref,
  ...props
}: StatusTextProps) {
  const icon = ICON_MAP[status]

  const {base, icon: iconSlot} = statusTextVariants({
    status,
    size,
    className,
  })

  return (
    <div
      className={base({
        status,
        size,
        className,
      })}
      ref={ref}
      {...props}
    >
      {showIcon && icon && <Icon size={size} icon={icon} className={iconSlot()} />}
      <span>{children}</span>
    </div>
  )
}
