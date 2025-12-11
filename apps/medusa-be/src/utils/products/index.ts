import type * as Steps from "../../workflows/seed/steps"

/** Raw product data from the database (JSON strings) */
type RawProductFromDb = {
  title: string
  handle: string
  description?: string
  thumbnail?: string
  images: string // JSON string
  variants: string // JSON string
  options: string // JSON string
  categories: string // JSON string
  producer: string // JSON string
}

/** Raw option data after JSON parsing */
type RawOption = {
  title?: string
  option_values?: string[]
}

/** Raw variant data after JSON parsing */
type RawVariant = {
  title?: string
  sku?: string | null
  ean?: string
  material?: string
  collection?: string
  options?: Record<string, string | null>
  prices?: { amount: number; currency_code: string }[]
  images?: { url?: string }[]
  thumbnail?: string
  metadata?: {
    attributes?: { name: string; value?: string }[]
    user_code?: string
  }
  quantities?: {
    quantity?: number
    supplier_quantity?: number
  }
}

/** Raw producer data after JSON parsing */
type RawProducer = {
  title?: string
  attributes?: { name: string; value: string }[]
}

export function toCreateProductsStepInput(
  products: RawProductFromDb[]
): Steps.CreateProductsStepInput {
  return products.map((raw) => {
    const parsedImages = JSON.parse(raw.images) as { url: string }[]
    const parsedVariants = JSON.parse(raw.variants) as RawVariant[]
    const parsedOptions = JSON.parse(raw.options) as RawOption[]
    const parsedCategories = JSON.parse(raw.categories) as { handle: string }[]
    const parsedProducer = JSON.parse(raw.producer) as RawProducer | null

    const options = parsedOptions.map((o) => ({
      title: o.title ?? "Variant",
      values: o.option_values ?? ["Default"],
    }))

    const variants = parsedVariants
      .filter((v): v is RawVariant & { sku: string } => v.sku != null)
      .map((v) => ({
        title: v.title ?? v.sku,
        sku: v.sku,
        ean: v.ean,
        material: v.material,
        options: v.options
          ? Object.fromEntries(
              Object.entries(v.options).map(([key, value]) => [
                key,
                value ?? "Default",
              ])
            )
          : undefined,
        prices: v.prices,
        images: (v.images ?? []).filter(
          (im): im is { url: string } => im.url != null
        ),
        thumbnail: v.thumbnail,
        metadata: v.metadata,
        quantities: v.quantities,
      }))

    return {
      title: raw.title,
      categories: parsedCategories,
      description: raw.description ?? "",
      handle: raw.handle,
      weight: 1,
      shippingProfileName: "Default Shipping Profile",
      thumbnail: raw.thumbnail,
      images: parsedImages,
      options: options.length === 0 ? undefined : options,
      producer: parsedProducer,
      variants: variants.length === 0 ? undefined : variants,
      salesChannelNames: ["Default Sales Channel"],
    }
  })
}
