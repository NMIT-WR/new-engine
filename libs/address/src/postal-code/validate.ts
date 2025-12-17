import { getCountry } from "../countries"
import type { PostalCodeConfig } from "../countries/types"

export interface PostalCodeValidationResult {
  isValid: boolean
  formattedValue?: string
  error?: string
}

/**
 * Validates a postal code for a given country
 */
export function validatePostalCode(
  value: string,
  countryCode: string
): PostalCodeValidationResult {
  const country = getCountry(countryCode)

  if (!country) {
    return {
      isValid: false,
      error: `Unknown country code: ${countryCode}`,
    }
  }

  const { pattern, format } = country.postalCode
  const isValid = pattern.test(value)

  return {
    isValid,
    formattedValue: isValid && format ? format(value) : value,
    error: isValid
      ? undefined
      : `Invalid postal code format for ${country.name}`,
  }
}

/**
 * Gets postal code configuration for a country
 */
export function getPostalCodeConfig(
  countryCode: string
): PostalCodeConfig | undefined {
  const country = getCountry(countryCode)
  return country?.postalCode
}

/**
 * Checks if a value could be a valid postal code (partial match)
 * Useful for real-time validation during typing
 */
export function isPartialPostalCode(
  value: string,
  countryCode: string
): boolean {
  const config = getPostalCodeConfig(countryCode)
  if (!config) return true // Allow typing if country unknown

  // Check if value length is within bounds
  const cleanValue = value.replace(/\s/g, "")
  return cleanValue.length <= config.maxLength
}
