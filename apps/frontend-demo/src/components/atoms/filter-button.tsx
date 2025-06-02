import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { type VariantProps } from 'tailwind-variants'
import { tv } from 'ui/src/utils'

const filterButtonVariants = tv({
  base: [
    'px-filter-btn-x py-filter-btn-y',
    'border rounded-filter-btn',
    'text-filter-btn-size font-filter-btn',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-filter-btn-ring focus:ring-offset-2',
  ],
  variants: {
    variant: {
      default: [
        'border-filter-btn-border bg-filter-btn-bg text-filter-btn-fg',
        'hover:border-filter-btn-border-hover hover:bg-filter-btn-bg-hover',
      ],
      selected: [
        'border-filter-btn-selected-border bg-filter-btn-selected-bg text-filter-btn-selected-fg',
        'hover:bg-filter-btn-selected-bg-hover',
      ],
    },
    disabled: {
      true: [
        'cursor-not-allowed opacity-filter-btn-disabled',
        'border-filter-btn-disabled-border bg-filter-btn-disabled-bg text-filter-btn-disabled-fg',
        'hover:border-filter-btn-disabled-border hover:bg-filter-btn-disabled-bg',
      ],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface FilterButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof filterButtonVariants> {
  count?: number
}

export const FilterButton = forwardRef<HTMLButtonElement, FilterButtonProps>(
  ({ className, variant, disabled, count, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={filterButtonVariants({ variant, disabled, className })}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)

FilterButton.displayName = 'FilterButton'