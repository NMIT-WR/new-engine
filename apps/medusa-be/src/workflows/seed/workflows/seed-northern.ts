import type { ApiKeyDTO } from "@medusajs/framework/types"
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import * as Steps from "../steps"
import seedCategoriesWorkflow from "./seed-categories"

const seedNorthernWorkflowId = "seed-northern-workflow"

/** Northern product record - transformed from Excel */
type NorthernProductInput = {
  title: string
  handle: string
  description?: string
  thumbnail?: string
  images?: { url: string }[]
  category_ids?: string[]
  options?: { title: string; values: string[] }[]
  variants?: {
    title: string
    sku: string
    ean?: string
    options?: Record<string, string>
    prices?: { amount: number; currency_code: string }[]
    metadata?: any
    quantities?: { quantity: number }
  }[]
  sales_channels?: { id: string }[]
  metadata?: any
}

type CategoryRaw = {
  name: string
  handle: string
  parent_category_id?: string
}

export type SeedNorthernWorkflowInput = {
  categories: CategoryRaw[]
  products: NorthernProductInput[]
  salesChannels: Steps.CreateSalesChannelsStepInput
  currencies: Steps.UpdateStoreCurrenciesStepCurrenciesInput
  regions: Steps.CreateRegionsStepInput
  taxRegions: Steps.CreateTaxRegionsStepInput
  stockLocations: Steps.CreateStockLocationStepInput
  defaultShippingProfile: Steps.CreateDefaultShippingProfileStepInput
  fulfillmentSets: Steps.CreateFulfillmentSetStepInput
  shippingOptions: Steps.CreateShippingOptionsStepSeedInput
  publishableKey: Steps.CreatePublishableKeyStepInput
}

const seedNorthernWorkflow = createWorkflow(
  seedNorthernWorkflowId,
  (input: SeedNorthernWorkflowInput) => {
    // create sales channels
    const salesChannelsResult = Steps.createSalesChannelsStep(
      input.salesChannels
    )

    // update store currencies
    const updateStoreCurrenciesStepInput = transform(
      {
        input,
        salesChannelsResult,
      },
      (data) => {
        const defaultSalesChannel = data.salesChannelsResult.result.find(
          (i) => i.isDefault
        )
        if (!defaultSalesChannel) {
          throw new Error("No default sales channel found")
        }
        return {
          currencies: data.input.currencies,
          defaultSalesChannelId: defaultSalesChannel.id,
        }
      }
    )
    Steps.updateStoreCurrenciesStep(updateStoreCurrenciesStepInput)

    // create regions
    const createRegionsResult = Steps.createRegionsStep(input.regions)

    // create tax regions
    Steps.createTaxRegionsStep(input.taxRegions)

    // create stock locations
    const createStockLocationResult = Steps.createStockLocationSeedStep(
      input.stockLocations
    )

    // link stock locations to fulfillment providers
    const linkStockLocationsFulfillmentProviderInput: Steps.LinkStockLocationFulfillmentProviderStepInput =
      transform(
        {
          createStockLocationResult,
          input,
        },
        (data) => ({
          stockLocations: data.createStockLocationResult.result,
          fulfillmentProviderIds: [
            ...new Set(
              data.input.shippingOptions.map(
                (opt) => opt.providerId || "manual_manual"
              )
            ),
          ],
        })
      )

    Steps.linkStockLocationFulfillmentProviderSeedStep(
      linkStockLocationsFulfillmentProviderInput
    )

    // create a shipping profile
    const createDefaultShippingProfileResult =
      Steps.createDefaultShippingProfileStep(input.defaultShippingProfile)

    // create fulfillment sets
    const createFulfillmentSetsResult = Steps.createFulfillmentSetStep(
      input.fulfillmentSets
    )

    // link stock locations to fulfillment set
    const linkStockLocationsFulfillmentSetInput: Steps.LinkStockLocationFulfillmentSetStepInput =
      transform(
        {
          createStockLocationResult,
          input,
          createFulfillmentSetsResult,
        },
        (data) => {
          const fulfillmentSet = data.createFulfillmentSetsResult.result[0]
          if (!fulfillmentSet) {
            throw new Error(
              "No fulfillment sets created - cannot link stock locations"
            )
          }
          return {
            stockLocations: data.createStockLocationResult.result,
            fulfillmentSet,
          }
        }
      )

    Steps.linkStockLocationFulfillmentSetStep(
      linkStockLocationsFulfillmentSetInput
    )

    // create shipping options
    const createShippingOptionsInput: Steps.CreateShippingOptionsStepInput =
      transform(
        {
          input,
          createFulfillmentSetsResult,
          createDefaultShippingProfileResult,
          createRegionsResult,
        },
        (data) => {
          const serviceZoneId =
            data.createFulfillmentSetsResult.result[0]?.service_zones[0]?.id
          if (!serviceZoneId) {
            throw new Error(
              "No service zone found - cannot create shipping options"
            )
          }

          const shippingProfileId =
            data.createDefaultShippingProfileResult.result[0]?.id
          if (!shippingProfileId) {
            throw new Error(
              "No shipping profile found - cannot create shipping options"
            )
          }

          return data.input.shippingOptions.map((option) => ({
            name: option.name,
            providerId: option.providerId || "manual_manual",
            serviceZoneId,
            shippingProfileId,
            regions: data.createRegionsResult.result.map((region) => ({
              ...region,
              amount:
                option.prices.find(
                  (p) =>
                    p.currencyCode?.toLowerCase() ===
                    region.currency_code?.toLowerCase()
                )?.amount ?? 10,
            })),
            type: option.type,
            prices: option.prices,
            rules: option.rules,
            data: option.data,
          }))
        }
      )

    Steps.createShippingOptionsStep(createShippingOptionsInput)

    // link sales channels to stock location
    const linkSalesChannelsToStockLocationInput: Steps.LinkSalesChannelsStockLocationStepInput =
      transform(
        {
          createStockLocationResult,
          input,
          salesChannelsResult,
        },
        (data) => ({
          stockLocations: data.createStockLocationResult.result,
          salesChannels: data.salesChannelsResult.result,
        })
      )

    Steps.linkSalesChannelsStockLocationStep(
      linkSalesChannelsToStockLocationInput
    )

    // create publishable key
    const createPublishableKeyResult = Steps.createPublishableKeyStep(
      input.publishableKey
    )

    // link publishable key to salesChannels
    const linkSalesChannelsApiKeyStepInput: Steps.LinkSalesChannelsApiKeyStepInput =
      transform(
        {
          createPublishableKeyResult,
          salesChannelsResult,
        },
        (data) => ({
          salesChannels: data.salesChannelsResult.result,
          publishableApiKey: data.createPublishableKeyResult
            .result[0] as ApiKeyDTO,
        })
      )

    Steps.linkSalesChannelsApiKeyStep(linkSalesChannelsApiKeyStepInput)

    // create categories
    seedCategoriesWorkflow.runAsStep({
      input: input.categories,
    })

    // create products
    const createProductsStepInput: Steps.CreateProductsStepInput = transform(
      {
        input,
      },
      (data) => data.input.products
    )

    const createProductsStepResult = Steps.createProductsStep(
      createProductsStepInput
    )

    // create inventory levels
    const createInventoryLevelsInput: Steps.CreateInventoryLevelsStepInput =
      transform(
        {
          createStockLocationResult,
          createProductsStepInput,
        },
        (data) => {
          const inventoryItems: Steps.CreateInventoryLevelsStepInput["inventoryItems"] =
            []
          for (const p of data.createProductsStepInput) {
            for (const v of p.variants ?? []) {
              if (!v.sku || v.quantities?.quantity === undefined) {
                continue
              }
              inventoryItems.push({
                sku: v.sku,
                quantity: v.quantities.quantity,
              })
            }
          }

          return {
            stockLocations: data.createStockLocationResult.result,
            inventoryItems,
          }
        }
      )

    Steps.createInventoryLevelsStep(createInventoryLevelsInput)

    return new WorkflowResponse({
      publishableKey: createPublishableKeyResult.result,
      products: createProductsStepResult.result,
      result: "Northern seed done",
    })
  }
)

export default seedNorthernWorkflow
