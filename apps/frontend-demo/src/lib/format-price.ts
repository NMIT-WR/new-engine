const ZERO_FRACTION_CURRENCIES = new Set(["CZK", "SEK", "DKK", "NOK", "PLN"])

/**
 * Unified app-level price formatter.
 * Amount is expected in major currency units.
 */
export function formatPrice(amount: number, currencyCode = "CZK"): string {
  const normalizedCurrency = (currencyCode || "CZK").toUpperCase()
  const fractionDigits = ZERO_FRACTION_CURRENCIES.has(normalizedCurrency) ? 0 : 2

  try {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: normalizedCurrency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(amount)
  } catch {
    const value = Number.isFinite(amount) ? amount : 0
    return `${value.toFixed(fractionDigits)} ${normalizedCurrency}`
  }
}
