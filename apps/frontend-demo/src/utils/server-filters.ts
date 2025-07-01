/**
 * Server-side filtering utilities for Medusa v2 API
 * These functions build query parameters for server-side filtering
 */

import type { ProductFilters } from '@/services/product-service'

export interface MedusaProductQuery {
  limit?: number
  offset?: number
  fields?: string
  category_id?: string | string[]
  tags?: string | string[]
  q?: string
  region_id?: string
  cart_id?: string
  currency_code?: string
  // Variant filtering requires special handling
  [key: string]: any
}

export interface VariantOptionFilter {
  option_id?: string
  value?: string
  option?: Record<string, any>
}

/**
 * Build Medusa query parameters from our filter interface
 */
export function buildMedusaQuery(
  filters: ProductFilters | undefined,
  baseQuery: Partial<MedusaProductQuery> = {}
): MedusaProductQuery {
  const query: MedusaProductQuery = { ...baseQuery }
  
  if (!filters) return query
  
  // Category filtering - Medusa supports this natively
  if (filters.categories?.length) {
    query.category_id = filters.categories.length === 1 
      ? filters.categories[0] 
      : filters.categories
  }
  
  // Search query
  if (filters.search) {
    query.q = filters.search
  }
  
  // Size filtering via variant options - Medusa v2 supports this!
  if (filters.sizes?.length) {
    // For single size
    if (filters.sizes.length === 1) {
      query.variants = {
        options: {
          value: filters.sizes[0]
        }
      }
    } else {
      // For multiple sizes, we need to use $in operator
      query.variants = {
        options: {
          value: {
            $in: filters.sizes
          }
        }
      }
    }
  }
  
  // Color filtering - if needed in the future
  // Note: Your products don't seem to use color options currently
  
  // Price range filtering
  // Note: Medusa v2 doesn't support direct price range filtering in product queries
  // This would need to be implemented via a custom endpoint or post-processing
  
  return query
}

/**
 * Build variant option filters for advanced queries
 * Note: This is experimental based on Medusa v2 documentation
 */
export function buildVariantOptionFilter(
  optionType: 'size',
  values: string[]
): Record<string, any> {
  if (!values.length) return {}
  
  // For single value
  if (values.length === 1) {
    return {
      variants: {
        options: {
          value: values[0]
        }
      }
    }
  }
  
  // For multiple values, we might need to use $in operator
  return {
    variants: {
      options: {
        value: {
          $in: values
        }
      }
    }
  }
}
