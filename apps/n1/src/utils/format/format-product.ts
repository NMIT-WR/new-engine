import type { StoreProduct } from '@medusajs/types'

const DEFAULT_TAX_RATE = 0.21

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

export const formatToTaxIncluded = ({
  amount,
  tax,
  currency,
}: {
  amount?: number
  tax?: number
  currency?: string
}) => {
  if (!amount) return '0 Kč'
  const taxRate = tax || DEFAULT_TAX_RATE
  const taxAmount = amount * taxRate
  const totalAmount = amount + taxAmount
  const currencyMap = currency ? (currency === 'czk' ? 'Kč' : currency) : 'Kč'
  return `${Math.round(totalAmount)} ${currencyMap}`
}

export const formatVariants = (
  variants?: StoreProduct['variants']
): string[] => {
  if (!variants || variants.length < 2) return []
  return variants.map((v) => v.title).filter((v): v is string => v !== null)
}
