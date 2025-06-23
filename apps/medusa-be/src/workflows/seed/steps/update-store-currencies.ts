import {StoreDTO} from "@medusajs/framework/types"
import {ContainerRegistrationKeys, Modules} from "@medusajs/framework/utils"
import {createStep, StepResponse,} from "@medusajs/framework/workflows-sdk"
import {updateStoresWorkflow} from "@medusajs/medusa/core-flows"

export type UpdateStoreCurrenciesStepCurrenciesInput = {
    code: string,
    default: boolean
}[]

export type UpdateStoreCurrenciesStepInput = {
    currencies: UpdateStoreCurrenciesStepCurrenciesInput,
    defaultSalesChannelId: string
}

const UpdateStoreCurrenciesStepId = 'update-store-currencies-seed-step'
export const updateStoreCurrenciesStep = createStep(UpdateStoreCurrenciesStepId, async (
    input: UpdateStoreCurrenciesStepInput,
    {container}
) => {
    const storeModuleService = container.resolve(Modules.STORE)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    logger.info("Updating store currencies data...")

    // medusa bug? storeModuleService interface is not exported / defined?
    const [store]: StoreDTO[] = await storeModuleService.listStores()

    const currencies = input.currencies.map(i => ({currency_code: i.code, is_default: i.default}))
    const result = await updateStoresWorkflow(container).run({
        input: {
            selector: {id: store?.id},
            update: {
                supported_currencies: currencies,
                default_sales_channel_id: input.defaultSalesChannelId,
            },
        },
    })

    return new StepResponse({
        result: result.result,
    })
})
