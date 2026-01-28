import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
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
  const logger = req.scope.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
  const body = req.body as PayloadWebhookBody

  if (!body?.collection) {
    return res.status(400).json({ error: "Missing collection" })
  }

  try {
    await cmsService.invalidateCache(
      body.collection,
      body.doc?.slug,
      body.doc?.locale
    )
  } catch (error) {
    logger.error(
      `CMS cache invalidation failed (collection="${body.collection}", slug="${body.doc?.slug ?? "n/a"}", locale="${body.doc?.locale ?? "n/a"}")`,
      error instanceof Error ? error : new Error(String(error))
    )
    return res.status(500).json({
      error: "Failed to invalidate cache",
      collection: body.collection,
      slug: body.doc?.slug ?? null,
      locale: body.doc?.locale ?? null,
    })
  }

  return res.status(200).json({ success: true })
}
