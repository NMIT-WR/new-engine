/**
 * Formátuje PSČ do českého formátu XXX XX
 * @example formatPostalCode("12345") → "123 45"
 * @example formatPostalCode("123 45") → "123 45"
 */
export function formatPostalCode(value: string): string {
  // Odstranit vše kromě číslic
  const cleaned = value.replace(/\D/g, '')

  // Omezit na 5 číslic
  const limited = cleaned.slice(0, 5)

  // Formátovat jako XXX XX
  if (limited.length > 3) {
    return `${limited.slice(0, 3)} ${limited.slice(3)}`
  }

  return limited
}

/**
 * Odstraní formátování z PSČ pro API
 * @example cleanPostalCode("123 45") → "12345"
 */
export function cleanPostalCode(value: string): string {
  return value.replace(/\s/g, '')
}
