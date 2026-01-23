import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

const isIframeEnabled = (value: string | undefined) => {
  if (!value) {
    return true
  }
  return !["0", "false", "no"].includes(value.toLowerCase())
}

export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  const iframeUrl = process.env.PAYLOAD_IFRAME_URL
  const iframeEnabled = isIframeEnabled(process.env.IS_IFRAME_PAYLOAD)

  res.setHeader("Cache-Control", "no-store")
  return res.json({ iframeUrl, isIframeEnabled: iframeEnabled })
}
