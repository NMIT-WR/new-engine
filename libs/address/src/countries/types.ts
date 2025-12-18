export type PostalCodeConfig = {
  pattern: RegExp
  /** e.g., "123 45" */
  example: string
  maxLength: number
  /** Hint for mobile keyboards */
  inputMode: "numeric" | "text"
  /** Applied on blur */
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
  code: CountryCode
  /** ISO 3166-1 alpha-3 code (e.g., "CZE") */
  code3: string
  name: string
  /** Czech localization */
  localizedName: string
  /** ISO code for iconify circle-flags (e.g., "cz") */
  flag: string
  postalCode: PostalCodeConfig
  phone: PhoneConfig
}

export type CountryCode = "CZ" | "SK" | "PL" | "DE" | "AT" | "US" | "GB" | "CA"

export type CountryOption = {
  label: string
  value: string
  flag: string
}
