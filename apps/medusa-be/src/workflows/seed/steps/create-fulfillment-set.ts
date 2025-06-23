import {CreateFulfillmentSetDTO, FulfillmentSetDTO} from "@medusajs/framework/types"
import {ContainerRegistrationKeys, Modules} from "@medusajs/framework/utils"
import {createStep, StepResponse,} from "@medusajs/framework/workflows-sdk"

export type CreateFulfillmentSetStepInput = {
    name: string,
    type: string,
    serviceZones: {
        name: string,
        geoZones: {
            countryCode: string,
        }[]
    }[]
}

const CreateFulfillmentSetStepId = 'create-fulfillment-set-seed-step'
export const createFulfillmentSetStep = createStep(CreateFulfillmentSetStepId, async (
    input: CreateFulfillmentSetStepInput,
    {container}
) => {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

    const existingFulfillmentSets = await fulfillmentModuleService.listFulfillmentSets({
        name: input.name
    })

    const createAndUpdateData: CreateFulfillmentSetDTO = {
        name: input.name,
        type: input.type,
        service_zones: input.serviceZones.map(i => ({
            name: i.name,
            geo_zones: i.geoZones.map(j => ({
                country_code: j.countryCode,
                type: "country",
            })),
        })),
    }

    const result: FulfillmentSetDTO[] = []
    if (existingFulfillmentSets.length === 0) {
        logger.info("Creating fulfillment sets...")

        const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets(createAndUpdateData)
        result.push(fulfillmentSet)
    } else {
        logger.info("Updating existing fulfillment sets...")

        for (const existingFulfillmentSet of existingFulfillmentSets) {
            const updateResult = await fulfillmentModuleService.updateFulfillmentSets({
                id: existingFulfillmentSet.id,
                ...createAndUpdateData
            })
            result.push(updateResult)
        }
    }

    return new StepResponse({
        result: result,
    })
})