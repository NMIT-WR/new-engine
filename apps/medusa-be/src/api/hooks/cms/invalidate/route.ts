import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { Logger } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { PAYLOAD_MODULE } from "../../../../modules/payload"
import type PayloadModuleService from "../../../../modules/payload/service"

type PayloadWebhookBody = {
  collection?: string
  doc?: { id?: string; slug?: string; locale?: string }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
  const cmsService = req.scope.resolve<PayloadModuleService>(PAYLOAD_MODULE)
  const body = req.body as PayloadWebhookBody

  logger.info(`CMS invalidate endpoint payload: ${JSON.stringify(body)}`)

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
