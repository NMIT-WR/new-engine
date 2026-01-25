import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { PAYLOAD_MODULE } from "../../../../../modules/payload"
import type PayloadModuleService from "../../../../../modules/payload/service"
import { getQueryParam } from "../../../../../utils/query"
import { optionalStringParam } from "../../../../../utils/queryParams"

export const StoreCmsPageSchema = z.object({
  locale: optionalStringParam,
})

export type StoreCmsPageSchemaType = z.infer<typeof StoreCmsPageSchema>

export async function GET(
  req: MedusaRequest<unknown, StoreCmsPageSchemaType>,
  res: MedusaResponse
) {
  const { slug } = req.params
  if (!slug) {
    return res.status(400).json({ message: "Missing slug" })
  }
  const cmsService = req.scope.resolve<PayloadModuleService>(PAYLOAD_MODULE)

  const locale = getQueryParam(req, "locale")
  const page = await cmsService.getPublishedPage(
    slug,
    locale
  )

  if (!page) {
    return res.status(404).json({ message: "Page not found" })
  }

  return res.json({ page })
}
