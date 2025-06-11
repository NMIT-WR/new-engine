import type {
  CreateProductCollectionDTO,
  ExecArgs,
  MedusaContainer,
} from '@medusajs/framework/types'
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
  ProductStatus,
} from '@medusajs/framework/utils'
import {
  batchLinkProductsToCollectionWorkflow,
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from '@medusajs/medusa/core-flows'

// Import mock products from frontend
import { mockProducts } from '../../../frontend-demo/src/data/mock-products'
import type { Product } from '../../../frontend-demo/src/types/product'

export default async function seedEnhancedData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const storeModuleService = container.resolve(Modules.STORE)

  const countries = ['gb', 'de', 'dk', 'se', 'fr', 'es', 'it']

  logger.info('Seeding store data...')
  const [store] = await storeModuleService.listStores()
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: 'Default Sales Channel',
  })

  if (!store) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, 'Store not found')
  }
  if (!defaultSalesChannel || !defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: 'Default Sales Channel',
          },
        ],
      },
    })
    defaultSalesChannel = salesChannelResult
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          {
            currency_code: 'eur',
            is_default: true,
          },
          {
            currency_code: 'usd',
          },
        ],
        default_sales_channel_id: defaultSalesChannel[0]?.id,
      },
    },
  })

  logger.info('Seeding region data...')
  const regionService = container.resolve(Modules.REGION)
  let regions = await regionService.listRegions()
  let region

  if (!regions || regions.length === 0) {
    logger.info('No regions found, creating new ones...')
    const { result: newRegions } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: 'Europe',
            currency_code: 'eur',
            countries,
            payment_providers: ['pp_system_default'],
          },
          {
            name: 'United States',
            currency_code: 'usd',
            countries: ['us'],
            payment_providers: ['pp_system_default'],
          },
        ],
      },
    })
    if (!newRegions || newRegions.length === 0) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        'Failed to create new regions.'
      )
    }
    regions = newRegions
    logger.info(`Created ${regions.length} new region(s).`)
  } else {
    logger.info(
      `Found ${regions.length} existing region(s). Using the first one.`
    )
  }
  if (!regions || regions.length === 0) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      'No regions available after seeding/checking.'
    )
  }
  region = regions[0]
  logger.info('Seeding tax regions...')
  try {
    await createTaxRegionsWorkflow(container).run({
      input: countries.map((country_code) => ({
        country_code,
      })),
    })
    logger.info('Finished seeding tax regions.')
  } catch (error) {
    if (error.message?.includes('already exists')) {
      logger.info('Tax regions already exist, skipping...')
    } else {
      throw error
    }
  }

  logger.info('Seeding stock location data...')
  let stockLocation
  const stockLocationService = container.resolve(Modules.STOCK_LOCATION)
  const existingLocations = await stockLocationService.listStockLocations({
    name: 'European Warehouse',
  })
  
  if (existingLocations && existingLocations.length > 0) {
    logger.info('Stock location already exists, using existing...')
    stockLocation = existingLocations[0]
  } else {
    const { result: stockLocationResult } = await createStockLocationsWorkflow(
      container
    ).run({
      input: {
        locations: [
          {
            name: 'European Warehouse',
            address: {
              city: 'Copenhagen',
              country_code: 'DK',
              address_1: '',
            },
          },
        ],
      },
    })
    stockLocation = stockLocationResult[0]
  }

  if (!stockLocation) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      'Stock location not found'
    )
  }
  try {
    await remoteLink.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: 'manual_manual',
      },
    })
  } catch (error) {
    logger.info('Remote link may already exist, continuing...')
  }

  logger.info('Seeding fulfillment data...')
  let shippingProfile
  try {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: 'Default',
              type: 'default',
            },
          ],
        },
      })
    shippingProfile = shippingProfileResult[0]
  } catch (error) {
    if (error.message?.includes('already exists')) {
      logger.info('Shipping profile already exists, fetching existing...')
      const profiles = await fulfillmentModuleService.listShippingProfiles({
        name: 'Default',
      })
      shippingProfile = profiles[0]
    } else {
      throw error
    }
  }
  
  if (!shippingProfile) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      'Shipping profile not found'
    )
  }

  let fulfillmentSet
  try {
    fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: 'European Warehouse delivery',
      type: 'shipping',
    service_zones: [
      {
        name: 'Europe',
        geo_zones: [
          {
            country_code: 'gb',
            type: 'country',
          },
          {
            country_code: 'de',
            type: 'country',
          },
          {
            country_code: 'dk',
            type: 'country',
          },
          {
            country_code: 'se',
            type: 'country',
          },
          {
            country_code: 'fr',
            type: 'country',
          },
          {
            country_code: 'es',
            type: 'country',
          },
          {
            country_code: 'it',
            type: 'country',
          },
        ],
      },
    ],
  })
  } catch (error) {
    if (error.message?.includes('already exists')) {
      logger.info('Fulfillment set already exists, fetching existing...')
      const sets = await fulfillmentModuleService.listFulfillmentSets({
        name: 'European Warehouse delivery',
      }, {
        relations: ['service_zones']
      })
      fulfillmentSet = sets[0]
    } else {
      throw error
    }
  }

  try {
    await remoteLink.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSet.id,
      },
    })
  } catch (error) {
    logger.info('Remote link may already exist, continuing...')
  }

  try {
    await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: 'Standard Shipping',
        price_type: 'flat',
        provider_id: 'manual_manual',
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: 'Standard',
          description: 'Ship in 2-3 days.',
          code: 'standard',
        },
        prices: [
          {
            currency_code: 'usd',
            amount: 10,
          },
          {
            currency_code: 'eur',
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: 'enabled_in_store',
            value: '"true"',
            operator: 'eq',
          },
          {
            attribute: 'is_return',
            value: 'false',
            operator: 'eq',
          },
        ],
      },
      {
        name: 'Express Shipping',
        price_type: 'flat',
        provider_id: 'manual_manual',
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: 'Express',
          description: 'Ship in 24 hours.',
          code: 'express',
        },
        prices: [
          {
            currency_code: 'usd',
            amount: 10,
          },
          {
            currency_code: 'eur',
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: 'enabled_in_store',
            value: '"true"',
            operator: 'eq',
          },
          {
            attribute: 'is_return',
            value: 'false',
            operator: 'eq',
          },
        ],
      },
    ],
  })
  } catch (error) {
    if (error.message?.includes('already exists')) {
      logger.info('Shipping options already exist, skipping...')
    } else {
      throw error
    }
  }
  logger.info('Finished seeding fulfillment data.')

  try {
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: {
        id: stockLocation.id,
        add: [defaultSalesChannel[0].id],
      },
    })
  } catch (error) {
    logger.info('Sales channel link may already exist, continuing...')
  }
  logger.info('Finished seeding stock location data.')

  logger.info('Seeding publishable API key data...')
  let publishableApiKey
  try {
    const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
      container
    ).run({
      input: {
        api_keys: [
          {
            title: 'Webshop',
            type: 'publishable',
            created_by: '',
          },
        ],
      },
    })
    publishableApiKey = publishableApiKeyResult[0]
    
    if (!publishableApiKey) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        'Publishable API key not found'
      )
    }

    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: {
        id: publishableApiKey.id,
        add: [defaultSalesChannel[0].id],
      },
    })
  } catch (error) {
    logger.info('API key may already exist, continuing...')
  }
  logger.info('Finished seeding publishable API key data.')

  logger.info('Seeding product categories...')
  
  // Check if categories already exist
  const productService = container.resolve(Modules.PRODUCT)
  const existingCategories = await productService.listProductCategories({})
  let categoryMap: Record<string, string> = {}
  
  if (existingCategories && existingCategories.length > 4) {
    logger.info(`Found ${existingCategories.length} existing categories, skipping category creation...`)
    // Create map from existing categories
    categoryMap = existingCategories.reduce((acc, cat) => {
      acc[cat.handle] = cat.id
      return acc
    }, {} as Record<string, string>)
  } else {
    // Create categories matching the frontend
    const { result: categoryResult } = await createProductCategoriesWorkflow(
      container
    ).run({
    input: {
      product_categories: [
        {
          name: 'T-Shirts & Tops',
          handle: 't-shirts-tops',
          is_active: true,
        },
        {
          name: 'Jeans & Pants',
          handle: 'jeans-pants',
          is_active: true,
        },
        {
          name: 'Shoes & Sneakers',
          handle: 'shoes-sneakers',
          is_active: true,
        },
        {
          name: 'Jackets & Coats',
          handle: 'jackets-coats',
          is_active: true,
        },
        {
          name: 'Dresses',
          handle: 'dresses',
          is_active: true,
        },
        {
          name: 'Accessories',
          handle: 'accessories',
          is_active: true,
        },
        {
          name: 'Knitwear',
          handle: 'knitwear',
          is_active: true,
        },
        {
          name: 'Activewear',
          handle: 'activewear',
          is_active: true,
        },
        {
          name: 'Skirts',
          handle: 'skirts',
          is_active: true,
        },
      ],
    },
  })

    // Create a map for easy category lookup
    categoryMap = categoryResult.reduce((acc, cat) => {
      acc[cat.handle] = cat.id
      return acc
    }, {} as Record<string, string>)
  }

  logger.info('Finished seeding product categories.')

  logger.info('Transforming and seeding product data...')
  
  // Check if we already have products
  const existingProducts = await productService.listProducts({})
  if (existingProducts && existingProducts.length > 10) {
    logger.info(`Found ${existingProducts.length} existing products, skipping product creation...`)
    return
  }

  // Transform frontend products to Medusa format
  const transformProduct = (product: Product) => {
    // Extract unique option types and their values
    const optionTypes = new Map<string, Set<string>>()
    
    product.variants?.forEach(variant => {
      if (variant.options) {
        Object.entries(variant.options).forEach(([key, value]) => {
          if (!optionTypes.has(key)) {
            optionTypes.set(key, new Set())
          }
          optionTypes.get(key)!.add(value)
        })
      }
    })

    // Convert options map to array format
    const options = Array.from(optionTypes.entries()).map(([title, values]) => ({
      title,
      values: Array.from(values),
    }))

    // Transform variants
    const variants = product.variants?.map(variant => ({
      title: variant.title,
      sku: variant.sku,
      manage_inventory: true,
      inventory_quantity: variant.inventory_quantity || 100,
      options: variant.options || {},
      prices: variant.prices?.map(price => ({
        amount: price.amount / 100, // Convert from cents
        currency_code: price.currency_code.toLowerCase(),
      })) || [],
    })) || []

    // Get category IDs
    const category_ids = product.categories?.map(cat => 
      categoryMap[cat.handle]
    ).filter(Boolean) || []

    // Transform images - using external URLs directly
    const images = product.images?.map(img => ({
      url: img.url,
    })) || (product.thumbnail ? [{ url: product.thumbnail }] : [])

    return {
      title: product.title,
      handle: product.handle,
      description: product.description || product.longDescription || '',
      category_ids,
      status: ProductStatus.PUBLISHED,
      images,
      options,
      variants,
      sales_channels: [
        {
          id: defaultSalesChannel[0].id,
        },
      ],
      weight: 400, // Default weight
      metadata: {
        longDescription: product.longDescription,
        specifications: product.specifications,
        features: product.features,
        rating: product.rating,
        reviewCount: product.reviewCount,
        // Add color options for filtering
        availableColors: Array.from(new Set(
          product.variants?.map(v => v.options?.color || v.options?.Color || v.colorHex)
            .filter(Boolean)
        )) || [],
        // Add size options for filtering
        availableSizes: Array.from(new Set(
          product.variants?.map(v => v.options?.size || v.options?.Size)
            .filter(Boolean)
        )) || [],
      },
    }
  }

  // Transform all products
  const productsToCreate = mockProducts.map(transformProduct)

  // Create products in batches to avoid timeout
  const batchSize = 5
  const allProducts = []
  
  for (let i = 0; i < productsToCreate.length; i += batchSize) {
    const batch = productsToCreate.slice(i, i + batchSize)
    logger.info(`Creating product batch ${i / batchSize + 1}/${Math.ceil(productsToCreate.length / batchSize)}`)
    
    const { result: products } = await createProductsWorkflow(container).run({
      input: {
        products: batch,
      },
    })
    
    allProducts.push(...products)
  }

  logger.info(`Finished seeding ${allProducts.length} products.`)
  
  logger.info('Seeding inventory levels.')

  const { data: inventoryItems } = await query.graph({
    entity: 'inventory_item',
    fields: ['id'],
  })

  const inventoryLevels = []
  for (const inventoryItem of inventoryItems) {
    const inventoryLevel = {
      location_id: stockLocation.id,
      stocked_quantity: 1000,
      inventory_item_id: inventoryItem.id,
    }
    inventoryLevels.push(inventoryLevel)
  }

  try {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: inventoryLevels,
      },
    })
  } catch (error) {
    if (error.message?.includes('already exists')) {
      logger.info('Inventory levels already exist, skipping...')
    } else {
      throw error
    }
  }

  logger.info('Finished seeding inventory levels data.')

  logger.info('Creating collections...')
  
  // Create collections
  const collections: CreateProductCollectionDTO[] = [
    {
      title: 'Summer Collection',
      handle: 'summer-collection',
    },
    {
      title: 'Winter Collection',
      handle: 'winter-collection',
    },
    {
      title: 'Latest Drops',
      handle: 'latest-drops',
    },
  ]

  const { result: createdCollections } = await createCollectionsWorkflow(
    container
  ).run({
    input: {
      collections,
    },
  })

  // Link products to collections based on frontend data
  const collectionMap = createdCollections.reduce((acc, col) => {
    acc[col.handle] = col.id
    return acc
  }, {} as Record<string, string>)

  // Link products to their collections
  for (let i = 0; i < mockProducts.length; i++) {
    const mockProduct = mockProducts[i]
    const createdProduct = allProducts[i]
    
    if (mockProduct.collection) {
      const collectionId = collectionMap[mockProduct.collection.handle]
      if (collectionId) {
        await batchLinkProductsToCollectionWorkflow(container).run({
          input: {
            id: collectionId,
            add: [createdProduct.id],
          },
        })
      }
    }
  }

  // Add all products to "Latest Drops" collection
  await batchLinkProductsToCollectionWorkflow(container).run({
    input: {
      id: collectionMap['latest-drops'],
      add: allProducts.map((p) => p.id),
    },
  })

  logger.info(`Created ${createdCollections.length} collections and linked products.`)
  
  logger.info('Enhanced seed completed successfully!')
}