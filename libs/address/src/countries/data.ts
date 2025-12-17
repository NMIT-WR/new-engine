import type { Country, CountryCode, CountryOption } from "./types"

// Shared postal code format for CZ/SK (XXX XX pattern)
const formatCzSkPostalCode = (v: string) => {
  const digits = v.replace(/\D/g, "")
  if (digits.length <= 3) return digits
  return `${digits.slice(0, 3)} ${digits.slice(3, 5)}`
}

export const COUNTRIES: Record<CountryCode, Country> = {
  CZ: {
    code: "CZ",
    code3: "CZE",
    name: "Czech Republic",
    localizedName: "Ceska republika",
    flag: "cz",
    postalCode: {
      pattern: /^\d{3}\s?\d{2}$/,
      example: "123 45",
      maxLength: 6,
      inputMode: "numeric",
      format: formatCzSkPostalCode,
    },
    phone: {
      callingCode: "420",
      nationalNumberLength: 9,
    },
  },
  SK: {
    code: "SK",
    code3: "SVK",
    name: "Slovakia",
    localizedName: "Slovensko",
    flag: "sk",
    postalCode: {
      pattern: /^\d{3}\s?\d{2}$/,
      example: "123 45",
      maxLength: 6,
      inputMode: "numeric",
      format: formatCzSkPostalCode,
    },
    phone: {
      callingCode: "421",
      nationalNumberLength: 9,
    },
  },
  DE: {
    code: "DE",
    code3: "DEU",
    name: "Germany",
    localizedName: "Nemecko",
    flag: "de",
    postalCode: {
      pattern: /^\d{5}$/,
      example: "12345",
      maxLength: 5,
      inputMode: "numeric",
    },
    phone: {
      callingCode: "49",
      nationalNumberLength: 11,
    },
  },
  AT: {
    code: "AT",
    code3: "AUT",
    name: "Austria",
    localizedName: "Rakousko",
    flag: "at",
    postalCode: {
      pattern: /^\d{4}$/,
      example: "1234",
      maxLength: 4,
      inputMode: "numeric",
    },
    phone: {
      callingCode: "43",
      nationalNumberLength: 10,
    },
  },
  PL: {
    code: "PL",
    code3: "POL",
    name: "Poland",
    localizedName: "Polsko",
    flag: "pl",
    postalCode: {
      pattern: /^\d{2}-\d{3}$/,
      example: "12-345",
      maxLength: 6,
      inputMode: "text",
      format: (v) => {
        const digits = v.replace(/\D/g, "")
        if (digits.length <= 2) return digits
        return `${digits.slice(0, 2)}-${digits.slice(2, 5)}`
      },
    },
    phone: {
      callingCode: "48",
      nationalNumberLength: 9,
    },
  },
  US: {
    code: "US",
    code3: "USA",
    name: "United States",
    localizedName: "USA",
    flag: "us",
    postalCode: {
      pattern: /^\d{5}(-\d{4})?$/,
      example: "12345 or 12345-6789",
      maxLength: 10,
      inputMode: "text",
    },
    phone: {
      callingCode: "1",
      nationalNumberLength: 10,
    },
  },
  GB: {
    code: "GB",
    code3: "GBR",
    name: "United Kingdom",
    localizedName: "Velka Britanie",
    flag: "gb",
    postalCode: {
      // UK postcodes: A9 9AA, A99 9AA, A9A 9AA, AA9 9AA, AA99 9AA, AA9A 9AA
      pattern: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
      example: "SW1A 1AA",
      maxLength: 8,
      inputMode: "text",
      format: (v) => {
        const clean = v.replace(/\s/g, "").toUpperCase()
        if (clean.length <= 4) return clean
        // Insert space before last 3 characters
        return `${clean.slice(0, -3)} ${clean.slice(-3)}`
      },
    },
    phone: {
      callingCode: "44",
      nationalNumberLength: 10,
    },
  },
  CA: {
    code: "CA",
    code3: "CAN",
    name: "Canada",
    localizedName: "Kanada",
    flag: "ca",
    postalCode: {
      pattern: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
      example: "K1A 0B1",
      maxLength: 7,
      inputMode: "text",
      format: (v) => {
        const clean = v.replace(/\s/g, "").toUpperCase()
        if (clean.length <= 3) return clean
        return `${clean.slice(0, 3)} ${clean.slice(3, 6)}`
      },
    },
    phone: {
      callingCode: "1",
      nationalNumberLength: 10,
    },
  },
}

/** Array of all supported countries */
export const COUNTRIES_LIST: Country[] = Object.values(COUNTRIES)

/** Country options for Select component compatibility */
export const COUNTRY_OPTIONS: CountryOption[] = COUNTRIES_LIST.map((c) => ({
  label: c.localizedName,
  value: c.code.toLowerCase(),
  flag: c.flag,
}))

/** Get country by code (case-insensitive) */
export function getCountry(code: string): Country | undefined {
  return COUNTRIES[code.toUpperCase() as CountryCode]
}

/** Get all country codes */
export function getCountryCodes(): CountryCode[] {
  return Object.keys(COUNTRIES) as CountryCode[]
}
