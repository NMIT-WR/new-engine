import {CreateInventoryLevelInput, InventoryLevelDTO, StockLocationDTO} from "@medusajs/framework/types"
import {ContainerRegistrationKeys, Modules} from "@medusajs/framework/utils"
import {createStep, StepResponse,} from "@medusajs/framework/workflows-sdk"
import {createInventoryLevelsWorkflow, updateInventoryLevelsWorkflow} from "@medusajs/medusa/core-flows"

export type CreateInventoryLevelsStepInput = {
    stockLocations: StockLocationDTO[]
}

const CreateInventoryLevelsStepId = 'create-inventory-levels-seed-step'
export const createInventoryLevelsStep = createStep(CreateInventoryLevelsStepId, async (
    input: CreateInventoryLevelsStepInput,
    {container}
) => {
    const result: InventoryLevelDTO[] = []
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const inventoryLevelService = container.resolve(Modules.INVENTORY)

    logger.info("Creating inventory levels...")

    const {data: inventoryItems} = await query.graph({
        entity: "inventory_item",
        fields: ["id"],
    })

    const inventoryLevels: CreateInventoryLevelInput[] = []
    for (const stockLocation of input.stockLocations) {
        for (const inventoryItem of inventoryItems) {
            const inventoryLevel = {
                location_id: stockLocation.id,
                stocked_quantity: 1000000,
                inventory_item_id: inventoryItem.id,
            }
            inventoryLevels.push(inventoryLevel)
        }
    }

    const existingInventoryLevels = await inventoryLevelService.listInventoryLevels({
        location_id: input.stockLocations.map(l => l.id),
        inventory_item_id: inventoryItems.map(i => i.id),
    })

    const missingInventoryLevels = inventoryLevels.filter(il => !existingInventoryLevels.find(
        eil => eil.inventory_item_id === il.inventory_item_id && eil.location_id === il.location_id
    ))
    const updateInventoryLevels = existingInventoryLevels.map(eil => {
        const inputInventoryLevel = inventoryLevels.find(il => eil.inventory_item_id === il.inventory_item_id && eil.location_id === il.location_id)
        if (inputInventoryLevel) {
            return {
                location_id: eil.location_id,
                inventory_item_id: eil.inventory_item_id,
                stocked_quantity: 1000000,
            }
        }

        return null
    }).filter(il => il !== null)


    if (missingInventoryLevels.length !== 0) {
        const createResult = await createInventoryLevelsWorkflow(container).run({
            input: {
                inventory_levels: inventoryLevels,
            },
        })
        for (const resultElement of createResult.result) {
            result.push(resultElement)
        }
    }

    if (updateInventoryLevels.length !== 0) {
        const updateResult = await updateInventoryLevelsWorkflow(container).run({
            input: {
                updates: updateInventoryLevels
            }
        })

        for (const resultElement of updateResult.result) {
            result.push(resultElement)
        }
    }

    return new StepResponse({
        result: {result},
    })
})