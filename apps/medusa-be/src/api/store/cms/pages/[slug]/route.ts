import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PAYLOAD_MODULE } from "../../../../../modules/payload"
import type PayloadModuleService from "../../../../../modules/payload/service"
import { getQueryParam } from "../../../../../utils/query"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { slug } = req.params
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
