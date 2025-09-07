import { Button } from '@new-engine/ui/atoms/button'
import { tv } from '@new-engine/ui/utils'
import { Icon } from '../atoms/icon'

const colorSelectVariants = tv({
  slots: {
    group: ['grid place-items-start'],
    cell: 'grid',
    atom: [
      'relative cursor-pointer p-color-select-atom',
      'aspect-square overflow-hidden',
      'border-2 transition-all duration-200',
      'border-color-select-border hover:border-color-select-border-hover shadow-color-select',
      'focus:outline-none focus:ring-2 focus:ring-color-select-ring focus:ring-offset-2',
      'data-[selected=true]:border-color-select-selected data-[selected=true]:shadow-none',
    ],
    color: [
      'absolute',
      'w-full h-full hover:brightness-75',
      'data-[selected=true]:brightness-75',
    ],
    icon: [
      'absolute items-center hidden justify-center',
      'text-color-select-fg-check drop-shadow-sm',
      'pointer-events-none',
      'data-[selected=true]:flex',
    ],
    labelContainer: ['text-center'],
    labelText: ['text-xs text-color-select-label-fg'],
    countText: ['text-xs text-color-select-label-fg'],
  },
  variants: {
    radius: {
      sm: {
        atom: 'rounded-color-select-sm',
      },
      md: {
        atom: 'rounded-color-select-md',
      },
      lg: {
        atom: 'rounded-color-select-lg',
      },
      full: {
        atom: 'rounded-color-select-full',
      },
    },
    size: {
      sm: {
        group: 'gap-color-select-group-sm',
        atom: 'h-color-select-sm',
        icon: 'text-color-select-sm',
      },
      md: {
        group: 'gap-color-select-group-md',
        atom: 'h-color-select-md',
        icon: 'text-color-select-md',
      },
      lg: {
        group: 'gap-color-select-group-lg',
        atom: 'h-color-select-lg',
        icon: 'text-color-select-lg',
      },
      full: {
        atom: 'h-full',
        icon: 'w-color-select-icon h-color-select-icon',
      },
    },
    layout: {
      list: {
        group: 'grid-cols-1',
      },
      grid: {
        group: 'color-select-grid',
      },
    },
    disabled: {
      true: {
        atom: 'select-disabled hover:border-color-select-border',
      },
    },
  },
  defaultVariants: {
    radius: 'full',
    size: 'lg',
    layout: 'list',
  },
})

interface ColorItem {
  id?: string
  color: string
  selected?: boolean
  label?: string
  count?: number
  disabled?: boolean
}

interface ColorSelectProps {
  colors: ColorItem[]
  layout?: 'list' | 'grid'
  size?: 'sm' | 'md' | 'lg' | 'full'
  radius?: 'sm' | 'md' | 'lg' | 'full'
  disabled?: boolean
  onColorClick?: (color: string) => void
}

export const ColorSelect = ({
  colors,
  layout = 'grid',
  size = 'lg',
  radius = 'full',
  disabled,
  onColorClick,
}: ColorSelectProps) => {
  const {
    group,
    cell,
    atom,
    color: colorSlot,
    icon,
    labelContainer,
    labelText,
    countText,
  } = colorSelectVariants({ layout, size, radius, disabled })
  return (
    <div className={group()}>
      {colors.map((colorItem) => (
        <div className={cell()} key={colorItem.id || colorItem.color}>
          <Button
            theme="borderless"
            className={atom()}
            disabled={colorItem.disabled || disabled}
            onClick={() => onColorClick?.(colorItem.color)}
            aria-label={`Select color ${colorItem.color}`}
            aria-checked={colorItem.selected}
            data-selected={colorItem.selected || false}
          >
            <span
              className={colorSlot()}
              style={{ backgroundColor: colorItem.color }}
              aria-hidden="true"
              data-selected={colorItem.selected || false}
            />
            <Icon
              icon="token-icon-color-select"
              className={icon()}
              data-selected={colorItem.selected || false}
            />
          </Button>
          {(colorItem.label || colorItem.count) && (
            <div className={labelContainer()}>
              {colorItem.label && (
                <span className={labelText()}>{colorItem.label}</span>
              )}
              {colorItem.count && (
                <span className={countText()}>({colorItem.count})</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
