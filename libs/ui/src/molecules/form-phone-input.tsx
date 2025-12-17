import {
  formatAsYouType,
  fromE164,
  getCallingCode,
  toE164,
} from "@techsio/address/phone/utils"
import { normalizeProps, Portal, useMachine } from "@zag-js/react"
import * as select from "@zag-js/select"
import { type ReactNode, useEffect, useId, useMemo, useState } from "react"
import type { VariantProps } from "tailwind-variants"
import { ErrorText } from "../atoms/error-text"
import { ExtraText } from "../atoms/extra-text"
import { Icon, type IconType } from "../atoms/icon"
import { Label } from "../atoms/label"
import { tv } from "../utils"

// === TYPES ===

export interface PhoneCountryData {
  /** ISO 3166-1 alpha-2 code (e.g., "US") */
  code: string
  /** Country name */
  name: string
  /** Country calling code without + (e.g., "1") */
  callingCode: string
  /** Flag identifier for iconify flag set (e.g., "us") */
  flag: string
}

type ValidateStatus = "default" | "error" | "success" | "warning"

// === COMPONENT VARIANTS ===

const phoneInputVariants = tv({
  slots: {
    root: ["flex flex-col", "w-full", "min-w-phone-input"],
    control: [
      "relative flex w-full items-center",
      "bg-phone-input-bg",
      "border border-phone-input-border",
      "rounded-phone-input",
      "transition-colors duration-200 ease-in-out",
      "hover:border-phone-input-border-hover hover:bg-phone-input-bg-hover",
      "focus-within:border-phone-input-border-focus focus-within:bg-phone-input-bg-focus",
      "focus-within:ring focus-within:ring-phone-input-ring",
      "data-[disabled]:border-phone-input-border-disabled data-[disabled]:bg-phone-input-bg-disabled",
      "data-[disabled]:cursor-not-allowed",
      "data-[validation=error]:border-phone-input-border-danger",
      "data-[validation=success]:border-phone-input-border-success",
      "data-[validation=warning]:border-phone-input-border-warning",
    ],
    countryTrigger: [
      "flex items-center",
      "gap-phone-input-country-gap",
      "px-phone-input-country-x",
      "border-phone-input-divider border-r",
      "text-phone-input-fg",
      "hover:bg-phone-input-bg-hover",
      "focus:outline-none",
      "cursor-pointer",
      "data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed",
    ],
    countryFlag: ["flex-shrink-0"],
    countryCode: ["text-phone-input-fg-secondary", "font-medium"],
    countryChevron: [
      "text-phone-input-fg-secondary",
      "transition-transform duration-200",
      "data-[state=open]:rotate-180",
    ],
    input: [
      "w-full flex-1",
      "border-none bg-transparent",
      "px-phone-input-x",
      "text-phone-input-fg",
      "placeholder:text-phone-input-placeholder",
      "focus:outline-none",
      "data-[disabled]:cursor-not-allowed data-[disabled]:text-phone-input-fg-disabled",
    ],
    positioner: ["z-(--z-phone-input-dropdown)", "w-(--reference-width)"],
    content: [
      "flex flex-col",
      "max-h-phone-input-dropdown-max-h overflow-auto",
      "bg-phone-input-dropdown-bg",
      "border border-phone-input-dropdown-border",
      "rounded-phone-input shadow-phone-input-dropdown",
    ],
    item: [
      "flex items-center",
      "gap-phone-input-item-gap",
      "px-phone-input-item-x py-phone-input-item-y",
      "cursor-pointer",
      "text-phone-input-item-fg",
      "hover:bg-phone-input-item-bg-hover",
      "data-[highlighted]:bg-phone-input-item-bg-hover",
      "data-[state=checked]:bg-phone-input-item-bg-selected",
      "data-[disabled]:cursor-not-allowed data-[disabled]:text-phone-input-fg-disabled",
    ],
    itemFlag: ["flex-shrink-0"],
    itemName: ["flex-1 truncate"],
    itemDialCode: ["text-phone-input-fg-secondary"],
  },
  variants: {
    size: {
      sm: {
        root: "gap-phone-input-root-sm",
        control: "h-phone-input-sm",
        countryTrigger: "text-phone-input-sm",
        countryFlag: "size-phone-input-flag-sm",
        input: "text-phone-input-sm",
        content: "text-phone-input-sm",
        item: "text-phone-input-sm",
        itemFlag: "size-phone-input-flag-sm",
      },
      md: {
        root: "gap-phone-input-root-md",
        control: "h-phone-input-md",
        countryTrigger: "text-phone-input-md",
        countryFlag: "size-phone-input-flag-md",
        input: "text-phone-input-md",
        content: "text-phone-input-md",
        item: "text-phone-input-md",
        itemFlag: "size-phone-input-flag-md",
      },
      lg: {
        root: "gap-phone-input-root-lg",
        control: "h-phone-input-lg",
        countryTrigger: "text-phone-input-lg",
        countryFlag: "size-phone-input-flag-lg",
        input: "text-phone-input-lg",
        content: "text-phone-input-lg",
        item: "text-phone-input-lg",
        itemFlag: "size-phone-input-flag-lg",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
})

// === FLAG ICON TOKEN MAPPING ===
// Static mapping - all values must match token-icon-flag-* utilities in CSS
const FLAG_ICON_TOKENS: Record<string, IconType> = {
  cz: "token-icon-flag-cz",
  sk: "token-icon-flag-sk",
  de: "token-icon-flag-de",
  at: "token-icon-flag-at",
  pl: "token-icon-flag-pl",
  gb: "token-icon-flag-gb",
}

// === DEFAULT COUNTRIES ===
// EU-typical countries only (must have corresponding flag token)

const DEFAULT_COUNTRIES: PhoneCountryData[] = [
  { code: "CZ", name: "Czech Republic", callingCode: "420", flag: "cz" },
  { code: "SK", name: "Slovakia", callingCode: "421", flag: "sk" },
  { code: "DE", name: "Germany", callingCode: "49", flag: "de" },
  { code: "AT", name: "Austria", callingCode: "43", flag: "at" },
  { code: "PL", name: "Poland", callingCode: "48", flag: "pl" },
  { code: "GB", name: "United Kingdom", callingCode: "44", flag: "gb" },
]

// === COMPONENT PROPS ===

export interface FormPhoneInputProps
  extends VariantProps<typeof phoneInputVariants> {
  /** Form field ID */
  id?: string
  /** Field name for form submission */
  name?: string
  /** Label text */
  label?: ReactNode
  /** Placeholder text */
  placeholder?: string
  /** Controlled value in E.164 format (e.g., "+12133734253") */
  value?: string
  /** Default value in E.164 format */
  defaultValue?: string
  /** Default country code (ISO alpha-2) */
  defaultCountry?: string
  /** Callback when value changes (emits E.164 format) */
  onChange?: (e164Value: string) => void
  /** Callback when country changes */
  onCountryChange?: (countryCode: string) => void
  /** Validation state */
  validateStatus?: ValidateStatus
  /** Help text shown below input */
  helpText?: ReactNode
  /** Error text shown when validateStatus is "error" */
  errorText?: ReactNode
  /** Extra text shown below help/error text */
  extraText?: ReactNode
  /** Disabled state */
  disabled?: boolean
  /** Read-only state */
  readOnly?: boolean
  /** Required field */
  required?: boolean
  /** Custom country list */
  countries?: PhoneCountryData[]
  /** Countries to show at top of list */
  priorityCountries?: string[]
  /** Countries to exclude from list */
  excludeCountries?: string[]
  /** Additional class name */
  className?: string
}

export function FormPhoneInput({
  id: providedId,
  name,
  label,
  placeholder = "Phone number",
  value,
  defaultValue,
  defaultCountry = "CZ",
  onChange,
  onCountryChange,
  validateStatus = "default",
  helpText,
  errorText,
  extraText,
  disabled = false,
  readOnly = false,
  required = false,
  countries = DEFAULT_COUNTRIES,
  priorityCountries = [],
  excludeCountries = [],
  size = "md",
  className,
}: FormPhoneInputProps) {
  const generatedId = useId()
  const id = providedId || generatedId
  const inputId = `${id}-input`
  const countrySelectId = `${id}-country`
  const helperId = helpText || errorText ? `${id}-helper` : undefined

  // === State ===
  const [selectedCountry, setSelectedCountry] = useState<string>(() => {
    if (defaultValue) {
      const { countryCode } = fromE164(defaultValue)
      return countryCode || defaultCountry
    }
    return defaultCountry
  })

  const [displayValue, setDisplayValue] = useState<string>(() => {
    if (defaultValue) {
      const { nationalNumber, countryCode } = fromE164(defaultValue)
      return formatAsYouType(nationalNumber, countryCode || defaultCountry)
    }
    return ""
  })

  // === Filtered & sorted countries ===
  const sortedCountries = useMemo(() => {
    const filtered = countries.filter((c) => !excludeCountries.includes(c.code))
    const priority = filtered.filter((c) => priorityCountries.includes(c.code))
    const rest = filtered.filter((c) => !priorityCountries.includes(c.code))
    return [...priority, ...rest]
  }, [countries, priorityCountries, excludeCountries])

  // === Zag.js Select for country dropdown ===
  const countryCollection = select.collection({
    items: sortedCountries,
    itemToString: (item) => item.name,
    itemToValue: (item) => item.code,
  })

  const countryService = useMachine(select.machine, {
    id: countrySelectId,
    collection: countryCollection,
    value: [selectedCountry],
    disabled,
    readOnly,
    onValueChange: ({ value: newValue }) => {
      const newCountry = newValue[0]
      if (newCountry) {
        handleCountryChange(newCountry)
      }
    },
  })

  const countryApi = select.connect(
    countryService as select.Service,
    normalizeProps
  )

  // === Sync controlled value ===
  useEffect(() => {
    if (value !== undefined) {
      const { countryCode, nationalNumber } = fromE164(value)
      if (countryCode && countryCode !== selectedCountry) {
        setSelectedCountry(countryCode)
      }
      setDisplayValue(
        formatAsYouType(nationalNumber, countryCode || selectedCountry)
      )
    }
  }, [value, selectedCountry])

  // === Handlers ===
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value
    const digits = inputValue.replace(/\D/g, "")
    const formatted = formatAsYouType(digits, selectedCountry)
    setDisplayValue(formatted)

    const e164 = toE164(digits, selectedCountry)
    onChange?.(e164)
  }

  function handleCountryChange(newCountry: string) {
    setSelectedCountry(newCountry)
    onCountryChange?.(newCountry)

    if (displayValue) {
      const digits = displayValue.replace(/\D/g, "")
      const formatted = formatAsYouType(digits, newCountry)
      setDisplayValue(formatted)
      const e164 = toE164(digits, newCountry)
      onChange?.(e164)
    }
  }

  // === Get current country data ===
  // Fall back to first available country if selectedCountry is excluded
  const currentCountry =
    sortedCountries.find((c) => c.code === selectedCountry) ||
    sortedCountries[0]
  const callingCode =
    currentCountry?.callingCode || getCallingCode(selectedCountry)

  // === Styles ===
  const {
    root,
    control,
    countryTrigger,
    countryFlag,
    countryCode: countryCodeStyle,
    countryChevron,
    input,
    positioner,
    content,
    item,
    itemFlag,
    itemName,
    itemDialCode,
  } = phoneInputVariants({ size })

  return (
    <>
      {/* Hidden select for form submission */}
      <select {...countryApi.getHiddenSelectProps()} />

      <div className={root({ className })}>
        {/* Label */}
        {label && (
          <Label
            disabled={disabled}
            htmlFor={inputId}
            required={required}
            size={size}
          >
            {label}
          </Label>
        )}

        {/* Main control wrapper */}
        <div
          className={control()}
          data-disabled={disabled || undefined}
          data-validation={
            validateStatus !== "default" ? validateStatus : undefined
          }
        >
          {/* Country selector trigger */}
          <button
            className={countryTrigger()}
            type="button"
            {...countryApi.getTriggerProps()}
            data-disabled={disabled || undefined}
          >
            {(() => {
              const flagIcon =
                currentCountry && FLAG_ICON_TOKENS[currentCountry.flag]
              return flagIcon ? (
                <>
                  <Icon className={countryFlag()} icon={flagIcon} />
                  <span className={countryCodeStyle()}>+{callingCode}</span>
                </>
              ) : null
            })()}
            <Icon
              className={countryChevron()}
              data-state={countryApi.open ? "open" : "closed"}
              icon="token-icon-phone-input-chevron"
            />
          </button>

          {/* Phone number input */}
          <input
            aria-describedby={helperId}
            aria-invalid={validateStatus === "error"}
            autoComplete="tel"
            className={input()}
            data-disabled={disabled || undefined}
            disabled={disabled}
            id={inputId}
            inputMode="tel"
            name={name}
            onChange={handleInputChange}
            placeholder={placeholder}
            readOnly={readOnly}
            required={required}
            type="tel"
            value={displayValue}
          />
        </div>

        {/* Country dropdown portal */}
        <Portal>
          <div className={positioner()} {...countryApi.getPositionerProps()}>
            <ul className={content()} {...countryApi.getContentProps()}>
              {sortedCountries.map((country) => {
                const flagIcon = FLAG_ICON_TOKENS[country.flag]
                return (
                  <li
                    className={item()}
                    key={country.code}
                    {...countryApi.getItemProps({ item: country })}
                  >
                    {flagIcon && (
                      <Icon className={itemFlag()} icon={flagIcon} />
                    )}
                    <span className={itemName()}>{country.name}</span>
                    <span className={itemDialCode()}>
                      +{country.callingCode}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </Portal>

        {/* Helper/Error text */}
        {validateStatus === "error" && errorText && (
          <ErrorText id={helperId} showIcon size={size}>
            {errorText}
          </ErrorText>
        )}
        {validateStatus !== "error" && helpText && (
          <ExtraText id={helperId} size={size}>
            {helpText}
          </ExtraText>
        )}
        {extraText && (
          <ExtraText id={`${id}-extra`} size={size}>
            {extraText}
          </ExtraText>
        )}
      </div>
    </>
  )
}

FormPhoneInput.displayName = "FormPhoneInput"
