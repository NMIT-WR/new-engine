'use client'

import { useQuery } from '@tanstack/react-query'
import { sdk } from '@/lib/medusa-client'
import type { Product } from '@/types/product'
import { useCurrentRegion } from './use-region'
import { queryKeys } from '@/lib/query-keys'

// Transform Medusa product to our Product type
function transformProduct(medusaProduct: any, regionCurrencyCode?: string): Product {
  // Fix image URLs - replace internal MinIO URL with localhost
  const fixImageUrl = (url: string) => {
    return url?.replace('http://medusa-minio:9004', 'http://localhost:9004') || ''
  }

  return {
    id: medusaProduct.id,
    handle: medusaProduct.handle,
    title: medusaProduct.title,
    description: medusaProduct.description || '',
    thumbnail: fixImageUrl(medusaProduct.thumbnail),
    images: medusaProduct.images?.map((img: any) => ({
      id: img.id,
      url: fixImageUrl(img.url),
      alt: medusaProduct.title,
    })) || [],
    collection: medusaProduct.collection ? {
      id: medusaProduct.collection.id,
      title: medusaProduct.collection.title,
      handle: medusaProduct.collection.handle,
    } : undefined,
    categories: medusaProduct.categories?.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      handle: cat.handle,
    })) || [],
    tags: medusaProduct.tags?.map((tag: any) => ({
      id: tag.id,
      value: tag.value,
    })) || [],
    options: medusaProduct.options?.map((opt: any) => ({
      id: opt.id,
      title: opt.title,
      values: opt.values?.map((val: any) => val.value) || [],
    })) || [],
    variants: medusaProduct.variants?.map((variant: any) => {
      const calculatedPrice = variant.calculated_price
      const prices = []
      
      // Debug: log products without calculated_price for USD
      if (!calculatedPrice && regionCurrencyCode === 'usd') {
        console.log('No USD calculated_price for:', medusaProduct.title, '- checking variant.prices:', variant.prices)
      }
      
      if (calculatedPrice) {
        // Try different paths to get the amount
        const amount = calculatedPrice.calculated_amount || 
                      calculatedPrice.calculated_price?.calculated_amount || 
                      calculatedPrice.calculated_price || 
                      calculatedPrice.amount ||
                      0
        
        const currency = calculatedPrice.currency_code || 
                        calculatedPrice.calculated_price?.currency_code || 
                        regionCurrencyCode ||
                        'eur'
        
        // Format price string based on currency
        // Check if amount is already in major units (euros/dollars) or minor units (cents)
        // If amount is less than 100, it's likely already in major units
        const formattedPrice = currency.toLowerCase() === 'eur' 
          ? `€${amount.toFixed(2)}`
          : currency.toLowerCase() === 'usd'
          ? `$${amount.toFixed(2)}`
          : `${currency.toUpperCase()} ${amount.toFixed(2)}`
        
        prices.push({
          id: variant.id,
          amount: amount,
          currency_code: currency.toUpperCase(),
          calculated_price: formattedPrice,
        })
      } else if (regionCurrencyCode === 'usd') {
        // Fallback: Convert EUR price to USD with approximate rate
        // This is temporary until all products have USD prices in database
        const eurToUsdRate = 1.1 // Approximate conversion rate
        
        // Try to find EUR price for this variant
        const eurPrice = variant.prices?.find((p: any) => p.currency_code === 'eur')
        if (eurPrice && eurPrice.amount) {
          const usdAmount = Math.round(eurPrice.amount * eurToUsdRate)
          prices.push({
            id: variant.id,
            amount: usdAmount,
            currency_code: 'USD',
            calculated_price: `$${usdAmount.toFixed(2)}`,
          })
        } else {
          // If no EUR price either, show not available
          prices.push({
            id: variant.id,
            amount: 0,
            currency_code: 'USD',
            calculated_price: 'Price not available',
          })
        }
      }
      
      return {
        id: variant.id,
        title: variant.title,
        sku: variant.sku || '',
        inventory_quantity: variant.inventory_quantity || 0,
        prices: prices,
        options: variant.options?.reduce((acc: any, opt: any) => {
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

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: queryKeys.products(region?.id, filters),
    queryFn: async () => {
      const response = await sdk.store.product.list({
        limit: 100,
        fields: '*variants.calculated_price,*variants.prices,*variants.options.option,*images,*categories,*collection,*tags',
        region_id: region!.id,
        ...filters,
      })
      
      return response.products.map(product => transformProduct(product, region?.currency_code))
    },
    enabled: !!region, // Only run query when region is available
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return { 
    products, 
    isLoading, 
    error: error instanceof Error ? error.message : error ? String(error) : null 
  }
}

export function useProduct(handle: string) {
  const { region } = useCurrentRegion()

  const { data: product = null, isLoading, error } = useQuery({
    queryKey: queryKeys.product(handle, region?.id),
    queryFn: async () => {
      // First get product by handle
      const listResponse = await sdk.store.product.list({
        handle,
        limit: 1,
        fields: '*variants.calculated_price,*variants.prices,*variants.options.option,*images,*categories,*collection,*tags',
        region_id: region!.id,
      })
      
      if (listResponse.products.length === 0) {
        throw new Error('Product not found')
      }
      
      const medusaProduct = listResponse.products[0]
      return transformProduct(medusaProduct, region?.currency_code)
    },
    enabled: !!handle && !!region, // Only run query when handle and region are available
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return { 
    product, 
    isLoading, 
    error: error instanceof Error ? error.message : error ? String(error) : null 
  }
}