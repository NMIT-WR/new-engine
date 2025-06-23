import {TaxRegionDTO} from "@medusajs/framework/types"
import {ContainerRegistrationKeys, Modules} from "@medusajs/framework/utils"
import {createStep, StepResponse,} from "@medusajs/framework/workflows-sdk"
import {createTaxRegionsWorkflow, updateTaxRegionsWorkflow} from "@medusajs/medusa/core-flows"

export type CreateTaxRegionsStepInput = {
    countries: string[]
    taxProviderId?: string
}

const CreateTaxRegionsStepId = 'create-tax-regions-seed-step'
export const createTaxRegionsStep = createStep(CreateTaxRegionsStepId, async (
    input: CreateTaxRegionsStepInput,
    {container}
) => {
    const result: TaxRegionDTO[] = []

    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const taxService = container.resolve(Modules.TAX)

    const existingTaxRegions = await taxService.listTaxRegions({
        country_code: {$in: input.countries},
    })

    const missingTaxRegions = input.countries.filter(i => !existingTaxRegions.find(j => j.country_code === i))
    const updateTaxRegions = existingTaxRegions.filter(i => input.countries.find(j => j === i.country_code))

    if (missingTaxRegions.length !== 0) {
        logger.info("Creating missing tax regions...")

        const {result: createTaxRegionsResult} = await createTaxRegionsWorkflow(container).run({
            input: missingTaxRegions.map((country_code) => ({
                country_code,
                provider_id: input.taxProviderId || "tp_system"
            })),
        })

        for (const taxRegionsResultElement of createTaxRegionsResult) {
            result.push(taxRegionsResultElement)
        }
    }

    if (updateTaxRegions.length !== 0) {
        logger.info("Updating existing tax regions...")

        const toUpdate = updateTaxRegions.map(i => ({
            id: i.id,
            tax_provider: input.taxProviderId || "tp_system",
        }))

        const {result: updateTaxRegionResult} = await updateTaxRegionsWorkflow(container).run({
            input: toUpdate,
        })

        for (const updateTaxRegionResultElement of updateTaxRegionResult) {
            result.push(updateTaxRegionResultElement)
        }
    }

    return new StepResponse({
        result,
    })
})
