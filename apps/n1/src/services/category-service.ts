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

const CATEGORY_FIELDS = "id,name,handle,parent_category_id,description"
const PAGE_LIMIT = 100
const MAX_PAGES = 100

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

const parseProductCategory = (value: unknown): ProductCategory => {
  if (!isRecord(value)) {
    throw new Error("Invalid category in response: expected an object")
  }

  const id = value.id
  const name = value.name
  const handle = value.handle
  const parent_category_id = value.parent_category_id
  const description = value.description

  if (typeof id !== "string" || !id) {
    throw new Error("Invalid category in response: missing `id`")
  }
  if (typeof name !== "string" || !name) {
    throw new Error(`Invalid category ${id}: missing \`name\``)
  }
  if (typeof handle !== "string" || !handle) {
    throw new Error(`Invalid category ${id}: missing \`handle\``)
  }
  if (parent_category_id !== null && typeof parent_category_id !== "string") {
    throw new Error(`Invalid category ${id}: invalid \`parent_category_id\``)
  }
  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    throw new Error(`Invalid category ${id}: invalid \`description\``)
  }

  return {
    id,
    name,
    handle,
    parent_category_id,
    description: description ?? null,
  }
}

const parseCategoryPage = (
  value: unknown,
  context: { url: string }
): {
  product_categories: ProductCategory[]
  count: number | null
} => {
  if (!isRecord(value)) {
    throw new Error(`Invalid categories response from ${context.url}`)
  }

  const rawCategories = value.product_categories
  if (!Array.isArray(rawCategories)) {
    throw new Error(
      `Invalid categories response from ${context.url}: \`product_categories\` is not an array`
    )
  }

  const product_categories = rawCategories.map(parseProductCategory)

  const rawCount = value.count
  const count =
    typeof rawCount === "number" && Number.isFinite(rawCount) ? rawCount : null

  return { product_categories, count }
}

const fetchCategoryPage = async (params: {
  baseUrl: string
  publishableKey: string
  offset: number
  signal?: AbortSignal
}): Promise<{
  product_categories: ProductCategory[]
  count: number | null
}> => {
  const url = new URL("/store/product-categories", params.baseUrl)
  url.searchParams.set("limit", String(PAGE_LIMIT))
  url.searchParams.set("offset", String(params.offset))
  url.searchParams.set("fields", CATEGORY_FIELDS)

  const response = await fetch(url.toString(), {
    signal: params.signal,
    headers: {
      "x-publishable-api-key": params.publishableKey,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data: unknown = await response.json()
  return parseCategoryPage(data, { url: url.toString() })
}

const isPaginationComplete = (params: {
  lastPageCount: number
  totalReceived: number
  expectedTotal: number | null
}): boolean => {
  if (params.lastPageCount < PAGE_LIMIT) {
    return true
  }
  if (params.expectedTotal === null) {
    return false
  }

  return params.totalReceived >= params.expectedTotal
}

const fetchAllProductCategories = async (params: {
  baseUrl: string
  publishableKey: string
  signal?: AbortSignal
}): Promise<{
  categories: ProductCategory[]
  expectedTotal: number | null
}> => {
  const categories: ProductCategory[] = []
  let offset = 0
  let expectedTotal: number | null = null

  for (let page = 0; page < MAX_PAGES; page++) {
    const pageResult = await fetchCategoryPage({
      baseUrl: params.baseUrl,
      publishableKey: params.publishableKey,
      offset,
      signal: params.signal,
    })

    expectedTotal ??= pageResult.count
    categories.push(...pageResult.product_categories)
    offset += pageResult.product_categories.length

    if (
      isPaginationComplete({
        lastPageCount: pageResult.product_categories.length,
        totalReceived: categories.length,
        expectedTotal,
      })
    ) {
      return { categories, expectedTotal }
    }
  }

  throw new Error(
    `Failed to fetch all product categories: exceeded ${MAX_PAGES} pages`
  )
}

export async function getProductCategories(
  signal?: AbortSignal
): Promise<ProductCategoryListResponse> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    if (!publishableKey) {
      throw new Error(
        "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is required to fetch product categories"
      )
    }

    const { categories, expectedTotal } = await fetchAllProductCategories({
      baseUrl,
      publishableKey,
      signal,
    })

    if (expectedTotal !== null && categories.length < expectedTotal) {
      throw new Error(
        `Failed to fetch all product categories: received ${categories.length} of ${expectedTotal}`
      )
    }

    return {
      product_categories: categories,
      count: expectedTotal ?? categories.length,
      limit: PAGE_LIMIT,
      offset: 0,
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw err
    }

    const message = err instanceof Error ? err.message : "Unknown error"
    throw new Error(`Failed to fetch categories: ${message}`)
  }
}
