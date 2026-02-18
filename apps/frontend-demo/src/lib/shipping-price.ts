import type { HttpTypes } from "@medusajs/types"

type CalculatedPriceLike = {
  calculated_amount?: number
  calculated_amount_with_tax?: number
  calculated_tax?: number
}

const DEFAULT_TAX_RATE = 0.21

export const getShippingPriceWithTax = (
  price?: HttpTypes.StoreCalculatedPrice,
  fallbackTaxRate = DEFAULT_TAX_RATE
): number => {
  if (!price) {
    return 0
  }

  const calculated = price as CalculatedPriceLike

  if (typeof calculated.calculated_amount_with_tax === "number") {
    return calculated.calculated_amount_with_tax
  }

  if (
    typeof calculated.calculated_amount === "number" &&
    typeof calculated.calculated_tax === "number"
  ) {
    return calculated.calculated_amount + calculated.calculated_tax
  }

  if (typeof calculated.calculated_amount === "number") {
    return calculated.calculated_amount * (1 + fallbackTaxRate)
  }

  return 0
}
