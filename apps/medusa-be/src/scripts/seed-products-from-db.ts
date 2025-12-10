import type {
  CreateProductWorkflowInputDTO,
  ExecArgs,
} from '@medusajs/framework/types'
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
  ProductStatus,
} from '@medusajs/framework/utils'
// @ts-nocheck necessary due to Medusa failing with strict mode
import {
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createStockLocationsWorkflow,
} from '@medusajs/medusa/core-flows'
import { sql } from 'drizzle-orm'
import { sqlRaw } from '../utils/db'

// Product record shape from the database
type ProductRecord = {
  product_slug: string
  product_name: string
  product_description: string
  product_price: number
  product_image_url: string
  subcategory_slug: string
  subcategory_name: string
  subcategory_image_url: string
  subcollection_name: string
  category_slug: string
  category_name: string
  category_image_url: string
  collection_slug: string
  collection_name: string
}

/**
 * Import a page of products from the database
 */
async function importProductPage(
  page: number,
  step = 10
): Promise<ProductRecord[]> {
  // Query products with pagination
  return await sqlRaw<ProductRecord>(sql`
      SELECT
        p.slug AS product_slug,
        p.name AS product_name,
        p.description AS product_description,
        p.price AS product_price,
        p.image_url AS product_image_url,
        sca.slug AS subcategory_slug,
        sca.name AS subcategory_name,
        sca.image_url AS subcategory_image_url,
        sco.name AS subcollection_name,
        ca.slug AS category_slug,
        ca.name AS category_name,
        ca.image_url AS category_image_url,
        cl.slug AS collection_slug,
        cl.name AS collection_name
      FROM products p
      JOIN subcategories sca ON sca.slug = p.subcategory_slug
      JOIN subcollections sco ON sco.id = sca.subcollection_id
      JOIN categories ca ON ca.slug = sco.category_slug
      JOIN collections cl ON cl.id = ca.collection_id
      LIMIT ${step}
      OFFSET ${page * step}`)
}

let i = 0
/**
 * Sanitize a string to be URL-safe for use as a handle
 */
function sanitizeHandle(handle: string): string {
  if (!handle) {
    return `product-${i++}-${Date.now()}`
  }

  // Check if the handle is a date string (common issue with database exports)
  if (handle.match(/^\d{4}-\d{2}-\d{2}/) || !Number.isNaN(Date.parse(handle))) {
    return `product-${i++}-${Date.now()}`
  }

  // Replace any character that's not alphanumeric, dash, or underscore with a dash
  return handle
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-') // Replace multiple consecutive dashes with a single dash
    .replace(/^-|-$/g, '') // Remove leading and trailing dashes
}

/**
 * Convert products from database format to MedusaJS format
 */
function convertToMedusaProducts(
  products: ProductRecord[],
  defaultSalesChannelId: string,
  categoryMap: Record<string, string>
) {
  return products.map((product) => {
    const safeHandle = sanitizeHandle(`${product.product_name}`)

    return {
      title: product.product_name,
      description: product.product_description,
      handle: safeHandle,
      status: ProductStatus.PUBLISHED,
      // If we have category information and it exists in our map, use it
      category_ids:
        product.category_slug && categoryMap[product.category_slug]
          ? [categoryMap[product.category_slug]]
          : [],
      // If we have image URLs, convert them to the expected format
      // Note: This assumes images are already uploaded somewhere accessible
      thumbnail: product.product_image_url || undefined,
      options: [
        {
          title: 'Default',
          values: ['Default'],
        },
      ],
      variants: [
        {
          title: 'Default',
          sku: `SKU-${safeHandle}`, // Use sanitized handle for SKU as well
          prices: [
            {
              amount: product.product_price * 100, // Medusa expects prices in cents
              currency_code: 'eur',
            },
            {
              amount: product.product_price * 100 * 1.1, // Simple USD conversion
              currency_code: 'usd',
            },
          ],
        },
      ],
      // Link to default sales channel
      sales_channels: [
        {
          id: defaultSalesChannelId,
        },
      ],
    } as CreateProductWorkflowInputDTO
  })
}

/**
 * Check if categories already exist in the system by handle
 */
async function checkExistingCategories(
  container: any,
  categoryHandles: string[]
): Promise<Record<string, string>> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  // Query for existing categories with the given handles
  const { data: existingCategories } = await query.graph({
    entity: 'product_category',
    filters: {
      handle: categoryHandles,
    },
    fields: ['id', 'handle'],
  })

  // Create a map of handle -> id for existing categories
  const existingCategoryMap: Record<string, string> = {}
  existingCategories.forEach((category: any) => {
    existingCategoryMap[category.handle] = category.id
  })

  return existingCategoryMap
}

/**
 * Check if collections already exist in the system by handle
 */
async function checkExistingCollections(
  container: any,
  collectionHandles: string[]
): Promise<Record<string, string>> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  // Query for existing collections with the given handles
  const { data: existingCollections } = await query.graph({
    entity: 'product_collection',
    filters: {
      handle: collectionHandles,
    },
    fields: ['id', 'handle'],
  })

  // Create a map of handle -> id for existing collections
  const existingCollectionMap: Record<string, string> = {}
  existingCollections.forEach((collection: any) => {
    existingCollectionMap[collection.handle] = collection.id
  })

  return existingCollectionMap
}

/**
 * Check if products already exist in the system by handle
 */
async function checkExistingProducts(
  container: any,
  productHandles: string[]
): Promise<Record<string, string>> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  // Query for existing products with the given handles
  const { data: existingProducts } = await query.graph({
    entity: 'product',
    filters: {
      handle: productHandles,
    },
    fields: ['id', 'handle'],
  })

  // Create a map of handle -> id for existing products
  const existingProductMap: Record<string, string> = {}
  existingProducts.forEach((product: any) => {
    existingProductMap[product.handle] = product.id
  })

  return existingProductMap
}

/**
 * Extract unique categories from product records
 */
function extractCategories(products: ProductRecord[]): {
  slug: string
  name: string
  image_url?: string
}[] {
  const categoriesMap: Record<
    string,
    { slug: string; name: string; image_url?: string }
  > = {}

  products.forEach((product) => {
    if (product.category_slug && !categoriesMap[product.category_slug]) {
      categoriesMap[product.category_slug] = {
        slug: product.category_slug,
        name: product.category_name,
        image_url: product.category_image_url,
      }
    }
  })

  return Object.values(categoriesMap)
}

/**
 * Extract unique collections from product records
 */
function extractCollections(products: ProductRecord[]): {
  handle: string
  title: string
}[] {
  const collectionsMap: Record<string, { handle: string; title: string }> = {}

  products.forEach((product) => {
    if (product.collection_slug && !collectionsMap[product.collection_slug]) {
      collectionsMap[product.collection_slug] = {
        handle: product.collection_slug,
        title: product.collection_name,
      }
    }
  })

  return Object.values(collectionsMap)
}

export default async function seedProductsFromDb({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info('Starting bulk product import from database...')

  // 1. Get default sales channel
  const defaultSalesChannel = await salesChannelModuleService.listSalesChannels(
    {
      name: 'Default Sales Channel',
    }
  )

  if (!defaultSalesChannel || defaultSalesChannel.length === 0) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      'Default Sales Channel not found. Please run the seed script first.'
    )
  }

  const defaultSalesChannelId = defaultSalesChannel[0]?.id as string
  logger.info(`Found default sales channel with ID: ${defaultSalesChannelId}`)

  // 2. Import a small batch of products first to extract categories and collections
  logger.info('Fetching initial product data for category extraction...')
  const sampleProducts = await importProductPage(0, 10)

  if (!sampleProducts || sampleProducts.length === 0) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      'No products found in the database'
    )
  }

  // 3. Extract and create categories
  logger.info('Extracting categories from product data...')
  const categories = extractCategories(sampleProducts)
  logger.info(`Found ${categories.length} unique categories`)

  // Check which categories already exist
  const categoryHandles = categories.map((category) => category.slug)
  logger.info('Checking for existing categories...')
  const existingCategoryMap = await checkExistingCategories(
    container,
    categoryHandles
  )

  // Filter out categories that already exist
  const newCategories = categories.filter(
    (category) => !existingCategoryMap[category.slug]
  )
  logger.info(
    `Found ${Object.keys(existingCategoryMap).length} existing categories, creating ${newCategories.length} new categories`
  )

  // Map categories to the format required by Medusa
  const productCategories = newCategories.map((category) => ({
    name: category.name,
    handle: category.slug,
    is_active: true,
    is_internal: false,
    metadata: category.image_url
      ? { image_url: category.image_url }
      : undefined,
  }))

  // Only run creation workflow if there are new categories to create
  let categoryResult: any[] = []
  if (productCategories.length > 0) {
    logger.info('Creating product categories...')
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: productCategories,
      },
    })
    categoryResult = result
    logger.info(`Successfully created ${categoryResult.length} new categories`)
  } else {
    logger.info('No new categories to create, using existing ones')
  }

  // 5. Create a map of category slugs to category IDs for easy lookup
  const categoryMap: Record<string, string> = { ...existingCategoryMap }
  categoryResult.forEach((category) => {
    if (category.handle) {
      categoryMap[category.handle] = category.id
    }
  })

  // 4. Extract and create collections
  logger.info('Extracting collections from product data...')
  const collections = extractCollections(sampleProducts)
  logger.info(`Found ${collections.length} unique collections`)

  // Check which collections already exist
  const collectionHandles = collections.map((collection) => collection.handle)
  logger.info('Checking for existing collections...')
  const existingCollectionMap = await checkExistingCollections(
    container,
    collectionHandles
  )

  // Filter out collections that already exist
  const newCollections = collections.filter(
    (collection) => !existingCollectionMap[collection.handle]
  )
  logger.info(
    `Found ${Object.keys(existingCollectionMap).length} existing collections, creating ${newCollections.length} new collections`
  )

  // Only run creation workflow if there are new collections to create
  let collectionResult = []
  if (newCollections.length > 0) {
    logger.info('Creating new collections...')
    const { result } = await createCollectionsWorkflow(container).run({
      input: {
        collections: newCollections,
      },
    })
    collectionResult = result
    logger.info(
      `Successfully created ${collectionResult.length} new collections`
    )
  } else {
    logger.info('No new collections to create, using existing ones')
  }

  // 6. Import products in chunks
  const CHUNK_SIZE = 50
  let page = 0
  let totalImported = 0
  let hasMore = true

  logger.info(`Starting product import with chunk size: ${CHUNK_SIZE}`)

  while (hasMore) {
    try {
      hasMore = false
      logger.info(`Processing page ${page + 1}, offset: ${page * CHUNK_SIZE}`)

      // Get a page of products from the database
      const productRecords = await importProductPage(page, CHUNK_SIZE)

      if (!productRecords || productRecords.length === 0) {
        logger.info('No more products to import')
        hasMore = false
        break
      }

      // Convert products to Medusa format
      const medusaProducts = convertToMedusaProducts(
        productRecords,
        defaultSalesChannelId,
        categoryMap
      )

      // Check which products already exist
      const productHandles = medusaProducts.map(
        (product) => product.handle as string
      )
      logger.info(
        `Checking for existing products with ${productHandles.length} handles...`
      )
      const existingProductMap = await checkExistingProducts(
        container,
        productHandles
      )

      // Filter out products that already exist
      const newProducts = medusaProducts.filter(
        (product) => !existingProductMap[product.handle as string]
      )
      logger.info(
        `Found ${Object.keys(existingProductMap).length} existing products, creating ${newProducts.length} new products`
      )

      if (newProducts.length === 0) {
        logger.info('No new products to create in this batch, skipping...')
        page++
        // If we got fewer products than the chunk size, we've reached the end
        hasMore = productRecords.length >= CHUNK_SIZE
        continue
      }

      logger.info(
        `Importing ${newProducts.length} products (batch ${page + 1})...`
      )

      // Create products in Medusa
      const { result: createdProducts } = await createProductsWorkflow(
        container
      ).run({
        input: {
          products: newProducts,
        },
      })

      logger.info(`Successfully created ${createdProducts.length} products`)

      // 7. Set inventory levels for all variants of the created products
      const { result: stockLocationResult } =
        await createStockLocationsWorkflow(container).run({
          input: {
            locations: [
              {
                name: 'Default Warehouse',
                address: {
                  address_1: '123 Demo Street',
                  city: 'Demo City',
                  country_code: 'us',
                },
              },
            ],
          },
        })

      // Check if stock location was created successfully
      const stockLocation = stockLocationResult[0]
      if (!stockLocation) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          'Stock location not found'
        )
      }

      // Get inventory items for the products we just created
      const { data: inventoryItems } = await query.graph({
        entity: 'inventory_item',
        fields: ['id'],
      })

      // Create inventory levels for each inventory item with the location ID
      const inventoryLevels = []
      for (const inventoryItem of inventoryItems) {
        inventoryLevels.push({
          stocked_quantity: 100, // Default stock quantity
          inventory_item_id: inventoryItem.id,
          location_id: stockLocation.id, // Add the location ID here
        })
      }

      if (inventoryLevels.length > 0) {
        await createInventoryLevelsWorkflow(container).run({
          input: {
            inventory_levels: inventoryLevels,
          },
        })
        logger.info(
          `Set inventory levels for ${inventoryLevels.length} variants`
        )
      }

      totalImported += createdProducts.length
      page++

      logger.info(`Total products imported so far: ${totalImported}`)

      // If we got fewer products than the chunk size, we've reached the end
      hasMore = productRecords.length >= CHUNK_SIZE
    } catch (error: any) {
      console.log(error)
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error.message)
      const errorStack = error instanceof Error ? error.stack : undefined

      logger.error(
        `Error importing products at page ${page}: ${errorMessage}\n${errorStack || ''}`
      )

      // Continue with the next chunk even if this one failed
      page++

      // If we've had multiple consecutive errors, stop the process
      if (page > 3 && totalImported === 0) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `Failed to import products after multiple attempts: ${errorMessage}`
        )
      }
    }
  }

  logger.info(
    `Product import completed. Total products imported: ${totalImported}`
  )
}
