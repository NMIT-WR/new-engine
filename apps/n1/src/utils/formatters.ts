/**
 * Input formatters for form fields
 * Provides consistent formatting across the application
 */

export const formatters = {
  /**
   * Format postal code to XXX XX pattern for Czech and Slovak addresses
   */
  postalCode: (value: string, countryCode?: 'cz' | 'sk'): string => {
    if (!countryCode || !['cz', 'sk'].includes(countryCode)) {
      return value
    }

    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)}`.trim()
    }
    return cleaned
  },

  /**
   * Clean phone number - keep only valid characters
   */
  phone: (value: string): string => {
    return value.replace(/[^0-9+\s()-]/g, '')
  },

  /**
   * Capitalize first letter of name fields
   */
  name: (value: string): string => {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  },
} as const

/**
 * Format address object for display
 */
export function formatAddressForDisplay(address: {
  first_name?: string
  last_name?: string
  address_1?: string
  address_2?: string
  city?: string
  postal_code?: string
  country_code?: string
  phone?: string
}): string[] {
  const lines = [
    `${address.first_name || ''} ${address.last_name || ''}`.trim(),
    address.address_1,
    address.address_2,
    `${address.city || ''}, ${address.postal_code || ''}`.trim(),
    address.country_code?.toUpperCase() === 'CZ'
      ? 'Czech Republic'
      : address.country_code?.toUpperCase() === 'SK'
        ? 'Slovakia'
        : address.country_code?.toUpperCase(),
  ].filter(Boolean) as string[]

  return lines
}
