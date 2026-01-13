import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PAYLOAD_MODULE } from "../../../../modules/payload"
import type PayloadModuleService from "../../../../modules/payload/service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { slug } = req.params
  const payloadService =
    req.scope.resolve<PayloadModuleService>(PAYLOAD_MODULE)

  const page = await payloadService.findBySlug("pages", slug, {
    depth: req.query.depth ? Number(req.query.depth) : undefined,
  })

  if (!page) {
    return res.status(404).json({ error: "Page not found" })
  }

  return res.json(page)
}
