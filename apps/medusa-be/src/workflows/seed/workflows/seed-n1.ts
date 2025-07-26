import {createWorkflow, transform, WorkflowResponse} from "@medusajs/framework/workflows-sdk"
import * as Steps from "../steps";
import {ApiKeyDTO, FulfillmentSetDTO} from "@medusajs/framework/types";
import seedCategoriesWorkflow, {CategoryRaw} from "./seed-categories";
import {toCreateProductsStepInput} from "../../../utils/products";


const seedN1WorkflowId = 'seed-n1-workflow'
export type SeedN1WorkflowInput = {
    categories: CategoryRaw[]
    products: any[] // TODO: product DB type
    salesChannels: Steps.CreateSalesChannelsStepInput
    currencies: Steps.UpdateStoreCurrenciesStepCurrenciesInput
    regions: Steps.CreateRegionsStepInput
    taxRegions: Steps.CreateTaxRegionsStepInput
    stockLocations: Steps.CreateStockLocationStepInput,
    fulfillmentProviderId?: string,
    defaultShippingProfile: Steps.CreateDefaultShippingProfileStepInput,
    fulfillmentSets: Steps.CreateFulfillmentSetStepInput,
    shippingOptions: Steps.CreateShippingOptionsStepSeedInput,
    publishableKey: Steps.CreatePublishableKeyStepInput,
}

const seedN1Workflow = createWorkflow(
    seedN1WorkflowId,
    (input: SeedN1WorkflowInput) => {
        // create sales channels
        const salesChannelsResult = Steps.createSalesChannelsStep(input.salesChannels)

        // update store currencies
        const updateStoreCurrenciesStepInput = transform({
            input, salesChannelsResult
        }, (data) => {

            const defaultSalesChannel = data.salesChannelsResult.result.find(i => i.isDefault)
            if (!defaultSalesChannel) {
                throw new Error("No default sales channel found")
            }
            return {
                currencies: data.input.currencies,
                defaultSalesChannelId: defaultSalesChannel.id,
            }
        })
        Steps.updateStoreCurrenciesStep(updateStoreCurrenciesStepInput)

        // create regions
        const createRegionsResult = Steps.createRegionsStep(input.regions)

        // create tax regions
        Steps.createTaxRegionsStep(input.taxRegions)

        // create stock locations
        const createStockLocationResult = Steps.createStockLocationSeedStep(input.stockLocations)

        // link stock locations to fulfillment provider
        const linkStockLocationsFulfillmentProviderInput: Steps.LinkStockLocationFulfillmentProviderStepInput = transform({
            createStockLocationResult, input
        }, (data) => ({
            stockLocations: data.createStockLocationResult.result,
            fulfillmentProviderId: data.input.fulfillmentProviderId
        }))

        Steps.linkStockLocationFulfillmentProviderSeedStep(linkStockLocationsFulfillmentProviderInput)

        // create a shipping profile
        const createDefaultShippingProfileResult = Steps.createDefaultShippingProfileStep(input.defaultShippingProfile)

        // create fulfillment sets
        const createFulfillmentSetsResult = Steps.createFulfillmentSetStep(input.fulfillmentSets)


        // link stock locations to fulfillment set
        const linkStockLocationsFulfillmentSetInput: Steps.LinkStockLocationFulfillmentSetStepInput = transform({
            createStockLocationResult, input, createFulfillmentSetsResult
        }, (data) => ({
                stockLocations: data.createStockLocationResult.result,
                fulfillmentSet: data.createFulfillmentSetsResult.result[0] as FulfillmentSetDTO
            }
        ))

        Steps.linkStockLocationFulfillmentSetStep(linkStockLocationsFulfillmentSetInput)


        // create shipping options

        const createShippingOptionsInput: Steps.CreateShippingOptionsStepInput = transform({
                input, createFulfillmentSetsResult, createDefaultShippingProfileResult, createRegionsResult
            }, (data) =>
                data.input.shippingOptions.map(option => ({
                    name: option.name,
                    providerId: data.input.fulfillmentProviderId || 'manual_manual',
                    serviceZoneId: data.createFulfillmentSetsResult.result[0]?.service_zones[0]?.id as string,
                    shippingProfileId: data.createDefaultShippingProfileResult.result[0]?.id as string,
                    regions: data.createRegionsResult.result.map(region => ({
                        ...region,
                        amount: 10 as number
                    })),
                    type: option.type,
                    prices: option.prices,
                    rules: option.rules,
                }))
        )

        Steps.createShippingOptionsStep(createShippingOptionsInput)


        // link sales channels to stock location
        const linkSalesChannelsToStockLocationInput: Steps.LinkSalesChannelsStockLocationStepInput = transform({
            createStockLocationResult, input, salesChannelsResult
        }, (data) => ({
            stockLocations: data.createStockLocationResult.result,
            salesChannels: data.salesChannelsResult.result,
        }))

        Steps.linkSalesChannelsStockLocationStep(linkSalesChannelsToStockLocationInput)

        // create publishable key

        const createPublishableKeyResult = Steps.createPublishableKeyStep(input.publishableKey)

        // link publishable key to salesChannels
        const linkSalesChannelsApiKeyStepInput: Steps.LinkSalesChannelsApiKeyStepInput = transform({
            createPublishableKeyResult, salesChannelsResult
        }, (data) => ({
            salesChannels: data.salesChannelsResult.result,
            publishableApiKey: data.createPublishableKeyResult.result[0] as ApiKeyDTO,
        }))

        Steps.linkSalesChannelsApiKeyStep(linkSalesChannelsApiKeyStepInput)

        // create categories
        seedCategoriesWorkflow.runAsStep({
            input: input.categories,
        })

        // create products
        const createProductsStepInput: Steps.CreateProductsStepInput = transform({
            input
        }, (data) => {
            return toCreateProductsStepInput(data.input.products)
        })

        Steps.createProductsStep(createProductsStepInput)

        // create inventory levels
        const createInventoryLevelsInput: Steps.CreateInventoryLevelsStepInput = transform({
            createStockLocationResult, createProductsStepInput
        }, (data) => {

            const inventoryItems: Steps.CreateInventoryLevelsStepInput["inventoryItems"] = [];
            data.createProductsStepInput.map(
                (p) => {
                    p.variants?.map(
                        v => {
                            if (v.quantities?.quantity !== undefined) {
                                inventoryItems.push({
                                    sku: v.sku,
                                    quantity: v.quantities?.quantity,
                                })
                            }
                        }
                    )
                })

            return {
                stockLocations: data.createStockLocationResult.result,
                inventoryItems: inventoryItems ?? [],
            }
        })

        Steps.createInventoryLevelsStep(createInventoryLevelsInput)


        return new WorkflowResponse({
            publishableKey: createPublishableKeyResult.result,
            result: 'N1 seed done'
        })
    }
)

export default seedN1Workflow