import { PRODUCT_FIELDS, PRODUCT_LIMIT } from '@/lib/constants'
import { sdk } from '@/lib/medusa-client'

interface GetProductsProps {
  category_id?: string[]
  region_id?: string
  country_code?: string
}

export async function getProducts({
  category_id,
  region_id,
  country_code,
}: GetProductsProps) {
  const response = await sdk.store.product.list({
    limit: PRODUCT_LIMIT,
    fields: PRODUCT_FIELDS,
    country_code,
    region_id,
    category_id,
  })
  return {
    products: response.products || [],
    count: response.count || 0,
  }
}
