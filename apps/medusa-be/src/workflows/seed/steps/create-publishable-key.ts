import {ContainerRegistrationKeys, Modules} from "@medusajs/framework/utils"
import {createStep, StepResponse,} from "@medusajs/framework/workflows-sdk"
import {IApiKeyModuleService, Logger } from "@medusajs/framework/types"
import {createApiKeysWorkflow} from "@medusajs/medusa/core-flows"

export type CreatePublishableKeyStepInput = {
    title: string,
}

const createPublishableKeyStepId = 'create-publishable-key-seed-step'
export const createPublishableKeyStep = createStep(createPublishableKeyStepId, async (
    input: CreatePublishableKeyStepInput,
    {container}
) => {
    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    const apiKeyService = container.resolve<IApiKeyModuleService>(Modules.API_KEY)

    const existingKey = await apiKeyService.listApiKeys({
        title: input.title,
        type: "publishable",
    })

    if (existingKey.length !== 0) {
        return new StepResponse({
            result: existingKey,
        })
    }

    logger.info("Creating or retrieving publishable API key data...")
    const {result: publishableApiKeyResult} = await createApiKeysWorkflow(
        container
    ).run({
        input: {
            api_keys: [
                {
                    title: input.title,
                    type: "publishable",
                    created_by: "",
                },
            ],
        },
    })

    return new StepResponse({
        result: publishableApiKeyResult,
    })
})