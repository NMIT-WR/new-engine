import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import { z } from "zod"
import { PAYLOAD_MODULE } from "../../../../modules/payload"
import type PayloadModuleService from "../../../../modules/payload/service"
import { getQueryParam } from "../../../../utils/query"

export const StoreCmsPagesSchema = createFindParams().extend({
  locale: z.string().optional(),
})

export type StoreCmsPagesSchemaType = z.infer<typeof StoreCmsPagesSchema>

export async function GET(
  req: MedusaRequest<unknown, StoreCmsPagesSchemaType>,
  res: MedusaResponse
) {
  const cmsService = req.scope.resolve<PayloadModuleService>(PAYLOAD_MODULE)

  const locale = getQueryParam(req, "locale")

  const pages = await cmsService.listPublishedPages({
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    page: req.query.page ? Number(req.query.page) : undefined,
    sort: req.query.sort ? String(req.query.sort) : undefined,
    locale,
  })

  return res.json({ pages })
}
