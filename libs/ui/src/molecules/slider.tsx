import { normalizeProps, useMachine } from "@zag-js/react"
import * as slider from "@zag-js/slider"
import { useId } from "react"
import type { VariantProps } from "tailwind-variants"
import { Label } from "../atoms/label"
import { StatusText } from "../atoms/status-text"
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
      "transition-colors duration-200 motion-reduce:transition-none",
      "hover:bg-slider-track-bg-hover",
      "data-[invalid=true]:border-slider-border-error",
    ],
    range: [
      "h-full rounded-slider-track bg-slider-range-bg",
      "data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-full",
      "data-[disabled]:bg-slider-range-bg-disabled",
      "hover:bg-slider-range-bg-hover",
      "data-[invalid=true]:bg-slider-range-bg-error",
      "transition-colors duration-200 motion-reduce:transition-none",
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
  validateStatus?: "default" | "error" | "success" | "warning"
  helpText?: string
  showHelpTextIcon?: boolean
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
  validateStatus,
  helpText,
  showHelpTextIcon = true,
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
        <div className={track()} {...api.getTrackProps()} data-invalid={validateStatus === "error"}>
          <div
            className={range()}
            {...api.getRangeProps()}
            data-invalid={validateStatus === "error"}
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
            className={thumb()}
            key={`thumb-${index}`}
            {...api.getThumbProps({ index })}
          >
            <input {...api.getHiddenInputProps({ index })} />
          </div>
        ))}
      </div>
      {helpText && (
        <StatusText
          status={validateStatus}
          showIcon={showHelpTextIcon}
          size={size}
        >
          {helpText}
        </StatusText>
      )}
    </div>
  )
}
