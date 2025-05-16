import Medusa from "@medusajs/js-sdk"

const getBaseUrl = () => {
  if (typeof window === "undefined") {
    return process.env.MEDUSA_BACKEND_URL || "http://medusa-be:9000"
  }

  return process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
}
export const sdk = new Medusa({
  baseUrl: getBaseUrl(),
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
