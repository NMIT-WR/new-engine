import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PAYLOAD_MODULE } from "../../../../../modules/payload"
import type PayloadModuleService from "../../../../../modules/payload/service"
import { getQueryParam } from "../../../../../utils/query"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { slug } = req.params
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
