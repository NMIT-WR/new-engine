import {RuleOperatorType, WorkflowTypes} from "@medusajs/framework/types"
import {ContainerRegistrationKeys} from "@medusajs/framework/utils"
import {createStep, StepResponse,} from "@medusajs/framework/workflows-sdk"
import {createShippingOptionsWorkflow} from "@medusajs/medusa/core-flows"

export type CreateShippingOptionsStepInput = {
    name: string
    providerId?: string
    serviceZoneId: string
    shippingProfileId: string
    regions: Array<
        WorkflowTypes.RegionWorkflow.CreateRegionsWorkflowOutput[0] & {
        amount: number
    }>
    type: {
        label: string
        description: string
        code: string
    }
    data?: Record<string, unknown>
    prices: {
        currencyCode?: string
        amount: number
    }[]
    rules: {
        attribute: string
        value: string
        operator: RuleOperatorType
    }[]
}[]

export type CreateShippingOptionsStepSeedInput = Array<
    Omit<CreateShippingOptionsStepInput[0], 'serviceZoneId' | 'shippingProfileId' | 'regions'>
>

const CreateShippingOptionsStepId = 'create-shipping-options-seed-step'
export const createShippingOptionsStep = createStep(CreateShippingOptionsStepId, async (
    input: CreateShippingOptionsStepInput,
    {container}
) => {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    logger.info("Creating shipping options...")

    const workflowInput = input.map((option) => ({
        name: option.name,
        price_type: "flat" as const,
        provider_id: option.providerId || "manual_manual",
        service_zone_id: option.serviceZoneId,
        shipping_profile_id: option.shippingProfileId,
        type: {
            label: option.type.label,
            description: option.type.description,
            code: option.type.code
        },
        data: option.data ?? {},
        prices: [
            ...option.prices.map((price) => {
                return {
                    currency_code: price.currencyCode as string,
                    amount: price.amount
                }
            }),
            ...option.regions.map((region) => ({
                region_id: region.id as string,
                amount: region.amount,
            }))],

        rules: option.rules.map((rule) => ({
            attribute: rule.attribute,
            operator: rule.operator,
            value: rule.value
        }))
    }))

    const result = await createShippingOptionsWorkflow(container).run({
        input: workflowInput
    })

    return new StepResponse({
        result: {
            result,
        },
    })
})
