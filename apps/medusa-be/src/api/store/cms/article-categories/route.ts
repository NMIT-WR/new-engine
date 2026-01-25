import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { PAYLOAD_MODULE } from "../../../../modules/payload"
import type PayloadModuleService from "../../../../modules/payload/service"
import { getQueryParam } from "../../../../utils/query"
import { optionalStringParam } from "../../../../utils/queryParams"

export const StoreCmsArticleCategoriesSchema = z.object({
  locale: optionalStringParam,
  categorySlug: optionalStringParam,
})

export type StoreCmsArticleCategoriesSchemaType = z.infer<
  typeof StoreCmsArticleCategoriesSchema
>

export async function GET(
  req: MedusaRequest<unknown, StoreCmsArticleCategoriesSchemaType>,
  res: MedusaResponse
) {
  const cmsService = req.scope.resolve<PayloadModuleService>(PAYLOAD_MODULE)

  const locale = getQueryParam(req, "locale")
  const categorySlug = getQueryParam(req, "categorySlug")

  const articleCategories = await cmsService.listArticleCategoriesWithArticles({
    locale,
    categorySlug,
  })

  return res.json({ articleCategories })
}
