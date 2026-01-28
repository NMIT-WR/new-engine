import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PAYLOAD_MODULE } from "../../../../modules/payload"
import type PayloadModuleService from "../../../../modules/payload/service"

/** Expected webhook payload from Payload CMS invalidation hook. */
type PayloadWebhookBody = {
  collection?: string
  doc?: { id?: string; slug?: string; locale?: string }
}

/** Hook endpoint to invalidate cached CMS content in Medusa. */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const cmsService = req.scope.resolve<PayloadModuleService>(PAYLOAD_MODULE)
  const body = req.body as PayloadWebhookBody

  if (!body?.collection) {
    return res.status(400).json({ error: "Missing collection" })
  }

  await cmsService.invalidateCache(
    body.collection,
    body.doc?.slug,
    body.doc?.locale
  )

  return res.status(200).json({ success: true })
}
