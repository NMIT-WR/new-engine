import { Button } from '@new-engine/ui/atoms/button'
import { tv } from '@new-engine/ui/utils'
import type { ButtonHTMLAttributes } from 'react'
import type { VariantProps } from 'tailwind-variants'

const colorSelectVariants = tv({
  slots: {
    root: [
      'relative cursor-pointer',
      'aspect-square',
      'rounded-color-selector',
      'border-2 transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-color-selector-ring focus:ring-offset-2',
      'group p-color-selector',
    ],
    color: [
      'absolute rounded-color-selector-inner',
      'w-full h-full',
      'data-[selected=true]:brightness-150',
    ],
    icon: [
      'absolute flex items-center justify-center',
      'text-color-selector-check drop-shadow-sm',
      'pointer-events-none',
    ],
  },
  variants: {
    size: {
      sm: {
        root: 'h-color-selector-sm',
        icon: 'text-xs',
      },
      md: {
        root: 'h-color-selector-md',
        icon: 'text-sm',
      },
      lg: {
        root: 'h-color-selector-lg',
        icon: 'text-base',
      },
    },
    selected: {
      true: {
        root: 'border-color-selector-selected shadow-color-selector-selected',
      },
      false: {
        root: 'border-color-selector-border hover:border-color-selector-border-hover',
      },
    },
    disabled: {
      true: {
        root: 'opacity-color-selector-disabled cursor-not-allowed hover:border-color-selector-border',
      },
    },
  },
  defaultVariants: {
    selected: false,
    size: 'md',
  },
})

export interface ColorSelectorProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof colorSelectVariants> {
  color: string
  colorName?: string
  count?: number
}

export function ColorSelect({
  className,
  size,
  selected,
  disabled,
  color,
  colorName,
  count,
  ...props
}: ColorSelectorProps) {
  const title = colorName
    ? `${colorName}${count !== undefined ? ` (${count})` : ''}`
    : undefined

  const styles = colorSelectVariants({ selected, disabled, size })

  return (
    <Button
      theme="borderless"
      className={styles.root({ className })}
      disabled={disabled}
      title={title}
      aria-label={title || `Select color ${color}`}
      aria-checked={selected}
      role="radio"
      {...props}
    >
      <span
        className={styles.color()}
        style={{ backgroundColor: color }}
        aria-hidden="true"
        data-selected={selected}
      />
    </Button>
  )
}

ColorSelect.displayName = 'ColorSelect'
