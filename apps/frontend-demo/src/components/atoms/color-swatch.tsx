import { tv } from '@ui/utils'
import type { ButtonHTMLAttributes } from 'react'
import type { VariantProps } from 'tailwind-variants'

const colorSwatchVariants = tv({
  base: [
    'relative cursor-pointer',
    'w-color-swatch-size h-color-swatch-size',
    'rounded-color-swatch',
    'border-2 transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-color-swatch-ring focus:ring-offset-2',
    'group',
  ],
  variants: {
    selected: {
      true: [
        'border-color-swatch-selected',
        //  'ring-2 ring-color-swatch-selected ring-offset-2',
      ],
      false: [
        'border-color-swatch-border hover:border-color-swatch-border-hover',
      ],
    },
    disabled: {
      true: [
        'opacity-color-swatch-disabled cursor-not-allowed',
        'hover:border-color-swatch-border',
      ],
    },
  },
  defaultVariants: {
    selected: false,
  },
})

export interface ColorSwatchProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof colorSwatchVariants> {
  color: string
  colorName?: string
  count?: number
}

export function ColorSwatch({
  className,
  selected,
  disabled,
  color,
  colorName,
  count,
  ...props
}: ColorSwatchProps) {
  const title = colorName
    ? `${colorName}${count !== undefined ? ` (${count})` : ''}`
    : undefined

  return (
    <button
      className={colorSwatchVariants({ selected, disabled, className })}
      disabled={disabled}
      title={title}
      aria-label={title}
      {...props}
    >
      <span
        className="absolute inset-[3px] rounded-color-swatch-inner"
        style={{ backgroundColor: color }}
      />
    </button>
  )
}
