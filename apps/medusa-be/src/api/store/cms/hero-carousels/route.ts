import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import { z } from "zod"
import { PAYLOAD_MODULE } from "../../../../modules/payload"
import type PayloadModuleService from "../../../../modules/payload/service"
import { getQueryParam } from "../../../../utils/query"

export const StoreCmsHeroCarouselsSchema = createFindParams().extend({
  locale: z.string().optional(),
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

  const heroCarousels = await cmsService.listHeroCarousels({
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    page: req.query.page ? Number(req.query.page) : undefined,
    sort: req.query.sort ? String(req.query.sort) : undefined,
    locale,
  })

  return res.json({ heroCarousels })
}
