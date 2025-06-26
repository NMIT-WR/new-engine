'use client'

import { cacheConfig } from '@/lib/cache-config'
import { sdk } from '@/lib/medusa-client'
import { queryKeys } from '@/lib/query-keys'
import type { Product } from '@/types/product'
import { useQuery } from '@tanstack/react-query'
import { useCurrentRegion } from './use-region'

// Helper to assign categories based on product handle/title
function assignFallbackCategories(product: any): any[] {
  const handle = product.handle?.toLowerCase() || ''

  // T-Shirts & Tops
  if (
    handle.includes('shirt') ||
    handle.includes('blouse') ||
    handle === 't-shirt'
  ) {
    return [
      {
        id: 'pcat_01JXFY9AGFK0M2N1QA55QD96DV',
        name: 'T-Shirts & Tops',
        handle: 't-shirts-tops',
      },
    ]
  }
  // Jeans & Pants
  if (
    handle.includes('jean') ||
    handle.includes('pant') ||
    handle.includes('trouser') ||
    handle.includes('short') ||
    handle.includes('chino')
  ) {
    return [
      {
        id: 'pcat_01JXFY9AGGN563ND3H8GXWX24F',
        name: 'Jeans & Pants',
        handle: 'jeans-pants',
      },
    ]
  }
  // Shoes & Sneakers
  if (
    handle.includes('shoe') ||
    handle.includes('sneaker') ||
    handle.includes('boot') ||
    handle.includes('loafer')
  ) {
    return [
      {
        id: 'pcat_01JXFY9AGH9TXQNA7BSP2EMXHC',
        name: 'Shoes & Sneakers',
        handle: 'shoes-sneakers',
      },
    ]
  }
  // Jackets & Coats
  if (
    handle.includes('jacket') ||
    handle.includes('coat') ||
    handle.includes('bomber')
  ) {
    return [
      {
        id: 'pcat_01JXFY9AGHVHR7KY7KGZKWSQ46',
        name: 'Jackets & Coats',
        handle: 'jackets-coats',
      },
    ]
  }
  // Dresses
  if (handle.includes('dress')) {
    return [
      {
        id: 'pcat_01JXFY9AGJP8PS4WKV8YN2ZQMF',
        name: 'Dresses',
        handle: 'dresses',
      },
    ]
  }
  // Accessories
  if (
    handle.includes('scarf') ||
    handle.includes('bag') ||
    handle.includes('backpack') ||
    handle.includes('cap') ||
    handle.includes('hat')
  ) {
    return [
      {
        id: 'pcat_01JXFY9AGKGY7G1934QKFS8QFD',
        name: 'Accessories',
        handle: 'accessories',
      },
    ]
  }
  // Knitwear
  if (
    handle.includes('sweater') ||
    handle.includes('cardigan') ||
    handle === 'sweatshirt'
  ) {
    return [
      {
        id: 'pcat_01JXFY9AGM1ZTXXTJ9P3NYZ0KJ',
        name: 'Knitwear',
        handle: 'knitwear',
      },
    ]
  }
  // Activewear
  if (
    handle.includes('legging') ||
    handle.includes('athletic') ||
    handle.includes('track')
  ) {
    return [
      {
        id: 'pcat_01JXFY9AGN5RYGVAAJPR9HA22R',
        name: 'Activewear',
        handle: 'activewear',
      },
    ]
  }
  // Skirts
  if (handle.includes('skirt')) {
    return [
      {
        id: 'pcat_01JXFY9AGNAPZ04TS3TME6DJ00',
        name: 'Skirts',
        handle: 'skirts',
      },
    ]
  }

  return []
}

function transformProduct(
  medusaProduct: any,
  regionCurrencyCode?: string
): Product {
  // Fix image URLs - replace internal MinIO URL with localhost
  const fixImageUrl = (url: string) => {
    return (
      url?.replace('http://medusa-minio:9004', 'http://localhost:9004') || ''
    )
  }

  return {
    id: medusaProduct.id,
    handle: medusaProduct.handle,
    title: medusaProduct.title,
    description: medusaProduct.description || '',
    thumbnail: fixImageUrl(medusaProduct.thumbnail),
    images:
      medusaProduct.images?.map((img: any) => ({
        id: img.id,
        url: fixImageUrl(img.url),
        alt: medusaProduct.title,
      })) || [],
    collection: medusaProduct.collection
      ? {
          id: medusaProduct.collection.id,
          title: medusaProduct.collection.title,
          handle: medusaProduct.collection.handle,
        }
      : undefined,
    // Use categories from API or assign fallback categories
    categories:
      medusaProduct.categories && medusaProduct.categories.length > 0
        ? medusaProduct.categories.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            handle: cat.handle,
          }))
        : assignFallbackCategories(medusaProduct),
    tags:
      medusaProduct.tags?.map((tag: any) => ({
        id: tag.id,
        value: tag.value,
      })) || [],
    options:
      medusaProduct.options?.map((opt: any) => ({
        id: opt.id,
        title: opt.title,
        values: opt.values?.map((val: any) => val.value) || [],
      })) || [],
    variants:
      medusaProduct.variants?.map((variant: any) => {
        const calculatedPrice = variant.calculated_price
        const prices = []

        // Debug: log products without calculated_price for USD
        if (!calculatedPrice && regionCurrencyCode === 'usd') {
          console.log(
            'No USD calculated_price for:',
            medusaProduct.title,
            '- checking variant.prices:',
            variant.prices
          )
        }

        if (calculatedPrice) {
          // Try different paths to get the amount
          const amount =
            calculatedPrice.calculated_amount ||
            calculatedPrice.calculated_price?.calculated_amount ||
            calculatedPrice.calculated_price ||
            calculatedPrice.amount ||
            0

          const currency =
            calculatedPrice.currency_code ||
            calculatedPrice.calculated_price?.currency_code ||
            regionCurrencyCode ||
            'czk'

          prices.push({
            id: variant.id,
            amount: amount,
            currency_code: currency.toLowerCase(),
            calculated_price: amount,
          })
        } else {
          // No calculated price, use raw prices from variant
          if (variant.prices && variant.prices.length > 0) {
            variant.prices.forEach((price: any) => {
              prices.push({
                id: price.id,
                amount: price.amount,
                currency_code: price.currency_code.toLowerCase(),
                calculated_price: price.amount,
              })
            })
          } else {
            // No prices at all, add placeholder
            prices.push({
              id: variant.id,
              amount: 0,
              currency_code: regionCurrencyCode?.toLowerCase() || 'czk',
              calculated_price: 0,
            })
          }
        }

        return {
          id: variant.id,
          title: variant.title,
          sku: variant.sku || '',
          inventory_quantity: variant.inventory_quantity || 0,
          prices: prices,
          options:
            variant.options?.reduce((acc: any, opt: any) => {
              acc[opt.option.title.toLowerCase()] = opt.value
              return acc
            }, {}) || {},
        }
      }) || [],
    status: medusaProduct.status || 'published',
    metadata: medusaProduct.metadata || {},
  }
}

export function useProducts(filters?: any) {
  const { region } = useCurrentRegion()

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.products(region?.id, filters),
    queryFn: async () => {
      // LIMIT NA 100 PRODUKTŮ PRO DEMO
      const MAX_PRODUCTS = 100
      
      const response = await sdk.store.product.list({
        limit: MAX_PRODUCTS,
        fields:
          '*variants.calculated_price,*variants.prices,*variants.options.option,*variants.inventory_quantity,*images,*categories,*collection,*tags',
        region_id: region!.id,
        ...filters,
      })

      // Vezmi pouze prvních MAX_PRODUCTS produktů
      const limitedProducts = response.products.slice(0, MAX_PRODUCTS)
      
      return limitedProducts.map((product) =>
        transformProduct(product, region?.currency_code)
      )
    },
    enabled: !!region, // Only run query when region is available
    ...cacheConfig.semiStatic, // 1h stale, 24h gc
  })

  return {
    products,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
  }
}

export function useProduct(handle: string) {
  const { region } = useCurrentRegion()

  const {
    data: product = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.product(handle, region?.id),
    queryFn: async () => {
      // First get product by handle
      const listResponse = await sdk.store.product.list({
        handle,
        limit: 1,
        fields:
          '*variants.calculated_price,*variants.prices,*variants.options.option,*variants.inventory_quantity,*images,*categories,*collection,*tags',
        region_id: region!.id,
      })

      if (listResponse.products.length === 0) {
        throw new Error('Product not found')
      }

      const medusaProduct = listResponse.products[0]
      return transformProduct(medusaProduct, region?.currency_code)
    },
    enabled: !!handle && !!region, // Only run query when handle and region are available
    ...cacheConfig.dynamic, // 5m stale, 30m gc
  })

  return {
    product,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
  }
}
