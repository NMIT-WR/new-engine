export type PostalCodeConfig = {
  /** Regex pattern for validation */
  pattern: RegExp
  /** Display format example */
  example: string
  /** Max length for input */
  maxLength: number
  /** Input mode hint (numeric vs text) */
  inputMode: "numeric" | "text"
  /** Optional format function to apply on blur */
  format?: (value: string) => string
}

export type PhoneConfig = {
  /** Country calling code without + */
  callingCode: string
  /** Typical phone number length (without country code) */
  nationalNumberLength: number
}

export type Country = {
  /** ISO 3166-1 alpha-2 code (e.g., "CZ") */
  code: string
  /** ISO 3166-1 alpha-3 code (e.g., "CZE") */
  code3: string
  /** Full country name in English */
  name: string
  /** Localized name (Czech in this case) */
  localizedName: string
  /** Flag - ISO code for iconify circle-flags (e.g., "cz") */
  flag: string
  /** Postal code configuration */
  postalCode: PostalCodeConfig
  /** Phone configuration */
  phone: PhoneConfig
}

export type CountryCode = "CZ" | "SK" | "PL" | "DE" | "AT" | "US" | "GB" | "CA"

export type CountryOption = {
  label: string
  value: string
  flag: string
}
