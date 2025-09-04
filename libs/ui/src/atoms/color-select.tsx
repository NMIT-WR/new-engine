import { Button } from '@new-engine/ui/atoms/button'
import { tv } from '@new-engine/ui/utils'
import type { ButtonHTMLAttributes } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Icon } from './icon'

const colorSelectVariants = tv({
  slots: {
    root: [
      'relative cursor-pointer',
      'aspect-square overflow-hidden',
      'border-2 transition-all duration-200',
      'border-color-selector-border hover:border-color-selector-border-hover shadow-color-selector',
      'focus:outline-none focus:ring-2 focus:ring-color-selector-ring focus:ring-offset-2',
      'data-[selected=true]:border-color-selector-selected data-[selected=true]:shadow-none',
    ],
    color: [
      'absolute',
      'w-full h-full hover:brightness-75',
      'data-[selected=true]:brightness-75',
    ],
    icon: [
      'absolute items-center hidden justify-center',
      'text-color-selector-check drop-shadow-sm',
      'pointer-events-none',
      'data-[selected=true]:flex',
    ],
  },
  variants: {
    radius: {
      sm: {
        root: 'rounded-color-selector-sm',
      },
      md: {
        root: 'rounded-color-selector-md',
      },
      lg: {
        root: 'rounded-color-selector-lg',
      },
      full: {
        root: 'rounded-color-selector-full',
      },
    },
    size: {
      sm: {
        root: 'h-color-selector-sm',
        icon: 'text-color-selector-sm',
      },
      md: {
        root: 'h-color-selector-md',
        icon: 'text-color-selector-md',
      },
      lg: {
        root: 'h-color-selector-lg',
        icon: 'text-color-selector-lg',
      },
      full: {
        root: 'h-full',
        icon: 'w-color-selector-size h-color-selector-size',
      },
    },
    disabled: {
      true: {
        root: 'selector-disabled hover:border-color-selector-border',
      },
    },
  },
  defaultVariants: {
    selected: false,
    radius: 'full',
    size: 'lg',
  },
})

export interface ColorSelectorProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof colorSelectVariants> {
  color: string
  selected?: boolean
}

export function ColorSelect({
  className,
  size,
  selected = false,
  disabled,
  color,
  radius,
  ...props
}: ColorSelectorProps) {
  const styles = colorSelectVariants({ disabled, size, radius })

  return (
    <Button
      theme="borderless"
      className={styles.root({ className })}
      disabled={disabled}
      aria-label={`Select color ${color}`}
      aria-checked={selected}
      data-selected={selected}
      {...props}
    >
      <span
        className={styles.color()}
        style={{ backgroundColor: color }}
        aria-hidden="true"
        data-selected={selected}
      />

      <Icon
        icon="token-icon-color-selector-selected"
        className={styles.icon()}
        data-selected={selected}
      />
    </Button>
  )
}

ColorSelect.displayName = 'ColorSelect'
