import type {MedusaRequest, MedusaResponse,} from "@medusajs/framework/http"
import seedN1Workflow, {SeedN1WorkflowInput} from "../../workflows/seed/workflows/seed-n1";
import {DATABASE_MODULE} from "../../modules/database";
import {sql} from "drizzle-orm";
import DatabaseModuleService from "../../modules/database/service";

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const countries = ["cz", "gb", "de", "dk", "se", "fr", "es", "it", 'pl', 'at', 'sk']
    const input: Omit<SeedN1WorkflowInput, 'categories' | 'products'> = {
        salesChannels: [{
            name: "Default Sales Channel",
            default: true,
        }],
        currencies: [{
            code: "czk",
            default: true,
        }, {
            code: "eur",
            default: false,
        }, {
            code: "usd",
            default: false,
        }],
        regions: [
            {name: "Czechia", currencyCode: "czk", countries: ['cz'], paymentProviders: undefined},
            {
                name: "Europe",
                currencyCode: "eur",
                countries: countries.filter(c => c !== 'cz'),
                paymentProviders: undefined
            },
        ],
        taxRegions: {
            countries,
            taxProviderId: undefined,
        },
        stockLocations: {
            locations: [
                {
                    name: 'European Warehouse',
                    address: {
                        city: 'Copenhagen',
                        country_code: 'DK',
                        address_1: '',
                    },
                },
            ],
        },
        fulfillmentProviderId: undefined,
        defaultShippingProfile: {
            name: 'Default Shipping Profile',
        },
        fulfillmentSets: {
            name: "European Warehouse delivery",
            type: "shipping",
            serviceZones: [
                {
                    name: "Europe",
                    geoZones: countries.map(c => ({
                        countryCode: c
                    }))
                },
            ],
        },
        shippingOptions: [
            {
                name: 'Standard Shipping',
                type: {
                    label: "Standard",
                    description: "Ship in 2-3 days.",
                    code: "standard",
                },
                prices: [
                    {
                        currencyCode: "usd",
                        amount: 10,
                    },
                    {
                        currencyCode: "eur",
                        amount: 10,
                    },
                    {
                        currencyCode: "czk",
                        amount: 250,
                    },
                ],
                rules: [
                    {
                        attribute: "enabled_in_store",
                        value: "true",
                        operator: "eq",
                    },
                    {
                        attribute: "is_return",
                        value: "false",
                        operator: "eq",
                    },
                ],
            },
            {
                name: 'Express Shipping',
                type: {
                    label: "Express",
                    description: "Ship in 24 hours.",
                    code: "express",
                },
                prices: [
                    {
                        currencyCode: "usd",
                        amount: 10,
                    },
                    {
                        currencyCode: "eur",
                        amount: 10,
                    },
                    {
                        currencyCode: "czk",
                        amount: 250,
                    },
                ],
                rules: [
                    {
                        attribute: "enabled_in_store",
                        value: "true",
                        operator: "eq",
                    },
                    {
                        attribute: "is_return",
                        value: "false",
                        operator: "eq",
                    },
                ],
            }
        ],
        publishableKey: {
            title: 'Webshop'
        },
    }

    const dbService: DatabaseModuleService = req.scope.resolve(DATABASE_MODULE)
    const resultCategories = await dbService.sqlRaw<any>(
        sql`select cl.title,
                               cl.description,
                               cl.rewrite_title       as handle,
                               c.visible              as isActive,
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

    const productSql = sql`
            WITH cte_products_base AS (
                SELECT
                    p.*,
                    ROW_NUMBER() over (PARTITION BY IF(p.EAN = '', p.id, p.EAN) ORDER BY p.id) AS ean_duplicate_number
                FROM product p
                WHERE p.deleted = 0
), cte_products_baseline AS (
                SELECT
                    p.*
                FROM cte_products_base p
                WHERE p.ean_duplicate_number = 1
), cte_products AS (
    SELECT
        p.*
    FROM cte_products_baseline p
    JOIN product_lang pl
  ON pl.id_product = p.id
  AND pl.id_lang = (SELECT id FROM lang WHERE abbreviation = 'cz' LIMIT 1)
  AND trim(pl.rewrite_title) <> ''

    WHERE p.base_product = 1
  AND p.deleted = 0
  AND p.id_product_group IS NOT NULL
  AND p.id_product_group NOT IN (
    SELECT id_product_group
    FROM product
    WHERE id_product_group IN (
      SELECT id_product_group
      FROM product
      WHERE base_product = 1
        AND deleted = 0
        AND id_product_group IS NOT NULL
      GROUP BY id_product_group
      HAVING COUNT(*) > 1
    )
    AND deleted = 0
  )
 AND trim(pl.title) <> ''
            ), cte_product_with_variant_nums AS (
                SELECT
                    p.*,
                    ROW_NUMBER() over (PARTITION BY p.id_product_group, p.variant_name ORDER BY p.id) AS variant_num
                FROM product p
                WHERE p.deleted = 0
                  AND id_product_group IS NOT NULL
            ), cte_product_with_unique_variant_name AS (
                SELECT
                    *,
                    CONCAT(TRIM(variant_name), IF(variant_num = 1, '', CONCAT('_',variant_num))) as variant_name_unique
                FROM cte_product_with_variant_nums
                WHERE base_product = 0
                  AND variant_name IS NOT NULL
                  AND TRIM(variant_name) <> ''
            ), cte_variant_option_agg AS (
                SELECT
                    id_product_group,
                    JSON_ARRAYAGG(DISTINCT variant_name_unique) AS option_values
                FROM cte_product_with_unique_variant_name
                GROUP BY id_product_group
            ), cte_category_product AS (
                select p.id, cl.rewrite_title from product p
                                                       join category_product cp on p.id = cp.id_product
                                                       join category_lang cl on cl.id_category = cp.id_category and cl.id_lang in (select id from lang where abbreviation = 'cz')
            ), cte_category_product_unique AS (
                select
                    vc.id,
                    JSON_ARRAYAGG(
                            JSON_OBJECT(
                                    'handle', vc.rewrite_title
                            )
                    ) AS categories
                from cte_category_product as vc
                group by vc.id
), cte_product_attributes_base AS (
select p.id,
       pl.rewrite_title as handle,
       ppl.title as attribute,
       ppvl.title as value
from cte_products_base p
    join product_lang pl on p.id = pl.id_product and pl.id_lang in (select id from lang where abbreviation = 'cz')
    left join product_product_parameter ppp ON ppp.id_product = p.id
    left join product_parameter_lang ppl on ppl.id_product_parameter = ppp.id_product_parameter and ppl.id_lang in (select id from lang where abbreviation = 'cz')
    left join product_parameter_value ppv on ppv.id = ppp.id_product_parameter_value
    left join product_parameter_value_lang ppvl on ppvl.id_product_parameter_value = ppv.id and ppvl.id_lang in (select id from lang where abbreviation = 'cz')
where pl.rewrite_title not like ''
), cte_product_material AS (
    select
        *
    from cte_product_attributes_base cpa
    where attribute = 'Materiál'
), cte_product_attributes AS (
    select
        cpab.id,
    JSON_ARRAYAGG(
        JSON_OBJECT(
          'name', cpab.attribute,
          'value', cpab.value
        )
    ) as attributes
    from cte_product_attributes_base AS cpab
    where cpab.attribute not in ('Materiál')
    group by id
            ), cte_product_prices AS (
                SELECT
                    p.id as productId,
                    price.value AS value,
                COALESCE(price.nodiscount_value, price.value) AS nodiscount_value,
                price.value AS normal_value,
                vat.rate AS vat_rate,
                price_type.id AS id_price_type,
                price_type.id_primary_price,
                price_type.discount_type,
                price_type.system,
                price_type.default_discount,
                price.valid_from_quantity,
                LOWER(c.code) as currency_code,
                price_type_lang.title AS price_type_title
            FROM price_type
        LEFT JOIN price ON price.id_price_type = price_type.id AND price.id_domain = (select id from domain where id = 1) AND price.id_currency in (select id from currency where code in ('czk','eur'))
                LEFT JOIN currency c ON c.id = price.id_currency
                LEFT JOIN product p on p.id = price.id_product
                LEFT JOIN vat ON price.id_vat = vat.id
                LEFT JOIN price_type_lang ON price_type.id = price_type_lang.id_price_type AND price_type_lang.id_lang in (select id from lang where abbreviation = 'cz')
            WHERE price_type_lang.title = 'MOC'
              and p.deleted = 0
            ORDER BY valid_from_quantity DESC, vat.rate DESC, price.value ASC
                ), cte_product_prices_agg AS (
            select
                cpp.productId,
                JSON_ARRAYAGG(
                JSON_OBJECT(
                'currency_code', cpp.currency_code,
                'amount', cpp.value
                )
                ) AS prices
            from cte_product_prices cpp
            group by cpp.productId
                ), cte_product_stores as (
            select
                psq.id_product as productId,
                SUM(psq.quantity) as quantity,
                SUM(psq.supplier_quantity) as supplier_quantity
            from product_store_quantity psq
                join product pwvn on pwvn.id = psq.id_product
            where pwvn.deleted = 0
            GROUP BY psq.id_product
                ), cte_product_images as (
            select
                p.id_product_group,
                ROW_NUMBER() over (PARTITION BY i.id_product) as image_num,
                i.*
            from image i
                join product p on p.id = i.id_product
            where p.deleted = 0
                ), cte_product_images_grouped AS (
            select
                cpi.id_product_group,
                JSON_ARRAYAGG(
                JSON_OBJECT(
                'url', CONCAT('https://pub-adde8a563e2c43f7b6bc296d81c86358.r2.dev/1024_1024/',cpi.url)
                )
                ) AS images
            from cte_product_images cpi
            group by cpi.id_product_group
), cte_variants AS (
    select
        bp.id,
    JSON_OBJECT(
      'title', COALESCE(TRIM(v.variant_name_unique), pl.title),
      'sku', COALESCE(v_pl.rewrite_title, CONCAT(pl.rewrite_title,IF(v.id IS NULL, '', v.id))),
      'material', COALESCE(cpmv.value, cpmbp.value),
      'options', JSON_OBJECT('Variant', TRIM(v.variant_name_unique)),
      'prices', COALESCE(cpp.prices, cpbp.prices),
      'metadata', JSON_OBJECT(
              'images', JSON_ARRAYAGG(JSON_OBJECT('url',CONCAT('https://pub-adde8a563e2c43f7b6bc296d81c86358.r2.dev/1024_1024/',cbppiv.url))),
              'thumbnail', CONCAT('https://pub-adde8a563e2c43f7b6bc296d81c86358.r2.dev/1024_1024/',cbppivt.url),
              'attributes', COALESCE(cpav.attributes, cpabp.attributes),
              'user_code', COALESCE(v.user_code, bp.user_code)
          ),
    'quantities', JSON_OBJECT(
              'quantity', TRIM(COALESCE(vcps.quantity, bpcps.quantity)),
              'supplier_quantity', TRIM(COALESCE(vcps.supplier_quantity, bpcps.supplier_quantity))
          )
    ) AS variants
    from cte_products bp

LEFT JOIN cte_product_with_unique_variant_name v
  ON v.id_product_group = bp.id_product_group
  AND v.base_product = 0
  AND v.deleted = 0
    LEFT JOIN cte_product_attributes cpav on v.id = cpav.id
    LEFT JOIN cte_product_attributes cpabp on bp.id = cpabp.id
    LEFT JOIN cte_product_material cpmv on v.id = cpmv.id
    LEFT JOIN cte_product_material cpmbp on bp.id = cpmbp.id

LEFT JOIN cte_product_stores vcps ON vcps.productId = v.id
LEFT JOIN cte_product_stores bpcps ON bpcps.productId = bp.id
JOIN product_lang pl
  ON pl.id_product = bp.id
  AND pl.id_lang = (SELECT id FROM lang WHERE abbreviation = 'cz' LIMIT 1)
  AND trim(pl.rewrite_title) <> ''
LEFT JOIN product_lang v_pl
  ON v_pl.id_product = v.id
  AND v_pl.id_lang = pl.id_lang AND trim(v_pl.rewrite_title) <> ''
LEFT JOIN cte_product_prices_agg cpbp ON cpbp.productId = bp.id
LEFT JOIN cte_product_prices_agg cpp ON cpp.productId = v.id
LEFT JOIN cte_product_images cbppiv ON cbppiv.id_product = v.id
LEFT JOIN cte_product_images cbppivt ON cbppivt.id_product = v.id AND cbppivt.image_num = 1
GROUP BY bp.id, pl.title, pl.rewrite_title, pl.description,COALESCE(v_pl.rewrite_title, CONCAT(pl.rewrite_title,v.id))
), cte_variants_grouped AS (
    SELECT
        cv.id,
        JSON_ARRAYAGG(cv.variants) as variants
    FROM cte_variants cv
    GROUP by cv.id
                ), cte_result AS (

            SELECT
                bp.id AS productId,
                bp.id_product_group,
                pl.title,
                pl.rewrite_title AS handle,
                pl.description,
                CONCAT('https://pub-adde8a563e2c43f7b6bc296d81c86358.r2.dev/1024_1024/',cbppi.url) AS thumbnail,
                cpig.images AS images,
                cv.variants,
                JSON_ARRAY(
                JSON_OBJECT(
                'title', 'Variant',
                'option_values', voa.option_values
                )
                ) AS options,
                vc.categories
            FROM cte_products bp
                JOIN product_lang pl
            ON pl.id_product = bp.id
                AND pl.id_lang = (SELECT id FROM lang WHERE abbreviation = 'cz' LIMIT 1)
  AND trim(pl.rewrite_title) <> ''
                LEFT JOIN cte_product_with_unique_variant_name v
                ON v.id_product_group = bp.id_product_group
                AND v.base_product = 0
                AND v.deleted = 0
                LEFT JOIN cte_variant_option_agg voa
                ON voa.id_product_group = bp.id_product_group
                LEFT JOIN cte_category_product_unique vc ON vc.id = bp.id
                LEFT JOIN cte_product_images_grouped cpig ON cpig.id_product_group = bp.id_product_group
                LEFT JOIN cte_product_images cbppi ON cbppi.id_product = bp.id AND cbppi.image_num = 1
                LEFT JOIN cte_variants_grouped cv ON cv.id = bp.id
            GROUP BY bp.id, pl.title, pl.rewrite_title, pl.description, voa.option_values
                )
        `

    const resultProducts = await dbService.sqlRaw<any>(
        sql`
            ${productSql}
            select *
            from cte_result
        `
    )

    const {result} = await seedN1Workflow(req.scope)
        .run({
            input: {...input, categories: resultCategories, products: resultProducts}
        })

    res.send(result)
}