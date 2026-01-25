import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { PAYLOAD_MODULE } from "../../../../modules/payload"
import type PayloadModuleService from "../../../../modules/payload/service"
import { getQueryParam } from "../../../../utils/query"
import { optionalPositiveIntParam, optionalStringParam } from "../../../../utils/queryParams"

export const StoreCmsHeroCarouselsSchema = z.object({
  locale: optionalStringParam,
  limit: optionalPositiveIntParam,
  page: optionalPositiveIntParam,
  sort: optionalStringParam,
})

export type StoreCmsHeroCarouselsSchemaType = z.infer<
  typeof StoreCmsHeroCarouselsSchema
>

export async function GET(
  req: MedusaRequest<unknown, StoreCmsHeroCarouselsSchemaType>,
  res: MedusaResponse
) {
  const cmsService = req.scope.resolve<PayloadModuleService>(PAYLOAD_MODULE)

  const locale = getQueryParam(req, "locale")
  const limitParam = getQueryParam(req, "limit")
  const pageParam = getQueryParam(req, "page")
  const sort = getQueryParam(req, "sort")
  const limit = limitParam ? Number(limitParam) : undefined
  const page = pageParam ? Number(pageParam) : undefined

  const heroCarousels = await cmsService.listHeroCarousels({
    limit,
    page,
    sort,
    locale,
  })

  return res.json({ heroCarousels })
}
