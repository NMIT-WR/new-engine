import { getPostalCodeConfig } from "./validate"

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

export function getPostalCodePlaceholder(countryCode: string): string {
  const config = getPostalCodeConfig(countryCode)
  return config?.example ?? ""
}

export function getPostalCodeInputMode(
  countryCode: string
): "numeric" | "text" {
  const config = getPostalCodeConfig(countryCode)
  return config?.inputMode ?? "text"
}

export function getPostalCodeMaxLength(countryCode: string): number {
  const config = getPostalCodeConfig(countryCode)
  return config?.maxLength ?? 10
}
