import { timingSafeEqual } from "node:crypto"
import type { MedusaRequest } from "@medusajs/framework/http"

export function getHeaderValue(
  req: MedusaRequest,
  name: string
): string | undefined {
  const value = req.headers[name]
  if (Array.isArray(value)) {
    return value[0]
  }
  return value
}

export function isValidWebhookSignature(
  signature: string | undefined,
  secret: string | undefined
): boolean {
  if (!secret || !signature) {
    return false
  }
  const signatureBuffer = Buffer.from(signature)
  const secretBuffer = Buffer.from(secret)
  if (signatureBuffer.length !== secretBuffer.length) {
    return false
  }
  return timingSafeEqual(signatureBuffer, secretBuffer)
}
