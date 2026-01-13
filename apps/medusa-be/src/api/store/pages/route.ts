import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PAYLOAD_MODULE } from "../../../modules/payload"
import type PayloadModuleService from "../../../modules/payload/service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const payloadService =
    req.scope.resolve<PayloadModuleService>(PAYLOAD_MODULE)

  const result = await payloadService.find("pages", {
    depth: req.query.depth ? Number(req.query.depth) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    page: req.query.page ? Number(req.query.page) : undefined,
  })

  return res.json(result)
}
