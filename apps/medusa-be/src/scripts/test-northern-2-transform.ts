import * as fs from "node:fs/promises"
import * as path from "node:path"
import * as XLSX from "xlsx"

/** Path to Excel file relative to medusa-be root (process.cwd()) */
const EXCEL_FILE_PATH =
  "./src/scripts/seed-files/Masterdata-Northern_SS2025.xlsx"

/** Excel row structure from Northern masterdata */
type NorthernProduct = {
  "No.": string
  Description: string
  "Item Status": string
  GTIN?: string
  "Item Category Code": string
  "Country/Region of Origin Code"?: string
  "Tariff No."?: string
  "Designer Name"?: string
  "Color/ finish"?: string
  Material?: string
  Wood?: string
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
  "Price DKK ex. VAT"?: number
  "Price SEK ex. VAT"?: number
  "Price EUR ex. VAT"?: number
  "Price GBP ex. VAT"?: number
  "Price CHF ex. VAT"?: number
  "Price CZK ex. VAT"?: number
  Lumen?: string
  Kelvin?: string
  Watt?: string
  Dimmable?: string
  "Lamp socket"?: string
  "Energy class"?: string
}

type ProductVariant = {
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
}

type ProductInput = {
  title: string
  description: string
  handle: string
  status: "published" | "draft"
  variants?: ProductVariant[]
  metadata?: any
}

/**
 * Read Northern Excel file and parse product sheets
 */
async function readNorthernExcel(filePath: string): Promise<NorthernProduct[]> {
  console.log(`\n📁 Reading Excel file: ${filePath}`)

  const absolutePath = path.resolve(process.cwd(), filePath)
  const fileBuffer = await fs.readFile(absolutePath)
  const workbook = XLSX.read(fileBuffer, { type: "buffer" })

  const productSheets = ["Furniture", "Lighting", "Accessories", "Spare parts"]
  const allProducts: NorthernProduct[] = []

  for (const sheetName of productSheets) {
    if (!workbook.SheetNames.includes(sheetName)) {
      console.warn(`⚠️  Sheet "${sheetName}" not found in Excel file`)
      continue
    }

    const sheet = workbook.Sheets[sheetName]
    if (!sheet) {
      console.warn(`⚠️  Sheet "${sheetName}" exists but is empty`)
      continue
    }

    const data = XLSX.utils.sheet_to_json(sheet, {
      defval: undefined,
    }) as NorthernProduct[]

    console.log(`✅ Parsed ${data.length} products from sheet "${sheetName}"`)
    allProducts.push(...data)
  }

  return allProducts
}

/**
 * Convert string to slug (URL-friendly format)
 */
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Transform Northern product to Medusa product structure
 */
function transformProduct(product: NorthernProduct): ProductInput | null {
  // Skip products without basic info
  if (!product["No."] || !product.Description) {
    return null
  }

  // Skip discontinued products
  if (product["Item Status"] === "To be discontinued") {
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
        amount: Math.round(price),
        currency_code: currency,
      })
    }
  }

  if (prices.length === 0) {
    return null
  }

  // Dimensions - convert XLSX values (m, kg) to Medusa format (mm, g)
  const innerLength = product["INNER BOX - Length"]
  const innerWidth = product["INNER BOX - Width"]
  const innerHeight = product["INNER BOX - Height"]
  const innerWeight = product["INNER BOX - Weight"]

  // Convert to mm/g for Medusa DB (INTEGER fields)
  const variantLength =
    typeof innerLength === "number" && innerLength > 0
      ? Math.round(innerLength * 1000)
      : undefined
  const variantWidth =
    typeof innerWidth === "number" && innerWidth > 0
      ? Math.round(innerWidth * 1000)
      : undefined
  const variantHeight =
    typeof innerHeight === "number" && innerHeight > 0
      ? Math.round(innerHeight * 1000)
      : undefined
  const variantWeight =
    typeof innerWeight === "number" && innerWeight > 0
      ? Math.round(innerWeight * 1000)
      : undefined

  const gtin = product.GTIN ? String(product.GTIN).trim() : ""

  return {
    title,
    handle,
    description,
    status: "published",
    variants: [
      {
        title: "Default",
        sku,
        ean: gtin !== "" ? gtin : undefined,
        options: {
          Default: "Default",
        },
        prices,
        weight: variantWeight,
        length: variantLength,
        width: variantWidth,
        height: variantHeight,
        quantities: { quantity: 0 },
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
          // Outer box dimensions (stored in metadata)
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
    },
  }
}

async function testTransform() {
  console.log("=== Testing Northern-2 Transform ===\n")

  // Read Excel data
  const excelProducts = await readNorthernExcel(EXCEL_FILE_PATH)
  console.log(`\n📊 Total products in XLSX: ${excelProducts.length}`)

  // Transform products
  const products: ProductInput[] = []
  let skipped = 0
  for (const excelProduct of excelProducts) {
    const transformed = transformProduct(excelProduct)
    if (transformed) {
      products.push(transformed)
    } else {
      skipped++
    }
  }

  console.log(`✅ Transformed ${products.length} valid products`)
  console.log(`⏭️  Skipped ${skipped} products`)

  // Find product 2530
  const product2530 = products.find((p) => p.variants?.[0]?.sku === "2530")

  if (product2530) {
    console.log("\n" + "=".repeat(80))
    console.log("🎯 PRODUCT 2530 DETAILS (Target Product)")
    console.log("=".repeat(80))
    console.log("\n📦 Product:")
    console.log(`   Title: ${product2530.title}`)
    console.log(`   Handle: ${product2530.handle}`)
    console.log(`   Description: ${product2530.description}`)
    console.log(`   Status: ${product2530.status}`)

    console.log("\n📦 Product Metadata:")
    console.log(JSON.stringify(product2530.metadata, null, 2))

    if (product2530.variants?.[0]) {
      const variant = product2530.variants[0]
      console.log("\n🔖 Variant:")
      console.log(`   SKU: ${variant.sku}`)
      console.log(`   EAN: ${variant.ean || "N/A"}`)

      console.log(`\n💰 Prices (${variant.prices?.length || 0} currencies):`)
      for (const price of variant.prices || []) {
        console.log(
          `   ${price.currency_code.toUpperCase()}: ${price.amount} (stored as ${price.amount * 100} cents)`
        )
      }

      console.log("\n📏 Dimensions (Variant fields - INNER BOX, converted to mm/g):")
      console.log(
        `   Weight: ${variant.weight !== undefined ? `${variant.weight}g (${(variant.weight / 1000).toFixed(2)}kg)` : "❌ undefined"}`
      )
      console.log(
        `   Length: ${variant.length !== undefined ? `${variant.length}mm (${(variant.length / 1000).toFixed(3)}m)` : "❌ undefined"}`
      )
      console.log(
        `   Width:  ${variant.width !== undefined ? `${variant.width}mm (${(variant.width / 1000).toFixed(3)}m)` : "❌ undefined"}`
      )
      console.log(
        `   Height: ${variant.height !== undefined ? `${variant.height}mm (${(variant.height / 1000).toFixed(3)}m)` : "❌ undefined"}`
      )

      console.log("\n📦 Outer Box (Metadata, original XLSX values):")
      console.log(
        `   Length: ${variant.metadata?.outer_box_length || 0} m`
      )
      console.log(
        `   Width:  ${variant.metadata?.outer_box_width || 0} m`
      )
      console.log(
        `   Height: ${variant.metadata?.outer_box_height || 0} m`
      )
      console.log(
        `   Weight: ${variant.metadata?.outer_box_weight || 0} kg`
      )
      console.log(
        `   Items:  ${variant.metadata?.items_in_outer_box || "N/A"}`
      )

      console.log("\n🏷️  Variant Metadata:")
      console.log(JSON.stringify(variant.metadata, null, 2))
    }
    console.log("\n" + "=".repeat(80))
  } else {
    console.log("\n❌ Product 2530 not found in transformed data!")
  }

  // Show sample of other products (first 3)
  console.log("\n" + "=".repeat(80))
  console.log("📋 SAMPLE: First 3 Products (for comparison)")
  console.log("=".repeat(80))

  for (const [idx, product] of products.slice(0, 3).entries()) {
    const variant = product.variants?.[0]
    console.log(`\n${idx + 1}. ${product.title}`)
    console.log(`   SKU: ${variant?.sku}`)
    console.log(`   EAN: ${variant?.ean || "N/A"}`)
    console.log(
      `   Weight: ${variant?.weight !== undefined ? `${variant.weight}g` : "undefined"}`
    )
    console.log(
      `   Length: ${variant?.length !== undefined ? `${variant.length}mm` : "undefined"}`
    )
    console.log(
      `   Width:  ${variant?.width !== undefined ? `${variant.width}mm` : "undefined"}`
    )
    console.log(
      `   Height: ${variant?.height !== undefined ? `${variant.height}mm` : "undefined"}`
    )
    console.log(`   Prices: ${variant?.prices?.length || 0} currencies`)
    console.log(
      `   Outer box: ${variant?.metadata?.outer_box_length || 0} × ${variant?.metadata?.outer_box_width || 0} × ${variant?.metadata?.outer_box_height || 0}m`
    )
  }

  // Statistics
  console.log("\n" + "=".repeat(80))
  console.log("📊 STATISTICS")
  console.log("=".repeat(80))

  const productsWithDimensions = products.filter((p) => {
    const v = p.variants?.[0]
    return v?.weight !== undefined || v?.length !== undefined
  })

  const productsWithoutDimensions = products.filter((p) => {
    const v = p.variants?.[0]
    return v?.weight === undefined && v?.length === undefined
  })

  const productsWithOuterBox = products.filter((p) => {
    const v = p.variants?.[0]
    const hasOuterBox =
      (v?.metadata?.outer_box_length || 0) > 0 ||
      (v?.metadata?.outer_box_width || 0) > 0
    return hasOuterBox
  })

  console.log(`\nTotal products: ${products.length}`)
  console.log(
    `Products WITH dimensions (weight/length): ${productsWithDimensions.length}`
  )
  console.log(
    `Products WITHOUT dimensions: ${productsWithoutDimensions.length}`
  )
  console.log(`Products WITH outer box data: ${productsWithOuterBox.length}`)

  // Group by category
  const byCategory = new Map<string, number>()
  for (const product of products) {
    const category = product.metadata?.category || "Unknown"
    byCategory.set(category, (byCategory.get(category) || 0) + 1)
  }

  console.log("\nProducts by category:")
  for (const [category, count] of byCategory.entries()) {
    console.log(`  ${category}: ${count}`)
  }

  console.log("\n✅ Transform test completed!")
}

testTransform().catch((error) => {
  console.error("❌ Error during transform test:", error)
  process.exit(1)
})
