import {
  AsYouType,
  getCountryCallingCode,
  isValidPhoneNumber,
  type CountryCode as LibPhoneCountryCode,
  parsePhoneNumberWithError,
} from "libphonenumber-js"

export interface PhoneValidationResult {
  isValid: boolean
  /** Phone number in E.164 format (e.g., +12133734253) */
  e164?: string
  /** Formatted for display in national format */
  nationalFormat?: string
  /** Formatted for display in international format */
  internationalFormat?: string
  /** Detected country code */
  countryCode?: string
  /** National number without country code */
  nationalNumber?: string
  error?: string
}

export interface ParsedPhoneNumber {
  /** Phone number in E.164 format */
  e164: string
  /** Country code (ISO alpha-2) */
  countryCode: string
  /** National number without country code */
  nationalNumber: string
  /** Country calling code (e.g., "1" for US) */
  callingCode: string
}

/**
 * Validates a phone number for a given country
 */
export function validatePhoneNumber(
  value: string,
  countryCode?: string
): PhoneValidationResult {
  try {
    const country = countryCode?.toUpperCase() as
      | LibPhoneCountryCode
      | undefined
    const isValid = isValidPhoneNumber(value, { defaultCountry: country })

    if (isValid) {
      const parsed = parsePhoneNumberWithError(value, {
        defaultCountry: country,
      })
      return {
        isValid: true,
        e164: parsed?.number,
        nationalFormat: parsed?.formatNational(),
        internationalFormat: parsed?.formatInternational(),
        countryCode: parsed?.country,
        nationalNumber: parsed?.nationalNumber,
      }
    }

    return {
      isValid: false,
      error: "Invalid phone number",
    }
  } catch {
    return {
      isValid: false,
      error: "Unable to parse phone number",
    }
  }
}

/**
 * Formats a phone number for display (national format)
 */
export function formatPhoneNumber(value: string, countryCode?: string): string {
  try {
    const country = countryCode?.toUpperCase() as
      | LibPhoneCountryCode
      | undefined
    const parsed = parsePhoneNumberWithError(value, {
      defaultCountry: country,
    })
    return parsed?.formatNational() ?? value
  } catch {
    return value
  }
}

/**
 * Formats a phone number for display (international format)
 */
export function formatPhoneNumberInternational(
  value: string,
  countryCode?: string
): string {
  try {
    const country = countryCode?.toUpperCase() as
      | LibPhoneCountryCode
      | undefined
    const parsed = parsePhoneNumberWithError(value, {
      defaultCountry: country,
    })
    return parsed?.formatInternational() ?? value
  } catch {
    return value
  }
}

/**
 * Formats phone number as user types (real-time formatting)
 */
export function formatAsYouType(value: string, countryCode: string): string {
  try {
    const country = countryCode.toUpperCase() as LibPhoneCountryCode
    const formatter = new AsYouType(country)
    return formatter.input(value)
  } catch {
    return value
  }
}

/**
 * Parses a phone number and returns structured data
 */
export function parsePhoneNumber(
  value: string,
  countryCode?: string
): ParsedPhoneNumber | null {
  try {
    const country = countryCode?.toUpperCase() as
      | LibPhoneCountryCode
      | undefined
    const parsed = parsePhoneNumberWithError(value, {
      defaultCountry: country,
    })

    if (!(parsed?.country && parsed.number)) {
      return null
    }

    return {
      e164: parsed.number,
      countryCode: parsed.country,
      nationalNumber: parsed.nationalNumber,
      callingCode: getCountryCallingCode(parsed.country),
    }
  } catch {
    return null
  }
}

/**
 * Converts a local number + country to E.164 format
 */
export function toE164(nationalNumber: string, countryCode: string): string {
  try {
    const country = countryCode.toUpperCase() as LibPhoneCountryCode
    const formatter = new AsYouType(country)
    formatter.input(nationalNumber)
    const phoneNumber = formatter.getNumber()
    return phoneNumber?.number ?? ""
  } catch {
    return ""
  }
}

/**
 * Extracts country code and national number from E.164 value
 */
export function fromE164(e164Value: string): {
  countryCode: string | undefined
  nationalNumber: string
} {
  try {
    const parsed = parsePhoneNumberWithError(e164Value)
    return {
      countryCode: parsed?.country,
      nationalNumber: parsed?.nationalNumber ?? "",
    }
  } catch {
    return { countryCode: undefined, nationalNumber: "" }
  }
}

/**
 * Gets the country calling code for a country (e.g., "1" for US, "420" for CZ)
 */
export function getCallingCode(countryCode: string): string {
  try {
    const country = countryCode.toUpperCase() as LibPhoneCountryCode
    return getCountryCallingCode(country)
  } catch {
    return ""
  }
}

/**
 * Detects country from a phone number that starts with +
 */
export function detectCountryFromPhone(value: string): string | undefined {
  if (!value.startsWith("+")) return

  try {
    const formatter = new AsYouType()
    formatter.input(value)
    return formatter.getNumber()?.country
  } catch {
    return
  }
}

/**
 * Checks if a phone number is valid for a given country
 */
export function isValidPhone(value: string, countryCode?: string): boolean {
  try {
    const country = countryCode?.toUpperCase() as
      | LibPhoneCountryCode
      | undefined
    return isValidPhoneNumber(value, { defaultCountry: country })
  } catch {
    return false
  }
}
