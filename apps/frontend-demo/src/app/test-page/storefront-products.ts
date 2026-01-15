import type { Product } from "@/types/product"
import {
  getProduct,
  getProducts,
  type ProductFilters,
  type ProductListParams,
} from "@/services/product-service"
import { useRegions } from "@/hooks/use-region"
import {
  createProductHooks,
  type ProductDetailInputBase,
  type ProductListInputBase,
  type ProductService,
} from "@techsio/storefront-data"

export type StorefrontListInput = ProductListInputBase & {
  filters?: ProductFilters
  sort?: string
  q?: string
  category?: string | string[]
  fields?: string
}

export type StorefrontDetailParams = ProductDetailInputBase

const productService: ProductService<
  Product,
  ProductListParams,
  StorefrontDetailParams
> = {
  getProducts: (params) => getProducts(params),
  getProductByHandle: ({ handle, region_id, country_code }) =>
    getProduct(handle, region_id, country_code),
}

const buildListParams = (input: StorefrontListInput): ProductListParams => {
  const limit = input.limit ?? 20
  const page = input.page ?? 1
  const offset = (page - 1) * limit

  return {
    limit,
    offset,
    filters: input.filters,
    sort: input.sort,
    q: input.q,
    category: input.category,
    fields: input.fields,
    region_id: input.region_id,
    country_code: input.country_code,
  }
}

const buildDetailParams = (
  input: StorefrontDetailParams
): StorefrontDetailParams => input

const productsHooks = createProductHooks({
  service: productService,
  buildListParams,
  buildDetailParams,
  queryKeyNamespace: "frontend-demo",
  resolveRegion: () => {
    const { selectedRegion } = useRegions()
    return { region_id: selectedRegion?.id }
  },
})

export const {
  useProducts,
  useProduct,
  usePrefetchProducts,
  usePrefetchProduct,
  usePrefetchPages,
  useSuspenseProducts,
  useSuspenseProduct,
} = productsHooks
