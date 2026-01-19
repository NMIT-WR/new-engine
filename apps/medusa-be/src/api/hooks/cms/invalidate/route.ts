import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PAYLOAD_MODULE } from "../../../../modules/payload"
import type PayloadModuleService from "../../../../modules/payload/service"

type PayloadWebhookBody = {
  collection?: string
  operation?: string
  doc?: { id?: string; slug?: string }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const cmsService = req.scope.resolve<PayloadModuleService>(PAYLOAD_MODULE)
  const body = req.body as PayloadWebhookBody

  if (!body?.collection) {
    return res.status(400).json({ error: "Missing collection" })
  }

  await cmsService.invalidateCache(body.collection, body.doc?.slug)

  return res.status(200).json({ success: true })
}
