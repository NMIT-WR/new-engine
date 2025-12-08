import { NextResponse } from 'next/server'

const MEDUSA_API_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://medusa-13d1-9000.prg1.zerops.app'
const MEDUSA_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''
const BATCH_SIZE = 100
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
const DEFAULT_REGION_ID = process.env.NEXT_PUBLIC_DEFAULT_REGION_ID || 'reg_01JYERR9Q887DKZ9JAR7SMJHA5'

interface MedusaVariant {
  id: string
  title: string
  sku?: string
  ean?: string
  calculated_price?: {
    calculated_amount: number
    currency_code: string
  }
  metadata?: {
    attributes?: Array<{ name: string; value: string }>
  }
}

interface MedusaProduct {
  id: string
  title: string
  handle: string
  description?: string
  thumbnail?: string
  variants?: MedusaVariant[]
  categories?: Array<{ name: string }>
}

interface MedusaResponse {
  products: MedusaProduct[]
  count: number
}

async function fetchAllProducts(): Promise<MedusaProduct[]> {
  const allProducts: MedusaProduct[] = []
  let offset = 0
  let total = 0

  do {
    const url = `${MEDUSA_API_URL}/store/products?limit=${BATCH_SIZE}&offset=${offset}&region_id=${DEFAULT_REGION_ID}&fields=*variants.calculated_price`

    const response = await fetch(url, {
      headers: { 'x-publishable-api-key': MEDUSA_API_KEY },
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Medusa API error: ${response.status}`)
    }

    const data: MedusaResponse = await response.json()
    total = data.count
    allProducts.push(...data.products)
    offset += BATCH_SIZE

  } while (offset < total)

  return allProducts
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function generateXmlFeed(products: MedusaProduct[]): string {
  const items: string[] = []

  for (const product of products) {
    for (const variant of (product.variants || [])) {
      const variantTitle = variant.title || 'Default'
      const url = `${SITE_URL}/produkt/${product.handle}?variant=${encodeURIComponent(variantTitle)}`

      // Get manufacturer from metadata
      const attributes = variant.metadata?.attributes || []
      const manufacturer = attributes.find(a => a.name === 'Distributor')?.value || ''

      // Get category
      const category = product.categories?.map(c => c.name).join(' > ') || ''

      // Get price
      const price = variant.calculated_price?.calculated_amount
        ? (variant.calculated_price.calculated_amount / 100).toFixed(2)
        : '0'
      const currency = variant.calculated_price?.currency_code?.toUpperCase() || 'CZK'

      const item = `
    <SHOPITEM>
      <ITEM_ID>${escapeXml(variant.id)}</ITEM_ID>
      <PRODUCTNAME>${escapeXml(`${product.title} - ${variantTitle}`)}</PRODUCTNAME>
      <PRODUCT>${escapeXml(product.title)}</PRODUCT>
      <DESCRIPTION>${escapeXml(product.description || '')}</DESCRIPTION>
      <URL>${escapeXml(url)}</URL>
      <IMGURL>${escapeXml(product.thumbnail || '')}</IMGURL>
      <PRICE_VAT>${price}</PRICE_VAT>
      <CURRENCY>${currency}</CURRENCY>
      <MANUFACTURER>${escapeXml(manufacturer)}</MANUFACTURER>
      <CATEGORYTEXT>${escapeXml(category)}</CATEGORYTEXT>
      <EAN>${escapeXml(variant.ean || '')}</EAN>
      <ITEM_GROUP_ID>${escapeXml(product.id)}</ITEM_GROUP_ID>
      <SKU>${escapeXml(variant.sku || '')}</SKU>
      <DELIVERY_DATE>0</DELIVERY_DATE>
      <AVAILABILITY>in stock</AVAILABILITY>
    </SHOPITEM>`

      items.push(item)
    }
  }

  return `<?xml version="1.0" encoding="utf-8"?>
<SHOP>
  ${items.join('\n')}
</SHOP>`
}

export async function GET() {
  try {
    const products = await fetchAllProducts()
    const xml = generateXmlFeed(products)

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Feed generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate feed' },
      { status: 500 }
    )
  }
}
