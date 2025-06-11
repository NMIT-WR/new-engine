'use client'

import { useEffect, useState } from 'react'
import { sdk } from '@/lib/medusa-client'
import type { Product } from '@/types/product'
import { useCurrentRegion } from './use-region'

// Transform Medusa product to our Product type
function transformProduct(medusaProduct: any): Product {
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
    variants: medusaProduct.variants?.map((variant: any) => ({
      id: variant.id,
      title: variant.title,
      sku: variant.sku || '',
      inventory_quantity: variant.inventory_quantity || 0,
      prices: variant.calculated_price ? [{
        id: variant.id,
        amount: variant.calculated_price.calculated_amount || 0,
        currency_code: variant.calculated_price.currency_code || 'usd',
      }] : [],
      options: variant.options?.reduce((acc: any, opt: any) => {
        acc[opt.option.title.toLowerCase()] = opt.value
        return acc
      }, {}) || {},
    })) || [],
    status: medusaProduct.status || 'published',
    metadata: medusaProduct.metadata || {},
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { region } = useCurrentRegion()

  useEffect(() => {
    async function fetchProducts() {
      if (!region) return // Wait for region to be loaded
      
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await sdk.store.product.list({
          limit: 100,
          fields: '*variants.options.option,*images,*categories,*collection,*tags',
          region_id: region.id,
        })
        
        const transformedProducts = response.products.map(transformProduct)
        setProducts(transformedProducts)
      } catch (err) {
        console.error('Failed to fetch products:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [region])

  return { products, isLoading, error }
}

export function useProduct(handle: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { region } = useCurrentRegion()

  useEffect(() => {
    async function fetchProduct() {
      if (!handle || !region) return // Wait for region to be loaded
      
      try {
        setIsLoading(true)
        setError(null)
        
        // First get product by handle
        const listResponse = await sdk.store.product.list({
          handle,
          limit: 1,
          fields: '*variants.options.option,*images,*categories,*collection,*tags',
          region_id: region.id,
        })
        
        if (listResponse.products.length === 0) {
          throw new Error('Product not found')
        }
        
        const medusaProduct = listResponse.products[0]
        const transformedProduct = transformProduct(medusaProduct)
        setProduct(transformedProduct)
      } catch (err) {
        console.error('Failed to fetch product:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch product')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [handle, region])

  return { product, isLoading, error }
}