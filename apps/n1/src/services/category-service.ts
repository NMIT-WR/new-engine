export type ProductCategory = {
  id: string
  name: string
  handle: string
  parent_category_id: string | null
  description?: string | null
}

export type ProductCategoryListResponse = {
  product_categories: ProductCategory[]
  count: number
  limit: number
  offset: number
}

export async function getProductCategories(
  signal?: AbortSignal
): Promise<ProductCategoryListResponse> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

    const response = await fetch(
      `${baseUrl}/store/product-categories?limit=1000&fields=id,name,handle,parent_category_id,description`,
      {
        signal,
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": publishableKey,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      product_categories: data.product_categories || [],
      count: data.count || 0,
      limit: data.limit || 0,
      offset: data.offset || 0,
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw err
    }

    const message = err instanceof Error ? err.message : "Unknown error"
    throw new Error(`Failed to fetch categories: ${message}`)
  }
}
