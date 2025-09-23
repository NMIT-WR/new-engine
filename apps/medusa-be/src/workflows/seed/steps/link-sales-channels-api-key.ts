import { ApiKeyDTO, Logger, SalesChannelDTO } from "@medusajs/framework/types"
import {ContainerRegistrationKeys} from "@medusajs/framework/utils"
import {createStep, StepResponse,} from "@medusajs/framework/workflows-sdk"
import { linkSalesChannelsToApiKeyWorkflow } from "@medusajs/medusa/core-flows"

export type LinkSalesChannelsApiKeyStepInput = {
    publishableApiKey: ApiKeyDTO
    salesChannels: SalesChannelDTO[]
}

const LinkSalesChannelsApiKeyStepId = 'link-sales-channels-api-key-seed-step'
export const linkSalesChannelsApiKeyStep = createStep(LinkSalesChannelsApiKeyStepId, async (
    input: LinkSalesChannelsApiKeyStepInput,
    {container}
) => {
    const result: unknown[] = []
    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    logger.info("Linking sales channels to API key...")

    for (const salesChannel of input.salesChannels) {
        const {result: linkResult} = await linkSalesChannelsToApiKeyWorkflow(container).run({
            input: {
                id: input.publishableApiKey.id,
                add: [salesChannel.id],
            },
        })

        result.push(linkResult)
    }

    return new StepResponse({
        result,
    })
})