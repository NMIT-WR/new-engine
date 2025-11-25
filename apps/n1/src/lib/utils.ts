export function formatPrice(amount: number, currencyCode: string) {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100)
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}
