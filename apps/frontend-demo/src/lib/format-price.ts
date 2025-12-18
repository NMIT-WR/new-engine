export function formatPrice(amount: number, currencyCode = "CZK"): string {
  // Convert from cents to currency units
  const price = amount

  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
