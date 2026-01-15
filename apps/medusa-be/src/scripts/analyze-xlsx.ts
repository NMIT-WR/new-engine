import * as fs from "node:fs/promises"
import * as path from "node:path"
import * as XLSX from "xlsx"

/** Path to Excel file relative to medusa-be root (process.cwd()) */
const EXCEL_FILE_PATH = "./src/scripts/seed-files/Masterdata-Northern_SS2025.xlsx"

async function analyzeXLSX() {
  console.log("=== Analyzing Northern XLSX ===\n")

  const absolutePath = path.resolve(process.cwd(), EXCEL_FILE_PATH)
  const fileBuffer = await fs.readFile(absolutePath)
  const workbook = XLSX.read(fileBuffer, { type: "buffer" })

  console.log("Available sheets:", workbook.SheetNames.join(", "))
  console.log()

  const productSheets = ["Furniture", "Lighting", "Accessories", "Spare parts"]
  let product2530Found = false

  for (const sheetName of productSheets) {
    if (!workbook.SheetNames.includes(sheetName)) {
      console.log(`⚠️  Sheet "${sheetName}" not found`)
      continue
    }

    const sheet = workbook.Sheets[sheetName]
    if (!sheet) {
      console.log(`⚠️  Sheet "${sheetName}" is empty`)
      continue
    }

    const data = XLSX.utils.sheet_to_json(sheet, {
      defval: undefined,
    }) as any[]

    console.log(`📄 Sheet: ${sheetName}`)
    console.log(`   Total rows: ${data.length}`)

    // Find product 2530
    const product2530 = data.find((p) => String(p["No."]) === "2530")
    if (product2530) {
      product2530Found = true
      console.log(`\n✅ Found product 2530 in sheet "${sheetName}"`)
      console.log("\n=== Product 2530 Details ===")
      console.log(JSON.stringify(product2530, null, 2))

      // Check specific outer box fields
      console.log("\n=== Outer Box Dimensions ===")
      console.log("OUTER BOX - Length:", product2530["OUTER BOX - Length"])
      console.log("OUTER BOX - Width:", product2530["OUTER BOX - Width"])
      console.log("OUTER BOX - Height:", product2530["OUTER BOX - Height"])
      console.log("OUTER BOX - Weight:", product2530["OUTER BOX - Weight"])
      console.log("Items in OUTER BOX:", product2530["Items in OUTER BOX"])

      console.log("\n=== Inner Box Dimensions ===")
      console.log("INNER BOX - Length:", product2530["INNER BOX - Length"])
      console.log("INNER BOX - Width:", product2530["INNER BOX - Width"])
      console.log("INNER BOX - Height:", product2530["INNER BOX - Height"])
      console.log("INNER BOX - Weight:", product2530["INNER BOX - Weight"])

      // Sample a few more products to check if outer box data is generally available
      console.log("\n=== Sample Other Products (first 3) ===")
      data.slice(0, 3).forEach((p, i) => {
        console.log(`\nProduct ${i + 1}: ${p["No."]} - ${p.Description}`)
        console.log(
          `  OUTER BOX - L/W/H/Weight: ${p["OUTER BOX - Length"]} / ${p["OUTER BOX - Width"]} / ${p["OUTER BOX - Height"]} / ${p["OUTER BOX - Weight"]}`
        )
        console.log(
          `  INNER BOX - L/W/H/Weight: ${p["INNER BOX - Length"]} / ${p["INNER BOX - Width"]} / ${p["INNER BOX - Height"]} / ${p["INNER BOX - Weight"]}`
        )
        console.log(`  Items in OUTER BOX: ${p["Items in OUTER BOX"]}`)
      })
    }

    console.log()
  }

  if (!product2530Found) {
    console.log("❌ Product 2530 not found in any sheet")
  }

  // Check for any products with missing outer box data
  console.log("\n=== Statistics: Missing Outer Box Data ===")
  for (const sheetName of productSheets) {
    if (!workbook.SheetNames.includes(sheetName)) continue

    const sheet = workbook.Sheets[sheetName]
    if (!sheet) continue

    const data = XLSX.utils.sheet_to_json(sheet, {
      defval: undefined,
    }) as any[]

    const missingOuterBox = data.filter(
      (p) =>
        !p["OUTER BOX - Length"] &&
        !p["OUTER BOX - Width"] &&
        !p["OUTER BOX - Height"] &&
        !p["OUTER BOX - Weight"]
    )

    const hasOuterBox = data.filter(
      (p) =>
        p["OUTER BOX - Length"] ||
        p["OUTER BOX - Width"] ||
        p["OUTER BOX - Height"] ||
        p["OUTER BOX - Weight"]
    )

    console.log(`\n${sheetName}:`)
    console.log(`  Total products: ${data.length}`)
    console.log(`  With outer box data: ${hasOuterBox.length}`)
    console.log(`  Missing outer box data: ${missingOuterBox.length}`)
  }
}

analyzeXLSX().catch((error) => {
  console.error("Error analyzing XLSX:", error)
  process.exit(1)
})
