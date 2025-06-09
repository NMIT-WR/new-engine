import {ProductCategoryDTO} from "@medusajs/framework/types"
import {ContainerRegistrationKeys, Modules} from "@medusajs/framework/utils"
import {createStep, StepResponse,} from "@medusajs/framework/workflows-sdk"
import {createProductCategoriesWorkflow, updateProductCategoriesWorkflow} from "@medusajs/medusa/core-flows"

export type CreateProductCategoriesStepInput = {
    name: string,
    isActive: boolean
    parent?: string,
}[]

const CreateProductCategoriesStepId = 'create-product-categories-seed-step'
export const createProductCategoriesStep = createStep(CreateProductCategoriesStepId, async (
    input: CreateProductCategoriesStepInput,
    {container}
) => {
    const productCategoriesCreateResult: ProductCategoryDTO[] = []
    const productCategoriesUpdateResult: ProductCategoryDTO[] = []

    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const productService = container.resolve(Modules.PRODUCT)

    const existingProductCategories = await productService.listProductCategories({
        name: input.map(i => i.name),
        include_ancestors_tree: true,
    }, {
        select: ["id", "name", "is_active", "parent_category_id"],
    })

    const missingProductCategories = input.filter(i => !existingProductCategories.find(j => j.name === i.name))
    const updateProductCategories = existingProductCategories.map(existingProductCategory => {
        const inputProductCategories = input.find(productCategory => productCategory.name === existingProductCategory.name)
        if (inputProductCategories) {
            return {
                id: existingProductCategory.id,
                is_active: inputProductCategories.isActive
            }
        }
        return null
    }).filter(category => category !== null)


    if (missingProductCategories.length !== 0) {
        logger.info("Creating product categories...")

        const {result: categoryResult} = await createProductCategoriesWorkflow(
            container
        ).run({
            input: {
                product_categories: input.map((category) => ({
                    name: category.name,
                    is_active: category.isActive,
                }))
            }
        })

        for (const elem of categoryResult) {
            productCategoriesCreateResult.push(elem)
        }
    }


    if (updateProductCategories.length !== 0) {
        logger.info("Updating product categories...")

        for (const updateProductCategory of updateProductCategories) {
            const {result: categoryResult} = await updateProductCategoriesWorkflow(
                container
            ).run({
                input: {
                    selector: {
                        id: updateProductCategory.id,
                    },
                    update: {
                        is_active: updateProductCategory.is_active,
                    }
                }
            })
            productCategoriesUpdateResult.push(categoryResult[0] as ProductCategoryDTO)
        }
    }

    return new StepResponse({
        result: {
            createProductCategoriesResult: productCategoriesCreateResult,
            updateProductCategoriesResult: productCategoriesUpdateResult,
        },
    })
})