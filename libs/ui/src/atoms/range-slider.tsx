import { normalizeProps, useMachine } from '@zag-js/react'
import * as slider from '@zag-js/slider'
import { useId } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '../utils'
import { Error } from './error'
import { ExtraText } from './extra-text'
import { Label } from './label'

const rangeSliderVariants = tv({
  slots: {
    root: [
      'flex flex-col w-full gap-slider-root',
      'data-[orientation=vertical]:h-full',
      'data-[disabled]:opacity-slider-disabled data-[disabled]:cursor-not-allowed',
    ],
    header: ['flex items-center justify-between'],
    value: ['text-slider-value-size'],
    label: ['block font-medium'],
    control: [
      'relative grid place-items-center ',
      'data-[orientation=vertical]:h-full data-[orientation=vertical]:grid-rows-1',
    ],
    track: [
      'rounded-slider-track bg-slider-track flex-1',
      'data-[orientation=horizontal]:w-full',
      'data-[orientation=vertical]:h-full ',
      'data-[disabled]:bg-slider-track-disabled',
      'border-(length:--border-width-slider) border-slider-border',
      'data-[disabled]:border-slider-border-disabled',
      'transition-colors duration-200',
      'hover:bg-slider-track-hover',
      'data-[invalid=true]:border-slider-border-error',
    ],
    range: [
      'bg-slider-range rounded-slider-track h-full',
      'data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-full',
      'data-[disabled]:bg-slider-range-disabled',
      'hover:bg-slider-range-hover',
      'data-[invalid=true]:bg-slider-range-error',
    ],
    thumb: [
      'flex items-center justify-center',
      'rounded-slider-thumb bg-slider-thumb',
      'focus:outline-none',
      'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slider-ring',
      'data-[disabled]:bg-slider-thumb-disabled',
      'border-(length:--border-width-slider) border-slider-border',
      'data-[disabled]:border-slider-border-disabled',
      'hover:bg-slider-thumb-hover',
      'cursor-grab data-[dragging]:cursor-grabbing data-[disabled]:cursor-not-allowed',
      'transition-colors duration-200',
      'shadow-slider-thumb',
    ],
    markerGroup: ['relative h-full flex items-center'],
    marker: [
      'relative h-full flex flex-col justify-center items-center',
      'data-[orientation=vertical]:w-full',
      'data-[orientation=vertical]:h-marker-vertical',
      'data-[orientation=vertical]:flex-row',
    ],
    markerLine: [
      'w-slider-marker h-full bg-slider-marker',
      'data-[orientation=vertical]:h-slider-marker-vertical data-[orientation=vertical]:w-full',
    ],
    markerText: [
      'absolute top-full',
      'data-[orientation=vertical]:top-0 data-[orientation=vertical]:left-full',
      'data-[orientation=vertical]:ml-slider-marker-vertical',
      'data-[orientation=vertical]:h-full',
    ],
    footer: ['flex flex-col'],
  },
  variants: {
    size: {
      sm: {
        track: [
          'h-slider-track-sm data-[orientation=vertical]:w-slider-track-sm',
        ],
        thumb: ['w-slider-thumb-sm', 'h-slider-thumb-sm'],
      },
      md: {
        track: [
          'h-slider-track-md data-[orientation=vertical]:w-slider-track-md',
        ],
        thumb: ['w-slider-thumb-md', 'h-slider-thumb-md'],
      },
      lg: {
        track: [
          'h-slider-track-lg data-[orientation=vertical]:w-slider-track-lg',
        ],
        thumb: ['w-slider-thumb-lg', 'h-slider-thumb-lg'],
      },
    },
  },
})

export interface RangeSliderProps
  extends VariantProps<typeof rangeSliderVariants> {
  id?: string
  name?: string
  size?: 'sm' | 'md' | 'lg'
  label?: string
  helperText?: string
  error?: boolean
  errorText?: string
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  minStepsBetweenThumbs?: number
  disabled?: boolean
  readOnly?: boolean
  dir?: 'ltr' | 'rtl'
  orientation?: 'horizontal' | 'vertical'
  origin?: 'start' | 'center' | 'end'
  thumbAlignment?: 'center' | 'contain'
  showMarkers?: boolean
  markerCount?: number
  showValueText?: boolean
  formatValue?: (value: number) => string
  className?: string
  onChange?: (values: number[]) => void
  onChangeEnd?: (values: number[]) => void
}

export function RangeSlider({
  id,
  name,
  label,
  helperText,
  error,
  errorText,
  value,
  origin,
  thumbAlignment = 'center',
  defaultValue = [25, 75],
  min = 0,
  max = 100,
  step = 1,
  minStepsBetweenThumbs = 0,
  disabled = false,
  readOnly = false,
  dir = 'ltr',
  orientation = 'horizontal',
  size = 'md',
  showMarkers = false,
  markerCount = 5,
  showValueText = false,
  formatValue = (val: number) => val.toString(),
  className,
  onChange,
  onChangeEnd,
}: RangeSliderProps) {
  const generatedId = useId()
  const uniqueId = id || generatedId

  const service = useMachine(slider.machine, {
    id: uniqueId,
    name,
    value,
    defaultValue,
    min,
    max,
    origin,
    thumbAlignment,
    step,
    minStepsBetweenThumbs,
    disabled,
    readOnly,
    dir,
    orientation,
    onValueChange: (details) => onChange?.(details.value),
    onValueChangeEnd: (details) => onChangeEnd?.(details.value),
  })

  const api = slider.connect(service, normalizeProps)

  const {
    root,
    label: labelSlot,
    control,
    track,
    range,
    thumb,
    header,
    value: valueSlot,
    markerGroup,
    marker,
    markerLine,
    markerText,
    footer,
  } = rangeSliderVariants({
    className,
  })

  return (
    <div className={root()} {...api.getRootProps()}>
      {(label || showValueText) && (
        <div className={header()}>
          <Label className={labelSlot()} {...api.getLabelProps()}>
            {label}
          </Label>
          {showValueText && (
            <output className={valueSlot()} {...api.getValueTextProps()}>
              <b>{api.value.join(' - ')}</b>
            </output>
          )}
        </div>
      )}

      <div className={control()} {...api.getControlProps()}>
        <div
          className={track({ size })}
          {...api.getTrackProps()}
          data-invalid={error}
        >
          <div
            className={range()}
            {...api.getRangeProps()}
            data-invalid={error}
          />
          {showMarkers && (
            <div {...api.getMarkerGroupProps()} className={markerGroup()}>
              {Array.from({ length: markerCount }).map((_, index) => {
                const markerValue =
                  min + ((max - min) / (markerCount - 1)) * index
                return (
                  <div
                    key={index}
                    className={marker()}
                    {...api.getMarkerProps({ value: markerValue })}
                  >
                    {/* hide first and last marker line, if thumb alignmetn is center */}
                    {!(
                      thumbAlignment === 'center' &&
                      (index === 0 || index === markerCount - 1)
                    ) && (
                      <div
                        className={markerLine()}
                        data-orientation={orientation}
                      />
                    )}
                    <span
                      className={markerText()}
                      data-orientation={orientation}
                    >
                      {formatValue(markerValue)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        {api.value.map((_, index) => (
          <div
            key={index}
            className={thumb({ size })}
            {...api.getThumbProps({ index })}
          >
            <input {...api.getHiddenInputProps({ index })} />
          </div>
        ))}
      </div>
      {(helperText || errorText) && (
        <div className={footer()}>
          {/* Always render both containers to maintain consistent width */}
          <div className={error ? 'block' : 'invisible h-0 overflow-hidden'}>
            <Error>{errorText}</Error>
          </div>
          <div
            className={
              !error && helperText ? 'block' : 'invisible h-0 overflow-hidden'
            }
          >
            <ExtraText>{helperText}</ExtraText>
          </div>
        </div>
      )}
    </div>
  )
}
