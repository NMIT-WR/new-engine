import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { PAYLOAD_MODULE } from "../../../../../modules/payload"
import type PayloadModuleService from "../../../../../modules/payload/service"
import { getQueryParam } from "../../../../../utils/query"
import { optionalStringParam } from "../../../../../utils/queryParams"

export const StoreCmsArticleSchema = z.object({
  locale: optionalStringParam,
})

export type StoreCmsArticleSchemaType = z.infer<typeof StoreCmsArticleSchema>

export async function GET(
  req: MedusaRequest<unknown, StoreCmsArticleSchemaType>,
  res: MedusaResponse
) {
  const { slug } = req.params
  if (!slug) {
    return res.status(400).json({ message: "Missing slug" })
  }
  const cmsService = req.scope.resolve<PayloadModuleService>(PAYLOAD_MODULE)

  const locale = getQueryParam(req, "locale")
  const article = await cmsService.getPublishedArticle(
    slug,
    locale
  )

  if (!article) {
    return res.status(404).json({ message: "Article not found" })
  }

  return res.json({ article })
}
