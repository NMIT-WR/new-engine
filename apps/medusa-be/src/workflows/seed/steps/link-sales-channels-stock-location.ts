import {Logger, SalesChannelDTO, StockLocationDTO} from "@medusajs/framework/types"
import {ContainerRegistrationKeys} from "@medusajs/framework/utils"
import {createStep, StepResponse,} from "@medusajs/framework/workflows-sdk"
import {linkSalesChannelsToStockLocationWorkflow} from "@medusajs/medusa/core-flows"

export type LinkSalesChannelsStockLocationStepInput = {
    salesChannels: SalesChannelDTO[]
    stockLocations: StockLocationDTO[]
}

const LinkSalesChannelsStockLocationStepId = 'link-sales-channels-stock-location-seed-step'
export const linkSalesChannelsStockLocationStep = createStep(LinkSalesChannelsStockLocationStepId, async (
    input: LinkSalesChannelsStockLocationStepInput,
    {container}
) => {
    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)

    logger.info("Linking sales channels to stock location...")

    let result: unknown[] = []

    for (const stockLocation of input.stockLocations) {
        const linkResult = await linkSalesChannelsToStockLocationWorkflow(container).run({
            input: {
                id: stockLocation.id,
                add: input.salesChannels.map((i) => i.id),
            },
        })

        result.push(linkResult.result)
    }

    // the workflow result contains nothing ... medusa wtf?

    return new StepResponse({
        result: result,
    })
})