import type {
  ExecArgs,
  ProductDTO,
  StockLocationDTO,
} from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { updateInventoryLevelsWorkflow } from "@medusajs/medusa/core-flows"

export default async function updateInventory({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productService = container.resolve(Modules.PRODUCT)
  const stockLocationService = container.resolve(Modules.STOCK_LOCATION)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  try {
    // Get the product by handle
    const productHandle = "blue-denim-jeans"
    logger.info(`Looking for product with handle: ${productHandle}`)

    const products = await productService.listProducts(
      {
        handle: productHandle,
      },
      {
        relations: ["variants", "variants.inventory_items"],
      }
    )

    if (!products || products.length === 0) {
      logger.error(`Product with handle "${productHandle}" not found`)
      return
    }

    const product = products[0] as ProductDTO
    logger.info(`Found product: ${product.title} (${product.id})`)

    if (!product.variants || product.variants.length === 0) {
      logger.error(`Product "${product.title}" has no variants`)
      return
    }

    // Get stock location
    const stockLocations = await stockLocationService.listStockLocations(
      {
        name: "European Warehouse",
      },
      { take: 1 }
    )

    if (!stockLocations || stockLocations.length === 0) {
      logger.error('Stock location "European Warehouse" not found')
      return
    }

    const stockLocation = stockLocations[0] as StockLocationDTO
    logger.info(
      `Using stock location: ${stockLocation.name} (${stockLocation.id})`
    )

    // Get inventory items for all variants
    const { data: inventoryItemLinks } = await query.graph({
      entity: "product_variant_inventory_item",
      fields: ["variant_id", "inventory_item_id"],
      filters: {
        variant_id: product.variants.map((v) => v.id),
      },
    })

    if (!inventoryItemLinks || inventoryItemLinks.length === 0) {
      logger.error("No inventory items found for product variants")
      return
    }

    // Get current inventory levels
    const inventoryItemIds = inventoryItemLinks.map(
      (link) => link.inventory_item_id
    )
    const { data: inventoryLevels } = await query.graph({
      entity: "inventory_level",
      fields: [
        "id",
        "inventory_item_id",
        "location_id",
        "stocked_quantity",
        "reserved_quantity",
      ],
      filters: {
        inventory_item_id: inventoryItemIds,
        location_id: stockLocation.id,
      },
    })

    if (!inventoryLevels || inventoryLevels.length === 0) {
      logger.error("No inventory levels found for the given location")
      return
    }

    logger.info(`Found ${inventoryLevels.length} inventory levels to update`)

    // Update inventory levels - setting new stock quantities
    const updates: {
      id: string
      inventory_item_id: string
      location_id: string
      stocked_quantity: number
    }[] = []
    for (const level of inventoryLevels) {
      // Find the corresponding variant
      const link = inventoryItemLinks.find(
        (l) => l.inventory_item_id === level.inventory_item_id
      )
      const variant = product.variants.find((v) => v.id === link?.variant_id)

      if (variant) {
        logger.info(
          `Checking inventory for variant: ${variant.title} (${variant.sku})`
        )
        logger.info(
          `Current stock: ${level.stocked_quantity}, Reserved: ${level.reserved_quantity}`
        )

        // Set new stock quantity (you can adjust these values as needed)
        const newQuantity = 50 // Setting all variants to 50 units

        // Skip if quantity is already at target - avoid unnecessary workflow runs
        if (level.stocked_quantity === newQuantity) {
          logger.info(
            `Skipping update - stock quantity already at target: ${newQuantity}`
          )
          continue
        }

        updates.push({
          id: level.id,
          inventory_item_id: level.inventory_item_id,
          location_id: level.location_id,
          stocked_quantity: newQuantity,
        })

        logger.info(`Will update stock quantity to: ${newQuantity}`)
      }
    }

    if (updates.length > 0) {
      // Execute the inventory update workflow
      await updateInventoryLevelsWorkflow(container).run({
        input: {
          updates,
        },
      })

      logger.info(`Successfully updated ${updates.length} inventory levels`)
      logger.info("Inventory update completed!")
    } else {
      logger.warn("No inventory levels to update")
    }
  } catch (error) {
    logger.error(
      "Error updating inventory:",
      error instanceof Error ? error : new Error(String(error))
    )
    throw error
  }
}
