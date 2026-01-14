import type {
  ExecArgs,
  ICachingModuleService,
  Logger,
} from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import seedNorthernWorkflow, {
  type SeedNorthernWorkflowInput,
} from "../workflows/seed/workflows/seed-northern"
import * as fs from "node:fs/promises"
import * as path from "node:path"
import * as XLSX from "xlsx"

/** Path to Excel file relative to medusa-be directory */
const EXCEL_FILE_PATH = "../../local/Masterdata-Northern_SS2025.xlsx"

/** Set to true to bypass cache and fetch fresh data from Excel (dev only) */
const FORCE_FRESH_DATA = false

const CACHE_KEYS = {
  EXCEL_DATA: "seed-northern:excel-data",
} as const

const CACHE_TAGS = {
  ALL: "seed-northern",
} as const

const CACHE_TTL = {
  /** 24 hours in seconds */
  DATA: 86_400,
} as const

/** Excel row structure from Northern masterdata */
type NorthernProduct = {
  "No.": string
  Description: string
  "Item Status": string
  GTIN?: string
  "Item Category Code": string
  "Country/Region of Origin Code"?: string
  "Tariff No."?: string
  "Lamp socket"?: string
  Dimmable?: string
  "Energy class"?: string
  "IP code"?: string
  Watt?: string
  "Recommended bulb type"?: string
  "Wire length"?: string
  "Bulb included"?: string
  "Ceiling cap included"?: string
  "General standards & certificates"?: string
  "Releaseyear per Product Family"?: string
  Classification?: string
  Electrical?: string
  "Wall plug type"?: string
  "Dimmer type"?: string
  "Number of batteries installed"?: string
  "Battery weight"?: string
  "Battery type"?: string
  "Battery capacity"?: string
  "Battery power"?: string
  "Battery charging time"?: string
  "Battery life"?: string
  Wood?: string
  "Scientific name of wood"?: string
  "Wood harvest origin"?: string
  "Color/ finish"?: string
  Material?: string
  "Freight group"?: string
  Warranty?: string
  "Assembly required"?: string
  Lumen?: string
  Kelvin?: string
  "EPREL-id"?: string
  "Designer Name"?: string
  "INNER BOX - Length"?: number
  "INNER BOX - Width"?: number
  "INNER BOX - Height"?: number
  "INNER BOX - Weight"?: number
  "OUTER BOX - Length"?: number
  "OUTER BOX - Width"?: number
  "OUTER BOX - Height"?: number
  "OUTER BOX - Weight"?: number
  "Items in OUTER BOX"?: number
  "Price NOK ex. VAT"?: number
  "Price NOK incl. VAT"?: number
  "Price DKK ex. VAT"?: number
  "Price DKK incl. VAT"?: number
  "Price SEK ex. VAT"?: number
  "Price SEK incl. VAT"?: number
  "Price EUR ex. VAT"?: number
  "Price EUR incl. VAT"?: number
  "Price GBP ex. VAT"?: number
  "Price GBP incl. VAT"?: number
  "Price CHF ex. VAT"?: number
  "Price CHF incl. VAT"?: number
  "Price CZK ex. VAT"?: number
  "Price CZK incl. VAT"?: number
  "Last date modified price"?: number
  "Last date masterdata modified"?: number
}

type ProductInput = {
  title: string
  description: string
  handle: string
  status: "published" | "draft"
  thumbnail?: string
  images?: { url: string }[]
  category_ids?: string[]
  options?: { title: string; values: string[] }[]
  variants?: {
    title: string
    sku: string
    ean?: string
    options?: Record<string, string>
    prices?: { amount: number; currency_code: string }[]
    metadata?: any
    weight?: number
    length?: number
    width?: number
    height?: number
    quantities?: { quantity: number }
  }[]
  sales_channels?: { id: string }[]
  metadata?: any
}

/**
 * Read Northern Excel file and parse product sheets
 */
async function readNorthernExcel(
  filePath: string,
  logger: Logger
): Promise<NorthernProduct[]> {
  logger.info(`Reading Excel file: ${filePath}`)

  const absolutePath = path.resolve(process.cwd(), filePath)
  const fileBuffer = await fs.readFile(absolutePath)
  const workbook = XLSX.read(fileBuffer, { type: "buffer" })

  const productSheets = ["Furniture", "Lighting", "Accessories", "Spare parts"]
  const allProducts: NorthernProduct[] = []

  for (const sheetName of productSheets) {
    if (!workbook.SheetNames.includes(sheetName)) {
      logger.warn(`Sheet "${sheetName}" not found in Excel file`)
      continue
    }

    const sheet = workbook.Sheets[sheetName]
    if (!sheet) {
      logger.warn(`Sheet "${sheetName}" exists but is empty`)
      continue
    }

    const data = XLSX.utils.sheet_to_json(sheet, {
      defval: undefined,
    }) as NorthernProduct[]

    logger.info(`Parsed ${data.length} products from sheet "${sheetName}"`)
    allProducts.push(...data)
  }

  return allProducts
}

/**
 * Transform Northern product to Medusa product structure
 */
function transformProduct(
  product: NorthernProduct,
  logger: Logger
): ProductInput | null {
  // Skip products without basic info
  if (!product["No."] || !product.Description) {
    logger.warn(
      `Skipping product without No./Description: ${JSON.stringify(product)}`
    )
    return null
  }

  // Skip discontinued products
  if (product["Item Status"] === "To be discontinued") {
    logger.debug(`Skipping discontinued product: ${product["No."]}`)
    return null
  }

  const title = product.Description
  const handle = slugify(title)
  const sku = String(product["No."])
  const category = product["Item Category Code"]

  // Build description from available metadata
  const descriptionParts: string[] = []
  if (product.Material) descriptionParts.push(`Material: ${product.Material}`)
  if (product["Color/ finish"])
    descriptionParts.push(`Color: ${product["Color/ finish"]}`)
  if (product["Designer Name"])
    descriptionParts.push(`Designer: ${product["Designer Name"]}`)
  if (product.Wood) descriptionParts.push(`Wood: ${product.Wood}`)

  // Add lighting-specific info
  if (category === "LIGHTING") {
    if (product.Lumen) descriptionParts.push(`Lumen: ${product.Lumen}`)
    if (product.Kelvin) descriptionParts.push(`Kelvin: ${product.Kelvin}`)
    if (product.Watt) descriptionParts.push(`Watt: ${product.Watt}`)
    if (product.Dimmable)
      descriptionParts.push(`Dimmable: ${product.Dimmable}`)
  }

  const description = descriptionParts.join(" | ")

  // Collect prices for all available currencies (ex. VAT)
  const prices: { amount: number; currency_code: string }[] = []

  const priceMapping = [
    { field: "Price NOK ex. VAT", currency: "nok" },
    { field: "Price DKK ex. VAT", currency: "dkk" },
    { field: "Price SEK ex. VAT", currency: "sek" },
    { field: "Price EUR ex. VAT", currency: "eur" },
    { field: "Price GBP ex. VAT", currency: "gbp" },
    { field: "Price CHF ex. VAT", currency: "chf" },
    { field: "Price CZK ex. VAT", currency: "czk" },
  ]

  for (const { field, currency } of priceMapping) {
    const price = product[field as keyof NorthernProduct]
    if (typeof price === "number" && price > 0) {
      prices.push({
        amount: Math.round(price * 100), // convert to cents
        currency_code: currency,
      })
    }
  }

  if (prices.length === 0) {
    logger.warn(`Product ${sku} has no valid prices, skipping`)
    return null
  }

  // Dimensions and weight
  const length = product["INNER BOX - Length"]
  const width = product["INNER BOX - Width"]
  const height = product["INNER BOX - Height"]
  const weight = product["INNER BOX - Weight"]

  const gtin = product.GTIN ? String(product.GTIN).trim() : ""

  return {
    title,
    handle,
    description,
    status: "published",
    options: [
      {
        title: "Default",
        values: ["Default"],
      },
    ],
    variants: [
      {
        title: "Default",
        sku,
        ean: gtin !== "" ? gtin : undefined,
        options: {
          Default: "Default",
        },
        prices,
        weight: weight ? weight * 1000 : undefined, // convert kg to g
        length: length ? length * 1000 : undefined, // convert m to mm
        width: width ? width * 1000 : undefined,
        height: height ? height * 1000 : undefined,
        quantities: { quantity: 0 }, // Default inventory quantity
        metadata: {
          northern_product_no: product["No."],
          material: product.Material,
          color: product["Color/ finish"],
          designer: product["Designer Name"],
          category: category,
          // Lighting specific
          ...(category === "LIGHTING" && {
            lamp_socket: product["Lamp socket"],
            dimmable: product.Dimmable,
            energy_class: product["Energy class"],
            lumen: product.Lumen,
            kelvin: product.Kelvin,
            watt: product.Watt,
          }),
          // Dimensions
          outer_box_length: product["OUTER BOX - Length"],
          outer_box_width: product["OUTER BOX - Width"],
          outer_box_height: product["OUTER BOX - Height"],
          outer_box_weight: product["OUTER BOX - Weight"],
          items_in_outer_box: product["Items in OUTER BOX"],
        },
      },
    ],
    metadata: {
      northern_product_no: product["No."],
      item_status: product["Item Status"],
      category: category,
      country_of_origin: product["Country/Region of Origin Code"],
      tariff_no: product["Tariff No."],
      warranty: product.Warranty,
      assembly_required: product["Assembly required"],
      release_year: product["Releaseyear per Product Family"],
      freight_group: product["Freight group"],
    },
  }
}

/**
 * Convert string to slug (URL-friendly format)
 */
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // decompose unicode characters
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, "") // trim leading/trailing hyphens
}

export default async function seedNorthern({ container }: ExecArgs) {
  const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)

  logger.info("Starting Northern seed with full store setup...")

  const countries = [
    "cz",
    "dk",
    "se",
    "no",
    "gb",
    "de",
    "fr",
    "es",
    "it",
    "pl",
    "at",
    "sk",
    "ch",
  ]

  const input: Omit<SeedNorthernWorkflowInput, "categories" | "products"> = {
    salesChannels: [
      {
        name: "Default Sales Channel",
        default: true,
      },
    ],
    currencies: [
      {
        code: "czk",
        default: true,
      },
      {
        code: "eur",
        default: false,
      },
      {
        code: "dkk",
        default: false,
      },
      {
        code: "sek",
        default: false,
      },
      {
        code: "nok",
        default: false,
      },
      {
        code: "gbp",
        default: false,
      },
      {
        code: "chf",
        default: false,
      },
    ],
    regions: [
      {
        name: "Czech Republic",
        currencyCode: "czk",
        countries: ["cz"],
        paymentProviders: undefined,
      },
      {
        name: "Europe (EUR)",
        currencyCode: "eur",
        countries: ["de", "fr", "es", "it", "at", "sk"],
        paymentProviders: undefined,
      },
      {
        name: "Scandinavia (DKK)",
        currencyCode: "dkk",
        countries: ["dk"],
        paymentProviders: undefined,
      },
      {
        name: "Scandinavia (SEK)",
        currencyCode: "sek",
        countries: ["se"],
        paymentProviders: undefined,
      },
      {
        name: "Scandinavia (NOK)",
        currencyCode: "nok",
        countries: ["no"],
        paymentProviders: undefined,
      },
      {
        name: "United Kingdom",
        currencyCode: "gbp",
        countries: ["gb"],
        paymentProviders: undefined,
      },
      {
        name: "Switzerland",
        currencyCode: "chf",
        countries: ["ch"],
        paymentProviders: undefined,
      },
    ],
    taxRegions: {
      countries,
      taxProviderId: undefined,
    },
    stockLocations: {
      locations: [
        {
          name: "Northern Warehouse",
          address: {
            city: "Copenhagen",
            country_code: "DK",
            address_1: "",
          },
        },
      ],
    },
    defaultShippingProfile: {
      name: "Default Shipping Profile",
    },
    fulfillmentSets: {
      name: "Northern delivery",
      type: "shipping",
      serviceZones: [
        {
          name: "Europe",
          geoZones: countries.map((c) => ({
            countryCode: c,
          })),
        },
      ],
    },
    shippingOptions: [
      {
        name: "Standard Shipping",
        providerId: "manual_manual",
        type: {
          label: "Standard",
          description: "Ship in 2-3 days.",
          code: "standard",
        },
        prices: [
          {
            currencyCode: "czk",
            amount: 250,
          },
          {
            currencyCode: "eur",
            amount: 10,
          },
          {
            currencyCode: "dkk",
            amount: 75,
          },
          {
            currencyCode: "sek",
            amount: 100,
          },
          {
            currencyCode: "nok",
            amount: 100,
          },
          {
            currencyCode: "gbp",
            amount: 10,
          },
          {
            currencyCode: "chf",
            amount: 12,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
    publishableKey: {
      title: "Northern Store",
    },
  }

  const cacheService = container.resolve<ICachingModuleService>(Modules.CACHING)

  // Helper to get cached data or fetch fresh
  async function getCachedOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    label: string
  ): Promise<T> {
    // Check cache first (unless forcing fresh data)
    if (FORCE_FRESH_DATA) {
      logger.info(`FORCE_FRESH_DATA enabled, skipping cache for ${label}`)
    } else {
      const cached = (await cacheService.get({ key })) as T | null
      if (cached !== null) {
        logger.info(`Using cached ${label}`)
        return cached
      }
    }

    // Fetch fresh data
    logger.info(`Fetching ${label}...`)
    const data = await fetcher()

    // Store in cache
    await cacheService.set({
      key,
      data: data as object,
      ttl: CACHE_TTL.DATA,
      tags: [CACHE_TAGS.ALL],
    })
    logger.info(`Cached ${label} for 24 hours`)

    return data
  }

  // Read Excel data
  const excelProducts = await getCachedOrFetch<NorthernProduct[]>(
    CACHE_KEYS.EXCEL_DATA,
    () => readNorthernExcel(EXCEL_FILE_PATH, logger),
    "Excel data"
  )

  logger.info(`Read ${excelProducts.length} products from Excel`)

  // Transform products
  const products: ProductInput[] = []
  for (const excelProduct of excelProducts) {
    const transformed = transformProduct(excelProduct, logger)
    if (transformed) {
      products.push(transformed)
    }
  }

  logger.info(`Transformed ${products.length} valid products`)

  // Extract unique categories from products
  const uniqueCategories = new Map<
    string,
    { title: string; handle: string; isActive: boolean }
  >()
  for (const product of products) {
    const category = product.metadata?.category
    if (category && typeof category === "string" && category.trim() !== "") {
      const handle = slugify(category)
      if (!uniqueCategories.has(handle)) {
        uniqueCategories.set(handle, {
          title: category.trim(), // seed-categories expects "title", not "name"
          handle,
          isActive: true,
        })
      }
    }
  }

  const categories = Array.from(uniqueCategories.values())
  logger.info(`Extracted ${categories.length} unique categories`)
  logger.info(
    `Categories: ${categories.map((c) => c.title).join(", ")}`
  )

  // Map category names to category_ids for products
  const categoryNameToHandle = new Map<string, string>()
  for (const category of categories) {
    categoryNameToHandle.set(category.title, category.handle)
  }

  // Transform products to workflow format
  const transformedProducts = products.map((product) => {
    const categoryName = product.metadata?.category
    const categoryHandle = categoryName
      ? categoryNameToHandle.get(categoryName)
      : undefined

    return {
      ...product,
      categories: categoryHandle ? [{ handle: categoryHandle }] : [],
      salesChannelNames: ["Default Sales Channel"],
      shippingProfileName: "Default Shipping Profile",
      images: product.images || [],
    }
  })

  logger.info("Running seed workflow...")
  const { result } = await seedNorthernWorkflow(container).run({
    input: { ...input, categories, products: transformedProducts },
  })

  logger.info("Northern seed completed successfully")
  logger.info(`Result: ${JSON.stringify(result, null, 2)}`)
}
