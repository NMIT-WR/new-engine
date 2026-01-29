import { createHmac, timingSafeEqual } from "node:crypto"
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

/**
 * Validates a webhook signature using constant-time comparison.
 *
 * Note: This function compares two signature strings directly. The caller is
 * responsible for computing the expected signature (e.g., HMAC(payload, secret))
 * before calling this function.
 *
 * @param signature - The signature received in the webhook request header
 * @param expectedSignature - The signature computed from the payload and shared secret
 * @returns true if the signatures match, false otherwise
 */
export function isValidWebhookSignature(
  signature: string | undefined,
  expectedSignature: string | undefined
): boolean {
  if (!expectedSignature || !signature) {
    return false
  }
  // Hash both values to normalize length and prevent length-based timing leaks
  const hashSignature = createHmac("sha256", "key").update(signature).digest()
  const hashExpected = createHmac("sha256", "key")
    .update(expectedSignature)
    .digest()
  return timingSafeEqual(hashSignature, hashExpected)
}
