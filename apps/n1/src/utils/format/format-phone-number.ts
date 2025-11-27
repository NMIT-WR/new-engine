export function formatPhoneNumber(value: string): string {
  // Odstranit vše kromě číslic a +
  const cleaned = value.replace(/[^\d+]/g, '')

  // Pokud začíná +420, formátovat s předvolbou
  if (cleaned.startsWith('+420')) {
    const numbers = cleaned.slice(4)
    const groups = numbers.match(/.{1,3}/g) || []
    return `+420 ${groups.join(' ')}`.trim()
  }

  // Jinak formátovat jako 9 číslic
  const groups = cleaned.match(/.{1,3}/g) || []
  return groups.join(' ')
}

// Pro odeslání na API - odstranit mezery
export function cleanPhoneNumber(value: string): string {
  return value.replace(/\s/g, '')
}
