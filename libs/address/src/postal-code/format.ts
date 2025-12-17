import { getPostalCodeConfig } from "./validate"

/**
 * Formats a postal code value according to country rules
 */
export function formatPostalCode(value: string, countryCode: string): string {
  const config = getPostalCodeConfig(countryCode)
  if (!config?.format) {
    return value
  }
  return config.format(value)
}

/**
 * Strips formatting from a postal code (returns digits/letters only)
 */
export function stripPostalCodeFormatting(value: string): string {
  return value.replace(/[\s-]/g, "")
}

/**
 * Gets placeholder text for postal code input
 */
export function getPostalCodePlaceholder(countryCode: string): string {
  const config = getPostalCodeConfig(countryCode)
  return config?.example ?? ""
}

/**
 * Gets input mode for postal code input (numeric or text)
 */
export function getPostalCodeInputMode(
  countryCode: string
): "numeric" | "text" {
  const config = getPostalCodeConfig(countryCode)
  return config?.inputMode ?? "text"
}

/**
 * Gets max length for postal code input
 */
export function getPostalCodeMaxLength(countryCode: string): number {
  const config = getPostalCodeConfig(countryCode)
  return config?.maxLength ?? 10
}
