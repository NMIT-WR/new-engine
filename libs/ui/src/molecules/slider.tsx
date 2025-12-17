import { normalizeProps, useMachine } from "@zag-js/react"
import * as slider from "@zag-js/slider"
import { useId } from "react"
import type { VariantProps } from "tailwind-variants"
import { ErrorText } from "../atoms/error-text"
import { ExtraText } from "../atoms/extra-text"
import { Label } from "../atoms/label"
import { slugify, tv } from "../utils"

const sliderVariants = tv({
  slots: {
    root: [
      "flex w-full flex-col gap-slider-root",
      "data-[orientation=vertical]:h-full",
      "data-[disabled]:cursor-not-allowed",
    ],
    header: ["flex items-center justify-between"],
    value: ["text-slider-value-size"],
    label: ["block font-medium"],
    control: [
      "relative grid place-items-center",
      "data-[orientation=vertical]:h-full data-[orientation=vertical]:grid-rows-1",
    ],
    track: [
      "flex-1 rounded-slider-track bg-slider-track-bg",
      "data-[orientation=horizontal]:w-full",
      "data-[orientation=vertical]:h-full",
      "data-[disabled]:bg-slider-bg-disabled",
      "border-(length:--border-width-slider) border-slider-border",
      "data-[disabled]:border-slider-border-disabled",
      "transition-colors duration-200",
      "hover:bg-slider-track-bg-hover",
      "data-[invalid=true]:border-slider-border-error",
    ],
    range: [
      "h-full rounded-slider-track bg-slider-range-bg",
      "data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-full",
      "data-[disabled]:bg-slider-range-bg-disabled",
      "hover:bg-slider-range-bg-hover",
      "data-[invalid=true]:bg-slider-range-bg-error",
    ],
    thumb: [
      "flex items-center justify-center",
      "rounded-slider-thumb bg-slider-thumb-bg",
      "focus:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-slider-ring",
      "focus-visible:ring-offset-2",
      "focus-visible:scale-110",
      "data-[disabled]:bg-slider-thumb-bg-disabled",
      "border-(length:--border-width-slider) border-slider-border",
      "data-[disabled]:border-slider-border-disabled",
      "hover:bg-slider-thumb-bg-hover",
      "cursor-grab data-[disabled]:cursor-not-allowed data-[dragging]:cursor-grabbing",
      "transition-all duration-200",
      "shadow-slider-thumb",
    ],
    markerGroup: ["relative flex h-full items-center"],
    marker: [
      "relative flex h-full flex-col items-center justify-center",
      "data-[orientation=vertical]:w-full",
      "data-[orientation=vertical]:h-marker-vertical",
      "data-[orientation=vertical]:flex-row",
    ],
    markerLine: [
      "h-full w-slider-marker bg-slider-marker-bg",
      "data-[orientation=vertical]:h-slider-marker data-[orientation=vertical]:w-full",
    ],
    markerText: [
      "absolute top-full",
      "data-[orientation=vertical]:top-0 data-[orientation=vertical]:left-full",
      "data-[orientation=vertical]:h-full",
      "data-[orientation=vertical]:p-marker-text",
    ],
    footer: ["flex flex-col"],
  },
  variants: {
    size: {
      sm: {
        track: [
          "h-slider-track-sm data-[orientation=vertical]:w-slider-track-sm",
        ],
        thumb: ["w-slider-thumb-sm", "h-slider-thumb-sm"],
      },
      md: {
        track: [
          "h-slider-track-md data-[orientation=vertical]:w-slider-track-md",
        ],
        thumb: ["w-slider-thumb-md", "h-slider-thumb-md"],
      },
      lg: {
        track: [
          "h-slider-track-lg data-[orientation=vertical]:w-slider-track-lg",
        ],
        thumb: ["w-slider-thumb-lg", "h-slider-thumb-lg"],
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export interface SliderProps extends VariantProps<typeof sliderVariants> {
  id?: string
  name?: string
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
  dir?: "ltr" | "rtl"
  orientation?: "horizontal" | "vertical"
  origin?: "start" | "center" | "end"
  thumbAlignment?: "center" | "contain"
  showMarkers?: boolean
  markerCount?: number
  showValueText?: boolean
  formatRangeText?: (values: number[]) => string
  formatValue?: (value: number) => string
  className?: string
  onChange?: (values: number[]) => void
  onChangeEnd?: (values: number[]) => void
}

export function Slider({
  id,
  name,
  label,
  helperText,
  error,
  errorText,
  value,
  origin,
  thumbAlignment = "center",
  defaultValue = [25, 75],
  min = 0,
  max = 100,
  step = 1,
  minStepsBetweenThumbs = 0,
  disabled = false,
  readOnly = false,
  dir = "ltr",
  orientation = "horizontal",
  size = "md",
  showMarkers = false,
  markerCount = 5,
  showValueText = false,
  formatRangeText,
  formatValue = (val: number) => val.toString(),
  className,
  onChange,
  onChangeEnd,
}: SliderProps) {
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
  } = sliderVariants({
    className,
    size,
  })

  return (
    <div className={root({ className })} {...api.getRootProps()}>
      {(label || showValueText) && (
        <div className={header()}>
          <Label className={labelSlot()} {...api.getLabelProps()}>
            {label}
          </Label>
          {showValueText && (
            <output className={valueSlot()} {...api.getValueTextProps()}>
              <b>
                {formatRangeText
                  ? formatRangeText(api.value || defaultValue)
                  : api.value &&
                      api.value.length === 2 &&
                      api.value[0] !== undefined &&
                      api.value[1] !== undefined
                    ? `${formatValue(api.value[0])} - ${formatValue(api.value[1])}`
                    : ""}
              </b>{" "}
            </output>
          )}
        </div>
      )}

      <div className={control()} {...api.getControlProps()}>
        <div className={track()} {...api.getTrackProps()} data-invalid={error}>
          <div
            className={range()}
            {...api.getRangeProps()}
            data-invalid={error}
          />
          {showMarkers && (
            <div {...api.getMarkerGroupProps()} className={markerGroup()}>
              {Array.from({ length: markerCount }).map((_, index) => {
                const markerValue =
                  markerCount === 1
                    ? min
                    : min + ((max - min) / (markerCount - 1)) * index
                return (
                  <div
                    className={marker()}
                    key={slugify(`marker-${markerValue}`)}
                    {...api.getMarkerProps({ value: markerValue })}
                  >
                    {/* hide first and last marker line, if thumb alignmetn is center */}
                    {!(
                      thumbAlignment === "center" &&
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
                      {markerValue}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        {api.value.map((_, index) => (
          <div
            key={`thumb-${index}`}
            className={thumb()}
            {...api.getThumbProps({ index })}
          >
            <input {...api.getHiddenInputProps({ index })} />
          </div>
        ))}
      </div>
      {(helperText || errorText) && (
        <div className={footer()}>
          {/* Always render both containers to maintain consistent width */}
          <div className={error ? "block" : "invisible h-0 overflow-hidden"}>
            <ErrorText>{errorText}</ErrorText>
          </div>
          <div
            className={
              !error && helperText ? "block" : "invisible h-0 overflow-hidden"
            }
          >
            <ExtraText>{helperText}</ExtraText>
          </div>
        </div>
      )}
    </div>
  )
}
