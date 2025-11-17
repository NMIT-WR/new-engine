import type { StoreProduct } from '@medusajs/types'

export const formatPrice = ({
  variants,
  tax = true,
}: {
  variants?: StoreProduct['variants']
  tax?: boolean
}): string => {
  const variant = variants?.[0]
  const price = tax
    ? variant?.calculated_price?.calculated_amount_with_tax
    : variant?.calculated_price?.calculated_amount_without_tax
  const currency = variant?.calculated_price?.currency_code
  const currencyMap = currency === 'czk' ? 'Kč' : currency
  return price ? `${price.toFixed(0)} ${currencyMap}` : '0 Kč'
}

/* when we need to format price for basic item regardless of the variants */
export const formatAmount = (amount?: number | null) => {
  if (!amount) return '0 Kč'
  return `${Math.round(amount)} Kč`
}

export const formatVariants = (
  variants?: StoreProduct['variants']
): string[] => {
  if (!variants || variants.length < 2) return []
  return variants.map((v) => v.title).filter((v): v is string => v !== null)
}
