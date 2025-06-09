import {createWorkflow, transform, WorkflowResponse,} from "@medusajs/framework/workflows-sdk"
import * as Steps from "../steps"
import { ApiKeyDTO } from "@medusajs/framework/types"

const SeedDatabaseWorkflowId = 'seed-database-workflow'

export type SeedDatabaseWorkflowInput = {
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
    productCategories: Steps.CreateProductCategoriesStepInput,
    products: Steps.CreateProductsStepInput,
}

const seedDatabaseWorkflow = createWorkflow(
    SeedDatabaseWorkflowId,
    (input: SeedDatabaseWorkflowInput) => {
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
        const updateStoreCurrenciesResult = Steps.updateStoreCurrenciesStep(updateStoreCurrenciesStepInput)

        // create regions
        const createRegionsResult = Steps.createRegionsStep(input.regions)

        // create tax regions
        const createTaxRegionsResult = Steps.createTaxRegionsStep(input.taxRegions)

        // create stock locations
        const createStockLocationResult = Steps.createStockLocationSeedStep(input.stockLocations)

        // link stock locations to fulfillment provider
        const linkStockLocationsFulfillmentProviderInput: Steps.LinkStockLocationFulfillmentProviderStepInput = transform({
            createStockLocationResult, input
        }, (data) => ({
            stockLocations: data.createStockLocationResult.result,
            fulfillmentProviderId: data.input.fulfillmentProviderId
        }))

        const linkStockLocationsFulfillmentProviderResult = Steps.linkStockLocationFulfillmentProviderSeedStep(linkStockLocationsFulfillmentProviderInput)

        // create a shipping profile
        const createDefaultShippingProfileResult = Steps.createDefaultShippingProfileStep(input.defaultShippingProfile)

        // create fulfillment sets
        const createFulfillmentSetsResult = Steps.createFulfillmentSetStep(input.fulfillmentSets)


        // link stock locations to fulfillment set
        const linkStockLocationsFulfillmentSetInput: Steps.LinkStockLocationFulfillmentSetStepInput = transform({
            createStockLocationResult, input, createFulfillmentSetsResult
        }, (data) => ({
                stockLocations: data.createStockLocationResult.result,
                fulfillmentSet: data.createFulfillmentSetsResult.result[0]
            }
        ))

        const linkStockLocationsFulfillmentSetResult = Steps.linkStockLocationFulfillmentSetStep(linkStockLocationsFulfillmentSetInput)


        // create shipping options

        const createShippingOptionsInput: Steps.CreateShippingOptionsStepInput = transform({
                input, createFulfillmentSetsResult, createDefaultShippingProfileResult, createRegionsResult
            }, (data) =>
                data.input.shippingOptions.map(option => ({
                    name: option.name,
                    providerId: data.input.fulfillmentProviderId || 'manual_manual',
                    serviceZoneId: data.createFulfillmentSetsResult.result[0].service_zones[0].id,
                    shippingProfileId: data.createDefaultShippingProfileResult.result[0].id,
                    regions: data.createRegionsResult.result.map(region => ({
                        ...region,
                        amount: 10 as number
                    })),
                    type: option.type,
                    prices: option.prices,
                    rules: option.rules,
                }))
        )

        const createShippingOptionsResult = Steps.createShippingOptionsStep(createShippingOptionsInput)


        // link sales channels to stock location
        const linkSalesChannelsToStockLocationInput: Steps.LinkSalesChannelsStockLocationStepInput = transform({
            createStockLocationResult, input, salesChannelsResult
        }, (data) => ({
            stockLocations: data.createStockLocationResult.result,
            salesChannels: data.salesChannelsResult.result,
        }))

        const linkSalesChannelsToStockLocationResult = Steps.linkSalesChannelsStockLocationStep(linkSalesChannelsToStockLocationInput)

        // create publishable key

        const createPublishableKeyResult = Steps.createPublishableKeyStep(input.publishableKey)

        // link publishable key to salesChannels
        const linkSalesChannelsApiKeyStepInput: Steps.LinkSalesChannelsApiKeyStepInput = transform({
            createPublishableKeyResult, salesChannelsResult
        }, (data) => ({
            salesChannels: data.salesChannelsResult.result,
            publishableApiKey: data.createPublishableKeyResult.result[0] as ApiKeyDTO,
        }))

        const linkSalesChannelsApiKeyStepInputResult = Steps.linkSalesChannelsApiKeyStep(linkSalesChannelsApiKeyStepInput)

        // create product categories

        const createProductCategoriesResult = Steps.createProductCategoriesStep(input.productCategories)

        // create products

        const createProductsResult = Steps.createProductsStep(input.products)

        // create inventory levels


        // link stock locations to fulfillment provider
        const createInventoryLevelsInput: Steps.CreateInventoryLevelsStepInput = transform({
            createStockLocationResult
        }, (data) => ({
            stockLocations: data.createStockLocationResult.result,
        }))

        const createInventoryLevelsResult = Steps.createInventoryLevelsStep(createInventoryLevelsInput)

        return new WorkflowResponse({
            salesChannelsResult,
            updateStoreCurrenciesResult,
            createRegionsResult,
            createTaxRegionsResult,
            createStockLocationResult,
            linkStockLocationsFulfillmentProviderResult,
            createDefaultShippingProfileResult,
            createFulfillmentSetsResult,
            linkStockLocationsFulfillmentSetResult,
            createShippingOptionsResult,
            linkSalesChannelsToStockLocationResult,
            createPublishableKeyResult,
            linkSalesChannelsApiKeyStepInputResult,
            createProductCategoriesResult,
            createProductsResult,
            createInventoryLevelsResult,
        })
    }
)

export default seedDatabaseWorkflow