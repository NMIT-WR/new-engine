import {ProductDTO} from "@medusajs/framework/types";
import {ContainerRegistrationKeys, Modules, ProductStatus} from "@medusajs/framework/utils"
import {createStep, StepResponse,} from "@medusajs/framework/workflows-sdk"
import {createProductsWorkflow, updateProductsWorkflow} from "@medusajs/medusa/core-flows";
import {PRODUCER_MODULE} from "../../../modules/producer";

type ProductInput = {
    title: string
    categories: {
        name?: string
        handle: string
    }[]
    description: string
    handle: string
    weight?: number
    status?: ProductStatus
    shippingProfileName: string
    thumbnail?: string
    images: {
        url: string
    }[]
    options?: {
        title: string
        values: string[]
    }[],
    producer?: {
        title: string,
        attributes?: {
            name: string,
            value: string
        }[]
    }
    variants?: {
        title: string
        sku: string
        ean?: string
        material?: string
        options?: {
            [key: string]: string
        }
        metadata?: {
            images?: {
                url: string
            }[]
            thumbnail?: string
            attributes?: {
                name: string
                value?: string
            }[]
            user_code?: string
        }
        quantities?: {
            quantity?: number
            supplier_quantity?: number
        }
        prices?: {
            amount: number
            currency_code: string
        }[]
    }[]
    salesChannelNames: string[]
}

export type CreateProductsStepInput = ProductInput[]

const CreateProductsStepId = 'create-products-seed-step'

function processProductProducer(inputProduct: ProductInput, producers: Map<string, { attributes: Map<string, string>; products: string[] }>) {
    if (inputProduct.producer?.title) {
        if (!producers.has(inputProduct.producer.title)) {
            producers.set(inputProduct.producer.title, {products: [], attributes: new Map()})
        }

        const producer = producers.get(inputProduct.producer.title)

        if (!producer) {
            throw new Error(`Producer "${inputProduct.producer.title}" not found`)
        }

        producer.products.push(inputProduct.handle)

        for (const attribute of inputProduct.producer.attributes ?? []) {
            if (!producer.attributes.has(attribute.name)) {
                producer.attributes.set(attribute.name, attribute.value)
            }
        }
    }
}

export const createProductsStep = createStep(CreateProductsStepId, async (
    input: CreateProductsStepInput,
    {container}
) => {
    const result: ProductDTO[] = []
    const link = container.resolve(ContainerRegistrationKeys.LINK)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const productService = container.resolve(Modules.PRODUCT)
    const fulfillmentService = container.resolve(Modules.FULFILLMENT)
    const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
    const producerService = container.resolve(PRODUCER_MODULE)

    const producers = new Map<string, {attributes: Map<string, string>, products: string[]}>()

    const existingCategories = await productService.listProductCategories({
        handle: input.reduce((acc: string[], i) => {
            i.categories?.map(cat => acc.push(cat.handle))
            return acc
        }, [])
    }, {
        select: ['id', 'handle']
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
        relations: ['variants', 'variants.options'],
        select: ['variants.*', 'variants.options.*', '*']

    })

    const missingProducts = input.filter(i => !existingProducts.find(j => j.handle === i.handle))
    const updateProducts = existingProducts.map(existingProduct => {
        const inputProduct = input.find(product => product.handle === existingProduct.handle)

        if (!inputProduct) {
            return null
        }

        processProductProducer(inputProduct, producers);

        return {
            id: existingProduct.id,
            title: inputProduct.title,
            categories: inputProduct.categories?.map((inputCat) => {
                const existingCategory = existingCategories.find((cat) => cat.handle === inputCat.handle)
                if (!existingCategory) {
                    throw new Error(`Category "${inputCat.handle}" not found`)
                }
                return existingCategory
            }),
            description: inputProduct.description,
            weight: inputProduct.weight,
            status: inputProduct.status || ProductStatus.PUBLISHED,
            shipping_profile_id: existingShippingProfiles.map(sp => {
                if (sp.name === inputProduct.shippingProfileName) {
                    return sp.id
                }
                throw new Error(`Shipping profile "${sp.name}" not found`)
            })[0],
            thumbnail: inputProduct.thumbnail || existingProduct.thumbnail,
            images: inputProduct.images ?? [],
            options: inputProduct.options,
            variants: inputProduct.variants?.map(inputVariant => {
                const existingVariant = existingProduct.variants.find(v => v.sku === inputVariant.sku)
                return existingVariant ? {
                    title: inputVariant.title,
                    sku: inputVariant.sku,
                    ean: inputVariant.ean,
                    material: inputVariant.material,
                    options: inputVariant.options,
                    prices: inputVariant.prices?.map(p => ({
                        amount: p.amount,
                        currency_code: p.currency_code,
                    })),
                    metadata: inputVariant.metadata,
                    id: existingVariant.id
                } : inputVariant
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

        const createProducts = missingProducts.map(p => {

            processProductProducer(p, producers);

            return {
                title: p.title,
                category_ids:
                    p.categories?.map((inputCat) => {
                        const existingCategory = existingCategories.find((cat) => cat.handle === inputCat.handle)
                        if (!existingCategory) {
                            throw new Error(`Category "${inputCat.handle}" not found`)
                        }
                        return existingCategory.id
                    }),
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
                thumbnail: p.thumbnail,
                images: p.images ?? [],
                options: p.options,
                variants: p.variants?.map(v => ({
                    title: v.title,
                    sku: v.sku,
                    ean: v.ean,
                    material: v.material,
                    options: v.options,
                    prices: v.prices?.map(p => ({
                        amount: p.amount,
                        currency_code: p.currency_code,
                    })),
                    metadata: v.metadata,
                })),
                sales_channels: existingSalesChannels.filter((sc) => {
                    if (sc.name === p.salesChannelNames.find(t => t === sc.name)) {
                        return sc
                    }
                    throw new Error(`Sales channel '${sc.name}' not found`)
                })
            }
        })

        const createResult = await createProductsWorkflow(container).run({
            input: {
                products: createProducts
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

    // add producer info
    for (const [key, value] of producers.entries()) {
        const attributes = [...value.attributes.entries()].map(([name, value]) => ({
            name,
            value,
        }))

        const producer = await producerService.upsertProducer({
            name: key,
            attributes
        })

        const products = await productService.listProducts({handle: {$in: value.products}})

        const links = products.map(p => ({
            [Modules.PRODUCT]: {
                product_id: p.id,
            },
            [PRODUCER_MODULE]: {
                producer_id: producer.id,
            },
        }))

        await link.create(links)
    }

    return new StepResponse({
        result,
    })
})