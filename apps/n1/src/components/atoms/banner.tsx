import { tv } from '@new-engine/ui/utils'
import type { ReactNode } from 'react'
import type { VariantProps } from 'tailwind-variants'

const bannerVariants = tv({
  base: 'inline-flex',
  variants: {
    variant: {
      default: 'bg-banner-default-bg text-banner-default-fg',
      info: 'bg-banner-info-bg text-banner-info-fg',
      success: 'bg-banner-success-bg text-banner-success-fg',
      warning: 'bg-banner-warning-bg text-banner-warning-fg',
      danger: 'bg-banner-danger-bg text-banner-danger-fg',
    },
    size: {
      sm: 'p-banner-sm text-banner-sm',
      md: 'p-banner-md text-banner-md',
      lg: 'p-banner-lg text-banner-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

interface BannerProps extends VariantProps<typeof bannerVariants> {
  children: ReactNode
}

export function Banner({ children, variant, size }: BannerProps) {
  return <div className={bannerVariants({ variant, size })}>{children}</div>
}
