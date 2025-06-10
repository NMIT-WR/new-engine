import {createStep, createWorkflow, StepResponse, transform, WorkflowResponse,} from "@medusajs/framework/workflows-sdk"
import {DATABASE_MODULE} from "../../../modules/database";
import {sql} from "drizzle-orm";
import * as Steps from "../steps";

const seedN1WorkflowId = 'seed-n1-workflow'

export type seedN1WorkflowInput = {}

type CategoryRaw = {
    title: string,
    description?: string,
    handle: string,
    isActive: boolean,
    parentHandle?: string
}

// type ProductRaw = {
//     title: string,
//     description: string,
//     handle: string,
// }

const seedN1Workflow = createWorkflow(
    seedN1WorkflowId,
    (input: seedN1WorkflowInput) => {

        const categoriesStep = createStep(
            "seed-n1-workflow-step-1-categories",
            async (_, {container}) => {
                const dbService = container.resolve(DATABASE_MODULE)
                const result = await dbService.sqlRaw<CategoryRaw>(
                    sql`select cl.title,
                               cl.description,
                               cl.rewrite_title as handle,
                               c.visible as isActive,
                               cparentl.rewrite_title as parentHandle
                        from category c
                                 join category_lang cl on cl.id_category = c.id
                                 join lang l on l.id = cl.id_lang
                                 left join category cparent on cparent.id = c.id_parent
                                 left join category_lang cparentl
                                           on cparentl.id_lang in
                                              (select ll.id from lang ll where ll.abbreviation = 'cz') and
                                              cparentl.id_category = cparent.id
                        where l.abbreviation = 'cz'
                          and l.active = 1
                    `)

                return new StepResponse({
                    result
                })
            }
        )
        const {result: categoriesStepResult} = categoriesStep()

        const productCategories: Steps.CreateProductCategoriesStepInput = transform({
            categoriesStepResult
        }, (data) => {
            return data.categoriesStepResult.map(i => ({
                name: i.title,
                description: i.description,
                handle: i.handle,
                isActive: Boolean(Number(i.isActive)),
                parentHandle: i.parentHandle,
            }))
        })

        // Steps.createProductCategoriesStep(productCategories)

        // const productsStep = createStep(
        //     "seed-n1-workflow-step-1-products",
        //     async (_, {container}) => {
        //         const dbService = container.resolve(DATABASE_MODULE)
        //         const result = await dbService.sqlRaw<ProductRaw>(
        //             sql`
        //                 select pl.title, pl.rewrite_title as handle, pl.description
        //                 from product p
        //                          join product_lang pl on pl.id_product = p.id and pl.id_lang in (select id from lang where abbreviation = 'cz')
        //                     and p.base_product = 1
        //                     and p.deleted = 0
        //                     and p.id_product_group is not null
        //             `)
        //
        //         return new StepResponse({
        //             result
        //         })
        //     }
        // )
        // const {result: productsStepResult} = productsStep()
        //
        // const products: Steps.CreateProductsStepInput = transform({
        //     productsStepResult
        // }, (data) => {
        //     return data.productsStepResult.map(i => ({
        //         title: i.title,
        //         categories: [],
        //         description: i.description,
        //         handle: i.handle,
        //         weight: 1,
        //         shippingProfileName: 'string',
        //         images: [],
        //         options: [],
        //         variants: [],
        //         salesChannelNames: [],
        //     }))
        // })
        //
        // Steps.createProductsStep(products)


        return new WorkflowResponse({
            in: 'N1 seed done'
        })
    }
)

export default seedN1Workflow