import type { HTMLAttributes, ReactNode } from "react"
import type { VariantProps } from "tailwind-variants"
import { tv } from "../utils"

const extraTextVariants = tv({
  base: ["text-extra-text-fg"],
  variants: {
    size: {
      sm: "text-extra-text-sm",
      md: "text-extra-text-md",
      lg: "text-extra-text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export interface ExtraTextProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof extraTextVariants> {
  children: ReactNode
}

export function ExtraText({ children, size, ...props }: ExtraTextProps) {
  return (
    <span
      className={extraTextVariants({
        size,
      })}
      {...props}
    >
      {children}
    </span>
  )
}
