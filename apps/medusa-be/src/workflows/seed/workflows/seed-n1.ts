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
        //                 ;
        // WITH product_with_variant_nums AS (
        //     SELECT
        //         p.*,
        //         ROW_NUMBER() over (PARTITION BY p.id_product_group, p.variant_name ORDER BY p.id) AS variant_num
        //     FROM product p
        //     WHERE p.deleted = 0
        //     AND id_product_group IS NOT NULL
        // ), product_with_unique_variant_name AS (
        //     SELECT
        //         *,
        //         CONCAT(TRIM(variant_name), IF(variant_num = 1, '', CONCAT('_',variant_num))) as variant_name_unique
        //     FROM product_with_variant_nums
        //     WHERE base_product = 0
        //     AND variant_name IS NOT NULL
        //     AND TRIM(variant_name) <> ''
        // ), variant_option_agg AS (
        //   SELECT
        //     id_product_group,
        //     JSON_ARRAYAGG(DISTINCT variant_name_unique) AS option_values
        //   FROM product_with_unique_variant_name
        //   GROUP BY id_product_group
        // ), cte_category_product AS (
        //     select p.id, cl.rewrite_title from product p
        //     join category_product cp on p.id = cp.id_product
        //     join category_lang cl on cl.id_category = cp.id_category and cl.id_lang in (select id from lang where abbreviation = 'cz')
        // ), cte_category_product_unique AS (
        //     select
        //         vc.id,
        //   JSON_ARRAYAGG(
        //     JSON_OBJECT(
        //       'handle', vc.rewrite_title
        //     )
        //   ) AS categories
        //     from cte_category_product as vc
        //     group by vc.id
        // ), cte_product_prices AS (
        // SELECT
        //     p.id as productId,
        //             price.value AS value,
        //             COALESCE(price.nodiscount_value, price.value) AS nodiscount_value,
        //             price.value AS normal_value,
        //             vat.rate AS vat_rate,
        //             price_type.id AS id_price_type,
        //             price_type.id_primary_price,
        //             price_type.discount_type,
        //             price_type.system,
        //             price_type.default_discount,
        //             price.valid_from_quantity,
        //             LOWER(c.code) as currency_code,
        //             COALESCE(price_type_lang.title, price_type_lang_alt.title) AS price_type_title
        //         FROM price_type
        //         LEFT JOIN price ON price.id_price_type = price_type.id AND price.id_domain = (select id from domain where id = 1) AND price.id_currency = (select id from currency where code = 'czk')
        //         LEFT JOIN currency c ON c.id = price.id_currency
        //             LEFT JOIN product p on p.id = price.id_product
        //             LEFT JOIN vat ON price.id_vat = vat.id
        //         LEFT JOIN price_type_lang ON price_type.id = price_type_lang.id_price_type AND price_type_lang.id_lang in (select id from lang where abbreviation = 'cz')
        //         LEFT JOIN price_type_lang AS price_type_lang_alt ON price_type_lang.id_lang IS NULL AND price_type_lang_alt.id_price_type = price_type.id AND price_type_lang_alt.id_lang in (select id from lang where abbreviation = 'cz')
        //         WHERE COALESCE(price_type_lang.title, price_type_lang_alt.title) = 'MOC'
        //         and p.deleted = 0
        //         ORDER BY valid_from_quantity DESC, vat.rate DESC, price.value ASC
        // ), cte_product_prices_agg AS (
        //     select
        //         cpp.productId,
        //   JSON_ARRAYAGG(
        //     JSON_OBJECT(
        //       'currency_code', cpp.currency_code,
        //       'amount', cpp.value
        //     )
        //   ) AS prices
        //  from cte_product_prices cpp
        //  group by cpp.productId
        // ), cte_result AS (
        //
        // SELECT
        //   bp.id AS productId,
        //   bp.id_product_group,
        //   pl.title,
        //   pl.rewrite_title AS handle,
        //   pl.description,
        //   JSON_ARRAYAGG(
        //     JSON_OBJECT(
        //       'title', COALESCE(TRIM(v.variant_name_unique), pl.title),
        //       'sku', COALESCE(v_pl.rewrite_title, pl.rewrite_title),
        //       'ean', COALESCE(COALESCE(v.EAN,  v.EAN_original), bp.EAN),
        //       'options', JSON_OBJECT('Variant', TRIM(v.variant_name_unique)),
        //       'prices', COALESCE(cpp.prices, cpbp.prices)
        //     )
        //   ) AS variants,
        //   JSON_ARRAY(
        //     JSON_OBJECT(
        //       'title', 'Variant',
        //       'option_values', voa.option_values
        //     )
        //   ) AS options,
        //     vc.categories
        // FROM product bp
        // JOIN product_lang pl
        //   ON pl.id_product = bp.id
        //   AND pl.id_lang = (SELECT id FROM lang WHERE abbreviation = 'cz' LIMIT 1)
        // LEFT JOIN product_with_unique_variant_name v
        //   ON v.id_product_group = bp.id_product_group
        //   AND v.base_product = 0
        //   AND v.deleted = 0
        // LEFT JOIN product_lang v_pl
        //   ON v_pl.id_product = v.id
        //   AND v_pl.id_lang = pl.id_lang
        // LEFT JOIN variant_option_agg voa
        //   ON voa.id_product_group = bp.id_product_group
        // LEFT JOIN cte_category_product_unique vc ON vc.id = bp.id
        // LEFT JOIN cte_product_prices_agg cpbp ON cpbp.productId = bp.id
        // LEFT JOIN cte_product_prices_agg cpp ON cpp.productId = v.id
        // WHERE
        //   bp.base_product = 1
        //   AND bp.deleted = 0
        //   AND bp.id_product_group IS NOT NULL
        //   AND bp.id_product_group NOT IN (
        //     SELECT id_product_group
        //     FROM product
        //     WHERE id_product_group IN (
        //       SELECT id_product_group
        //       FROM product
        //       WHERE base_product = 1
        //         AND deleted = 0
        //         AND id_product_group IS NOT NULL
        //       GROUP BY id_product_group
        //       HAVING COUNT(*) > 1
        //     )
        //     AND deleted = 0
        //   )
        // GROUP BY bp.id, pl.title, pl.rewrite_title, pl.description, voa.option_values
        // )
        // # select count(*) from cte_result
        // # select * from cte_product_prices_agg
        // select * from cte_result
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

        const productsRaw = [
            {
                "productId": 1,
                "id_product_group": 2001,
                "title": "Dětská Skla - Main Youth Single FOX RACING Skla - Main Youth Single",
                "handle": "detska-skla-main-youth-single-fox-racing-skla-main-youth-single",
                "description": "<p>N&#225;hradn&#237; skla pro d&#283;tsk&#233; br&#253;le Fox Main</p>",
                "variants": [{"title": "One Size", "sku": "detska-skla-main-youth-single-fox-racing-skla-main-youth-single-product-2", "ean": "700285294452", "options": {"Variant": "One Size"}, "prices": [{"currency_code": "czk", "amount": 81.81818}]},{"title": "One Size_2", "sku": "detska-skla-main-youth-single-fox-racing-skla-main-youth-single-product-3", "ean": "700285294469", "options": {"Variant": "One Size_2"}, "prices": [{"currency_code": "czk", "amount": 81.81818}]},{"title": "One Size_3", "sku": "detska-skla-main-youth-single-fox-racing-skla-main-youth-single-product-4", "ean": "700285294476", "options": {"Variant": "One Size_3"}, "prices": [{"currency_code": "czk", "amount": 81.81818}]},{"title": "One Size_4", "sku": "detska-skla-main-youth-single-fox-racing-skla-main-youth-single-product-5", "ean": "700285304939", "options": {"Variant": "One Size_4"}, "prices": [{"currency_code": "czk", "amount": 81.81818}]}],
                "options": [{"title": "Variant", "option_values": ["One Size","One Size_2","One Size_3","One Size_4"]}],
                "categories": [{"handle": "bryle-category-296"},{"handle": "bryle-category-393"}]
            },
            {
                "productId": 6,
                "id_product_group": 3001,
                "title": "Pánské brýle FOX RACING Duncan Sport Replacement Lens",
                "handle": "panske-bryle-fox-racing-duncan-sport-replacement-lens",
                "description": "Náhradní sklo pro brýle Duncan sport. Propustnost skel: Titanium clear- 54%, Black fade - 53%, Light grey -39%,Bronze - 22%, Grey-18%, Gold iridium - 12%, Black iridium - 10%.",
                "variants": [{"title": "Pánské brýle FOX RACING Duncan Sport Replacement Lens", "sku": "panske-bryle-fox-racing-duncan-sport-replacement-lens", "ean": "700285387628", "options": {"Variant": null}, "prices": [{"currency_code": "czk", "amount": 652.89256}]}],
                "options": [{"title": "Variant", "option_values": null}],
                "categories": [{"handle": "slunecni-bryle"},{"handle": "slunecni-bryle-category-375"}]
            },
            {
                "productId": 7,
                "id_product_group": 3002,
                "title": "Pánské brýle FOX RACING Duncan Sport Replacement Lens",
                "handle": "panske-bryle-fox-racing-duncan-sport-replacement-lens-product-7",
                "description": "<p>N&#225;hradn&#237; skla pro d&#283;tsk&#233; br&#253;le Fox Main</p>",
                "variants": [{"title": "Pánské brýle FOX RACING Duncan Sport Replacement Lens", "sku": "panske-bryle-fox-racing-duncan-sport-replacement-lens-product-7", "ean": "700285387659", "options": {"Variant": null}, "prices": [{"currency_code": "czk", "amount": 842.97521}]}],
                "options": [{"title": "Variant", "option_values": null}],
                "categories": [{"handle": "slunecni-bryle"},{"handle": "slunecni-bryle-category-375"}]
            }
        ]

        const products = productsRaw.map((i => {
            const options = i.options.map(o => {
                return {
                    title: o.title ?? 'Variant',
                    values: o.option_values ?? ['Default'],
                }
            })

            const variants = i.variants.filter(f => f.sku !== null).map(v => {
                return {
                    title: v.title ?? undefined,
                    sku: v.sku ?? undefined,
                    ean: v.ean ?? undefined,
                    options: v.options?.Variant === null ? {"Variant": 'Default'} : v.options,
                    prices: v.prices
                }
            })

            return {
                title: i.title,
                categories: i.categories,
                description: i.description,
                handle: i.handle,
                weight: 1,
                shippingProfileName: 'Default Shipping Profile',
                images: [],
                options: options.length === 0 ? undefined : options,
                variants: variants.length === 0 ? undefined : variants,
                salesChannelNames: ['Default Sales Channel'],
            }
        }))

        Steps.createProductsStep(products)


        return new WorkflowResponse({
            in: 'N1 seed done'
        })
    }
)

export default seedN1Workflow