import {ContainerRegistrationKeys, Modules} from "@medusajs/framework/utils"
import {createStep, StepResponse,} from "@medusajs/framework/workflows-sdk"
import {StockLocationDTO} from "@medusajs/framework/types"

export type LinkStockLocationFulfillmentProviderStepInput = {
    stockLocations: StockLocationDTO[],
    fulfillmentProviderId?: string | string[],
}

const LinkStockLocationFulfillmentProviderStepId = 'link-stock-location-fulfillment-provider-seed-step'
export const linkStockLocationFulfillmentProviderSeedStep = createStep(LinkStockLocationFulfillmentProviderStepId, async (
    input: LinkStockLocationFulfillmentProviderStepInput,
    {container}
) => {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const link = container.resolve(ContainerRegistrationKeys.LINK)

    logger.info("Linking stock location to fulfillment provider...")

    let result: unknown[] = []

    const providerIds = Array.isArray(input.fulfillmentProviderId)
        ? input.fulfillmentProviderId
        : input.fulfillmentProviderId
            ? [input.fulfillmentProviderId]
            : ["manual_manual"]

    for (const stockLocation of input.stockLocations) {
        for (const providerId of providerIds) {
            const linkResult = await link.create({
                [Modules.STOCK_LOCATION]: {
                    stock_location_id: stockLocation.id,
                },
                [Modules.FULFILLMENT]: {
                    fulfillment_provider_id: providerId,
                },
            })

            result.push(linkResult)
        }
    }

    return new StepResponse({
        result,
    })
})
