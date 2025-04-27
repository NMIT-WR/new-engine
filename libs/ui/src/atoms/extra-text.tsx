import type { HTMLAttributes } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '../utils'

const extraTextVariants = tv({
  base: ['text-helper-text'],
  variants: {
    size: {
      sm: 'text-helper-sm',
      md: 'text-helper-md',
      lg: 'text-helper-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface ExtraTextProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof extraTextVariants> {
  children: React.ReactNode
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
