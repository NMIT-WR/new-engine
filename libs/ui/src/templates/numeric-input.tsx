import type { Ref } from 'react'
import type { IconType } from '../atoms/icon'
import { NumericInput, type NumericInputProps } from '../atoms/numeric-input'

export interface NumericInputTemplateProps
  extends Omit<NumericInputProps, 'children' | 'ref'> {
  showControls?: boolean
  showScrubber?: boolean
  controlsPosition?: 'right' | 'sides'
  incrementIcon?: IconType
  decrementIcon?: IconType
  className?: string
  ref?: Ref<HTMLDivElement>
}

export function NumericInputTemplate({
  showControls = true,
  showScrubber = false,
  controlsPosition = 'right',
  incrementIcon = 'token-icon-numeric-input-increment',
  decrementIcon = 'token-icon-numeric-input-decrement',
  className,
  ref,
  ...numericInputProps
}: NumericInputTemplateProps) {
  // Layout for controls on the right (default)
  if (controlsPosition === 'right') {
    return (
      <NumericInput {...numericInputProps} ref={ref} className={className}>
        <NumericInput.Control>
          {showScrubber && <NumericInput.Scrubber />}
          <NumericInput.Input />
          {showControls && (
            <NumericInput.TriggerContainer>
              <NumericInput.IncrementTrigger icon={incrementIcon} />
              <NumericInput.DecrementTrigger icon={decrementIcon} />
            </NumericInput.TriggerContainer>
          )}
        </NumericInput.Control>
      </NumericInput>
    )
  }

  // Layout for controls on the sides
  return (
    <NumericInput {...numericInputProps} ref={ref} className={className}>
      <div className="flex items-center gap-50">
        {showControls && <NumericInput.DecrementTrigger icon={decrementIcon} />}
        <NumericInput.Control className="flex-1">
          {showScrubber && <NumericInput.Scrubber />}
          <NumericInput.Input />
        </NumericInput.Control>
        {showControls && <NumericInput.IncrementTrigger icon={incrementIcon} />}
      </div>
    </NumericInput>
  )
}
