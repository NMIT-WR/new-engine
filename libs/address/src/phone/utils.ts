import {
  AsYouType,
  getCountryCallingCode,
  isValidPhoneNumber,
  type CountryCode as LibPhoneCountryCode,
  parsePhoneNumberWithError,
} from "libphonenumber-js"

export type PhoneValidationResult = {
  isValid: boolean
  /** E.164 format (e.g., +12133734253) */
  e164?: string
  nationalFormat?: string
  internationalFormat?: string
  countryCode?: string
  /** Without country code */
  nationalNumber?: string
  error?: string
}

export type ParsedPhoneNumber = {
  e164: string
  countryCode: string
  nationalNumber: string
  /** e.g., "1" for US, "420" for CZ */
  callingCode: string
}

/**
 * Validates a phone number for a given country.
 * Parses once and derives validity from success/failure to avoid redundant parsing.
 */
export function validatePhoneNumber(
  value: string,
  countryCode?: string
): PhoneValidationResult {
  try {
    const country = countryCode?.toUpperCase() as
      | LibPhoneCountryCode
      | undefined
    const parsed = parsePhoneNumberWithError(value, {
      defaultCountry: country,
    })

    if (parsed.isValid()) {
      return {
        isValid: true,
        e164: parsed.number,
        nationalFormat: parsed.formatNational(),
        internationalFormat: parsed.formatInternational(),
        countryCode: parsed.country,
        nationalNumber: parsed.nationalNumber,
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

export function toE164(phoneNumber: string, countryCode: string): string {
  try {
    const country = countryCode.toUpperCase() as LibPhoneCountryCode
    const parsed = parsePhoneNumberWithError(phoneNumber, {
      defaultCountry: country,
    })
    return parsed.number ?? ""
  } catch {
    return ""
  }
}

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
  if (!value.startsWith("+")) {
    return
  }

  try {
    const formatter = new AsYouType()
    formatter.input(value)
    return formatter.getNumber()?.country
  } catch {
    return
  }
}

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
