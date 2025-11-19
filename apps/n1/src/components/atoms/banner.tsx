import { tv } from '@new-engine/ui/utils'
import type { ReactNode } from 'react'
import type { VariantProps } from 'tailwind-variants'

const bannerVariants = tv({
  base: 'inline-flex w-full border',
  variants: {
    variant: {
      default:
        'bg-banner-default-bg text-banner-default-fg border-banner-default-border',
      info: 'bg-banner-info-bg text-banner-info-fg border-banner-info-border',
      success:
        'bg-banner-success-bg text-banner-success-fg border-banner-success-border',
      warning:
        'bg-banner-warning-bg text-banner-warning-fg border-banner-warning-border',
      danger:
        'bg-banner-danger-bg text-banner-danger-fg border-banner-danger-border',
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
  className?: string
}

export function Banner({ children, variant, size, className }: BannerProps) {
  return (
    <div className={bannerVariants({ variant, size, className })}>
      {children}
    </div>
  )
}
