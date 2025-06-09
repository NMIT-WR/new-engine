import {ProductDTO} from "@medusajs/framework/types";
import {ContainerRegistrationKeys, Modules, ProductStatus} from "@medusajs/framework/utils"
import {createStep, StepResponse,} from "@medusajs/framework/workflows-sdk"
import {createProductsWorkflow, updateProductsWorkflow} from "@medusajs/medusa/core-flows";

export type CreateProductsStepInput = {
    title: string
    categories: string[]
    description: string
    handle: string
    weight: number
    status?: ProductStatus
    shippingProfileName: string
    images: {
        url: string
    }[]
    options: {
        title: string
        values: string[]
    }[]
    variants: {
        title: string
        sku: string
        options: {
            [key: string]: string
        }
        prices: {
            amount: number
            currencyCode: string
        }[]
    }[]
    salesChannelNames: string[]
}[]

const CreateProductsStepId = 'create-products-seed-step'
export const createProductsStep = createStep(CreateProductsStepId, async (
    input: CreateProductsStepInput,
    {container}
) => {
    const result: ProductDTO[] = []
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const productService = container.resolve(Modules.PRODUCT)
    const fulfillmentService = container.resolve(Modules.FULFILLMENT)
    const salesChannelService = container.resolve(Modules.SALES_CHANNEL)

    const existingCategories = await productService.listProductCategories({
        name: input.reduce((acc: string[], i) => {
            i.categories.map(cat => acc.push(cat))
            return acc
        }, [])
    })

    const existingSalesChannels = await salesChannelService.listSalesChannels({
        name: input.reduce((acc: string[], i) => {
            return [...new Set([...acc, ...i.salesChannelNames])]
        }, [])
    })

    const existingShippingProfiles = await fulfillmentService.listShippingProfiles({
        name: input.map((i) => i.shippingProfileName)
    })

    const existingProducts = await productService.listProducts({
        handle: input.map((i) => i.handle)
    }, {
        relations: ['variants']
    })

    const missingProducts = input.filter(i => !existingProducts.find(j => j.handle === i.handle))
    const updateProducts = existingProducts.map(existingProduct => {
        const inputProduct = input.find(product => product.handle === existingProduct.handle)

        if (!inputProduct) {
            return null
        }

        return {
            id: existingProduct.id,
            title: inputProduct.title,
            categories:
                existingCategories.filter((cat) => {
                    if (cat.name === inputProduct.categories.find(t => t === cat.name)) {
                        return cat
                    }
                    throw new Error(`Category ${cat.name} not found`)
                }),
            description: inputProduct.description,
            weight: inputProduct.weight,
            status: inputProduct.status || ProductStatus.PUBLISHED,
            shipping_profile_id: existingShippingProfiles.map(sp => {
                if (sp.name === inputProduct.shippingProfileName) {
                    return sp.id
                }
                throw new Error(`Shipping profile ${sp.name} not found`)
            })[0],
            images: inputProduct.images,
            options: inputProduct.options,
            variants: inputProduct.variants.map(inputVariant => {
                const existingVariant = existingProduct.variants.find(v => v.sku === inputVariant.sku)
                return existingVariant ? {
                        title: inputVariant.title,
                        sku: inputVariant.sku,
                        options: inputVariant.options,
                        prices: inputVariant.prices.map(p => ({
                            amount: p.amount,
                            currency_code: p.currencyCode
                    })), id: existingVariant.id} : inputVariant
            }),
            sales_channels: existingSalesChannels.filter((sc) => {
                if (sc.name === inputProduct.salesChannelNames.find(t => t === sc.name)) {
                    return sc
                }
                throw new Error(`Sales channel '${sc.name}' not found`)
            })
        }

    }).filter(product => product !== null)

    if (missingProducts.length !== 0) {
        logger.info("Creating missing products...")

        const products = missingProducts.map(p => ({
            title: p.title,
            category_ids:
                existingCategories.filter((cat) => {
                    if (cat.name === p.categories.find(t => t === cat.name)) {
                        return cat
                    }
                    throw new Error(`Category '${cat.name}' not found`)
                }).map(cat => cat.id),
            description: p.description,
            handle: p.handle,
            weight: p.weight,
            status: p.status || ProductStatus.PUBLISHED,
            shipping_profile_id: existingShippingProfiles.map(sp => {
                if (sp.name === p.shippingProfileName) {
                    return sp.id
                }
                throw new Error(`Shipping profile '${sp.name}' not found`)
            })[0],
            images: p.images,
            options: p.options,
            variants: p.variants.map(v => ({
                title: v.title,
                sku: v.sku,
                options: v.options,
                prices: v.prices.map(p => ({
                    amount: p.amount,
                    currency_code: p.currencyCode
                }))
            })),
            sales_channels: existingSalesChannels.filter((sc) => {
                if (sc.name === p.salesChannelNames.find(t => t === sc.name)) {
                    return sc
                }
                throw new Error(`Sales channel '${sc.name}' not found`)
            })
        }))

        const createResult = await createProductsWorkflow(container).run({
            input: {
                products
            }
        })

        for (const resultElement of createResult.result) {
            result.push(resultElement)
        }
    }

    if (updateProducts.length !== 0) {
        logger.info("Updating existing products...")

        for (const updateProduct of updateProducts) {
            const updateResult = await updateProductsWorkflow(container).run({
                input: {
                    selector: {
                        id: updateProduct.id,
                    },
                    update: updateProduct
                }
            })

            for (const resultElement of updateResult.result) {
                result.push(resultElement)
            }
        }
    }

    return new StepResponse({
        result,
    })
})